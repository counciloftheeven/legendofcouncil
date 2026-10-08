import React from 'react';
import { Hane, HANELER, Karakter } from '../rules';
import { Shield, BookOpen, Skull, Map, Volume2, Users, ScrollText, Sparkles, Feather, Bell, MessageSquare, Compass, Crown, Backpack, Zap, Lock } from 'lucide-react';
import { sound } from '../utils/audio';
import { AmbienceControls } from './AmbienceControls';
import { LegendOfTheCouncilLogo } from './LegendOfTheCouncilLogo';

export type TabType =
  | 'board'
  | 'sheet'
  | 'skills'
  | 'creator'
  | 'dialogue'
  | 'fight'
  | 'inventory'
  | 'map'
  | 'ambience'
  | 'npc'
  | 'campaign'
  | 'oracle'
  | 'rules'
  | 'admin';

interface HeaderNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
  setRol: (rol: 'Anlatıcı' | 'Oyuncu') => void;
  aktifKarakter: Karakter;
  karakterler: Karakter[];
  onKarakterSec: (id: string) => void;
  onZarAc: () => void;
  theme?: 'obsidian' | 'parchment';
  onToggleTheme?: () => void;
  onOpenTitleScreen?: () => void;
  onOpenSaveModal?: () => void;
  onOpenMultiplayer?: () => void;
  onOpenChat?: () => void;
  onOpenFactions?: () => void;
  onOpenRandomEncounter?: () => void;
  spotlightPlayerId?: string | null;
  isAdminAuthenticated?: boolean;
  onRequireAdminAuth?: () => void;
  onLockAdmin?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  rol,
  setRol,
  aktifKarakter,
  karakterler,
  onKarakterSec,
  onZarAc,
  theme = 'obsidian',
  onToggleTheme,
  onOpenTitleScreen,
  onOpenSaveModal,
  onOpenMultiplayer,
  onOpenChat,
  onOpenFactions,
  onOpenRandomEncounter,
  spotlightPlayerId,
  isAdminAuthenticated = false,
  onRequireAdminAuth,
  onLockAdmin,
}) => {
  const haneInfo = HANELER[aktifKarakter.hane] || HANELER.Stallhart;

  const handleTabChange = (tab: TabType) => {
    const gmOnlyTabs: TabType[] = ['admin', 'npc', 'campaign', 'oracle', 'ambience'];
    if (gmOnlyTabs.includes(tab) && !isAdminAuthenticated && onRequireAdminAuth) {
      sound.playBladeClash();
      onRequireAdminAuth();
      return;
    }
    sound.playSealStamp();
    setActiveTab(tab);
  };

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xl transition-colors duration-300 ${
        theme === 'parchment'
          ? 'bg-[#f4ebe0]/95 border-[#9e7d54] text-[#241a12]'
          : 'bg-[#0e0c0a]/95 border-[#3d2e1e] text-[#f3eedd]'
      }`}
    >
      {/* Top Banner with House Heraldry and Role Selector */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and House Crest */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform hover:scale-105 cursor-pointer flex-shrink-0"
            style={{
              borderColor: haneInfo.renk,
              backgroundColor: haneInfo.ikincilRenk,
              color: haneInfo.renk,
            }}
            title={`${haneInfo.ad} - ${haneInfo.motto}`}
            onClick={() => handleTabChange('rules')}
          >
            <Shield className="w-5 h-5 drop-shadow" />
          </div>

          {/* LEGEND OF THE COUNCIL Resmi Oyun Logosu */}
          <div
            className="cursor-pointer flex items-center gap-2 group"
            onClick={() => handleTabChange('board')}
            title="Legend of the Council — Ana Masaüstü Ekranı"
          >
            <LegendOfTheCouncilLogo
              theme={theme}
              size="sm"
              className="group-hover:scale-[1.02] transition-transform"
            />
            <span
              className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-amber-900/60 hidden xl:inline"
              style={{ color: haneInfo.renk, borderColor: `${haneInfo.renk}66` }}
            >
              {haneInfo.ad.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Character selector & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Quick Party Seats */}
          <div className="hidden lg:flex items-center gap-1 bg-[#181410] p-0.5 rounded border border-[#443322]">
            {karakterler.slice(0, 4).map((c, i) => {
              const isSpotlight =
                spotlightPlayerId === c.ad ||
                spotlightPlayerId === c.id ||
                spotlightPlayerId === c.oyuncu;

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    sound.playSealStamp();
                    onKarakterSec(c.id);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all relative ${
                    isSpotlight
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.9)] ring-2 ring-amber-300 animate-pulse'
                      : aktifKarakter.id === c.id
                      ? 'bg-amber-500 text-stone-950 font-black shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title={`${c.ad} (${c.meslek}) ${isSpotlight ? '— 🔥 SÖZ SENDE!' : ''}`}
                >
                  {isSpotlight ? '🔥' : ''} P{i + 1}: {c.ad.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Active Character Quick Select */}
          <div className="flex items-center gap-1.5 bg-[#181410] border border-[#443322] px-2.5 py-1 rounded text-xs">
            <span className="text-[#8e7e6d]">Karakter:</span>
            <select
              value={aktifKarakter.id}
              onChange={(e) => onKarakterSec(e.target.value)}
              className="bg-transparent text-[#e8ded0] font-semibold focus:outline-none cursor-pointer"
            >
              {karakterler.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#181410] text-[#e8ded0]">
                  {c.ad} ({c.hane})
                </option>
              ))}
            </select>
          </div>

          {/* Role Toggle: GM vs Player */}
          <div className="flex items-center bg-[#181410] p-0.5 rounded border border-[#443322]">
            <button
              onClick={() => {
                setRol('Oyuncu');
                sound.playSealStamp();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                rol === 'Oyuncu'
                  ? 'bg-[#3b2a1a] text-[#f7e4be] border border-[#7a5833]'
                  : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
              }`}
              title="Oyuncu Rolü: Yalnızca kendi karakterinizi yönetin"
            >
              Oyuncu
            </button>
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setRol('Anlatıcı');
                  sound.playSealStamp();
                } else {
                  sound.playBladeClash();
                  onRequireAdminAuth?.();
                }
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${
                rol === 'Anlatıcı'
                  ? 'bg-[#6b1d1d] text-[#ffdfdf] border border-[#a83232]'
                  : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
              }`}
              title={
                isAdminAuthenticated
                  ? 'Anlatıcı (GM) Modu Açık'
                  : 'Şifreli GM Paneli (Craesx.121241411)'
              }
            >
              {isAdminAuthenticated ? (
                <Crown className="w-3 h-3 text-amber-300" />
              ) : (
                <Lock className="w-3 h-3 text-amber-500/80" />
              )}
              <span>Aldris (GM)</span>
            </button>
          </div>

          {/* Ambience Audio Controls */}
          <AmbienceControls />

          {/* Tema Değiştirici: Obsidyen Mahzen (Dark) vs Parşömen Elyazması (Light Codex) */}
          {onToggleTheme && (
            <button
              onClick={() => {
                sound.playSealStamp();
                onToggleTheme();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1.5 border shadow-sm ${
                theme === 'parchment'
                  ? 'bg-[#e5d6be] hover:bg-[#d8c5a8] text-[#2c1d11] border-[#8a6843]'
                  : 'bg-[#1e1711] hover:bg-[#2e2116] text-amber-300 border-[#4a3623]'
              }`}
              title={
                theme === 'parchment'
                  ? 'Karanlık Moda Geç (Obsidyen Mahzen)'
                  : 'Aydınlık Parşömen Moduna Geç (El Yazması Codex)'
              }
            >
              {theme === 'parchment' ? (
                <>
                  <span>📜</span>
                  <span className="hidden lg:inline font-heading text-[11px] font-bold">Parşömen</span>
                </>
              ) : (
                <>
                  <span>🌙</span>
                  <span className="hidden lg:inline font-heading text-[11px] font-bold">Obsidyen</span>
                </>
              )}
            </button>
          )}

          {/* Ana Menü / Giriş Ekranına Dön */}
          {onOpenTitleScreen && (
            <button
              onClick={() => {
                sound.playSealStamp();
                onOpenTitleScreen();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1.5 border shadow-sm ${
                theme === 'parchment'
                  ? 'bg-[#e5d6be] hover:bg-[#d8c5a8] text-[#2c1d11] border-[#8a6843]'
                  : 'bg-[#18120e] hover:bg-[#281c15] text-[#d6c7b2] hover:text-amber-200 border-[#4a3623]'
              }`}
              title="Giriş Ekranına / Ana Menüye Dön"
            >
              <span>🏛️</span>
              <span className="hidden sm:inline font-heading text-[11px] font-bold">Ana Menü</span>
            </button>
          )}

          {/* Seferi ve Oyunu Kaydet Butonu */}
          {onOpenSaveModal && (
            <button
              onClick={() => {
                sound.playSealStamp();
                onOpenSaveModal();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1.5 border shadow-sm ${
                theme === 'parchment'
                  ? 'bg-[#e5d6be] hover:bg-[#d8c5a8] text-[#2c1d11] border-[#8a6843]'
                  : 'bg-[#18120e] hover:bg-[#281c15] text-[#d6c7b2] hover:text-amber-200 border-[#4a3623]'
              }`}
              title="Mevcut Seferi ve Oyunu Kaydet / Yükle"
            >
              <span>💾</span>
              <span className="hidden sm:inline font-heading text-[11px] font-bold">Kaydet</span>
            </button>
          )}

          {/* Çevrimiçi Masa / Lobi Butonu */}
          {onOpenMultiplayer && (
            <button
              onClick={() => {
                sound.playSealStamp();
                onOpenMultiplayer();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1.5 border shadow-sm ${
                theme === 'parchment'
                  ? 'bg-[#dcead8] hover:bg-[#c9ddc4] text-[#1b2b18] border-[#6b8c66]'
                  : 'bg-[#121c13] hover:bg-[#1a2b1c] text-[#a4d4a8] hover:text-[#d2ebd4] border-[#29422b]'
              }`}
              title="Çevrimiçi Divan Masası & Lobi"
            >
              <span>🌐</span>
              <span className="hidden sm:inline font-heading text-[11px] font-bold">Online Lobi</span>
            </button>
          )}

          {/* 12 Hane İtibar Matrisi */}
          {onOpenFactions && (
            <button
              onClick={() => {
                sound.playSealStamp();
                onOpenFactions();
              }}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 border shadow-sm ${
                theme === 'parchment'
                  ? 'bg-[#e7dbca] hover:bg-[#d8c7b0] text-[#332213] border-[#8a6843]'
                  : 'bg-[#1b140e] hover:bg-[#2b1f15] text-amber-300 border-[#4a3623]'
              }`}
              title="12 Hane Entrika & İtibar Matrisi"
            >
              <span>⚖️</span>
              <span className="hidden xl:inline font-heading text-[11px] font-bold">12 Hane</span>
            </button>
          )}

          {/* Canlı Sohbet, Fısıltı & Zar Defteri */}
          {onOpenChat && (
            <button
              onClick={() => {
                sound.playSealStamp();
                onOpenChat();
              }}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all flex items-center gap-1 border shadow-sm ${
                theme === 'parchment'
                  ? 'bg-[#e7dbca] hover:bg-[#d8c7b0] text-[#332213] border-[#8a6843]'
                  : 'bg-[#1b140e] hover:bg-[#2b1f15] text-amber-300 border-[#4a3623]'
              }`}
              title="Canlı Sohbet, Fısıltı & Zar Defteri"
            >
              <span>📜</span>
              <span className="hidden xl:inline font-heading text-[11px] font-bold">Sohbet</span>
            </button>
          )}

          {/* GM Otomatik Kriz Üreteci */}
          {rol === 'Anlatıcı' && onOpenRandomEncounter && (
            <button
              onClick={() => {
                sound.playSealStamp();
                onOpenRandomEncounter();
              }}
              className="px-2 py-1 text-xs font-semibold rounded bg-[#29140a] hover:bg-[#3d1e0f] text-amber-300 border border-amber-600/70 shadow-sm flex items-center gap-1"
              title="GM Otomatik Karşılaşma & Kriz Üreteci"
            >
              <span>⚡</span>
              <span className="hidden xl:inline font-heading text-[11px] font-bold">Kriz</span>
            </button>
          )}

          {/* Quick Dice Roll Button */}
          <button
            onClick={() => {
              sound.playDiceRoll();
              onZarAc();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-heading font-bold rounded wax-seal text-white hover:brightness-110 active:scale-95 transition-all shadow-md"
            title="4dF Fate Zarı At"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ZAR AT (4dF)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 border-t border-[#2d2217] py-1 text-xs font-heading font-semibold">
        {rol === 'Oyuncu' ? (
          <>
            {/* OYUNCU MODU: Sade, Kalabalıktan Arındırılmış Karakter Odaklı Sekmeler */}
            <button
              onClick={() => handleTabChange('board')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'board'
                  ? 'bg-[#3b2a1a] text-amber-200 border-b-2 border-amber-400 ring-1 ring-amber-500/50 shadow-md font-bold'
                  : 'text-amber-400/90 hover:text-amber-200 hover:bg-[#1a140f]'
              }`}
              title="Masaüstü haritası, tokenlar ve canlı sahne görünümü"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>🗺️ Masaüstü &amp; Macera</span>
            </button>

            <button
              onClick={() => handleTabChange('sheet')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'sheet'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 shadow-md font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="Kendi karakterinizin özellikleri, Fate görünümleri ve stres tamponları"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>📜 Karakterim ({aktifKarakter.ad.split(' ')[0]})</span>
            </button>

            <button
              onClick={() => handleTabChange('inventory')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 shadow-sm font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="Taşınan eşyalar, silahlar, zırhlar ve Aron cüzdanı"
            >
              <Backpack className="w-3.5 h-3.5 text-amber-400" />
              <span>🎒 Envanterim</span>
            </button>

            <button
              onClick={() => handleTabChange('skills')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'skills'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 shadow-sm font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="Karakterinizin açtığı yetenekler ve kadim mühürler"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ Yeteneklerim</span>
            </button>

            <button
              onClick={() => handleTabChange('dialogue')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'dialogue'
                  ? 'bg-[#2a2016] text-indigo-200 border-b-2 border-indigo-500 shadow-sm font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="NPC'ler ve diğer oyuncularla rol yapma ve diyalog"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>💬 Rol Yapma &amp; Diyalog</span>
            </button>

            <button
              onClick={() => handleTabChange('fight')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'fight'
                  ? 'bg-[#2a2016] text-red-200 border-b-2 border-red-500 shadow-sm font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="Sıra tabanlı çatışma ve düello meydanı"
            >
              <Skull className="w-3.5 h-3.5 text-red-400" />
              <span>⚔️ Savaş &amp; Hamle</span>
            </button>

            <button
              onClick={() => handleTabChange('rules')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'rules'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="Fate kuralları, merdiven ve yaklaşım tablosu"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>📖 Kural Rehberi</span>
            </button>

            {/* Oyuncu görünümünün en sağında şifreli GM giriş butonu */}
            <div className="ml-auto flex items-center pl-2">
              <button
                onClick={() => onRequireAdminAuth?.()}
                className="px-2.5 py-1 rounded bg-[#1f150e] hover:bg-[#2e1f14] text-stone-400 hover:text-amber-300 border border-[#443322] flex items-center gap-1.5 transition-colors text-[11px]"
                title="Oyun Yöneticisi Girişi (Craesx.121241411)"
              >
                <Lock className="w-3 h-3 text-amber-500/80" />
                <span>GM Girişi</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ANLATICI (GM) MODU: Tam Teşekküllü Oyun Yöneticisi ve Hikaye Menüsü */}
            <button
              onClick={() => handleTabChange('admin')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-950 text-amber-200 border-b-2 border-amber-400 ring-1 ring-amber-400 font-bold shadow-md'
                  : 'text-amber-400 hover:text-amber-200 hover:bg-[#1a140f]'
              }`}
              title="Hikaye, dünya ve kural parametrelerini yönetin"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>👑 GM Yönetim Paneli</span>
            </button>

            <button
              onClick={() => handleTabChange('board')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'board'
                  ? 'bg-[#3b2a1a] text-amber-200 border-b-2 border-amber-400 ring-1 ring-amber-500/50 shadow-md font-bold'
                  : 'text-amber-400/90 hover:text-amber-200 hover:bg-[#1a140f]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>🗺️ Masaüstü Sahnesi</span>
            </button>

            <button
              onClick={() => handleTabChange('npc')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'npc'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 font-bold shadow-sm'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="NPC ve düşman havuzu, yeni tehdit ekleme ve sahneye çağırma"
            >
              <Users className="w-3.5 h-3.5 text-indigo-300" />
              <span>👥 NPC &amp; Düşmanlar</span>
            </button>

            <button
              onClick={() => handleTabChange('fight')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'fight'
                  ? 'bg-[#2a2016] text-red-200 border-b-2 border-red-500 font-bold shadow-sm'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
            >
              <Skull className="w-3.5 h-3.5 text-red-400" />
              <span>⚔️ Savaş Masası</span>
            </button>

            <button
              onClick={() => handleTabChange('sheet')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'sheet'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="Partideki tüm oyuncuların karakter kâğıtlarını inceleyin"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>📜 Karakter Kâğıtları</span>
            </button>

            <button
              onClick={() => handleTabChange('map')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'map'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-cyan-400" />
              <span>🗺️ Dünya Haritası</span>
            </button>

            <button
              onClick={() => handleTabChange('campaign')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'campaign'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
              title="GM senaryo notları, gizli komplo planları ve sefer defteri"
            >
              <ScrollText className="w-3.5 h-3.5 text-amber-400" />
              <span>📖 Kampanya Defteri</span>
            </button>

            <button
              onClick={() => handleTabChange('dialogue')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'dialogue'
                  ? 'bg-[#2a2016] text-indigo-200 border-b-2 border-indigo-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>💬 Diyalog &amp; Sahne</span>
            </button>

            <button
              onClick={() => handleTabChange('oracle')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'oracle'
                  ? 'bg-[#2a2016] text-purple-200 border-b-2 border-purple-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>🔮 Aldris Kâhini</span>
            </button>

            <button
              onClick={() => handleTabChange('ambience')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'ambience'
                  ? 'bg-[#2a2016] text-emerald-200 border-b-2 border-emerald-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>🔊 Ambiyans &amp; Çanlar</span>
            </button>

            <button
              onClick={() => handleTabChange('rules')}
              className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'rules'
                  ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500 font-bold'
                  : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>📖 Kurallar</span>
            </button>

            {/* GM Kilitleme / Oyuncu Moduna Dön Butonu */}
            <div className="ml-auto flex items-center pl-2">
              <button
                onClick={() => {
                  sound.playBladeClash();
                  onLockAdmin?.();
                }}
                className="px-2.5 py-1 rounded bg-[#2e1515] hover:bg-[#451c1c] text-red-300 border border-red-800 flex items-center gap-1.5 transition-colors text-[11px] font-bold"
                title="GM Yetkisini Kilitle & Oyuncu Moduna Dön"
              >
                <Lock className="w-3 h-3 text-red-400" />
                <span>GM Kilitle</span>
              </button>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};
