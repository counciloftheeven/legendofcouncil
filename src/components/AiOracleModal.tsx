import React, { useState, useRef, useEffect } from 'react';
import { Karakter } from '../rules';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Send,
  Upload,
  Camera,
  Bot,
  User,
  RefreshCw,
  HelpCircle,
  Dices,
  BookOpen,
  Flame,
  Shield,
  FileImage,
  Scroll
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiOracleModalProps {
  aktifKarakter: Karakter;
  rol: 'Anlatıcı' | 'Oyuncu';
}

export const AiOracleModal: React.FC<AiOracleModalProps> = ({
  aktifKarakter,
  rol,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        `Selamlar, ${aktifKarakter.ad}. Ben Stallhart Arşivinin Kadim Kâhini ve Aldris Danışmanıyım. Evrenin kuralları, Hanedan entrikaları, 4dF zar yorumları veya yaratacağın sahneler hakkında bana danışabilirsin.`,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [seciliRol, setSeciliRol] = useState<string>('Aldris (GM Danışmanı)');

  // Multimodal Image Analysis State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageAnalysisResult, setImageAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send Chat Message to Gemini Endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputMessage;
    if (!prompt.trim() || isTyping) return;

    sound.playSealStamp();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: prompt.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userPrompt: prompt.trim(),
          characterContext: {
            ad: aktifKarakter.ad,
            hane: aktifKarakter.hane,
            meslek: aktifKarakter.meslek,
            leke: aktifKarakter.sayaclar.leke,
            supheli: aktifKarakter.sayaclar.supheli,
            anaKavram: aktifKarakter.gorunumler.anaKavram,
            dert: aktifKarakter.gorunumler.dert,
          },
          systemRole: seciliRol,
        }),
      });

      const data = await res.json();
      const botReply: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.text || 'Arşiv parşömenleri sessizliğe gömüldü...',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch {
      const errorReply: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: 'Kadim fısıltılar duyulamıyor. Lütfen tekrar sorunuz.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  // Multimodal Image Analysis
  const handleAnalyzeImage = async () => {
    if (!uploadedImage || isAnalyzingImage) return;

    setIsAnalyzingImage(true);
    setImageAnalysisResult(null);
    sound.playSealStamp();

    try {
      const res = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          prompt:
            imagePrompt.trim() ||
            'Bu görseli Stallhart karanlık fantezi evreni bağlamında detaylı analiz et. Eğer karakter portresi ise Hanedanını ve sırrını, harita ise tehlikeli pusu noktalarını ve gizemlerini, nesne ise kadim rün kökenini Türkçe anlat.',
        }),
      });

      const data = await res.json();
      setImageAnalysisResult(data.analysis || 'Görsel çözümlenemedi.');
    } catch {
      setImageAnalysisResult('Görsel tahlili sırasında bağlantı koptu.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setImageAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="parchment-sheet p-5 rounded-xl border border-[#523e2c] shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h1 className="font-heading font-black text-2xl text-[#f3ece0]">
              Aldris Kâhini &amp; Görsel Arşiv Müfettişi
            </h1>
          </div>
          <p className="text-xs text-[#a99c8b]">
            Gemini destekli çok turlu oyun asistanı ve karanlık fantezi görsel çözümleyicisi.
          </p>
        </div>

        {/* Tab Switcher: Chat vs Image */}
        <div className="flex items-center bg-[#17120e] p-1 rounded-lg border border-[#443322]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded text-xs font-heading font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'chat'
                ? 'bg-[#3b2a1a] text-amber-200 border border-[#785734]'
                : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Kâhin Sohbeti</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`px-3 py-1.5 rounded text-xs font-heading font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'image'
                ? 'bg-[#3b2a1a] text-amber-200 border border-[#785734]'
                : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            <Camera className="w-4 h-4 text-purple-400" />
            <span>Görsel Tahlili (Fotoğraf)</span>
          </button>
        </div>
      </div>

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chat Thread (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[600px] parchment-sheet rounded-xl border border-[#523e2c] shadow overflow-hidden">
            {/* Persona Bar */}
            <div className="p-3 bg-[#15110d] border-b border-[#3b2b1d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9d8d7a]">Danışman Rolü:</span>
                <select
                  value={seciliRol}
                  onChange={(e) => setSeciliRol(e.target.value)}
                  className="bg-[#221a13] border border-[#4c3826] rounded px-2 py-1 text-xs text-amber-200 font-semibold focus:outline-none"
                >
                  <option value="Aldris (GM Danışmanı)">Aldris (GM Danışmanı &amp; Hakem)</option>
                  <option value="Kadim Arşiv Muhafızı">Kadim Arşiv Muhafızı (Lore Bilgesi)</option>
                  <option value="Meyhane Dedikoducusu">Meyhane Dedikoducusu (Han Masası)</option>
                  <option value="Taktikçi & Avcı">Taktikçi &amp; Canavar Avcısı</option>
                </select>
              </div>
              <span className="text-[10px] text-[#867563] font-mono">
                Model: gemini-3.8-flash
              </span>
            </div>

            {/* Scrollable Message History Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-300 flex-shrink-0 shadow">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-xl p-3.5 shadow-md text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#3b2716] text-[#ffeedb] border border-[#6b4728]'
                        : 'bg-[#18130e] text-[#e8ded0] border border-[#433222]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                      <span className="font-heading font-bold">
                        {m.role === 'user' ? aktifKarakter.ad : seciliRol}
                      </span>
                      <span className="font-mono">{m.timestamp}</span>
                    </div>
                    <div className="whitespace-pre-wrap font-serif text-[12px]">
                      {m.content}
                    </div>
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-700 flex items-center justify-center text-amber-200 flex-shrink-0 shadow">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-amber-300 italic p-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Kâhin parşömenleri inceliyor...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-[#15110d] border-t border-[#3b2b1d] flex items-center gap-2">
              <input
                type="text"
                placeholder="Stallhart evreni, kurallar veya hikaye hakkında bir şey sor..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-[#201812] border border-[#4a3625] rounded-lg px-3 py-2 text-xs text-[#f1e6d4] focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isTyping || !inputMessage.trim()}
                className="px-4 py-2 rounded-lg wax-seal text-white font-bold text-xs hover:brightness-110 disabled:opacity-40 flex items-center gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sor</span>
              </button>
            </div>
          </div>

          {/* Quick Oracle Tables & Presets (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e20] pb-1.5 mb-3 flex items-center gap-1.5">
                <Dices className="w-4 h-4 text-amber-400" />
                <span>Hızlı Kâhin Tabloları</span>
              </h2>

              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleSendMessage(
                      'Bana karanlık fanteziye uygun, tekinsiz 3 adet Han ismi ve her birinin karanlık sırrını üret.'
                    )
                  }
                  className="w-full text-left p-2 rounded bg-[#1c1611] hover:bg-[#2c2017] border border-[#403021] text-xs text-[#d8cebe] transition-colors"
                >
                  <span className="font-bold text-amber-300 block">
                    • Tekinsiz Han ve Meyhane İsimleri
                  </span>
                  <span className="text-[10px] text-[#8e7e6d]">
                    3 han, gizli odaları ve tekinsiz patronları.
                  </span>
                </button>

                <button
                  onClick={() =>
                    handleSendMessage(
                      'Rastgele bir NPC şahsiyeti oluştur: Adı, Hanesi, gizli Dert’i ve oyunculara sunacağı şüpheli teklif.'
                    )
                  }
                  className="w-full text-left p-2 rounded bg-[#1c1611] hover:bg-[#2c2017] border border-[#403021] text-xs text-[#d8cebe] transition-colors"
                >
                  <span className="font-bold text-amber-300 block">
                    • Rastgele Şahsiyet &amp; Şüpheli Teklif
                  </span>
                  <span className="text-[10px] text-[#8e7e6d]">
                    Hane bağlantılı entrikacı bir karakter.
                  </span>
                </button>

                <button
                  onClick={() =>
                    handleSendMessage(
                      `Karakterimin Dert'i: "${aktifKarakter.gorunumler.dert}". Anlatıcı bu derdi sahneye nasıl katarak karakteri zor bir ahlaki ikileme sokabilir?`
                    )
                  }
                  className="w-full text-left p-2 rounded bg-[#1c1611] hover:bg-[#2c2017] border border-[#403021] text-xs text-[#d8cebe] transition-colors"
                >
                  <span className="font-bold text-red-300 block">
                    • Dert Tetikleme (Compel) Fikri
                  </span>
                  <span className="text-[10px] text-[#8e7e6d]">
                    Karakterin zayıflığını tetikleyecek sahne.
                  </span>
                </button>

                <button
                  onClick={() =>
                    handleSendMessage(
                      'Leke seviyesi 6 olan bir büyücü gerçekliğin dokusunu bükerken ne gibi delilik belirtileri ve bedensel bozulmalar yaşar?'
                    )
                  }
                  className="w-full text-left p-2 rounded bg-[#1c1611] hover:bg-[#2c2017] border border-[#403021] text-xs text-[#d8cebe] transition-colors"
                >
                  <span className="font-bold text-purple-300 block">
                    • Leke 6+ Bozulma Olayı
                  </span>
                  <span className="text-[10px] text-[#8e7e6d]">
                    Büyünün ruhu yutmaya başlaması.
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MULTIMODAL IMAGE ANALYSIS TAB */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol Yükleme ve Önizleme (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="parchment-sheet p-5 rounded-xl border border-[#523e2c] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e20] pb-1.5 mb-3 flex items-center gap-1.5">
                <FileImage className="w-4 h-4 text-purple-400" />
                <span>Görsel Yükleme &amp; Tahlil</span>
              </h2>

              <p className="text-xs text-[#a99c8b] mb-4">
                Karakterinizin portresini, çizilmiş bir zindan haritasını, mühür damgasını veya gizemli bir mektubu yükleyin. Gemini evrenin kadim gözüyle analiz etsin.
              </p>

              {/* Upload Input */}
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#55402c] hover:border-amber-500 rounded-xl cursor-pointer bg-[#18130e] text-center transition-colors mb-4">
                <Upload className="w-8 h-8 text-amber-400 mb-2" />
                <span className="text-xs font-bold text-[#eedec8]">
                  Fotoğraf veya Görsel Seç
                </span>
                <span className="text-[10px] text-[#8e7e6d] mt-0.5">
                  PNG, JPG, WEBP desteklenir
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* Uploaded Preview */}
              {uploadedImage && (
                <div className="mb-4">
                  <span className="text-[10px] font-heading uppercase text-[#9e8d7b] block mb-1">
                    Yüklenen Görsel Önizleme:
                  </span>
                  <div className="max-h-56 rounded-lg overflow-hidden border border-[#55402c] bg-black">
                    <img
                      src={uploadedImage}
                      alt="Yüklenen Görsel"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Prompt customization */}
              <div className="mb-3">
                <label className="block text-[10px] uppercase font-heading text-[#c5b49f] mb-1">
                  Özel Soru veya İnceleme Talebi (İsteğe Bağlı)
                </label>
                <input
                  type="text"
                  placeholder="Örn: Bu haritadaki en tehlikeli pusu noktası neresidir?"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full bg-[#18130f] border border-[#503d2b] rounded px-3 py-1.5 text-xs text-[#f1e6d4]"
                />
              </div>

              <button
                onClick={handleAnalyzeImage}
                disabled={!uploadedImage || isAnalyzingImage}
                className="w-full py-2.5 px-4 rounded wax-seal text-white font-heading font-bold text-xs hover:brightness-110 disabled:opacity-40 flex items-center justify-center gap-2 shadow"
              >
                {isAnalyzingImage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Görsel Çözümleniyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Gemini ile Görseli Analiz Et</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sağ Tahlil Raporu (7 cols) */}
          <div className="lg:col-span-7">
            <div className="parchment-sheet p-6 rounded-xl border border-[#523e2c] shadow min-h-[460px]">
              <h2 className="font-heading font-bold text-sm uppercase text-purple-300 border-b border-[#3e2e20] pb-2 mb-4 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-purple-400" />
                <span>Adli Arşiv Raporu (Gemini Görsel Çözümlemesi)</span>
              </h2>

              {isAnalyzingImage ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <RefreshCw className="w-10 h-10 text-purple-400 animate-spin mb-3" />
                  <p className="font-heading font-bold text-amber-200 text-sm">
                    Görsel Tahlil Ediliyor...
                  </p>
                  <p className="text-xs text-[#a49684] mt-1 max-w-sm">
                    Rünler, kumaş dokusu, mimari motifler ve yüz hatları karanlık fantezi arşivine karşı taranıyor.
                  </p>
                </div>
              ) : imageAnalysisResult ? (
                <div className="p-4 rounded-lg bg-[#18130e] border border-[#483726] text-xs leading-relaxed space-y-3 font-serif">
                  <div className="font-heading font-bold text-amber-300 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Arşivci Değerlendirmesi:</span>
                  </div>
                  <div className="text-[#e2d6c6] text-[13px] whitespace-pre-wrap leading-relaxed">
                    {imageAnalysisResult}
                  </div>
                </div>
              ) : (
                <div className="text-center py-24 text-stone-500 text-xs italic">
                  Sol taraftan bir fotoğraf veya görsel yükleyip &apos;Gemini ile Görseli Analiz Et&apos; düğmesine tıklayın.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
