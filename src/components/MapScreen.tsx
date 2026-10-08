import React, { useState } from 'react';
import { EyaletInfo, EYALETLER } from '../data/initialData';
import { sound } from '../utils/audio';
import {
  MapPin,
  Eye,
  EyeOff,
  Navigation,
  Compass,
  AlertTriangle,
  Briefcase,
  Calendar,
  Shield,
  Coins,
  Scroll,
  Plus
} from 'lucide-react';

interface MapScreenProps {
  rol: 'Anlatıcı' | 'Oyuncu';
  eyaletler?: EyaletInfo[];
  onEyaletGuncelle?: (yeni: EyaletInfo[]) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  rol,
  eyaletler: propEyaletler,
  onEyaletGuncelle,
}) => {
  const [internalEyaletler, setInternalEyaletler] = useState<EyaletInfo[]>(EYALETLER);
  const eyaletler = propEyaletler || internalEyaletler;
  const setEyaletler = (yeni: EyaletInfo[] | ((prev: EyaletInfo[]) => EyaletInfo[])) => {
    if (typeof yeni === 'function') {
      const guncel = yeni(eyaletler);
      if (onEyaletGuncelle) onEyaletGuncelle(guncel);
      else setInternalEyaletler(guncel);
    } else {
      if (onEyaletGuncelle) onEyaletGuncelle(yeni);
      else setInternalEyaletler(yeni);
    }
  };
  const [seciliEyaletId, setSeciliEyaletId] = useState<string>(eyaletler[0].id);
  const [grupKonumId, setGrupKonumId] = useState<string>(eyaletler[0].id);
  const [mevsim, setMevsim] = useState<'Kış' | 'İlkbahar' | 'Yaz' | 'Sonbahar'>('Kış');
  const [aktifOlay, setAktifOlay] = useState<string>('Büyük Kıtlık ve Galetsha Vergi İsyanı');
  const [haritaGorseli, setHaritaGorseli] = useState<string>('');

  const seciliEyalet = eyaletler.find((e) => e.id === seciliEyaletId) || eyaletler[0];
  const grupEyalet = eyaletler.find((e) => e.id === grupKonumId) || eyaletler[0];

  // Savaş Sisi Aç/Kapa
  const toggleSavasSisi = (id: string) => {
    sound.playSealStamp();
    setEyaletler((prev) =>
      prev.map((e) => (e.id === id ? { ...e, kesfedildi: !e.kesfedildi } : e))
    );
  };

  // Grubu Taşı & Yolculuk Süresi
  const handleGrubuTasi = (hedefId: string) => {
    sound.playSealStamp();
    setGrupKonumId(hedefId);
  };

  // İki eyalet arası tahmini yolculuk günü hesabı
  const hesaplaYolculukGunu = (e1: EyaletInfo, e2: EyaletInfo) => {
    const dx = e1.x - e2.x;
    const dy = e1.y - e2.y;
    const mesafe = Math.sqrt(dx * dx + dy * dy);
    return Math.max(1, Math.round(mesafe / 12));
  };

  const yolculukGunu = hesaplaYolculukGunu(grupEyalet, seciliEyalet);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Harita Üst Barı: Mevsim, Olay Takvimi & Grup Durumu */}
      <div className="parchment-sheet p-4 rounded-xl border border-[#503d2b] shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center text-amber-200">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading font-black text-xl text-amber-200">
              Stallhart İmparatorluk Haritası
            </h1>
            <p className="text-xs text-[#a99c8b]">
              Grup Mevcut Konumu: <strong className="text-amber-300">{grupEyalet.ad}</strong>
            </p>
          </div>
        </div>

        {/* Mevsim & Olay Panosu */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-[#17120e] px-2.5 py-1.5 rounded border border-[#443322]">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[#8e7e6d]">Mevsim:</span>
            <select
              value={mevsim}
              onChange={(e) => setMevsim(e.target.value as any)}
              className="bg-transparent text-amber-200 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Kış" className="bg-[#17120e]">Karakış (Zor Sefer)</option>
              <option value="İlkbahar" className="bg-[#17120e]">İlkbahar (Çamur Mevsimi)</option>
              <option value="Yaz" className="bg-[#17120e]">Yaz (Hasat &amp; Savaş)</option>
              <option value="Sonbahar" className="bg-[#17120e]">Sonbahar (Yaprak Dökümü)</option>
            </select>
          </div>

          <div className="bg-[#17120e] px-3 py-1.5 rounded border border-[#443322] flex items-center gap-2">
            <span className="text-red-400 font-bold text-[11px]">Havadis:</span>
            <span className="text-[#d8cebe] text-[11px] truncate max-w-[200px] sm:max-w-xs">
              {aktifOlay}
            </span>
          </div>
        </div>
      </div>

      {/* Harita ve Eyalet Detay Izgarası */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SOL: İnteraktif Harita Tuvali (7 cols) */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#54412e] shadow-2xl bg-[#110e0b]">
            {/* Eskitilmiş Harita Dokusu ve Kılavuz Çizgileri */}
            <div className="absolute inset-0 bg-[radial-gradient(#241a12_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Arka Plan Harita Görseli (Eğer kullanıcı yüklerse) */}
            {haritaGorseli && (
              <img
                src={haritaGorseli}
                alt="Stallhart Haritası"
                className="absolute inset-0 w-full h-full object-cover sepia-[0.4] opacity-50"
              />
            )}

            {/* Pusula Gülü */}
            <div className="absolute top-4 right-4 text-amber-500/30 pointer-events-none">
              <Compass className="w-16 h-16 animate-spin-slow" />
            </div>

            {/* 13 Eyalet Pinleri */}
            {eyaletler.map((e) => {
              const isSelected = e.id === seciliEyaletId;
              const isGroupHere = e.id === grupKonumId;
              const isFogged = !e.kesfedildi && rol === 'Oyuncu';

              return (
                <div
                  key={e.id}
                  style={{ left: `${e.x}%`, top: `${e.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  {/* Savaş Sisi Örtüsü */}
                  {!e.kesfedildi && (
                    <div className="absolute -inset-4 bg-black/80 rounded-full blur-md pointer-events-none" />
                  )}

                  <button
                    onClick={() => {
                      sound.playSealStamp();
                      setSeciliEyaletId(e.id);
                    }}
                    className={`relative p-1.5 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 border-white scale-125 shadow-lg'
                        : isGroupHere
                        ? 'bg-cyan-500 text-stone-950 border-cyan-200 ring-2 ring-cyan-400 animate-bounce'
                        : 'bg-[#1e1711] text-amber-300 border-[#654d35] hover:scale-110'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>

                  {/* Eyalet İsim Etiketi */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-heading font-bold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                      isSelected
                        ? 'bg-amber-950 text-amber-200 border border-amber-600 opacity-100'
                        : 'bg-black/90 text-[#d8cebe] opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {isFogged ? 'Bilinmeyen Topraklar' : e.ad}
                    {isGroupHere && ' (Grup)'}
                  </div>
                </div>
              );
            })}

            {/* Sol Altta Harita Bilgi Kutusu */}
            <div className="absolute bottom-3 left-3 bg-black/85 p-2 rounded border border-[#443322] text-[10px] text-[#baa896] space-y-0.5 pointer-events-none">
              <div>• Kırmızı Puanlar: Eyalet Başkentleri</div>
              <div>• Mavi Parıltı: Maceracı Grubunun Konumu</div>
            </div>
          </div>
        </div>

        {/* SAĞ: Eyalet Detayı & Şehir İş Panosu (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Eyalet Bilgi Kartı */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
            <div className="flex items-center justify-between border-b border-[#3e2e1f] pb-2 mb-3">
              <div>
                <h2 className="font-heading font-black text-lg text-amber-200">
                  {seciliEyalet.ad}
                </h2>
                <span className="text-xs text-[#9d8d7a]">
                  Hane: <strong className="text-amber-300">{seciliEyalet.hane}</strong> • Vali: {seciliEyalet.vali}
                </span>
              </div>

              {rol === 'Anlatıcı' && (
                <button
                  onClick={() => toggleSavasSisi(seciliEyalet.id)}
                  className="p-1.5 rounded bg-[#2b1f15] hover:bg-[#3d2c1e] text-[#d8cebe] border border-[#523d2b]"
                  title={seciliEyalet.kesfedildi ? 'Savaş Sisi ile Kapat' : 'Savaş Sisini Aç'}
                >
                  {seciliEyalet.kesfedildi ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-stone-500" />
                  )}
                </button>
              )}
            </div>

            <p className="text-xs text-[#b8ab9a] italic leading-relaxed mb-3">
              &quot;{seciliEyalet.tarihce}&quot;
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-[#18130e] p-2 rounded border border-[#3e2e20]">
                <span className="text-[10px] text-[#867563] block">Nüfus:</span>
                <span className="font-mono font-bold text-amber-200">
                  {seciliEyalet.nufus}
                </span>
              </div>
              <div className="bg-[#18130e] p-2 rounded border border-[#3e2e20]">
                <span className="text-[10px] text-[#867563] block">Geçim:</span>
                <span className="font-bold text-[#cfc1b0] truncate block">
                  {seciliEyalet.gecim}
                </span>
              </div>
            </div>

            {/* Grubu Buraya Taşı Butonu */}
            <div className="flex items-center justify-between bg-[#201811] p-2 rounded border border-[#443322]">
              <span className="text-xs text-[#a49684]">
                Yolculuk Mesafesi: <strong className="text-amber-300">{yolculukGunu} Gün</strong>
              </span>
              <button
                onClick={() => handleGrubuTasi(seciliEyalet.id)}
                disabled={grupKonumId === seciliEyalet.id}
                className="px-3 py-1 rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 text-xs font-bold disabled:opacity-40 border border-[#6b5034]"
              >
                {grupKonumId === seciliEyalet.id ? 'Mevcut Konum' : 'Grubu Taşı'}
              </button>
            </div>
          </div>

          {/* Şehir İş Panosu (Job Board: Güvenli, Riskli, Tuzak) */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow">
            <h3 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e1f] pb-1.5 mb-3 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>{seciliEyalet.ad} İş Panosu</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Güvenli İş */}
              <div className="p-2.5 rounded bg-[#161a14] border border-emerald-900/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-300">
                    [Güvenli] {seciliEyalet.isPanosu.guvenli.baslik}
                  </span>
                  <span className="text-amber-400 font-mono font-bold text-[11px]">
                    {seciliEyalet.isPanosu.guvenli.odul}
                  </span>
                </div>
                <p className="text-[#a8b8a0] text-[11px]">
                  {seciliEyalet.isPanosu.guvenli.detay}
                </p>
              </div>

              {/* Riskli İş */}
              <div className="p-2.5 rounded bg-[#201a14] border border-amber-900/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-300">
                    [Riskli] {seciliEyalet.isPanosu.riskli.baslik}
                  </span>
                  <span className="text-amber-400 font-mono font-bold text-[11px]">
                    {seciliEyalet.isPanosu.riskli.odul}
                  </span>
                </div>
                <p className="text-[#c5b59e] text-[11px]">
                  {seciliEyalet.isPanosu.riskli.detay}
                </p>
              </div>

              {/* Tuzak İş */}
              <div className="p-2.5 rounded bg-[#221313] border border-red-900/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-red-300">
                    [Tuzak] {seciliEyalet.isPanosu.tuzak.baslik}
                  </span>
                  <span className="text-amber-400 font-mono font-bold text-[11px]">
                    {seciliEyalet.isPanosu.tuzak.odul}
                  </span>
                </div>
                <p className="text-[#d0aba9] text-[11px]">
                  {seciliEyalet.isPanosu.tuzak.detay}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
