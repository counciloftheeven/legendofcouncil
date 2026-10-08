import React, { useState } from 'react';
import { Karakter, YaklasimAdi, YAKLASIMLAR } from '../rules';
import { WeatherType } from './AmbientWeatherCanvas';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Heart,
  Brain,
  Shield,
  CloudRain,
  Flame,
  CloudFog,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Crown,
  Feather,
  MessageSquare,
  Users,
  Swords,
  Scroll
} from 'lucide-react';

interface FloatingQuickBarProps {
  karakter: Karakter;
  onKarakterGuncelle: (guncel: Karakter) => void;
  onZarAt: (yaklasim?: YaklasimAdi) => void;
  onQuickRoll?: (beceri: string, nitelik?: string) => void;
  weather: WeatherType;
  onWeatherChange: (w: WeatherType) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
  onToggleGmConsole?: () => void;
  gmConsoleOpen?: boolean;
  theme?: 'obsidian' | 'parchment';
  onToggleTheme?: () => void;
  onOpenChat?: () => void;
  onOpenFactions?: () => void;
  onOpenRandomEncounter?: () => void;
}

export const FloatingQuickBar: React.FC<FloatingQuickBarProps> = ({
  karakter,
  onKarakterGuncelle,
  onZarAt,
  onQuickRoll,
  weather,
  onWeatherChange,
  rol,
  onToggleGmConsole,
  gmConsoleOpen,
  theme = 'obsidian',
  onToggleTheme,
  onOpenChat,
  onOpenFactions,
  onOpenRandomEncounter,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [weatherMenuOpen, setWeatherMenuOpen] = useState(false);
  const [approachMenuOpen, setApproachMenuOpen] = useState(false);

  // Fate Points
  const handleFatePointChange = (delta: number) => {
    sound.playSealStamp();
    const guncelKP = Math.max(0, (karakter.kaderPuani ?? 3) + delta);
    onKarakterGuncelle({ ...karakter, kaderPuani: guncelKP });
  };

  const fizikselDolu = karakter.yaraHatlari?.fiziksel?.filter(Boolean).length || 0;
  const zihinselDolu = karakter.yaraHatlari?.zihinsel?.filter(Boolean).length || 0;

  return (
    <div className="fixed bottom-3 right-3 z-40 flex flex-col items-end gap-2 no-print">
      {/* Weather Selector Menu */}
      {weatherMenuOpen && (
        <div className="parchment-sheet p-2.5 rounded-xl border border-[#5a422d] shadow-2xl flex flex-col gap-1.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="text-[10px] uppercase font-bold text-amber-300 px-1">Atmosferik Hava:</span>
          {(
            [
              { id: 'embers', label: '🔥 Köz & Küller' },
              { id: 'fog', label: '🌫️ Karasu Sisi' },
              { id: 'rain', label: '🌧️ Sağanak Yağmur' },
              { id: 'storm', label: '⚡ Fırtına & Şimşek' },
              { id: 'none', label: '✕ Kapalı' },
            ] as { id: WeatherType; label: string }[]
          ).map((w) => (
            <button
              key={w.id}
              onClick={() => {
                sound.playSealStamp();
                onWeatherChange(w.id);
                setWeatherMenuOpen(false);
              }}
              className={`px-2.5 py-1 rounded text-left font-medium transition-colors ${
                weather === w.id
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'text-[#ded0be] hover:bg-[#2e2115]'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      )}

      {/* Quick Approach Roll Menu */}
      {approachMenuOpen && (
        <div className="parchment-sheet p-3 rounded-2xl border-2 border-amber-600/80 shadow-2xl w-64 text-xs space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-[#443020] pb-1">
            <span className="font-heading font-black text-amber-200">Tek Tıkla Zar (Click-to-Roll):</span>
            <button onClick={() => setApproachMenuOpen(false)} className="text-stone-400 hover:text-white">
              ✕
            </button>
          </div>

          {/* Quick Click-to-Roll Top Skills */}
          <div className="border-b border-[#443020] pb-2 space-y-1">
            <span className="text-[10px] text-amber-400 font-bold block uppercase font-mono">Beceriler:</span>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              {[
                { name: 'Fight', label: '🗡️ Kılıç', val: karakter.beceriler.Fight },
                { name: 'Shoot', label: '🏹 Yay', val: karakter.beceriler.Shoot },
                { name: 'Stealth', label: '👤 Gizlilik', val: karakter.beceriler.Stealth },
                { name: 'Investigate', label: '🔍 Dikkat', val: karakter.beceriler.Investigate },
                { name: 'Lore', label: '📜 Bilgi', val: karakter.beceriler.Lore },
                { name: 'ProvokeManipulate', label: '🗣️ Baskı', val: karakter.beceriler.ProvokeManipulate ?? 0 },
              ].map((b) => (
                <button
                  key={b.name}
                  onClick={() => {
                    if (onQuickRoll) onQuickRoll(b.name);
                    else onZarAt();
                    setApproachMenuOpen(false);
                  }}
                  className="p-1 rounded bg-[#2a1c12] hover:bg-amber-800/80 border border-amber-600/50 text-[#f5ebd7] flex flex-col items-center transition-colors"
                >
                  <span className="truncate">{b.label}</span>
                  <span className="font-mono font-bold text-amber-300">+{b.val}</span>
                </button>
              ))}
            </div>
          </div>

          <span className="text-[10px] text-stone-400 font-mono block">14 Kadim Yaklaşım:</span>
          <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
            {Object.keys(YAKLASIMLAR).map((y) => {
              const val = karakter.yaklasimlar?.[y as YaklasimAdi] ?? 0;
              return (
                <button
                  key={y}
                  onClick={() => {
                    sound.playDiceRoll();
                    onZarAt(y as YaklasimAdi);
                    setApproachMenuOpen(false);
                  }}
                  className="p-1.5 rounded bg-[#1c150e] hover:bg-amber-900/60 border border-[#3b2a1a] flex items-center justify-between text-[#eadecd] text-[11px]"
                >
                  <span className="truncate">{y}</span>
                  <span className="font-mono font-bold text-amber-400">+{val}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="parchment-sheet p-2 rounded-2xl border-2 border-[#54412e] shadow-2xl flex items-center gap-2.5 bg-[#140f0c]/95 backdrop-blur-md">
        {/* Toggle Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-xl bg-[#24170d] hover:bg-[#382415] border border-[#443020] text-amber-300 flex items-center justify-center transition-transform"
          title={collapsed ? 'Genişlet' : 'Daralt'}
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {!collapsed && (
          <>
            {/* Karakter Mini Portre & İsim */}
            <div className="flex items-center gap-2 pl-1">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-500 bg-black flex-shrink-0">
                <img
                  src={karakter.fotoUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
                  alt={karakter.ad}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-black text-xs text-amber-200 block leading-tight max-w-[90px] truncate">
                  {karakter.ad}
                </span>
                <span className="text-[9px] text-[#9a8976] block leading-tight">
                  {karakter.hane}
                </span>
              </div>
            </div>

            {/* Can & Zihin Tamponları */}
            <div className="flex items-center gap-2 border-l border-[#3a291a] pl-2 text-[10px] font-mono">
              <div className="flex items-center gap-1" title="Fiziksel Yara Tamponu (3 Kutu)">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span className={fizikselDolu > 0 ? 'text-rose-400 font-bold' : 'text-stone-400'}>
                  {fizikselDolu}/3
                </span>
              </div>
              <div className="flex items-center gap-1" title="Zihinsel Yara Tamponu (3 Kutu)">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span className={zihinselDolu > 0 ? 'text-indigo-400 font-bold' : 'text-stone-400'}>
                  {zihinselDolu}/3
                </span>
              </div>
            </div>

            {/* Fate Puanı (KP) */}
            <div className="flex items-center gap-1 border-l border-[#3a291a] pl-2">
              <span className="text-amber-400 font-bold text-xs" title="Kader Puanı (Fate Points)">
                ★
              </span>
              <span className="font-mono font-black text-xs text-amber-300">
                {karakter.kaderPuani ?? 3}
              </span>
              <button
                onClick={() => handleFatePointChange(1)}
                className="w-4 h-4 rounded bg-[#271b12] text-amber-300 text-[10px] flex items-center justify-center font-bold hover:bg-amber-900/60"
                title="+1 Kader Puanı Al"
              >
                +
              </button>
              <button
                onClick={() => handleFatePointChange(-1)}
                className="w-4 h-4 rounded bg-[#271b12] text-stone-400 text-[10px] flex items-center justify-center font-bold hover:bg-red-950"
                title="-1 Kader Puanı Harca"
              >
                -
              </button>
            </div>

            {/* Aktif Durum İkonları */}
            {karakter.durumlar && karakter.durumlar.length > 0 && (
              <div className="hidden md:flex items-center gap-1 border-l border-[#3a291a] pl-2">
                {karakter.durumlar.slice(0, 3).map((d, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-[#24170d] text-[9px] border border-amber-800 text-amber-200 font-bold truncate max-w-[80px]"
                    title={d}
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}

            {/* Hava Durumu Düğmesi */}
            <button
              onClick={() => {
                sound.playSealStamp();
                setWeatherMenuOpen(!weatherMenuOpen);
              }}
              className="p-1.5 rounded-xl bg-[#24180f] hover:bg-[#382618] border border-[#443221] text-amber-300 transition-colors"
              title="Atmosferik Hava Durumu Katmanı"
            >
              {weather === 'embers' ? (
                <Flame className="w-3.5 h-3.5 text-orange-400" />
              ) : weather === 'fog' ? (
                <CloudFog className="w-3.5 h-3.5 text-stone-400" />
              ) : weather === 'rain' || weather === 'storm' ? (
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <CloudFog className="w-3.5 h-3.5 text-stone-600" />
              )}
            </button>

            {/* 12 Hane İtibar Butonu */}
            {onOpenFactions && (
              <button
                onClick={() => {
                  sound.playSealStamp();
                  onOpenFactions();
                }}
                className="p-1.5 rounded-xl bg-[#24180f] hover:bg-[#382618] border border-[#443221] text-amber-300 transition-colors flex items-center gap-1 shadow"
                title="12 Hane Entrika & İtibar Matrisi"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline text-[10px] font-bold">12 Hane</span>
              </button>
            )}

            {/* Divan Sohbeti & Fısıltı */}
            {onOpenChat && (
              <button
                onClick={() => {
                  sound.playSealStamp();
                  onOpenChat();
                }}
                className="p-1.5 rounded-xl bg-[#24180f] hover:bg-[#382618] border border-[#443221] text-amber-300 transition-colors flex items-center gap-1 shadow"
                title="Canlı Sohbet, Fısıltı & Zar Defteri"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline text-[10px] font-bold">Sohbet</span>
              </button>
            )}

            {/* GM Rastgele Karşılaşma Üreteci */}
            {rol === 'Anlatıcı' && onOpenRandomEncounter && (
              <button
                onClick={() => {
                  sound.playSealStamp();
                  onOpenRandomEncounter();
                }}
                className="p-1.5 rounded-xl bg-[#26150a] hover:bg-[#3a200f] border border-amber-600/70 text-amber-300 transition-colors flex items-center gap-1 shadow"
                title="GM Otomatik Kriz & Karşılaşma Üreteci"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xl:inline text-[10px] font-bold">Kriz Üret</span>
              </button>
            )}

            {/* Tema Değiştirici: Obsidyen vs Parşömen */}
            {onToggleTheme && (
              <button
                onClick={() => {
                  sound.playSealStamp();
                  onToggleTheme();
                }}
                className={`p-1.5 rounded-xl border transition-colors ${
                  theme === 'parchment'
                    ? 'bg-[#e5d6be] hover:bg-[#d8c5a8] text-[#2c1d11] border-[#8a6843]'
                    : 'bg-[#24180f] hover:bg-[#382618] text-amber-300 border-[#443221]'
                }`}
                title={
                  theme === 'parchment'
                    ? 'Karanlık Moda Geç (Obsidyen Mahzen)'
                    : 'Aydınlık Moda Geç (Parşömen El Yazması)'
                }
              >
                <span className="text-xs">{theme === 'parchment' ? '📜' : '🌙'}</span>
              </button>
            )}

            {/* GM Kumanda Konsolu Aç/Kapa (Yalnızca Anlatıcı) */}
            {rol === 'Anlatıcı' && onToggleGmConsole && (
              <button
                onClick={() => {
                  sound.playSealStamp();
                  onToggleGmConsole();
                }}
                className={`p-1.5 rounded-xl border transition-colors flex items-center gap-1 ${
                  gmConsoleOpen
                    ? 'bg-rose-950 text-rose-300 border-rose-600 shadow-md ring-1 ring-rose-500'
                    : 'bg-[#2b1818] hover:bg-[#3d1f1f] text-rose-300 border-[#6b2c2c]'
                }`}
                title="Canlı Anlatıcı (GM) Kumanda Konsolunu Aç/Kapat"
              >
                <Feather className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden lg:inline text-[10px] font-bold">GM Konsolu</span>
              </button>
            )}

            {/* Hızlı 4dF Zar At */}
            <button
              onClick={() => setApproachMenuOpen(!approachMenuOpen)}
              className="px-3 py-1.5 rounded-xl wax-seal text-white font-heading font-black text-xs flex items-center gap-1.5 shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>4dF AT</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
