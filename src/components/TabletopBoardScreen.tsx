import React, { useState, useEffect, useRef } from 'react';
import { Karakter, NPC, Esya, zarAt4dF, merdivenDerecesiBul, HANELER, fateAtisiHesapla } from '../rules';
import { sound } from '../utils/audio';
import { DarkestDungeonArena } from './DarkestDungeonArena';
import { LegendOfTheCouncilLogo } from './LegendOfTheCouncilLogo';
import {
  Users,
  Compass,
  Swords,
  MessageSquare,
  Shield,
  Sparkles,
  Package,
  Award,
  AlertTriangle,
  ChevronRight,
  Send,
  Eye,
  Lock,
  Unlock,
  Coins,
  Heart,
  Skull,
  Plus,
  RefreshCw,
  X,
  Volume2,
  Crown,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type ZoneId =
  | 'arava_saray'
  | 'bakirsu_vadisi'
  | 'igneada_ormani'
  | 'selya_liman'
  | 'kemik_sirti';

interface BoardTile {
  x: number;
  y: number;
  type: 'stone' | 'dirt' | 'grass' | 'water' | 'wall' | 'bridge';
  content?: {
    type: 'chest' | 'trap' | 'npc' | 'enemy' | 'lore' | 'exit';
    id: string;
    name: string;
    icon: string;
    npcData?: NPC;
    loot?: { aron: number; item?: Esya };
    loreText?: string;
    cleared?: boolean;
  };
}

interface TabletopBoardScreenProps {
  karakterler: Karakter[];
  aktifKarakter: Karakter;
  onKarakterSec: (id: string) => void;
  onKarakterGuncelle: (yeniKarakter: Karakter) => void;
  npcler: NPC[];
  rol: 'Anlatıcı' | 'Oyuncu';
  onSavasaBasla: (npc: NPC) => void;
  onDiyalogBasla: (npc: NPC) => void;
  onAnlatıYayinla: (metin: string) => void;
  spotlightPlayerId?: string | null;
  onSetSpotlight?: (playerId: string | null, playerName: string) => void;
}

export const WALLPAPER_PRESETS = [
  {
    ad: 'Arava Saray Dehlizleri & Taht',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    tur: 'Saray & Taht'
  },
  {
    ad: 'Bakırsu Vadisi Kanyonu & Şelale',
    url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=1600&auto=format&fit=crop&q=80',
    tur: 'Kanyon & Nehir'
  },
  {
    ad: 'İğneada Sisli Çamurlu Ormanı',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=80',
    tur: 'Sisli Orman'
  },
  {
    ad: 'Selya Kıyı Limanı & Prens İskelesi',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=80',
    tur: 'Liman & İskele'
  },
  {
    ad: 'Kemik Sırtı Karlı Dağları',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80',
    tur: 'Karlı Zirve'
  },
  {
    ad: 'Karanlık Zindan & Katakomp',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    tur: 'Yeraltı Zindanı'
  },
  {
    ad: 'Gladyatör Dello Arenası',
    url: 'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1600&auto=format&fit=crop&q=80',
    tur: 'Meşaleli Arena'
  }
];

const CANON_ZONES: Record<
  ZoneId,
  {
    name: string;
    subtitle: string;
    ambient: string;
    bgColor: string;
    wallpaperUrl: string;
    gridWidth: number;
    gridHeight: number;
    initialTiles: BoardTile[];
    storyBeat: string;
  }
> = {
  arava_saray: {
    name: 'Arava Başkenti & Saray Koridorları',
    subtitle: 'Taç Diyarı • Yaldızlı mermerler, derin dehlizler ve Akçaçeşme meydanı',
    ambient: 'Taht odasında şamdanlar titriyor, zindan kâtiplerinin mürekkebi taze kan kokuyor.',
    bgColor: '#16120e',
    wallpaperUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    gridWidth: 12,
    gridHeight: 10,
    storyBeat:
      'Arava’nın yüksek surları arkasında İmparator Amadon’un nefesi hırıldıyor. Başvezir Edun Solgar koridorlarda gölge gibi süzülürken, Akçaçeşme’de Başkomutan Albea’nın kanı henüz kurumadı.',
    initialTiles: [
      { x: 2, y: 1, type: 'wall' },
      { x: 3, y: 1, type: 'wall' },
      { x: 8, y: 1, type: 'wall' },
      { x: 9, y: 1, type: 'wall' },
      {
        x: 4,
        y: 2,
        type: 'stone',
        content: {
          type: 'lore',
          id: 'lore_saray_1',
          name: 'Yasak Kurultay Arşivi',
          icon: '📜',
          loreText: 'Vesika 742: "İmparator Imloth’un uyuşukluğu Seltanya krizini doğurdu; Amadon ise tahtı korumak için yeğenini ölüme sürdü."',
        },
      },
      {
        x: 7,
        y: 2,
        type: 'stone',
        content: {
          type: 'npc',
          id: 'npc_solgar',
          name: 'Başvezir Edun Solgar',
          icon: '🐍',
          npcData: {
            id: 'npc_solgar',
            ad: 'Başvezir Edun Solgar ("Engerek")',
            hane: 'Solgar',
            eyalet: 'Başsancak - Yüksek Kurultay Divanı',
            rol: 'Vezir',
            tehdit: 'Ölümcül',
            tutum: -2,
            anaKavram: 'İmparatorluğu Gölgeden Yöneten Zehir Ustası',
            dert: 'Amadon Ölürse Kellesinin Gideceğini Biliyor',
            sir: 'Küçük Lun Aldris’i kukla yapıp Zeandor’u bir suikastla yok etme planını bizzat hazırladı.',
            ipuclari: ['Zümrüt yeşili ipek cübbesi ve iri yakut yüzükleri vardır.'],
            anlaticiNotlari: 'Büyü ve zehir (Solgun Sızı) kullanır.',
            stats: { fight: 2, savunma: 4, yaraKutulari: 4, mevcutYara: 0 },
          },
        },
      },
      {
        x: 10,
        y: 3,
        type: 'stone',
        content: {
          type: 'chest',
          id: 'chest_saray_1',
          name: 'Saray Hazine Sandığı',
          icon: '📦',
          loot: { aron: 25, item: { id: 'loot_amulet', ad: 'Gümüş Koruyucu Mühür', tur: 'Hazine', fiyat: 30, yuk: 0, aciklama: 'Kutsal Kan mührü.' } },
        },
      },
      {
        x: 5,
        y: 5,
        type: 'stone',
        content: {
          type: 'trap',
          id: 'trap_saray_1',
          name: 'Saray Hafiyesi Dinleme Deliği',
          icon: '⚠️',
          loreText: 'Aralis Hanesi’nin gizli dinleme borusu! [Stealth / Gizlilik] zarı atılmazsa Şüphe +2 artar.',
        },
      },
      {
        x: 9,
        y: 7,
        type: 'stone',
        content: {
          type: 'enemy',
          id: 'boss_avci',
          name: 'Sessiz Avcı (Lonca Suikastçısı)',
          icon: '🏹',
          npcData: {
            id: 'npc_avci',
            ad: 'Sessiz Avcı (Lonca Katili)',
            hane: 'Memanth',
            eyalet: 'Başsancak Arava - Terziler Bayırı',
            rol: 'Suikastçı',
            tehdit: 'Ölümcül',
            tutum: -3,
            anaKavram: 'Başkomutan Albea’yı Tek Okta Deviren Gölge Katili',
            dert: 'Kimliğini Açığa Çıkarmak Ölüm Fermanıdır',
            sir: 'Suikast emrini bizzat Başvezir Edun Solgar’ın altın kesesiyle aldı.',
            ipuclari: ['Otuz sekiz adımdan kurşun arbalet ile köprücük kemiğinden vurur.'],
            anlaticiNotlari: 'Görünmezlikten saldırır, ilk oku zırh deler (+3 Hasar).',
            stats: { fight: 4, savunma: 3, yaraKutulari: 4, mevcutYara: 0 },
          },
        },
      },
    ],
  },
  bakirsu_vadisi: {
    name: 'Bakırsu Vadisi & Kanlı Boğaz',
    subtitle: 'Galetsha Sınırı • Paslı nehir yatakları, kükürt dumanları ve isyan çadırları',
    ambient: 'Thundar dağlarının eteğindeki bu vadide Reun Solgar’ın süvarileri balçığa gömüldü.',
    bgColor: '#171410',
    wallpaperUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=1600&auto=format&fit=crop&q=80',
    gridWidth: 12,
    gridHeight: 10,
    storyBeat:
      'Erthan’ın madencileri ve Arhan kılıçları bu sarp boğazda Solgar’ın öncü tümenini bozguna uğrattı. Zeandor ise üç bin beş yüz mızrakla vadinin girişinde bekleniyor.',
    initialTiles: [
      { x: 3, y: 0, type: 'water' },
      { x: 3, y: 1, type: 'water' },
      { x: 4, y: 2, type: 'water' },
      { x: 4, y: 3, type: 'bridge' },
      { x: 4, y: 4, type: 'water' },
      { x: 5, y: 5, type: 'water' },
      {
        x: 6,
        y: 3,
        type: 'dirt',
        content: {
          type: 'npc',
          id: 'npc_erthan_camp',
          name: 'İsyancı Lider Erthan (Müzakere Çadırı)',
          icon: '🌾',
          npcData: {
            id: 'char_erthan',
            ad: 'Erthan (Almonth\'un Oğlu)',
            hane: 'Arhan',
            eyalet: 'Bakırsu Vadisi Karargâhı',
            rol: 'İsyancı Komutan',
            tehdit: 'Yüksek',
            tutum: 1,
            anaKavram: 'Çukurtepeli İsyancı Lider & Selrin Kılıcı Taşıyıcısı',
            dert: 'Babasının Mürekkep Hatasıyla İdamı',
            sir: 'Selrin kılıcını teslim etmeyip halkın umut bayrağı yaptı.',
            ipuclari: ['Bileklerinde kendir halat yanıkları vardır.'],
            anlaticiNotlari: 'Zeandor ile gizli barış fermanını imzalamaya hazırdır.',
            stats: { fight: 3, savunma: 3, yaraKutulari: 5, mevcutYara: 0 },
          },
        },
      },
      {
        x: 2,
        y: 4,
        type: 'dirt',
        content: {
          type: 'chest',
          id: 'chest_bakirsu_1',
          name: 'Solgar Süvari Enkazı Sandığı',
          icon: '📦',
          loot: { aron: 35, item: { id: 'item_bakir_zirh', ad: 'Maden Döküm Zırhı', tur: 'Zırh', fiyat: 40, yuk: 2, aciklama: 'Bakırsu çarpışmasından kalan ağır göğüslük (+2 Zırh).' } },
        },
      },
      {
        x: 9,
        y: 6,
        type: 'dirt',
        content: {
          type: 'enemy',
          id: 'boss_wolrez',
          name: 'Büyük Sayman Wolrez Galet (Direnen Kurt)',
          icon: '⛏️',
          npcData: {
            id: 'npc_wolrez',
            ad: 'Wolrez Galet (Direnen Kurt)',
            hane: 'Galetsha',
            eyalet: 'Galetsha Kasa & Maden Kenti',
            rol: 'Eyalet Valisi',
            tehdit: 'Ölümcül',
            tutum: -3,
            anaKavram: 'Kuzey Madenlerinin Ağır Zırhlı Tiranı',
            dert: 'Maden İsyanını Kanla Bastırmak Zorunda',
            sir: 'İmparatorluk ordusunun kılıçlarındaki bakır payını çaldı.',
            ipuclari: ['Ağır bakır balyoz taşır.'],
            anlaticiNotlari: 'Zırhı 3 tür, vuruşları sersemletir.',
            stats: { fight: 3, savunma: 3, yaraKutulari: 6, mevcutYara: 0 },
          },
        },
      },
    ],
  },
  igneada_ormani: {
    name: 'İğneada Ormanı & Haydut Sığınağı',
    subtitle: 'Çamurlu Patikalar • Çürüyen yapraklar, tuzaklar ve Kara Hodrev’in ini',
    ambient: 'Bu ormanda rüzgâr sustuğunda bil ki avcı bıçağını bilemeye başlamıştır.',
    bgColor: '#111711',
    wallpaperUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=80',
    gridWidth: 12,
    gridHeight: 10,
    storyBeat:
      'Erthan’ın atı Doru’nun tuzağa düşürüldüğü, iki hırsızın boğuştuğu ve Zeandor’un Karagöl Çetesini sığınaklarında bastığı kanlı orman.',
    initialTiles: [
      { x: 1, y: 1, type: 'wall' },
      { x: 1, y: 2, type: 'wall' },
      { x: 10, y: 1, type: 'wall' },
      { x: 10, y: 2, type: 'wall' },
      {
        x: 4,
        y: 3,
        type: 'dirt',
        content: {
          type: 'trap',
          id: 'trap_halat',
          name: 'Kendir İpi At Tuzağı',
          icon: '⚠️',
          loreText: 'Doru’yu deviren çamurlu gizli ip! [DEX / Çeviklik] zarı atılmazsa binek devrilir ve 1 Yara Kutusu hasar alır.',
        },
      },
      {
        x: 8,
        y: 4,
        type: 'dirt',
        content: {
          type: 'enemy',
          id: 'boss_drakar',
          name: 'Kara Hodrev (Drakar - Çete Reisi)',
          icon: '🪓',
          npcData: {
            id: 'npc_drakar',
            ad: 'Kara Hodrev (Drakar)',
            hane: 'Stallhart',
            eyalet: 'İğneada Ormanı & Karagöl Boğazı',
            rol: 'Çete Reisi',
            tehdit: 'Yüksek',
            tutum: -3,
            anaKavram: 'Karagöl Eşkıyalarının Merhametsiz Celladı',
            dert: 'Çalınan Altın Hırsı',
            sir: 'Saraydaki bazı vezirlerden lojistik haber alıyordu.',
            ipuclari: ['Sol yanağında derin kılıç yarası vardır.'],
            anlaticiNotlari: 'Çift ağızlı ağır balta savurur (+3 Vuruş).',
            stats: { fight: 3, savunma: 2, yaraKutulari: 5, mevcutYara: 0 },
          },
        },
      },
      {
        x: 9,
        y: 7,
        type: 'dirt',
        content: {
          type: 'chest',
          id: 'chest_haydut_zulasi',
          name: 'Karagöl Çetesi Yağma Zulası',
          icon: '📦',
          loot: { aron: 50, item: { id: 'loot_gem', ad: 'Çalınan Selya Şarap Kadehi & Yakut', tur: 'Hazine', fiyat: 45, yuk: 1, aciklama: 'Kervan baskınından çalınmış değerli hazine.' } },
        },
      },
    ],
  },
  selya_liman: {
    name: 'Selya Kıyı Limanı & Prens İskelesi',
    subtitle: 'Güneş Vadisi • Raylı yük vinçleri, tuzlu esinti ve Kör Yengeç Tavernası',
    ambient: 'İskelede çark ve dişli sesleri yankılanıyor; Zeandor’un adını fısıldayan tüccarlar pazarlık ediyor.',
    bgColor: '#16191c',
    wallpaperUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=80',
    gridWidth: 12,
    gridHeight: 10,
    storyBeat:
      'Sürgündeki prensin kendi zekasıyla inşa ettirdiği raylı yük vinçleri limanın kaderini değiştirdi. Kör Yengeç’te ise kör kâhin kader çizgilerini okuyor.',
    initialTiles: [
      { x: 0, y: 7, type: 'water' },
      { x: 1, y: 7, type: 'water' },
      { x: 2, y: 7, type: 'water' },
      { x: 3, y: 7, type: 'water' },
      { x: 4, y: 7, type: 'bridge' },
      {
        x: 4,
        y: 4,
        type: 'stone',
        content: {
          type: 'lore',
          id: 'lore_vinc',
          name: 'Prens Zeandor Raylı Yük Vinci',
          icon: '🏗️',
          loreText: 'Usta Zylan ve Miran’ın Selya meşesiyle kurduğu raylı vinç! Hamalların sırtını kurtaran imparatorluk mucizesi.',
        },
      },
      {
        x: 8,
        y: 3,
        type: 'stone',
        content: {
          type: 'npc',
          id: 'npc_celios_board',
          name: 'Celios Selya (Kart Tilkisi)',
          icon: '🦊',
          npcData: {
            id: 'npc_celios',
            ad: 'Celios Selya (Selya\'nın Kart Tilkisi)',
            hane: 'Selya',
            eyalet: 'Selya Valilik Konağı',
            rol: 'Eski Başvezir & Danışman',
            tehdit: 'Yüksek',
            tutum: 2,
            anaKavram: 'İmparatorluk Meclisinin Yaşayan Bilgesi',
            dert: 'Ailesini ve Zeandor\'u Saray Akbabalarından Korumak',
            sir: 'Amadon\'un iki düşmanı birbirine kırdıracağını biliyordu.',
            ipuclari: ['Tamamen keldir, bakışları bir kalkan gibidir.'],
            anlaticiNotlari: 'Partiye stratejik zeka ve saray fısıltıları sağlar.',
            stats: { fight: 2, savunma: 3, yaraKutulari: 4, mevcutYara: 0 },
          },
        },
      },
      {
        x: 10,
        y: 5,
        type: 'stone',
        content: {
          type: 'lore',
          id: 'lore_kor_yengec',
          name: 'Kör Yengeç Tavernası Girişi',
          icon: '🍺',
          loreText: 'Kör kâhinin oturduğu köhne meyhane: "Sen bir domuz tarafından deşileceksin... Dilsiz bir kara adam karşına çıktığında ise sınavı kaybedeceksin!"',
        },
      },
    ],
  },
  kemik_sirti: {
    name: 'Kemik Sırtı & Arathen Hududu',
    subtitle: 'Doğu Cephesi • Kar leoparı sancakları, dondurucu ayaz ve lav çatlakları',
    ambient: 'Kral Leno Kridas kayalıkların tepesinden Stallhart’ın çöküşünü bekleyen bir akbaba gibi süzüyor.',
    bgColor: '#181216',
    wallpaperUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80',
    gridWidth: 12,
    gridHeight: 10,
    storyBeat:
      'Stallhart ile Arathen arasındaki asırlık düşmanlık bu donmuş sırtta kılıçların ucundadır. Eksik serçe parmaklı genç Kral Leno, sınır lejyonlarının gevşemesini bekliyor.',
    initialTiles: [
      { x: 3, y: 1, type: 'wall' },
      { x: 4, y: 1, type: 'wall' },
      { x: 5, y: 1, type: 'wall' },
      {
        x: 6,
        y: 3,
        type: 'stone',
        content: {
          type: 'enemy',
          id: 'boss_leno',
          name: 'Kral Leno Kridas (Buzun Oğlu - Dünya Bossu)',
          icon: '👑',
          npcData: {
            id: 'npc_leno',
            ad: 'Kral Leno Kridas (Buzun Oğlu)',
            hane: 'Stallhart',
            eyalet: 'Arathen Krallığı - Kemik Sırtı',
            rol: 'Düşman Krallık Hükümdarı',
            tehdit: 'Ölümcül',
            tutum: -2,
            anaKavram: 'Sabırlı Akbaba & Arathen Lejyonları Başkomutanı',
            dert: 'Stallhart Çökene Kadar Göğün Tepesinde Daireler Çizmek',
            sir: 'Sol küçük parmağı kopuktur. İmparatorluk sınırını delmek için gizli pakt kurdu.',
            ipuclari: ['Kimera sancağı taşır.'],
            anlaticiNotlari: 'Efsanevi cengaver. Karşı saldırılarında +3 Vuruş kazanır.',
            stats: { fight: 5, savunma: 4, yaraKutulari: 7, mevcutYara: 0 },
          },
        },
      },
      {
        x: 2,
        y: 5,
        type: 'stone',
        content: {
          type: 'chest',
          id: 'chest_kemik_1',
          name: 'Arathen Süvari Sandığı',
          icon: '📦',
          loot: { aron: 60, item: { id: 'loot_arathen_armor', ad: 'Kar Leoparı Çelik Zırhı', tur: 'Zırh', fiyat: 75, yuk: 2, aciklama: 'Soğuğa ve darbelere dayanıklı Arathen zırhı (+2 Savunma).' } },
        },
      },
    ],
  },
};

export const TabletopBoardScreen: React.FC<TabletopBoardScreenProps> = ({
  karakterler,
  aktifKarakter,
  onKarakterSec,
  onKarakterGuncelle,
  npcler,
  rol,
  onSavasaBasla,
  onDiyalogBasla,
  onAnlatıYayinla,
  spotlightPlayerId,
  onSetSpotlight,
}) => {
  // Seçili Bölge (Canon Zones)
  const [seciliBolgeId, setSeciliBolgeId] = useState<ZoneId>('arava_saray');
  const bolge = CANON_ZONES[seciliBolgeId];

  // Savaş Modu (true: 4v4 Saf Arenası, false: Barış & Keşif Zamanı)
  const [savasModu, setSavasModu] = useState<boolean>(false);

  // GM 16:9 Duvar Kağıdı Modalı & Özelleştirilmiş Duvar Kağıtları
  const [customWallpapers, setCustomWallpapers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('stallhart_custom_wallpapers');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [wallpaperModalAcik, setWallpaperModalAcik] = useState<boolean>(false);
  const [yeniGorselUrl, setYeniGorselUrl] = useState<string>('');
  const [izgaraGoster, setIzgaraGoster] = useState<boolean>(false);

  // Aktif Bölge Duvar Kağıdı (16:9)
  const aktifWallpaperUrl =
    customWallpapers[seciliBolgeId] ||
    bolge.wallpaperUrl ||
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80';

  // 12x10 Izgara Taşları
  const [tiles, setTiles] = useState<BoardTile[]>([]);
  const [partyPos, setPartyPos] = useState<{ x: number; y: number }>({ x: 2, y: 5 });
  const [followerPositions, setFollowerPositions] = useState<{ x: number; y: number }[]>([
    { x: 1, y: 5 },
    { x: 1, y: 6 },
    { x: 2, y: 6 },
  ]);

  // Envanter Hızlı Görüntüleme
  const [envanterAcik, setEnvanterAcik] = useState<boolean>(false);

  // GM Paneli Durumları
  const [gmFisiltiMetni, setGmFisiltiMetni] = useState<string>('');
  const [gmCompelModal, setGmCompelModal] = useState<boolean>(false);
  const [seciliCompelKarakterId, setSeciliCompelKarakterId] = useState<string>(aktifKarakter.id);

  // İnteraktif Olay / Sandık / Tuzak Bildirimi
  const [aktifOlay, setAktifOlay] = useState<{
    baslik: string;
    detay: string;
    tur: 'loot' | 'trap' | 'lore' | 'enemy';
    item?: Esya;
    aron?: number;
    npc?: NPC;
  } | null>(null);

  // Bölge Değiştiğinde Tahtayı Yükle
  useEffect(() => {
    const defaultTiles: BoardTile[] = [];
    for (let y = 0; y < bolge.gridHeight; y++) {
      for (let x = 0; x < bolge.gridWidth; x++) {
        const existing = bolge.initialTiles.find((t) => t.x === x && t.y === y);
        if (existing) {
          defaultTiles.push(existing);
        } else {
          defaultTiles.push({
            x,
            y,
            type: (x === 0 || x === bolge.gridWidth - 1 || y === 0 || y === bolge.gridHeight - 1) && Math.random() > 0.7 ? 'wall' : 'stone',
          });
        }
      }
    }
    setTiles(defaultTiles);
    setPartyPos({ x: 2, y: 5 });
    setFollowerPositions([
      { x: 1, y: 5 },
      { x: 1, y: 6 },
      { x: 2, y: 6 },
    ]);
    setAktifOlay(null);
    // Dinamik Ses Manzarası: Bölge değişimine göre ortam sesi tetikle
    sound.playRegionSoundscape(seciliBolgeId);
  }, [seciliBolgeId]);

  // GM Dosyadan 16:9 Görsel Yükleme
  const handleDosyaYukle16x9 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const guncel = { ...customWallpapers, [seciliBolgeId]: base64 };
        setCustomWallpapers(guncel);
        localStorage.setItem('stallhart_custom_wallpapers', JSON.stringify(guncel));
        sound.playSealStamp();
        confetti({ particleCount: 30, spread: 50 });
        setWallpaperModalAcik(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // GM URL ile 16:9 Duvar Kağıdı Uygulama
  const handleUrlWallpaperUygula = (url: string) => {
    if (!url.trim()) return;
    const guncel = { ...customWallpapers, [seciliBolgeId]: url.trim() };
    setCustomWallpapers(guncel);
    localStorage.setItem('stallhart_custom_wallpapers', JSON.stringify(guncel));
    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 50 });
    setYeniGorselUrl('');
    setWallpaperModalAcik(false);
  };

  // WASD & Ok Tuşları ile Parti Hareketi (Izgara açıkken)
  useEffect(() => {
    if (!izgaraGoster || savasModu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement?.tagName.toLowerCase();
      if (activeElement === 'input' || activeElement === 'textarea') return;

      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          dy = -1;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          dy = 1;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          dx = -1;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          dx = 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      hamleYap(partyPos.x + dx, partyPos.y + dy);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [partyPos, tiles, izgaraGoster, savasModu]);

  // Kareye Hamle Yapma
  const hamleYap = (hedefX: number, hedefY: number) => {
    if (hedefX < 0 || hedefX >= bolge.gridWidth || hedefY < 0 || hedefY >= bolge.gridHeight) return;

    const hedefTile = tiles.find((t) => t.x === hedefX && t.y === hedefY);
    if (!hedefTile || hedefTile.type === 'wall') {
      sound.playBladeClash();
      return;
    }

    sound.playFootstep();

    setFollowerPositions((prev) => [
      partyPos,
      prev[0] || partyPos,
      prev[1] || prev[0] || partyPos,
    ]);
    setPartyPos({ x: hedefX, y: hedefY });

    if (hedefTile.content && !hedefTile.content.cleared) {
      const c = hedefTile.content;

      if (c.type === 'chest') {
        sound.playSealStamp();
        confetti({ particleCount: 35, spread: 60 });
        const loot = c.loot || { aron: 20 };

        const yeniEnvanter = loot.item ? [...aktifKarakter.envanter, loot.item] : aktifKarakter.envanter;
        const yeniAron = (aktifKarakter.ekonomi?.aron || 0) + (loot.aron || 0);

        onKarakterGuncelle({
          ...aktifKarakter,
          envanter: yeniEnvanter,
          ekonomi: { ...aktifKarakter.ekonomi, aron: yeniAron },
        });

        setAktifOlay({
          baslik: `📦 ${c.name} Açıldı!`,
          detay: `Kazanılan: ${loot.aron || 0} Aron Altını ${loot.item ? `• [${loot.item.ad}] envantere eklendi.` : ''}`,
          tur: 'loot',
          item: loot.item,
          aron: loot.aron,
        });

        setTiles((prev) =>
          prev.map((t) => (t.x === hedefX && t.y === hedefY ? { ...t, content: { ...t.content!, cleared: true } } : t))
        );
      } else if (c.type === 'enemy') {
        sound.playBladeClash();
        setAktifOlay({
          baslik: `⚔️ DÜŞMAN PUSUYA DÜŞÜRDÜ: ${c.name}!`,
          detay: 'Düşman safları belirdi! 4v4 Saf Muharebe Arenasına geçiliyor.',
          tur: 'enemy',
          npc: c.npcData,
        });
        setSavasModu(true);
      } else if (c.type === 'npc') {
        sound.playSealStamp();
        setAktifOlay({
          baslik: `💬 ${c.name} ile Karşılaşıldı`,
          detay: `"${c.npcData?.anaKavram || 'Bir yabancı sizi süzüyor.'}"`,
          tur: 'enemy',
          npc: c.npcData,
        });
      }
    }
  };

  // Ortamı İnceleme (Vizer)
  const handleOrtamiIncele = () => {
    sound.playSealStamp();
    const vizerDegeri = aktifKarakter.yaklasimlar?.['Vizer'] ?? 2;
    const sonuc = fateAtisiHesapla(vizerDegeri, 2);
    confetti({ particleCount: 25, spread: 50 });
    setAktifOlay({
      baslik: `🔍 Ortam İncelendi (Vizer: ${sonuc.derece})`,
      detay: `${bolge.ambient} • Koku, rüzgâr ve ayak izleri incelendi. Taktiksel avantaj sağlandı.`,
      tur: 'lore'
    });
  };

  // Kamp Kurma / Dinlenme (Yenilenme)
  const handleKampKur = () => {
    sound.playSealStamp();
    confetti({ particleCount: 30, spread: 55 });
    // Fiziksel tampon kutularını sıfırla
    const yeniHatlar = {
      ...aktifKarakter.yaraHatlari,
      fiziksel: [false, false, false] as [boolean, boolean, boolean],
      zihinsel: [false, false, false] as [boolean, boolean, boolean],
    };
    onKarakterGuncelle({
      ...aktifKarakter,
      yaraHatlari: yeniHatlar,
      kaderPuani: Math.max(aktifKarakter.kaderPuani || 0, aktifKarakter.yenileme || 3),
    });
    setAktifOlay({
      baslik: '⛺ Kamp Kuruldu & Ocak Yakıldı',
      detay: 'Parti ateş başında soluklandı. Fiziksel ve Zihinsel tampon kutuları temizlendi. Kader Puanları yenilendi.',
      tur: 'loot'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 font-sans text-[#f4ebdc]">
      {/* BAŞLIK & OYUN LOGOSU BANNERI */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 parchment-sheet p-3 sm:p-4 rounded-2xl border border-[#523e2b] shadow-xl">
        <LegendOfTheCouncilLogo size="md" showSubtitle />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-amber-400 font-bold bg-[#140e0a] px-3 py-1.5 rounded-xl border border-[#3b2a1a] shadow-inner">
            📍 {bolge.name}
          </span>
        </div>
      </div>

      {/* 5 CANON BÖLGE SEKMELERİ (HARİTA GEZİNTİSİ) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {(Object.keys(CANON_ZONES) as ZoneId[]).map((zid) => {
          const z = CANON_ZONES[zid];
          const isSelected = zid === seciliBolgeId;
          return (
            <button
              key={zid}
              onClick={() => {
                sound.playSealStamp();
                setSeciliBolgeId(zid);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap border transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#291d13] border-amber-400 text-amber-200 ring-1 ring-amber-400 shadow-md'
                  : 'bg-[#16120e] border-[#3e2e20] text-[#93826e] hover:text-[#dcd1be]'
              }`}
            >
              <span>{z.name.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* SAVAŞ ZAMANI (4v4 SAF MUHAREBESİ & DELLO ARENASI) */}
      {savasModu ? (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* SAVAŞ KİLİDİ BAR & BARIŞA DÖN BUTONU */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-red-950 via-stone-950 to-red-950 border-2 border-red-600 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-900 border border-red-400 flex items-center justify-center text-amber-300 animate-pulse">
                <Swords className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-black text-xs sm:text-sm text-red-200 uppercase tracking-widest block">
                  ⚔️ 4v4 SAF MUHAREBESİ &amp; DELLO ARENASI DEVREDE
                </span>
                <span className="text-[10px] text-[#bda895]">
                  Düşmanla sıcak temas sağlandı. Sıra ve saf kuralları geçerli.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playSealStamp();
                setSavasModu(false);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#241a13] hover:bg-[#38281d] text-amber-200 border border-[#523d2b] font-heading font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
            >
              <span>🕊️ Savaştan Çık (Barış Moduna Dön)</span>
            </button>
          </div>

          {/* 4v4 DARKEST DUNGEON ARENASI */}
          <DarkestDungeonArena
            karakterler={karakterler}
            aktifKarakter={aktifKarakter}
            npcler={npcler}
            onKarakterGuncelle={onKarakterGuncelle}
            onKapat={() => setSavasModu(false)}
          />
        </div>
      ) : (
        /* BARIŞ ZAMANI & KEŞİF MODU:
           SOL: 4 KAHRAMAN KARTI | SAĞ: 16:9 SİNEMATİK WALLPAPER ALANI */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* SOL YAN (4 cols): KARAKTER KARTLARI */}
          <div className="lg:col-span-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#493726] pb-1.5">
              <span className="font-heading font-black text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Grup Kahramanları (Parti)</span>
              </span>
              <span className="text-[10px] text-[#93826e] font-mono">
                Barış &amp; Keşif
              </span>
            </div>

            {/* 4 Kişilik Kahraman Kartları (Dikey Liste) */}
            <div className="space-y-2">
              {karakterler.slice(0, 4).map((c, idx) => {
                const isSelected = c.id === aktifKarakter.id;
                const isSpotlight =
                  spotlightPlayerId === c.ad ||
                  spotlightPlayerId === c.id ||
                  spotlightPlayerId === c.oyuncu;

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      sound.playSealStamp();
                      onKarakterSec(c.id);
                    }}
                    className={`p-2.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 relative ${
                      isSpotlight
                        ? 'bg-gradient-to-r from-amber-950/95 via-[#342416] to-amber-950/95 border-amber-300 ring-4 ring-amber-400 shadow-[0_0_28px_rgba(245,158,11,0.9)] animate-pulse'
                        : isSelected
                        ? 'bg-[#291e13] border-amber-400 shadow-xl ring-1 ring-amber-400'
                        : 'bg-[#15110d] border-[#3e2e20] hover:border-[#674e35]'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-14 rounded-lg overflow-hidden border border-amber-500 bg-black flex-shrink-0 relative">
                      <img src={c.fotoUrl} alt={c.ad} className="w-full h-full object-cover" />
                      <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded bg-black/80 text-amber-300 text-[8px] font-mono font-bold flex items-center justify-center">
                        P{idx + 1}
                      </span>
                    </div>

                    {/* Bilgi & Barlar */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-heading font-black text-xs text-[#f5ebd7] truncate block">
                            {c.ad}
                          </span>
                          {rol === 'Oyuncu' && isSelected && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-900/90 text-emerald-200 border border-emerald-500 font-bold text-[8px] uppercase tracking-wider">
                              🛡️ Sen
                            </span>
                          )}
                          {isSpotlight && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 font-black text-[8px] uppercase tracking-wider animate-bounce shadow">
                              🔥 SÖZ SENDE!
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {rol === 'Anlatıcı' && onSetSpotlight && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playTempleBell('uyanis');
                                confetti({ particleCount: 25, spread: 50 });
                                onSetSpotlight(c.id, c.ad);
                              }}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/80 hover:bg-amber-700 text-amber-200 border border-amber-500 font-bold"
                              title={`"Söz sende ${c.ad}" de ve sahne ışığını ver`}
                            >
                              🔥 Söz Ver
                            </button>
                          )}
                          <span className="text-[9px] font-mono font-bold text-amber-400">
                            {c.kaderPuani || 0} KP
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] text-[#93826e] block truncate font-serif italic">
                        {c.tur} • {c.meslek} ({c.hane})
                      </span>

                      {/* 3 Yara Hattı Göstergeleri */}
                      <div className="flex items-center gap-2 pt-0.5 text-[8px]">
                        {/* Fiziksel */}
                        <div className="flex items-center gap-0.5" title="Fiziksel Tamponlar">
                          <Heart className="w-3 h-3 text-red-400" />
                          <div className="flex gap-0.5">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className={`w-3 h-3 rounded-xs border flex items-center justify-center font-bold ${
                                  c.yaraHatlari?.fiziksel?.[i]
                                    ? 'bg-red-800 border-red-500 text-white'
                                    : 'bg-stone-900 border-stone-700 text-stone-500'
                                }`}
                              >
                                {c.yaraHatlari?.fiziksel?.[i] ? '✕' : '1'}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Zihinsel */}
                        <div className="flex items-center gap-0.5" title="Zihinsel Stres Tamponları">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <div className="flex gap-0.5">
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className={`w-3 h-3 rounded-xs border flex items-center justify-center font-bold ${
                                  c.yaraHatlari?.zihinsel?.[i]
                                    ? 'bg-purple-800 border-purple-500 text-white'
                                    : 'bg-stone-900 border-stone-700 text-stone-500'
                                }`}
                              >
                                {c.yaraHatlari?.zihinsel?.[i] ? '✕' : '1'}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* İtibar */}
                        <div className="flex items-center gap-0.5" title="İtibar Tamponu">
                          <Crown className="w-3 h-3 text-blue-400" />
                          <span
                            className={`w-3 h-3 rounded-xs border flex items-center justify-center font-bold ${
                              c.yaraHatlari?.itibar?.[0]
                                ? 'bg-blue-800 border-blue-500 text-white'
                                : 'bg-stone-900 border-stone-700 text-stone-500'
                            }`}
                          >
                            {c.yaraHatlari?.itibar?.[0] ? '✕' : '1'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAĞ YAN (8 cols): 16:9 SİNEMATİK WALLPAPER ALANI */}
          <div className="lg:col-span-8 space-y-3">
            {/* 16:9 ASPECT-RATIO SAHNE KUTUSU */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden relative border-2 border-[#54412e] shadow-2xl bg-black group flex flex-col justify-between p-3 sm:p-4">
              {/* Arka Plan Görseli */}
              <img
                src={aktifWallpaperUrl}
                alt={bolge.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              />

              {/* Karartma & Vignette Katmanları */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/60 pointer-events-none" />

              {/* ÜST KATMAN: BÖLGE ADI & GM 16:9 GÖRSEL YÜKLEME BUTONU */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="bg-black/65 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-lg">
                  <h2 className="font-heading font-black text-xs sm:text-sm text-amber-200">
                    {bolge.name}
                  </h2>
                  <span className="text-[10px] text-[#b3a492] block">
                    {bolge.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {rol === 'Anlatıcı' && (
                    <button
                      onClick={() => setWallpaperModalAcik(true)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-950/90 hover:bg-amber-900 text-amber-200 border border-amber-600 font-heading font-bold text-xs flex items-center gap-1 shadow-lg backdrop-blur-md"
                      title="GM: Bu sahneye özel 16:9 arkaplan görseli yükle"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>16:9 Görsel Yükle</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIzgaraGoster(!izgaraGoster)}
                    className="px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-stone-300 border border-[#523e2b] text-xs font-heading font-bold flex items-center gap-1 shadow-lg backdrop-blur-md"
                    title="Kuşbakışı Izgarayı Göster/Gizle"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>{izgaraGoster ? 'Izgarayı Gizle' : '2D Izgara'}</span>
                  </button>
                </div>
              </div>

              {/* ALT KATMAN: HİKÂYE BEAT'İ & EN DİKKAT ÇEKİCİ SAVAŞA GİR BUTONU */}
              <div className="relative z-10 space-y-2 mt-auto">
                <div className="bg-black/75 backdrop-blur-md p-3 rounded-xl border border-[#4d3a28] shadow-lg">
                  <p className="text-xs text-[#ebdcc8] font-serif italic leading-relaxed">
                    &quot;{bolge.storyBeat}&quot;
                  </p>
                  <span className="text-[10px] text-amber-400/90 font-mono block mt-1">
                    Atmosfer: {bolge.ambient}
                  </span>
                </div>

                {/* EYLEMLER VE BÜYÜK SAVAŞA GİR BUTONU */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleOrtamiIncele}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1e1610]/90 hover:bg-[#2e2219] text-amber-200 border border-[#4d3a28] text-xs font-heading font-bold flex items-center gap-1 shadow backdrop-blur-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ortamı İncele</span>
                    </button>

                    <button
                      onClick={handleKampKur}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1e1610]/90 hover:bg-[#2e2219] text-emerald-200 border border-emerald-900/60 text-xs font-heading font-bold flex items-center gap-1 shadow backdrop-blur-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kamp Kur / Dinlen</span>
                    </button>
                  </div>

                  {/* SAVAŞA GİR (4v4 SAF ARENASI) */}
                  <button
                    onClick={() => {
                      sound.playBladeClash();
                      confetti({ particleCount: 40, spread: 60 });
                      setSavasModu(true);
                    }}
                    className="px-4 py-2 rounded-xl wax-seal text-white font-heading font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-2xl flex items-center gap-2 border border-red-500"
                  >
                    <Swords className="w-4 h-4 text-amber-300" />
                    <span>⚔️ SAVAŞA GİR (4v4 Saf Arenası)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* OPSIYONEL 2D KUŞBAKIŞI IZGARA (AÇILIRSA GÖRÜNÜR) */}
            {izgaraGoster && (
              <div className="parchment-sheet p-3 sm:p-4 rounded-xl border-2 border-[#54412f] shadow-2xl relative space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-amber-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>2D Taktik Macera Izgarası (WASD / Ok Tuşları veya Tıkla)</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#9f8e7d]">
                    Konum: ({partyPos.x}, {partyPos.y})
                  </span>
                </div>

                <div className="bg-[#0e0b08] p-2 rounded-xl border-2 border-[#3b2b1d] shadow-inner overflow-x-auto">
                  <div
                    className="grid gap-1 mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${bolge.gridWidth}, minmax(0, 1fr))`,
                      maxWidth: '650px',
                    }}
                  >
                    {tiles.map((tile) => {
                      const isLeader = partyPos.x === tile.x && partyPos.y === tile.y;
                      const followerIdx = followerPositions.findIndex((fp) => fp.x === tile.x && fp.y === tile.y);
                      const isFollower = !isLeader && followerIdx !== -1;
                      const isWall = tile.type === 'wall';
                      const isWater = tile.type === 'water';
                      const isBridge = tile.type === 'bridge';

                      return (
                        <button
                          key={`${tile.x}_${tile.y}`}
                          onClick={() => hamleYap(tile.x, tile.y)}
                          className={`aspect-square rounded flex items-center justify-center relative transition-all text-xs font-bold ${
                            isWall
                              ? 'bg-[#2b1f16] border border-[#483424] cursor-not-allowed text-stone-600'
                              : isWater
                              ? 'bg-[#0f1b29] border border-blue-900/60 text-blue-400'
                              : isBridge
                              ? 'bg-[#3b2a1a] border border-amber-800 text-amber-300'
                              : 'bg-[#18130f] hover:bg-[#251d16] border border-[#38281a]'
                          }`}
                        >
                          {tile.content && !tile.content.cleared && (
                            <span className="text-sm drop-shadow">{tile.content.icon}</span>
                          )}

                          {isLeader && (
                            <div className="absolute inset-0.5 rounded-full border-2 border-amber-400 bg-amber-900/90 text-white flex items-center justify-center font-black shadow-lg ring-2 ring-amber-300 animate-pulse text-[10px]">
                              👑
                            </div>
                          )}

                          {isFollower && (
                            <div className="absolute inset-1 rounded-full border border-emerald-400 bg-emerald-950 text-emerald-200 flex items-center justify-center font-bold text-[8px]">
                              P{followerIdx + 2}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GM 16:9 ARKA PLAN YÜKLEME MODALI */}
      {wallpaperModalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="parchment-sheet p-5 rounded-2xl border-2 border-amber-600 max-w-xl w-full shadow-2xl text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#4d3a28] pb-2">
              <span className="font-heading font-black text-sm text-amber-300 uppercase flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>GM: 16:9 Sahne Duvar Kağıdı Yükle / Değiştir</span>
              </span>
              <button onClick={() => setWallpaperModalAcik(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[#ded1be] font-serif leading-relaxed">
              Bu sahneye ait arkaplanı değiştirmek için bilgisayarınızdan bir görsel dosyası seçebilir veya doğrudan bir resim bağlantısı girebilirsiniz (16:9 oranında görünür).
            </p>

            {/* Dosya Yükleme Alanı */}
            <div className="p-3 rounded-xl bg-[#140f0c] border border-dashed border-[#54412e] text-center space-y-2">
              <Upload className="w-6 h-6 text-amber-400 mx-auto" />
              <label className="cursor-pointer inline-block px-3 py-1.5 rounded-lg wax-seal text-white font-heading font-bold text-xs shadow">
                <span>Bilgisayardan 16:9 Görsel Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDosyaYukle16x9}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-[#8e7e6d] block">
                PNG, JPG veya WEBP (Otomatik olarak 16:9 oranında ölçeklenir)
              </span>
            </div>

            {/* URL İle Ekleme */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-amber-300 block">
                Veya Görsel Bağlantısı (URL) Gir:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={yeniGorselUrl}
                  onChange={(e) => setYeniGorselUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#140f0c] border border-[#443322] rounded px-3 py-1.5 text-xs text-[#f5ebd7] focus:outline-none"
                />
                <button
                  onClick={() => handleUrlWallpaperUygula(yeniGorselUrl)}
                  className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-heading font-bold text-xs"
                >
                  Uygula
                </button>
              </div>
            </div>

            {/* Hazır Canon 16:9 Görsel Şablonları */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Hazır Stallhart Canon Duvar Kağıtları:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {WALLPAPER_PRESETS.map((preset) => (
                  <div
                    key={preset.ad}
                    onClick={() => handleUrlWallpaperUygula(preset.url)}
                    className="p-1 rounded-lg border border-[#3e2e20] bg-[#17120e] hover:border-amber-500 cursor-pointer group transition-all"
                  >
                    <div className="aspect-video w-full rounded overflow-hidden mb-1">
                      <img
                        src={preset.url}
                        alt={preset.ad}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-[9px] font-bold text-[#ded1be] block truncate">
                      {preset.ad}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AKTİF KARŞILAŞMA / OLAY POPUP'I */}
      {aktifOlay && (
        <div className="parchment-sheet p-3.5 rounded-xl border-2 border-amber-600/80 shadow-2xl animate-in fade-in duration-200 space-y-2">
          <div className="flex items-center justify-between border-b border-[#3b2b1d] pb-1.5">
            <h3 className="font-heading font-black text-sm text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{aktifOlay.baslik}</span>
            </h3>
            <button onClick={() => setAktifOlay(null)} className="text-stone-400 hover:text-white text-xs">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#e6dac9] font-serif leading-relaxed">
            {aktifOlay.detay}
          </p>

          {/* Fate Dört Temel Eylemi */}
          <div className="pt-2 border-t border-[#3b2b1d] space-y-1.5">
            <span className="text-[10px] uppercase font-heading font-bold text-amber-300 block">
              Fate Temel Eylemleriyle Yanıt Ver (4dF):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
              <button
                onClick={() => {
                  sound.playDiceRoll();
                  const z = fateAtisiHesapla(aktifKarakter.yaklasimlar?.['Lithron'] ?? 2, 2);
                  setAktifOlay({
                    ...aktifOlay,
                    detay: `${aktifOlay.detay} ➔ [AŞMA (Lithron)]: ${z.derece} (${z.sonucTuru}, ${z.sift} Şift)! ${z.aciklama}`
                  });
                }}
                className="p-1.5 rounded bg-[#1f1913] hover:bg-[#2e2319] border border-amber-900/60 text-amber-200 text-left font-bold"
              >
                🛡️ Aşma (Overcome)
              </button>
              <button
                onClick={() => {
                  sound.playSealStamp();
                  const z = fateAtisiHesapla(aktifKarakter.yaklasimlar?.['Vizer'] ?? 2, 2);
                  setAktifOlay({
                    ...aktifOlay,
                    detay: `${aktifOlay.detay} ➔ [AVANTAJ YARAT (Vizer)]: ${z.derece} (${z.sonucTuru})! Sahneye taktiksel Aspect eklendi.`
                  });
                }}
                className="p-1.5 rounded bg-[#1f1913] hover:bg-[#2e2319] border border-cyan-900/60 text-cyan-200 text-left font-bold"
              >
                🎯 Avantaj Yarat
              </button>
              <button
                onClick={() => {
                  sound.playBladeClash();
                  const z = fateAtisiHesapla(aktifKarakter.yaklasimlar?.['Ghardello'] ?? 3, 2);
                  setAktifOlay({
                    ...aktifOlay,
                    detay: `${aktifOlay.detay} ➔ [SALDIRI (Ghardello)]: ${z.derece} (${z.sonucTuru}, ${Math.max(0, z.sift)} Hasar)!`
                  });
                }}
                className="p-1.5 rounded bg-[#1f1913] hover:bg-[#2e2319] border border-red-900/60 text-red-200 text-left font-bold"
              >
                🗡️ Saldırı (Attack)
              </button>
              <button
                onClick={() => {
                  sound.playSealStamp();
                  const z = fateAtisiHesapla(aktifKarakter.yaklasimlar?.['Edor / Edros'] ?? 2, 2);
                  setAktifOlay({
                    ...aktifOlay,
                    detay: `${aktifOlay.detay} ➔ [SAVUNMA (Edor/Dirayet)]: ${z.derece} (${z.sonucTuru})! Savuşturuldu.`
                  });
                }}
                className="p-1.5 rounded bg-[#1f1913] hover:bg-[#2e2319] border border-emerald-900/60 text-emerald-200 text-left font-bold"
              >
                🛡️ Savunma (Defend)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {aktifOlay.npc && (
              <>
                <button
                  onClick={() => {
                    setAktifOlay(null);
                    setSavasModu(true);
                  }}
                  className="px-3 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs shadow flex items-center gap-1"
                >
                  <Swords className="w-3.5 h-3.5 text-amber-300" />
                  <span>⚔️ 4v4 Saf Muharebesini Başlat</span>
                </button>

                <button
                  onClick={() => onDiyalogBasla(aktifOlay.npc!)}
                  className="px-3 py-1.5 rounded bg-[#2b1f15] hover:bg-[#3d2c1e] text-amber-200 font-heading font-bold text-xs border border-[#523d2b] flex items-center gap-1 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>💬 Diyalog Başlat</span>
                </button>
              </>
            )}

            <button
              onClick={() => setAktifOlay(null)}
              className="px-3 py-1.5 rounded bg-[#1f1812] text-stone-300 font-heading text-xs border border-[#3b2b1d]"
            >
              Tamam / Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
