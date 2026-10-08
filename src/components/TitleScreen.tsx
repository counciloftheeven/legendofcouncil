import React, { useState } from 'react';
import { LegendOfTheCouncilLogo } from './LegendOfTheCouncilLogo';
import { WeatherType } from './AmbientWeatherCanvas';
import { sound } from '../utils/audio';
import {
  Play,
  RotateCcw,
  Settings,
  Award,
  Sparkles,
  Volume2,
  Flame,
  CloudFog,
  CloudRain,
  Shield,
  X,
  FileDown,
  FileUp,
  Trash2,
  Users,
  Scroll,
  Sun,
  Moon,
  Save,
  KeyRound,
  Lock,
  Globe,
  Image,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onOpenAdminLogin: () => void;
  onOpenSaveManager: () => void;
  onOpenMultiplayer: () => void;
  hasExistingSave: boolean;
  activeCharacterName?: string;
  activeCharacterHouse?: string;
  theme: 'obsidian' | 'parchment';
  onToggleTheme: () => void;
  weather: WeatherType;
  onWeatherChange: (w: WeatherType) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onNewGame,
  onContinue,
  onOpenAdminLogin,
  onOpenSaveManager,
  onOpenMultiplayer,
  hasExistingSave,
  activeCharacterName = 'Bilinmeyen Savaşçı',
  activeCharacterHouse = 'Stallhart',
  theme,
  onToggleTheme,
  weather,
  onWeatherChange,
}) => {
  const [activeModal, setActiveModal] = useState<
    'none' | 'new_game_confirm' | 'settings' | 'credits'
  >('none');
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleMenuClick = (action: () => void) => {
    sound.playTempleBell('koruma');
    action();
  };

  const handleExportData = () => {
    sound.playSealStamp();
    const dataToExport: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('stallhart_')) {
        dataToExport[key] = localStorage.getItem(key);
      }
    }
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legend_of_the_Council_Save_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, data[key]);
        });
        sound.playTempleBell('uyanis');
        confetti({ particleCount: 40, spread: 60 });
        window.location.reload();
      } catch (err) {
        console.error('Yedek yüklenirken hata:', err);
      }
    };
    reader.readAsText(file);
  };

  const [customLogoActive, setCustomLogoActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return Boolean(localStorage.getItem('stallhart_custom_logo'));
    }
    return false;
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        localStorage.setItem('stallhart_custom_logo', dataUrl);
        setCustomLogoActive(true);
        window.dispatchEvent(new Event('stallhart_logo_updated'));
        sound.playSealStamp();
        confetti({ particleCount: 35, spread: 60 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    localStorage.removeItem('stallhart_custom_logo');
    setCustomLogoActive(false);
    window.dispatchEvent(new Event('stallhart_logo_updated'));
    sound.playBladeClash();
  };

  const handleClearAllData = () => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('stallhart_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    sound.playBladeClash();
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 sm:py-12 select-none overflow-hidden z-20">
      {/* Background vignette & gothic light sweep */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/60 -z-10" />

      {/* Top Header Strip */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs font-serif">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="opacity-75 tracking-wider font-mono text-[11px]">
            KURULTAY ARŞİVİ DEVREDE • FATE v2.4
          </span>
        </div>

        {/* Quick Theme Switcher */}
        <button
          onClick={() => {
            sound.playSealStamp();
            onToggleTheme();
          }}
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-heading font-bold shadow-md ${
            theme === 'parchment'
              ? 'bg-[#e5d8c3] hover:bg-[#d9c9b1] text-[#2c1d11] border-[#8a6843]'
              : 'bg-[#1b140f] hover:bg-[#2c1f15] text-amber-300 border-[#4a3623]'
          }`}
          title="Temayı Değiştir"
        >
          {theme === 'parchment' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-amber-900" />
              <span>Obsidyen Mahzen (Karanlık)</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Parşömen El Yazması (Aydınlık)</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Centerpiece: Logo & Main Navigation */}
      <div className="flex flex-col items-center my-auto space-y-5 sm:space-y-7 text-center max-w-3xl w-full">
        {/* Subtle Ambient Backlight Glow for Title Logo */}
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute -inset-4 sm:-inset-8 bg-radial from-amber-500/15 via-amber-700/5 to-transparent blur-2xl pointer-events-none rounded-full" />

          {/* The Official Game Logo - 1:1 Ultra High Quality */}
          <LegendOfTheCouncilLogo
            theme={theme}
            size="hero"
            showSubtitle
            className="w-full max-w-2xl px-2 transition-transform duration-500 hover:scale-[1.01]"
          />

          {/* Quick Direct PNG Logo Upload & Status Bar */}
          <div className="mt-2.5 flex items-center justify-center gap-2">
            <label className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1c140d]/80 hover:bg-[#2b1f14] border border-amber-600/40 hover:border-amber-400 text-[11px] text-amber-200/90 font-serif cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95">
              <Image className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{customLogoActive ? '🖼️ PNG Logoyu Değiştir' : '🖼️ Kendi PNG Logonuzu Ekleyin (Birebir 1:1)'}</span>
              <input
                type="file"
                accept="image/png,image/webp,image/svg+xml,image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {customLogoActive && (
              <button
                onClick={handleResetLogo}
                title="Varsayılan Vektör Logoya Geri Dön"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700/70 text-[10px] text-stone-300 font-serif transition-colors hover:text-amber-200"
              >
                <RotateCcw className="w-3 h-3 text-stone-400" />
                <span>Varsayılan</span>
              </button>
            )}
          </div>
        </div>

        {/* Medieval Divider */}
        <div className="flex items-center justify-center gap-3 w-full max-w-md opacity-70 my-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
          <span className="text-amber-400 text-xs tracking-widest font-serif">❖ ✦ ❖</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />
        </div>

        {/* 4 Ana Menü Seçeneği */}
        <div className="w-full max-w-sm space-y-3 pt-2">
          {/* 1. DEVAM ET */}
          <button
            onClick={() => {
              if (hasExistingSave) {
                handleMenuClick(onContinue);
              }
            }}
            disabled={!hasExistingSave}
            className={`w-full py-3 sm:py-3.5 px-6 rounded-xl font-heading font-black text-sm tracking-widest flex items-center justify-between border-2 transition-all shadow-xl group ${
              hasExistingSave
                ? 'bg-gradient-to-r from-[#2c1d10] via-[#3d2714] to-[#2c1d10] hover:from-[#442c16] hover:to-[#442c16] text-amber-200 border-amber-500/80 hover:border-amber-400 hover:scale-[1.02] active:scale-95'
                : 'bg-stone-900/60 text-stone-600 border-stone-800 cursor-not-allowed opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Play className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              <div className="text-left">
                <span className="block leading-tight">DEVAM ET</span>
                {hasExistingSave && (
                  <span className="text-[10px] text-amber-300/70 font-serif font-normal block">
                    {activeCharacterName} ({activeCharacterHouse})
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-mono text-amber-400/60">▶</span>
          </button>

          {/* 2. YENİ OYUN */}
          <button
            onClick={() => {
              sound.playSealStamp();
              if (hasExistingSave) {
                setActiveModal('new_game_confirm');
              } else {
                handleMenuClick(onNewGame);
              }
            }}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl font-heading font-black text-sm tracking-widest flex items-center justify-between border-2 bg-gradient-to-r from-[#1e1712] to-[#241a13] hover:from-[#312217] hover:to-[#312217] text-[#f2e7d5] border-[#5a432e] hover:border-amber-500/80 hover:scale-[1.02] active:scale-95 transition-all shadow-lg group"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <div className="text-left">
                <span className="block leading-tight">YENİ OYUN</span>
                <span className="text-[10px] text-stone-400 font-serif font-normal block">
                  Yeni Sefer &amp; Karakter Yaratımı
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-stone-500">▶</span>
          </button>

          {/* 3. ÇEVRİMİÇİ DİVAN MASASI (MULTIPLAYER) */}
          <button
            onClick={() => {
              sound.playSealStamp();
              onOpenMultiplayer();
            }}
            className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-heading font-black text-xs tracking-wider flex items-center justify-between border-2 bg-gradient-to-r from-[#172418] via-[#1f3020] to-[#172418] hover:from-[#263c28] hover:to-[#263c28] text-emerald-300 border-emerald-600/70 hover:border-emerald-400 hover:scale-[1.01] active:scale-95 transition-all shadow-lg group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/80 flex items-center justify-center text-emerald-300 flex-shrink-0">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block leading-tight font-black">ÇEVRİMİÇİ DİVAN (ONLINE ODA)</span>
                <span className="text-[10px] text-emerald-200/70 font-serif font-normal block">
                  Arkadaşlarla Ortak Masa, Lobi &amp; Zar
                </span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-mono">🌐</span>
          </button>

          {/* 4. SEFER & KAYIT YÖNETİCİSİ */}
          <button
            onClick={() => {
              sound.playSealStamp();
              onOpenSaveManager();
            }}
            className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center justify-between border bg-[#17110c] hover:bg-[#261c14] text-[#e0cfba] hover:text-[#fff5e8] border-[#4d3824] hover:border-amber-500/70 hover:scale-[1.01] active:scale-95 transition-all shadow-md group"
          >
            <div className="flex items-center gap-2.5">
              <Save className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block leading-tight font-black">SEFER &amp; KAYIT YÖNETİCİSİ</span>
                <span className="text-[10px] text-stone-400 font-serif font-normal block">
                  Kayıt Yuvaları, Senaryo Yükle &amp; Yedekler
                </span>
              </div>
            </div>
            <span className="text-xs text-amber-500/70 font-mono">💾</span>
          </button>

          {/* 4. YÖNETİCİ & ANLATICI DİVANI (ŞİFRELİ GM GİRİŞİ) */}
          <button
            onClick={() => {
              sound.playSealStamp();
              onOpenAdminLogin();
            }}
            className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-heading font-black text-xs tracking-wider flex items-center justify-between border-2 bg-gradient-to-r from-[#21160d] via-[#2d1e11] to-[#21160d] hover:from-[#3a2615] hover:to-[#3a2615] text-amber-300 border-amber-600/60 hover:border-amber-400 hover:scale-[1.01] active:scale-95 transition-all shadow-lg group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full wax-seal-gold flex items-center justify-center text-amber-950 flex-shrink-0">
                <KeyRound className="w-3 h-3 text-amber-900" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">YÖNETİCİ DİVANI (GM)</span>
                <span className="text-[10px] text-amber-200/60 font-serif font-normal block">
                  Şifreli Başyargıç &amp; Kural Portalı
                </span>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-mono">🔒</span>
          </button>

          {/* 5. AYARLAR */}
          <button
            onClick={() => {
              sound.playSealStamp();
              setActiveModal('settings');
            }}
            className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center justify-between border bg-[#140f0c] hover:bg-[#201813] text-[#c9b9a4] hover:text-[#f4ede3] border-[#3e2d1d] hover:border-[#674b30] hover:scale-[1.01] active:scale-95 transition-all shadow-md group"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-stone-400 group-hover:rotate-90 transition-transform duration-300" />
              <span>AYARLAR &amp; ATMOSFER</span>
            </div>
            <span className="text-xs text-stone-500 font-mono">⚙</span>
          </button>

          {/* 6. CREDITS */}
          <button
            onClick={() => {
              sound.playSealStamp();
              setActiveModal('credits');
            }}
            className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-heading font-bold text-xs tracking-wider flex items-center justify-between border bg-[#140f0c] hover:bg-[#201813] text-[#c9b9a4] hover:text-[#f4ede3] border-[#3e2d1d] hover:border-[#674b30] hover:scale-[1.01] active:scale-95 transition-all shadow-md group"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400/80 group-hover:scale-110 transition-transform" />
              <span>EMEĞİ GEÇENLER (CREDITS)</span>
            </div>
            <span className="text-xs text-stone-500 font-mono">⚜</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Quote */}
      <div className="text-center space-y-1">
        <p className="font-serif italic text-xs opacity-75">
          &quot;Taş aşınır, Kurultay baki kalır. Denge sarsılır, mühür konuşur.&quot;
        </p>
        <span className="text-[10px] text-stone-500 tracking-wider font-mono">
          LEGEND OF THE COUNCIL © 2026 • DARK FANTASY TABLETOP RPG
        </span>
      </div>

      {/* ========================================================
          MODALS: YENİ OYUN ONAY, AYARLAR, CREDITS
      ======================================================== */}

      {/* 1. YENİ OYUN ONAY MODALI */}
      {activeModal === 'new_game_confirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-md w-full parchment-sheet rounded-2xl border-2 border-red-700/80 p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full wax-seal mx-auto flex items-center justify-center text-amber-200 shadow">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="font-heading font-black text-lg text-amber-200">
              Yeni Sefere Başla
            </h3>

            <p className="text-xs text-[#eedec8] leading-relaxed font-serif">
              Mevcut bir karakteriniz ve parti ilerlemeniz bulunuyor ({activeCharacterName}).
              Yeni bir oyuna başladığınızda karakter yaratım sihirbazı açılacak ve yeni bir hikâyeye adım atacaksınız.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl bg-[#241a12] text-[#d6c7b2] border border-[#4d3824] text-xs font-heading font-bold hover:bg-[#34261a]"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setActiveModal('none');
                  handleMenuClick(onNewGame);
                }}
                className="px-5 py-2 rounded-xl wax-seal text-white text-xs font-heading font-black hover:brightness-110 shadow-lg"
              >
                Yeni Oyuna Başla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AYARLAR MODALI */}
      {activeModal === 'settings' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full parchment-sheet rounded-2xl border-2 border-[#6d5135] p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#443322] pb-3">
              <div className="flex items-center gap-2 text-amber-300 font-heading font-bold text-sm">
                <Settings className="w-4 h-4" />
                <span>OYUN &amp; ATMOSFER AYARLARI</span>
              </div>
              <button
                onClick={() => {
                  sound.playSealStamp();
                  setActiveModal('none');
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tema Seçimi */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-amber-400 block">
                1. Görsel Tema &amp; Parşömen Modu
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => {
                    if (theme !== 'obsidian') onToggleTheme();
                    sound.playSealStamp();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                    theme === 'obsidian'
                      ? 'bg-[#2a1d12] border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400'
                      : 'bg-[#15100c] border-[#3a2a1b] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Moon className="w-4 h-4 text-amber-300" />
                  <strong className="font-heading">Obsidyen Mahzen</strong>
                  <span className="text-[10px] opacity-75">Karanlık, loş odalar ve gece oturumları</span>
                </button>

                <button
                  onClick={() => {
                    if (theme !== 'parchment') onToggleTheme();
                    sound.playSealStamp();
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                    theme === 'parchment'
                      ? 'bg-[#e5d6be] border-[#8a6843] text-[#241a12] shadow-md ring-1 ring-[#8a6843]'
                      : 'bg-[#15100c] border-[#3a2a1b] text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-600" />
                  <strong className="font-heading">Parşömen El Yazması</strong>
                  <span className="text-[10px] opacity-75">Tarihi vellum kâğıdı, parlak oda &amp; gündüz</span>
                </button>
              </div>
            </div>

            {/* Hava Durumu Parçacık Katmanı */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-amber-400 block">
                2. Atmosferik Hava Durumu Parçacıkları
              </label>
              <div className="grid grid-cols-5 gap-1.5 text-[11px] font-heading font-bold">
                {[
                  { id: 'embers', label: 'Köz', icon: Flame, color: 'text-orange-400' },
                  { id: 'fog', label: 'Sis', icon: CloudFog, color: 'text-stone-300' },
                  { id: 'rain', label: 'Yağmur', icon: CloudRain, color: 'text-cyan-400' },
                  { id: 'storm', label: 'Fırtına', icon: CloudRain, color: 'text-indigo-400' },
                  { id: 'none', label: 'Kapalı', icon: X, color: 'text-stone-500' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = weather === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playSealStamp();
                        onWeatherChange(item.id as WeatherType);
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isSelected
                          ? 'bg-[#312014] border-amber-400 text-amber-200 ring-1 ring-amber-400'
                          : 'bg-[#15100c] border-[#3a2a1b] text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ses & Mabed Çanı Testi */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-amber-400 block">
                3. Mabed Çanları &amp; Ses Testi
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => sound.playTempleBell('uyanis')}
                  className="px-3 py-1.5 rounded-lg bg-[#201812] hover:bg-[#322319] text-xs border border-[#443322] text-[#d6c7b2] flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Uyanış Çanı</span>
                </button>
                <button
                  onClick={() => sound.playTempleBell('koruma')}
                  className="px-3 py-1.5 rounded-lg bg-[#201812] hover:bg-[#322319] text-xs border border-[#443322] text-[#d6c7b2] flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Koruma Çanı</span>
                </button>
                <button
                  onClick={() => sound.playBladeClash()}
                  className="px-3 py-1.5 rounded-lg bg-[#201812] hover:bg-[#322319] text-xs border border-[#443322] text-[#d6c7b2] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Kılıç Çarpışması</span>
                </button>
              </div>
            </div>

            {/* Veri Yedekleme ve Sıfırlama */}
            <div className="space-y-2 pt-2 border-t border-[#3a2a1b]">
              <label className="text-xs font-heading font-bold text-amber-400 block">
                4. Kayıt Verileri &amp; Arşiv Yedekleme
              </label>
              <div className="flex gap-2 flex-wrap text-xs">
                <button
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-lg bg-[#1e1711] hover:bg-[#2b2017] border border-[#4a3623] text-amber-300 flex items-center gap-1.5"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Yedeği İndir (JSON)</span>
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-[#1e1711] hover:bg-[#2b2017] border border-[#4a3623] text-amber-300 flex items-center gap-1.5 cursor-pointer">
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Yedek Yükle</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>

                {!resetConfirmed ? (
                  <button
                    onClick={() => setResetConfirmed(true)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 flex items-center gap-1.5 ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Verileri Sıfırla</span>
                  </button>
                ) : (
                  <button
                    onClick={handleClearAllData}
                    className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-bold flex items-center gap-1.5 ml-auto animate-pulse"
                  >
                    <span>Emin misin? (Tüm Veriler Silinecek)</span>
                  </button>
                )}
              </div>
            </div>

            {/* 5. Özel PNG Logo Yükleme & Yönetimi */}
            <div className="space-y-2 pt-2 border-t border-[#3a2a1b]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-heading font-bold text-amber-400 block">
                  5. Özel PNG Logo (Oyun Giriş Logosu)
                </label>
                {customLogoActive && (
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    Özel PNG Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400 font-serif leading-relaxed">
                Kendi PNG logonuzu yükleyerek giriş sayfasında birebir 1:1 yüksek çözünürlükte kullanabilirsiniz. Saydam veya desenli her tür PNG dosyasını anında işler.
              </p>
              <div className="flex gap-2 flex-wrap items-center pt-1">
                <label className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-900/60 to-amber-800/60 hover:from-amber-800 hover:to-amber-700 border border-amber-600/70 text-amber-200 text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-[1.02]">
                  <Image className="w-3.5 h-3.5 text-amber-300" />
                  <span>PNG Logo Seç &amp; Yükle</span>
                  <input
                    type="file"
                    accept="image/png,image/webp,image/svg+xml,image/jpeg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {customLogoActive && (
                  <button
                    onClick={handleResetLogo}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                    <span>Varsayılan Vektör Logoya Dön</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CREDITS MODALI */}
      {activeModal === 'credits' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full parchment-sheet rounded-2xl border-2 border-amber-600/80 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => {
                sound.playSealStamp();
                setActiveModal('none');
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 border-b border-[#443322] pb-4">
              <div className="w-12 h-12 rounded-full wax-seal-gold mx-auto flex items-center justify-center text-amber-950 font-bold shadow">
                <Award className="w-6 h-6 text-amber-900" />
              </div>
              <h2 className="font-heading font-black text-xl text-amber-300 tracking-wide">
                LEGEND OF THE COUNCIL
              </h2>
              <span className="text-[11px] font-serif text-[#b8a792] block">
                Emeği Geçenler, Tasarım &amp; Kanun Mimarisi
              </span>
            </div>

            {/* Credits Body */}
            <div className="space-y-4 text-xs font-serif text-[#ded1bd] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#140e0a] border border-[#3b2a1a] space-y-1">
                <strong className="font-heading text-amber-300 block text-sm">
                  ❖ Oyun &amp; Dünya Tasarımı
                </strong>
                <p>
                  <strong>Legend of the Council</strong>, karanlık fantezi edebiyatı ve teolojik entrikalardan ilham alan; güç, yozlaşma, hanedan sadakati ve irade üzerine kurulu bir masaüstü rol yapma sistemidir.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#140e0a] border border-[#3b2a1a] space-y-1">
                <strong className="font-heading text-amber-300 block text-sm">
                  ❖ Kural Motoru &amp; Mekanikler
                </strong>
                <p>
                  <strong>Fate Core System</strong> (Evil Hat Productions) temelleri üzerinde inşa edilmiş; 4dF zar matematiği, 14 Özgün Yaklaşım, 10 Basamaklı Ölçek Merdiveni ve Dello Saf Muharebe Arenası ile zenginleştirilmiştir.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#140e0a] border border-[#3b2a1a] space-y-1">
                <strong className="font-heading text-amber-300 block text-sm">
                  ❖ Tipografi, Görsel &amp; Ses Tasarımı
                </strong>
                <p>
                  Cinzel &amp; Crimson Pro tipografisi, fırçalanmış antika mabed altını ve tarihi parşömen el yazması arayüzü, Web Audio API prosedürel mabed çanları ve parçacık efektleriyle atmosferik hale getirilmiştir.
                </p>
              </div>

              <div className="text-center pt-2">
                <span className="font-heading font-bold text-amber-400 text-xs tracking-wider block">
                  &quot;Aron hanar, Edron rion. Ezra gharan tod dor.&quot;
                </span>
                <span className="text-[10px] text-stone-500 italic block mt-0.5">
                  (Altın kan, Demir birlik. Ölüme kadar savaşırız.)
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  sound.playSealStamp();
                  setActiveModal('none');
                }}
                className="px-6 py-2 rounded-xl wax-seal text-white font-heading font-bold text-xs hover:brightness-110 shadow-lg"
              >
                Kapat &amp; Geri Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
