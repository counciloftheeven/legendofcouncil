/**
 * STALLHART MASAÜSTÜ RPG KURAL MOTORU VE VERİ TANIMLARI
 * Fate tabanlı karanlık fantezi kural seti.
 */

export type Hane =
  | 'Stallhart'
  | 'Selya'
  | 'Arhan'
  | 'Galetsha'
  | 'Onneva'
  | 'Solgar'
  | 'Memanth'
  | 'Zela'
  | 'Seltanya'
  | 'Khasinya'
  | 'Adamen'
  | 'Mabed';

export interface HaneInfo {
  id: Hane;
  ad: string;
  unvan: string;
  renk: string; // Vurgu hex
  ikincilRenk: string;
  amblem: string; // Örn: 'Altın Taç & Siyah-Beyaz Dama'
  motifi: string;
  aciklama: string;
  eyalet: string;
  motto: string;
  sinir: string;
  lider: string;
}

export const HANELER: Record<Hane, HaneInfo> = {
  Stallhart: {
    id: 'Stallhart',
    ad: 'Stallhart Hanedanı',
    unvan: 'Kadim Taht & Kurultay Muhafızları',
    renk: '#d4af37',
    ikincilRenk: '#18181b',
    amblem: 'Siyah-beyaz dama üzeri altın taç',
    motifi: 'Dama & Taç',
    aciklama: 'İmparatorluğun kurucu ve merkezi hanesi. Disiplin, kanun ve demir bürokrasi ile yönetir.',
    eyalet: 'Merkez Eyalet - Stallhart Kalesi',
    motto: 'Taş aşınır, Stallhart baki kalır.',
    sinir: 'Karanlık Nehir boyu',
    lider: 'Yüksek Naip Varis Aldris'
  },
  Selya: {
    id: 'Selya',
    ad: 'Selya Hanedanı',
    unvan: 'Güneşin ve Kanın Şövalyeleri',
    renk: '#800020',
    ikincilRenk: '#e6b800',
    amblem: 'Derin bordo zemin, altın güneş',
    motifi: 'Altın Güneş',
    aciklama: 'Kutsal ışık tarikatları ve ateşli mızrak süvarileriyle tanınır. Mağrur ve dini dogmalara bağlıdır.',
    eyalet: 'Selyanya Vadisi',
    motto: 'Karanlığı sadece yanan kan arındırır.',
    sinir: 'Güneş Geçidi Dağları',
    lider: 'Leydi Valeriya Selya'
  },
  Arhan: {
    id: 'Arhan',
    ad: 'Arhan Hanedanı',
    unvan: 'Gece Kadehinin Sahipleri',
    renk: '#8b1e2f',
    ikincilRenk: '#ffffff',
    amblem: 'Bordo üzeri altın kadeh ve beyaz kutup yıldızı',
    motifi: 'Kadeh & Yıldız',
    aciklama: 'Simyacılar, şarap tüccarları ve zehir ustalarının hanesi. Saray entrikalarında rakipsizdirler.',
    eyalet: 'Arhan Kıyıları',
    motto: 'En tatlı kadeh, son yudumdur.',
    sinir: 'Kırmızı Körfez',
    lider: 'Kont Beren Arhan'
  },
  Galetsha: {
    id: 'Galetsha',
    ad: 'Galetsha Hanedanı',
    unvan: 'Sırlı Kilitler ve Demir Kasa Loncası',
    renk: '#2c2c2c',
    ikincilRenk: '#eab308',
    amblem: 'Kömür grisi zemin, parlak sarı anahtar',
    motifi: 'Sarı Anahtar',
    aciklama: 'Banka kasalarını, rehin sözleşmelerini ve zindan anahtarlarını ellerinde tutarlar. Borç affetmezler.',
    eyalet: 'Galetsha Maden Havzası',
    motto: 'Her sırrın bir kilidi, her kilidin bir bedeli vardır.',
    sinir: 'Demirkapı Boğazı',
    lider: 'Büyük Sayman Cassian Galetsha'
  },
  Onneva: {
    id: 'Onneva',
    ad: 'Onneva Hanedanı',
    unvan: 'Kızıl Kül ve Ocak Savaşçıları',
    renk: '#dc2626',
    ikincilRenk: '#18181b',
    amblem: 'Kömür siyahı, kızıl anka ve sarı alev dilleri',
    motifi: 'Kızıl Anka & Ateş',
    aciklama: 'Volkanik eteklerde yaşayan, küllerden doğan dövüşçüler. Asla teslim olmaz, ateşe taparlar.',
    eyalet: 'Onnev Kül Yaylası',
    motto: 'Yanmayan demir şekil almaz.',
    sinir: 'Kükürt Çatlağı',
    lider: 'Ocakbeyi Kaelen Onneva'
  },
  Solgar: {
    id: 'Solgar',
    ad: 'Solgar Hanedanı',
    unvan: 'Gece Aynası ve Rüzgar Fısıldayanlar',
    renk: '#0f172a',
    ikincilRenk: '#38bdf8',
    amblem: 'Gece mavisi, altın yusufçuk',
    motifi: 'Altın Yusufçuk',
    aciklama: 'Sessiz casuslar, göl balıkçıları ve rüya yorumcuları. Tehlikeyi günler öncesinden sezerler.',
    eyalet: 'Solgar Sis Gölleri',
    motto: 'Rüzgarın yönünü sadece kanatları titreyen bilir.',
    sinir: 'Aynalı Sazlıklar',
    lider: 'Matriyark Selise Solgar'
  },
  Memanth: {
    id: 'Memanth',
    ad: 'Memanth Hanedanı',
    unvan: 'Yıkılmaz Burç ve Granit Muhafızları',
    renk: '#1e293b',
    ikincilRenk: '#ca8a04',
    amblem: 'Karanlık lacivert, mat altın kale suru',
    motifi: 'Mat Altın Kale',
    aciklama: 'Dağ geçitlerindeki aşılmaz kalelerin efendileri. Ağır piyadeleri ve kuşatma makineleriyle ünlüdür.',
    eyalet: 'Memanth Kayalıkları',
    motto: 'Dağ çökerse, burçlarımız durur.',
    sinir: 'Büyük Yarık Batı Yamacı',
    lider: 'Garnizon Mareşali Goran Memanth'
  },
  Zela: {
    id: 'Zela',
    ad: "Z'ela Hanedanı",
    unvan: 'Bataklık Yılanları ve Eski Ahit Şamanları',
    renk: '#2d4a22',
    ikincilRenk: '#94a3b8',
    amblem: 'Küf yeşili, kurşuni yılan dişi',
    motifi: 'Yılan Dişi',
    aciklama: 'Sazlıklarda yaşayan, kadim büyü ve zehirlerle mühürlü aile. Çürümeyi ve dirilişi birlikte taşırlar.',
    eyalet: "Z'ela Bataklıkları",
    motto: 'Batanlar unutulmaz, derinde bekler.',
    sinir: 'Siyah Balçık Kanalı',
    lider: "Yılan Ana Vespera Z'ela"
  },
  Seltanya: {
    id: 'Seltanya',
    ad: 'Seltanya Hanedanı',
    unvan: 'Orman Tacı ve Boynuzlu Süvariler',
    renk: '#14532d',
    ikincilRenk: '#fef3c7',
    amblem: 'Orman yeşili/krem zemin, altın boynuzlu koç',
    motifi: 'Altın Koç',
    aciklama: 'Uçsuz bucaksız kadim koruların bekçileri. Doğanın acımasız dengesini savunurlar.',
    eyalet: 'Seltan Orman Eyaleti',
    motto: 'Ağacın kökü kana açtır.',
    sinir: 'Fısıldayan Koru Sınırı',
    lider: 'Orman Reisi Ronin Seltanya'
  },
  Khasinya: {
    id: 'Khasinya',
    ad: 'Khasinya Hanedanı',
    unvan: 'Kuzey Buzulu ve Kemik Yelkenliler',
    renk: '#115e59',
    ikincilRenk: '#f1f5f9',
    amblem: 'Koyu teal deniz mavisi, kemik beyazı fırtına gülü',
    motifi: 'Kemik & Fırtına',
    aciklama: 'Buz denizlerini aşan sert denizciler. Deniz canavarlarının kemiklerinden zırh yaparlar.',
    eyalet: 'Khasin Buz Fiyortları',
    motto: 'Buz merhamet tanımaz.',
    sinir: 'Donmuş Balina Burnu',
    lider: 'Korsan Lordu Theron Khasinya'
  },
  Adamen: {
    id: 'Adamen',
    ad: 'Adamen Hanedanı',
    unvan: 'Kartal Tepesi ve Yakut Ocakları',
    renk: '#1e3a8a',
    ikincilRenk: '#ef4444',
    amblem: 'Lacivert zemin, karlı dağ silüeti ve kızıl yakut',
    motifi: 'Dağ & Yakut',
    aciklama: 'En yüksek zirvelerin efendileri. Yakut madenleri sayesinde zengin, kartalları sayesinde her şeyi görürler.',
    eyalet: 'Adamen Zirveleri',
    motto: 'Zirveden bakanlar boyun eğmez.',
    sinir: 'Kartal Yuvası Uçurumu',
    lider: 'Dük Dorian Adamen'
  },
  Mabed: {
    id: 'Mabed',
    ad: 'Mabed Muhafızlığı',
    unvan: 'Denge Konseyi ve Kutsal Zırh Kardeşliği',
    renk: '#3f6212',
    ikincilRenk: '#1d4ed8',
    amblem: 'Zeytin yeşili ve kraliyet mavisi, altın zırhlı el',
    motifi: 'Zırhlı Adalet Eli',
    aciklama: 'Seküler krallıklardan bağımsız, Mabed yasasını uygulayan yargıç-şövalyeler. Lekeli büyücüleri avlarlar.',
    eyalet: 'Kutsal Şehir Mabed',
    motto: 'Terazi eğilmez, kılıç tereddüt etmez.',
    sinir: 'Yedi Çan Tapınak Bölgesi',
    lider: 'Baş Yargıç Malakor'
  }
};

