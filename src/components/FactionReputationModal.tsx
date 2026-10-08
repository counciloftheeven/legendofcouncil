import React, { useState } from 'react';
import { Karakter, HANELER } from '../rules';
import { sound } from '../utils/audio';
import { Shield, Sparkles, X, ChevronUp, ChevronDown, Award, Crown, AlertTriangle, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FactionReputationModalProps {
  isOpen: boolean;
  onClose: () => void;
  karakter: Karakter;
  onKarakterGuncelle: (guncel: Karakter) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
}

interface HaneItibarData {
  id: string;
  ad: string;
  amblem: string;
  renk: string;
  unvan: string;
  motto: string;
  varsayilanPuan: number;
  bolge: string;
  etki: string;
}

export const ONIKI_HANELER: HaneItibarData[] = [
  { id: 'Stallhart', ad: 'Stallhart Hanesi', amblem: '👑', renk: '#eab308', unvan: 'Kurultay Hanedanı', motto: 'Taş aşınır, Kurultay baki kalır.', varsayilanPuan: 2, bolge: 'Arava Sarayı', etki: 'Yüksek divan kararlarında veto ve saray muhafızı koruması.' },
  { id: 'Selya', ad: 'Selya Hanesi', amblem: '☀️', renk: '#800020', unvan: 'Güneş Rıhtımı', motto: 'Karanlığı sadece yanan kan arındırır.', varsayilanPuan: 1, bolge: 'Selyanya Rıhtımları', etki: 'Liman ticaretinde vergi muafiyeti ve kalyon desteği.' },
  { id: 'Arhan', ad: 'Arhan Hanesi', amblem: '🍷', renk: '#8b1e2f', unvan: 'Gözün & Kadehin Efendileri', motto: 'En tatlı kadeh, son yudumdur.', varsayilanPuan: 0, bolge: 'Galetsha Şatosu', etki: 'Gizli casus fısıltıları ve zehir panzehir tedariği.' },
  { id: 'Onneva', ad: 'Onneva Hanesi', amblem: '🦅', renk: '#dc2626', unvan: 'Kül & Anka Ovası', motto: 'Yanmayan demir şekil almaz.', varsayilanPuan: 0, bolge: 'Onneva Ovası', etki: 'Ağır süvari desteği ve savaş iaşesi tedariği.' },
  { id: 'Solgar', ad: 'Solgar Hanesi', amblem: '🪲', renk: '#0284c7', unvan: 'Göl Ticaret Birliği', motto: 'Rüzgarın yönünü sadece kanatları titreyen bilir.', varsayilanPuan: 1, bolge: 'Solgar Gölleri', etki: 'Sıfır faizli Aron borçlanması ve tefeci kalkanı.' },
  { id: 'Liandryl', ad: 'Liandryl Hanesi', amblem: '🌿', renk: '#16a34a', unvan: 'Eski Kan Aristokrasisi', motto: 'Kökler derin, dallar yüksek.', varsayilanPuan: -1, bolge: 'Çukurtepe', etki: 'Kadim elf mühürleri ve orman geçitlerinde dokunulmazlık.' },
  { id: 'Adamen', ad: 'Adamen Hanesi', amblem: '⛏️', renk: '#991b1b', unvan: 'Dağ & Yakut Ocağı', motto: 'Çekiç iner, kader eğrilir.', varsayilanPuan: 1, bolge: 'Adamen Madenleri', etki: 'Efsanevi plaka zırhlar ve cüce tahkimat ustaları.' },
  { id: 'Mabed', ad: 'Kutsal Mabed Engizisyonu', amblem: '⚖️', renk: '#d97706', unvan: 'Lomera Kanun Gözcüleri', motto: 'Terazi eğilmez, adalet yanmaz.', varsayilanPuan: 0, bolge: 'Büyük Katedral', etki: 'Leke arındırma ayinleri ve Engizisyon yargısından muafiyet.' },
  { id: 'Khasinya', ad: 'Khasinya Hanesi', amblem: '❄️', renk: '#06b6d4', unvan: 'Buz & Kemik Bozkırı', motto: 'Soğuk unutmaz, fırtına affetmez.', varsayilanPuan: -1, bolge: 'Khasin Boğazı', etki: 'Buz kurdu gözcüleri ve soğuğa bağışıklık rünleri.' },
  { id: 'Galetsha', ad: 'Galetsha Hanesi', amblem: '🗝️', renk: '#ca8a04', unvan: 'Kilit & Arşiv Loncası', motto: 'Açılmayan kapı, yazılmamış kanundur.', varsayilanPuan: 0, bolge: 'Kütüphane Hisarı', etki: 'Kozmik haritalar ve gizli kriptoların şifre çözümü.' },
  { id: 'Memanth', ad: 'Memanth Hanesi', amblem: '🛡️', renk: '#57534e', unvan: 'Granit Hudut Kalkanı', motto: 'Taş yıkılmadan sınır düşmez.', varsayilanPuan: 0, bolge: 'Doğu Tahkimatı', etki: 'Sınır karakollarında sığınma ve kalkan duvarı birliği.' },
  { id: 'Z_ela', ad: 'Z\'ela Hanesi', amblem: '🐍', renk: '#15803d', unvan: 'Zümrüt Yılan Bataklığı', motto: 'Gölgeye basan, zehri tadar.', varsayilanPuan: -2, bolge: 'Karasu Bataklığı', etki: 'Suikast kontratları ve görünmez gölge sığınağı.' },
];

export const FactionReputationModal: React.FC<FactionReputationModalProps> = ({
  isOpen,
  onClose,
  karakter,
  onKarakterGuncelle,
  rol,
}) => {
  if (!isOpen) return null;

  // Stored reputation values in character or default
  const itibarlar: Record<string, number> = (karakter as any).haneItibarlari || {};

  const getPuan = (id: string, defaultVal: number): number => {
    return itibarlar[id] !== undefined ? itibarlar[id] : defaultVal;
  };

  const handlePuanDegistir = (id: string, delta: number, defaultVal: number) => {
    const current = getPuan(id, defaultVal);
    const yeni = Math.max(-5, Math.min(5, current + delta));
    sound.playSealStamp();

    if (yeni === 5) {
      sound.playTempleBell('zafer' as any);
      confetti({ particleCount: 30, spread: 50 });
    }

    const guncel = {
      ...karakter,
      haneItibarlari: {
        ...itibarlar,
        [id]: yeni,
      },
    };
    onKarakterGuncelle(guncel);
  };

  const getDurumEtiketi = (puan: number) => {
    if (puan >= 4) return { text: 'Yeminli Müttefik', color: 'text-amber-300 bg-amber-950 border-amber-600' };
    if (puan >= 2) return { text: 'Dostane', color: 'text-emerald-400 bg-emerald-950 border-emerald-700' };
    if (puan >= -1) return { text: 'Nötr / Mesafeli', color: 'text-stone-300 bg-stone-900 border-stone-700' };
    if (puan >= -3) return { text: 'Şüpheli & Gergin', color: 'text-orange-400 bg-orange-950 border-orange-700' };
    return { text: 'Kan Davalı (Düşman)', color: 'text-red-400 bg-red-950 border-red-700' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full parchment-sheet rounded-2xl border-2 border-amber-600/80 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playSealStamp();
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#443322] pb-3">
          <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center text-amber-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <span>12 HANE ENTRİKA & İTİBAR MATRİSİ</span>
              <span className="text-xs bg-[#24170e] text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-600/50 font-mono">
                {karakter.ad} ({karakter.hane})
              </span>
            </h2>
            <p className="text-xs text-[#eedec8] font-serif italic">
              Divan siyasetinde kiminle müttefik, kiminle kan davalı olduğunuzu canlı takip edin (-5 ile +5 arası).
            </p>
          </div>
        </div>

        {/* 12 Factions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto pr-1">
          {ONIKI_HANELER.map((hane) => {
            const puan = getPuan(hane.id, hane.varsayilanPuan);
            const durum = getDurumEtiketi(puan);
            const isMyHouse = karakter.hane === hane.id;

            return (
              <div
                key={hane.id}
                className={`p-3.5 rounded-xl bg-[#140e0a] border-2 transition-all space-y-2 relative shadow-md ${
                  isMyHouse
                    ? 'border-amber-400/90 bg-[#21150c]/90 ring-1 ring-amber-400/50'
                    : 'border-[#3a291a] hover:border-amber-600/60'
                }`}
              >
                {/* House Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0" title={hane.unvan}>
                      {hane.amblem}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-bold text-sm text-[#f5ebd7] truncate" style={{ color: hane.renk }}>
                          {hane.ad}
                        </h4>
                        {isMyHouse && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600 font-mono font-bold">
                            Öz Hane
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400 font-serif block truncate">
                        {hane.unvan} • {hane.bolge}
                      </span>
                    </div>
                  </div>

                  {/* Standing Badge */}
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap ${durum.color}`}>
                    {durum.text} ({puan >= 0 ? `+${puan}` : puan})
                  </span>
                </div>

                {/* Motto */}
                <p className="text-[11px] font-serif italic text-stone-400/90 pl-1 border-l-2 border-stone-700">
                  &quot;{hane.motto}&quot;
                </p>

                {/* Alliance Benefit */}
                <div className="text-[10px] text-amber-200/80 bg-[#1c120a] p-1.5 rounded border border-[#382618]">
                  <strong className="text-amber-400 font-serif not-italic">İttifak Ayrıcalığı:</strong> {hane.etki}
                </div>

                {/* Reputation Balance Bar & Interactive Adjuster */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#291b10]">
                  <span className="text-[10px] text-stone-400 font-mono">
                    İtibar İbresi:
                  </span>

                  {/* Visual Bar (-5 to +5) */}
                  <div className="flex-1 flex gap-0.5 h-2 bg-[#251810] rounded p-0.5 border border-[#443322]">
                    {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((val) => {
                      const isActive = val <= puan;
                      return (
                        <div
                          key={val}
                          className={`flex-1 rounded-sm transition-all ${
                            isActive
                              ? val > 0
                                ? 'bg-amber-400'
                                : val < 0
                                ? 'bg-red-500'
                                : 'bg-stone-400'
                              : 'bg-transparent'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Plus / Minus Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePuanDegistir(hane.id, -1, hane.varsayilanPuan)}
                      disabled={puan <= -5}
                      className="w-6 h-6 rounded bg-[#2a1b12] hover:bg-[#3d2719] disabled:opacity-30 border border-[#553b26] text-stone-200 flex items-center justify-center text-xs font-mono font-bold"
                      title="İtibarı Düşür (-1)"
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-mono text-xs font-bold text-amber-300">
                      {puan}
                    </span>
                    <button
                      onClick={() => handlePuanDegistir(hane.id, 1, hane.varsayilanPuan)}
                      disabled={puan >= 5}
                      className="w-6 h-6 rounded bg-[#2a1b12] hover:bg-[#3d2719] disabled:opacity-30 border border-[#553b26] text-stone-200 flex items-center justify-center text-xs font-mono font-bold"
                      title="İtibarı Yükselt (+1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
