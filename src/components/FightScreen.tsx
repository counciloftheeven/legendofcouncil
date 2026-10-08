import React, { useState, useEffect } from 'react';
import {
  Karakter,
  saldiriHesapla,
  zarAt4dF,
  cepheZariAt,
  NPC,
} from '../rules';
import {
  CANON_STATUS_EFFECTS,
  DurumEfektiTanimi,
  getStatusEffect,
  parseStatusEffects,
  calculateStatusDiceModifier,
  calculateStatusDefenseModifier,
  calculateStatusDamageModifier,
  calculateStatusTurnDamage,
} from '../rules/statusEffects';
import {
  VAHSI_HAYVANLAR,
  CANAVARLAR_VE_YARATIKLAR,
  RASTGELE_DUSMAN_NPCLER,
  TUM_YENI_DUSMANLAR,
  HAZIR_DUSMAN_GRUPLARI,
  DusmanGrubu,
  rastgeleDusmanUret
} from '../data/monstersAndBeasts';
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
  Flame,
  Sparkles,
  ShieldAlert,
  Award,
  AlertTriangle,
  Dices,
  FastForward,
  Gauge,
  Lightbulb,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type EylemKategorisi = 'Saldırı' | 'Savunma' | 'Büyü' | 'Destek';

export type EylemTuruId =
  | 'saldiri_yakin'     // 🗡️ Yakın Dövüş Hamlesi
  | 'saldiri_agir'      // 💥 Ağır Ezici Darbe (+2 Hasar)
  | 'saldiri_menzil'    // 🏹 Menzilli Yay / Arbalet
  | 'savunma_kalkan'    // 🛡️ Kalkan Siperi (+2 Savunma, +1 Zırh)
  | 'savunma_kacinma'   // 💨 Çevik Sıyrılma
  | 'buyu_run'          // 🔮 Yasak Rün Dokuması (Zırh Deler!)
  | 'buyu_leke'         // 🩸 Leke Patlaması (Yüksek Hasar, +1 Leke)
  | 'destek_moral'      // ✨ Moral & Taktiksel İlham (+2 Vuruş Bonusu)
  | 'destek_sifa'       // 🌿 Sahra Şifası & Sargı (+1 Can İyileştirir)
  | 'avantaj_yarat';    // 🎯 Fate: Avantaj Yarat (Create an Advantage)

export interface EylemTanimi {
  id: EylemTuruId;
  baslik: string;
  kategori: EylemKategorisi;
  ikon: string;
  bonusTuru: string;
  hedefTuru: 'Dusman' | 'Dost' | 'Kendisi';
  aciklama: string;
}

export const EYLEM_LISTESI: EylemTanimi[] = [
  // 1. SALDIRI EYLEMLERİ
  {
    id: 'saldiri_yakin',
    baslik: 'Yakın Dövüş Hamlesi',
    kategori: 'Saldırı',
    ikon: '🗡️',
    bonusTuru: 'Fight',
    hedefTuru: 'Dusman',
    aciklama: 'Kılıç, balta veya mızrak ile doğrudan temas saldırısı (4dF + Fight).',
  },
  {
    id: 'saldiri_agir',
    baslik: 'Ağır Ezici Darbe',
    kategori: 'Saldırı',
    ikon: '💥',
    bonusTuru: 'STR',
    hedefTuru: 'Dusman',
    aciklama: 'Tüm ağırlıkla yapılan vahşi darbe (4dF + STR). Vuruş başarılı olursa +2 Ekstra Hasar verir!',
  },
  {
    id: 'saldiri_menzil',
    baslik: 'Menzilli Yay / Arbalet',
    kategori: 'Saldırı',
    ikon: '🏹',
    bonusTuru: 'Shoot',
    hedefTuru: 'Dusman',
    aciklama: 'Mesafeyi koruyarak ok veya fırlatma bıçağı atışı (4dF + Shoot).',
  },

  // 2. SAVUNMA EYLEMLERİ
  {
    id: 'savunma_kalkan',
    baslik: 'Kalkan Siperi & Duruş',
    kategori: 'Savunma',
    ikon: '🛡️',
    bonusTuru: 'CON / Kalkan',
    hedefTuru: 'Kendisi',
    aciklama: 'Kalkan arkasına çekilerek savunmayı +2 ve Zırhı +1 artırır. Gelen darbeleri karşılar.',
  },
  {
    id: 'savunma_kacinma',
    baslik: 'Çevik Sıyrılma',
    kategori: 'Savunma',
    ikon: '💨',
    bonusTuru: 'DEX / Çeviklik',
    hedefTuru: 'Kendisi',
    aciklama: 'Gelen darbe hattından akrobatik bir hamleyle kaçınma hazırlığı yapar (+2 Savunma).',
  },

  // 3. BÜYÜ EYLEMLERİ
  {
    id: 'buyu_run',
    baslik: 'Yasak Rün Dokuması',
    kategori: 'Büyü',
    ikon: '🔮',
    bonusTuru: 'Lore / INT',
    hedefTuru: 'Dusman',
    aciklama: 'Kadim dokuma ile düşmanın bedenini çarpar (4dF + Lore). HEDEFİN ZIRHINI TAMAMEN YOK SAYAR!',
  },
  {
    id: 'buyu_leke',
    baslik: 'Leke Patlaması',
    kategori: 'Büyü',
    ikon: '🩸',
    bonusTuru: 'Lore + 1',
    hedefTuru: 'Dusman',
    aciklama: 'Karanlık gücü serbest bırakarak yüksek hasar verir; büyücüye +1 Leke biriktirir.',
  },

  // 4. DESTEK EYLEMLERİ
  {
    id: 'destek_moral',
    baslik: 'Moral & Taktiksel İlham',
    kategori: 'Destek',
    ikon: '✨',
    bonusTuru: 'CHA / Provoke',
    hedefTuru: 'Dost',
    aciklama: 'Müttefike savaş narasıyla cesaret verir; bir sonraki hamlesine +2 Vuruş Bonusu sağlar.',
  },
  {
    id: 'destek_sifa',
    baslik: 'Sahra Şifası & Sargı',
    kategori: 'Destek',
    ikon: '🌿',
    bonusTuru: 'WIS / Investigate',
    hedefTuru: 'Dost',
    aciklama: 'Yaralı dostun kanamasını durdurarak 1 Yara Kutusunu temizler ve canını yeniler.',
  },
  {
    id: 'avantaj_yarat',
    baslik: 'Avantaj Yarat (Görünüş Aç)',
    kategori: 'Destek',
    ikon: '🎯',
    bonusTuru: 'Fight / Taktik',
    hedefTuru: 'Dusman',
    aciklama: 'Düşmanı şaşırtarak veya zemini kullanarak taktiksel bir görünüş yaratır. Başarılı olursa 1 Ücretsiz Çağrı (Free Invoke) kazandırır!',
  },
];

export interface Combatant {
  id: string;
  ad: string;
  tur: 'Oyuncu' | 'Müttefik' | 'Düşman';
  side: 'sol' | 'sag';
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
  ekstraVurusBonusu?: number;
}

interface FightScreenProps {
  karakterler: Karakter[];
  aktifKarakter: Karakter;
  npcler: NPC[];
  rol: 'Anlatıcı' | 'Oyuncu';
  onKarakterGuncelle?: (yeniKarakter: Karakter) => void;
  baslangicDusmanNpc?: NPC | null;
}

const DEFAULT_AVATARS: Record<string, string> = {
  Oyuncu: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
  Müttefik: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
  Düşman: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
};

