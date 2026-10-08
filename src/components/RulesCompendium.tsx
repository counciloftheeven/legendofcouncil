import React, { useState } from 'react';
import {
  SIFATLAR_MERDIVENI,
  YAKLASIMLAR,
  YaklasimAdi,
  OLCEK_MERDIVENI,
  TUR_VE_IRKLAR,
  SEKIZ_HANE,
  ON_SEKIZ_MESLEK,
  TEOLOJIK_HUNERLER,
  BUYU_BEDELI_TABLOSU,
  HAZIR_EKIPMANLAR,
  fateAtisiHesapla,
  sabitEsikGecerliMi,
  zarAt4dF
} from '../rules';
import { sound } from '../utils/audio';
import { LegendOfTheCouncilLogo } from './LegendOfTheCouncilLogo';
import {
  BookOpen,
  Shield,
  Search,
  Scale,
  Sparkles,
  HelpCircle,
  Coins,
  HeartCrack,
  Flame,
  Crown,
  Scroll,
  Users,
  Swords,
  AlertTriangle,
  Award,
  Zap,
  CheckCircle2,
  RefreshCw,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RulesCompendium: React.FC = () => {
  const [aktifSekme, setAktifSekme] = useState<
    'bakis' | 'merdiven' | 'yaklasimlar' | 'olcek' | 'yaratim' | 'yara' | 'buyu' | 'sahne' | 'ekipman'
  >('bakis');

  // Canlı Zar Deneme Alanı
  const [denemeYaklasim, setDenemeYaklasim] = useState<YaklasimAdi>('Ghardello');
  const [denemeDeger, setDenemeDeger] = useState<number>(3);
  const [denemeZorluk, setDenemeZorluk] = useState<number>(2);
  const [sonZarSonucu, setSonZarSonucu] = useState<any>(null);

  // Canlı Sabit Eşik Deneme
  const [saldiranOlcek, setSaldiranOlcek] = useState<number>(2); // Sıradan Halk
  const [hedefOlcek, setHedefOlcek] = useState<number>(6);      // Vali Ailesi

  const handleCanliZarAt = () => {
    sound.playDiceRoll();
    const res = fateAtisiHesapla(denemeDeger, denemeZorluk);
    setSonZarSonucu(res);
    if (res.sonucTuru === 'Görkemli Başarı' || res.sonucTuru === 'Başarı') {
      confetti({ particleCount: 25, spread: 50 });
    }
  };

  const sabitEsikDurumu = sabitEsikGecerliMi(saldiranOlcek, hedefOlcek);

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 text-[#f3ece0]">
      {/* BAŞLIK & REHBER BANNERI (PDF Sayfa 1-3) */}
      <div className="parchment-sheet p-5 sm:p-6 rounded-2xl border-2 border-[#54412e] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <LegendOfTheCouncilLogo size="md" />
            <span className="font-heading font-black text-xs sm:text-sm text-amber-300 uppercase tracking-widest px-2.5 py-1 rounded bg-[#1f150e] border border-amber-900/60 self-start">
              RESMİ KURAL KILAVUZU (SRD)
            </span>
          </div>
          <p className="text-xs text-[#a99c8b] font-serif italic">
            &quot;Aron hanar, Edron rion. Ezra gharan tod dor.&quot; (Altın kan, Demir birlik. Ölüme kadar savaşırız.)
          </p>
          <span className="inline-block mt-1 text-[10px] text-amber-400 font-bold bg-[#17120e] px-2 py-0.5 rounded border border-[#443322]">
            Fate Tabanlı 4dF Sistemi · Sıfatlar Merdiveni · On Dört Yaklaşım · Kurultay Kanunları
          </span>
        </div>

        {/* Sekme Navigasyonu */}
        <div className="flex items-center bg-[#17120e] p-1 rounded-xl border border-[#443322] flex-wrap gap-1 text-xs font-heading font-bold">
          <button
            onClick={() => setAktifSekme('bakis')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'bakis' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Sistem Bir Bakışta
          </button>
          <button
            onClick={() => setAktifSekme('merdiven')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'merdiven' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Zar &amp; Merdiven
          </button>
          <button
            onClick={() => setAktifSekme('yaklasimlar')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'yaklasimlar' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            14 Yaklaşım
          </button>
          <button
            onClick={() => setAktifSekme('olcek')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'olcek' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Ölçek (10 Basamak)
          </button>
          <button
            onClick={() => setAktifSekme('yaratim')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'yaratim' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Karakter Yaratımı
          </button>
          <button
            onClick={() => setAktifSekme('yara')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'yara' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Yara Hatları
          </button>
          <button
            onClick={() => setAktifSekme('buyu')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'buyu' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Büyü (Loth)
          </button>
          <button
            onClick={() => setAktifSekme('sahne')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'sahne' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Sahne &amp; Dello
          </button>
          <button
            onClick={() => setAktifSekme('ekipman')}
            className={`px-3 py-1.5 rounded transition-all ${
              aktifSekme === 'ekipman' ? 'bg-[#3b2a1a] text-amber-200 border border-amber-600 shadow' : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Ekipman &amp; NPC
          </button>
        </div>
      </div>

      {/* 1. SİSTEM BİR BAKIŞTA & İLKELER (PDF Sayfa 2 & 3) */}
      {aktifSekme === 'bakis' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Büyünün Yok Oluşu</span>
              <h3 className="font-heading font-black text-base text-[#f5ecd8]">Low Fantasy</h3>
              <p className="text-xs text-[#ded1be] font-serif leading-relaxed">
                KS 0 felaketinden sonra kadim ilimler çöktü. Büyü resmen yasaktır; Karabıçaklar ve Gölge Veziri büyücüleri avlar. Var olan büyü bedelsiz değildir: simyevi ve zehirli bir bedel ister.
              </p>
            </div>

            <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">İnsan Canının Kıymeti</span>
              <h3 className="font-heading font-black text-base text-[#f5ecd8]">Nefes Hukuku</h3>
              <p className="text-xs text-[#ded1be] font-serif leading-relaxed">
                Nüfus azdır: imparatorluk çapında en çok 10 milyon can kalmıştır. Katliam savaşları yerine liderlerin ve şampiyonların <strong>Dello</strong> meydan düellosu esastır. Savaş ve ölüm en son çaredir.
              </p>
            </div>

            <div className="parchment-sheet p-4 rounded-xl border border-[#523e2c] space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Kural Hafifliği</span>
              <h3 className="font-heading font-black text-base text-[#f5ecd8]">Mekanik Sadelik</h3>
              <p className="text-xs text-[#ded1be] font-serif leading-relaxed">
                Matematik kayması, tablo araması ve ekstra karmaşık hesap yoktur. Her şey Aspect, Uzmanlık (+2 ya da kural istisnası) ve tek bir 4dF zarı üzerinden akar.
              </p>
            </div>
          </div>

          {/* Terimler Sözlüğü (PDF Sayfa 3 Tablosu) */}
          <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <h3 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide">
              Stallhart Terimler Sözlüğü
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Şift (Shift)</strong>
                <span className="text-[#c4b5a2]">Zar atış sonucu ile Zorluk arasındaki sayısal fark.</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Aspect</strong>
                <span className="text-[#c4b5a2]">Karakter, mekan ya da durum hakkında doğru olan kısa cümle. Hem silahtır hem yük.</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Kader Puanı</strong>
                <span className="text-[#c4b5a2]">Aspect çağırmak (+2 / yeniden atış) için harcanan oturum jetonu.</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Sabit Eşik</strong>
                <span className="text-[#c4b5a2]">Statü uçurumunda (Ölçek farkı 3+) doğrudan saldırıyı engelleyen kural.</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Gedik</strong>
                <span className="text-[#c4b5a2]">Sabit eşiği aşmak için Ver-ed veya Lodvez ile sahneye kurulan Avantaj Aspect&apos;i.</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Dello</strong>
                <span className="text-[#c4b5a2]">Liderlerin ya da şampiyonların resmî meydan düellosu (Ghardello).</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Kutu (Pip)</strong>
                <span className="text-[#c4b5a2]">Tam 1 şift hasar emen tampon kutusu. Bir darbede tek bir kutu kullanılır.</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Sonuç (Consequence)</strong>
                <span className="text-[#c4b5a2]">Hasarın tampon kutuyu aşmasıyla alınan yara Aspect&apos;i (Hafif −2, Orta −4, Ağır −6).</span>
              </div>
              <div className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-300 block mb-0.5">Güçlendirme (Boost)</strong>
                <span className="text-[#c4b5a2]">Yalnızca bir kez bedava çağrılan ve sonra kaybolan kısa ömürlü geçici Aspect.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ZAR VE SIFATLAR MERDİVENİ (PDF Sayfa 4 & 5) */}
      {aktifSekme === 'merdiven' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
            <div>
              <h2 className="font-heading font-black text-lg text-amber-300 uppercase tracking-wide">
                Zar ve Sıfatlar Merdiveni (−2 Berbat .. +8 Efsanevi)
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Oyun tek bir zarla oynanır: 4 Fate zarı (4dF: −4 ile +4 arası). Sonuç = 4dF + Yaklaşım + Bonuslar.
              </p>
            </div>

            {/* Merdiven Tablosu */}
            <div className="space-y-1">
              {SIFATLAR_MERDIVENI.map((m) => (
                <div
                  key={m.deger}
                  className="p-2 rounded bg-[#16120e] border border-[#3b2b1d] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-amber-400 w-8 text-center text-sm">
                      {m.deger >= 0 ? `+${m.deger}` : m.deger}
                    </span>
                    <strong className={`font-heading ${m.renk} text-sm`}>{m.baslik}</strong>
                    <span className="text-[10px] text-[#786653]">({m.ingilizce})</span>
                  </div>
                  <span className="text-[10px] text-[#a49684] truncate max-w-xs">{m.aciklama}</span>
                </div>
              ))}
            </div>

            {/* Dört Eylem (PDF Sayfa 5) */}
            <div className="pt-3 border-t border-[#493726] space-y-2">
              <h3 className="font-heading font-bold text-xs text-amber-300 uppercase">
                Dört Temel Eylem
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-[#140f0c] border border-[#3b2b1d]">
                  <strong className="text-amber-200 block mb-0.5">1. Aşma (Overcome)</strong>
                  <span className="text-[#a49684]">Engeli, tehlikeyi ya da görevi aş. Başarırsan engeli geçersin.</span>
                </div>
                <div className="p-2 rounded bg-[#140f0c] border border-[#3b2b1d]">
                  <strong className="text-amber-200 block mb-0.5">2. Avantaj Yarat (Create an Advantage)</strong>
                  <span className="text-[#a49684]">Yeni bir Aspect kur ya da keşfet (+1 veya +2 bedava çağırma).</span>
                </div>
                <div className="p-2 rounded bg-[#140f0c] border border-[#3b2b1d]">
                  <strong className="text-amber-200 block mb-0.5">3. Saldırı (Attack)</strong>
                  <span className="text-[#a49684]">Bir Yara hattına (Fiziksel, Zihinsel ya da İtibar) şift kadar hasar vur.</span>
                </div>
                <div className="p-2 rounded bg-[#140f0c] border border-[#3b2b1d]">
                  <strong className="text-amber-200 block mb-0.5">4. Savunma (Defend)</strong>
                  <span className="text-[#a49684]">Saldırıyı ya da avantaja girişilmesini boşa çıkar.</span>
                </div>
              </div>
            </div>
          </div>

          {/* SAĞ: İNTERAKTİF 4dF TEST MERKEZİ */}
          <div className="lg:col-span-5 parchment-sheet p-5 rounded-xl border-2 border-amber-600/80 shadow-2xl space-y-4">
            <h3 className="font-heading font-black text-sm text-amber-200 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Canlı 4dF Zar Test Simülatörü</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#8d7c6b] uppercase block mb-1">
                  Kullanılan Yaklaşım:
                </label>
                <select
                  value={denemeYaklasim}
                  onChange={(e) => setDenemeYaklasim(e.target.value as YaklasimAdi)}
                  className="w-full bg-[#140f0c] text-amber-200 border border-[#443322] rounded p-2 text-xs font-heading font-bold"
                >
                  {(Object.keys(YAKLASIMLAR) as YaklasimAdi[]).map((y) => (
                    <option key={y} value={y}>{y} ({YAKLASIMLAR[y].kategori})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8d7c6b] uppercase block mb-1">
                    Yaklaşım Değeri:
                  </label>
                  <input
                    type="number"
                    value={denemeDeger}
                    onChange={(e) => setDenemeDeger(Number(e.target.value))}
                    className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-amber-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8d7c6b] uppercase block mb-1">
                    Zorluk (Eşik):
                  </label>
                  <select
                    value={denemeZorluk}
                    onChange={(e) => setDenemeZorluk(Number(e.target.value))}
                    className="w-full bg-[#140f0c] text-amber-200 border border-[#443322] rounded p-2 text-xs"
                  >
                    <option value={0}>Sıradan (+0)</option>
                    <option value={2}>Makul (+2)</option>
                    <option value={4}>Harika (+4)</option>
                    <option value={6}>Muhteşem (+6)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCanliZarAt}
                className="w-full py-2.5 rounded wax-seal text-white font-heading font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-amber-300" />
                <span>4dF Zarları Yuvarla</span>
              </button>

              {sonZarSonucu && (
                <div className="p-3 rounded-lg bg-[#140f0c] border border-amber-600/80 space-y-2 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-amber-300">
                      {sonZarSonucu.derece}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      sonZarSonucu.sonucTuru === 'Görkemli Başarı'
                        ? 'bg-amber-500 text-stone-950 font-black'
                        : sonZarSonucu.sonucTuru === 'Başarı'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : sonZarSonucu.sonucTuru === 'Denk'
                        ? 'bg-yellow-950 text-yellow-300 border border-yellow-700'
                        : 'bg-red-950 text-red-300 border border-red-700'
                    }`}>
                      {sonZarSonucu.sonucTuru} ({sonZarSonucu.sift >= 0 ? `+${sonZarSonucu.sift}` : sonZarSonucu.sift} Şift)
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm font-mono font-bold bg-[#0c0906] p-2 rounded border border-[#3b2b1d]">
                    {sonZarSonucu.zarlar.map((z: number, i: number) => (
                      <span key={i} className={`w-7 h-7 rounded border flex items-center justify-center ${
                        z === 1 ? 'border-emerald-500 bg-emerald-950 text-emerald-300' : z === -1 ? 'border-red-500 bg-red-950 text-red-300' : 'border-stone-700 bg-stone-900 text-stone-500'
                      }`}>
                        {z === 1 ? '+' : z === -1 ? '−' : '0'}
                      </span>
                    ))}
                    <span className="text-amber-400 ml-2">
                      = {sonZarSonucu.zarToplami >= 0 ? `+${sonZarSonucu.zarToplami}` : sonZarSonucu.zarToplami} + {denemeDeger} = {sonZarSonucu.toplam}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#ded1be] font-serif italic">
                    {sonZarSonucu.aciklama}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. 14 YAKLAŞIM SÖZLÜĞÜ (PDF Sayfa 7) */}
      {aktifSekme === 'yaklasimlar' && (
        <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
          <div>
            <h2 className="font-heading font-black text-lg text-amber-300 uppercase tracking-wide">
              Yaklaşım Sözlüğü: Ortak Lisan
            </h2>
            <p className="text-xs text-[#a99c8b] font-serif">
              Stallhart&apos;ın becerileri Ortak Lisan adlarıyla yaşar. Her biri bir Yara hattında saldırı ya da savunma rolü üstlenir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {(Object.keys(YAKLASIMLAR) as YaklasimAdi[]).map((yAd) => {
              const y = YAKLASIMLAR[yAd];
              return (
                <div
                  key={yAd}
                  className="p-3 rounded-lg bg-[#16120e] border border-[#3b2b1d] space-y-1.5 shadow"
                >
                  <div className="flex items-center justify-between border-b border-[#2d2217] pb-1">
                    <div className="flex items-center gap-2">
                      <strong className="font-heading font-black text-sm text-[#f5ecd8]">
                        {y.ad}
                      </strong>
                      <span className="text-[10px] text-[#93826e] font-mono">
                        ({y.kategori})
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#251d16] text-amber-300 border border-[#443322]">
                      {y.fateKarsiligi}
                    </span>
                  </div>

                  <p className="text-[#ded1be] font-serif text-[11px] leading-relaxed">
                    {y.kapsami}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-[#8e7e6d]">Hat Rolü:</span>
                    <span className="font-bold text-amber-400">{y.hatRolu}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. ÖLÇEK & SABİT EŞİK (PDF Sayfa 8) */}
      {aktifSekme === 'olcek' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
            <div>
              <h2 className="font-heading font-black text-lg text-amber-300 uppercase tracking-wide">
                Toplumun Merdiveni (10 Basamak)
              </h2>
              <p className="text-xs text-[#a99c8b] font-serif">
                Ölçek Yaklaşım değerlerini değiştirmez; kimin kime doğrudan vurabileceğini belirler.
              </p>
            </div>

            <div className="space-y-1.5">
              {OLCEK_MERDIVENI.map((o) => (
                <div
                  key={o.basamak}
                  className="p-2.5 rounded bg-[#16120e] border border-[#3b2b1d] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-amber-400 w-6 text-center text-sm">
                      {o.basamak}
                    </span>
                    <div>
                      <strong className="font-heading text-sm text-[#f5ebd7] block">{o.unvan}</strong>
                      <span className="text-[10px] text-[#93826e]">{o.kimler}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#c4b5a2] italic font-serif">{o.aciklama}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SAĞ: SABİT EŞİK KURALI VE TESTİ */}
          <div className="lg:col-span-5 parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
            <h3 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Sabit Eşik Kuralı (Statü Uçurumu)</span>
            </h3>

            <p className="text-xs text-[#ded1be] font-serif leading-relaxed">
              İki taraf arasında belirgin bir statü uçurumu varsa (Ölçek farkı 3 ya da daha fazla): alt basamaktaki doğrudan Saldırı yapamaz! Önce Ver-ed ya da Lodvez ile bir <strong>Gedik (Avantaj Aspect&apos;i)</strong> açmalıdır.
            </p>

            <div className="p-3 rounded-lg bg-[#140f0c] border border-[#3b2b1d] space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#8d7c6b] uppercase block mb-1">
                  Saldıran Kişinin Ölçeği:
                </label>
                <select
                  value={saldiranOlcek}
                  onChange={(e) => setSaldiranOlcek(Number(e.target.value))}
                  className="w-full bg-[#18130f] border border-[#443322] rounded p-2 text-amber-200"
                >
                  {OLCEK_MERDIVENI.map((o) => (
                    <option key={o.basamak} value={o.basamak}>{o.basamak}. Basamak: {o.unvan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8d7c6b] uppercase block mb-1">
                  Hedefin Ölçeği:
                </label>
                <select
                  value={hedefOlcek}
                  onChange={(e) => setHedefOlcek(Number(e.target.value))}
                  className="w-full bg-[#18130f] border border-[#443322] rounded p-2 text-amber-200"
                >
                  {OLCEK_MERDIVENI.map((o) => (
                    <option key={o.basamak} value={o.basamak}>{o.basamak}. Basamak: {o.unvan}</option>
                  ))}
                </select>
              </div>

              <div className={`p-3 rounded border text-xs font-serif ${
                sabitEsikDurumu.engellendi
                  ? 'bg-red-950/80 border-red-700 text-red-200'
                  : 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
              }`}>
                <strong>{sabitEsikDurumu.engellendi ? '🛑 SABİT EŞİK İŞLER:' : '✅ SALDIRI SERBEST:'}</strong>
                <p className="mt-1">{sabitEsikDurumu.mesaj}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. KARAKTER YARATIMI, HANE VE MESLEKLER (PDF Sayfa 9-15) */}
      {aktifSekme === 'yaratim' && (
        <div className="space-y-4">
          {/* Yedi Adım Özeti */}
          <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <h2 className="font-heading font-black text-base text-amber-300 uppercase tracking-wide">
              Yedi Adımda Karakter Yaratımı
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-400 block font-mono text-sm">1. Tür</strong>
                <span className="text-[10px] text-[#a49684]">6 Seçenek (Tavan: 8)</span>
              </div>
              <div className="p-2 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-400 block font-mono text-sm">2. Irk</strong>
                <span className="text-[10px] text-[#a49684]">12 Seçenek (Eğilim Yaklaşımı)</span>
              </div>
              <div className="p-2 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-400 block font-mono text-sm">3. Köken</strong>
                <span className="text-[10px] text-[#a49684]">Soylu (5/3) / Halktan (2/4)</span>
              </div>
              <div className="p-2 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-400 block font-mono text-sm">4. Hane/Meslek</strong>
                <span className="text-[10px] text-[#a49684]">İlk Ücretsiz Uzmanlık</span>
              </div>
              <div className="p-2 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-400 block font-mono text-sm">5. Yaklaşım</strong>
                <span className="text-[10px] text-[#a49684]">14 Değer Dağılımı</span>
              </div>
              <div className="p-2 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-400 block font-mono text-sm">6. Uzmanlık</strong>
                <span className="text-[10px] text-[#a49684]">3 Ücretsiz Yuva</span>
              </div>
              <div className="p-2 rounded bg-[#16120e] border border-[#3b2b1d]">
                <strong className="text-amber-400 block font-mono text-sm">7. Aspectler</strong>
                <span className="text-[10px] text-[#a49684]">5 Cümle + 3 Geçmiş Cümlesi</span>
              </div>
            </div>
          </div>

          {/* 18 Meslek Kataloğu */}
          <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <h3 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide">
              On Sekiz Meslek (Meslek Hünerleri ve Yükleri)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {Object.keys(ON_SEKIZ_MESLEK).map((mAd) => {
                const m = ON_SEKIZ_MESLEK[mAd];
                return (
                  <div key={mAd} className="p-3 rounded-lg bg-[#16120e] border border-[#3b2b1d] space-y-1">
                    <div className="flex justify-between items-center border-b border-[#2e2318] pb-1">
                      <strong className="text-[#f5ecd8] font-heading font-bold">{m.ad}</strong>
                      <span className="text-[9px] text-[#93826e] font-mono">{m.kategori}</span>
                    </div>
                    <span className="text-amber-300 font-bold block text-[11px]">{m.meslekHüneri}</span>
                    <p className="text-[10px] text-[#c4b5a2] font-serif italic">{m.hunerMetni}</p>
                    <div className="pt-1 text-[10px] text-red-300">
                      <strong>Yük (Zayıf Kanadı):</strong> {m.yuk}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. YARA HATLARI VE BİTMEK (PDF Sayfa 16) */}
      {aktifSekme === 'yara' && (
        <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
          <div>
            <h2 className="font-heading font-black text-lg text-amber-300 uppercase tracking-wide">
              Yara Hatları ve Bitmek (Fiziksel, Zihinsel, İtibar)
            </h2>
            <p className="text-xs text-[#a99c8b] font-serif">
              Hasar üç ayrı hatta açılır: bedenin, zihnin ve adının. Hedef değil yöntem belirler: kılıç Fiziksel&apos;e, tehdit ve büyü Zihinsel&apos;e, iftira İtibar&apos;a.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#16120e] border border-red-900/80 space-y-2">
              <strong className="text-red-400 font-heading text-sm block">1. Fiziksel Hat (3 Kutu)</strong>
              <p className="text-[#ded1be]">Saldırı: Ghardello | Rax-ed</p>
              <p className="text-[#ded1be]">Savunma: Ghardello | Zel-vash</p>
              <span className="text-[10px] text-[#93826e] block">3 kutu tampon: her biri 1 şift emer.</span>
            </div>

            <div className="p-4 rounded-xl bg-[#16120e] border border-purple-900/80 space-y-2">
              <strong className="text-purple-400 font-heading text-sm block">2. Zihinsel Hat (3 Kutu)</strong>
              <p className="text-[#ded1be]">Saldırı: Xes-hart | Loth (büyü)</p>
              <p className="text-[#ded1be]">Savunma: Edor / Edros</p>
              <span className="text-[10px] text-[#93826e] block">İradeyi kırma, dehşet, büyü şoku.</span>
            </div>

            <div className="p-4 rounded-xl bg-[#16120e] border border-blue-900/80 space-y-2">
              <strong className="text-blue-400 font-heading text-sm block">3. İtibar Hattı (1 Kutu)</strong>
              <p className="text-[#ded1be]">Saldırı: Lodvez</p>
              <p className="text-[#ded1be]">Savunma: Ver-ed (Hukuk: Aldris)</p>
              <span className="text-[10px] text-amber-300 font-bold block">&quot;Bitmek&quot; = Toplumsal Düşüş!</span>
            </div>
          </div>

          {/* Sonuçlar */}
          <div className="p-4 rounded-xl bg-[#130f0c] border border-[#3b2b1d] space-y-2 text-xs">
            <strong className="text-amber-300 font-heading uppercase block">Sonuç Haneleri (3 Hat İçin Ortak)</strong>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded bg-[#18130f] border border-[#443322]">
                <strong className="text-teal-400 block">Hafif Sonuç (−2)</strong>
                <span className="text-[#a49684]">1 Sahne ve uygun eylemle iyileşir.</span>
              </div>
              <div className="p-2 rounded bg-[#18130f] border border-[#443322]">
                <strong className="text-amber-400 block">Orta Sonuç (−4)</strong>
                <span className="text-[#a49684]">1 Oturum ve uygun eylemle iyileşir.</span>
              </div>
              <div className="p-2 rounded bg-[#18130f] border border-[#443322]">
                <strong className="text-red-400 block">Ağır Sonuç (−6)</strong>
                <span className="text-[#a49684]">1 Bölüm (hikâye dönümü) gerektirir.</span>
              </div>
            </div>
            <p className="text-[11px] text-[#a49684] italic font-serif pt-1">
              * Teslim Kuralı: Zarlar atılmadan önce teslim olunabilir; yenilgiyi oyuncu anlatır ve 1 Kader Puanı (+ her Sonuç için +1) alır.
            </p>
          </div>
        </div>
      )}

      {/* 7. BÜYÜ (LOTH & YASAK İLİM) (PDF Sayfa 17) */}
      {aktifSekme === 'buyu' && (
        <div className="parchment-sheet p-5 rounded-xl border-2 border-purple-900 shadow-xl space-y-4">
          <div>
            <h2 className="font-heading font-black text-lg text-purple-300 uppercase tracking-wide">
              Loth ve Yasak İlim (Low Fantasy Büyü Sistemi)
            </h2>
            <p className="text-xs text-[#a99c8b] font-serif">
              İmparatorlukta büyü, tanrısal düzene başkaldırıdır: yakalanan idam edilir. Büyü bedelsiz değildir: risk yalnızca <strong>Denk</strong> ve <strong>Başarısız</strong> sonuçlarda ödenir.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {BUYU_BEDELI_TABLOSU.map((b) => (
              <div
                key={b.sonuc}
                className="p-3 rounded-lg bg-[#16120e] border border-[#3b2b1d] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <strong className={`font-heading text-sm ${
                    b.sonuc === 'Görkemli Başarı' ? 'text-amber-300' : b.sonuc === 'Başarı' ? 'text-emerald-400' : b.sonuc === 'Denk' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {b.sonuc}
                  </strong>
                  <span className="text-[#ded1be] block mt-0.5">{b.durum}</span>
                </div>
                <div className="text-right sm:max-w-xs">
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">Bedel:</span>
                  <span className="text-xs text-red-300 font-serif italic">{b.bedel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. SAHNE VE DELLO (PDF Sayfa 18 & 19) */}
      {aktifSekme === 'sahne' && (
        <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-4">
          <div>
            <h2 className="font-heading font-black text-lg text-amber-300 uppercase tracking-wide">
              Sahne Yapısı, Sosyal Çatışma &amp; Dello
            </h2>
            <p className="text-xs text-[#a99c8b] font-serif">
              Gündelik sahne serbest akar; entrika bir Karşılaşma olarak oynanır; itham anında ya da kılıç çekilince Kavga&apos;ya dönüşür.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#16120e] border border-[#3b2b1d] space-y-2">
              <strong className="text-amber-300 font-heading text-sm block">Sosyal Karşılaşma (3 Zafer)</strong>
              <p className="text-[#ded1be] font-serif">
                Diplomatik pazarlıklar, dedikodu deşme ve zamana karşı yarışlar Karşılaşma&apos;dır. Taraflar sırayla Eylem seçer (Ver-ed, Lodvez, Aldris, vb.). Karşıt atışta üstün gelen 1 Zafer alır (Görkemli: 2). İlk 3 Zafer&apos;e ulaşan kazanır.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#16120e] border border-[#3b2b1d] space-y-2">
              <strong className="text-red-400 font-heading text-sm block">İtham Anı ve Kavga Eşiği</strong>
              <p className="text-[#ded1be] font-serif">
                Mühürlü mektubun açılması, alenî suçlama ya da kılıcın çekilmesi sahneyi Kavga&apos;ya çevirir. İtham eden ilk turu alır (Lodvez ya da Xes-hart). Savunulamazsa doğrudan Sonuç alınır!
              </p>
            </div>
          </div>

          {/* Dello Düellosu & Lomera Barışı */}
          <div className="p-4 rounded-xl bg-[#130f0c] border border-amber-800/80 space-y-2 text-xs">
            <strong className="text-amber-300 font-heading text-sm block">Dello · Meydan Düellosu</strong>
            <p className="text-[#ded1be] font-serif">
              Büyük meseleler katliamla değil, liderlerin ve şampiyonların Dello&apos;suyla çözülür. Dello bir Fiziksel Kavga&apos;dır (Ghardello). Bir Mabed rahibi araya girip kireçle <strong>Denge Çemberi</strong> çizdiğinde Lomera Barışı ilan edilir; taraflar savaşı durdurup Dello&apos;ya bırakmak için Edor / Edros testi verir.
            </p>
          </div>
        </div>
      )}

      {/* 9. EKİPMAN ASPECT'LERİ & NPC SKALASI (PDF Sayfa 20) */}
      {aktifSekme === 'ekipman' && (
        <div className="space-y-4">
          <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <h2 className="font-heading font-black text-lg text-amber-300 uppercase tracking-wide">
              Ekipman Aspect&apos;leri
            </h2>
            <p className="text-xs text-[#a99c8b] font-serif">
              Ekipman kağıda ekstra sayısal yük getirmez; her biri basit ve net bir Aspect olarak çalışır. Sahne başına 1 kez bedelsiz çağrılabilir (+2).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {HAZIR_EKIPMANLAR.map((eq) => (
                <div key={eq.id} className="p-3 rounded-lg bg-[#16120e] border border-[#3b2b1d] space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-amber-200 font-bold">{eq.ad}</strong>
                    <span className="text-[10px] text-amber-400 font-mono">{eq.fiyat} Aron</span>
                  </div>
                  <p className="text-[11px] text-[#ded1be] font-serif italic">{eq.aspectEtkisi}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="parchment-sheet p-5 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <h3 className="font-heading font-black text-sm text-red-300 uppercase tracking-wide">
              NPC / Figüran Skalası
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#16120e] border border-[#3b2b1d] space-y-2">
                <strong className="text-amber-200 font-heading text-sm block">Sıradan Figüran</strong>
                <p className="text-[#a49684]">
                  Kasaba muhafızı, madenci, serseri. Becerisi yoktur. Uzman olduğu tek işte <strong>Makul +2</strong>, diğer her şeyde <strong>Sıradan +0</strong> kabul edilir. Stres: yalnızca 1 kutu.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16120e] border border-red-900/80 space-y-2">
                <strong className="text-red-300 font-heading text-sm block">Önemli Rakip (Boss / Vezir)</strong>
                <p className="text-[#ded1be]">
                  Garnizon yüzbaşısı, lonca katili, başvezir. Oyuncular gibi Yaklaşım dağılımına, Yük Aspect&apos;ine ve 3 Yara Hattına sahiptir. Statü uçurumunda Sabit Eşik onlar için de geçerlidir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
