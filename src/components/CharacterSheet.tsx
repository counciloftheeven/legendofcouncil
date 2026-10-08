import React, { useState } from 'react';
import {
  Karakter,
  YaklasimAdi,
  YAKLASIMLAR,
  SIFATLAR_MERDIVENI,
  OLCEK_MERDIVENI,
  merdivenDerecesiBul,
  zarAt4dF,
  fateAtisiHesapla,
  HANELER,
  MESLEKLER,
  EkipmanAspect,
  HAZIR_EKIPMANLAR,
  hesaplaKarakterYuk,
  hesaplaMaksimumYuk,
} from '../rules';
import { sound } from '../utils/audio';
import { MarkdownNotes } from './MarkdownNotes';
import { ContextTooltip } from './ContextTooltip';
import {
  Shield,
  Heart,
  AlertTriangle,
  Award,
  Coins,
  Package,
  Backpack,
  Sparkles,
  Flame,
  Eye,
  Plus,
  Minus,
  Download,
  Scroll,
  Printer,
  Skull,
  UserPlus,
  CheckCircle2,
  Circle,
  HelpCircle,
  Feather,
  Crown,
  BookOpen,
  RefreshCw,
  X,
  Zap,
  Swords
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CharacterSheetProps {
  karakter: Karakter;
  onKarakterGuncelle: (yeniKarakter: Karakter) => void;
  onZarAtHizli: (yaklasim?: YaklasimAdi) => void;
  onQuickRoll3D?: (beceri: string, nitelik?: string) => void;
  rol: 'Anlatıcı' | 'Oyuncu';
  onYeniKarakterTikla?: () => void;
  onEnvanterTikla?: () => void;
  onYetenekAgaciTikla?: () => void;
}

interface InlineZarDurumu {
  yaklasim: YaklasimAdi;
  zarlar: number[];
  zarToplami: number;
  yaklasimDegeri: number;
  bonus: number;
  toplam: number;
  derece: string;
  zorluk: number;
  sift: number;
  sonucTuru: 'Görkemli Başarı' | 'Başarı' | 'Denk' | 'Başarısız';
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({
  karakter,
  onKarakterGuncelle,
  onZarAtHizli,
  onQuickRoll3D,
  rol,
  onYeniKarakterTikla,
  onEnvanterTikla,
  onYetenekAgaciTikla,
}) => {
  const [yeniEkipmanAd, setYeniEkipmanAd] = useState('');
  const [yeniEkipmanAspect, setYeniEkipmanAspect] = useState('');
  const [yeniUzmanlik, setYeniUzmanlik] = useState('');
  const [yeniSonucText, setYeniSonucText] = useState('');
  const [seciliSonucSeviye, setSeciliSonucSeviye] = useState<'hafif' | 'orta' | 'agir'>('hafif');

  // Inline Hızlı Zar Paneli
  const [inlineZar, setInlineZar] = useState<InlineZarDurumu | null>(null);

  // Yara tampon kutuları
  const toggleTamponKutu = (hat: 'fiziksel' | 'zihinsel' | 'itibar', index: number) => {
    sound.playSealStamp();
    const yeniHatlar = { ...karakter.yaraHatlari };
    if (hat === 'fiziksel') {
      const arr = [...yeniHatlar.fiziksel] as [boolean, boolean, boolean];
      arr[index] = !arr[index];
      yeniHatlar.fiziksel = arr;
    } else if (hat === 'zihinsel') {
      const arr = [...yeniHatlar.zihinsel] as [boolean, boolean, boolean];
      arr[index] = !arr[index];
      yeniHatlar.zihinsel = arr;
    } else {
      const arr = [...yeniHatlar.itibar] as [boolean];
      arr[index] = !arr[index];
      yeniHatlar.itibar = arr;
    }

    onKarakterGuncelle({
      ...karakter,
      yaraHatlari: yeniHatlar,
    });
  };

  // Kader Puanı (Fate Points) Harca / Ekle
  const updateKaderPuani = (delta: number) => {
    sound.playSealStamp();
    const yeniDeger = Math.max(0, (karakter.kaderPuani || 0) + delta);
    onKarakterGuncelle({
      ...karakter,
      kaderPuani: yeniDeger,
      sayaclar: { ...karakter.sayaclar, muhur: yeniDeger }
    });
  };

  // Aspect Çağırma (+2 / Zar Yenileme)
  const handleAspectCagir = (aspectAdi: string) => {
    if ((karakter.kaderPuani || 0) <= 0) {
      sound.playBladeClash();
      return;
    }
    sound.playSealStamp();
    confetti({ particleCount: 25, spread: 50 });
    updateKaderPuani(-1);

    // Eğer o an açık bir zar varsa +2 ekle
    if (inlineZar) {
      const yeniBonus = inlineZar.bonus + 2;
      const yeniToplam = inlineZar.zarToplami + inlineZar.yaklasimDegeri + yeniBonus;
      const yeniSift = yeniToplam - inlineZar.zorluk;
      setInlineZar({
        ...inlineZar,
        bonus: yeniBonus,
        toplam: yeniToplam,
        sift: yeniSift,
        derece: merdivenDerecesiBul(yeniToplam),
        sonucTuru: yeniSift >= 3 ? 'Görkemli Başarı' : yeniSift >= 1 ? 'Başarı' : yeniSift === 0 ? 'Denk' : 'Başarısız'
      });
    }
  };

  // Dert / Yük Zorlaması (Compel - +1 Kader Puanı Kazanma)
  const handleDertZorla = () => {
    sound.playSealStamp();
    confetti({ particleCount: 35, spread: 60 });
    updateKaderPuani(1);
  };

  // Sonuç (Consequence) Ekleme & Silme
  const handleSonucEkle = () => {
    if (!yeniSonucText.trim()) return;
    sound.playBladeClash();
    const yeniSonuclar = {
      ...karakter.sonuclar,
      [seciliSonucSeviye]: yeniSonucText.trim(),
    };
    onKarakterGuncelle({
      ...karakter,
      sonuclar: yeniSonuclar,
    });
    setYeniSonucText('');
  };

  const handleSonucSil = (seviye: 'hafif' | 'orta' | 'agir') => {
    sound.playSealStamp();
    const yeniSonuclar = { ...karakter.sonuclar };
    delete yeniSonuclar[seviye];
    onKarakterGuncelle({
      ...karakter,
      sonuclar: yeniSonuclar,
    });
  };

  // Ekipman Aspect Ekle
  const handleEkipmanEkle = () => {
    if (!yeniEkipmanAd.trim()) return;
    sound.playSealStamp();
    const yeniItem: EkipmanAspect = {
      id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      ad: yeniEkipmanAd.trim(),
      tur: 'Teçhizat',
      aspectEtkisi: yeniEkipmanAspect.trim() || 'Sahne başına 1 kez bedelsiz çağrılabilir (+2).',
      fiyat: 10,
      yuk: 1
    };
    onKarakterGuncelle({
      ...karakter,
      envanter: [...karakter.envanter, yeniItem],
      ekipmanAspectleri: [...(karakter.ekipmanAspectleri || []), `${yeniItem.ad}: ${yeniItem.aspectEtkisi}`]
    });
    setYeniEkipmanAd('');
    setYeniEkipmanAspect('');
  };

  // Uzmanlık Ekle
  const handleUzmanlikEkle = () => {
    if (!yeniUzmanlik.trim()) return;
    sound.playSealStamp();
    onKarakterGuncelle({
      ...karakter,
      uzmanliklar: [...karakter.uzmanliklar, yeniUzmanlik.trim()]
    });
    setYeniUzmanlik('');
  };

  // Inline Doğrudan 4dF Zarı At
  const handleInlineZarAt = (yaklasim: YaklasimAdi) => {
    sound.playDiceRoll();
    const zarlar = zarAt4dF();
    const zarToplami = zarlar.reduce((a, b) => a + b, 0);
    const yaklasimDegeri = karakter.yaklasimlar?.[yaklasim] ?? 0;
    const zorluk = 2; // Standart Makul Eşik (+2)
    const toplam = zarToplami + yaklasimDegeri;
    const sift = toplam - zorluk;

    let sonucTuru: 'Görkemli Başarı' | 'Başarı' | 'Denk' | 'Başarısız' = 'Başarı';
    if (sift >= 3) sonucTuru = 'Görkemli Başarı';
    else if (sift >= 1) sonucTuru = 'Başarı';
    else if (sift === 0) sonucTuru = 'Denk';
    else sonucTuru = 'Başarısız';

    if (sonucTuru === 'Görkemli Başarı' || sonucTuru === 'Başarı') {
      confetti({ particleCount: 30, spread: 55, origin: { y: 0.6 } });
    }

    setInlineZar({
      yaklasim,
      zarlar,
      zarToplami,
      yaklasimDegeri,
      bonus: 0,
      toplam,
      derece: merdivenDerecesiBul(toplam),
      zorluk,
      sift,
      sonucTuru
    });
  };

  // 14 Yaklaşım Kategorileri
  const yaklasimKategorileri: { baslik: string; renk: string; liste: YaklasimAdi[] }[] = [
    {
      baslik: 'Beden (Yakın & Fiziksel)',
      renk: 'border-red-900/60 bg-red-950/20 text-red-300',
      liste: ['Ghardello', 'Rax-ed', 'Lithron', 'Zel-vash']
    },
    {
      baslik: 'Söz ve Gölge (Sosyal & Entrika)',
      renk: 'border-purple-900/60 bg-purple-950/20 text-purple-300',
      liste: ['Lodvez', 'Ver-ed', 'Xes-hart']
    },
    {
      baslik: 'Ağ ve Kaynak (İstihbarat & Varlık)',
      renk: 'border-amber-900/60 bg-amber-950/20 text-amber-300',
      liste: ['Vize-rion', 'Aronlid']
    },
    {
      baslik: 'İlim ve Sezgi (Mistik & Zeka)',
      renk: 'border-teal-900/60 bg-teal-950/20 text-teal-300',
      liste: ['Erau', 'Aldris', 'Loth', 'Vizer']
    },
    {
      baslik: 'İrade (Dirayet & Direnç)',
      renk: 'border-indigo-900/60 bg-indigo-950/20 text-indigo-300',
      liste: ['Edor / Edros']
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-5 space-y-4 font-sans text-[#f2ebd9]">
      {/* ÜST BİLGİ & YÖNETİM BAR */}
      <div className="parchment-sheet p-4 sm:p-6 rounded-2xl border-2 border-[#54412e] shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-[#493726] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-16 rounded-xl overflow-hidden border-2 border-amber-600 bg-black shadow-xl flex-shrink-0 relative group">
              <img
                src={karakter.fotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'}
                alt={karakter.ad}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-amber-400/30 rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl sm:text-2xl text-[#f5ecd8] tracking-wide">
                  {karakter.ad}
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#2b1f15] text-amber-300 border border-[#523d2b]">
                  {karakter.koken === 'Soylu' ? '👑 Soylu (Ölçek 5)' : '🌾 Halktan (Ölçek 2)'}
                </span>
              </div>
              <p className="text-xs text-[#a99c8b] font-serif italic">
                {karakter.tur} • {karakter.irk} ({karakter.hane}) • {karakter.meslek}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded bg-[#261d15] hover:bg-[#382a1e] text-stone-300 hover:text-white text-xs font-heading font-bold border border-[#443322] flex items-center gap-1.5 shadow"
              title="Karakter Kâğıdını Yazdır / PDF İndir"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Yazdır / PDF</span>
            </button>

            {onYeniKarakterTikla && (
              <button
                onClick={onYeniKarakterTikla}
                className="px-3 py-1.5 rounded wax-seal text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow"
              >
                <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                <span>Yeni Karakter Yarat</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. KİMLİK KÜNYESİ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
          <div className="bg-[#17120e] p-2 rounded-lg border border-[#3b2b1d]">
            <span className="text-[9px] uppercase font-bold text-[#8d7c6b] block">Tür</span>
            <span className="font-heading font-bold text-amber-200">{karakter.tur}</span>
          </div>

          <div className="bg-[#17120e] p-2 rounded-lg border border-[#3b2b1d]">
            <span className="text-[9px] uppercase font-bold text-[#8d7c6b] block">Irk (Eğilim)</span>
            <span className="font-heading font-bold text-[#ded2be]">{karakter.irk}</span>
          </div>

          <div className="bg-[#17120e] p-2 rounded-lg border border-[#3b2b1d]">
            <span className="text-[9px] uppercase font-bold text-[#8d7c6b] block">Köken</span>
            <span className="font-heading font-bold text-[#ded2be]">{karakter.koken}</span>
          </div>

          <div className="bg-[#17120e] p-2 rounded-lg border border-[#3b2b1d]">
            <span className="text-[9px] uppercase font-bold text-[#8d7c6b] block">Hane / Eyalet</span>
            <span className="font-heading font-bold text-amber-300 truncate block">{karakter.hane} ({karakter.eyalet})</span>
          </div>

          <div className="bg-[#17120e] p-2 rounded-lg border border-[#3b2b1d]">
            <span className="text-[9px] uppercase font-bold text-[#8d7c6b] block">Meslek</span>
            <span className="font-heading font-bold text-[#ded2be] truncate block">{karakter.meslek}</span>
          </div>

          <div className="bg-[#17120e] p-2 rounded-lg border border-[#3b2b1d]">
            <span className="text-[9px] uppercase font-bold text-[#8d7c6b] block">
              <ContextTooltip term="Aron">Aron Altını</ContextTooltip>
            </span>
            <span className="font-mono font-bold text-amber-300">{karakter.ekonomi?.aron || 0} Aron</span>
          </div>

          {/* Leke Sayacı (Ruhani Yozlaşma 0-9) */}
          <div className="bg-[#17120e] p-2 rounded-lg border border-purple-900/60 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-purple-400 block">
                <ContextTooltip term="Leke">Leke Sayacı</ContextTooltip>
              </span>
              <span className={`text-[9px] font-mono font-bold ${
                (karakter.sayaclar?.leke || 0) >= 6 ? 'text-red-400 animate-pulse' : 'text-purple-300'
              }`}>
                {karakter.sayaclar?.leke || 0}/9
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <button
                onClick={() => {
                  sound.playSealStamp();
                  const yeniLeke = Math.max(0, (karakter.sayaclar?.leke || 0) - 1);
                  onKarakterGuncelle({
                    ...karakter,
                    sayaclar: { ...karakter.sayaclar, leke: yeniLeke },
                  });
                }}
                className="w-4 h-4 rounded bg-[#2b182b] text-purple-300 text-[10px] flex items-center justify-center font-bold hover:bg-purple-900"
                title="Leke Azalt (-1)"
              >
                -
              </button>
              <div className="flex-1 flex gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 flex-1 rounded-xs ${
                      i < (karakter.sayaclar?.leke || 0)
                        ? i >= 6 ? 'bg-red-500 shadow-sm shadow-red-500' : 'bg-purple-500 shadow-sm shadow-purple-500'
                        : 'bg-[#291e2b]'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  sound.playBladeClash();
                  const yeniLeke = Math.min(9, (karakter.sayaclar?.leke || 0) + 1);
                  onKarakterGuncelle({
                    ...karakter,
                    sayaclar: { ...karakter.sayaclar, leke: yeniLeke },
                  });
                }}
                className="w-4 h-4 rounded bg-[#2b182b] text-purple-300 text-[10px] flex items-center justify-center font-bold hover:bg-red-950"
                title="Leke Artır (+1 Ruhani Yozlaşma)"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* TEK TIKLA DOĞRUDAN 3D ZAR (CLICK-TO-ROLL) BECERİ ÇUBUĞU */}
        <div className="bg-[#120e0a] p-3 rounded-xl border border-amber-600/60 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-black text-amber-300 flex items-center gap-1.5 uppercase">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Tek Tıkla Doğrudan Zar (Click-to-Roll Beceriler):</span>
            </span>
            <span className="text-[10px] text-[#baa794] font-mono">
              ★ Tıklandığı an 3D zar otomatik yuvarlanır
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { key: 'Fight', label: '🗡️ Kılıç (Fight)', val: karakter.beceriler.Fight },
              { key: 'Shoot', label: '🏹 Yay (Shoot)', val: karakter.beceriler.Shoot },
              { key: 'Stealth', label: '👤 Gizlilik (Stealth)', val: karakter.beceriler.Stealth },
              { key: 'Investigate', label: '🔍 Dikkat (Investigate)', val: karakter.beceriler.Investigate },
              { key: 'Lore', label: '📜 Bilgi (Lore)', val: karakter.beceriler.Lore },
              { key: 'ProvokeManipulate', label: '🗣️ Baskı (Provoke)', val: karakter.beceriler.ProvokeManipulate ?? 0 },
            ].map((b) => (
              <button
                key={b.key}
                onClick={() => {
                  sound.playDiceRoll();
                  if (onQuickRoll3D) {
                    onQuickRoll3D(b.key);
                  } else {
                    onZarAtHizli(b.key as any);
                  }
                }}
                className="p-2 rounded-lg bg-[#22160d] hover:bg-amber-800/80 border border-amber-700/60 hover:border-amber-400 text-[#f5ebd7] flex items-center justify-between transition-all active:scale-95 shadow group"
                title={`${b.label} (+${b.val}) ile doğrudan 3D zar at!`}
              >
                <span className="text-xs font-heading font-bold truncate group-hover:text-amber-200">{b.label.split('(')[0]}</span>
                <span className="font-mono font-black text-amber-400 text-sm">+{b.val}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. TOPLUMUN MERDİVENİ (ÖLÇEK) & SABİT EŞİK TOOLTIP */}
        <div className="bg-[#130f0c] p-3 rounded-xl border border-[#443322] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-amber-300 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Toplumun Merdiveni (Ölçek: {karakter.olcek}. Basamak)</span>
            </span>
            <ContextTooltip term="Sabit Eşik" className="text-[10px] text-[#93826e] font-mono">
              Sabit Eşik Kuralı (Ölçek Farkı 3+ Gedik Açmalıdır)
            </ContextTooltip>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center">
            {OLCEK_MERDIVENI.map((o) => {
              const isActive = o.basamak === karakter.olcek;
              return (
                <div
                  key={o.basamak}
                  className={`p-1 rounded border text-[10px] transition-all ${
                    isActive
                      ? 'bg-amber-900/90 border-amber-400 text-white font-black shadow-lg ring-1 ring-amber-300 scale-105'
                      : 'bg-[#18130f] border-[#312317] text-[#7d6d5c]'
                  }`}
                  title={`${o.unvan}: ${o.kimler} (${o.aciklama})`}
                >
                  <span className="block font-mono font-bold text-xs">{o.basamak}</span>
                  <span className="block truncate text-[9px]">{o.unvan}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. YENİLEME VE KADER PUANI (FATE POINTS) */}
        <div className="bg-[#17120e] p-3 rounded-xl border border-[#443322] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xs text-amber-300 uppercase">
                Yenileme: {karakter.yenileme}
              </span>
              <span className="text-[11px] text-[#9a8976]">
                ({karakter.koken === 'Soylu' ? 'Soylu: 3' : 'Halktan: 4'})
              </span>
            </div>
            <ContextTooltip term="Kader Puanı" className="text-[10px] text-[#857564] font-serif">
              Oturum başına başlangıç ve taban Kader Puanı kotası.
            </ContextTooltip>
          </div>

          {/* 8 Jetonluk Dokunsal Metal Para Yuvaları */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-heading font-bold text-[#ded2be]">
              <ContextTooltip term="Kader Puanı">Kader Puanı:</ContextTooltip>
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-[#100d0a] rounded-full border border-[#3b2b1d]">
              {Array.from({ length: 8 }).map((_, i) => {
                const isFilled = i < (karakter.kaderPuani || 0);
                return (
                  <button
                    key={i}
                    onClick={() => updateKaderPuani(isFilled ? -1 : 1)}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] transition-all shadow ${
                      isFilled
                        ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-amber-200 text-stone-950 font-black shadow-md scale-105 ring-1 ring-amber-300/50'
                        : 'bg-[#18130f] border-[#382a1d] text-stone-600 hover:border-amber-600/70'
                    }`}
                    title={isFilled ? 'Kader Puanı Harca (-1)' : 'Kader Puanı Ekle (+1)'}
                  >
                    {isFilled ? '★' : '○'}
                  </button>
                );
              })}
            </div>
            <span className="font-mono font-bold text-xs text-amber-300 ml-1">
              ({karakter.kaderPuani || 0})
            </span>
          </div>
        </div>
      </div>

      {/* INLINE HIZLI ZAR SONUÇ BİLDİRİM KARTI */}
      {inlineZar && (
        <div className="parchment-sheet p-4 rounded-xl border-2 border-amber-500/90 shadow-2xl bg-gradient-to-r from-[#21150b] via-[#311f10] to-[#21150b] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-amber-700/60 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <strong className="font-heading font-bold text-sm text-amber-200">
                {inlineZar.yaklasim} ile 4dF Atışı
              </strong>
              <span className="text-[10px] text-[#b3a391] font-mono">
                (Eşik: +{inlineZar.zorluk} Makul)
              </span>
            </div>
            <button
              onClick={() => setInlineZar(null)}
              className="text-stone-400 hover:text-white p-1 rounded hover:bg-[#3d2716]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 font-mono text-sm bg-black/40 p-2 rounded-lg border border-[#4d3725]">
                {inlineZar.zarlar.map((z, idx) => (
                  <span
                    key={idx}
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      z > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : z < 0 ? 'bg-red-950 text-red-300 border border-red-600' : 'bg-stone-900 text-stone-500 border border-stone-700'
                    }`}
                  >
                    {z > 0 ? '+' : z < 0 ? '−' : '0'}
                  </span>
                ))}
              </div>

              <div>
                <span className="text-xs text-[#a99c8b] block font-mono">
                  Zar ({inlineZar.zarToplami >= 0 ? `+${inlineZar.zarToplami}` : inlineZar.zarToplami}) + Yaklaşım (+{inlineZar.yaklasimDegeri}) {inlineZar.bonus > 0 ? `+ Bonus (+${inlineZar.bonus})` : ''} =
                </span>
                <span className="font-heading font-black text-xl text-amber-300">
                  {inlineZar.derece} ({inlineZar.toplam >= 0 ? `+${inlineZar.toplam}` : inlineZar.toplam})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-black ${
                inlineZar.sonucTuru === 'Görkemli Başarı'
                  ? 'bg-amber-400 text-stone-950 shadow ring-2 ring-amber-300'
                  : inlineZar.sonucTuru === 'Başarı'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                  : inlineZar.sonucTuru === 'Denk'
                  ? 'bg-yellow-950 text-yellow-300 border border-yellow-600'
                  : 'bg-red-950 text-red-300 border border-red-600'
              }`}>
                {inlineZar.sonucTuru} ({inlineZar.sift >= 0 ? `+${inlineZar.sift}` : inlineZar.sift} Şift)
              </span>

              <button
                onClick={() => handleAspectCagir('Aspect Güçlendirmesi')}
                className="px-2.5 py-1 rounded bg-[#2e1d11] hover:bg-[#442b1a] text-amber-300 text-xs font-heading font-bold border border-amber-700 shadow"
                title="1 Kader Puanı harcayarak +2 ekle"
              >
                +2 Aspect Çağır (-1 KP)
              </button>

              <button
                onClick={() => handleInlineZarAt(inlineZar.yaklasim)}
                className="p-1 rounded bg-[#2e1d11] hover:bg-[#442b1a] text-stone-300 hover:text-white border border-[#4d3725]"
                title="Zarı Yeniden At"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORTA BÖLÜM: 14 YAKLAŞIM (KATEGORİLERE GÖRE) & YARA HATLARI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* 14 YAKLAŞIM (7 cols) */}
        <div className="lg:col-span-7 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#493726] pb-2">
            <div>
              <h2 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <ContextTooltip term="14 Yaklaşım">
                  On Dört Yaklaşım (Kategorili Hızlı Zar Hub&apos;ı)
                </ContextTooltip>
              </h2>
              <span className="text-[10px] text-[#9a8976] font-mono">
                Dağılım: +4 ×1 · +3 ×2 · +2 ×3 · +1 ×3 · 0 ×2 · −1 ×3
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold bg-[#17120e] px-2 py-0.5 rounded border border-[#443322]">
              4dF Zar Motoru
            </span>
          </div>

          <div className="space-y-3">
            {yaklasimKategorileri.map((kat) => (
              <div key={kat.baslik} className="space-y-1">
                <span className={`text-[10px] font-heading font-bold uppercase tracking-wider block px-1.5 py-0.5 rounded border ${kat.renk}`}>
                  {kat.baslik}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {kat.liste.map((yAd) => {
                    const yInfo = YAKLASIMLAR[yAd];
                    const deger = karakter.yaklasimlar?.[yAd] ?? 0;
                    const derece = merdivenDerecesiBul(deger);
                    const isEgilim = karakter.irk && (
                      (karakter.irk === 'Eran' && yAd === 'Ver-ed') ||
                      (karakter.irk === 'Reth' && yAd === 'Lodvez') ||
                      (karakter.irk.includes('Galet') && yAd === 'Lithron') ||
                      (karakter.irk === 'Zieli' && yAd === 'Loth') ||
                      (karakter.irk === 'Gaehan' && yAd === 'Edor / Edros') ||
                      (karakter.irk === 'Irun' && yAd === 'Lithron') ||
                      (karakter.irk === 'Lithan' && yAd === 'Edor / Edros') ||
                      (karakter.irk === 'Gorgar' && yAd === 'Ghardello') ||
                      (karakter.irk === 'Mogar' && yAd === 'Edor / Edros') ||
                      (karakter.irk === 'Wolanlı' && yAd === 'Vizer') ||
                      (karakter.irk === 'Gölgeli' && yAd === 'Lodvez') ||
                      (karakter.irk === 'Xenor-kanlı' && yAd === 'Loth') ||
                      (karakter.tur === 'Meren' && yAd === 'Zel-vash')
                    );

                    return (
                      <div
                        key={yAd}
                        className="p-2 rounded-lg bg-[#15110d] border border-[#3b2b1d] hover:border-amber-600/80 transition-all flex items-center justify-between gap-2 shadow-sm group"
                      >
                        <div
                          className="min-w-0 cursor-pointer flex-1"
                          onClick={() => {
                            if (onQuickRoll3D) {
                              onQuickRoll3D(yAd);
                            } else {
                              handleInlineZarAt(yAd);
                            }
                          }}
                          title={`${yAd} için doğrudan 3D zar yuvarla`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-heading font-black text-[#f3ece0] text-xs group-hover:text-amber-300 transition-colors">
                              {yAd}
                            </span>
                            {isEgilim && (
                              <span className="text-[8px] bg-amber-950 text-amber-300 font-bold px-1 rounded border border-amber-800">
                                Eğilim
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#8e7e6d] block truncate">
                            {yInfo.fateKarsiligi}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div className="text-right">
                            <span className={`font-mono font-black text-sm block ${deger >= 3 ? 'text-amber-300' : deger >= 1 ? 'text-teal-300' : deger === 0 ? 'text-stone-400' : 'text-orange-400'}`}>
                              {deger >= 0 ? `+${deger}` : deger}
                            </span>
                            <span className="text-[8px] text-[#7a6b5c] block">{derece.split('(')[0]}</span>
                          </div>

                          {/* 3D Doğrudan Zar Butonu */}
                          <button
                            onClick={() => {
                              if (onQuickRoll3D) {
                                onQuickRoll3D(yAd);
                              } else {
                                handleInlineZarAt(yAd);
                              }
                            }}
                            className="px-1.5 py-1 rounded bg-[#2b1f15] hover:bg-amber-900/80 text-amber-300 border border-amber-800 hover:border-amber-400 flex items-center gap-1 font-bold text-[10px] shadow active:scale-95 transition-all"
                            title={`${yAd} (+${deger}) ile doğrudan 3D Zar At`}
                          >
                            <span>🎲</span>
                            <span className="text-[9px]">3D</span>
                          </button>

                          {/* 2D Hızlı Mini Zar Butonu */}
                          <button
                            onClick={() => handleInlineZarAt(yAd)}
                            className="w-6 h-6 rounded bg-[#1c140e] hover:bg-[#332215] text-stone-400 hover:text-white border border-[#443221] flex items-center justify-center text-[10px] shadow active:scale-95 transition-all"
                            title={`${yAd} için satır içi 2D Hızlı Zar`}
                          >
                            2D
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SAĞ: YARA HATLARI, SONUÇLAR VE TESLİM (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* YARA HATLARI (DOKUNSAL BALMUMU DAMGA KUTULARI) */}
          <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#493726] pb-2">
              <h2 className="font-heading font-black text-sm text-red-300 uppercase tracking-wide flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-400" />
                <ContextTooltip term="Tampon Kutusu">
                  Yara Hatları (Stres Tamponları)
                </ContextTooltip>
              </h2>
              <span className="text-[10px] text-[#93826e] font-mono">
                <ContextTooltip term="Şift">1 Kutu = 1 Şift</ContextTooltip>
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Fiziksel Hat */}
              <div className="p-2.5 rounded-lg bg-[#18120e] border border-[#3b2b1d] flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-xs text-[#eedec8] block">
                    <ContextTooltip term="Tampon Kutusu">Fiziksel Hat (Beden ve Güç)</ContextTooltip>
                  </span>
                  <span className="text-[10px] text-[#8e7e6d]">
                    Saldırı: Ghardello | Rax-ed · Savunma: Ghardello | Zel-vash
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((idx) => {
                    const isChecked = karakter.yaraHatlari?.fiziksel?.[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTamponKutu('fiziksel', idx)}
                        className={`w-7 h-7 rounded border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-red-800 border-red-500 text-white shadow ring-2 ring-red-400/80 scale-105'
                            : 'bg-[#120d09] border-[#443322] text-stone-500 hover:border-amber-600'
                        }`}
                        title={`Fiziksel Tampon Kutusu ${idx + 1}`}
                      >
                        {isChecked ? '✕' : '1'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Zihinsel Hat */}
              <div className="p-2.5 rounded-lg bg-[#18120e] border border-[#3b2b1d] flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-xs text-[#eedec8] block">
                    <ContextTooltip term="Tampon Kutusu">Zihinsel Hat (İrade ve Baskı)</ContextTooltip>
                  </span>
                  <span className="text-[10px] text-[#8e7e6d]">
                    Saldırı: Xes-hart | Loth (büyü) · Savunma: Edor / Edros
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((idx) => {
                    const isChecked = karakter.yaraHatlari?.zihinsel?.[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleTamponKutu('zihinsel', idx)}
                        className={`w-7 h-7 rounded border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-purple-900 border-purple-500 text-white shadow ring-2 ring-purple-400/80 scale-105'
                            : 'bg-[#120d09] border-[#443322] text-stone-500 hover:border-purple-600'
                        }`}
                        title={`Zihinsel Tampon Kutusu ${idx + 1}`}
                      >
                        {isChecked ? '✕' : '1'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* İtibar Hattı */}
              <div className="p-2.5 rounded-lg bg-[#18120e] border border-[#3b2b1d] flex items-center justify-between">
                <div>
                  <span className="font-heading font-bold text-xs text-[#eedec8] block">
                    <ContextTooltip term="Tampon Kutusu">İtibar Hattı (Ad ve Ün)</ContextTooltip>
                  </span>
                  <span className="text-[10px] text-[#8e7e6d]">
                    Saldırı: Lodvez · Savunma: Ver-ed (Hukuk: Aldris)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleTamponKutu('itibar', 0)}
                    className={`w-7 h-7 rounded border font-mono font-bold text-xs flex items-center justify-center transition-all ${
                      karakter.yaraHatlari?.itibar?.[0]
                        ? 'bg-blue-900 border-blue-500 text-white shadow ring-2 ring-blue-400/80 scale-105'
                        : 'bg-[#120d09] border-[#443322] text-stone-500 hover:border-blue-600'
                    }`}
                    title="İtibar Tampon Kutusu (Tek Kutu!)"
                  >
                    {karakter.yaraHatlari?.itibar?.[0] ? '✕' : '1'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2 rounded bg-[#120e0b] border border-[#3b2b1d] text-[10px] text-[#9a8976] italic font-serif">
              * Bir darbede tek bir kutu işaretlenir. Karşılanamayan hasar doğrudan en küçük Sonuç yuvasına yazılır. Emilemeyen şift = <strong>Bitmek</strong>.
            </div>
          </div>

          {/* SONUÇLAR (CONSEQUENCES) */}
          <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#493726] pb-2">
              <h2 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <ContextTooltip term="Aspect">
                  Sonuçlar (3 Hat İçin Ortak)
                </ContextTooltip>
              </h2>
              <span className="text-[10px] text-[#93826e] font-mono">Aspect Doğurur</span>
            </div>

            <div className="space-y-2">
              {/* Hafif Sonuç */}
              <div className="p-2 rounded-lg bg-[#16120e] border border-[#3b2b1d] flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-teal-400 block">Hafif Sonuç (−2)</span>
                  <span className="text-[#dcd1be] italic font-serif">
                    {karakter.sonuclar?.hafif || '(Boş - 1 Sahne sonra iyileşir)'}
                  </span>
                </div>
                {karakter.sonuclar?.hafif && (
                  <button onClick={() => handleSonucSil('hafif')} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                )}
              </div>

              {/* Orta Sonuç */}
              <div className="p-2 rounded-lg bg-[#16120e] border border-[#3b2b1d] flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-amber-400 block">Orta Sonuç (−4)</span>
                  <span className="text-[#dcd1be] italic font-serif">
                    {karakter.sonuclar?.orta || '(Boş - 1 Oturum sonra iyileşir)'}
                  </span>
                </div>
                {karakter.sonuclar?.orta && (
                  <button onClick={() => handleSonucSil('orta')} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                )}
              </div>

              {/* Ağır Sonuç */}
              <div className="p-2 rounded-lg bg-[#16120e] border border-[#3b2b1d] flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-red-400 block">Ağır Sonuç (−6)</span>
                  <span className="text-[#dcd1be] italic font-serif">
                    {karakter.sonuclar?.agir || '(Boş - 1 Bölüm / Hikâye dönümü)'}
                  </span>
                </div>
                {karakter.sonuclar?.agir && (
                  <button onClick={() => handleSonucSil('agir')} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                )}
              </div>
            </div>

            {/* Yeni Sonuç Ekleme Formu */}
            <div className="pt-2 border-t border-[#3b2b1d] flex gap-1.5">
              <select
                value={seciliSonucSeviye}
                onChange={(e) => setSeciliSonucSeviye(e.target.value as any)}
                className="bg-[#140f0c] text-amber-200 border border-[#443322] rounded px-2 py-1 text-xs"
              >
                <option value="hafif">Hafif (−2)</option>
                <option value="orta">Orta (−4)</option>
                <option value="agir">Ağır (−6)</option>
              </select>

              <input
                type="text"
                value={yeniSonucText}
                onChange={(e) => setYeniSonucText(e.target.value)}
                placeholder="Örn: Kırık Kaburga, Korkak Damgası..."
                className="flex-1 bg-[#140f0c] border border-[#443322] rounded px-2 py-1 text-xs text-[#f5ecd8] focus:outline-none"
              />

              <button
                onClick={handleSonucEkle}
                className="px-2.5 py-1 rounded wax-seal text-white font-bold text-xs"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ALT BÖLÜM: 5 ASPECT, UZMANLIKLAR, EKİPMAN & GEÇMİŞ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 5 ASPECT KARTLARI (6 cols) */}
        <div className="lg:col-span-6 parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#493726] pb-2">
            <div>
              <h2 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Scroll className="w-4 h-4 text-amber-400" />
                <ContextTooltip term="Aspect">
                  Beş Aspect (Kader &amp; Yük Cümleleri)
                </ContextTooltip>
              </h2>
              <span className="text-[10px] text-[#93826e] font-mono">
                Çağır (+2 ya da zar tazele) · Zorla (+1 Kader Puanı)
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {/* Unvan ve Kader */}
            <div className="p-2.5 rounded-lg bg-[#18130e] border border-[#3b2b1d]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] uppercase font-bold text-amber-400">1. Unvan ve Kader</span>
                <button
                  onClick={() => handleAspectCagir(karakter.aspectler?.unvanVeKader || '')}
                  className="text-[10px] text-amber-300 hover:text-white px-2 py-0.5 rounded bg-[#2b1f15] border border-[#443322]"
                >
                  <ContextTooltip term="Kader Çağrısı">Çağır (-1 KP)</ContextTooltip>
                </button>
              </div>
              <p className="font-serif italic font-bold text-[#f5ebd7]">
                &quot;{karakter.aspectler?.unvanVeKader || karakter.gorunumler?.anaKavram || 'Kader Aspecti'}&quot;
              </p>
            </div>

            {/* Zayıf Kanadı / Yük */}
            <div className="p-2.5 rounded-lg bg-[#18120e] border border-red-900/60">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] uppercase font-bold text-red-400">
                  <ContextTooltip term="Dert">2. Zayıf Kanadı / Yük (Trouble)</ContextTooltip>
                </span>
                <button
                  onClick={handleDertZorla}
                  className="text-[10px] text-red-300 hover:text-white px-2 py-0.5 rounded bg-[#381616] border border-red-800"
                >
                  <ContextTooltip term="Kader Kışkırtması">Zorla (+1 KP Al)</ContextTooltip>
                </button>
              </div>
              <p className="font-serif italic font-bold text-red-200">
                &quot;{karakter.aspectler?.zayifKanadi || karakter.gorunumler?.dert || 'Zayıf Kanadı'}&quot;
              </p>
            </div>

            {/* Sadakat Bağı */}
            <div className="p-2.5 rounded-lg bg-[#18130e] border border-[#3b2b1d]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] uppercase font-bold text-blue-400">3. Sadakat Bağı</span>
                <button
                  onClick={() => handleAspectCagir(karakter.aspectler?.sadakatBagi || '')}
                  className="text-[10px] text-blue-300 hover:text-white px-2 py-0.5 rounded bg-[#16202c] border border-blue-900"
                >
                  <ContextTooltip term="Kader Çağrısı">Çağır (-1 KP)</ContextTooltip>
                </button>
              </div>
              <p className="font-serif italic font-bold text-[#f5ebd7]">
                &quot;{karakter.aspectler?.sadakatBagi || karakter.gorunumler?.bag || 'Sadakat Bağı'}&quot;
              </p>
            </div>

            {/* Serbest 1 */}
            <div className="p-2.5 rounded-lg bg-[#18130e] border border-[#3b2b1d]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] uppercase font-bold text-stone-400">4. Serbest Aspect 1</span>
                <button
                  onClick={() => handleAspectCagir(karakter.aspectler?.serbest1 || '')}
                  className="text-[10px] text-stone-300 hover:text-white px-2 py-0.5 rounded bg-[#251d16] border border-[#443322]"
                >
                  <ContextTooltip term="Kader Çağrısı">Çağır (-1 KP)</ContextTooltip>
                </button>
              </div>
              <p className="font-serif italic font-bold text-[#ded2be]">
                &quot;{karakter.aspectler?.serbest1 || karakter.gorunumler?.gecmis || 'Serbest Aspect 1'}&quot;
              </p>
            </div>

            {/* Serbest 2 */}
            <div className="p-2.5 rounded-lg bg-[#18130e] border border-[#3b2b1d]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] uppercase font-bold text-stone-400">5. Serbest Aspect 2</span>
                <button
                  onClick={() => handleAspectCagir(karakter.aspectler?.serbest2 || '')}
                  className="text-[10px] text-stone-300 hover:text-white px-2 py-0.5 rounded bg-[#251d16] border border-[#443322]"
                >
                  Çağır (-1 KP)
                </button>
              </div>
              <p className="font-serif italic font-bold text-[#ded2be]">
                &quot;{karakter.aspectler?.serbest2 || karakter.gorunumler?.catisma || 'Serbest Aspect 2'}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* UZMANLIKLAR & EKİPMAN & GEÇMİŞ (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* UZMANLIKLAR */}
          <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#493726] pb-2 flex-wrap gap-2">
              <h2 className="font-heading font-black text-sm text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Uzmanlıklar</span>
              </h2>

              <div className="flex items-center gap-2">
                {onYetenekAgaciTikla && (
                  <button
                    onClick={() => {
                      sound.playSealStamp();
                      onYetenekAgaciTikla();
                    }}
                    className="px-2 py-0.5 rounded bg-[#2c1d12] hover:bg-[#3f2918] text-amber-300 text-[10px] font-bold border border-[#6b4725] flex items-center gap-1 shadow"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Yetenek Ağacı ({karakter.yetenekler?.length || 0})</span>
                  </button>
                )}

                <label className="flex items-center gap-1 text-[11px] text-purple-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={karakter.yasakIlim}
                    onChange={(e) => onKarakterGuncelle({ ...karakter, yasakIlim: e.target.checked })}
                    className="rounded border-[#443322]"
                  />
                  <ContextTooltip term="Yasak İlim">
                    <span>Yasak İlim</span>
                  </ContextTooltip>
                </label>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              {karakter.uzmanliklar?.map((u, i) => (
                <div key={i} className="p-2 rounded bg-[#16120e] border border-[#3b2b1d] flex items-start gap-2">
                  <span className="font-mono text-amber-400 font-bold">{i + 1}.</span>
                  <span className="text-[#ded1be]">{u}</span>
                </div>
              ))}
            </div>

            {/* Yeni Uzmanlık Ekle */}
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={yeniUzmanlik}
                onChange={(e) => setYeniUzmanlik(e.target.value)}
                placeholder="Örn: Çünkü ocakta büyüdüm, Lithron ile direnirken +2..."
                className="flex-1 bg-[#140f0c] border border-[#443322] rounded px-2.5 py-1 text-xs text-[#f5ecd8] focus:outline-none"
              />
              <button onClick={handleUzmanlikEkle} className="px-2.5 py-1 rounded wax-seal text-white font-bold text-xs">
                Ekle
              </button>
            </div>
          </div>

          {/* EKİPMAN ASPECT'LERİ & YÜK */}
          {(() => {
            const toplamYuk = hesaplaKarakterYuk(karakter.envanter || []);
            const maksYuk = hesaplaMaksimumYuk(karakter);
            const asiriYuklu = toplamYuk > maksYuk;

            return (
              <div className="parchment-sheet p-4 rounded-xl border-2 border-[#54412e] shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#493726] pb-2">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-teal-400" />
                    <h2 className="font-heading font-black text-sm text-teal-300 uppercase tracking-wide">
                      Ekipman &amp; Taşıma Yükü
                    </h2>
                  </div>

                  {onEnvanterTikla && (
                    <button
                      onClick={() => {
                        sound.playSealStamp();
                        onEnvanterTikla();
                      }}
                      className="px-2.5 py-1 rounded bg-[#2b1e14] hover:bg-[#3d2a1c] text-amber-300 text-[10px] font-bold border border-[#5a412c] flex items-center gap-1 shadow"
                    >
                      <Backpack className="w-3 h-3 text-amber-400" />
                      <span>Tam Envanter &amp; Yük</span>
                    </button>
                  )}
                </div>

                {/* Yük Durumu */}
                <div className="p-2 rounded-lg bg-[#140e0a] border border-[#382618] flex items-center justify-between text-xs">
                  <span className="text-[#a99c8b] flex items-center gap-1">
                    <Backpack className="w-3.5 h-3.5 text-amber-400" />
                    <span>Yük Kapasitesi:</span>
                  </span>
                  <span className="font-mono font-bold">
                    <span className={asiriYuklu ? 'text-rose-400' : 'text-amber-200'}>{toplamYuk}</span>
                    <span className="text-stone-500"> / {maksYuk} Yük</span>
                    {asiriYuklu && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-bold text-[9px] border border-rose-700">
                        AŞIRI YÜK (-2 DEX)
                      </span>
                    )}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                  {karakter.envanter?.map((item, idx) => (
                    <div
                      key={`${item.id}_${idx}`}
                      className={`p-2 rounded border flex flex-col gap-1 ${
                        item.kusandiMi
                          ? 'bg-[#22160d] border-amber-600/80 shadow-sm'
                          : 'bg-[#16120e] border-[#3b2b1d]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex items-center gap-1.5">
                          <span className="font-bold text-[#f5ecd8] truncate">{item.ad}</span>
                          {item.kusandiMi && (
                            <span className="px-1 rounded bg-amber-500 text-stone-950 text-[8px] font-black uppercase">
                              KUŞANILDI
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[10px]">
                          <span className="text-stone-400">Yük: {item.yuk ?? 1}</span>
                          <span className="text-amber-400">{item.fiyat} Aron</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#9a8976] truncate">
                        {item.aspectEtkisi || item.aciklama}
                      </div>

                      {item.durumSinerjisi && (
                        <div className="text-[9px] font-mono text-amber-400/90 flex items-center gap-1">
                          <span>⚡ Sinerji:</span>
                          <span className="truncate">{item.durumSinerjisi.aciklama}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hızlı Eşya Ekle */}
                <div className="flex gap-1.5 pt-1">
                  <input
                    type="text"
                    value={yeniEkipmanAd}
                    onChange={(e) => setYeniEkipmanAd(e.target.value)}
                    placeholder="Eşya Adı"
                    className="w-1/3 bg-[#140f0c] border border-[#443322] rounded px-2.5 py-1 text-xs text-[#f5ecd8] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={yeniEkipmanAspect}
                    onChange={(e) => setYeniEkipmanAspect(e.target.value)}
                    placeholder="Aspect Etkisi / Özelliği"
                    className="flex-1 bg-[#140f0c] border border-[#443322] rounded px-2.5 py-1 text-xs text-[#f5ecd8] focus:outline-none"
                  />
                  <button onClick={handleEkipmanEkle} className="px-2.5 py-1 rounded wax-seal text-white font-bold text-xs">
                    Ekle
                  </button>
                </div>
              </div>
            );
          })()}

          {/* GEÇMİŞ: KARAKTERİ TANIMLAYAN 3 CÜMLE */}
          <div className="parchment-sheet p-4 rounded-xl border border-[#4d3a28] shadow space-y-2">
            <h3 className="font-heading font-black text-xs text-amber-300 uppercase tracking-wide">
              Geçmiş · Karakteri Tanımlayan Üç Cümle
            </h3>
            <div className="space-y-1 text-xs font-serif italic text-[#ded1be]">
              {karakter.gecmis3Cumle?.map((c, i) => (
                <p key={i} className="p-1.5 rounded bg-[#16120e] border border-[#312317]">
                  <strong className="text-amber-400 not-italic mr-1">{i + 1}.</strong> {c}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MARKDOWN GÜNLÜK & NOTLAR */}
      <div className="parchment-sheet p-4 sm:p-5 rounded-2xl border-2 border-[#54412e] shadow-xl">
        <MarkdownNotes
          initialNotes={karakter.notlar || '## 📜 Karakter Notları & Komplolar'}
          onSaveNotes={(notlar: string) => onKarakterGuncelle({ ...karakter, notlar })}
          characterName={karakter.ad}
        />
      </div>
    </div>
  );
};
