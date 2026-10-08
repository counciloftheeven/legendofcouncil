import React, { useState } from 'react';
import { Karakter, YaklasimAdi, fateAtisiHesapla } from '../rules';
import { sound } from '../utils/audio';
import {
  Feather,
  Sparkles,
  Heart,
  Brain,
  Skull,
  Flame,
  Shield,
  Send,
  AlertTriangle,
  RotateCcw,
  Eye,
  Crown,
  X,
  Volume2,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GmStorytellerConsoleProps {
  karakterler: Karakter[];
  onKarakterGuncelle: (guncel: Karakter) => void;
  onAnlatiYayinla: (metin: string) => void;
  onFisiltiGonder: (aliciId: string, metin: string) => void;
  onClose: () => void;
}

export const GmStorytellerConsole: React.FC<GmStorytellerConsoleProps> = ({
  karakterler,
  onKarakterGuncelle,
  onAnlatiYayinla,
  onFisiltiGonder,
  onClose,
}) => {
  const [seciliKarakterId, setSeciliKarakterId] = useState<string>(karakterler[0]?.id || '');
  const [fisiltiMetni, setFisiltiMetni] = useState('');
  const [anlatiMetni, setAnlatiMetni] = useState('');
  const [gizliZarSonuc, setGizliZarSonuc] = useState<string | null>(null);

  const seciliKarakter = karakterler.find((c) => c.id === seciliKarakterId) || karakterler[0];

  // Yara / Stres / KP Güncelleme
  const handleWoundToggle = (type: 'fiziksel' | 'zihinsel', index: number) => {
    sound.playBladeClash();
    if (!seciliKarakter) return;
    const current = [...(seciliKarakter.yaraHatlari?.[type] || [false, false, false])] as [
      boolean,
      boolean,
      boolean
    ];
    current[index] = !current[index];

    onKarakterGuncelle({
      ...seciliKarakter,
      yaraHatlari: {
        ...seciliKarakter.yaraHatlari,
        [type]: current,
      },
    });
  };

  const handleKPDelta = (delta: number) => {
    sound.playSealStamp();
    if (!seciliKarakter) return;
    const guncelKP = Math.max(0, (seciliKarakter.kaderPuani ?? 3) + delta);
    onKarakterGuncelle({ ...seciliKarakter, kaderPuani: guncelKP });
  };

  // Loth Leke Sayacı (0..10)
  const handleLekeDelta = (delta: number) => {
    sound.playSealStamp();
    if (!seciliKarakter) return;
    const mevcutLeke = seciliKarakter.sayaclar?.leke ?? 0;
    const yeniLeke = Math.max(0, Math.min(10, mevcutLeke + delta));

    onKarakterGuncelle({
      ...seciliKarakter,
      sayaclar: {
        ...seciliKarakter.sayaclar,
        leke: yeniLeke,
      },
    });
  };

  // Durum Ekle / Kaldır
  const handleDurumToggle = (durumAdi: string) => {
    sound.playSealStamp();
    if (!seciliKarakter) return;
    const durumlar = seciliKarakter.durumlar || [];
    const varMi = durumlar.includes(durumAdi);
    const yeni = varMi ? durumlar.filter((d) => d !== durumAdi) : [...durumlar, durumAdi];

    onKarakterGuncelle({
      ...seciliKarakter,
      durumlar: yeni,
    });
  };

  // Gizli GM Zarı
  const handleGizliZar = (zorluk: number) => {
    sound.playDiceRoll();
    const atis = fateAtisiHesapla(0, zorluk);
    setGizliZarSonuc(
      `Gizli Zar (${atis.derece}, Net: ${atis.sift >= 0 ? `+${atis.sift}` : atis.sift}) ➔ ${atis.sonucTuru}`
    );
  };

  // Hızlı Anlatı Gönder
  const handleAnlatiGonder = () => {
    if (!anlatiMetni.trim()) return;
    sound.playSealStamp();
    onAnlatiYayinla(anlatiMetni.trim());
    setAnlatiMetni('');
  };

  // Kişiye Özel Fısıltı Gönder
  const handleFisiltiGonderClick = () => {
    if (!fisiltiMetni.trim() || !seciliKarakter) return;
    sound.playSealStamp();
    onFisiltiGonder(seciliKarakter.id, fisiltiMetni.trim());
    setFisiltiMetni('');
  };

  if (!seciliKarakter) return null;

  return (
    <div className="fixed bottom-16 right-3 sm:right-6 z-50 w-full max-w-xl parchment-sheet p-4 rounded-2xl border-2 border-rose-700/80 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200 bg-[#160f0c]/98 backdrop-blur-md text-xs">
      {/* Başlık & Kapat */}
      <div className="flex items-center justify-between border-b border-rose-900/60 pb-2">
        <div className="flex items-center gap-2">
          <Feather className="w-4 h-4 text-rose-400" />
          <h2 className="font-heading font-black text-sm text-rose-200 uppercase tracking-widest">
            ANLATICI (GM) CANLI KUMANDA KONSOLU
          </h2>
        </div>
        <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Karakter Seçici ve Canlı İstatistikleri */}
      <div className="p-3 rounded-xl bg-[#120d09] border border-[#3b2a1a] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold text-amber-400">Hedef Karakter:</span>
          <select
            value={seciliKarakterId}
            onChange={(e) => setSeciliKarakterId(e.target.value)}
            className="bg-[#1b140e] border border-[#443020] rounded px-2.5 py-1 text-xs text-[#f1e5d4]"
          >
            {karakterler.map((c) => (
              <option key={c.id} value={c.id}>
                {c.ad} ({c.hane})
              </option>
            ))}
          </select>
        </div>

        {/* Can / Stres / KP / Leke Göstergeleri */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          {/* Fiziksel Yara */}
          <div className="p-2 rounded-lg bg-[#19110d] border border-[#3f2a1b] space-y-1">
            <span className="text-[9px] font-bold text-rose-400 block">Fiziksel Yara</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => handleWoundToggle('fiziksel', i)}
                  className={`w-5 h-5 rounded border font-mono text-[9px] font-bold ${
                    seciliKarakter.yaraHatlari?.fiziksel?.[i]
                      ? 'bg-rose-900 border-rose-500 text-rose-200'
                      : 'bg-[#120e0b] border-[#443020] text-stone-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Zihinsel Stres */}
          <div className="p-2 rounded-lg bg-[#19110d] border border-[#3f2a1b] space-y-1">
            <span className="text-[9px] font-bold text-indigo-400 block">Zihinsel Stres</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => handleWoundToggle('zihinsel', i)}
                  className={`w-5 h-5 rounded border font-mono text-[9px] font-bold ${
                    seciliKarakter.yaraHatlari?.zihinsel?.[i]
                      ? 'bg-indigo-900 border-indigo-500 text-indigo-200'
                      : 'bg-[#120e0b] border-[#443020] text-stone-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Kader Puanı */}
          <div className="p-2 rounded-lg bg-[#19110d] border border-[#3f2a1b] space-y-1">
            <span className="text-[9px] font-bold text-amber-400 block">Kader Puanı</span>
            <div className="flex items-center gap-1.5 font-mono font-bold">
              <span className="text-amber-300 text-sm">{seciliKarakter.kaderPuani ?? 3}</span>
              <button
                onClick={() => handleKPDelta(1)}
                className="w-4 h-4 rounded bg-[#2a1c12] text-amber-300 hover:bg-amber-900/60"
              >
                +
              </button>
              <button
                onClick={() => handleKPDelta(-1)}
                className="w-4 h-4 rounded bg-[#2a1c12] text-stone-400 hover:bg-red-950"
              >
                -
              </button>
            </div>
          </div>

          {/* Leke Sayacı (Loth Corruption) */}
          <div className="p-2 rounded-lg bg-[#19110d] border border-purple-900/60 space-y-1">
            <span className="text-[9px] font-bold text-purple-300 block">Leke (Corruption)</span>
            <div className="flex items-center gap-1.5 font-mono font-bold">
              <span className="text-purple-300 text-sm">
                {seciliKarakter.sayaclar?.leke ?? 0} / 10
              </span>
              <button
                onClick={() => handleLekeDelta(1)}
                className="w-4 h-4 rounded bg-purple-950 text-purple-300 hover:bg-purple-900"
                title="Leke Ekle (+1)"
              >
                +
              </button>
              <button
                onClick={() => handleLekeDelta(-1)}
                className="w-4 h-4 rounded bg-purple-950 text-stone-400 hover:bg-stone-800"
                title="Leke Düşür (-1)"
              >
                -
              </button>
            </div>
          </div>
        </div>

        {/* Hızlı Durum Efekti Verme */}
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-stone-400 block">
            Hızlı Durum Efekti Bahşet / Kaldır:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {[
              'Kanamalı',
              'Zehirlenmiş',
              'Alevler İçinde',
              'Sersemlemiş',
              'Körleşmiş',
              'Dehşet İçinde',
              'Kutsanmış',
              'Odaklanmış',
              'Çelik Siper',
            ].map((d) => {
              const active = seciliKarakter.durumlar?.includes(d);
              return (
                <button
                  key={d}
                  onClick={() => handleDurumToggle(d)}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                    active
                      ? 'bg-amber-600 text-stone-950 border-amber-300 font-bold'
                      : 'bg-[#1b140e] text-[#a99c8b] border-[#443020] hover:bg-[#2b1f15]'
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hızlı Anlatı Fısıltısı ve Yayınlama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tüm Masaya Anlatı Tasviri */}
        <div className="p-3 rounded-xl bg-[#120d09] border border-[#3b2a1a] space-y-2">
          <span className="text-[10px] font-bold text-amber-300 block">
            📢 Tüm Masaya Sahne Tasviri:
          </span>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={anlatiMetni}
              onChange={(e) => setAnlatiMetni(e.target.value)}
              placeholder="Örn: Ufukta şimşek çaktı, kaleden boru sesi yükseldi..."
              className="flex-1 bg-[#18110b] border border-[#443020] rounded px-2 py-1 text-xs text-[#f1e5d4] focus:outline-none"
            />
            <button
              onClick={handleAnlatiGonder}
              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
            >
              Yayınla
            </button>
          </div>
        </div>

        {/* Seçili Karakterin Zihnine Fısıltı */}
        <div className="p-3 rounded-xl bg-[#120d09] border border-[#3b2a1a] space-y-2">
          <span className="text-[10px] font-bold text-indigo-300 block">
            🤫 {seciliKarakter.ad}&apos;a Gizli Fısıltı:
          </span>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={fisiltiMetni}
              onChange={(e) => setFisiltiMetni(e.target.value)}
              placeholder="Örn: Koridordaki gölgenin nefesini ensende hissettin..."
              className="flex-1 bg-[#18110b] border border-[#443020] rounded px-2 py-1 text-xs text-[#f1e5d4] focus:outline-none"
            />
            <button
              onClick={handleFisiltiGonderClick}
              className="px-2.5 py-1 rounded bg-indigo-900 hover:bg-indigo-800 text-indigo-200 font-bold"
            >
              Fısılda
            </button>
          </div>
        </div>
      </div>

      {/* Gizli GM Zarı */}
      <div className="p-2.5 rounded-xl bg-[#120d09] border border-[#3b2a1a] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-[#baa896]">Gizli GM Zarı:</span>
          {[
            { dc: 2, label: 'Makul (+2)' },
            { dc: 4, label: 'Harika (+4)' },
            { dc: 6, label: 'Efsanevi (+6)' },
          ].map((item) => (
            <button
              key={item.dc}
              onClick={() => handleGizliZar(item.dc)}
              className="px-2 py-0.5 rounded bg-[#201710] hover:bg-[#342417] border border-[#443020] text-stone-300 text-[10px]"
            >
              {item.label}
            </button>
          ))}
        </div>

        {gizliZarSonuc && (
          <span className="text-[10px] font-mono font-bold text-amber-300 truncate">
            {gizliZarSonuc}
          </span>
        )}
      </div>
    </div>
  );
};