const HAZIR_DUSMAN_SABLONLARI: Omit<Combatant, 'id' | 'side'>[] = [
  ...TUM_YENI_DUSMANLAR.map((n) => ({
    ad: n.ad,
    tur: 'Düşman' as const,
    fotoUrl: n.fotoUrl || DEFAULT_AVATARS.Düşman,
    fightBonus: n.stats.fight,
    savunmaBonus: n.stats.savunma,
    zirh: n.tehdit === 'Ölümcül' ? 3 : n.tehdit === 'Yüksek' ? 2 : 1,
    yaraKutulari: n.stats.yaraKutulari,
    alinanYara: 0,
    yorgunluk: 0,
    durumlar: [n.tur || 'Düşman', n.anaKavram.slice(0, 30)],
    tehdit: n.tehdit,
    ozelDavranis: n.anlaticiNotlari,
    safYeri: (n.tur === 'Vahşi Hayvan' || n.tehdit === 'Ölümcül' ? 'Ön Hat' : 'Arka Hat') as 'Ön Hat' | 'Arka Hat',
  })),
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
  onKarakterGuncelle,
  baslangicDusmanNpc,
}) => {
  // Savaşçılar: Sol kanat (4 Kişilik Oyuncu Ekibi) ve Sağ kanat (Düşmanlar, Canavarlar, Vahşi Hayvanlar)
  const [savascilar, setSavascilar] = useState<Combatant[]>(() => {
    const partiCombatants: Combatant[] = karakterler.slice(0, 4).map((c, i) => ({
      id: c.id,
      ad: c.ad,
      tur: 'Oyuncu',
      side: 'sol',
      fotoUrl: c.fotoUrl || DEFAULT_AVATARS.Oyuncu,
      fightBonus: c.beceriler.Fight,
      savunmaBonus: c.nitelikler.DEX,
      zirh: i === 0 ? 1 : i === 1 ? 1 : i === 2 ? 2 : 0,
      yaraKutulari: c.sayaclar.yaraKutulari,
      alinanYara: c.sayaclar.alınanYaraKutulari,
      yorgunluk: c.sayaclar.yorgunluk,
      durumlar: ['Teyakkuzda'],
      safYeri: i <= 1 ? 'Ön Hat' : 'Arka Hat',
    }));

    const dusmanlar: Combatant[] = [
      {
        id: 'boss_drakar',
        ad: 'Kara Hodrev (Drakar - Çete Reisi)',
        tur: 'Düşman',
        side: 'sag',
        fotoUrl: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
        fightBonus: 3,
        savunmaBonus: 2,
        zirh: 2,
        yaraKutulari: 5,
        alinanYara: 0,
        yorgunluk: 0,
        durumlar: ['Öfkeli', 'Çift Ağızlı Balta'],
        tehdit: 'Yüksek',
        ozelDavranis: 'Yaralı hedeflere vururken +3 Vuruş kazanır.',
        safYeri: 'Ön Hat',
      },
      {
        id: 'beast_kurt_1',
        ad: 'Khasinya Ayaz Kurdu ("Ak Yele")',
        tur: 'Düşman',
        side: 'sag',
        fotoUrl: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
        fightBonus: 4,
        savunmaBonus: 3,
        zirh: 1,
        yaraKutulari: 4,
        alinanYara: 0,
        yorgunluk: 0,
        durumlar: ['Vahşi Hayvan', 'Dondurucu Isırık'],
        tehdit: 'Yüksek',
        ozelDavranis: 'Sürüyle saldırırken +2 vuruş kazanır.',
        safYeri: 'Ön Hat',
      },
      {
        id: 'monster_mor_kul_1',
        ad: 'Mor Kül Hortlağı ("Ölümsüz Madenci")',
        tur: 'Düşman',
        side: 'sag',
        fotoUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
        fightBonus: 3,
        savunmaBonus: 2,
        zirh: 2,
        yaraKutulari: 4,
        alinanYara: 0,
        yorgunluk: 0,
        durumlar: ['Canavar', 'Leke Yayan'],
        tehdit: 'Yüksek',
        ozelDavranis: 'Mor kül dokunuşuyla zihne +1 Leke aşılar.',
        safYeri: 'Arka Hat',
      },
      {
        id: 'mob_guard_1',
        ad: 'Karagöl Dağ Haydutu',
        tur: 'Düşman',
        side: 'sag',
        fotoUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=600&auto=format&fit=crop&q=80',
        fightBonus: 2,
        savunmaBonus: 1,
        zirh: 1,
        yaraKutulari: 3,
        alinanYara: 0,
        yorgunluk: 0,
        durumlar: ['Pusucu'],
        tehdit: 'Orta',
        ozelDavranis: 'Öncü darbesiyle dikkat dağıtır.',
        safYeri: 'Arka Hat',
      },
    ];

    return [...partiCombatants, ...dusmanlar];
  });

  // Hızlı Canon Boss Değiştirme
  const handleBossSec = (npc: NPC) => {
    sound.playBladeClash();
    confetti({ particleCount: 30, spread: 60 });
    const yeniBoss: Combatant = {
      id: npc.id,
      ad: npc.ad,
      tur: 'Düşman',
      side: 'sag',
      fotoUrl: npc.fotoUrl || DEFAULT_AVATARS.Düşman,
      fightBonus: npc.stats.fight,
      savunmaBonus: npc.stats.savunma,
      zirh: npc.tehdit === 'Ölümcül' ? 3 : npc.tehdit === 'Yüksek' ? 2 : 1,
      yaraKutulari: npc.stats.yaraKutulari,
      alinanYara: 0,
      yorgunluk: 0,
      durumlar: [npc.tur || 'Düşman', npc.anaKavram.slice(0, 30)],
      tehdit: npc.tehdit,
      ozelDavranis: npc.anlaticiNotlari,
      safYeri: npc.tur === 'Vahşi Hayvan' ? 'Ön Hat' : 'Ön Hat',
    };

    setSavascilar((prev) => {
      const solKanat = prev.filter((s) => s.side === 'sol');
      return [...solKanat, yeniBoss];
    });

    setSeciliHedefId(npc.id);
    setSavasGunlugu((prev) => [
      `⚔️ [DÜŞMAN SAHNEYE İNDİ] ${npc.ad} muharebeye girdi! "${npc.anaKavram}"`,
      ...prev,
    ]);
  };

  // Düşman Ekleme (Sağ Kanat - Listeye Ekler)
  const handleDusmanNpcEkle = (npc: NPC, safYeri: 'Ön Hat' | 'Arka Hat' = 'Ön Hat') => {
    sound.playBladeClash();
    confetti({ particleCount: 20, spread: 40 });
    const yeni: Combatant = {
      id: `${npc.id}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ad: npc.ad,
      tur: 'Düşman',
      side: 'sag',
      fotoUrl: npc.fotoUrl || DEFAULT_AVATARS.Düşman,
      fightBonus: npc.stats.fight,
      savunmaBonus: npc.stats.savunma,
      zirh: npc.tehdit === 'Ölümcül' ? 3 : npc.tehdit === 'Yüksek' ? 2 : 1,
      yaraKutulari: npc.stats.yaraKutulari,
      alinanYara: 0,
      yorgunluk: 0,
      durumlar: [npc.tur || 'Düşman', npc.anaKavram.slice(0, 30)],
      tehdit: npc.tehdit,
      ozelDavranis: npc.anlaticiNotlari,
      safYeri,
    };
    setSavascilar((prev) => [...prev, yeni]);
    setSeciliHedefId(yeni.id);
    setSavasGunlugu((prev) => [
      `🩸 [YENİ TEHDİT KATILDI] ${yeni.ad} sağ kanada yerleşti! (${safYeri})`,
      ...prev,
    ]);
  };

  // Hazır 4v4 Düşman Grubu Çağırma
  const handleDusmanGrubuSec = (grup: DusmanGrubu) => {
    sound.playWarDrums();
    confetti({ particleCount: 45, spread: 70 });
    const solKanat = savascilar.filter((s) => s.side === 'sol');
    const grupCombatants: Combatant[] = grup.dusmanlar.map((npc, idx) => ({
      id: `${npc.id}_${Date.now()}_${idx}`,
      ad: npc.ad,
      tur: 'Düşman',
      side: 'sag',
      fotoUrl: npc.fotoUrl || DEFAULT_AVATARS.Düşman,
      fightBonus: npc.stats.fight,
      savunmaBonus: npc.stats.savunma,
      zirh: npc.tehdit === 'Ölümcül' ? 3 : npc.tehdit === 'Yüksek' ? 2 : 1,
      yaraKutulari: npc.stats.yaraKutulari,
      alinanYara: 0,
      yorgunluk: 0,
      durumlar: [npc.tur || 'Düşman', npc.anaKavram.slice(0, 30)],
      tehdit: npc.tehdit,
      ozelDavranis: npc.anlaticiNotlari,
      safYeri: idx <= 1 ? 'Ön Hat' : 'Arka Hat',
    }));

    setSavascilar([...solKanat, ...grupCombatants]);
    if (grupCombatants[0]) {
      setSeciliHedefId(grupCombatants[0].id);
    }
    if (grup.taktikZemin && !taktikZeminler.includes(grup.taktikZemin)) {
      setTaktikZeminler((prev) => [...prev, grup.taktikZemin]);
    }
    setSavasGunlugu((prev) => [
      `🔥 [DÜŞMAN SÜRÜSÜ MEYDANA ÇIKTI] "${grup.ad}" savaşa girdi! ${grup.aciklama}`,
      ...prev,
    ]);
  };

  // Rastgele Düşman / Canavar / Hayvan Üret ve Sahneye Al
  const handleRastgeleCanavarSpawn = (turTipi: 'Vahşi Hayvan' | 'Canavar' | 'Rastgele NPC' = 'Canavar') => {
    const yeniNpc = rastgeleDusmanUret(turTipi);
    handleDusmanNpcEkle(yeniNpc, turTipi === 'Vahşi Hayvan' ? 'Ön Hat' : 'Arka Hat');
  };

  useEffect(() => {
    if (baslangicDusmanNpc) {
      handleBossSec(baslangicDusmanNpc);
    }
  }, [baslangicDusmanNpc]);

  // Sıra & İnisiyatif State
  const [siraIndex, setSiraIndex] = useState<number>(0);

  // Taktiksel Zemin Durumları (Battlefield Tactical Aspect Zones)
  const [taktikZeminler, setTaktikZeminler] = useState<string[]>([
    '🛡️ Yıkılmış Sütun (Siper)',
  ]);

  const handleTaktikZeminToggle = (zeminAd: string) => {
    sound.playSealStamp();
    if (taktikZeminler.includes(zeminAd)) {
      setTaktikZeminler((prev) => prev.filter((z) => z !== zeminAd));
      setSavasGunlugu((prev) => [`❌ [ZEMİN KALDIRILDI] "${zeminAd}" etkisini kaybetti.`, ...prev.slice(0, 30)]);
    } else {
      setTaktikZeminler((prev) => [...prev, zeminAd]);
      setSavasGunlugu((prev) => [`🔥 [TAKTIKSEL ZEMİN ETKİN] Meydana "${zeminAd}" yerleştirildi! Savaşçılar bunu +2 Avantaj veya hasar bonusu olarak çağırabilir.`, ...prev.slice(0, 30)]);
      confetti({ particleCount: 25, spread: 50 });
    }
  };
  const [turSayaci, setTurSayaci] = useState<number>(1);
  const [delloModu, setDelloModu] = useState<boolean>(false);
  // Dövüş Hızı ve Sade Görünüm Ayarları
  const [savasHizi, setSavasHizi] = useState<'1x' | '2x' | '3x'>('1x');
  const [sadeArayuz, setSadeArayuz] = useState<boolean>(false);

  // Saldırı / Eylem Türü Seçimi State
  const [seciliEylemKategorisi, setSeciliEylemKategorisi] = useState<'Tümü' | EylemKategorisi>('Tümü');
  const [seciliEylemId, setSeciliEylemId] = useState<EylemTuruId>('saldiri_yakin');

  // Çatışma State (Saldıran & Hedef)
  const [seciliHedefId, setSeciliHedefId] = useState<string>('mob_wolf_1');
  const [sonZarCatismasi, setSonZarCatismasi] = useState<{
    eylemAdi: string;
    eylemIkonu: string;
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
    '⚔️ Sıra tabanlı taktik savaş meydanı açıldı. Saldırı, Savunma, Büyü ve Destek türleri hazır!',
  ]);

  // Karakter Yerleştirme Modalı
  const [yerlestirModalAcik, setYerlestirModalAcik] = useState<boolean>(false);
  const [modalDusmanFiltre, setModalDusmanFiltre] = useState<'Tümü' | 'Canavar' | 'Vahşi Hayvan' | 'Düşman' | 'Hazır Grup'>('Tümü');
  // Durum Efekti Modalı
  const [durumModalSavasciId, setDurumModalSavasciId] = useState<string | null>(null);

  // Durum Efekti Ekle / Çıkar
  const handleDurumToggle = (savasciId: string, durumAdi: string) => {
    sound.playSealStamp();
    setSavascilar((prev) =>
      prev.map((s) => {
        if (s.id !== savasciId) return s;
        const varMi = s.durumlar.some((d) => d.toLowerCase().includes(durumAdi.toLowerCase()));
        const yeniDurumlar = varMi
          ? s.durumlar.filter((d) => !d.toLowerCase().includes(durumAdi.toLowerCase()))
          : [...s.durumlar, durumAdi];
        return { ...s, durumlar: yeniDurumlar };
      })
    );
  };

  const aktifSavasci = savascilar[siraIndex] || savascilar[0];
  const seciliHedef = savascilar.find((s) => s.id === seciliHedefId);
  const seciliEylem = EYLEM_LISTESI.find((e) => e.id === seciliEylemId) || EYLEM_LISTESI[0];

  // Sol ve Sağ Kanat Savaşçıları
  const solKanat = savascilar.filter((s) => s.side === 'sol');
  const sagKanat = savascilar.filter((s) => s.side === 'sag');

  // Aktif Savaşçının Seçili Eyleme Göre Saldırı Bonusu Değerini Bul
  const getAktifSavasciEylemBonusu = (eylemId: EylemTuruId): { bonus: number; isim: string } => {
    const bagliKarakter = karakterler.find((c) => c.id === aktifSavasci.id);

    switch (eylemId) {
      case 'saldiri_yakin':
        return {
          bonus: bagliKarakter ? bagliKarakter.beceriler.Fight : aktifSavasci.fightBonus,
          isim: 'Fight',
        };
      case 'saldiri_agir':
        return {
          bonus: bagliKarakter ? bagliKarakter.nitelikler.STR : aktifSavasci.fightBonus + 1,
          isim: 'STR',
        };
      case 'saldiri_menzil':
        return {
          bonus: bagliKarakter ? bagliKarakter.beceriler.Shoot : 2,
          isim: 'Shoot',
        };
      case 'savunma_kalkan':
        return {
          bonus: bagliKarakter ? bagliKarakter.nitelikler.CON + 2 : aktifSavasci.savunmaBonus + 2,
          isim: 'Kalkan Siperi',
        };
      case 'savunma_kacinma':
        return {
          bonus: bagliKarakter ? bagliKarakter.nitelikler.DEX + 2 : aktifSavasci.savunmaBonus + 2,
          isim: 'DEX / Çeviklik',
        };
      case 'buyu_run':
        return {
          bonus: bagliKarakter ? bagliKarakter.beceriler.Lore : 3,
          isim: 'Lore / Kadim',
        };
      case 'buyu_leke':
        return {
          bonus: bagliKarakter ? bagliKarakter.beceriler.Lore + 1 : 4,
          isim: 'Leke Dokuması',
        };
      case 'destek_moral':
        return {
          bonus: bagliKarakter ? bagliKarakter.nitelikler.CHA : 2,
          isim: 'CHA / Karizma',
        };
      case 'destek_sifa':
        return {
          bonus: bagliKarakter ? bagliKarakter.nitelikler.WIS : 2,
          isim: 'WIS / Şifa',
        };
      case 'avantaj_yarat':
        return {
          bonus: bagliKarakter ? bagliKarakter.beceriler.Fight : 2,
          isim: 'Fight / Taktik',
        };
      default:
        return { bonus: aktifSavasci.fightBonus, isim: 'Temel' };
    }
  };

  // Fate: Sahne Görünüşleri & Ücretsiz Çağrılar
  const [sahneGorunusleri, setSahneGorunusleri] = useState<{ id: string; ad: string; ucretsizCagri: number }[]>([
    { id: 'sc_1', ad: 'Zemin Kaygan & Sisli', ucretsizCagri: 1 },
    { id: 'sc_2', ad: 'Yıkık Taş Siperi', ucretsizCagri: 0 },
  ]);
  const [ucretsizBonusKullan, setUcretsizBonusKullan] = useState<number>(0);

  // Mühür Harca: Görünüş Çağırarak Sonuca +2 Ekle
  const handleMuhurArti2Vurus = () => {
    if (aktifKarakter.sayaclar.muhur <= 0 || !sonZarCatismasi) return;
    sound.playSealStamp();
    confetti({ particleCount: 35, spread: 65, origin: { y: 0.6 } });

    if (onKarakterGuncelle) {
      onKarakterGuncelle({
        ...aktifKarakter,
        sayaclar: { ...aktifKarakter.sayaclar, muhur: aktifKarakter.sayaclar.muhur - 1 },
      });
    }

    const yeniNetHasar = sonZarCatismasi.netHasar + 2;
    setSonZarCatismasi({
      ...sonZarCatismasi,
      netHasar: yeniNetHasar,
      saldiriToplami: sonZarCatismasi.saldiriToplami + 2,
      aciklama: `${sonZarCatismasi.aciklama} ✨ [Görünüş Çağrıldı: "${aktifKarakter.gorunumler.anaKavram}" (+2 Hasar/Vuruş Eklendi!)]`,
    });

    if (seciliHedef) {
      setSavascilar((prev) =>
        prev.map((s) => (s.id === seciliHedef.id ? { ...s, alinanYara: Math.min(s.yaraKutulari, s.alinanYara + 1) } : s))
      );
    }
  };

  // Mühür Harca: Zarları Baştan At (Reroll)
  const handleMuhurReroll = () => {
    if (aktifKarakter.sayaclar.muhur <= 0) return;
    sound.playSealStamp();
    if (onKarakterGuncelle) {
      onKarakterGuncelle({
        ...aktifKarakter,
        sayaclar: { ...aktifKarakter.sayaclar, muhur: aktifKarakter.sayaclar.muhur - 1 },
      });
    }
    handleEylemGerceklestir();
  };

  // Dert Zorlaması (Compel): +1 Mühür Kazan
  const handleCompelDert = () => {
    sound.playSealStamp();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    if (onKarakterGuncelle) {
      onKarakterGuncelle({
        ...aktifKarakter,
        sayaclar: { ...aktifKarakter.sayaclar, muhur: aktifKarakter.sayaclar.muhur + 1 },
      });
    }
    const log = `⚠️ [DERT ZORLAMASI (COMPEL)] "${aktifKarakter.gorunumler.dert}" aleyhe işledi! Sahne zorlaştı fakat +1 Kader Mührü kazanıldı!`;
    setSavasGunlugu((prev) => [log, ...prev.slice(0, 30)]);
  };

  // Lomera Barışı & Denge Çemberi
  const handleLomeraBarisi = () => {
    sound.playSealStamp();
    confetti({ particleCount: 35, spread: 60 });
    const yeniMod = !delloModu;
    setDelloModu(yeniMod);
    const mesaj = yeniMod
      ? '🕊️ [LOMERA BARIŞI & DENGE ÇEMBERİ] Mabed rahibi kireçle çember çizdi! Toplu savaş durduruldu, mesele Dello Meydan Düellosuna (Ghardello 1v1) bırakıldı.'
      : '⚔️ [DÜELLO BİTTİ] Dello meydan düellosu sona erdi, genel muharebe düzenine dönüldü.';
    setSavasGunlugu((prev) => [mesaj, ...prev.slice(0, 30)]);
  };

  // Sabit Eşiği Kırmak İçin Gedik Açma
  const handleGedikAc = () => {
    sound.playSealStamp();
    confetti({ particleCount: 40, spread: 65, origin: { y: 0.6 } });
    const yeniGedik = {
      id: `gedik_${Date.now()}`,
      ad: `Gedik: ${seciliHedef?.ad || 'Hedef'} Meclis Önünde Küçük Düştü`,
      ucretsizCagri: 1,
    };
    setSahneGorunusleri((prev) => [...prev, yeniGedik]);
    const mesaj = `⚡ [GEDİK AÇILDI] Ver-ed ile Sabit Eşik aşıldı! Sahneye "${yeniGedik.ad}" (+1 Ücretsiz Çağrı) Aspect'i eklendi. Artık doğrudan saldırılabilir!`;
    setSavasGunlugu((prev) => [mesaj, ...prev.slice(0, 30)]);
  };

  // Sahne Görünüşünden Ücretsiz Çağrı Kullan (Free Invoke)
  const handleUcretsizCagriKullan = (id: string) => {
    sound.playSealStamp();
    setSahneGorunusleri((prev) =>
      prev.map((sc) => (sc.id === id ? { ...sc, ucretsizCagri: Math.max(0, sc.ucretsizCagri - 1) } : sc))
    );
    setUcretsizBonusKullan((prev) => prev + 2);
  };

  // Eylem Değiştiğinde Uygun Hedefi Otomatik Belirle
  const handleEylemSec = (eylem: EylemTanimi) => {
    sound.playSealStamp();
    setSeciliEylemId(eylem.id);

    if (eylem.hedefTuru === 'Kendisi') {
      setSeciliHedefId(aktifSavasci.id);
    } else if (eylem.hedefTuru === 'Dost') {
      const canliDost = solKanat.find((d) => d.id !== aktifSavasci.id && d.alinanYara < d.yaraKutulari) || aktifSavasci;
      setSeciliHedefId(canliDost.id);
    } else {
      const canliDusman = sagKanat.find((d) => d.alinanYara < d.yaraKutulari);
      if (canliDusman) setSeciliHedefId(canliDusman.id);
    }
  };

  // Sırayı bir sonraki savaşçıya devret
  const handleSonrakiSira = () => {
    sound.playSealStamp();
    if (savascilar.length === 0) return;

    const nextIdx = (siraIndex + 1) % savascilar.length;
    if (nextIdx === 0) {
      setTurSayaci((prev) => prev + 1);
      const dotLogs: string[] = [`--- ${turSayaci + 1}. Muharebe Turu Başladı ---`];

      // Durum Efektleri Hasarını (DoT: Kanama, Zehir, Alev) Otomatik Uygula
      setSavascilar((prev) =>
        prev.map((s) => {
          if (s.alinanYara >= s.yaraKutulari) return s;
          const dot = calculateStatusTurnDamage(s.durumlar || []);
          if (dot > 0) {
            const yeniYara = Math.min(s.yaraKutulari, s.alinanYara + dot);
            const efektler = parseStatusEffects(s.durumlar || []).filter((e) => e.turBasiHasar > 0);
            const efektAdlari = efektler.map((e) => `${e.ikon} ${e.ad} (${e.turBasiHasar} Hasar)`).join(', ');
            dotLogs.push(`⚠️ [DURUM HASARI] ${s.ad} acı çekiyor: ${efektAdlari} ➔ +${dot} Yara aldı! (${yeniYara}/${s.yaraKutulari})`);
            return { ...s, alinanYara: yeniYara };
          }
          return s;
        })
      );
      setSavasGunlugu((prev) => [...dotLogs, ...prev]);
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

  // Eylemi Gerçekleştir (Saldırı, Savunma, Büyü, Destek & Şifa)
  const handleEylemGerceklestir = () => {
    if (!aktifSavasci || !seciliHedef) return;

    sound.playDiceRoll();
    setDarbeEfekti(true);

    const { bonus: saldiranBonus, isim: bonusIsmi } = getAktifSavasciEylemBonusu(seciliEylem.id);
    const ekstraBonus = (aktifSavasci.ekstraVurusBonusu || 0) + ucretsizBonusKullan;

    const animDelay = savasHizi === '3x' ? 80 : savasHizi === '2x' ? 200 : 400;

    setTimeout(() => {
      setUcretsizBonusKullan(0);
      // 1. SAVUNMA EYLEMLERİ (Kalkan Siperi / Çevik Sıyrılma)
      if (seciliEylem.kategori === 'Savunma') {
        sound.playBladeClash();
        const durumMetni = seciliEylem.id === 'savunma_kalkan' ? 'Çelik Siper' : 'Çevik Sıyrılma (+2 Savunma)';
        
        setSavascilar((prev) =>
          prev.map((s) => {
            if (s.id === aktifSavasci.id) {
              const yeniDurumlar = s.durumlar.includes(durumMetni) ? s.durumlar : [...s.durumlar, durumMetni];
              return {
                ...s,
                zirh: seciliEylem.id === 'savunma_kalkan' ? s.zirh + 1 : s.zirh,
                savunmaBonus: s.savunmaBonus + 2,
                durumlar: yeniDurumlar,
              };
            }
            return s;
          })
        );

        const log = `🛡️ [Savunma] ${aktifSavasci.ad} savunma duruşuna geçti: "${seciliEylem.baslik}" uygulandı.`;
        setSavasGunlugu((prev) => [log, ...prev.slice(0, 30)]);
        setSonZarCatismasi({
          eylemAdi: seciliEylem.baslik,
          eylemIkonu: seciliEylem.ikon,
          saldiranAd: aktifSavasci.ad,
          hedefAd: aktifSavasci.ad,
          saldiriZarlari: [1, 1, 0, 0],
          saldiriZarToplami: 2,
          saldiranBonus,
          saldiriToplami: saldiranBonus + 2,
          savunmaZarlari: [0, 0, 0, 0],
          savunmaZarToplami: 0,
          savunmaBonus: aktifSavasci.savunmaBonus,
          savunmaToplami: aktifSavasci.savunmaBonus,
          vurusFarki: 0,
          hedefZirh: aktifSavasci.zirh,
          netHasar: 0,
          kademe: 'Savunma Kuruldu',
          aciklama: `${aktifSavasci.ad} bu tur gelen darbeleri karşılamak üzere kalkanını ve gardını kaldırdı.`,
        });
        setDarbeEfekti(false);
        return;
      }

      // 2. DESTEK / ŞİFA EYLEMLERİ
      if (seciliEylem.kategori === 'Destek') {
        sound.playSealStamp();

        if (seciliEylem.id === 'destek_sifa') {
          // Can İyileştirme
          setSavascilar((prev) =>
            prev.map((s) => {
              if (s.id === seciliHedef.id) {
                return { ...s, alinanYara: Math.max(0, s.alinanYara - 1) };
              }
              return s;
            })
          );
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
          const log = `🌿 [Şifa] ${aktifSavasci.ad} ➔ ${seciliHedef.ad}: Yaraları sardı ve 1 Can tazeledi!`;
          setSavasGunlugu((prev) => [log, ...prev.slice(0, 30)]);
        } else if (seciliEylem.id === 'avantaj_yarat') {
          // Avantaj Yaratma (Create an Advantage)
          sound.playSealStamp();
          confetti({ particleCount: 35, spread: 65, origin: { y: 0.6 } });
          const yeniAd = `🎯 Zayıf Nokta Açıldı (${seciliHedef.ad})`;
          setSahneGorunusleri((prev) => [
            ...prev,
            { id: `sc_${Date.now()}`, ad: yeniAd, ucretsizCagri: 1 },
          ]);
          const log = `🎯 [Avantaj Yaratıldı] ${aktifSavasci.ad} ➔ ${seciliHedef.ad} üzerinde gedik açtı! "${yeniAd}" sahneye işlendi (1 Ücretsiz Çağrı!).`;
          setSavasGunlugu((prev) => [log, ...prev.slice(0, 30)]);

          setSonZarCatismasi({
            eylemAdi: 'Avantaj Yarat (Görünüş Aç)',
            eylemIkonu: '🎯',
            saldiranAd: aktifSavasci.ad,
            hedefAd: seciliHedef.ad,
            saldiriZarlari: [1, 1, 0, 0],
            saldiriZarToplami: 2,
            saldiranBonus,
            saldiriToplami: saldiranBonus + 2,
            savunmaZarlari: [0, 0, 0, 0],
            savunmaZarToplami: 0,
            savunmaBonus: seciliHedef.savunmaBonus,
            savunmaToplami: seciliHedef.savunmaBonus,
            vurusFarki: 2,
            hedefZirh: 0,
            netHasar: 0,
            kademe: '1 Ücretsiz Çağrı',
            aciklama: `${seciliHedef.ad} üzerinde taktiksel avantaj kuruldu. Sonraki saldırıda +2 Ücretsiz Çağrı hakkı kullanılabilir.`,
          });
          setDarbeEfekti(false);
          return;
        } else {
          // Moral & İlham Bonusu
          setSavascilar((prev) =>
            prev.map((s) => {
              if (s.id === seciliHedef.id) {
                return {
                  ...s,
                  ekstraVurusBonusu: (s.ekstraVurusBonusu || 0) + 2,
                  durumlar: s.durumlar.includes('Odaklanmış') ? s.durumlar : [...s.durumlar, 'Odaklanmış'],
                };
              }
              return s;
            })
          );
          const log = `✨ [Destek] ${aktifSavasci.ad} ➔ ${seciliHedef.ad}: Savaş narasıyla +2 İlham Bonusu aşıladı!`;
          setSavasGunlugu((prev) => [log, ...prev.slice(0, 30)]);
        }

        setSonZarCatismasi({
          eylemAdi: seciliEylem.baslik,
          eylemIkonu: seciliEylem.ikon,
          saldiranAd: aktifSavasci.ad,
          hedefAd: seciliHedef.ad,
          saldiriZarlari: [1, 0, 1, 0],
          saldiriZarToplami: 2,
          saldiranBonus,
          saldiriToplami: saldiranBonus + 2,
          savunmaZarlari: [0, 0, 0, 0],
          savunmaZarToplami: 0,
          savunmaBonus: 0,
          savunmaToplami: 0,
          vurusFarki: 2,
          hedefZirh: 0,
          netHasar: 0,
          kademe: seciliEylem.id === 'destek_sifa' ? '1 Can Yenilendi' : '+2 Vuruş Desteği',
          aciklama: `${aktifSavasci.ad} müttefiki ${seciliHedef.ad}'a taktiksel destek sağladı.`,
        });
        setDarbeEfekti(false);
        return;
      }

      // 3. SALDIRI & BÜYÜ EYLEMLERİ (Çatışma Zarı Atılır)
      sound.playBladeClash();

      // Durum Efektleri Modifikatörleri
      const saldiranDurumBonusu = calculateStatusDiceModifier(aktifSavasci.durumlar || []);
      const saldiranHasarBonusu = calculateStatusDamageModifier(aktifSavasci.durumlar || []);
      const savunanDurumSavunmaBonusu = calculateStatusDefenseModifier(seciliHedef.durumlar || []);

      // 4dF Saldırı Zarı (Attacker)
      const saldiriZarlari = zarAt4dF();
      const saldiriZarToplami = saldiriZarlari.reduce((a, b) => a + b, 0);
      const saldiriToplami = saldiriZarToplami + saldiranBonus + ekstraBonus + saldiranDurumBonusu;

      // 4dF Savunma Zarı (Defender)
      const savunmaZarlari = zarAt4dF();
      const savunmaZarToplami = savunmaZarlari.reduce((a, b) => a + b, 0);
      const savunmaToplami = Math.max(0, savunmaZarToplami + seciliHedef.savunmaBonus + savunanDurumSavunmaBonusu);

      // Eğer Yasak Rün Büyüsü ise ZIRH DELME uygula (Hedefin Zırhı = 0 sayılır!)
      const uygulananZirh = seciliEylem.id === 'buyu_run' ? 0 : seciliHedef.zirh;
      
      // Kural Motoruyla Hasar ve Yara Hesabı
      const hesap = saldiriHesapla(saldiriToplami, savunmaToplami, uygulananZirh);

      // Ağır Ezici Darbe veya durum hasar bonusu varsa ekle
      let nihaiHasar = hesap.netHasar;
      if (seciliEylem.id === 'saldiri_agir' && nihaiHasar > 0) {
        nihaiHasar += 2;
      }
      if (saldiranHasarBonusu > 0 && nihaiHasar > 0) {
        nihaiHasar += saldiranHasarBonusu;
      }

      const durumEkMetin = `${saldiranDurumBonusu !== 0 ? ` [Saldıran Durumu: ${saldiranDurumBonusu > 0 ? `+${saldiranDurumBonusu}` : saldiranDurumBonusu}]` : ''}${savunanDurumSavunmaBonusu !== 0 ? ` [Savunan Durumu: ${savunanDurumSavunmaBonusu > 0 ? `+${savunanDurumSavunmaBonusu}` : savunanDurumSavunmaBonusu} Sav]` : ''}`;

      const yeniCatisma = {
        eylemAdi: seciliEylem.baslik,
        eylemIkonu: seciliEylem.ikon,
        saldiranAd: aktifSavasci.ad,
        hedefAd: seciliHedef.ad,
        saldiriZarlari,
        saldiriZarToplami,
        saldiranBonus: saldiranBonus + ekstraBonus + saldiranDurumBonusu,
        saldiriToplami,
        savunmaZarlari,
        savunmaZarToplami,
        savunmaBonus: seciliHedef.savunmaBonus + savunanDurumSavunmaBonusu,
        savunmaToplami,
        vurusFarki: hesap.vurusFarki,
        hedefZirh: uygulananZirh,
        netHasar: nihaiHasar,
        kademe: hesap.onerilenYaraKademesi,
        aciklama: seciliEylem.id === 'buyu_run'
          ? `${hesap.aciklama} (🔮 Rün Dokuması Hedefin Zırhını Deldi!)${durumEkMetin}`
          : seciliEylem.id === 'saldiri_agir' && nihaiHasar > 0
          ? `${hesap.aciklama} (💥 Ağır Darbe +2 Ekstra Hasar ekledi!)${durumEkMetin}`
          : `${hesap.aciklama}${durumEkMetin}`,
      };

      setSonZarCatismasi(yeniCatisma);
      setDarbeEfekti(false);

      // Hasar varsa hedefte yara kutusunu doldur
      if (nihaiHasar > 0) {
        setSavascilar((prev) =>
          prev.map((s) => {
            if (s.id === seciliHedef.id) {
              const yeniYara = Math.min(s.yaraKutulari, s.alinanYara + (nihaiHasar >= 4 ? 2 : 1));
              return { ...s, alinanYara: yeniYara };
            }
            if (s.id === aktifSavasci.id) {
              // Kullanılan ekstra vuruş bonusunu sıfırla
              return { ...s, ekstraVurusBonusu: 0 };
            }
            return s;
          })
        );
      }

      const log = `[Tur ${turSayaci}] ${seciliEylem.ikon} ${aktifSavasci.ad} ➔ ${seciliHedef.ad} (${seciliEylem.baslik}) | Saldırı: 4dF(${saldiriZarToplami >= 0 ? `+${saldiriZarToplami}` : saldiriZarToplami}) + ${saldiranBonus} = ${saldiriToplami} vs Savunma: 4dF(${savunmaZarToplami >= 0 ? `+${savunmaZarToplami}` : savunmaZarToplami}) + ${seciliHedef.savunmaBonus} = ${savunmaToplami} ➔ Net Hasar: ${nihaiHasar} (${hesap.onerilenYaraKademesi})`;
      setSavasGunlugu((prev) => [log, ...prev.slice(0, 30)]);

      if (nihaiHasar >= 4) {
        confetti({ particleCount: 35, spread: 65, origin: { y: 0.6 } });
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
    setSavascilar((prev) => prev.map((s) => ({ ...s, alinanYara: 0, yorgunluk: 0, ekstraVurusBonusu: 0 })));
    setSavasGunlugu(['⚔️ Meydan temizlendi, yeni muharebe düzeni alındı!']);
    sound.playSealStamp();
  };

  // Akıllı Taktiksel Tavsiye Motoru
  const getTaktikTavsiye = () => {
    if (!aktifSavasci || !seciliHedef) return null;
    const kalanCan = aktifSavasci.yaraKutulari - aktifSavasci.alinanYara;
    const hedefKalanCan = seciliHedef.yaraKutulari - seciliHedef.alinanYara;

    if (kalanCan <= 1) {
      return {
        metin: `${aktifSavasci.ad} kritik yaralı! 'Sahra Şifası' ile toparlan veya 'Kalkan Siperi' ile gardını al.`,
        eylemId: 'savunma_kalkan' as EylemTuruId,
        oncelik: 'kritik' as const,
      };
    }
    if (seciliHedef.zirh >= 2) {
      return {
        metin: `${seciliHedef.ad} kalın zırh kuşanmış (${seciliHedef.zirh} Zırh)! 'Yasak Rün Dokuması' (Zırh Deler) veya 'Gedik Aç' önerilir.`,
        eylemId: 'buyu_run' as EylemTuruId,
        oncelik: 'taktik' as const,
      };
    }
    if (hedefKalanCan <= 1) {
      return {
        metin: `${seciliHedef.ad} sendeliyor! 'Ağır Ezici Darbe' (+2 Hasar) ile düşmanı yere ser.`,
        eylemId: 'saldiri_agir' as EylemTuruId,
        oncelik: 'bitirici' as const,
      };
    }
    return {
      metin: `Standart temas: 'Yakın Dövüş Hamlesi' yapın veya 'Avantaj Yarat' ile sonraki vuruşa +2 bonus ekleyin.`,
      eylemId: 'saldiri_yakin' as EylemTuruId,
      oncelik: 'normal' as const,
    };
  };

  // Hızlı Tur Çözümleme (Auto-Resolve Round)
  const handleHizliTurCozumle = () => {
    sound.playWarDrums();
    confetti({ particleCount: 35, spread: 65 });

    const canliDostlar = savascilar.filter((s) => s.side === 'sol' && s.alinanYara < s.yaraKutulari);
    const canliDusmanlar = savascilar.filter((s) => s.side === 'sag' && s.alinanYara < s.yaraKutulari);

    if (canliDostlar.length === 0 || canliDusmanlar.length === 0) return;

    const logs: string[] = [`⚡ [HIZLI SİMÜLASYON] Tur #${turSayaci} otomatik çözümlendi:`];
    const yaraGuncellemeleri: Record<string, number> = {};

    // Dostların saldırısı
    canliDostlar.forEach((dost) => {
      const hedef = canliDusmanlar.find((d) => (yaraGuncellemeleri[d.id] ?? d.alinanYara) < d.yaraKutulari);
      if (!hedef) return;

      const dostZar = Math.floor(Math.random() * 5) - 2;
      const hedefZar = Math.floor(Math.random() * 5) - 2;
      const vurus = (dost.fightBonus || 2) + dostZar;
      const savunma = (hedef.savunmaBonus || 1) + hedefZar;
      const fark = vurus - savunma;
      const hasar = Math.max(0, fark - (hedef.zirh || 0));

      const mevcutYara = yaraGuncellemeleri[hedef.id] ?? hedef.alinanYara;
      if (hasar > 0) {
        const yeniYara = Math.min(hedef.yaraKutulari, mevcutYara + hasar);
        yaraGuncellemeleri[hedef.id] = yeniYara;
        logs.push(`🗡️ ${dost.ad} ➔ ${hedef.ad}: +${hasar} hasar! (${yeniYara}/${hedef.yaraKutulari})`);
      } else {
        logs.push(`🛡️ ${dost.ad} ➔ ${hedef.ad}: Saldırı savuşturuldu.`);
      }
    });

    // Düşmanların karşı saldırısı
    canliDusmanlar.forEach((dusman) => {
      const dusmanYara = yaraGuncellemeleri[dusman.id] ?? dusman.alinanYara;
      if (dusmanYara >= dusman.yaraKutulari) return;

      const dostHedef = canliDostlar.find((d) => (yaraGuncellemeleri[d.id] ?? d.alinanYara) < d.yaraKutulari);
      if (!dostHedef) return;

      const dZar = Math.floor(Math.random() * 5) - 2;
      const sZar = Math.floor(Math.random() * 5) - 2;
      const vurus = (dusman.fightBonus || 1) + dZar;
      const savunma = (dostHedef.savunmaBonus || 2) + sZar;
      const fark = vurus - savunma;
      const hasar = Math.max(0, fark - (dostHedef.zirh || 0));

      const mevcutDostYara = yaraGuncellemeleri[dostHedef.id] ?? dostHedef.alinanYara;
      if (hasar > 0) {
        const yeniYara = Math.min(dostHedef.yaraKutulari, mevcutDostYara + hasar);
        yaraGuncellemeleri[dostHedef.id] = yeniYara;
        logs.push(`🩸 ${dusman.ad} ➔ ${dostHedef.ad}: Karşı saldırı +${hasar} hasar! (${yeniYara}/${dostHedef.yaraKutulari})`);
      }
    });

    setSavascilar((prev) =>
      prev.map((s) => ({
        ...s,
        alinanYara: yaraGuncellemeleri[s.id] !== undefined ? yaraGuncellemeleri[s.id] : s.alinanYara,
      }))
    );

    setTurSayaci((prev) => prev + 1);
    setSavasGunlugu((prev) => [...logs, ...prev.slice(0, 30)]);
  };

  // Klavye Kısayolları (Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      const isMyTurnKey = rol === 'Oyuncu' ? aktifSavasci?.id === aktifKarakter?.id : true;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isMyTurnKey) {
          handleEylemGerceklestir();
        }
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleSonrakiSira();
      } else if (e.key === '1') {
        const eylem = EYLEM_LISTESI.find((x) => x.id === 'saldiri_yakin');
        if (eylem) handleEylemSec(eylem);
      } else if (e.key === '2') {
        const eylem = EYLEM_LISTESI.find((x) => x.id === 'saldiri_agir');
        if (eylem) handleEylemSec(eylem);
      } else if (e.key === '3') {
        const eylem = EYLEM_LISTESI.find((x) => x.id === 'savunma_kalkan');
        if (eylem) handleEylemSec(eylem);
      } else if (e.key === '4') {
        const eylem = EYLEM_LISTESI.find((x) => x.id === 'destek_sifa');
        if (eylem) handleEylemSec(eylem);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const canliDusmanlar = sagKanat.filter((d) => d.alinanYara < d.yaraKutulari);
        if (canliDusmanlar.length > 0) {
          const curIdx = canliDusmanlar.findIndex((d) => d.id === seciliHedefId);
          const nextTarget = canliDusmanlar[(curIdx + 1) % canliDusmanlar.length];
          setSeciliHedefId(nextTarget.id);
          sound.playSealStamp();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aktifSavasci, seciliHedef, seciliEylem, sagKanat, siraIndex, darbeEfekti]);

  // Filtrelenmiş Eylem Listesi
  const filtrelenmisEylemler = seciliEylemKategorisi === 'Tümü'
    ? EYLEM_LISTESI
    : EYLEM_LISTESI.filter((e) => e.kategori === seciliEylemKategorisi);

  const { bonus: guncelBonus, isim: guncelBonusIsim } = getAktifSavasciEylemBonusu(seciliEylem.id);

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
              Sol: <strong>Karakterlerimiz</strong> | Sağ: <strong>Düşmanlar</strong> • Saldırı, Savunma, Büyü ve Destek türleri
            </p>
          </div>
        </div>

        {/* Eylem Butonları */}
        <div className="flex items-center gap-2 flex-wrap">
          {rol === 'Anlatıcı' && (
            <button
              onClick={() => setYerlestirModalAcik(true)}
              className="px-3 py-1.5 rounded bg-[#2b1f15] hover:bg-[#3d2c1e] text-amber-200 text-xs font-heading font-bold border border-[#523d2b] flex items-center gap-1.5 shadow"
              title="GM: Yeni savaşçı veya canavar yerleştir"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>Karakter / Düşman Yerleştir</span>
            </button>
          )}

          <button
            onClick={handleCepheZariAtisi}
            className="px-3 py-1.5 rounded bg-[#3f1919] hover:bg-[#582121] text-red-200 text-xs font-heading font-bold border border-red-800 flex items-center gap-1.5 shadow"
            title="Kitlesel birlik savaşı için Rion vs Garion zarı"
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Cephe Zarı</span>
          </button>

          <button
            onClick={handleLomeraBarisi}
            className={`px-3 py-1.5 rounded text-xs font-heading font-bold border flex items-center gap-1.5 shadow transition-all ${
              delloModu
                ? 'bg-purple-900 border-purple-400 text-purple-200 ring-2 ring-purple-400 animate-pulse'
                : 'bg-[#2b1f15] hover:bg-[#3d2c1e] text-purple-300 border-purple-900/60'
            }`}
            title="Mabed rahibi kireçle Denge Çemberi çizer; toplu savaşı durdurup Dello düellosuna geçirir."
          >
            <span>🕊️ Lomera Barışı {delloModu ? '(Dello Aktif)' : ''}</span>
          </button>

          {/* Hız Kontrolü (1x / 2x / 3x) */}
          <div className="flex items-center rounded-lg bg-[#18110b] border border-[#443322] p-0.5 text-xs shadow-inner">
            <span className="text-[10px] font-mono text-stone-400 px-1.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Hız:</span>
            </span>
            {(['1x', '2x', '3x'] as const).map((hiz) => (
              <button
                key={hiz}
                onClick={() => setSavasHizi(hiz)}
                className={`px-2 py-1 rounded font-mono font-bold text-[10px] transition-all ${
                  savasHizi === hiz
                    ? 'bg-amber-600 text-stone-950 font-black shadow'
                    : 'text-stone-400 hover:text-amber-200'
                }`}
                title={`Dövüş animasyon hızı: ${hiz}`}
              >
                {hiz}
              </button>
            ))}
          </div>

          {/* Hızlı Tur Çözümle (Auto-Resolve) */}
          <button
            onClick={handleHizliTurCozumle}
            className="px-3 py-1.5 rounded bg-amber-900/40 hover:bg-amber-800/60 text-amber-200 text-xs font-heading font-bold border border-amber-700/60 flex items-center gap-1.5 shadow active:scale-95 transition-all"
            title="Mevcut turun karşılıklı darbelerini Fate kurallarıyla tek tıkla otomatik sonuçlandırır"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-400" />
            <span>Hızlı Tur Çöz</span>
          </button>

          {/* Sade / Detaylı Mod */}
          <button
            onClick={() => setSadeArayuz((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded text-xs font-heading font-bold border flex items-center gap-1 shadow transition-all ${
              sadeArayuz
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200'
                : 'bg-[#221a14] border-[#443322] text-stone-300 hover:text-white'
            }`}
            title="Arayüzdeki kalabalık açıklamaları gizleyip sade ve hızlı taktik görünümüne geçer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>{sadeArayuz ? 'Sade Mod' : 'Standart'}</span>
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

      {/* Düşman, Canavar & 4v4 Ekip Hızlı Seçici Bar */}
      {!sadeArayuz && (
        <div className="space-y-1.5 animate-in fade-in">
        {/* Satır 1: Hazır 4v4 Ekipler & Rastgele Üreticiler */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          <span className="text-[11px] font-heading font-black text-amber-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 px-2.5 py-1 bg-amber-950/80 rounded border border-amber-800 shadow">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>4v4 Hazır Sürüler:</span>
          </span>
          {HAZIR_DUSMAN_GRUPLARI.map((grup) => (
            <button
              key={grup.id}
              onClick={() => handleDusmanGrubuSec(grup)}
              className="px-2.5 py-1 rounded bg-[#261611] hover:bg-[#3d2015] text-amber-200 hover:text-white border border-[#522d1d] text-xs font-bold whitespace-nowrap transition-all shadow flex items-center gap-1 active:scale-95"
              title={`${grup.aciklama} (${grup.dusmanlar.length} Düşman)`}
            >
              <span>{grup.ad.split('(')[0]}</span>
              <span className="text-[9px] text-amber-400 font-mono">({grup.dusmanlar.length}x)</span>
            </button>
          ))}
          <button
            onClick={() => handleRastgeleCanavarSpawn('Canavar')}
            className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 text-xs font-bold whitespace-nowrap transition-all shadow flex items-center gap-1 active:scale-95"
            title="Savaş alanına rastgele bir Canavar çağır"
          >
            <Skull className="w-3.5 h-3.5 text-purple-400" />
            <span>+ Rastgele Canavar</span>
          </button>
          <button
            onClick={() => handleRastgeleCanavarSpawn('Vahşi Hayvan')}
            className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 text-xs font-bold whitespace-nowrap transition-all shadow flex items-center gap-1 active:scale-95"
            title="Savaş alanına rastgele bir Vahşi Hayvan çağır"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Rastgele Hayvan</span>
          </button>
        </div>

        {/* Satır 2: Tekil Canavar & Boss Çağırma */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          <span className="text-[11px] font-heading font-black text-red-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 px-2.5 py-1 bg-red-950/80 rounded border border-red-800 shadow">
            <Skull className="w-3.5 h-3.5 text-red-400" />
            <span>Tekil Çağır:</span>
          </span>
          {CANAVARLAR_VE_YARATIKLAR.slice(0, 5).map((canavar) => (
            <button
              key={canavar.id}
              onClick={() => handleDusmanNpcEkle(canavar)}
              className="px-2 py-0.5 rounded bg-[#1e131b] hover:bg-[#341b30] text-purple-200 border border-purple-900/80 text-[11px] font-bold whitespace-nowrap transition-all shadow flex items-center gap-1"
              title={canavar.anaKavram}
            >
              <span>👹 {canavar.ad.split('(')[0]}</span>
              <span className="text-[9px] text-purple-400 font-mono">({canavar.tehdit})</span>
            </button>
          ))}
          {VAHSI_HAYVANLAR.slice(0, 4).map((hayvan) => (
            <button
              key={hayvan.id}
              onClick={() => handleDusmanNpcEkle(hayvan)}
              className="px-2 py-0.5 rounded bg-[#111e15] hover:bg-[#1b3422] text-emerald-200 border border-emerald-900/80 text-[11px] font-bold whitespace-nowrap transition-all shadow flex items-center gap-1"
              title={hayvan.anaKavram}
            >
              <span>🐺 {hayvan.ad.split('(')[0]}</span>
              <span className="text-[9px] text-emerald-400 font-mono">({hayvan.tehdit})</span>
            </button>
          ))}
          {npcler
            .filter((n) => n.tehdit === 'Ölümcül')
            .slice(0, 4)
            .map((boss) => (
              <button
                key={boss.id}
                onClick={() => handleBossSec(boss)}
                className="px-2 py-0.5 rounded bg-[#201511] hover:bg-[#341e17] text-stone-300 hover:text-amber-200 border border-[#482e22] text-[11px] font-bold whitespace-nowrap transition-all shadow flex items-center gap-1"
                title={boss.anaKavram}
              >
                <span>👑 {boss.ad.split('(')[0]}</span>
                <span className="text-[9px] text-red-400 font-mono">({boss.tehdit})</span>
              </button>
            ))}
        </div>
      </div>
      )}

      {/* 4v4 Taktiksel Zemin & Meydan Durumları (Aspects) */}
      <div className="p-2.5 rounded-xl bg-[#130d09] border border-amber-900/60 shadow flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1 flex-shrink-0 pl-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Taktiksel Zemin:</span>
        </span>
        {[
          { id: '🔥 Alevli Yağ Barikatı (+2 Saldırı)', icon: '🔥', desc: 'Ateşe verilen yağ hendeği; yakın vuruşlara +2 hasar, geçene 1 yanma hasarı verir.' },
          { id: '🛡️ Yıkılmış Sütun (Siper)', icon: '🛡️', desc: 'Menzilli oklara ve büyülere karşı +2 Siper Savunması sağlar.' },
          { id: '🌫️ Zehirli Sis Bulutu', icon: '🌫️', desc: 'Görüşü engeller; gizliliğe +2, içeride nefes alanlara CON kontrolü uygular.' },
          { id: '🩸 Kaygan Kan Zemini', icon: '🩸', desc: 'Zemin aşırı kaygandır; hücum edenler DEX denge testi yapmalıdır.' },
          { id: '⚡ Çatlayan Rün Mührü', icon: '⚡', desc: 'Kadim mühür yarılmıştır; rün büyüsü hasarını iki katına çıkarır.' },
        ].map((zemin) => {
          const isAct = taktikZeminler.includes(zemin.id);
          return (
            <button
              key={zemin.id}
              onClick={() => handleTaktikZeminToggle(zemin.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-serif whitespace-nowrap transition-all flex items-center gap-1 border shadow-sm ${
                isAct
                  ? 'bg-amber-900/90 text-amber-200 border-amber-400 ring-1 ring-amber-400 font-bold'
                  : 'bg-[#1e140d] text-stone-400 hover:text-stone-200 border-[#3d2a1a]'
              }`}
              title={zemin.desc}
            >
              <span>{zemin.id}</span>
              {isAct && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            </button>
          );
        })}
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
          SOL (Karakterler/Müttefikler) | ORTA (Eylem Seçici & Düello Masası) | SAĞ (Düşmanlar/Canavarlar) */}
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
                    // Eğer seçili eylem Destek ise veya düşman sırasıysa hedef seçilebilir
                    if (seciliEylem.hedefTuru === 'Dost' || aktifSavasci?.side === 'sag') {
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
                      <span>HEDEF (DOST)</span>
                    </div>
                  )}

                  {/* KART GÖVDESİ: BÜYÜK FOTOĞRAF + BİLGİLER */}
                  <div className="flex gap-3">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-amber-600/70 bg-black shadow-lg flex-shrink-0 relative group">
                      <img
                        src={s.fotoUrl || DEFAULT_AVATARS.Oyuncu}
                        alt={s.ad}
                        className="w-full h-full object-cover sepia-[0.15] group-hover:scale-105 transition-transform duration-300"
                      />
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

                  {/* Alt Durumlar & Efektler */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mt-2 pt-1 border-t border-[#312316] text-[10px]">
                    <div className="flex flex-wrap items-center gap-1">
                      {s.durumlar.map((d, idx) => {
                        const efekt = getStatusEffect(d);
                        return (
                          <span
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDurumToggle(s.id, d);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border cursor-pointer hover:opacity-80 transition-all flex items-center gap-1 ${
                              efekt ? efekt.sinif : 'bg-[#271d15] text-amber-200 border-[#443322]'
                            }`}
                            title={efekt ? `${efekt.ad}: ${efekt.aciklama} (Kaldırmak için tıkla)` : `${d} (Kaldırmak için tıkla)`}
                          >
                            <span>{efekt ? efekt.ikon : '🔸'}</span>
                            <span>{d}</span>
                            {efekt && efekt.zarBonusu !== 0 && (
                              <span className="font-mono text-[8px] opacity-90">
                                ({efekt.zarBonusu > 0 ? `+${efekt.zarBonusu}` : efekt.zarBonusu} Zar)
                              </span>
                            )}
                          </span>
                        );
                      })}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playSealStamp();
                          setDurumModalSavasciId(s.id);
                        }}
                        className="px-1.5 py-0.5 rounded bg-[#1c140e] hover:bg-[#342417] text-amber-400 border border-dashed border-[#5a422a] text-[9px] font-bold flex items-center gap-0.5 transition-colors"
                        title="Durum Efekti Ekle / Kaldır"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Durum</span>
                      </button>
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

        {/* ORTA KORİDOR: SALDIRI / SAVUNMA / BÜYÜ / DESTEK SEÇİCİ & DÜELLO MASASI (4 cols) */}
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
                    Sırada
                  </span>
                </div>
                <div className="font-heading font-black text-xs text-[#f6efe6] truncate max-w-[100px]">
                  {aktifSavasci?.ad}
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold">
                  +{guncelBonus} {guncelBonusIsim}
                </span>
              </div>

              {/* Ortadaki VS Çarpışma Rozeti */}
              <div className="flex flex-col items-center justify-center px-1">
                <div className="w-9 h-9 rounded-full bg-red-950 border-2 border-red-700 flex items-center justify-center text-red-200 shadow-xl font-heading font-black text-xs animate-pulse">
                  {seciliEylem.ikon}
                </div>
                <span className="text-[8px] font-mono text-amber-300 uppercase mt-1">
                  {seciliEylem.kategori}
                </span>
              </div>

              {/* Hedef Portresi */}
              <div className="flex flex-col items-center text-center space-y-1 flex-1">
                <div className="relative w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-cyan-400 ring-2 ring-cyan-400/60 shadow-xl">
                  <img
                    src={seciliHedef?.fotoUrl || DEFAULT_AVATARS[seciliHedef?.tur || 'Düşman']}
                    alt={seciliHedef?.ad || 'Hedef'}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-black/85 text-[8px] font-bold text-cyan-300">
                    {seciliEylem.hedefTuru === 'Dost' ? 'Müttefik' : 'Hedef'}
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

            {/* SALDIRI / SAVUNMA / BÜYÜ / DESTEK SEÇİCİ BÖLÜMÜ */}
            <div className="bg-[#15100c] p-2.5 rounded-xl border border-[#443323] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Eylem &amp; Saldırı Türü Seçimi:</span>
                </span>
                <span className="text-[9px] text-[#9a8976] font-mono">
                  {seciliEylem.hedefTuru === 'Dusman' ? 'Hedef: Düşman' : seciliEylem.hedefTuru === 'Dost' ? 'Hedef: Müttefik' : 'Hedef: Kendisi'}
                </span>
              </div>

              {/* Kategori Filtre Butonları */}
              <div className="grid grid-cols-4 gap-1">
                {(['Tümü', 'Saldırı', 'Savunma', 'Büyü', 'Destek'] as const).map((kat) => {
                  if (kat === 'Tümü') return null;
                  const isSecili = seciliEylemKategorisi === kat;
                  return (
                    <button
                      key={kat}
                      onClick={() => setSeciliEylemKategorisi(kat)}
                      className={`py-1 rounded text-[10px] font-heading font-bold transition-all border ${
                        isSecili
                          ? kat === 'Saldırı'
                            ? 'bg-red-950/90 text-red-200 border-red-600 shadow'
                            : kat === 'Savunma'
                            ? 'bg-blue-950/90 text-cyan-200 border-cyan-600 shadow'
                            : kat === 'Büyü'
                            ? 'bg-purple-950/90 text-purple-200 border-purple-600 shadow'
                            : 'bg-emerald-950/90 text-emerald-200 border-emerald-600 shadow'
                          : 'bg-[#1e1711] text-[#93826e] border-[#382b1d] hover:text-[#e4d8c6]'
                      }`}
                    >
                      {kat === 'Saldırı' ? '🗡️ Saldırı' : kat === 'Savunma' ? '🛡️ Savunma' : kat === 'Büyü' ? '🔮 Büyü' : '✨ Destek'}
                    </button>
                  );
                })}
              </div>

              {/* Eylem Kartları Seçim Listesi */}
              <div className="space-y-1 max-h-36 overflow-y-auto pr-0.5">
                {filtrelenmisEylemler.map((e) => {
                  const isSelected = seciliEylemId === e.id;
                  const bonusInfo = getAktifSavasciEylemBonusu(e.id);

                  return (
                    <div
                      key={e.id}
                      onClick={() => handleEylemSec(e)}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'bg-[#2b1c11] border-amber-400 text-amber-200 ring-1 ring-amber-400'
                          : 'bg-[#1b1510] border-[#35271a] text-[#b8a794] hover:border-[#523d2b]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-sm">{e.ikon}</span>
                        <div>
                          <div className="font-heading font-bold text-[11px] leading-none text-[#f5ebd7]">
                            {e.baslik}
                          </div>
                          {!sadeArayuz && (
                            <div className="text-[9px] text-[#867563] truncate max-w-[200px] mt-0.5">
                              {e.aciklama}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="font-mono text-[10px] font-bold text-amber-400 flex-shrink-0 ml-1">
                        +{bonusInfo.bonus} {bonusInfo.isim}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FATE MÜHÜR & GÖRÜNÜŞ ÇAĞIRMA (INVOKE / COMPEL PANEL) */}
            <div className="p-2.5 rounded-xl bg-[#1a130e] border border-amber-900/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Kader Mührü &amp; Görünüş Çağır (Invoke)</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  {aktifKarakter.sayaclar.muhur} Mühür Mevcut
                </span>
              </div>

              {/* Sahne Görünüşleri (Free Invokes) */}
              <div className="space-y-1">
                <span className="text-[9px] text-[#93826e] uppercase font-mono block">
                  Taktik Sahne Görünüşleri:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sahneGorunusleri.map((sc) => (
                    <div
                      key={sc.id}
                      className="px-2 py-0.5 rounded bg-[#271d15] border border-[#523d2b] text-[10px] flex items-center gap-1.5"
                    >
                      <span className="text-[#f5ebd7] font-serif">{sc.ad}</span>
                      {sc.ucretsizCagri > 0 ? (
                        <button
                          onClick={() => handleUcretsizCagriKullan(sc.id)}
                          className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-bold text-[8px] hover:bg-amber-300"
                          title="Ücretsiz Çağrı Kullanarak +2 Vuruş Kazan"
                        >
                          +2 Ücretsiz Kullan ({sc.ucretsizCagri})
                        </button>
                      ) : (
                        <span className="text-[8px] text-[#715c48] font-mono">(Kullanıldı)</span>
                      )}
                    </div>
                  ))}
                  {ucretsizBonusKullan > 0 && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-700 animate-pulse">
                      +{ucretsizBonusKullan} Ücretsiz Bonus Hazır!
                    </span>
                  )}
                </div>
              </div>

              {/* Mühür Harca Butonları (Eğer son vuruş varsa) */}
              {sonZarCatismasi && aktifSavasci.side === 'sol' && (
                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#352618]">
                  <button
                    onClick={handleMuhurArti2Vurus}
                    disabled={aktifKarakter.sayaclar.muhur <= 0}
                    className="py-1.5 px-2 rounded wax-seal text-white font-heading font-bold text-[10px] flex items-center justify-center gap-1 disabled:opacity-40 shadow"
                    title="1 Mühür harcayarak vuruşa +2 net hasar ekle"
                  >
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>+2 Hasar Çağır (1 Mühür)</span>
                  </button>

                  <button
                    onClick={handleMuhurReroll}
                    disabled={aktifKarakter.sayaclar.muhur <= 0}
                    className="py-1.5 px-2 rounded bg-[#2b1f15] hover:bg-[#3d2c1e] text-[#f0e4d3] border border-[#5f462e] font-heading font-bold text-[10px] flex items-center justify-center gap-1 disabled:opacity-40 shadow"
                    title="1 Mühür harcayarak zarları baştan at"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Tekrar At (1 Mühür)</span>
                  </button>
                </div>
              )}

              {/* Dert Zorlaması (Compel) */}
              <div className="pt-1 border-t border-[#352618] flex items-center justify-between">
                <span className="text-[9px] text-red-300 italic truncate max-w-[190px]">
                  Dert: &quot;{aktifKarakter.gorunumler.dert}&quot;
                </span>
                <button
                  onClick={handleCompelDert}
                  className="px-2 py-0.5 rounded bg-[#3b1919] hover:bg-[#522020] text-red-200 border border-red-700 text-[9px] font-bold shadow flex items-center gap-1"
                  title="Dert'i aleyhe işleterek +1 Mühür kazan"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-300" />
                  <span>Dert Zorla (+1 Mühür)</span>
                </button>
              </div>
            </div>

            {/* SABİT EŞİK VE GEDİK AÇMA ASİSTANI */}
            {(() => {
              const hedefNpc = npcler.find((n) => n.id === seciliHedefId);
              const hedefOlcek = hedefNpc?.olcek || (seciliHedef?.ad.includes('Vezir') ? 8 : seciliHedef?.ad.includes('Vali') ? 6 : seciliHedef?.ad.includes('Kral') ? 8 : 4);
              const karakterOlcek = aktifKarakter.olcek || 2;
              const olcekFarki = hedefOlcek - karakterOlcek;
              const gedikVarMi = sahneGorunusleri.some((sc) => sc.ad.toLowerCase().includes('gedik'));
              const sabitEsikEngelliyor = olcekFarki >= 3 && !gedikVarMi && seciliEylem.kategori === 'Saldırı';

              if (!sabitEsikEngelliyor) return null;

              return (
                <div className="p-3 rounded-xl bg-red-950/80 border-2 border-red-600 text-red-200 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-heading font-black">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>🛑 SABİT EŞİK KURALI DEVREDE! (Ölçek Farkı: {olcekFarki})</span>
                  </div>
                  <p className="text-[11px] font-serif leading-relaxed text-[#ded1be]">
                    Hedefin toplumsal ağırlığı ({hedefOlcek}. Basamak) senin ölçeğinden ({karakterOlcek}) çok yüksek olduğu için doğrudan Saldırı yapılamaz! Önce Ver-ed veya Lodvez ile sahneye bir Gedik açmalısın.
                  </p>
                  <button
                    onClick={handleGedikAc}
                    className="w-full py-2 px-3 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-heading font-black text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-stone-950" />
                    <span>⚡ Gedik Aç (Ver-ed / Lodvez ile Avantaj Yarat)</span>
                  </button>
                </div>
              );
            })()}

            {/* AKILLI TAKTİKSEL TAVSİYE PANELİ */}
            {(() => {
              const tavsiye = getTaktikTavsiye();
              if (!tavsiye) return null;
              const onerilenEylem = EYLEM_LISTESI.find((e) => e.id === tavsiye.eylemId);

              return (
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 shadow-inner ${
                    tavsiye.oncelik === 'kritik'
                      ? 'bg-red-950/60 border-red-700/80 text-red-200'
                      : tavsiye.oncelik === 'bitirici'
                      ? 'bg-amber-950/70 border-amber-600/80 text-amber-200'
                      : 'bg-[#1e1711] border-[#503a27] text-amber-100/90'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                    <div className="text-xs font-serif leading-tight">
                      <span className="font-heading font-black text-amber-300 mr-1.5 uppercase tracking-wide text-[10px]">
                        Taktik Rehber:
                      </span>
                      <span>{tavsiye.metin}</span>
                    </div>
                  </div>

                  {onerilenEylem && seciliEylemId !== tavsiye.eylemId && (
                    <button
                      onClick={() => handleEylemSec(onerilenEylem)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-heading font-black text-[11px] whitespace-nowrap shadow flex-shrink-0 active:scale-95 transition-all"
                    >
                      {onerilenEylem.ikon} Seç
                    </button>
                  )}
                </div>
              );
            })()}

            {/* OYUNCU / GM ROL DURUMU BİLDİRİMİ */}
            {(() => {
              const isMyTurn = rol === 'Oyuncu' ? aktifSavasci?.id === aktifKarakter?.id : true;
              if (rol !== 'Oyuncu') return null;

              if (isMyTurn) {
                return (
                  <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-600/80 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-pulse">
                    <span className="text-lg">🎯</span>
                    <div>
                      <div className="font-heading font-black text-emerald-300 text-xs">
                        SENİN HAMLE SIRAN! ({aktifKarakter.ad})
                      </div>
                      <div className="text-[10px] text-emerald-200/90">
                        Kendi karakterinin eylemini ve hedefini belirle, ardından uygula.
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⏳</span>
                    <div>
                      <div className="font-heading font-black text-amber-300 text-xs">
                        Sıra {aktifSavasci?.ad}&apos;de {aktifSavasci?.side === 'sag' ? '(Düşman)' : '(Yoldaş)'}
                      </div>
                      <div className="text-[10px] text-stone-300">
                        Sen kendi karakterini ({aktifKarakter.ad}) yönetiyorsun. Sıranın sana gelmesini bekle.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSonrakiSira}
                    className="px-2.5 py-1 rounded bg-[#2b1e15] hover:bg-[#3d2b1e] text-amber-300 border border-[#5a3f28] text-[10px] font-bold whitespace-nowrap"
                    title="Sıradaki savaşçıya geç"
                  >
                    Sıradakine Geç ➔
                  </button>
                </div>
              );
            })()}

            {/* Eylemi Uygula Butonu */}
            {(() => {
              const isMyTurn = rol === 'Oyuncu' ? aktifSavasci?.id === aktifKarakter?.id : true;
              return (
                <button
                  onClick={handleEylemGerceklestir}
                  disabled={darbeEfekti || !seciliHedefId || (rol === 'Oyuncu' && !isMyTurn)}
                  className={`w-full py-3 px-4 rounded-xl wax-seal text-white font-heading font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 ${
                    darbeEfekti ? 'animate-pulse' : ''
                  } ${rol === 'Oyuncu' && !isMyTurn ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Swords className="w-4 h-4 text-amber-300" />
                  <span>
                    {darbeEfekti
                      ? 'Zarlar Çarpışıyor...'
                      : rol === 'Oyuncu' && !isMyTurn
                      ? `⏳ ${aktifSavasci?.ad.toUpperCase()} HAMLESİ BEKLENİYOR`
                      : `${seciliEylem.ikon} ${seciliEylem.baslik.toUpperCase()} UYGULA (4dF + ${guncelBonus})`}
                  </span>
                </button>
              );
            })()}

            {/* Hızlı Kısayol İpuçları */}
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 px-1 pt-0.5">
              <span>[Space: Hamle] [1-4: Eylem] [N: Sıradaki] [Tab: Hedef]</span>
              <span className="text-amber-400 font-bold">{savasHizi} Hız</span>
            </div>

            {/* ZAR DURUMU & NİHAİ VURUŞ AYRINTISI */}
            {sonZarCatismasi && (
              <div className="p-3 rounded-lg bg-[#140f0c] border border-[#523d2b] space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between text-xs border-b border-[#2d2015] pb-1">
                  <span className="font-heading font-bold text-amber-300 flex items-center gap-1.5">
                    <span>{sonZarCatismasi.eylemIkonu}</span>
                    <span>{sonZarCatismasi.eylemAdi}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      sonZarCatismasi.netHasar > 0
                        ? 'bg-red-950 text-red-200 border border-red-700'
                        : 'bg-stone-900 text-stone-300'
                    }`}
                  >
                    {sonZarCatismasi.kademe}
                  </span>
                </div>

                {/* Saldırı / Eylem Zarı Durumu */}
                <div className="text-[11px] font-mono flex items-center justify-between bg-[#1d1611] p-1.5 rounded">
                  <span className="text-[#a49684]">
                    Hamle ({sonZarCatismasi.saldiranAd}):
                  </span>
                  <span className="text-amber-300 font-bold">
                    4dF({sonZarCatismasi.saldiriZarToplami >= 0 ? `+${sonZarCatismasi.saldiriZarToplami}` : sonZarCatismasi.saldiriZarToplami}) + {sonZarCatismasi.saldiranBonus} = {sonZarCatismasi.saldiriToplami}
                  </span>
                </div>

                {/* Savunma Zarı Durumu (Eğer varsa) */}
                {sonZarCatismasi.savunmaToplami > 0 && (
                  <div className="text-[11px] font-mono flex items-center justify-between bg-[#161d18] p-1.5 rounded">
                    <span className="text-emerald-300/80">
                      Savunma ({sonZarCatismasi.hedefAd}):
                    </span>
                    <span className="text-emerald-300 font-bold">
                      4dF({sonZarCatismasi.savunmaZarToplami >= 0 ? `+${sonZarCatismasi.savunmaZarToplami}` : sonZarCatismasi.savunmaZarToplami}) + {sonZarCatismasi.savunmaBonus} = {sonZarCatismasi.savunmaToplami}
                    </span>
                  </div>
                )}

                {/* Vuruş Farkı & Açıklama */}
                <div className="text-[11px] text-[#baa997] font-serif pt-1">
                  {sonZarCatismasi.netHasar > 0 ? (
                    <div>
                      Vuruş Farkı: <strong>{sonZarCatismasi.vurusFarki}</strong> &minus; Zırh: <strong>{sonZarCatismasi.hedefZirh}</strong> ➔ Net Hasar:{' '}
                      <strong className="text-red-400 font-bold">{sonZarCatismasi.netHasar}</strong>
                    </div>
                  ) : null}
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
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 border-red-700/80 bg-black shadow-lg flex-shrink-0 relative group">
                      <img
                        src={s.fotoUrl || DEFAULT_AVATARS.Düşman}
                        alt={s.ad}
                        className="w-full h-full object-cover sepia-[0.2] group-hover:scale-105 transition-transform duration-300"
                      />
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

                  {/* Düşman Durum Efektleri */}
                  <div className="flex flex-wrap items-center justify-between gap-1 mt-2 pt-1 border-t border-[#3b2323] text-[10px]">
                    <div className="flex flex-wrap items-center gap-1">
                      {s.durumlar.map((d, idx) => {
                        const efekt = getStatusEffect(d);
                        return (
                          <span
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDurumToggle(s.id, d);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border cursor-pointer hover:opacity-80 transition-all flex items-center gap-1 ${
                              efekt ? efekt.sinif : 'bg-[#291717] text-red-200 border-[#532626]'
                            }`}
                            title={efekt ? `${efekt.ad}: ${efekt.aciklama} (Kaldırmak için tıkla)` : `${d} (Kaldırmak için tıkla)`}
                          >
                            <span>{efekt ? efekt.ikon : '🔸'}</span>
                            <span>{d}</span>
                            {efekt && efekt.zarBonusu !== 0 && (
                              <span className="font-mono text-[8px] opacity-90">
                                ({efekt.zarBonusu > 0 ? `+${efekt.zarBonusu}` : efekt.zarBonusu} Zar)
                              </span>
                            )}
                          </span>
                        );
                      })}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playSealStamp();
                          setDurumModalSavasciId(s.id);
                        }}
                        className="px-1.5 py-0.5 rounded bg-[#201010] hover:bg-[#381a1a] text-red-400 border border-dashed border-[#682e2e] text-[9px] font-bold flex items-center gap-0.5 transition-colors"
                        title="Düşmana Durum Efekti Ekle / Kaldır"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Durum</span>
                      </button>
                    </div>

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

                  {/* Alt Özel Davranış */}
                  <div className="mt-1 text-[9px] text-[#baa696] italic line-clamp-1">
                    {s.ozelDavranis || 'Temel saldırı hamlesi'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KARAKTER & DÜŞMAN YERLEŞTİRME MODALI */}
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

              {/* Sağ Kanat İçin Düşman & Canavar Seçici */}
              <div className="bg-[#1e1313] p-3 rounded-xl border border-red-950 space-y-2">
                <div className="flex items-center justify-between border-b border-[#3b2323] pb-1">
                  <span className="font-heading font-bold text-red-400 block text-xs">
                    2. Sağ Kanat (Düşmanlar, Canavarlar &amp; Hayvanlar)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRastgeleCanavarSpawn('Canavar')}
                      className="px-2 py-0.5 rounded bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700 text-[10px] font-bold"
                      title="Rastgele yeni bir Canavar üret"
                    >
                      + Canavar
                    </button>
                    <button
                      onClick={() => handleRastgeleCanavarSpawn('Vahşi Hayvan')}
                      className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 text-[10px] font-bold"
                      title="Rastgele yeni bir Hayvan üret"
                    >
                      + Hayvan
                    </button>
                  </div>
                </div>

                {/* Filtre Sekmeleri */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[10px]">
                  {(['Tümü', 'Canavar', 'Vahşi Hayvan', 'Düşman', 'Hazır Grup'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setModalDusmanFiltre(f)}
                      className={`px-2 py-0.5 rounded font-bold whitespace-nowrap transition-colors border ${
                        modalDusmanFiltre === f
                          ? 'bg-red-900/90 text-white border-red-500'
                          : 'bg-[#291515] text-stone-400 hover:text-stone-200 border-red-950'
                      }`}
                    >
                      {f === 'Hazır Grup' ? '🔥 4v4 Sürüler' : f}
                    </button>
                  ))}
                </div>

                {/* Liste */}
                <div className="space-y-2 pt-1 max-h-80 overflow-y-auto pr-1">
                  {modalDusmanFiltre === 'Hazır Grup' ? (
                    HAZIR_DUSMAN_GRUPLARI.map((grup) => (
                      <div
                        key={grup.id}
                        className="p-2.5 rounded-lg bg-[#281515] border border-amber-800/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-black text-xs text-amber-300">
                            {grup.ad}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono">
                            {grup.dusmanlar.length} Düşman
                          </span>
                        </div>
                        <p className="text-[10px] text-[#c9b2b2] leading-tight">
                          {grup.aciklama}
                        </p>
                        <button
                          onClick={() => {
                            handleDusmanGrubuSec(grup);
                            setYerlestirModalAcik(false);
                          }}
                          className="w-full py-1.5 rounded bg-gradient-to-r from-red-900 to-amber-900 hover:brightness-110 text-white text-xs font-bold border border-amber-600 shadow"
                        >
                          ⚔️ Tüm Grubu Meydana Sür (4v4)
                        </button>
                      </div>
                    ))
                  ) : (
                    HAZIR_DUSMAN_SABLONLARI
                      .filter((s) => {
                        if (modalDusmanFiltre === 'Canavar') {
                          return s.durumlar.some((d) => d.toLowerCase().includes('canavar') || d.toLowerCase().includes('hortlak') || d.toLowerCase().includes('yaratık'));
                        }
                        if (modalDusmanFiltre === 'Vahşi Hayvan') {
                          return s.durumlar.some((d) => d.toLowerCase().includes('vahşi') || d.toLowerCase().includes('hayvan')) || s.ad.toLowerCase().includes('kurt') || s.ad.toLowerCase().includes('ayı') || s.ad.toLowerCase().includes('pars') || s.ad.toLowerCase().includes('tazı');
                        }
                        if (modalDusmanFiltre === 'Düşman') {
                          return !s.durumlar.some((d) => d.toLowerCase().includes('canavar') || d.toLowerCase().includes('hayvan'));
                        }
                        return true;
                      })
                      .map((sablon, idx) => (
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
                            className="px-2.5 py-1 rounded bg-[#501c1c] hover:bg-[#6c2424] text-red-100 text-xs font-bold border border-red-800 whitespace-nowrap"
                          >
                            + Çağır
                          </button>
                        </div>
                      ))
                  )}
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

      {/* DURUM EFEKTLERİ YÖNETİM MODALI */}
      {durumModalSavasciId && (() => {
        const hedefSavasci = savascilar.find((s) => s.id === durumModalSavasciId);
        if (!hedefSavasci) return null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="parchment-sheet p-5 rounded-2xl border-2 border-amber-600/80 max-w-xl w-full shadow-2xl text-xs space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#443322] pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-amber-600 bg-black flex-shrink-0">
                    <img
                      src={hedefSavasci.fotoUrl || DEFAULT_AVATARS[hedefSavasci.tur]}
                      alt={hedefSavasci.ad}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-sm text-amber-200">
                      {hedefSavasci.ad}
                    </h3>
                    <p className="text-[10px] text-[#a99c8b]">
                      İkonik Durum Efektleri (Status Effects) • Zarlara ve Turlara Otomatik Yansır
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setDurumModalSavasciId(null)}
                  className="p-1 rounded text-stone-400 hover:text-stone-200"
                >
                  ✕
                </button>
              </div>

              {/* Aktif Durumlar Listesi */}
              <div className="p-2.5 rounded-xl bg-[#140e0a] border border-[#3b2a1a] space-y-1.5">
                <span className="text-[10px] uppercase font-heading font-bold text-[#8e7d6d] block">
                  Şu Anda Aktif Olan Durumlar ({hedefSavasci.durumlar.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hedefSavasci.durumlar.length === 0 ? (
                    <span className="text-[11px] text-stone-500 italic">Hiçbir aktif durum efekti yok.</span>
                  ) : (
                    hedefSavasci.durumlar.map((d, i) => {
                      const efekt = getStatusEffect(d);
                      return (
                        <span
                          key={i}
                          onClick={() => handleDurumToggle(hedefSavasci.id, d)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer hover:opacity-75 transition-all flex items-center gap-1 ${
                            efekt ? efekt.sinif : 'bg-[#271d15] text-amber-200 border-[#443322]'
                          }`}
                          title="Kaldırmak için tıkla"
                        >
                          <span>{efekt ? efekt.ikon : '🔸'}</span>
                          <span>{d}</span>
                          <span className="text-red-400 ml-1 font-mono">✕</span>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 10 İkonik Durum Listesi */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-heading font-bold text-amber-300 block">
                  Uygulamak veya Kaldırmak İçin Seçin:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CANON_STATUS_EFFECTS.map((efekt) => {
                    const isActive = hedefSavasci.durumlar.some((d) =>
                      d.toLowerCase().includes(efekt.ad.toLowerCase())
                    );

                    return (
                      <button
                        key={efekt.id}
                        onClick={() => handleDurumToggle(hedefSavasci.id, efekt.ad)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-amber-950/70 border-amber-500 ring-1 ring-amber-500 shadow-md'
                            : 'bg-[#18120d] border-[#3e2c1e] hover:border-amber-700/60'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">{efekt.ikon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-black text-xs text-[#f4ebd9] flex items-center gap-1">
                              <span>{efekt.ad}</span>
                              <span className={`text-[9px] px-1 rounded font-mono ${efekt.tur === 'buff' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {efekt.tur === 'buff' ? 'Faydalı' : 'Zararlı'}
                              </span>
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500 text-stone-950 font-black">
                                AKTİF
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#baa896] leading-tight mt-0.5 font-serif">
                            {efekt.aciklama}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-amber-400 font-bold">
                            {efekt.zarBonusu !== 0 && (
                              <span>Zar: {efekt.zarBonusu > 0 ? `+${efekt.zarBonusu}` : efekt.zarBonusu}</span>
                            )}
                            {efekt.savunmaBonusu !== 0 && (
                              <span>Sav: {efekt.savunmaBonusu > 0 ? `+${efekt.savunmaBonusu}` : efekt.savunmaBonusu}</span>
                            )}
                            {efekt.turBasiHasar > 0 && (
                              <span className="text-rose-400">{efekt.turBasiHasar} Hasar/Tur</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#443322]">
                <button
                  onClick={() => setDurumModalSavasciId(null)}
                  className="px-4 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs"
                >
                  Tamamla
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
