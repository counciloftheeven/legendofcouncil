import React, { useState, useEffect } from 'react';
import {
  Karakter,
  NPC,
  ZarSonucu,
  Nitelikler,
  Beceriler,
  HANELER,
} from './rules';
import { INITIAL_CHARACTERS, INITIAL_NPCS } from './data/initialData';
import { HeaderNav, TabType } from './components/HeaderNav';
import { CharacterSheet } from './components/CharacterSheet';
import { CharacterCreator } from './components/CharacterCreator';
import { FightScreen } from './components/FightScreen';
import { MapScreen } from './components/MapScreen';
import { AmbienceScreen } from './components/AmbienceScreen';
import { NpcScreen } from './components/NpcScreen';
import { CampaignJournal } from './components/CampaignJournal';
import { AiOracleModal } from './components/AiOracleModal';
import { RulesCompendium } from './components/RulesCompendium';
import { DiceModal } from './components/DiceModal';
import { sound } from './utils/audio';
import { Sparkles, X, MessageSquare, Scroll, Shield } from 'lucide-react';

export default function App() {
  // Karakterler Listesi ve Aktif Karakter
  const [karakterler, setKarakterler] = useState<Karakter[]>(() => {
    const saved = localStorage.getItem('stallhart_karakterler');
    return saved ? JSON.parse(saved) : INITIAL_CHARACTERS;
  });

  const [aktifKarakterId, setAktifKarakterId] = useState<string>(() => {
    return karakterler[0]?.id || 'char_1';
  });

  // Rol: Aldris (GM) veya Oyuncu
  const [rol, setRol] = useState<'Anlatıcı' | 'Oyuncu'>('Oyuncu');

  // Aktif Sekme
  const [activeTab, setActiveTab] = useState<TabType>('sheet');

  // Zar Modalı
  const [isDiceOpen, setIsDiceOpen] = useState<boolean>(false);
  const [preselectedNitelik, setPreselectedNitelik] = useState<keyof Nitelikler | 'Yok'>('Yok');
  const [preselectedBeceri, setPreselectedBeceri] = useState<keyof Beceriler | 'Yok'>('Fight');
  const [zarGecmisi, setZarGecmisi] = useState<ZarSonucu[]>([]);

  // NPC Listesi
  const [npcler, setNpcleri] = useState<NPC[]>(() => {
    const saved = localStorage.getItem('stallhart_npcler');
    return saved ? JSON.parse(saved) : INITIAL_NPCS;
  });

  // Anlatı Örtüsü ve Fısıltı State
  const [anlatiYayini, setAnlatiYayini] = useState<string | null>(null);
  const [gelenFisilti, setGelenFisilti] = useState<{ gonderen: string; metin: string } | null>(null);

  // LocalStorage senkronizasyonu
  useEffect(() => {
    localStorage.setItem('stallhart_karakterler', JSON.stringify(karakterler));
  }, [karakterler]);

  useEffect(() => {
    localStorage.setItem('stallhart_npcler', JSON.stringify(npcler));
  }, [npcler]);

  const aktifKarakter =
    karakterler.find((c) => c.id === aktifKarakterId) || karakterler[0];
  const haneInfo = HANELER[aktifKarakter?.hane] || HANELER.Stallhart;

  // Karakter Güncelleme
  const handleKarakterGuncelle = (yeniKarakter: Karakter) => {
    setKarakterler((prev) =>
      prev.map((c) => (c.id === yeniKarakter.id ? yeniKarakter : c))
    );
  };

  // Yeni Karakter Oluşturulduğunda
  const handleYeniKarakterKaydet = (yeniKarakter: Karakter) => {
    setKarakterler((prev) => [...prev, yeniKarakter]);
    setAktifKarakterId(yeniKarakter.id);
    setActiveTab('sheet');
  };

  // Hızlı Zar Atma
  const handleHizliZar = (nitelik?: keyof Nitelikler, beceri?: keyof Beceriler) => {
    setPreselectedNitelik(nitelik || 'Yok');
    setPreselectedBeceri(beceri || 'Yok');
    sound.playDiceRoll();
    setIsDiceOpen(true);
  };

  // Zar Kaydetme
  const handleZarKaydet = (sonuc: ZarSonucu) => {
    setZarGecmisi((prev) => [sonuc, ...prev.slice(0, 40)]);
  };

  // Mühür Harcama
  const handleMuhurHarca = (miktar: number) => {
    if (aktifKarakter.sayaclar.muhur >= miktar) {
      handleKarakterGuncelle({
        ...aktifKarakter,
        sayaclar: {
          ...aktifKarakter.sayaclar,
          muhur: aktifKarakter.sayaclar.muhur - miktar,
        },
      });
    }
  };

  // Anlatı Yayını Gösterimi
  const handleAnlatiYayinla = (metin: string) => {
    sound.playTempleBell('uyanis');
    setAnlatiYayini(metin);
  };

  // Fısıltı Gönderimi
  const handleFisiltiGonder = (hedefAd: string, metin: string) => {
    sound.playSealStamp();
    if (hedefAd === aktifKarakter.ad || rol === 'Anlatıcı') {
      setGelenFisilti({ gonderen: rol === 'Anlatıcı' ? 'Aldris (Anlatıcı)' : 'Bilinmeyen', metin });
    }
  };

  // NPC'yi Sahneye Çağırma
  const handleNpcSahneyeCagir = (npc: NPC) => {
    setActiveTab('fight');
  };

  return (
    <div
      className="min-h-screen bg-[#0b0c10] text-[#e5dec9] flex flex-col font-serif selection:bg-[#7a1c1c] selection:text-[#fff0d0]"
      style={{
        // Dynamic house accent CSS variables
        ['--theme-accent' as any]: haneInfo.renk,
      }}
    >
      {/* Header & Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rol={rol}
        setRol={setRol}
        aktifKarakter={aktifKarakter}
        karakterler={karakterler}
        onKarakterSec={(id) => setAktifKarakterId(id)}
        onZarAc={() => setIsDiceOpen(true)}
      />

      {/* Anlatı Örtüsü (Cinematic Narrative Overlay) */}
      {anlatiYayini && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative max-w-2xl w-full parchment-sheet rounded-2xl border-4 border-[#8b6938] p-6 sm:p-10 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setAnlatiYayini(null)}
              className="absolute top-4 right-4 text-[#8a7966] hover:text-white p-1 rounded hover:bg-[#34271c]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full wax-seal mx-auto flex items-center justify-center text-amber-200">
              <Scroll className="w-6 h-6" />
            </div>

            <span className="text-[11px] font-heading font-black uppercase text-amber-400 tracking-widest block">
              ALDRİS ARŞİV BİLDİRİSİ
            </span>

            <p className="font-serif italic text-base sm:text-lg text-[#f4ede2] leading-relaxed max-h-96 overflow-y-auto px-2">
              &quot;{anlatiYayini}&quot;
            </p>

            <div className="pt-2">
              <button
                onClick={() => setAnlatiYayini(null)}
                className="px-6 py-2 rounded wax-seal text-white font-heading font-bold text-xs hover:brightness-110 shadow"
              >
                Mührü Kabul Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gelen Fısıltı Bildirimi (Whisper Toast) */}
      {gelenFisilti && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm parchment-sheet p-4 rounded-xl border-2 border-indigo-700/80 shadow-2xl animate-bounce-short">
          <div className="flex items-center justify-between border-b border-[#3b2d1f] pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Gizli Fısıltı ({gelenFisilti.gonderen})</span>
            </div>
            <button
              onClick={() => setGelenFisilti(null)}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#eedec8] italic leading-relaxed font-serif">
            &quot;{gelenFisilti.metin}&quot;
          </p>
        </div>
      )}

      {/* Main Screen Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'sheet' && (
          <CharacterSheet
            karakter={aktifKarakter}
            onKarakterGuncelle={handleKarakterGuncelle}
            onZarAtHizli={handleHizliZar}
            rol={rol}
          />
        )}

        {activeTab === 'creator' && (
          <CharacterCreator
            onKarakterOlustur={handleYeniKarakterKaydet}
            onIptal={() => setActiveTab('sheet')}
          />
        )}

        {activeTab === 'fight' && (
          <FightScreen
            karakterler={karakterler}
            aktifKarakter={aktifKarakter}
            npcler={npcler}
            rol={rol}
          />
        )}

        {activeTab === 'map' && <MapScreen rol={rol} />}

        {activeTab === 'ambience' && (
          <AmbienceScreen
            karakterler={karakterler}
            rol={rol}
            onAnlatiYayinla={handleAnlatiYayinla}
            onFisiltiGonder={handleFisiltiGonder}
          />
        )}

        {activeTab === 'npc' && (
          <NpcScreen
            npcler={npcler}
            onNpcGuncelle={setNpcleri}
            rol={rol}
            onSahneyeCagir={handleNpcSahneyeCagir}
          />
        )}

        {activeTab === 'campaign' && (
          <CampaignJournal
            karakter={aktifKarakter}
            onKarakterGuncelle={handleKarakterGuncelle}
            rol={rol}
          />
        )}

        {activeTab === 'oracle' && (
          <AiOracleModal aktifKarakter={aktifKarakter} rol={rol} />
        )}

        {activeTab === 'rules' && <RulesCompendium />}
      </main>

      {/* Global 4dF Dice Modal */}
      <DiceModal
        isOpen={isDiceOpen}
        onClose={() => setIsDiceOpen(false)}
        karakter={aktifKarakter}
        initialNitelik={preselectedNitelik}
        initialBeceri={preselectedBeceri}
        onZarKaydet={handleZarKaydet}
        onMuhurHarca={handleMuhurHarca}
      />

      {/* Footer Strip */}
      <footer className="bg-[#090807] border-t border-[#291f16] py-3 text-center text-xs text-[#7d6f5e] font-serif">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>STALLHART — Fate Tabanlı Karanlık Fantezi Masaüstü RPG Sistemi</span>
          <span className="text-[11px] text-[#6b5d4d]">
            Denge Konseyi Kanunları • &quot;Taş aşınır, Stallhart baki kalır.&quot;
          </span>
        </div>
      </footer>
    </div>
  );
}
