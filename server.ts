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
  type: 'zar' | 'muhur' | 'sahne' | 'anlati' | 'fisilti' | 'durum' | 'hasar' | 'chat';
  payload: any;
  timestamp: string;
  target?: string;
}

interface ConnectedPlayer {
  id: string;
  name: string;
  role: 'Anlatıcı' | 'Oyuncu';
  characterId?: string;
  characterName?: string;
  characterHouse?: string;
  lastSeen: number;
}

interface RoomData {
  id: string;
  title: string;
  created: number;
  activeScene?: string;
  activeAspects?: string[];
  players: Record<string, ConnectedPlayer>;
  events: RoomEvent[];
}

const rooms = new Map<string, RoomData>();

// Helper to generate a clean 6-character room code (e.g. "ARAV26")
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Cleanup inactive players every 60s
setInterval(() => {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    for (const [pId, player] of Object.entries(room.players)) {
      if (now - player.lastSeen > 120000) { // 2 mins timeout
        delete room.players[pId];
      }
    }
    // Delete room if empty for more than 1 hour
    if (Object.keys(room.players).length === 0 && now - room.created > 3600000) {
      rooms.delete(roomId);
    }
  }
}, 60000);

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

// ==========================================
// MULTIPLAYER ROOM API (Online Arkadaşlar Lobi & Zar)
// ==========================================

// 1. Yeni Oda Oluştur (GM)
app.post('/api/rooms/create', (req, res) => {
  const { title, hostName, characterId, characterName, characterHouse } = req.body;
  const roomId = generateRoomCode();
  const hostId = `host_${Date.now().toString(36)}`;

  const hostPlayer: ConnectedPlayer = {
    id: hostId,
    name: hostName || 'Anlatıcı (Aldris)',
    role: 'Anlatıcı',
    characterId,
    characterName,
    characterHouse,
    lastSeen: Date.now()
  };

  const newRoom: RoomData = {
    id: roomId,
    title: title || `Stallhart Seferi #${roomId}`,
    created: Date.now(),
    activeAspects: ['Arava Sarayı: Taç Divanı', 'Gergince Bekleyen Muhafızlar'],
    players: {
      [hostId]: hostPlayer
    },
    events: [
      {
        id: `ev_welcome_${Date.now()}`,
        sender: 'Sistem',
        type: 'anlati',
        payload: { text: `Divan salonu açıldı. Oda Kodu: ${roomId}` },
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };

  rooms.set(roomId, newRoom);
  res.json({ success: true, roomId, hostId, room: newRoom });
});

// 2. Odaya Katıl (Oyuncu veya GM)
app.post('/api/rooms/join', (req, res) => {
  const { roomId, playerName, role, characterId, characterName, characterHouse } = req.body;
  const upperCode = (roomId || '').trim().toUpperCase();
  const room = rooms.get(upperCode);

  if (!room) {
    return res.status(404).json({ error: 'Bu kod ile bir divan odası bulunamadı.' });
  }

  const playerId = `pl_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`;
  const player: ConnectedPlayer = {
    id: playerId,
    name: playerName || 'Seyyah',
    role: role === 'Anlatıcı' ? 'Anlatıcı' : 'Oyuncu',
    characterId,
    characterName,
    characterHouse,
    lastSeen: Date.now()
  };

  room.players[playerId] = player;

  // Broadcast join event
  const joinEvent: RoomEvent = {
    id: `ev_join_${Date.now()}`,
    sender: player.name,
    type: 'anlati',
    payload: { text: `${player.name} (${player.characterName || 'Karaktersiz'}) masaya katıldı.` },
    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  };
  room.events.push(joinEvent);

  res.json({ success: true, roomId: upperCode, playerId, room });
});

// 3. Oda Durumunu Çek (Polling & State Sync)
app.get('/api/rooms/:roomId', (req, res) => {
  const upperCode = req.params.roomId.trim().toUpperCase();
  const room = rooms.get(upperCode);

  if (!room) {
    return res.status(404).json({ error: 'Oda bulunamadı.' });
  }

  const since = Number(req.query.since || 0);
  const events = room.events.slice(since);

  res.json({
    id: room.id,
    title: room.title,
    activeScene: room.activeScene,
    activeAspects: room.activeAspects || [],
    players: Object.values(room.players),
    events,
    totalEvents: room.events.length
  });
});

// 4. Kalp Atışı (Presence Heartbeat)
app.post('/api/rooms/:roomId/heartbeat', (req, res) => {
  const upperCode = req.params.roomId.trim().toUpperCase();
  const room = rooms.get(upperCode);
  const { playerId, characterId, characterName } = req.body;

  if (room && playerId && room.players[playerId]) {
    room.players[playerId].lastSeen = Date.now();
    if (characterId) room.players[playerId].characterId = characterId;
    if (characterName) room.players[playerId].characterName = characterName;
    return res.json({ success: true });
  }
  res.json({ success: false });
});

// 5. Odaya Canlı Olay / Zar / Fısıltı Gönder
app.post('/api/rooms/:roomId/events', (req, res) => {
  const upperCode = req.params.roomId.trim().toUpperCase();
  const room = rooms.get(upperCode);

  if (!room) {
    return res.status(404).json({ error: 'Oda bulunamadı.' });
  }

  const { sender, type, payload, target } = req.body;
  const event: RoomEvent = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    sender: sender || 'Bilinmeyen',
    type: type || 'zar',
    payload,
    timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    target
  };

  room.events.push(event);
  if (room.events.length > 200) {
    room.events.shift();
  }

  res.json({ success: true, event });
});

// 6. Ortam Durumlarını (Aspects) Güncelle
app.post('/api/rooms/:roomId/aspects', (req, res) => {
  const upperCode = req.params.roomId.trim().toUpperCase();
  const room = rooms.get(upperCode);
  if (!room) return res.status(404).json({ error: 'Oda bulunamadı.' });

  const { aspects } = req.body;
  if (Array.isArray(aspects)) {
    room.activeAspects = aspects;
  }
  res.json({ success: true, activeAspects: room.activeAspects });
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
