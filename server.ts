import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini client setup
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory sync state for multi-user / Aldris room broadcast
interface RoomEvent {
  id: string;
  sender: string;
  type: 'zar' | 'muhur' | 'sahne' | 'anlati' | 'fisilti' | 'durum';
  payload: any;
  timestamp: string;
  target?: string;
}

const eventLog: RoomEvent[] = [];

// Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API anahtarı yapılandırılmamış.',
        text: 'Kadim arşiv fısıltıları şu an duyulamıyor (GEMINI_API_KEY eksik). Yine de yerel kural motoru ve hazır tablolarla devam edebilirsiniz.'
      });
    }

    const { messages, userPrompt, characterContext, systemRole } = req.body;

    const systemInstruction = `Sen Stallhart karanlık fantezi evreninin kadim arşivi, baş katibi ve Anlatıcı (Aldris) yardımcısısın.
Evren Özellikleri:
- Atmosfer: Eskitilmiş parşömen, mühür balmumu, demir, kül, kan, gotik entrika.
- Sistem: Fate tabanlı 4dF (-1, 0, +1), Nitelikler (STR, DEX, CON, INT, WIS, CHA), Beceriler (Fight, Shoot, Stealth, Investigate, Lore, Provoke/Manipulate), Luck (0-3).
- Sayaçlar: Yorgunluk (0-4), Leke (0-9: 6+'da büyü yozlaşması), Şüphe (0-10: 5+'da engizisyon/takip), Mühür (Fate puanı).
- Para: Aron.
- Haneler: Stallhart (dama/taç), Selya (güneş/bordo), Arhan (kadeh/yıldız), Galetsha (anahtar), Onneva (anka/kül), Solgar (yusufçuk), Memanth (kale), Z'ela (yılan), Seltanya (koç), Khasinya (kemik/buz), Adamen (dağ/yakut), Mabed (terazi/zırhlı el).
- Dil tonu: Türkçe, gizemli, karanlık fanteziye uygun, saygılı, atmosferik, net kural ve hikaye önerileri sunan üslup.
${characterContext ? `Aktif Karakter Bilgisi: ${JSON.stringify(characterContext)}` : ''}
${systemRole ? `Özel Rol: ${systemRole}` : ''}`;

    // Format contents for Gemini
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }

    if (userPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Selamlar Kadim Arşivci.' }] }],
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({
      text: response.text || 'Arşiv sessiz kaldı...',
    });
  } catch (err: any) {
    console.error('Gemini Chat Hatası:', err);
    res.status(500).json({
      error: err?.message || 'Bir hata oluştu.',
      text: 'Kadim arşivde sayfalar birbirine yapıştı. Lütfen tekrar deneyin.'
    });
  }
});

// Gemini Multimodal Image Analysis Endpoint
app.post('/api/gemini/analyze-image', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API anahtarı bulunamadı.',
      });
    }

    const { imageBase64, mimeType = 'image/jpeg', prompt } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Görsel verisi sağlanmadı.' });
    }

    // Clean base64 header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: prompt || 'Bu görseli Stallhart karanlık fantezi evreni bağlamında ayrıntılı analiz et. Eğer bir karakter portresi ise onun olası Hanesini, Mesleğini, taşıdığı yara izlerini ve hikaye ipuçlarını çıkar. Eğer harita veya sahne ise taktik tehlikeleri ve gizemleri açıkla.',
    };

    const systemInstruction = `Sen Stallhart evreninin Gözlemci Baş Bilge ve Adli Arşivcisisin. Görselleri derinlemesine inceleyip karanlık fantezi bağlamında detaylı, Türkçe ve edebi bir dille yorumlarsın.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      analysis: response.text || 'Görsel tahlil edilemedi.',
    });
  } catch (err: any) {
    console.error('Gemini Görsel Analiz Hatası:', err);
    res.status(500).json({
      error: err?.message || 'Görsel analizi sırasında hata meydana geldi.'
    });
  }
});

// Event broadcast / sync endpoints
app.get('/api/sync/events', (req, res) => {
  const since = Number(req.query.since || 0);
  const filtered = eventLog.slice(since);
  res.json({ events: filtered, total: eventLog.length });
});

app.post('/api/sync/broadcast', (req, res) => {
  const { sender, type, payload, target } = req.body;
  const event: RoomEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sender: sender || 'Bilinmeyen',
    type: type || 'zar',
    payload,
    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    target
  };

  eventLog.push(event);
  if (eventLog.length > 200) {
    eventLog.shift(); // retain last 200 events
  }
  res.json({ success: true, event });
});

// Start dev or prod server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Stallhart RPG] Sunucu port ${PORT} üzerinde uyanıyor...`);
  });
}

startServer();
