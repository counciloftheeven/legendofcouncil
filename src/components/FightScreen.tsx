import React, { useState } from 'react';
import {
  Karakter,
  saldiriHesapla,
  zarAt4dF,
  cepheZariAt,
  NPC,
} from '../rules';
import { sound } from '../utils/audio';
import {
  Skull,
  Shield,
  Swords,
  ChevronRight,
  Plus,
  UserPlus,
  Heart,
  Crosshair,
  RotateCcw,
  Zap,
  Camera,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface Combatant {
  id: string;
  ad: string;
  tur: 'Oyuncu' | 'Müttefik' | 'Düşman';
  side: 'sol' | 'sag'; // sol: Karakterler/Müttefikler, sag: Düşmanlar
  fotoUrl?: string;
  fightBonus: number;
  savunmaBonus: number;
  zirh: number;
  yaraKutulari: number;
  alinanYara: number;
  yorgunluk: number;
  durumlar: string[];
  tehdit?: 'Düşük' | 'Orta' | 'Yüksek' | 'Ölümcül';
  ozelDavranis?: string;
  safYeri?: 'Ön Hat' | 'Arka Hat';
}

interface FightScreenProps {
  karakterler: Karakter[];
  aktifKarakter: Karakter;
  npcler: NPC[];
  rol: 'Anlatıcı' | 'Oyuncu';
}

const DEFAULT_AVATARS: Record<string, string> = {
  Oyuncu: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
  Müttefik: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  Düşman: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
};

const HAZIR_DUSMAN_SABLONLARI: Omit<Combatant, 'id' | 'side'>[] = [
  {
    ad: 'Lekeli Yaban Kurdu',
    tur: 'Düşman',
    fotoUrl: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
    fightBonus: 2,
    savunmaBonus: 2,
    zirh: 0,
    yaraKutulari: 3,
    alinanYara: 0,
    yorgunluk: 0,
    durumlar: ['Kuduz', 'Aç'],
    tehdit: 'Orta',
    ozelDavranis: 'Yaralı hedeflere saldırırken +2 Vuruş kazanır.',
    safYeri: 'Ön Hat',
  },
  {
    ad: 'Galetsha Borç Muhafızı',
    tur: 'Düşman',
    fotoUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop&q=80',
    fightBonus: 3,
    savunmaBonus: 1,
    zirh: 2,
    yaraKutulari: 4,
    alinanYara: 0,
    yorgunluk: 1,
    durumlar: ['Ağır Zırhlı'],
    tehdit: 'Yüksek',
    ozelDavranis: 'Kalkan siperiyle müttefiklerini korur.',
    safYeri: 'Ön Hat',
  },
  {
    ad: "Z'ela Bataklık Cadısı",
    tur: 'Düşman',
    fotoUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=600&auto=format&fit=crop&q=80',
    fightBonus: 1,
    savunmaBonus: 3,
    zirh: 0,
    yaraKutulari: 3,
    alinanYara: 0,
    yorgunluk: 0,
    durumlar: ['Lekeli', 'Zehirli Dokunuş'],
    tehdit: 'Yüksek',
    ozelDavranis: 'Büyü saldırısıyla hedefe +1 Leke bulaştırır.',
    safYeri: 'Arka Hat',
  },
  {
    ad: 'Mabed Engizitör Şövalyesi',
    tur: 'Düşman',
    fotoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    fightBonus: 4,
    savunmaBonus: 2,
    zirh: 3,
    yaraKutulari: 5,
    alinanYara: 0,
    yorgunluk: 0,
    durumlar: ['Kutsal Yemin'],
    tehdit: 'Ölümcül',
    ozelDavranis: 'Denge Mahkemesi çanları çalarken ilk saldırısı savuşturulamaz.',
    safYeri: 'Ön Hat',
  },
];

export const FightScreen: React.FC<FightScreenProps> = ({
  karakterler,
  aktifKarakter,
  npcler,
  rol,
}) => {
  // Savaşçılar: Sol kanat (Oyuncular/Müttefikler) ve Sağ kanat (Düşmanlar)
  const [savascilar, setSavascilar] = useState<Combatant[]>([
    {
      id: aktifKarakter.id,
      ad: aktifKarakter.ad,
      tur: 'Oyuncu',
      side: 'sol',
      fotoUrl: aktifKarakter.fotoUrl || DEFAULT_AVATARS.Oyuncu,
      fightBonus: aktifKarakter.beceriler.Fight,
      savunmaBonus: aktifKarakter.nitelikler.DEX,
      zirh: 1,
      yaraKutulari: aktifKarakter.sayaclar.yaraKutulari,
      alinanYara: aktifKarakter.sayaclar.alınanYaraKutulari,
      yorgunluk: aktifKarakter.sayaclar.yorgunluk,
      durumlar: ['Teyakkuzda'],
      safYeri: 'Ön Hat',
    },
    {
      id: 'mob_wolf_1',
      ad: 'Lekeli Yaban Kurdu',
      tur: 'Düşman',
      side: 'sag',
      fotoUrl: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
      fightBonus: 2,
      savunmaBonus: 2,
      zirh: 0,
      yaraKutulari: 3,
      alinanYara: 0,
      yorgunluk: 0,
      durumlar: ['Kuduz', 'Aç'],
      tehdit: 'Orta',
      ozelDavranis: 'Yaralı hedeflere saldırırken +2 Vuruş kazanır.',
      safYeri: 'Ön Hat',
    },
    {
      id: 'mob_guard_1',
      ad: 'Galetsha Borç Muhafızı',
      tur: 'Düşman',
      side: 'sag',
      fotoUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop&q=80',
      fightBonus: 3,
      savunmaBonus: 1,
      zirh: 2,
      yaraKutulari: 4,
      alinanYara: 1,
      yorgunluk: 1,
      durumlar: ['Ağır Zırhlı'],
      tehdit: 'Yüksek',
      ozelDavranis: 'Kalkan darbesi ile sersemletme girişiminde bulunur.',
      safYeri: 'Ön Hat',
    },
  ]);

  // Sıra & İnisiyatif State
  const [siraIndex, setSiraIndex] = useState<number>(0);
  const [turSayaci, setTurSayaci] = useState<number>(1);

  // Çatışma State (Saldıran & Hedef)
  const [seciliHedefId, setSeciliHedefId] = useState<string>('mob_wolf_1');
  const [sonZarCatismasi, setSonZarCatismasi] = useState<{
    saldiranAd: string;
    hedefAd: string;
    saldiriZarlari: number[];
    saldiriZarToplami: number;
    saldiranBonus: number;
    saldiriToplami: number;
    savunmaZarlari: number[];
    savunmaZarToplami: number;
    savunmaBonus: number;
    savunmaToplami: number;
    vurusFarki: number;
    hedefZirh: number;
    netHasar: number;
    kademe: string;
    aciklama: string;
  } | null>(null);

  const [darbeEfekti, setDarbeEfekti] = useState<boolean>(false);
  const [cepheSonuc, setCepheSonuc] = useState<any | null>(null);

  // Savaş Günlüğü
  const [savasGunlugu, setSavasGunlugu] = useState<string[]>([
    '⚔️ Sıra tabanlı taktik savaş meydanı açıldı. Savaşçıların portreleri sancağa işlendi!',
  ]);

  // Karakter Yerleştirme Modalı
  const [yerlestirModalAcik, setYerlestirModalAcik] = useState<boolean>(false);

  const aktifSavasci = savascilar[siraIndex] || savascilar[0];
  const seciliHedef = savascilar.find((s) => s.id === seciliHedefId);

  // Sol ve Sağ Kanat Savaşçıları
  const solKanat = savascilar.filter((s) => s.side === 'sol');
  const sagKanat = savascilar.filter((s) => s.side === 'sag');

  // Sırayı bir sonraki savaşçıya devret
  const handleSonrakiSira = () => {
    sound.playSealStamp();
    if (savascilar.length === 0) return;

    const nextIdx = (siraIndex + 1) % savascilar.length;
    if (nextIdx === 0) {
      setTurSayaci((prev) => prev + 1);
      setSavasGunlugu((prev) => [`--- ${turSayaci + 1}. Muharebe Turu Başladı ---`, ...prev]);
    }

    setSiraIndex(nextIdx);

    const siradaki = savascilar[nextIdx];
    if (siradaki) {
      if (siradaki.side === 'sol') {
        const canliDusman = sagKanat.find((d) => d.alinanYara < d.yaraKutulari);
        if (canliDusman) setSeciliHedefId(canliDusman.id);
      } else {
        const canliDost = solKanat.find((d) => d.alinanYara < d.yaraKutulari);
        if (canliDost) setSeciliHedefId(canliDost.id);
      }
    }
  };

  // Sıra Tabanlı Saldırı ve Zar Çarpışması
  const handleSaldiriGerceklestir = () => {
    if (!aktifSavasci || !seciliHedef) return;

    sound.playDiceRoll();
    setDarbeEfekti(true);

    setTimeout(() => {
      sound.playBladeClash();

      // 4dF Saldırı Zarı (Attacker)
      const saldiriZarlari = zarAt4dF();
      const saldiriZarToplami = saldiriZarlari.reduce((a, b) => a + b, 0);
      const saldiriToplami = saldiriZarToplami + aktifSavasci.fightBonus;

      // 4dF Savunma Zarı (Defender)
      const savunmaZarlari = zarAt4dF();
      const savunmaZarToplami = savunmaZarlari.reduce((a, b) => a + b, 0);
      const savunmaToplami = savunmaZarToplami + seciliHedef.savunmaBonus;

      // Kural Motoruyla Hasar ve Yara Hesabı
      const hesap = saldiriHesapla(saldiriToplami, savunmaToplami, seciliHedef.zirh);

      const yeniCatisma = {
        saldiranAd: aktifSavasci.ad,
        hedefAd: seciliHedef.ad,
        saldiriZarlari,
        saldiriZarToplami,
        saldiranBonus: aktifSavasci.fightBonus,
        saldiriToplami,
        savunmaZarlari,
        savunmaZarToplami,
        savunmaBonus: seciliHedef.savunmaBonus,
        savunmaToplami,
        vurusFarki: hesap.vurusFarki,
        hedefZirh: seciliHedef.zirh,
        netHasar: hesap.netHasar,
        kademe: hesap.onerilenYaraKademesi,
        aciklama: hesap.aciklama,
      };

      setSonZarCatismasi(yeniCatisma);
      setDarbeEfekti(false);

      if (hesap.netHasar > 0) {
        setSavascilar((prev) =>
          prev.map((s) => {
            if (s.id === seciliHedef.id) {
              const yeniYara = Math.min(s.yaraKutulari, s.alinanYara + 1);
              return { ...s, alinanYara: yeniYara };
            }
            return s;
          })
        );
      }

      const yeniLog = `[Tur ${turSayaci}] ${aktifSavasci.ad} ➔ ${seciliHedef.ad} | Saldırı: 4dF(${saldiriZarToplami >= 0 ? `+${saldiriZarToplami}` : saldiriZarToplami}) + ${aktifSavasci.fightBonus} = ${saldiriToplami} vs Savunma: 4dF(${savunmaZarToplami >= 0 ? `+${savunmaZarToplami}` : savunmaZarToplami}) + ${seciliHedef.savunmaBonus} = ${savunmaToplami} ➔ Net Hasar: ${hesap.netHasar} (${hesap.onerilenYaraKademesi})`;
      setSavasGunlugu((prev) => [yeniLog, ...prev.slice(0, 30)]);

      if (hesap.netHasar >= 4) {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      }
    }, 400);
  };

  // Karakter / Müttefik Ekleme (Sol Kanat)
  const handleSolKarakterEkle = (karakterSecilen: Karakter) => {
    if (savascilar.some((s) => s.id === karakterSecilen.id)) return;

    const yeniDost: Combatant = {
      id: karakterSecilen.id,
      ad: karakterSecilen.ad,
      tur: 'Oyuncu',
      side: 'sol',
      fotoUrl: karakterSecilen.fotoUrl || DEFAULT_AVATARS.Oyuncu,
      fightBonus: karakterSecilen.beceriler.Fight,
      savunmaBonus: karakterSecilen.nitelikler.DEX,
      zirh: 1,
      yaraKutulari: karakterSecilen.sayaclar.yaraKutulari,
      alinanYara: karakterSecilen.sayaclar.alınanYaraKutulari,
      yorgunluk: karakterSecilen.sayaclar.yorgunluk,
      durumlar: ['Teyakkuzda'],
      safYeri: 'Ön Hat',
    };

    setSavascilar((prev) => [...prev, yeniDost]);
    setSavasGunlugu((prev) => [`🛡️ ${karakterSecilen.ad} sol kanada savaşa yerleşti!`, ...prev]);
    sound.playSealStamp();
  };

  // Düşman Ekleme (Sağ Kanat)
  const handleSagDusmanEkle = (sablon: Omit<Combatant, 'id' | 'side'>) => {
    const yeniDusman: Combatant = {
      ...sablon,
      id: `mob_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      side: 'sag',
    };

    setSavascilar((prev) => [...prev, yeniDusman]);
    setSavasGunlugu((prev) => [`🩸 ${yeniDusman.ad} sağ kanatta muharebeye girdi!`, ...prev]);
    sound.playBladeClash();
  };

  // Savaşçıyı Alandan Çıkar
  const handleSavasciCikar = (id: string) => {
    setSavascilar((prev) => prev.filter((s) => s.id !== id));
    if (seciliHedefId === id) {
      setSeciliHedefId('');
    }
  };

  // Can / Yara Ayarı
  const handleYaraAyarla = (id: string, delta: number) => {
    setSavascilar((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const yeni = Math.max(0, Math.min(s.yaraKutulari, s.alinanYara + delta));
          return { ...s, alinanYara: yeni };
        }
        return s;
      })
    );
  };

  // Fotoğraf Yükleme / Değiştirme
  const handleFotoYukle = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSavascilar((prev) =>
          prev.map((s) => (s.id === id ? { ...s, fotoUrl: base64 } : s))
        );
        sound.playSealStamp();
      };
      reader.readAsDataURL(file);
    }
  };

  // Cephe Zarı (Toplu Birlik)
  const handleCepheZariAtisi = () => {
    sound.playBladeClash();
    const sonuc = cepheZariAt();
    setCepheSonuc(sonuc);
    setSavasGunlugu((prev) => [
      `🚩 [CEPHE SAVAŞI] ${sonuc.sonuc} ➔ ${sonuc.aciklama}`,
      ...prev,
    ]);
  };

  // Sıfırla & Yeniden Başlat
  const handleSavasiSifirla = () => {
    setSiraIndex(0);
    setTurSayaci(1);
    setSonZarCatismasi(null);
    setSavascilar((prev) => prev.map((s) => ({ ...s, alinanYara: 0, yorgunluk: 0 })));
    setSavasGunlugu(['⚔️ Meydan temizlendi, yeni muharebe düzeni alındı!']);
    sound.playSealStamp();
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-5 space-y-4">
      {/* Üst İnisiyatif & Tur Zaman Şeridi */}
      <div className="parchment-sheet p-3 sm:p-4 rounded-xl border-2 border-[#54412e] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center text-amber-200 shadow-md">
            <Swords className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-lg sm:text-xl text-[#f3ece0]">
                SIRA TABANLI SAVAŞ &amp; DÜELLO MEYDANI
              </h1>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 font-mono text-xs font-bold border border-amber-800">
                TUR #{turSayaci}
              </span>
            </div>
            <p className="text-xs text-[#a49684]">
              Sol: <strong>Karakterlerimiz</strong> | Sağ: <strong>Düşmanlar</strong> • Savaşçı portreleri ve canlı can durumu
            </p>
          </div>
        </div>

        {/* Eylem Butonları */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setYerlestirModalAcik(true)}
            className="px-3 py-1.5 rounded bg-[#2b1f15] hover:bg-[#3d2c1e] text-amber-200 text-xs font-heading font-bold border border-[#523d2b] flex items-center gap-1.5 shadow"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>Karakter / Düşman Yerleştir</span>
          </button>

          <button
            onClick={handleCepheZariAtisi}
            className="px-3 py-1.5 rounded bg-[#3f1919] hover:bg-[#582121] text-red-200 text-xs font-heading font-bold border border-red-800 flex items-center gap-1.5 shadow"
            title="Kitlesel birlik savaşı için Rion vs Garion zarı"
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Cephe Zarı</span>
          </button>

          <button
            onClick={handleSavasiSifirla}
            className="p-1.5 rounded bg-[#221a14] hover:bg-[#33261d] text-stone-400 hover:text-white border border-[#443322]"
            title="Savaşı ve Yaraları Sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSonrakiSira}
            className="px-4 py-1.5 rounded wax-seal text-white text-xs font-heading font-black hover:brightness-110 active:scale-95 transition-all shadow flex items-center gap-1.5"
          >
            <span>Turu İlerlet (Sıradaki)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* İnisiyatif Sıra Kartları Şeridi (Fotoğraflı) */}
      <div className="bg-[#120e0b] p-2.5 rounded-xl border border-[#3e2e20] shadow-inner overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[10px] uppercase font-heading font-bold text-[#8a7a67] mr-1">
            İnisiyatif:
          </span>
          {savascilar.map((s, idx) => {
            const isCurrent = idx === siraIndex;
            const isDead = s.alinanYara >= s.yaraKutulari;
            const isSol = s.side === 'sol';

            return (
              <div
                key={s.id}
                onClick={() => setSiraIndex(idx)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                  isCurrent
                    ? isSol
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-400 scale-105 shadow-lg'
                      : 'bg-red-950/80 border-red-500 text-red-200 ring-2 ring-red-400 scale-105 shadow-lg'
                    : isDead
                    ? 'bg-black/60 border-stone-800 text-stone-600 line-through opacity-50'
                    : isSol
                    ? 'bg-[#1b1510] border-[#443323] text-[#dcd1be]'
                    : 'bg-[#221313] border-red-900/60 text-[#dfc3c3]'
                }`}
              >
                {/* Portre Küçük Resmi */}
                <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-500/60 bg-black flex-shrink-0">
                  <img
                    src={s.fotoUrl || DEFAULT_AVATARS[s.tur]}
                    alt={s.ad}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span
                  className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                    isSol ? 'bg-amber-800 text-white' : 'bg-red-800 text-white'
                  }`}
                >
                  {idx + 1}
                </span>

                <span className="font-heading font-bold text-xs truncate max-w-[110px]">
                  {s.ad}
                </span>

                {isCurrent && (
                  <span className="text-[9px] px-1 bg-amber-400 text-black font-black rounded uppercase">
                    Sırada
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* İKİYE BÖLÜNMÜŞ SAVAŞ RPG ARENASI:
          SOL (Karakterler/Müttefikler) | ORTA (Fotoğraflı Düello Masası) | SAĞ (Düşmanlar/Canavarlar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* SOL KANAT: OYUNCULAR & MÜTTEFİKLER (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 bg-gradient-to-r from-amber-950/40 to-transparent border-l-4 border-amber-500 rounded-r-lg flex items-center justify-between">
            <div>
              <h2 className="font-heading font-black text-sm uppercase text-amber-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Sol Kanat: Karakterlerimiz</span>
              </h2>
              <span className="text-[10px] text-[#9d8d7b]">
                Toplam {solKanat.length} Savaşçı
              </span>
            </div>
            <button
              onClick={() => setYerlestirModalAcik(true)}
              className="p-1 rounded bg-[#271e16] hover:bg-[#3d2c1e] text-amber-200 text-xs border border-[#503d2b]"
              title="Partiden Savaşçı Ekle"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {solKanat.map((s) => {
              const isCurrentTurn = savascilar[siraIndex]?.id === s.id;
              const isSelectedTarget = seciliHedefId === s.id;
              const isDead = s.alinanYara >= s.yaraKutulari;
              const kalanCan = Math.max(0, s.yaraKutulari - s.alinanYara);
              const canYuzdesi = (kalanCan / s.yaraKutulari) * 100;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    if (aktifSavasci?.side === 'sag') {
                      setSeciliHedefId(s.id);
                    }
                  }}
                  className={`p-3.5 rounded-xl border-2 transition-all relative ${
                    isCurrentTurn
                      ? 'bg-[#291e14] border-amber-400 shadow-xl ring-2 ring-amber-400/80 scale-[1.02]'
                      : isSelectedTarget
                      ? 'bg-[#221a12] border-cyan-400 ring-2 ring-cyan-400/60'
                      : isDead
                      ? 'bg-black/70 border-stone-800 opacity-60'
                      : 'bg-[#18130e] border-[#443322] hover:border-[#674e35]'
                  }`}
                >
                  {/* Aktif Sıra Rozeti */}
                  {isCurrentTurn && (
                    <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-heading font-black text-[10px] uppercase shadow flex items-center gap-1 z-10">
                      <Zap className="w-3 h-3 text-stone-950 fill-current" />
                      <span>SIRADAKİ EYLEM</span>
                    </div>
                  )}

                  {isSelectedTarget && (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-cyan-500 text-stone-950 font-heading font-black text-[10px] uppercase shadow flex items-center gap-1 z-10">
                      <Crosshair className="w-3 h-3" />
                      <span>HEDEF</span>
                    </div>
                  )}

                  {/* KART GÖVDESİ: BÜYÜK FOTOĞRAF + BİLGİLER */}
                  <div className="flex gap-3">
                    {/* BÜYÜK KARAKTER PORTRESİ */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-amber-600/70 bg-black shadow-lg flex-shrink-0 relative group">
                      <img
                        src={s.fotoUrl || DEFAULT_AVATARS.Oyuncu}
                        alt={s.ad}
                        className="w-full h-full object-cover sepia-[0.15] group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Portre Değiştirme Butonu (Hover) */}
                      <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-amber-200 text-[9px] font-bold">
                        <Camera className="w-4 h-4 mb-0.5 text-amber-400" />
                        <span>Fotoğraf</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFotoYukle(s.id, e)}
                          className="hidden"
                        />
                      </label>
                      <span className="absolute bottom-0 inset-x-0 text-center py-0.5 text-[8px] font-bold uppercase text-white bg-amber-950/90">
                        {s.safYeri}
                      </span>
                    </div>

                    {/* Sağ Taraf: İsim, Dövüş, Zırh, Can Barı */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading font-bold text-sm text-[#f5ebd7] leading-tight">
                            {s.ad}
                          </h3>
                          <span className="font-mono font-bold text-xs text-amber-300">
                            +{s.fightBonus} Fight
                          </span>
                        </div>
                        <div className="text-[10px] text-[#93826e] flex items-center justify-between">
                          <span>Savunma: +{s.savunmaBonus}</span>
                          <span>{s.zirh} Zırh Eşiği</span>
                        </div>
                      </div>

                      {/* Can Durumu & Barı */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#a49684] font-semibold flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span>Can:</span>
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              isDead ? 'text-red-500' : kalanCan === 1 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {isDead ? 'Savaş Dışı' : `${kalanCan} / ${s.yaraKutulari}`}
                          </span>
                        </div>

                        <div className="w-full bg-[#120e0b] h-2 rounded-full overflow-hidden border border-[#3b2b1d]">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isDead ? 'bg-stone-800' : canYuzdesi <= 33 ? 'bg-red-600' : canYuzdesi <= 66 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${canYuzdesi}%` }}
                          />
                        </div>
                      </div>

                      {/* İnteraktif Yara Kutucukları */}
                      <div className="flex items-center gap-1 pt-1">
                        {Array.from({ length: s.yaraKutulari }).map((_, i) => {
                          const isHit = i < s.alinanYara;
                          return (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleYaraAyarla(s.id, isHit ? -1 : 1);
                              }}
                              className={`flex-1 h-4 rounded text-[9px] font-bold border flex items-center justify-center transition-colors ${
                                isHit
                                  ? 'bg-red-900 border-red-600 text-white'
                                  : 'bg-[#1b1510] border-[#443323] text-[#715c48] hover:border-red-400'
                              }`}
                              title="Yara durumunu değiştir"
                            >
                              {isHit ? 'X' : i + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Alt Durumlar */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mt-2 pt-1 border-t border-[#312316] text-[10px]">
                    <div className="flex flex-wrap gap-1">
                      {s.durumlar.map((d, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-[#271d15] text-amber-200 border border-[#443322]">
                          {d}
                        </span>
                      ))}
                    </div>

                    {rol === 'Anlatıcı' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSavasciCikar(s.id);
                        }}
                        className="text-stone-500 hover:text-red-400"
                        title="Savaşçı Alanından Çıkar"
                      >
                        Çıkar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORTA KORİDOR: SİNEMATİK FOTOĞRAFLI DÜELLO MASASI & ZAR ÇATIŞMASI (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412f] shadow-2xl space-y-3">
            {/* SİNEMATİK FOTOĞRAFLI YÜZLEŞME (FACE-OFF CARD) */}
            <div className="relative p-3 rounded-xl bg-gradient-to-b from-[#24170d] via-[#1a110a] to-[#24170d] border border-[#523d2b] shadow-2xl flex items-center justify-between gap-2">
              {/* Saldıran Savaşçı Portresi */}
              <div className="flex flex-col items-center text-center space-y-1 flex-1">
                <div
                  className={`relative w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 shadow-xl ${
                    aktifSavasci?.side === 'sol'
                      ? 'border-amber-400 ring-2 ring-amber-400/60'
                      : 'border-red-500 ring-2 ring-red-500/60'
                  }`}
                >
                  <img
                    src={aktifSavasci?.fotoUrl || DEFAULT_AVATARS[aktifSavasci?.tur || 'Oyuncu']}
                    alt={aktifSavasci?.ad}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/85 text-[8px] font-bold text-amber-300">
                    Saldıran
                  </span>
                </div>
                <div className="font-heading font-black text-xs text-[#f6efe6] truncate max-w-[100px]">
                  {aktifSavasci?.ad}
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  +{aktifSavasci?.fightBonus} Fight
                </span>
              </div>

              {/* Ortadaki VS Çarpışma Rozeti */}
              <div className="flex flex-col items-center justify-center px-1">
                <div className="w-9 h-9 rounded-full bg-red-950 border-2 border-red-700 flex items-center justify-center text-red-200 shadow-xl font-heading font-black text-xs animate-pulse">
                  VS
                </div>
                <span className="text-[8px] font-mono text-[#8a7a67] uppercase mt-1">Düello</span>
              </div>

              {/* Hedef Düşman Portresi */}
              <div className="flex flex-col items-center text-center space-y-1 flex-1">
                <div className="relative w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-cyan-400 ring-2 ring-cyan-400/60 shadow-xl">
                  <img
                    src={seciliHedef?.fotoUrl || DEFAULT_AVATARS[seciliHedef?.tur || 'Düşman']}
                    alt={seciliHedef?.ad || 'Hedef'}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-black/85 text-[8px] font-bold text-cyan-300">
                    Hedef
                  </span>
                </div>
                <div className="font-heading font-black text-xs text-[#f6efe6] truncate max-w-[100px]">
                  {seciliHedef?.ad || 'Hedef Yok'}
                </div>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">
                  +{seciliHedef?.savunmaBonus || 0} Sav / {seciliHedef?.zirh || 0} Zırh
                </span>
              </div>
            </div>

            {/* Eylem Butonu: Zar At & Çatış */}
            <button
              onClick={handleSaldiriGerceklestir}
              disabled={darbeEfekti || !seciliHedefId}
              className={`w-full py-3 px-4 rounded-xl wax-seal text-white font-heading font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 ${
                darbeEfekti ? 'animate-pulse' : ''
              }`}
            >
              <Swords className="w-4 h-4 text-amber-300" />
              <span>{darbeEfekti ? 'Zarlar Çarpışıyor...' : 'ZAR AT & DARBE İNDİR (4dF)'}</span>
            </button>

            {/* ZAR DURUMU & NİHAİ VURUŞ AYRINTISI */}
            {sonZarCatismasi && (
              <div className="p-3 rounded-lg bg-[#140f0c] border border-[#523d2b] space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between text-xs border-b border-[#2d2015] pb-1">
                  <span className="font-heading font-bold text-amber-300">
                    Son Darbe Çözümlemesi
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      sonZarCatismasi.netHasar > 0
                        ? 'bg-red-950 text-red-200 border border-red-700'
                        : 'bg-stone-900 text-stone-400'
                    }`}
                  >
                    {sonZarCatismasi.kademe}
                  </span>
                </div>

                {/* Saldırı Zarı Durumu */}
                <div className="text-[11px] font-mono flex items-center justify-between bg-[#1d1611] p-1.5 rounded">
                  <span className="text-[#a49684]">
                    Saldırı ({sonZarCatismasi.saldiranAd}):
                  </span>
                  <span className="text-amber-300 font-bold">
                    4dF({sonZarCatismasi.saldiriZarToplami >= 0 ? `+${sonZarCatismasi.saldiriZarToplami}` : sonZarCatismasi.saldiriZarToplami}) + {sonZarCatismasi.saldiranBonus} = {sonZarCatismasi.saldiriToplami}
                  </span>
                </div>

                {/* Savunma Zarı Durumu */}
                <div className="text-[11px] font-mono flex items-center justify-between bg-[#161d18] p-1.5 rounded">
                  <span className="text-emerald-300/80">
                    Savunma ({sonZarCatismasi.hedefAd}):
                  </span>
                  <span className="text-emerald-300 font-bold">
                    4dF({sonZarCatismasi.savunmaZarToplami >= 0 ? `+${sonZarCatismasi.savunmaZarToplami}` : sonZarCatismasi.savunmaZarToplami}) + {sonZarCatismasi.savunmaBonus} = {sonZarCatismasi.savunmaToplami}
                  </span>
                </div>

                {/* Vuruş Farkı & Zırh İndirimi */}
                <div className="text-[11px] text-[#baa997] font-serif pt-1">
                  Vuruş Farkı: <strong>{sonZarCatismasi.vurusFarki}</strong> &minus; Zırh: <strong>{sonZarCatismasi.hedefZirh}</strong> ➔ Net Hasar:{' '}
                  <strong className="text-red-400 font-bold">{sonZarCatismasi.netHasar}</strong>
                  <div className="italic text-[10px] text-[#93826e] mt-0.5">
                    &quot;{sonZarCatismasi.aciklama}&quot;
                  </div>
                </div>
              </div>
            )}

            {/* Cephe Zarı Sonucu (Eğer atıldıysa) */}
            {cepheSonuc && (
              <div className="p-2.5 rounded bg-[#241313] border border-red-900/80 text-xs text-red-200">
                <span className="font-bold text-amber-300 block">
                  Cephe Birlik Savaşı: {cepheSonuc.sonuc}
                </span>
                <span className="text-[11px] text-[#e0cfc0] mt-0.5 block">
                  {cepheSonuc.aciklama}
                </span>
              </div>
            )}
          </div>

          {/* Savaş Günlüğü (Combat Log) */}
          <div className="parchment-sheet p-3.5 rounded-xl border border-[#483726] shadow text-xs space-y-1.5">
            <span className="font-heading font-bold text-xs uppercase text-[#b8a795] block border-b border-[#3b2b1d] pb-1">
              Meydan Günlüğü
            </span>
            <div className="max-h-40 overflow-y-auto space-y-1 font-mono text-[10px] text-[#cfc2b1] pr-1">
              {savasGunlugu.map((log, idx) => (
                <div key={idx} className="p-1 rounded bg-[#16120e]">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ KANAT: DÜŞMANLAR & CANAVARLAR (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 bg-gradient-to-l from-red-950/40 to-transparent border-r-4 border-red-600 rounded-l-lg flex items-center justify-between text-right">
            <button
              onClick={() => setYerlestirModalAcik(true)}
              className="p-1 rounded bg-[#2d1717] hover:bg-[#432020] text-red-200 text-xs border border-red-800"
              title="Düşman / Canavar Çağır"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <div>
              <h2 className="font-heading font-black text-sm uppercase text-red-400 flex items-center gap-1.5 justify-end">
                <span>Sağ Kanat: Düşmanlar</span>
                <Skull className="w-4 h-4 text-red-500" />
              </h2>
              <span className="text-[10px] text-[#9d8d7b]">
                Toplam {sagKanat.length} Tehdit
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {sagKanat.map((s) => {
              const isCurrentTurn = savascilar[siraIndex]?.id === s.id;
              const isSelectedTarget = seciliHedefId === s.id;
              const isDead = s.alinanYara >= s.yaraKutulari;
              const kalanCan = Math.max(0, s.yaraKutulari - s.alinanYara);
              const canYuzdesi = (kalanCan / s.yaraKutulari) * 100;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSeciliHedefId(s.id);
                  }}
                  className={`p-3.5 rounded-xl border-2 transition-all relative cursor-pointer ${
                    isCurrentTurn
                      ? 'bg-[#311818] border-red-500 shadow-xl ring-2 ring-red-500/80 scale-[1.02]'
                      : isSelectedTarget
                      ? 'bg-[#291414] border-amber-400 ring-2 ring-amber-400/80 shadow-md'
                      : isDead
                      ? 'bg-black/70 border-stone-800 opacity-60'
                      : 'bg-[#1d1212] border-red-950/80 hover:border-red-800'
                  }`}
                >
                  {/* Hedef Rozeti */}
                  {isSelectedTarget && (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-amber-400 text-stone-950 font-heading font-black text-[10px] uppercase shadow flex items-center gap-1 z-10">
                      <Crosshair className="w-3 h-3" />
                      <span>HEDEFTE</span>
                    </div>
                  )}

                  {isCurrentTurn && (
                    <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-red-600 text-white font-heading font-black text-[10px] uppercase shadow flex items-center gap-1 z-10">
                      <Zap className="w-3 h-3 text-amber-300 fill-current" />
                      <span>DÜŞMAN SIRASI</span>
                    </div>
                  )}

                  {/* KART GÖVDESİ: BÜYÜK CANAVAR PORTRESİ + BİLGİLER */}
                  <div className="flex gap-3">
                    {/* BÜYÜK CANAVAR / DÜŞMAN PORTRESİ */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-red-700/80 bg-black shadow-lg flex-shrink-0 relative group">
                      <img
                        src={s.fotoUrl || DEFAULT_AVATARS.Düşman}
                        alt={s.ad}
                        className="w-full h-full object-cover sepia-[0.2] group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Portre Değiştirme Butonu (Hover) */}
                      <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-red-200 text-[9px] font-bold">
                        <Camera className="w-4 h-4 mb-0.5 text-red-400" />
                        <span>Fotoğraf</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFotoYukle(s.id, e)}
                          className="hidden"
                        />
                      </label>
                      <span className="absolute bottom-0 inset-x-0 text-center py-0.5 text-[8px] font-bold uppercase text-white bg-red-950/90">
                        {s.safYeri}
                      </span>
                    </div>

                    {/* Sağ Taraf: İsim, Tehdit, Dövüş, Can Barı */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading font-bold text-sm text-[#f5ecd8] leading-tight">
                            {s.ad}
                          </h3>
                          {s.tehdit && (
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-black uppercase ${
                                s.tehdit === 'Ölümcül'
                                  ? 'bg-red-950 text-red-300 border border-red-700'
                                  : s.tehdit === 'Yüksek'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                  : 'bg-stone-900 text-stone-300'
                              }`}
                            >
                              {s.tehdit}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#a99c8b] flex items-center justify-between mt-0.5">
                          <span className="font-mono text-red-300 font-bold">
                            +{s.fightBonus} Fight / {s.zirh} Zırh
                          </span>
                          <span>Sav: +{s.savunmaBonus}</span>
                        </div>
                      </div>

                      {/* Can Durumu & Barı */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-[#a49684] font-semibold flex items-center gap-1">
                            <Heart className="w-3 h-3 text-red-400" />
                            <span>Can:</span>
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              isDead ? 'text-red-500' : kalanCan === 1 ? 'text-amber-400' : 'text-emerald-400'
                            }`}
                          >
                            {isDead ? 'İmhâ Edildi' : `${kalanCan} / ${s.yaraKutulari}`}
                          </span>
                        </div>

                        <div className="w-full bg-[#120e0b] h-2 rounded-full overflow-hidden border border-[#3b2b1d]">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isDead ? 'bg-stone-800' : canYuzdesi <= 33 ? 'bg-red-600' : 'bg-red-700'
                            }`}
                            style={{ width: `${canYuzdesi}%` }}
                          />
                        </div>
                      </div>

                      {/* İnteraktif Yara Kutucukları */}
                      <div className="flex items-center gap-1 pt-1">
                        {Array.from({ length: s.yaraKutulari }).map((_, i) => {
                          const isHit = i < s.alinanYara;
                          return (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleYaraAyarla(s.id, isHit ? -1 : 1);
                              }}
                              className={`flex-1 h-4 rounded text-[9px] font-bold border flex items-center justify-center transition-colors ${
                                isHit
                                  ? 'bg-red-800 border-red-500 text-white'
                                  : 'bg-[#181111] border-red-950 text-[#715c48] hover:border-red-400'
                              }`}
                              title="Yara durumunu değiştir"
                            >
                              {isHit ? 'X' : i + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Alt Özel Davranış & Çıkar */}
                  <div className="mt-2 pt-1 border-t border-[#3b2323] text-[10px] text-[#cfbfae] flex items-center justify-between">
                    <span className="italic line-clamp-1">
                      {s.ozelDavranis || 'Temel saldırı hamlesi'}
                    </span>

                    {rol === 'Anlatıcı' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSavasciCikar(s.id);
                        }}
                        className="text-stone-500 hover:text-red-400 ml-2"
                        title="Düşmanı Alandan Çıkar"
                      >
                        Çıkar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KARAKTER & DÜŞMAN YERLEŞTİRME MODALI (FOTOĞRAFLI) */}
      {yerlestirModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-[#68523b] max-w-2xl w-full shadow-2xl text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#443322] pb-2">
              <h3 className="font-heading font-black text-base text-amber-200 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Savaş Alanına Savaşçı / Düşman Yerleştir</span>
              </h3>
              <button
                onClick={() => setYerlestirModalAcik(false)}
                className="text-stone-400 hover:text-white"
              >
                Kapat
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sol Kanat İçin Partiden Ekle */}
              <div className="bg-[#17130f] p-3 rounded-xl border border-[#443322] space-y-2">
                <span className="font-heading font-bold text-amber-300 block text-xs border-b border-[#3b2b1d] pb-1">
                  1. Sol Kanat (Karakterlerimiz &amp; Müttefikler)
                </span>
                <p className="text-[10px] text-[#9a8976]">
                  Partideki maceracıları sol kanada yerleştirin.
                </p>

                <div className="space-y-2 pt-1">
                  {karakterler.map((c) => {
                    const isAdded = savascilar.some((s) => s.id === c.id);
                    return (
                      <div
                        key={c.id}
                        className="p-2 rounded-lg bg-[#201812] border border-[#3e2e20] flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#503e2c] bg-black flex-shrink-0">
                            <img
                              src={c.fotoUrl || DEFAULT_AVATARS.Oyuncu}
                              alt={c.ad}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#f5ecd8]">{c.ad}</div>
                            <div className="text-[10px] text-[#9d8d7b]">
                              +{c.beceriler.Fight} Fight • {c.sayaclar.yaraKutulari} Can
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSolKarakterEkle(c)}
                          disabled={isAdded}
                          className="px-2.5 py-1 rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 text-xs font-bold border border-[#785734] disabled:opacity-40"
                        >
                          {isAdded ? 'Alanda' : '+ Yerleştir'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sağ Kanat İçin Hazır Düşman Çağır */}
              <div className="bg-[#1e1313] p-3 rounded-xl border border-red-950 space-y-2">
                <span className="font-heading font-bold text-red-400 block text-xs border-b border-[#3b2323] pb-1">
                  2. Sağ Kanat (Düşmanlar &amp; Canavarlar)
                </span>
                <p className="text-[10px] text-[#a99c8b]">
                  Karanlık fantezi canavarlarını sağ kanada çağırın.
                </p>

                <div className="space-y-2 pt-1">
                  {HAZIR_DUSMAN_SABLONLARI.map((sablon, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#281515] border border-red-900/60 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-red-800 bg-black flex-shrink-0">
                          <img
                            src={sablon.fotoUrl || DEFAULT_AVATARS.Düşman}
                            alt={sablon.ad}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#fce8e8]">{sablon.ad}</div>
                          <div className="text-[10px] text-[#c9b2b2]">
                            +{sablon.fightBonus} Fight • {sablon.zirh} Zırh • {sablon.tehdit}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSagDusmanEkle(sablon)}
                        className="px-2.5 py-1 rounded bg-[#501c1c] hover:bg-[#6c2424] text-red-100 text-xs font-bold border border-red-800"
                      >
                        + Çağır
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#443322]">
              <button
                onClick={() => setYerlestirModalAcik(false)}
                className="px-4 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs"
              >
                Meydana Dön
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
