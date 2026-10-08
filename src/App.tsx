import React, { useState, useEffect } from 'react';
import {
  Karakter,
  NPC,
  ZarSonucu,
  Nitelikler,
  Beceriler,
  HANELER,
} from './rules';
import { INITIAL_CHARACTERS, INITIAL_NPCS, EyaletInfo, EYALETLER } from './data/initialData';
import { HeaderNav, TabType } from './components/HeaderNav';
import { CharacterSheet } from './components/CharacterSheet';
import { CharacterCreator } from './components/CharacterCreator';
import { TabletopBoardScreen } from './components/TabletopBoardScreen';
import { DialogueScreen } from './components/DialogueScreen';
import { FightScreen } from './components/FightScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { SkillTreeScreen } from './components/SkillTreeScreen';
import { AmbientWeatherCanvas, WeatherType } from './components/AmbientWeatherCanvas';
import { FloatingQuickBar } from './components/FloatingQuickBar';
import { GmStorytellerConsole } from './components/GmStorytellerConsole';
import { MapScreen } from './components/MapScreen';
import { AmbienceScreen } from './components/AmbienceScreen';
import { NpcScreen } from './components/NpcScreen';
import { CampaignJournal } from './components/CampaignJournal';
import { AiOracleModal } from './components/AiOracleModal';
import { RulesCompendium } from './components/RulesCompendium';
import { DiceModal } from './components/DiceModal';
import { AdminPanelScreen } from './components/AdminPanelScreen';
import { TitleScreen } from './components/TitleScreen';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SaveManagerModal } from './components/SaveManagerModal';
import { MultiplayerLobbyModal } from './components/MultiplayerLobbyModal';
import { LivePartyEventBanner } from './components/LivePartyEventBanner';
import { FactionReputationModal } from './components/FactionReputationModal';
import { LivePartyChatDrawer } from './components/LivePartyChatDrawer';
import { RandomEncounterModal, EncounterScene } from './components/RandomEncounterModal';
import { multiplayer } from './utils/multiplayerManager';
import { saveManager, GameSaveSlot } from './utils/saveManager';
import { sound } from './utils/audio';
import { Sparkles, X, MessageSquare, Scroll, Shield } from 'lucide-react';