export interface Nitelikler {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface Beceriler {
  Fight: number;
  Shoot: number;
  Stealth: number;
  Investigate: number;
  Lore: number;
  ProvokeManipulate: number;
}

export interface MeslekInfo {
  ad: string;
  aciklama: string;
  roller: string;
  hunerler: { ad: string; aciklama: string }[];
  zaaf: { ad: string; aciklama: string };
  oneriNitelik: keyof Nitelikler;
  oneriBeceri: keyof Beceriler;
}

export const MESLEKLER: Record<string, MeslekInfo> = {
  'Paralı Asker': {
    ad: 'Paralı Asker',
    aciklama: 'Savaş meydanlarında pişmiş, kılıcını Aron karşılığı kiralayan gazi.',
    roller: 'Ön hat dövüşçüsü, silah ustası, kuşatma tecrübesi',
    hunerler: [
      { ad: 'Çelik Kasırgası', aciklama: 'Birden fazla hedefe saldırırken +2 Vuruş sağlar.' },
      { ad: 'Siper Ustası', aciklama: 'Kalkan kullanırken Savunma zarına +1 ek bonus verir.' },
      { ad: 'Kan Kokusu', aciklama: 'Yaralı düşmanlara karşı Fight zarlarında +2 avantaj sağlar.' }
    ],
    zaaf: { ad: 'Altın Açlığı', aciklama: 'Ödeme geciktiğinde veya rüşvet teklif edildiğinde Dert tetiklenir.' },
    oneriNitelik: 'STR',
    oneriBeceri: 'Fight'
  },
  'Tfa Savaşçısı': {
    ad: 'Tfa Savaşçısı',
    aciklama: 'Gölge manastırlarında yetiştirilmiş, ritüel kılıç dövüşçüsü ve onur bekçisi.',
    roller: 'Akrobatik düellocu, sessiz infazcı',
    hunerler: [
      { ad: 'Sessiz Darbe', aciklama: 'Fark edilmeden yapılan ilk vuruş zırhı yok sayar.' },
      { ad: 'Tfa Dengesi', aciklama: 'Düşme veya devrilme durumlarında anında ayağa kalkar.' },
      { ad: 'Gölge Adımı', aciklama: 'Karanlıkta Stealth kontrollerinde +2 ekler.' }
    ],
    zaaf: { ad: 'Şeref Andı', aciklama: 'Silahsız birine saldıramaz veya verilen sözü bozamaz.' },
    oneriNitelik: 'DEX',
    oneriBeceri: 'Fight'
  },
  'Kolcu': {
    ad: 'Kolcu',
    aciklama: 'Medeniyetin sınırındaki lanetli ormanlarda yaşayan iz sürücü ve keskin nişancı.',
    roller: 'Yaban rehberi, pusucu, hayvan terbiyecisi',
    hunerler: [
      { ad: 'Avcı İzi', aciklama: 'İz sürerken Investigate zarına +2 ekler.' },
      { ad: 'Yaban Hissi', aciklama: 'Pusuya düşürülmeyi önleyen sezgiye sahiptir.' },
      { ad: 'Keskin Nişangah', aciklama: 'Uzak menzilli Shoot atışlarında +2 Vuruş verir.' }
    ],
    zaaf: { ad: 'Şehir Boğulması', aciklama: 'Kalabalık şehir merkezlerinde ve kapalı zindanlarda klostrofobi yaşar.' },
    oneriNitelik: 'WIS',
    oneriBeceri: 'Shoot'
  },
  'Kâşif/Ozan-Casus': {
    ad: 'Kâşif/Ozan-Casus',
    aciklama: 'Saraylarda şarkı söyleyip han köşelerinde fısıltı toplayan diplomat ve istihbaratçı.',
    roller: 'Sosyal manipülatör, şifre çözücü, sahtekar',
    hunerler: [
      { ad: 'Bin Surat', aciklama: 'Kılık değiştirme ve Provoke/Manipulate zarlarına +2 verir.' },
      { ad: 'Çözülen Diller', aciklama: 'Bir kadeh içki ikram ettiğinde hedef sırrını açığa vurur.' },
      { ad: 'Fısıltı Ağı', aciklama: 'Herhangi bir şehirde 1 saat içinde dedikodu ağını çözer.' }
    ],
    zaaf: { ad: 'Şüphe Çekme', aciklama: 'Yetkililerin dikkatini çeker, Şüphe sayacı iki kat hızlı yükselebilir.' },
    oneriNitelik: 'CHA',
    oneriBeceri: 'ProvokeManipulate'
  },
  'Vezin (Büyücü)': {
    ad: 'Vezin (Büyücü)',
    aciklama: 'Dokuma kanallarını yönlendirip gerçekliğin dokusunu büken tehlikeli rün ustası.',
    roller: 'Alan hasarı, zihin kontrolü, gizemli analiz',
    hunerler: [
      { ad: 'Dokuma Tınısı', aciklama: 'Lore zarı atarak rün büyüsü yapar; +2 güç sağlar.' },
      { ad: 'Rün Patlaması', aciklama: 'Büyü saldırısıyla düşman kalkan ve zırhlarını çatlatır.' },
      { ad: 'Zihin Fısıltısı', aciklama: 'Uzak mesafedeki zihinleri okur veya sahte görüntü yansıtır.' }
    ],
    zaaf: { ad: 'Leke Çekimi', aciklama: 'Büyü başarısız olduğunda veya 0 altı atıldığında anında +1 Leke alır.' },
    oneriNitelik: 'INT',
    oneriBeceri: 'Lore'
  },
  'Şifacı': {
    ad: 'Şifacı',
    aciklama: 'Bitkilerin dilini bilen, cerrahi ve kan dindirme sanatında usta yaşam koruyucusu.',
    roller: 'Takım destekçisi, zehir giderici, otacı',
    hunerler: [
      { ad: 'Bitki Merhemi', aciklama: 'Dinlenme anında bir Sıyrık yarasını anında iyileştirir.' },
      { ad: 'Kan Dindir', aciklama: 'Savaş ortasında bir dostunun Yara kutusunu dondurur.' },
      { ad: 'Ruh Yatıştır', aciklama: 'Korku veya delilik yaşayanların zihnini arındırır.' }
    ],
    zaaf: { ad: 'Şiddet Çekincesi', aciklama: 'Can almak ruhunu zedeler; öldürücü darbe vurmakta zorlanır.' },
    oneriNitelik: 'WIS',
    oneriBeceri: 'Investigate'
  },
  'Irun Demirci': {
    ad: 'Irun Demirci',
    aciklama: 'Kara çeliği döven, zırhların gizemini bilen ve silahları efsunlayan usta zanaatkar.',
    roller: 'Ekipman güçlendirici, yıkıcı çekiç dövüşçüsü',
    hunerler: [
      { ad: 'Dövme Zırh', aciklama: 'Kuşandığı zırhın eşiğine +1 ek zırh puanı ekler.' },
      { ad: 'Kusursuz Bileme', aciklama: 'Bilediği bir silah gün boyu +1 Vuruş bonusu kazanır.' },
      { ad: 'Ateş Dayanımı', aciklama: 'Ateş ve ısı hasarlarına karşı 2 kutu direnç sağlar.' }
    ],
    zaaf: { ad: 'Ağır Hareket', aciklama: 'Ağır adımları nedeniyle Stealth ve kaçış manevralarında dezavantajlıdır.' },
    oneriNitelik: 'STR',
    oneriBeceri: 'Fight'
  },
  'Tosh (Dışlanmış)': {
    ad: 'Tosh',
    aciklama: 'Toplumun lağımlarında, çöplüklerinde hayatta kalmayı başarmış dirençli yabani.',
    roller: 'Zehir uzmanı, kilit açıcı, kaçakçı',
    hunerler: [
      { ad: 'Çöpçü Gözü', aciklama: 'Terk edilmiş odalarda gözden kaçan değerli eşyayı bulur.' },
      { ad: 'Kaçış Sezgisi', aciklama: 'Kıstırıldığında savunma zarına +2 ekler.' },
      { ad: 'Zehir Direnci', aciklama: 'Bataklık gazlarına ve zehirlere karşı bağışıktır.' },
    ],
    zaaf: { ad: 'Dışlanmışlık', aciklama: 'Soylular ve loncalar tarafından hor görülür; diplomasi zarları zordur.' },
    oneriNitelik: 'CON',
    oneriBeceri: 'Stealth'
  }
};

export interface Esya {
  id: string;
  ad: string;
  tur: 'Silah' | 'Zırh' | 'Kalkan' | 'Teçhizat' | 'Tıbbi' | 'Görünüş Nesnesi';
  fiyat: number; // Aron
  yuk: number; // Slot
  zirhPuani?: number;
  hasarBonus?: number;
  kalkanSavunma?: number;
  aciklama: string;
}

export const HAZIR_ESYALAR: Esya[] = [
  { id: 'e1', ad: 'Stallhart Çeliği Kılıç', tur: 'Silah', fiyat: 8, yuk: 2, hasarBonus: 2, aciklama: 'Ağır, tek ağızlı imparatorluk süvari kılıcı.' },
  { id: 'e2', ad: 'Hafif Kısa Yay & Sadak', tur: 'Silah', fiyat: 7, yuk: 2, hasarBonus: 1, aciklama: 'Porsuk ağacından yapılma 20 oklu kolcu yayı.' },
  { id: 'e3', ad: 'Gizli Çelik Hançer', tur: 'Silah', fiyat: 3, yuk: 1, hasarBonus: 1, aciklama: 'Çizme içine gizlenebilen kavisli hançer.' },
  { id: 'e4', ad: 'Perçinli Deri Zırh', tur: 'Zırh', fiyat: 6, yuk: 2, zirhPuani: 1, aciklama: 'Esnek, hareket kabiliyetini engellemeyen zırh.' },
  { id: 'e5', ad: 'Stallhart Levha Göğüslük', tur: 'Zırh', fiyat: 14, yuk: 4, zirhPuani: 2, aciklama: 'Dövme çelik göğüslük. Ağır darbeleri emer.' },
  { id: 'e6', ad: 'Meşe Ağacı Yuvarlak Kalkan', tur: 'Kalkan', fiyat: 4, yuk: 2, kalkanSavunma: 1, aciklama: 'Demir kuşaklı siper kalkanı. +1 Savunma verir.' },
  { id: 'e7', ad: 'Şifacı Çantası ve Merhemler', tur: 'Tıbbi', fiyat: 4, yuk: 1, aciklama: '3 kullanım: kan dindirir, acıyı hafifletir.' },
  { id: 'e8', ad: 'Sefer Heybesi ve Çakmaktaşı', tur: 'Teçhizat', fiyat: 2, yuk: 1, aciklama: '3 günlük kurutulmuş et, tulum, çakmak taşı.' },
  { id: 'e9', ad: 'Kenevir Halat ve Çengel (15m)', tur: 'Teçhizat', fiyat: 2, yuk: 1, aciklama: 'Tırmanış ve tutsak bağlama için dayanıklı ip.' },
  { id: 'e10', ad: 'Pirinç Rün Feneri', tur: 'Teçhizat', fiyat: 3, yuk: 1, aciklama: 'Büyülü yağı ile 6 saat sis delen ışık yayar.' },
  { id: 'e11', ad: 'Zehirli Diken Şişesi', tur: 'Teçhizat', fiyat: 5, yuk: 1, aciklama: 'Silaha sürülünce hedefi sersemletir.' },
  { id: 'e12', ad: 'Hane Mührü Yüzüğü', tur: 'Görünüş Nesnesi', fiyat: 5, yuk: 0, aciklama: 'Kişisel damga balmumu mührü basar. Saygınlık kazandırır.' }
];

export interface Karakter {
  id: string;
  ad: string;
  hane: Hane;
  koken: 'Halk' | 'Soylu' | 'Kutsal Kan İddiası';
  meslek: string;
  rutbe: string;
  fotoUrl?: string;
  cerceve: string;
  nitelikler: Nitelikler;
  beceriler: Beceriler;
  luck: number;
  gorunumler: {
    anaKavram: string;
    dert: string;
    gecmis: string;
    catisma: string;
    bag: string;
  };
  ucEvre: {
    koken: string;
    yukselenCatisma: string;
    konukYildiz: string;
  };
  sayaclar: {
    yaraKutulari: number; // Maks = 2 + CON
    alınanYaraKutulari: number; // 0..yaraKutulari
    yorgunluk: number; // 0..4
    muhur: number; // Maks = 2 + Luck
    leke: number; // 0..9 (6+ da bozulma!)
    supheli: number; // 0..10 (5+ da takip!)
  };
  ekonomi: {
    aron: number;
    borc: number;
    sicil: number;
    un: number;
  };
  envanter: Esya[];
  yaraIzleri: string[];
  yaralar: {
    siyrik?: string; // -2
    yara?: string; // -4
    agirYara?: string; // -6 (Kalıcı görünüş / yara izi)
  };
  durumlar: string[]; // 'Kanama', 'Sersemlemiş', 'Korku'
  kilometreTaslari: {
    kucuk: number;
    orta: number;
    buyuk: number;
  };
  notlar?: string;
}

export interface ZarSonucu {
  id: string;
  zaman: string;
  atan: string;
  tur: '4dF' | 'Cephe';
  zarlar: number[]; // [-1, 0, 1, ...]
  zarToplami: number;
  nitelikAdi?: string;
  nitelikDegeri: number;
  beceriAdi?: string;
  beceriDegeri: number;
  muhurBonusu: number;
  toplam: number;
  merdivenDerecesi: string;
  aciklama: string;
  muhurKullanildi?: boolean;
}

export interface NPC {
  id: string;
  ad: string;
  hane: Hane;
  eyalet: string;
  rol: 'Vezir' | 'Vali' | 'Paralı Asker' | 'Casus' | 'Büyücü' | 'Tüccar' | 'Haydut Başı' | 'Mabed Yargıcı';
  tehdit: 'Düşük' | 'Orta' | 'Yüksek' | 'Ölümcül';
  tutum: number; // -3 (Düşman) ... 0 (Nötr) ... +3 (Müttefik)
  fotoUrl?: string;
  anaKavram: string;
  dert: string;
  sir: string;
  ipuclari: string[];
  anlaticiNotlari: string;
  stats: {
    fight: number;
    savunma: number;
    yaraKutulari: number;
    mevcutYara: number;
  };
}

export interface DengeKonseyiTanri {
  ad: string;
  unvan: string;
  alan: string;
  sembol: string;
  ogreti: string;
}

export const DENGE_KONSEYI: DengeKonseyiTanri[] = [
  { ad: 'Malthor', unvan: 'Demir Terazi', alan: 'Adalet, Sözleşmeler, Ölçü', sembol: 'Çift Başlı Terazi', ogreti: 'Söz verilen kanla ödenir.' },
  { ad: 'Era Zeana', unvan: 'Sessiz Örtü', alan: 'Ölüm, Huzur, Kemik Uykusu', sembol: 'Beyaz Kumaş Üzeri Kar', ogreti: 'Her ateş söner, her kan soğur.' },
  { ad: 'Gema Hanar', unvan: 'Kül Doğuran', alan: 'Diriliş, Savaş, Ocak Ateşi', sembol: 'Kor Yutan Anka', ogreti: 'Yalnız yananlar küllerinden çıkar.' },
  { ad: 'Solvena', unvan: 'Derin Akıntı', alan: 'Büyü, Dokuma, Sırlar', sembol: 'Sarmal Göz', ogreti: 'Dokumayı çeken parmak yanmayı göze almalıdır.' }
];

export const ZORLUK_MERDIVENI: { deger: number; baslik: string; renk: string }[] = [
  { deger: 8, baslik: 'Aşkın (Beyond)', renk: 'text-amber-300' },
  { deger: 7, baslik: 'Destansı (Epic)', renk: 'text-amber-400' },
  { deger: 6, baslik: 'Efsanevi (Legendary)', renk: 'text-yellow-400' },
  { deger: 5, baslik: 'Muazzam (Superb)', renk: 'text-emerald-400' },
  { deger: 4, baslik: 'Üstün (Great)', renk: 'text-teal-400' },
  { deger: 3, baslik: 'Zor / Harika (Good)', renk: 'text-cyan-400' },
  { deger: 2, baslik: 'İyi (Fair)', renk: 'text-blue-400' },
  { deger: 1, baslik: 'Sıradan (Average)', renk: 'text-indigo-300' },
  { deger: 0, baslik: 'Vasat (Mediocre)', renk: 'text-stone-400' },
  { deger: -1, baslik: 'Zayıf (Poor)', renk: 'text-orange-400' },
  { deger: -2, baslik: 'Korkunç (Terrible)', renk: 'text-red-500' }
];

export function merdivenDerecesiBul(toplam: number): string {
  const match = ZORLUK_MERDIVENI.find(m => m.deger === toplam);
  if (match) return `${match.baslik} (${toplam >= 0 ? '+' : ''}${toplam})`;
  if (toplam > 8) return `İlahi (+${toplam})`;
  return `Felaket (${toplam})`;
}

// 4dF Zar Motoru
export function zarAt4dF(): number[] {
  // 4 zar, her biri -1, 0, +1
  const zarlar: number[] = [];
  for (let i = 0; i < 4; i++) {
    const r = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
    zarlar.push(r);
  }
  return zarlar;
}

// Cephe Zarı (Birlik savaşları: Rion / Garion)
export function cepheZariAt(): { sonuc: string; netice: number; aciklama: string } {
  const rion = Math.floor(Math.random() * 6) + 1;
  const garion = Math.floor(Math.random() * 6) + 1;
  const fark = rion - garion;

  let aciklama = '';
  if (fark >= 3) aciklama = 'Büyük Yarmaca! Düşman hatları paramparça oldu.';
  else if (fark > 0) aciklama = 'Mevzi Kazanımı! Hat ileri sürüldü.';
  else if (fark === 0) aciklama = 'Kilitlenme! Kanlı bir siper çıkmazı.';
  else if (fark > -3) aciklama = 'Geri Çekilme! Düşman kanatları zorluyor.';
  else aciklama = 'Bozgun Tehlikesi! Sancak düştü, saflar dağılıyor!';

  return {
    sonuc: `Rion (${rion}) vs Garion (${garion})`,
    netice: fark,
    aciklama
  };
}

// Türetilen Değer Hesaplayıcıları
export function hesaplaMaksYaraKutusu(con: number): number {
  return 2 + con;
}

export function hesaplaMaksYuk(str: number): number {
  return 5 + str;
}

export function hesaplaBaslangicMuhur(luck: number): number {
  return 2 + luck;
}

export function hesaplaSavunma(dex: number, envanter: Esya[]): number {
  const kalkanVar = envanter.some(e => e.tur === 'Kalkan');
  return dex + (kalkanVar ? 1 : 0);
}

export function hesaplaToplamAgirlik(envanter: Esya[]): number {
  return envanter.reduce((acc, curr) => acc + (curr.yuk || 0), 0);
}

export function hesaplaToplamZirh(envanter: Esya[]): number {
  return envanter.reduce((acc, curr) => acc + (curr.zirhPuani || 0), 0);
}

// Saldırı ve Vuruş Mantığı
export function saldiriHesapla(
  saldiriToplami: number,
  savunmaToplami: number,
  hedefZirh: number
): {
  vurusFarki: number;
  netHasar: number;
  onerilenYaraKademesi: 'Yok' | 'Sıyrık' | 'Yara' | 'Ağır Yara' | 'Ölümcül Darbe';
  aciklama: string;
} {
  const fark = saldiriToplami - savunmaToplami;
  if (fark <= 0) {
    return {
      vurusFarki: fark,
      netHasar: 0,
      onerilenYaraKademesi: 'Yok',
      aciklama: 'Iskalandı veya siper tarafından savuşturuldu.'
    };
  }

  const netHasar = Math.max(0, fark - hedefZirh);

  let kademe: 'Yok' | 'Sıyrık' | 'Yara' | 'Ağır Yara' | 'Ölümcül Darbe' = 'Yok';
  let aciklama = '';

  if (netHasar === 0) {
    aciklama = `Darbe isabet etti fakat ${hedefZirh} zırh eşiği tüm hasarı emdi.`;
  } else if (netHasar <= 2) {
    kademe = 'Sıyrık';
    aciklama = 'Yüzeysel kanama veya kas ezilmesi (Sıyrık -2).';
  } else if (netHasar <= 4) {
    kademe = 'Yara';
    aciklama = 'Derin kesik, kemik çatlağı veya ciddi travma (Yara -4).';
  } else if (netHasar <= 6) {
    kademe = 'Ağır Yara';
    aciklama = 'Kalıcı iz bırakan, uzuv sakatlayan korkunç darbe (Ağır Yara -6, Yara İzi bırakır).';
  } else {
    kademe = 'Ölümcül Darbe';
    aciklama = 'Vücut bütünlüğünü tehdit eden ölümcül vuruş! Karakter bilinç kaybedebilir.';
  }

  return {
    vurusFarki: fark,
    netHasar,
    onerilenYaraKademesi: kademe,
    aciklama
  };
}
