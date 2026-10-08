import React, { useState } from 'react';
import {
  Karakter,
  EkipmanAspect,
  hesaplaKarakterYuk,
  hesaplaMaksimumYuk,
  HANELER,
} from '../rules';
import { CANON_SHOP_ITEMS } from '../data/canonInventory';
import { getStatusEffect } from '../rules/statusEffects';
import { sound } from '../utils/audio';
import {
  Package,
  Shield,
  Swords,
  Sparkles,
  Heart,
  Plus,
  Trash2,
  Check,
  X,
  Search,
  AlertTriangle,
  Coins,
  Backpack,
  Store,
  Hammer,
  Feather,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InventoryScreenProps {
  karakter: Karakter;
  karakterler: Karakter[];
  onKarakterGuncelle: (guncel: Karakter) => void;
  onKarakterSec: (id: string) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
}

type KategoriFiltresi = 'Tümü' | 'Silah' | 'Zırh' | 'Kalkan' | 'Büyülü Yadigar' | 'Tıbbi' | 'Teçhizat';

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  karakter,
  karakterler,
  onKarakterGuncelle,
  onKarakterSec,
  rol,
}) => {
  const [seciliKategori, setSeciliKategori] = useState<KategoriFiltresi>('Tümü');
  const [aramaMetni, setAramaMetni] = useState('');
  const [pazarModalAcik, setPazarModalAcik] = useState(false);
  const [ozelEsyaModalAcik, setOzelEsyaModalAcik] = useState(false);

  // Sürükle-Bırak (Drag & Drop) ve Stunt Tetikleme State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [stuntToast, setStuntToast] = useState<{ title: string; desc: string } | null>(null);

  // Özel Eşya Form State
  const [yeniAd, setYeniAd] = useState('');
  const [yeniTur, setYeniTur] = useState<EkipmanAspect['tur']>('Silah');
  const [yeniNadir, setYeniNadir] = useState<EkipmanAspect['nadir']>('Usta İşi');
  const [yeniYuk, setYeniYuk] = useState<number>(1);
  const [yeniFiyat, setYeniFiyat] = useState<number>(15);
  const [yeniAspect, setYeniAspect] = useState('');
  const [yeniHedefDurum, setYeniHedefDurum] = useState('Yok');
  const [yeniKullaniciDurum, setYeniKullaniciDurum] = useState('Yok');

  const haneInfo = HANELER[karakter.hane] || HANELER.Stallhart;
  const envanter = karakter.envanter || [];
  const toplamYuk = hesaplaKarakterYuk(envanter);
  const maksYuk = hesaplaMaksimumYuk(karakter);
  const asiriYukluMu = toplamYuk > maksYuk;
  const yukOrani = Math.min(100, Math.round((toplamYuk / maksYuk) * 100));

  // Kuşanılan Eşyalar
  const kusanilanEsyalar = envanter.filter((item) => item.kusandiMi);
  const toplamZirh = kusanilanEsyalar.reduce((sum, item) => sum + (item.zirhPuani || 0), 0);
  const toplamKalkan = kusanilanEsyalar.reduce((sum, item) => sum + (item.kalkanSavunma || 0), 0);
  const toplamHasarBonus = kusanilanEsyalar.reduce((sum, item) => sum + (item.hasarBonus || 0), 0);

  // Sürükle Bırak ile Kuşanma / Yuva Eşleme
  const handleDropToSlot = (slotTur: 'Silah' | 'Zırh' | 'Kalkan' | 'Büyülü Yadigar' | 'Çanta') => {
    if (!draggedItemId) return;
    const item = envanter.find((e) => e.id === draggedItemId);
    if (!item) return;

    if (slotTur === 'Çanta') {
      // Çantaya bırakıldıysa kuşanmayı kaldır
      if (item.kusandiMi) {
        handleKusanToggle(item.id);
      }
    } else {
      // Kuşanma yuvasına bırakıldıysa kuşan
      if (!item.kusandiMi) {
        handleKusanToggle(item.id);
      }
    }
    setDraggedItemId(null);
  };

  // Özel Fate Stunt Etkisini Otomatik Tetikleme
  const handleTriggerStunt = (item: EkipmanAspect) => {
    sound.playBladeClash();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });

    const stuntText = item.aspectEtkisi || item.durumSinerjisi?.aciklama || `${item.ad} özel kadim savaş hamlesi!`;

    // Eğer eşya "Leke" içeriyorsa Leke Sayacını artır
    let guncelSayaclar = { ...karakter.sayaclar };
    let guncelDurumlar = [...(karakter.durumlar || [])];

    if (stuntText.toLowerCase().includes('leke')) {
      const yeniLeke = Math.min(9, (guncelSayaclar.leke || 0) + 1);
      guncelSayaclar.leke = yeniLeke;
    }

    if (item.durumSinerjisi?.hedefDurum && !guncelDurumlar.includes(item.durumSinerjisi.hedefDurum)) {
      guncelDurumlar.push(item.durumSinerjisi.hedefDurum);
    }

    onKarakterGuncelle({
      ...karakter,
      sayaclar: guncelSayaclar,
      durumlar: guncelDurumlar,
    });

    setStuntToast({
      title: `⚔️ [FATE STUNT AKTİF]: ${item.ad}`,
      desc: stuntText,
    });

    setTimeout(() => {
      setStuntToast(null);
    }, 4000);
  };

  // Kuşanma / Çıkarma
  const handleKusanToggle = (esyaId: string) => {
    sound.playBladeClash();
    const guncelEnvanter = envanter.map((item) => {
      if (item.id === esyaId) {
        const yeniKusandi = !item.kusandiMi;

        // Kuşanıldığında/çıkarıldığında kullanıcıya durum efekti sinerjisi yansıt
        let guncelDurumlar = [...(karakter.durumlar || [])];
        if (item.durumSinerjisi?.kullaniciDurum) {
          const d = item.durumSinerjisi.kullaniciDurum;
          if (yeniKusandi && !guncelDurumlar.includes(d)) {
            guncelDurumlar.push(d);
            confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
          } else if (!yeniKusandi) {
            guncelDurumlar = guncelDurumlar.filter((x) => x !== d);
          }
        }

        onKarakterGuncelle({
          ...karakter,
          durumlar: guncelDurumlar,
          envanter: envanter.map((e) => (e.id === esyaId ? { ...e, kusandiMi: yeniKusandi } : e)),
        });

        return { ...item, kusandiMi: yeniKusandi };
      }
      return item;
    });

    onKarakterGuncelle({
      ...karakter,
      envanter: guncelEnvanter,
    });
  };

  // Eşya Tüket / Kullan (Tıbbi, İksir vb.)
  const handleEsyaKullan = (item: EkipmanAspect) => {
    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });

    let guncelDurumlar = [...(karakter.durumlar || [])];

    // Temizlenen durumlar
    if (item.durumSinerjisi?.kaldirilanDurumlar) {
      guncelDurumlar = guncelDurumlar.filter(
        (d) => !item.durumSinerjisi!.kaldirilanDurumlar!.some((k) => d.toLowerCase().includes(k.toLowerCase()))
      );
    }

    // Eklenen durumlar
    if (item.durumSinerjisi?.kullaniciDurum) {
      const d = item.durumSinerjisi.kullaniciDurum;
      if (!guncelDurumlar.includes(d)) {
        guncelDurumlar.push(d);
      }
    }

    // Tüketilen tek kullanımlık eşyayı envanterden çıkar
    const yeniEnvanter = envanter.filter((e) => e.id !== item.id);

    onKarakterGuncelle({
      ...karakter,
      durumlar: guncelDurumlar,
      envanter: yeniEnvanter,
    });
  };

  // Eşya Sil / Bırak
  const handleEsyaSil = (esyaId: string) => {
    sound.playSealStamp();
    const silinen = envanter.find((e) => e.id === esyaId);
    let guncelDurumlar = [...(karakter.durumlar || [])];

    if (silinen?.durumSinerjisi?.kullaniciDurum) {
      guncelDurumlar = guncelDurumlar.filter((d) => d !== silinen.durumSinerjisi!.kullaniciDurum);
    }

    onKarakterGuncelle({
      ...karakter,
      durumlar: guncelDurumlar,
      envanter: envanter.filter((e) => e.id !== esyaId),
    });
  };

  // Pazardan Eşya Satın Al / Yağmala
  const handlePazardanAl = (item: EkipmanAspect) => {
    sound.playSealStamp();
    confetti({ particleCount: 20, spread: 45 });
    const yeniEsya: EkipmanAspect = {
      ...item,
      id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      kusandiMi: false,
    };

    const guncelAron = Math.max(0, (karakter.ekonomi?.aron || 0) - item.fiyat);

    onKarakterGuncelle({
      ...karakter,
      ekonomi: { ...karakter.ekonomi, aron: guncelAron },
      envanter: [...envanter, yeniEsya],
    });
  };

  // Özel Eşya Ekle
  const handleOzelEsyaEkle = () => {
    if (!yeniAd.trim()) return;
    sound.playBladeClash();

    const durumSinerjisi =
      yeniHedefDurum !== 'Yok' || yeniKullaniciDurum !== 'Yok'
        ? {
            hedefDurum: yeniHedefDurum !== 'Yok' ? yeniHedefDurum : undefined,
            kullaniciDurum: yeniKullaniciDurum !== 'Yok' ? yeniKullaniciDurum : undefined,
            tetiklenme: (yeniTur === 'Tıbbi' ? 'Kullanıldığında' : yeniTur === 'Silah' ? 'Vuruşta' : 'Kuşanıldığında') as any,
            aciklama: `Özel ${yeniAd} sinerjisi`,
          }
        : undefined;

    const ozelEsya: EkipmanAspect = {
      id: `custom_${Date.now()}`,
      ad: yeniAd.trim(),
      tur: yeniTur,
      nadir: yeniNadir,
      yuk: Number(yeniYuk),
      fiyat: Number(yeniFiyat),
      aspectEtkisi: yeniAspect.trim() || undefined,
      kusandiMi: false,
      durumSinerjisi,
    };

    onKarakterGuncelle({
      ...karakter,
      envanter: [...envanter, ozelEsya],
    });

    setOzelEsyaModalAcik(false);
    setYeniAd('');
    setYeniAspect('');
  };

  // Aron Miktarı Güncelle
  const handleAronDegistir = (delta: number) => {
    sound.playSealStamp();
    onKarakterGuncelle({
      ...karakter,
      ekonomi: {
        ...karakter.ekonomi,
        aron: Math.max(0, (karakter.ekonomi?.aron || 0) + delta),
      },
    });
  };

  // Filtreleme
  const filtrelenmisEnvanter = envanter.filter((item) => {
    const katUyumu = seciliKategori === 'Tümü' || item.tur === seciliKategori;
    const aramaUyumu =
      !aramaMetni ||
      item.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      (item.aspectEtkisi && item.aspectEtkisi.toLowerCase().includes(aramaMetni.toLowerCase())) ||
      (item.durumSinerjisi?.aciklama && item.durumSinerjisi.aciklama.toLowerCase().includes(aramaMetni.toLowerCase()));
    return katUyumu && aramaUyumu;
  });

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* ÜST BİLGİ & KARAKTER SEÇİCİ */}
      <div className="parchment-sheet p-4 rounded-2xl border-2 border-[#54412e] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-600 bg-black flex-shrink-0 shadow-md">
            <img
              src={karakter.fotoUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'}
              alt={karakter.ad}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-lg text-amber-200">{karakter.ad}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold border" style={{ borderColor: haneInfo.renk, color: haneInfo.renk }}>
                {karakter.hane}
              </span>
            </div>
            <p className="text-xs text-[#a99c8b]">
              {karakter.meslek} • {karakter.koken} • {kusanilanEsyalar.length} Teçhizat Kuşanıldı
            </p>
          </div>
        </div>

        {/* Cüzdan & Karakter Değiştirme */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Cüzdan / Aron */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17110c] border border-amber-600/70 shadow-inner">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-black text-sm text-amber-300">
              {karakter.ekonomi?.aron || 0}
            </span>
            <span className="text-[10px] text-[#a89886] font-heading uppercase mr-1">Aron</span>
            <button
              onClick={() => handleAronDegistir(10)}
              className="w-5 h-5 rounded bg-[#2b1f15] hover:bg-amber-900/60 text-amber-300 text-xs font-bold flex items-center justify-center border border-[#443322]"
              title="+10 Aron Ekle"
            >
              +
            </button>
            <button
              onClick={() => handleAronDegistir(-10)}
              className="w-5 h-5 rounded bg-[#2b1f15] hover:bg-red-950 text-red-300 text-xs font-bold flex items-center justify-center border border-[#443322]"
              title="-10 Aron Düş"
            >
              -
            </button>
          </div>

          {/* Karakter Seçici (Yalnızca GM partideki diğer karakterlerin envanterine geçebilir) */}
          {rol === 'Anlatıcı' ? (
            <select
              value={karakter.id}
              onChange={(e) => onKarakterSec(e.target.value)}
              className="bg-[#17120e] border border-amber-600/70 rounded px-3 py-1.5 text-xs text-[#f1e6d4] focus:outline-none"
              title="GM: İncelenecek Karakterin Envanteri"
            >
              {karakterler.map((c) => (
                <option key={c.id} value={c.id}>
                  👑 {c.ad} ({c.hane})
                </option>
              ))}
            </select>
          ) : (
            <div className="px-3 py-1.5 rounded bg-[#17120e] border border-amber-600/50 text-xs font-heading font-bold text-amber-300">
              🛡️ Kendi Envanterin
            </div>
          )}

          {/* Zanaat & Pazar Butonları */}
          <button
            onClick={() => setPazarModalAcik(true)}
            className="px-3 py-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-bold border border-emerald-700 flex items-center gap-1.5 shadow"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kanonik Pazar</span>
          </button>

          <button
            onClick={() => setOzelEsyaModalAcik(true)}
            className="px-3 py-1.5 rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 text-xs font-bold border border-[#785734] flex items-center gap-1.5 shadow"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span>Özel Eşya Döv</span>
          </button>
        </div>
      </div>

      {/* YÜK & KAPASİTE GÖSTERGESİ (LOAD METER) & KUŞANILAN BONUSLAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* YÜK METER (2 COLS) */}
        <div className="lg:col-span-2 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-heading font-black text-amber-300 flex items-center gap-1.5 uppercase">
              <Backpack className="w-4 h-4 text-amber-400" />
              <span>Taşıma Yükü Kapasitesi</span>
            </span>
            <span className="font-mono font-bold text-sm">
              <span className={asiriYukluMu ? 'text-rose-400' : 'text-amber-200'}>{toplamYuk}</span>
              <span className="text-[#887867]"> / {maksYuk} Yük</span>
            </span>
          </div>

          {/* Bar */}
          <div className="w-full bg-[#120e0b] h-3.5 rounded-full overflow-hidden border border-[#3b2b1d] p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                asiriYukluMu
                  ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse'
                  : yukOrani > 75
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-600 to-amber-500'
              }`}
              style={{ width: `${yukOrani}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#a49684]">
              {asiriYukluMu ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 inline" />
                  AŞIRI YÜKLÜ! Taşınamaz yük sebebiyle Zel-vash ve DEX zarlarına -2 Ceza!
                </span>
              ) : yukOrani > 70 ? (
                <span className="text-amber-300">Ağır Yük: Çanta neredeyse dolu, çevikliği koruyun.</span>
              ) : (
                <span className="text-emerald-400">Hafif Yük: Serbest hareket, tüm zarlar engelsiz.</span>
              )}
            </span>
            <span className="font-mono text-[#8a7b6a] text-[10px]">
              Kuşanılan: {kusanilanEsyalar.reduce((s, i) => s + (i.yuk || 1), 0)} Yük
            </span>
          </div>
        </div>

        {/* KUŞANILAN SAVAŞ BONUSLARI (1 COL) */}
        <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-lg flex flex-col justify-between space-y-2">
          <span className="font-heading font-black text-xs text-amber-300 uppercase block border-b border-[#3b2b1d] pb-1">
            Kuşanılan Donanım Koruması
          </span>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-[#150f0b] border border-[#3f2f1f]">
              <span className="text-[10px] text-[#a49582] block">Zırh</span>
              <span className="font-mono font-black text-amber-300 text-sm">+{toplamZirh}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#150f0b] border border-[#3f2f1f]">
              <span className="text-[10px] text-[#a49582] block">Kalkan</span>
              <span className="font-mono font-black text-amber-300 text-sm">+{toplamKalkan}</span>
            </div>
            <div className="p-2 rounded-lg bg-[#150f0b] border border-[#3f2f1f]">
              <span className="text-[10px] text-[#a49582] block">Vuruş</span>
              <span className="font-mono font-black text-amber-300 text-sm">+{toplamHasarBonus}</span>
            </div>
          </div>

          <div className="text-[10px] text-[#a99c8b] italic">
            Kuşanılan eşyaların pasif durumları savaş arenasına otomatik yansır.
          </div>
        </div>
      </div>

      {/* FATE STUNT AKTİF BİLDİRİM BANNERI */}
      {stuntToast && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-2 border-amber-400 shadow-2xl flex items-center justify-between text-xs animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <Zap className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="font-heading font-black text-amber-300 text-sm block">
                {stuntToast.title}
              </span>
              <p className="text-amber-100 font-serif italic text-xs">
                &quot;{stuntToast.desc}&quot;
              </p>
            </div>
          </div>
          <button
            onClick={() => setStuntToast(null)}
            className="text-stone-400 hover:text-white px-2 py-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* GOTİK KUŞANMA YUVALARI (PAPER DOLL) & SÜRÜKLE-BIRAK (DRAG & DROP) HUB */}
      <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-[#3e2e20] pb-2">
          <span className="font-heading font-black text-xs text-amber-300 uppercase flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Gotik Donanım Yuvaları (Sürükle &amp; Bırak ile Kuşan)</span>
          </span>
          <span className="text-[10px] text-[#baa794] font-mono">
            Eşyaları sürükleyip yuvalara bırakın veya tıklayın
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              tur: 'Silah' as const,
              label: '🗡️ Ana El (Silah)',
              item: kusanilanEsyalar.find((e) => e.tur === 'Silah'),
            },
            {
              tur: 'Kalkan' as const,
              label: '🛡️ Yan El (Kalkan / İkincil)',
              item: kusanilanEsyalar.find((e) => e.tur === 'Kalkan' || e.tur === 'Teçhizat'),
            },
            {
              tur: 'Zırh' as const,
              label: '🥋 Gövde (Zırh)',
              item: kusanilanEsyalar.find((e) => e.tur === 'Zırh'),
            },
            {
              tur: 'Büyülü Yadigar' as const,
              label: '💍 Kadim Yadigar (Tılsım)',
              item: kusanilanEsyalar.find((e) => e.tur === 'Büyülü Yadigar'),
            },
          ].map((slot) => (
            <div
              key={slot.tur}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropToSlot(slot.tur)}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between min-h-[105px] ${
                slot.item
                  ? 'bg-[#24170d] border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-[#140e0a] border-dashed border-[#443020] hover:border-amber-600/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400 font-heading">
                  {slot.label}
                </span>
                {slot.item && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500 text-stone-950 font-black">
                    AKTİF
                  </span>
                )}
              </div>

              {slot.item ? (
                <div className="my-1.5">
                  <span className="font-heading font-black text-xs text-[#f5ebd7] block truncate">
                    {slot.item.ad}
                  </span>
                  <span className="text-[10px] text-[#a99c8b] block italic truncate">
                    {slot.item.aspectEtkisi || slot.item.aciklama || 'Kuşanıldı'}
                  </span>
                </div>
              ) : (
                <div className="my-auto text-center py-2 text-stone-500 text-[10px] font-mono">
                  [Buraya Eşya Sürükleyin]
                </div>
              )}

              {slot.item && (
                <div className="flex items-center justify-between pt-1 border-t border-[#3b2b1d]">
                  <button
                    onClick={() => handleTriggerStunt(slot.item!)}
                    className="text-[9px] text-amber-300 hover:text-white font-bold flex items-center gap-0.5"
                    title="Bu eşyanın Fate Stunt etkisini tetikle"
                  >
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    <span>Stunt Uygula</span>
                  </button>
                  <button
                    onClick={() => handleKusanToggle(slot.item!.id)}
                    className="text-[9px] text-stone-400 hover:text-red-400"
                  >
                    Çıkar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FİLTRE & ARAMA ÇUBUĞU */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#17110c] p-3 rounded-xl border border-[#443322]">
        {/* Kategori Filtre Butonları */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['Tümü', 'Silah', 'Zırh', 'Kalkan', 'Büyülü Yadigar', 'Tıbbi', 'Teçhizat'] as KategoriFiltresi[]).map((kat) => (
            <button
              key={kat}
              onClick={() => {
                sound.playSealStamp();
                setSeciliKategori(kat);
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                seciliKategori === kat
                  ? 'bg-amber-600 border-amber-400 text-stone-950 shadow-md'
                  : 'bg-[#221811] border-[#443322] text-[#d6c8b6] hover:bg-[#342417]'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        {/* Arama Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7f6f5e]" />
          <input
            type="text"
            placeholder="Eşya veya sinerji ara..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            className="w-full bg-[#120e0b] border border-[#443322] rounded pl-8 pr-3 py-1.5 text-xs text-[#f1e6d4] focus:outline-none"
          />
        </div>
      </div>

      {/* ENVANTER LİSTESİ / IZGARASI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtrelenmisEnvanter.length === 0 ? (
          <div className="col-span-full parchment-sheet p-8 rounded-xl border border-[#443322] text-center space-y-2">
            <Package className="w-8 h-8 text-amber-500/50 mx-auto" />
            <p className="text-sm font-heading text-amber-200">Bu kategoride eşya bulunamadı.</p>
            <p className="text-xs text-[#a99c8b]">
              Kanonik Pazar&apos;dan teçhizat satın alabilir veya özel silah dövebilirsiniz.
            </p>
          </div>
        ) : (
          filtrelenmisEnvanter.map((item) => {
            const isEquipped = item.kusandiMi;
            const synergy = item.durumSinerjisi;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDraggedItemId(item.id)}
                className={`p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between space-y-2.5 relative cursor-grab active:cursor-grabbing ${
                  isEquipped
                    ? 'bg-[#24180f] border-amber-500/80 shadow-lg ring-1 ring-amber-500/40'
                    : 'bg-[#18120d] border-[#3e2c1e] hover:border-[#5a412b]'
                }`}
              >
                {/* Rozetler */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-black text-sm text-[#f5ebd8]">{item.ad}</span>
                      {isEquipped && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-black text-[9px] uppercase shadow">
                          KUŞANILDI
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#baa896] block mt-0.5">
                      {item.tur} • {item.nadir || 'Sıradan'}
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="font-mono font-bold text-xs text-amber-300">
                      {item.fiyat} Aron
                    </span>
                    <span className="text-[10px] font-mono text-[#9e8c79]">
                      Yük: {item.yuk ?? 1}
                    </span>
                  </div>
                </div>

                {/* Aspect Etkisi veya Açıklama */}
                <div
                  onClick={() => handleTriggerStunt(item)}
                  className="text-xs font-serif text-[#ded0be] leading-relaxed cursor-pointer hover:text-amber-200 transition-colors"
                  title="Stunt etkisini tetiklemek için tıklayın"
                >
                  {item.aspectEtkisi || item.aciklama || 'Standart macera eşyası.'}
                </div>

                {/* Savaş Puanları */}
                {(item.hasarBonus || item.zirhPuani || item.kalkanSavunma) && (
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-400">
                    {item.hasarBonus ? <span>+{item.hasarBonus} Hasar</span> : null}
                    {item.zirhPuani ? <span>+{item.zirhPuani} Zırh</span> : null}
                    {item.kalkanSavunma ? <span>+{item.kalkanSavunma} Savunma</span> : null}
                  </div>
                )}

                {/* DURUM SİNERJİSİ ROZETİ */}
                {synergy && (
                  <div className="p-2 rounded-lg bg-[#140e0a] border border-amber-900/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-heading font-bold text-amber-300 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span>Durum Sinerjisi ({synergy.tetiklenme})</span>
                      </span>
                      {synergy.hedefDurum && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                          {synergy.hedefDurum}
                        </span>
                      )}
                      {synergy.kullaniciDurum && (
                        <span className="px-1.5 py-0.2 rounded bg-yellow-950 text-yellow-300 border border-yellow-700 font-bold">
                          {synergy.kullaniciDurum}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#b3a18e] font-serif leading-tight">
                      {synergy.aciklama}
                    </p>
                  </div>
                )}

                {/* EYLEM BUTONLARI */}
                <div className="flex items-center justify-between pt-2 border-t border-[#312316] gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.tur !== 'Tıbbi' && (
                      <button
                        onClick={() => handleKusanToggle(item.id)}
                        className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1 ${
                          isEquipped
                            ? 'bg-amber-600 text-stone-950 border-amber-400 hover:bg-amber-500'
                            : 'bg-[#291b12] text-amber-200 border-[#4a3421] hover:bg-[#382518]'
                        }`}
                      >
                        {isEquipped ? <Check className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        <span>{isEquipped ? 'Çıkar' : 'Kuşan'}</span>
                      </button>
                    )}

                    {item.tur === 'Tıbbi' && (
                      <button
                        onClick={() => handleEsyaKullan(item)}
                        className="px-2.5 py-1 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-bold border border-emerald-600 flex items-center gap-1"
                      >
                        <Heart className="w-3 h-3 text-emerald-400" />
                        <span>Kullan &amp; İyileş</span>
                      </button>
                    )}

                    {/* Fate Stunt Tetikle */}
                    <button
                      onClick={() => handleTriggerStunt(item)}
                      className="px-2 py-1 rounded bg-[#20150d] hover:bg-amber-900/60 text-amber-300 border border-amber-800 text-xs font-bold flex items-center gap-1"
                      title="Bu eşyanın Fate Stunt etkisini (örn: +1 Leke, Siper) otomatik uygula"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Stunt</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleEsyaSil(item.id)}
                    className="p-1 rounded text-stone-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Envanterden Bırak / Çıkar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* KANONİK PAZAR / YAĞMA MODALI */}
      {pazarModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-amber-600/80 max-w-3xl w-full shadow-2xl text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#443322] pb-2">
              <div>
                <h3 className="font-heading font-black text-base text-amber-200 flex items-center gap-2">
                  <Store className="w-5 h-5 text-amber-400" />
                  <span>Kanonik Pazar &amp; Efsunlu Zanaatkâr Kataloğu</span>
                </h3>
                <p className="text-[10px] text-[#a99c8b]">
                  Durum efektleri ile sinerji oluşturan kanonik teçhizatları satın alın veya yağmalayın.
                </p>
              </div>
              <button
                onClick={() => setPazarModalAcik(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            {/* Pazar Öğeleri Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {CANON_SHOP_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#16100c] border border-[#3f2e1e] flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-heading font-black text-xs text-[#f5ecd8] block">{item.ad}</span>
                      <span className="text-[9px] text-[#baa896] block">{item.tur} • {item.nadir}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-300 text-xs">{item.fiyat} Aron</span>
                      <span className="text-[9px] font-mono text-[#8a7b6a] block">Yük: {item.yuk}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#ded0be] font-serif leading-tight">
                    {item.aciklama}
                  </p>

                  {item.durumSinerjisi && (
                    <div className="p-1.5 rounded bg-[#100b08] border border-[#312316] text-[9px] text-amber-400 font-mono">
                      ⚡ Sinerji: {item.durumSinerjisi.aciklama}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handlePazardanAl(item)}
                      className="px-3 py-1 rounded bg-[#3b2a1a] hover:bg-[#523b24] text-amber-200 text-[10px] font-bold border border-[#785734] flex items-center gap-1 shadow"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Satın Al / Yağmala</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#443322]">
              <button
                onClick={() => setPazarModalAcik(false)}
                className="px-4 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs"
              >
                Pazarı Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÖZEL EŞYA DÖVME MODALI */}
      {ozelEsyaModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-[#68523b] max-w-lg w-full shadow-2xl text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#443322] pb-2">
              <h3 className="font-heading font-black text-sm text-amber-200 flex items-center gap-2">
                <Hammer className="w-4 h-4 text-amber-400" />
                <span>Özel Teçhizat &amp; Büyülü Eşya Döv</span>
              </h3>
              <button
                onClick={() => setOzelEsyaModalAcik(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-[#baa896] block mb-1">
                  Eşya Adı:
                </label>
                <input
                  type="text"
                  value={yeniAd}
                  onChange={(e) => setYeniAd(e.target.value)}
                  placeholder="Örn: Ruh Kesen Kama"
                  className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#baa896] block mb-1">
                    Tür:
                  </label>
                  <select
                    value={yeniTur}
                    onChange={(e) => setYeniTur(e.target.value as any)}
                    className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-xs text-[#eedec8]"
                  >
                    <option value="Silah">Silah</option>
                    <option value="Zırh">Zırh</option>
                    <option value="Kalkan">Kalkan</option>
                    <option value="Büyülü Yadigar">Büyülü Yadigar</option>
                    <option value="Tıbbi">Tıbbi / İksir</option>
                    <option value="Teçhizat">Teçhizat</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#baa896] block mb-1">
                    Nadirlik:
                  </label>
                  <select
                    value={yeniNadir}
                    onChange={(e) => setYeniNadir(e.target.value as any)}
                    className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-xs text-[#eedec8]"
                  >
                    <option value="Sıradan">Sıradan</option>
                    <option value="Usta İşi">Usta İşi</option>
                    <option value="Efsanevi">Efsanevi</option>
                    <option value="Yasak Büyülü">Yasak Büyülü</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#baa896] block mb-1">
                    Yük Puanı (0 - 3):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={yeniYuk}
                    onChange={(e) => setYeniYuk(Number(e.target.value))}
                    className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-xs text-[#f5ecd8]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-[#baa896] block mb-1">
                    Değer (Aron):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={yeniFiyat}
                    onChange={(e) => setYeniFiyat(Number(e.target.value))}
                    className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-xs text-[#f5ecd8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-[#baa896] block mb-1">
                  Aspect Etkisi &amp; Özellik:
                </label>
                <input
                  type="text"
                  value={yeniAspect}
                  onChange={(e) => setYeniAspect(e.target.value)}
                  placeholder="Örn: Ghardello ile yapılan vuruşta +2..."
                  className="w-full bg-[#140f0c] border border-[#443322] rounded p-2 text-xs text-[#f5ecd8] focus:outline-none"
                />
              </div>

              {/* Durum Sinerjisi Seçicileri */}
              <div className="p-3 rounded-xl bg-[#120d09] border border-[#3b2a1a] space-y-2">
                <span className="text-[10px] font-heading font-bold text-amber-400 uppercase block">
                  ⚡ Durum Efekti Sinerjisi (Opsiyonel)
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-[#baa896] block mb-0.5">
                      Hedefe Uygulanan Durum:
                    </label>
                    <select
                      value={yeniHedefDurum}
                      onChange={(e) => setYeniHedefDurum(e.target.value)}
                      className="w-full bg-[#17110c] border border-[#443322] rounded p-1.5 text-xs text-[#eedec8]"
                    >
                      <option value="Yok">Yok</option>
                      <option value="Kanamalı">🩸 Kanamalı</option>
                      <option value="Zehirlenmiş">🧪 Zehirlenmiş</option>
                      <option value="Alevler İçinde">🔥 Alevler İçinde</option>
                      <option value="Sersemlemiş">💫 Sersemlemiş</option>
                      <option value="Körleşmiş">👁️‍🗨️ Körleşmiş</option>
                      <option value="Dehşet İçinde">💀 Dehşet İçinde</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-[#baa896] block mb-0.5">
                      Kullanıcıya Verilen Durum:
                    </label>
                    <select
                      value={yeniKullaniciDurum}
                      onChange={(e) => setYeniKullaniciDurum(e.target.value)}
                      className="w-full bg-[#17110c] border border-[#443322] rounded p-1.5 text-xs text-[#eedec8]"
                    >
                      <option value="Yok">Yok</option>
                      <option value="Kutsanmış">✨ Kutsanmış</option>
                      <option value="Odaklanmış">🎯 Odaklanmış</option>
                      <option value="Çelik Siper">🛡️ Çelik Siper</option>
                      <option value="Hiddetli">⚡ Hiddetli</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#443322]">
              <button
                onClick={() => setOzelEsyaModalAcik(false)}
                className="px-3 py-1.5 rounded text-stone-400 hover:text-white"
              >
                İptal
              </button>
              <button
                onClick={handleOzelEsyaEkle}
                className="px-4 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs"
              >
                Eşyayı Döv ve Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
