import React, { useState } from 'react';
import {
  Karakter,
  HANELER,
  MESLEKLER,
  hesaplaMaksYaraKutusu,
  hesaplaMaksYuk,
  hesaplaToplamAgirlik,
  hesaplaSavunma,
  hesaplaToplamZirh,
  Nitelikler,
  Beceriler,
} from '../rules';
import { sound } from '../utils/audio';
import { MarkdownNotes } from './MarkdownNotes';
import {
  Shield,
  Heart,
  AlertTriangle,
  Award,
  Coins,
  Package,
  Sparkles,
  Flame,
  Eye,
  Plus,
  Minus,
  Download,
  Scroll,
  Printer,
  Skull
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CharacterSheetProps {
  karakter: Karakter;
  onKarakterGuncelle: (yeniKarakter: Karakter) => void;
  onZarAtHizli: (nitelik?: keyof Nitelikler, beceri?: keyof Beceriler) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  karakter,
  onKarakterGuncelle,
  onZarAtHizli,
  rol,
}) => {
  const haneInfo = HANELER[karakter.hane] || HANELER.Stallhart;
  const meslekInfo = MESLEKLER[karakter.meslek];

  const maksYara = hesaplaMaksYaraKutusu(karakter.nitelikler.CON);
  const maksYuk = hesaplaMaksYuk(karakter.nitelikler.STR);
  const toplamAgirlik = hesaplaToplamAgirlik(karakter.envanter);
  const toplamZirh = hesaplaToplamZirh(karakter.envanter);
  const savunmaPuani = hesaplaSavunma(karakter.nitelikler.DEX, karakter.envanter);

  const isLekeTehlikeli = karakter.sayaclar.leke >= 6;
  const isSupheTehlikeli = karakter.sayaclar.supheli >= 5;

  const [yeniEsyaAd, setYeniEsyaAd] = useState('');
  const [yeniEsyaYuk, setYeniEsyaYuk] = useState(1);
  const [yeniEsyaFiyat, setYeniEsyaFiyat] = useState(2);
  const [yeniYaraIzi, setYeniYaraIzi] = useState('');

  // Sayaç güncelleyiciler
  const updateSayac = (key: keyof Karakter['sayaclar'], val: number) => {
    sound.playSealStamp();
    onKarakterGuncelle({
      ...karakter,
      sayaclar: {
        ...karakter.sayaclar,
        [key]: Math.max(0, val),
      },
    });
  };

  const updateEkonomi = (key: keyof Karakter['ekonomi'], val: number) => {
    onKarakterGuncelle({
      ...karakter,
      ekonomi: {
        ...karakter.ekonomi,
        [key]: Math.max(0, val),
      },
    });
  };

  // Dert Tetikleme (Compel)
  const handleDertTetikle = () => {
    sound.playSealStamp();
    confetti({ particleCount: 25, spread: 50 });
    onKarakterGuncelle({
      ...karakter,
      sayaclar: {
        ...karakter.sayaclar,
        muhur: karakter.sayaclar.muhur + 1,
      },
    });
  };

  // Yeni Eşya Ekleme
  const handleEsyaEkle = () => {
    if (!yeniEsyaAd.trim()) return;
    const yeniEsya = {
      id: `esya_${Date.now()}`,
      ad: yeniEsyaAd.trim(),
      tur: 'Teçhizat' as const,
      fiyat: yeniEsyaFiyat,
      yuk: yeniEsyaYuk,
      aciklama: 'Karakterin sonradan edindiği teçhizat.',
    };
    onKarakterGuncelle({
      ...karakter,
      envanter: [...karakter.envanter, yeniEsya],
    });
    setYeniEsyaAd('');
  };

  const handleEsyaSil = (id: string) => {
    onKarakterGuncelle({
      ...karakter,
      envanter: karakter.envanter.filter((e) => e.id !== id),
    });
  };

  const handleYaraIziEkle = () => {
    if (!yeniYaraIzi.trim()) return;
    onKarakterGuncelle({
      ...karakter,
      yaraIzleri: [...karakter.yaraIzleri, yeniYaraIzi.trim()],
    });
    setYeniYaraIzi('');
  };

  return (
    <div
      className={`max-w-7xl mx-auto p-3 sm:p-6 transition-all duration-300 ${
        isLekeTehlikeli ? 'leke-corrupted' : ''
      }`}
    >
      {/* Corruption & Suspicion Alert Banners */}
      {isLekeTehlikeli && (
        <div className="mb-4 bg-purple-950/90 border-2 border-purple-500 p-3 rounded-lg flex items-center justify-between text-purple-200 animate-pulse shadow-lg">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-purple-400" />
            <span className="font-heading font-bold text-sm">
              LEKE SEVİYESİ {karakter.sayaclar.leke}/9: Büyü seni kullanmaya başladı!
            </span>
            <span className="text-xs text-purple-300 italic hidden sm:inline">
              Gerçekliğin dokusu bozuluyor, rünler ruhunu dağlıyor.
            </span>
          </div>
          <button
            onClick={() => updateSayac('leke', karakter.sayaclar.leke - 1)}
            className="text-xs bg-purple-900 hover:bg-purple-800 px-2 py-1 rounded font-semibold text-purple-100"
          >
            Arın (-1)
          </button>
        </div>
      )}

      {isSupheTehlikeli && (
        <div className="mb-4 bg-red-950/90 border-2 border-red-600 p-3 rounded-lg flex items-center justify-between text-red-200 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="font-heading font-bold text-sm">
              ŞÜPHE {karakter.sayaclar.supheli}/10: Engizisyon ve Avcılar Peşinde!
            </span>
            <span className="text-xs text-red-300 italic hidden sm:inline">
              Stallhart muhafızları ve Mabed cellatları iz sürüyor.
            </span>
          </div>
          <button
            onClick={() => updateSayac('supheli', karakter.sayaclar.supheli - 1)}
            className="text-xs bg-red-900 hover:bg-red-800 px-2 py-1 rounded font-semibold text-red-100"
          >
            İzi Kaybettir (-1)
          </button>
        </div>
      )}

      {/* Main Parchment Sheet Container */}
      <div className="parchment-sheet rounded-xl border-2 border-[#54412e] shadow-2xl p-4 sm:p-8 relative">
        {/* Top Header Strip */}
        <div className="border-b-2 border-[#4b3928] pb-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Portrait & Core Info */}
          <div className="flex items-center gap-4">
            {/* Framed Portrait */}
            <div
              className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border-2 shadow-2xl bg-black flex items-center justify-center"
              style={{ borderColor: haneInfo.renk }}
            >
              {karakter.fotoUrl ? (
                <img
                  src={karakter.fotoUrl}
                  alt={karakter.ad}
                  className="w-full h-full object-cover sepia-[0.3]"
                />
              ) : (
                <div className="text-center p-2">
                  <Skull className="w-8 h-8 mx-auto text-[#725a42] mb-1" />
                  <span className="text-[10px] text-[#937b62] font-mono">Portre Yok</span>
                </div>
              )}
              {/* House Seal in corner */}
              <div
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow"
                style={{ backgroundColor: haneInfo.renk, color: haneInfo.ikincilRenk }}
                title={haneInfo.ad}
              >
                {karakter.hane[0]}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-[#f3ece0] tracking-wide">
                  {karakter.ad}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded text-xs font-heading font-bold border"
                  style={{
                    backgroundColor: `${haneInfo.renk}22`,
                    borderColor: haneInfo.renk,
                    color: haneInfo.renk,
                  }}
                >
                  {haneInfo.ad}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#b0a18e]">
                <span>
                  <strong>Köken:</strong> {karakter.koken}
                </span>
                <span>•</span>
                <span>
                  <strong>Meslek:</strong> {karakter.meslek}
                </span>
                <span>•</span>
                <span>
                  <strong>Rütbe:</strong> {karakter.rutbe || 'Sıradan'}
                </span>
              </div>
              <p className="text-xs text-[#91816f] italic mt-1 font-serif">
                &quot;{haneInfo.motto}&quot;
              </p>
            </div>
          </div>

          {/* Quick Print & Fate Compel */}
          <div className="flex flex-wrap items-center gap-2">
            {rol === 'Anlatıcı' && (
              <button
                onClick={handleDertTetikle}
                className="px-3 py-1.5 text-xs font-heading font-bold rounded bg-[#5a1c1c] hover:bg-[#7a2222] text-[#ffe6e6] border border-red-700 shadow flex items-center gap-1.5"
                title="Karakterin Dert'ini aleyhine kullanarak ona 1 Mühür ver"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Dert Tetikle (+1 Mühür)</span>
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-[#271f18] hover:bg-[#382c22] text-[#d9cebe] border border-[#523f2f] flex items-center gap-1.5"
              title="Karakter Kâğıdını Yazdır veya PDF olarak kaydet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Yazdır / PDF</span>
            </button>
          </div>
        </div>

        {/* 3-Column Layout: Left (Attributes & Skills) | Center (Gauges & Stress) | Right (Inventory & Wealth) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Nitelikler & Beceriler & Hünerler (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Nitelikler */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-3 flex items-center justify-between">
                <span>Nitelikler (0 - 3)</span>
                <span className="text-[10px] text-[#867664] font-mono">Tıkla & Zar At</span>
              </h2>
              <div className="grid grid-cols-3 gap-2 text-center">
                {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as (keyof Nitelikler)[]).map((stat) => (
                  <button
                    key={stat}
                    onClick={() => onZarAtHizli(stat, undefined)}
                    className="p-2 rounded bg-[#201913] hover:bg-[#34271c] border border-[#503d2b] transition-all hover:scale-105 active:scale-95 text-left group"
                  >
                    <div className="text-[10px] font-heading font-bold text-[#b4a390] group-hover:text-amber-300">
                      {stat}
                    </div>
                    <div className="text-xl font-mono font-black text-amber-200">
                      +{karakter.nitelikler[stat]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Beceriler */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-3 flex items-center justify-between">
                <span>Beceriler (0 - 3)</span>
                <span className="text-[10px] text-[#867664] font-mono">Tıkla & Zar At</span>
              </h2>
              <div className="space-y-1.5">
                {(
                  [
                    ['Fight', 'Dövüş & Yakın Silah'],
                    ['Shoot', 'Atış & Menzilli'],
                    ['Stealth', 'Gizlilik & Sızma'],
                    ['Investigate', 'Araştırma & İz Sürme'],
                    ['Lore', 'Kadim Bilgi & Rün'],
                    ['ProvokeManipulate', 'Kışkırtma & Yalan'],
                  ] as [keyof Beceriler, string][]
                ).map(([beceriKey, etiket]) => (
                  <button
                    key={beceriKey}
                    onClick={() => onZarAtHizli(undefined, beceriKey)}
                    className="w-full flex items-center justify-between p-2 rounded bg-[#201913] hover:bg-[#34271c] border border-[#453423] text-left transition-colors group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#f1e5d4] group-hover:text-amber-200">
                        {beceriKey}
                      </div>
                      <div className="text-[10px] text-[#8e7e6d]">{etiket}</div>
                    </div>
                    <div className="text-base font-mono font-black text-cyan-300 bg-[#14100c] px-2 py-0.5 rounded border border-[#3e2e20]">
                      +{karakter.beceriler[beceriKey]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meslek Hünerleri ve Zaafı */}
            {meslekInfo && (
              <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
                <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-2">
                  {meslekInfo.ad} Hünerleri
                </h2>
                <div className="space-y-2 text-xs">
                  {meslekInfo.hunerler.map((h, i) => (
                    <div key={i} className="bg-[#201913] p-2 rounded border border-[#3b2b1d]">
                      <div className="font-bold text-amber-300">{h.ad}</div>
                      <div className="text-[#a49685] text-[11px] mt-0.5">{h.aciklama}</div>
                    </div>
                  ))}
                  {/* Zaaf */}
                  <div className="bg-[#2d1212] p-2 rounded border border-red-900/60 mt-3">
                    <div className="font-bold text-red-300 flex items-center gap-1">
                      <Skull className="w-3 h-3 text-red-400" />
                      <span>Zaaf: {meslekInfo.zaaf.ad}</span>
                    </div>
                    <div className="text-red-200/80 text-[11px] mt-0.5">
                      {meslekInfo.zaaf.aciklama}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CENTER COLUMN: Yara Kutuları, Sayaçlar, Görünüşler, Savunma (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Yara Kutuları & Yorgunluk */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-3 flex items-center justify-between">
                <span>Yara Kutuları (2 + CON: {maksYara})</span>
                <span className="text-xs text-red-400">
                  {karakter.sayaclar.alınanYaraKutulari} / {maksYara} Dolu
                </span>
              </h2>
              {/* Interactive checkboxes for wounds */}
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: maksYara }).map((_, i) => {
                  const isChecked = i < karakter.sayaclar.alınanYaraKutulari;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const yeniDeger = isChecked ? i : i + 1;
                        updateSayac('alınanYaraKutulari', yeniDeger);
                      }}
                      className={`flex-1 h-11 rounded border-2 flex items-center justify-center font-bold text-base transition-all ${
                        isChecked
                          ? 'bg-red-950 border-red-600 text-red-300'
                          : 'bg-[#221a14] border-[#55402d] text-[#715c48] hover:border-red-400'
                      }`}
                    >
                      {isChecked ? 'X' : i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Savunma & Zırh Kartı */}
              <div className="grid grid-cols-2 gap-2 text-center bg-[#201913] p-2.5 rounded border border-[#3e2e20]">
                <div>
                  <span className="text-[10px] text-[#93826f] uppercase font-heading block">
                    Savunma (DEX+Kalkan)
                  </span>
                  <span className="text-xl font-mono font-bold text-cyan-300">
                    +{savunmaPuani}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#93826f] uppercase font-heading block">
                    Zırh Eşiği
                  </span>
                  <span className="text-xl font-mono font-bold text-amber-300">
                    {toplamZirh}
                  </span>
                </div>
              </div>
            </div>

            {/* Mühür (Fate Puanı) ve Sayaçlar */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-3 flex items-center justify-between">
                <span>Kader &amp; Şüphe Sayaçları</span>
              </h2>

              {/* Mühür Jetonları */}
              <div className="bg-[#261d15] p-3 rounded border border-[#523d2b] mb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Mühür (Fate Jetonları)</span>
                  </div>
                  <div className="text-[10px] text-[#9c8d7b]">Başlangıç: 2 + Luck</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateSayac('muhur', karakter.sayaclar.muhur - 1)}
                    className="w-7 h-7 rounded bg-[#382b1e] hover:bg-[#4d3b2a] flex items-center justify-center text-amber-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono font-black text-xl text-amber-300">
                    {karakter.sayaclar.muhur}
                  </span>
                  <button
                    onClick={() => updateSayac('muhur', karakter.sayaclar.muhur + 1)}
                    className="w-7 h-7 rounded bg-[#382b1e] hover:bg-[#4d3b2a] flex items-center justify-center text-amber-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Yorgunluk (0 - 4) */}
              <div className="flex items-center justify-between p-2 rounded bg-[#201913] border border-[#3e2e20] mb-2">
                <span className="text-xs text-[#cfc2b1]">Yorgunluk (0 - 4)</span>
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((step) => (
                    <button
                      key={step}
                      onClick={() => updateSayac('yorgunluk', step)}
                      className={`w-6 h-6 rounded text-xs font-mono font-bold ${
                        karakter.sayaclar.yorgunluk >= step
                          ? 'bg-amber-700 text-white'
                          : 'bg-[#15100c] text-[#6b5946]'
                      }`}
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leke (0 - 9, 6+ da bozulma!) */}
              <div className="p-2 rounded bg-[#201913] border border-[#3e2e20] mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-300 font-semibold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-purple-400" />
                    <span>Leke (0 - 9) [6+ Bozulma]</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-300">
                    {karakter.sayaclar.leke} / 9
                  </span>
                </div>
                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateSayac('leke', i)}
                      className={`h-5 rounded text-[10px] font-mono font-bold ${
                        karakter.sayaclar.leke >= i
                          ? i >= 6
                            ? 'bg-purple-600 text-white animate-pulse'
                            : 'bg-purple-900 text-purple-200'
                          : 'bg-[#15100c] text-[#554333]'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Şüphe (0 - 10, 5+ da takip!) */}
              <div className="p-2 rounded bg-[#201913] border border-[#3e2e20]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-red-300 font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-red-400" />
                    <span>Şüphe (0 - 10) [5+ Takip]</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-red-300">
                    {karakter.sayaclar.supheli} / 10
                  </span>
                </div>
                <div className="grid grid-cols-11 gap-1">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateSayac('supheli', i)}
                      className={`h-5 rounded text-[10px] font-mono font-bold ${
                        karakter.sayaclar.supheli >= i
                          ? i >= 5
                            ? 'bg-red-600 text-white'
                            : 'bg-red-900 text-red-200'
                          : 'bg-[#15100c] text-[#554333]'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Görünüşler (5 Fate Aspects) */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-3">
                Görünüşler (Aspects)
              </h2>
              <div className="space-y-2 text-xs">
                <div className="bg-[#211a14] p-2 rounded border border-[#4d3b2a]">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block">
                    Ana Kavram (High Concept)
                  </span>
                  <span className="text-[#f5ece0] font-serif font-semibold">
                    {karakter.gorunumler.anaKavram || 'Henüz belirlenmedi'}
                  </span>
                </div>
                <div className="bg-[#261515] p-2 rounded border border-red-900/60">
                  <span className="text-[10px] font-bold text-red-400 uppercase block">
                    Dert (Trouble)
                  </span>
                  <span className="text-red-200 font-serif font-semibold">
                    {karakter.gorunumler.dert || 'Henüz belirlenmedi'}
                  </span>
                </div>
                <div className="bg-[#1c1712] p-2 rounded border border-[#3b2d1f]">
                  <span className="text-[10px] font-bold text-[#b4a490] uppercase block">
                    Geçmişten Gelen
                  </span>
                  <span className="text-[#d8cdbd]">{karakter.gorunumler.gecmis}</span>
                </div>
                <div className="bg-[#1c1712] p-2 rounded border border-[#3b2d1f]">
                  <span className="text-[10px] font-bold text-[#b4a490] uppercase block">
                    Çatışmadan Gelen
                  </span>
                  <span className="text-[#d8cdbd]">{karakter.gorunumler.catisma}</span>
                </div>
                <div className="bg-[#1c1712] p-2 rounded border border-[#3b2d1f]">
                  <span className="text-[10px] font-bold text-[#b4a490] uppercase block">Bağ</span>
                  <span className="text-[#d8cdbd]">{karakter.gorunumler.bag}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Envanter, Yük Çubuğu, Ekonomi, Yara İzleri (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Ekonomi: Aron, Borç, Sicil, Ün */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-3 flex items-center justify-between">
                <span>Ekonomi &amp; İtibar</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </h2>
              <div className="grid grid-cols-2 gap-2 text-center">
                {/* Aron */}
                <div className="bg-[#221a13] p-2.5 rounded border border-[#523d2a]">
                  <span className="text-[10px] text-amber-400 font-heading block">Aron (Nakit)</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => updateEkonomi('aron', karakter.ekonomi.aron - 1)}
                      className="w-5 h-5 bg-[#31251a] hover:bg-[#433324] rounded text-xs text-amber-300"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xl text-amber-300">
                      {karakter.ekonomi.aron}
                    </span>
                    <button
                      onClick={() => updateEkonomi('aron', karakter.ekonomi.aron + 1)}
                      className="w-5 h-5 bg-[#31251a] hover:bg-[#433324] rounded text-xs text-amber-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Borç */}
                <div className="bg-[#241515] p-2.5 rounded border border-red-900/60">
                  <span className="text-[10px] text-red-400 font-heading block">Borç (Galetsha)</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => updateEkonomi('borc', karakter.ekonomi.borc - 5)}
                      className="w-5 h-5 bg-[#3c1e1e] hover:bg-[#502828] rounded text-xs text-red-300"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-xl text-red-300">
                      {karakter.ekonomi.borc}
                    </span>
                    <button
                      onClick={() => updateEkonomi('borc', karakter.ekonomi.borc + 5)}
                      className="w-5 h-5 bg-[#3c1e1e] hover:bg-[#502828] rounded text-xs text-red-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Sicil */}
                <div className="bg-[#1c1712] p-2 rounded border border-[#3b2d1f]">
                  <span className="text-[10px] text-[#9a8976] font-heading block">İmparatorluk Sicili</span>
                  <span className="font-mono font-bold text-lg text-stone-300">
                    {karakter.ekonomi.sicil}
                  </span>
                </div>

                {/* Ün */}
                <div className="bg-[#1c1712] p-2 rounded border border-[#3b2d1f]">
                  <span className="text-[10px] text-[#9a8976] font-heading block">Ün / Şöhret</span>
                  <span className="font-mono font-bold text-lg text-amber-200">
                    {karakter.ekonomi.un}
                  </span>
                </div>
              </div>
            </div>

            {/* Envanter & Yük Çubuğu */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <div className="flex items-center justify-between border-b border-[#36271a] pb-1.5 mb-2">
                <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37]">
                  Envanter &amp; Heybe
                </h2>
                <span
                  className={`text-xs font-mono font-bold ${
                    toplamAgirlik > maksYuk ? 'text-red-400' : 'text-[#a99c8b]'
                  }`}
                >
                  Yük: {toplamAgirlik} / {maksYuk} (5+STR)
                </span>
              </div>

              {/* Weight Bar */}
              <div className="w-full bg-[#120f0d] h-2 rounded-full overflow-hidden mb-3 border border-[#35271a]">
                <div
                  className={`h-full transition-all ${
                    toplamAgirlik > maksYuk ? 'bg-red-600' : 'bg-amber-600'
                  }`}
                  style={{ width: `${Math.min(100, (toplamAgirlik / maksYuk) * 100)}%` }}
                />
              </div>

              {/* Items List */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {karakter.envanter.map((esya) => (
                  <div
                    key={esya.id}
                    className="p-2 rounded bg-[#201913] border border-[#3f2f20] flex items-center justify-between text-xs group"
                  >
                    <div>
                      <div className="font-semibold text-[#f1e6d6] flex items-center gap-1.5">
                        <span>{esya.ad}</span>
                        {esya.zirhPuani ? (
                          <span className="text-[10px] text-amber-400 font-mono">
                            (+{esya.zirhPuani} Zırh)
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[10px] text-[#8e7e6d]">
                        {esya.tur} • {esya.yuk} Yük • {esya.fiyat} Aron
                      </div>
                    </div>
                    <button
                      onClick={() => handleEsyaSil(esya.id)}
                      className="text-stone-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Eşyayı Çıkar"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Item */}
              <div className="mt-3 pt-3 border-t border-[#34271c] flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Yeni eşya adı..."
                  value={yeniEsyaAd}
                  onChange={(e) => setYeniEsyaAd(e.target.value)}
                  className="flex-1 bg-[#1a140f] border border-[#4d3a28] rounded px-2 py-1 text-xs text-[#eedec8] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Yük"
                  value={yeniEsyaYuk}
                  onChange={(e) => setYeniEsyaYuk(Number(e.target.value))}
                  className="w-12 bg-[#1a140f] border border-[#4d3a28] rounded px-1.5 py-1 text-xs text-[#eedec8] font-mono text-center"
                />
                <button
                  onClick={handleEsyaEkle}
                  className="px-2 py-1 bg-[#3a2a1c] hover:bg-[#503a27] text-amber-200 text-xs font-bold rounded border border-[#6b5034]"
                >
                  Ekle
                </button>
              </div>
            </div>

            {/* Kalıcı Yara İzleri & Kilometre Taşları */}
            <div className="bg-[#16120e] p-4 rounded-lg border border-[#443322] shadow">
              <h2 className="font-heading font-bold text-sm uppercase text-[#d4af37] border-b border-[#36271a] pb-1.5 mb-2">
                Kalıcı Yara İzleri &amp; Miras
              </h2>
              <div className="space-y-1 text-xs mb-3">
                {karakter.yaraIzleri.map((iz, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded bg-[#201515] border border-red-950 text-red-200 text-[11px]"
                  >
                    • {iz}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Yeni yara izi veya ağır darbe..."
                  value={yeniYaraIzi}
                  onChange={(e) => setYeniYaraIzi(e.target.value)}
                  className="flex-1 bg-[#1a140f] border border-[#4d3a28] rounded px-2 py-1 text-xs text-[#eedec8] focus:outline-none"
                />
                <button
                  onClick={handleYaraIziEkle}
                  className="px-2 py-1 bg-[#471d1d] hover:bg-[#632727] text-red-200 text-xs font-bold rounded border border-red-800"
                >
                  İşle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Karakter Seyir Defteri & Persistent Markdown Notlar */}
        <div className="mt-8 border-t-2 border-[#4b3928] pt-6">
          <MarkdownNotes
            initialNotes={karakter.notlar || ''}
            onSaveNotes={(newNotes) => {
              onKarakterGuncelle({
                ...karakter,
                notlar: newNotes,
              });
            }}
            characterName={karakter.ad}
          />
        </div>
      </div>
    </div>
  );
};