export default function App() {
  // Karakterler Listesi ve Aktif Karakter
  const [karakterler, setKarakterler] = useState<Karakter[]>(() => {
    const saved = localStorage.getItem('stallhart_karakterler');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((c: any) => c.id === 'char_zeandor')) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_CHARACTERS;
  });

  const [aktifKarakterId, setAktifKarakterId] = useState<string>(() => {
    return 'char_zeandor';
  });

  // Rol: Aldris (GM) veya Oyuncu
  const [rol, setRol] = useState<'Anlatıcı' | 'Oyuncu'>('Oyuncu');

  // Aktif Sekme (Varsayılan olarak 2D Masaüstü Harita)
  const [activeTab, setActiveTab] = useState<TabType>('board');

  // Zar Modalı
  const [isDiceOpen, setIsDiceOpen] = useState<boolean>(false);
  const [preselectedNitelik, setPreselectedNitelik] = useState<keyof Nitelikler | 'Yok'>('Yok');
  const [preselectedBeceri, setPreselectedBeceri] = useState<keyof Beceriler | 'Yok'>('Fight');
  const [zarGecmisi, setZarGecmisi] = useState<ZarSonucu[]>([]);

  // Atmosferik Hava Durumu ve Canlı GM Konsolu State
  const [weather, setWeather] = useState<WeatherType>('embers');
  const [gmConsoleOpen, setGmConsoleOpen] = useState<boolean>(false);

  // Tema: 'obsidian' (Karanlık Mahzen) veya 'parchment' (Aydınlık Parşömen Elyazması)
  const [theme, setTheme] = useState<'obsidian' | 'parchment'>(() => {
    return (localStorage.getItem('stallhart_theme') as 'obsidian' | 'parchment') || 'obsidian';
  });

  useEffect(() => {
    if (theme === 'parchment') {
      document.body.classList.add('theme-parchment');
    } else {
      document.body.classList.remove('theme-parchment');
    }
    localStorage.setItem('stallhart_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'obsidian' ? 'parchment' : 'obsidian'));
  };

  // Giriş Ekranı (Title Screen): Yeni Oyun, Devam Et, Ayarlar, Credits
  const [showTitleScreen, setShowTitleScreen] = useState<boolean>(() => {
    return sessionStorage.getItem('stallhart_entered') !== 'true';
  });

  // Şifreli Admin Girişi State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return saveManager.isAdminAuthenticated();
  });
  const [adminLoginOpen, setAdminLoginOpen] = useState<boolean>(false);

  // Sefer ve Oyun Kayıt Yöneticisi State
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [saveModalMode, setSaveModalMode] = useState<'save' | 'load' | 'manage'>('manage');
  const [scenarioTitle, setScenarioTitle] = useState<string>('Stallhart: Denge Konseyi');
  const [scenarioNotes, setScenarioNotes] = useState<string>('');

  // Çevrimiçi Çok Oyunculu Masa State
  const [multiplayerModalOpen, setMultiplayerModalOpen] = useState<boolean>(false);

  // 12 Hane İtibar & Entrika Modalı
  const [factionsModalOpen, setFactionsModalOpen] = useState<boolean>(false);

  // Canlı Sohbet, Fısıltı & Zar Defteri Kenar Çubuğu
  const [chatDrawerOpen, setChatDrawerOpen] = useState<boolean>(false);

  // GM Rastgele Karşılaşma Modalı
  const [encounterModalOpen, setEncounterModalOpen] = useState<boolean>(false);

  // Sahne Işığı (Spotlight) Söz Sırası
  const [spotlightPlayerId, setSpotlightPlayerId] = useState<string | null>(null);

  // Tek Tıkla Zar (Click-to-Roll) Auto-Roll State
  const [autoRoll, setAutoRoll] = useState<boolean>(false);

  const handleQuickRoll = (beceri: string, nitelik?: string) => {
    if (beceri) setPreselectedBeceri(beceri as any);
    if (nitelik) setPreselectedNitelik(nitelik as any);
    setAutoRoll(true);
    setIsDiceOpen(true);
  };

  const handleApplyEncounter = (encounter: EncounterScene) => {
    handleAnlatiYayinla(
      `🚨 [KUDRETLİ KARŞILAŞMA: ${encounter.baslik}]\n${encounter.anlati}\n\nTehlike: ${encounter.tehlike}\nHedef Zorluk: ${encounter.zorlukSeviyesi}`
    );
  };

  const handleSetSpotlight = (_playerId: string | null, playerName: string) => {
    setSpotlightPlayerId(playerName);
  };

  useEffect(() => {
    // Check if user came with a ?room=XXXX invitation link
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setMultiplayerModalOpen(true);
    }
    if (multiplayer.isConnected()) {
      multiplayer.startSync();
    }
    return () => {
      multiplayer.stopSync();
    };
  }, []);

  const handleContinueFromTitle = () => {
    sessionStorage.setItem('stallhart_entered', 'true');
    setShowTitleScreen(false);
    setActiveTab('board');
  };

  const handleNewGameFromTitle = () => {
    sessionStorage.setItem('stallhart_entered', 'true');
    setShowTitleScreen(false);
    setActiveTab('creator');
  };

  const handleLoadSave = (slot: GameSaveSlot) => {
    if (slot.karakterler && slot.karakterler.length > 0) {
      setKarakterler(slot.karakterler);
      localStorage.setItem('stallhart_karakterler', JSON.stringify(slot.karakterler));
    }
    if (slot.aktifKarakterId) {
      setAktifKarakterId(slot.aktifKarakterId);
    }
    if (slot.npcler && slot.npcler.length > 0) {
      setNpcleri(slot.npcler);
      localStorage.setItem('stallhart_npcler', JSON.stringify(slot.npcler));
    }
    if (slot.eyaletler && slot.eyaletler.length > 0) {
      setEyaletler(slot.eyaletler);
      localStorage.setItem('stallhart_eyaletler', JSON.stringify(slot.eyaletler));
    }
    if (slot.weather) {
      setWeather(slot.weather);
    }
    if (slot.scenarioTitle) {
      setScenarioTitle(slot.scenarioTitle);
    }
    if (slot.scenarioNotes) {
      setScenarioNotes(slot.scenarioNotes);
    }
    sessionStorage.setItem('stallhart_entered', 'true');
    setShowTitleScreen(false);
    setActiveTab('board');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setRol('Anlatıcı');
    setAdminLoginOpen(false);
    sessionStorage.setItem('stallhart_entered', 'true');
    setShowTitleScreen(false);
    setActiveTab('admin');
  };

  const handleLockAdmin = () => {
    saveManager.setAdminAuthenticated(false);
    setIsAdminAuthenticated(false);
    setRol('Oyuncu');
    const gmOnlyTabs: TabType[] = ['admin', 'npc', 'campaign', 'oracle', 'ambience'];
    if (gmOnlyTabs.includes(activeTab)) {
      setActiveTab('board');
    }
  };

  // Oyuncu modundayken GM sekmelerine doğrudan erişimi engelle
  useEffect(() => {
    const gmOnlyTabs: TabType[] = ['admin', 'npc', 'campaign', 'oracle', 'ambience'];
    if (rol === 'Oyuncu' && gmOnlyTabs.includes(activeTab)) {
      setActiveTab('board');
    }
  }, [rol, activeTab]);

  // NPC Listesi
  const [npcler, setNpcleri] = useState<NPC[]>(() => {
    const saved = localStorage.getItem('stallhart_npcler');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((n: any) => n.id));
          const missing = INITIAL_NPCS.filter((n) => !existingIds.has(n.id));
          return [...parsed, ...missing];
        }
      } catch (e) {}
    }
    return INITIAL_NPCS;
  });

  const [secilenSavasNpc, setSecilenSavasNpc] = useState<NPC | null>(null);

  // Eyaletler & Mekanlar Listesi
  const [eyaletler, setEyaletler] = useState<EyaletInfo[]>(() => {
    const saved = localStorage.getItem('stallhart_eyaletler');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= EYALETLER.length) {
          return parsed;
        } else if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((e: any) => e.id));
          const missing = EYALETLER.filter((e) => !existingIds.has(e.id));
          return [...parsed, ...missing];
        }
      } catch (e) {}
    }
    return EYALETLER;
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

  useEffect(() => {
    localStorage.setItem('stallhart_eyaletler', JSON.stringify(eyaletler));
  }, [eyaletler]);

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
  const handleHizliZar = (nitelik?: any, beceri?: any) => {
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

  // Mühür Kazanma (Dert Zorlaması / Compel)
  const handleMuhurKazan = (miktar: number) => {
    handleKarakterGuncelle({
      ...aktifKarakter,
      sayaclar: {
        ...aktifKarakter.sayaclar,
        muhur: aktifKarakter.sayaclar.muhur + miktar,
      },
    });
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
    setSecilenSavasNpc(npc);
    sound.playBladeClash();
    setActiveTab('fight');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-serif selection:bg-[#7a1c1c] selection:text-[#fff0d0] transition-colors duration-300 ${
        theme === 'parchment' ? 'bg-[#ede2cd] text-[#241a12]' : 'bg-[#0b0c10] text-[#e5dec9]'
      }`}
      style={{
        // Dynamic house accent CSS variables
        ['--theme-accent' as any]: haneInfo.renk,
      }}
    >
      {/* Ana Başlangıç Ekranı (Title Screen) veya Oyun Alanı */}
      {showTitleScreen ? (
        <TitleScreen
          onContinue={handleContinueFromTitle}
          onNewGame={handleNewGameFromTitle}
          onOpenAdminLogin={() => setAdminLoginOpen(true)}
          onOpenSaveManager={() => {
            setSaveModalMode('manage');
            setSaveModalOpen(true);
          }}
          onOpenMultiplayer={() => setMultiplayerModalOpen(true)}
          hasExistingSave={karakterler.length > 0}
          activeCharacterName={aktifKarakter?.ad}
          activeCharacterHouse={aktifKarakter?.hane}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          weather={weather}
          onWeatherChange={setWeather}
        />
      ) : (
        <>
          {/* Header & Navigation */}
          <HeaderNav
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === 'fight') {
                sound.playWarDrums();
              }
              setActiveTab(tab);
            }}
            rol={rol}
            setRol={setRol}
            aktifKarakter={aktifKarakter}
            karakterler={karakterler}
            onKarakterSec={(id) => setAktifKarakterId(id)}
            onZarAc={() => setIsDiceOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onOpenTitleScreen={() => setShowTitleScreen(true)}
            onOpenSaveModal={() => {
              setSaveModalMode('manage');
              setSaveModalOpen(true);
            }}
            onOpenMultiplayer={() => setMultiplayerModalOpen(true)}
            onOpenChat={() => setChatDrawerOpen(true)}
            onOpenFactions={() => setFactionsModalOpen(true)}
            onOpenRandomEncounter={() => setEncounterModalOpen(true)}
            spotlightPlayerId={spotlightPlayerId}
            isAdminAuthenticated={isAdminAuthenticated}
            onRequireAdminAuth={() => setAdminLoginOpen(true)}
            onLockAdmin={handleLockAdmin}
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
        {activeTab === 'board' && (
          <TabletopBoardScreen
            karakterler={karakterler}
            aktifKarakter={aktifKarakter}
            onKarakterSec={setAktifKarakterId}
            onKarakterGuncelle={handleKarakterGuncelle}
            npcler={npcler}
            rol={rol}
            spotlightPlayerId={spotlightPlayerId}
            onSetSpotlight={handleSetSpotlight}
            onSavasaBasla={(npc) => {
              sound.playBladeClash();
              sound.playWarDrums();
              setActiveTab('fight');
            }}
            onDiyalogBasla={(npc) => {
              sound.playSealStamp();
              setActiveTab('dialogue');
            }}
            onAnlatıYayinla={handleAnlatiYayinla}
          />
        )}

        {activeTab === 'sheet' && (
          <CharacterSheet
            karakter={aktifKarakter}
            onKarakterGuncelle={handleKarakterGuncelle}
            onZarAtHizli={(yaklasim) => handleHizliZar(undefined, yaklasim)}
            onQuickRoll3D={handleQuickRoll}
            rol={rol}
            onYeniKarakterTikla={() => setActiveTab('creator')}
            onEnvanterTikla={() => setActiveTab('inventory')}
            onYetenekAgaciTikla={() => setActiveTab('skills')}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTreeScreen
            karakter={aktifKarakter}
            karakterler={karakterler}
            onKarakterGuncelle={handleKarakterGuncelle}
            onKarakterSec={setAktifKarakterId}
            rol={rol}
          />
        )}

        {activeTab === 'creator' && (
          <CharacterCreator
            onKarakterOlustur={handleYeniKarakterKaydet}
            onIptal={() => setActiveTab('sheet')}
          />
        )}

        {activeTab === 'dialogue' && (
          <DialogueScreen
            aktifKarakter={aktifKarakter}
            onKarakterGuncelle={handleKarakterGuncelle}
            npcler={npcler}
            onNpcGuncelle={setNpcleri}
            rol={rol}
            onSavasaGec={(npc) => {
              sound.playBladeClash();
              setActiveTab('fight');
            }}
          />
        )}

        {activeTab === 'fight' && (
          <FightScreen
            karakterler={karakterler}
            aktifKarakter={aktifKarakter}
            npcler={npcler}
            rol={rol}
            onKarakterGuncelle={handleKarakterGuncelle}
            baslangicDusmanNpc={secilenSavasNpc}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryScreen
            karakter={aktifKarakter}
            karakterler={karakterler}
            onKarakterGuncelle={handleKarakterGuncelle}
            onKarakterSec={setAktifKarakterId}
            rol={rol}
          />
        )}

        {activeTab === 'map' && (
          <MapScreen
            rol={rol}
            eyaletler={eyaletler}
            onEyaletGuncelle={setEyaletler}
          />
        )}

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
            onDiyalogBasla={(npc) => {
              sound.playSealStamp();
              setActiveTab('dialogue');
            }}
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

        {activeTab === 'admin' && (
          <AdminPanelScreen
            npcler={npcler}
            onNpcGuncelle={setNpcleri}
            eyaletler={eyaletler}
            onEyaletGuncelle={setEyaletler}
            karakterler={karakterler}
            onKarakterlerGuncelle={setKarakterler}
            onAnlatıYayinla={handleAnlatiYayinla}
          />
        )}
      </main>

      {/* Global 4dF Dice Modal */}
      <DiceModal
        isOpen={isDiceOpen}
        onClose={() => {
          setIsDiceOpen(false);
          setAutoRoll(false);
        }}
        karakter={aktifKarakter}
        initialNitelik={preselectedNitelik}
        initialBeceri={preselectedBeceri}
        autoRoll={autoRoll}
        onZarKaydet={handleZarKaydet}
        onMuhurHarca={handleMuhurHarca}
        onMuhurKazan={handleMuhurKazan}
      />

      {/* Atmosferik Hava Durumu Parçacık Katmanı */}
      <AmbientWeatherCanvas weather={weather} />

      {/* Sabit Hızlı Eylem & HUD Çubuğu */}
      <FloatingQuickBar
        karakter={aktifKarakter}
        onKarakterGuncelle={handleKarakterGuncelle}
        onZarAt={(yaklasim) => handleHizliZar(undefined, yaklasim)}
        onQuickRoll={(beceri, nitelik) => handleQuickRoll(beceri, nitelik)}
        weather={weather}
        onWeatherChange={setWeather}
        rol={rol}
        onToggleGmConsole={() => setGmConsoleOpen(!gmConsoleOpen)}
        gmConsoleOpen={gmConsoleOpen}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenChat={() => setChatDrawerOpen(true)}
        onOpenFactions={() => setFactionsModalOpen(true)}
        onOpenRandomEncounter={() => setEncounterModalOpen(true)}
      />

      {/* Canlı GM Kumanda Konsolu (Yalnızca Anlatıcı Modunda) */}
      {rol === 'Anlatıcı' && gmConsoleOpen && (
        <GmStorytellerConsole
          karakterler={karakterler}
          onKarakterGuncelle={handleKarakterGuncelle}
          onAnlatiYayinla={handleAnlatiYayinla}
          onFisiltiGonder={handleFisiltiGonder}
          onClose={() => setGmConsoleOpen(false)}
        />
      )}

      {/* Footer Strip */}
      <footer
        className={`${
          theme === 'parchment'
            ? 'bg-[#decbb1] border-t border-[#bfa98d] text-[#4d3622]'
            : 'bg-[#090807] border-t border-[#291f16] text-[#7d6f5e]'
        } py-3 text-center text-xs font-serif transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-heading font-bold text-amber-500">
            LEGEND OF THE COUNCIL — Fate Tabanlı Karanlık Fantezi Masaüstü RPG
          </span>
          <span className="text-[11px] opacity-80">
            Stallhart Kurultayı • &quot;Taş aşınır, Kurultay baki kalır.&quot;
          </span>
        </div>
      </footer>
        </>
      )}

      {/* Şifreli Admin / GM Giriş Modalı */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Sefer ve Oyun Kayıt Yöneticisi Modalı */}
      <SaveManagerModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        mode={saveModalMode}
        currentState={{
          scenarioTitle,
          scenarioNotes,
          activeZoneId: 'arava_saray',
          activeZoneName: 'Arava Sarayı & Taç Divanı',
          aktifKarakterId: aktifKarakter?.id || '',
          karakterler,
          npcler,
          eyaletler,
          weather,
        }}
        onLoadSave={handleLoadSave}
      />

      {/* Çevrimiçi Çok Oyunculu Lobi Modalı */}
      <MultiplayerLobbyModal
        isOpen={multiplayerModalOpen}
        onClose={() => setMultiplayerModalOpen(false)}
        aktifKarakter={aktifKarakter}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={() => {
          setMultiplayerModalOpen(false);
          setAdminLoginOpen(true);
        }}
      />

      {/* 12 Hane Entrika & İtibar Modalı */}
      <FactionReputationModal
        isOpen={factionsModalOpen}
        onClose={() => setFactionsModalOpen(false)}
        karakter={aktifKarakter}
        onKarakterGuncelle={handleKarakterGuncelle}
        rol={rol}
      />

      {/* Canlı Sohbet, Fısıltı & Zar Defteri Çekmecesi */}
      <LivePartyChatDrawer
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
        aktifKarakter={aktifKarakter}
        rol={rol}
        spotlightPlayerId={spotlightPlayerId}
        onSetSpotlight={handleSetSpotlight}
      />

      {/* GM Otomatik Karşılaşma & Kriz Üreteci Modalı */}
      <RandomEncounterModal
        isOpen={encounterModalOpen}
        onClose={() => setEncounterModalOpen(false)}
        onApplyEncounter={handleApplyEncounter}
      />

      {/* Masadaki Canlı Zar ve Olay Bildirim Katmanı */}
      <LivePartyEventBanner />
    </div>
  );
}
