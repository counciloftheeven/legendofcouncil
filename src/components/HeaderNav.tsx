import React from 'react';
import { Hane, HANELER, Karakter } from '../rules';
import { Shield, BookOpen, Skull, Map, Volume2, Users, ScrollText, Sparkles, Feather, Bell } from 'lucide-react';
import { sound } from '../utils/audio';

export type TabType =
  | 'sheet'
  | 'creator'
  | 'fight'
  | 'map'
  | 'ambience'
  | 'npc'
  | 'campaign'
  | 'oracle'
  | 'rules';

interface HeaderNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
  setRol: (rol: 'Anlatıcı' | 'Oyuncu') => void;
  aktifKarakter: Karakter;
  karakterler: Karakter[];
  onKarakterSec: (id: string) => void;
  onZarAc: () => void;
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
}) => {
  const haneInfo = HANELER[aktifKarakter.hane] || HANELER.Stallhart;

  const handleTabChange = (tab: TabType) => {
    sound.playSealStamp();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0e0c0a]/95 backdrop-blur-md border-b border-[#3d2e1e] shadow-xl">
      {/* Top Banner with House Heraldry and Role Selector */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and House Crest */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
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
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black tracking-widest text-lg sm:text-xl text-[#f3eedd]">
                STALLHART
              </span>
              <span
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-amber-900/60"
                style={{ color: haneInfo.renk, borderColor: `${haneInfo.renk}66` }}
              >
                {haneInfo.ad.split(' ')[0]}
              </span>
            </div>
            <p className="text-[11px] text-[#a89b88] italic font-serif hidden sm:block">
              &quot;{haneInfo.motto}&quot;
            </p>
          </div>
        </div>

        {/* Character selector & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
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
            >
              Oyuncu
            </button>
            <button
              onClick={() => {
                setRol('Anlatıcı');
                sound.playSealStamp();
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1 ${
                rol === 'Anlatıcı'
                  ? 'bg-[#6b1d1d] text-[#ffdfdf] border border-[#a83232]'
                  : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
              }`}
            >
              <Feather className="w-3 h-3" />
              Aldris (GM)
            </button>
          </div>

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
        <button
          onClick={() => handleTabChange('sheet')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'sheet'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Karakter Kâğıdı</span>
        </button>

        <button
          onClick={() => handleTabChange('creator')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'creator'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Sihirbaz (Yeni)</span>
        </button>

        <button
          onClick={() => handleTabChange('fight')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'fight'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <Skull className="w-3.5 h-3.5 text-red-400" />
          <span>Savaş &amp; Düello</span>
        </button>

        <button
          onClick={() => handleTabChange('map')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'map'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <Map className="w-3.5 h-3.5 text-cyan-400" />
          <span>Harita &amp; Eyaletler</span>
        </button>

        <button
          onClick={() => handleTabChange('ambience')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'ambience'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ambiyans &amp; Çanlar</span>
        </button>

        <button
          onClick={() => handleTabChange('npc')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'npc'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-300" />
          <span>NPC &amp; Tehditler</span>
        </button>

        <button
          onClick={() => handleTabChange('campaign')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'campaign'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <ScrollText className="w-3.5 h-3.5" />
          <span>Kampanya Defteri</span>
        </button>

        <button
          onClick={() => handleTabChange('oracle')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'oracle'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Aldris Kâhini (Gemini)</span>
        </button>

        <button
          onClick={() => handleTabChange('rules')}
          className={`px-3 py-1.5 rounded flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'rules'
              ? 'bg-[#2a2016] text-amber-200 border-b-2 border-amber-500'
              : 'text-[#9c8e7c] hover:text-[#f0e6d6] hover:bg-[#1a140f]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Kural Ansiklopedisi</span>
        </button>
      </nav>
    </header>
  );
};
