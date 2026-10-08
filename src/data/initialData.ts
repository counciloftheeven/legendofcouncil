import { Karakter, NPC, EkipmanAspect, HAZIR_EKIPMANLAR } from '../rules';
import { CANON_EYALETLER } from './canonLocations';
import { CANON_NPCS } from './canonNpcs';

export interface EyaletInfo {
  id: string;
  ad: string;
  hane: string;
  vali: string;
  nufus: string;
  gecim: string;
  tarihce: string;
  tehlikeSeviyesi: 'Düşük' | 'Orta' | 'Yüksek' | 'Ölümcül';
  kesfedildi: boolean;
  x: number;
  y: number;
  pinler: { id: string; ad: string; tur: 'Gorev' | 'Tehlike' | 'Han' | 'Kısla' | 'Lonca'; aciklama: string }[];
  isPanosu: {
    guvenli: { baslik: string; odul: string; detay: string };
    riskli: { baslik: string; odul: string; detay: string };
    tuzak: { baslik: string; odul: string; detay: string };
  };
}

export const EYALETLER: EyaletInfo[] = CANON_EYALETLER;

// ==========================================
// 4 KİŞİLİK CANON EKİP (OFFICIAL SRD SCHEMA)
// ==========================================
export const INITIAL_CHARACTERS: Karakter[] = [
  {
    id: 'char_zeandor',
    ad: 'Prens Zeandor Stallhart',
    oyuncu: 'Oyuncu 1',
    tur: 'İnsan',
    irk: 'Eran',
    koken: 'Soylu',
    olcek: 5, // Soylu Aile
    hane: 'Stallhart',
    eyalet: 'Arava / Taç Diyarı',
    meslek: 'Selya Meliği & Asker-Prens',
    rutbe: 'Yarının Hükümdarı',
    cerceve: 'stallhart-gold',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',

    yenileme: 3,
    kaderPuani: 3,

    // 14 Yaklaşım Dağılımı (+4 x1, +3 x2, +2 x3, +1 x3, 0 x2, -1 x3)
    yaklasimlar: {
      'Ghardello': 4,    // +4 (1)
      'Ver-ed': 3,       // +3 (2 - Eran Eğilimi)
      'Lithron': 3,      // +3
      'Rax-ed': 2,       // +2 (3)
      'Aldris': 2,       // +2
      'Edor / Edros': 2, // +2
      'Vizer': 1,        // +1 (3)
      'Xes-hart': 1,     // +1
      'Aronlid': 1,      // +1
      'Zel-vash': 0,     // 0 (2)
      'Vize-rion': 0,    // 0
      'Lodvez': -1,      // -1 (3)
      'Erau': -1,        // -1
      'Loth': -1         // -1
    },

    // 3 Yara Hattı (Her biri 1 şift emer)
    yaraHatlari: {
      fiziksel: [false, false, false],
      zihinsel: [false, false, false],
      itibar: [false]
    },

    // Sonuçlar (3 hat için ortak)
    sonuclar: {},

    // 5 Aspect
    aspectler: {
      unvanVeKader: 'Yarının Hükümdarı & Selya Meliği',
      zayifKanadi: 'Kehanetin Gölgesi: "Bir Domuz Tarafından Deşileceksin"',
      sadakatBagi: 'Elyndra Selya ile Kalbi Mühürlü Gizli İttifak',
      serbest1: 'Dokuz Yaşında Sürgün Edilmiş Yaralı Prens',
      serbest2: 'Selya Vinçlerini Kurmuş Mühendis Zihni'
    },

    // Uzmanlıklar
    uzmanliklar: [
      'Tahtın Ağırlığı: Meclis ve divan oturumlarında Ver-ed ile +2.',
      'Sözleşme Kılıcı: Bir müttefikle omuz omuza çarpışırken Ghardello ile +2.',
      'Kalkan Duvarı: Siper hattındayken Ghardello ile Savunmada +2.'
    ],
    yasakIlim: false,

    // Ekipman Aspect'leri
    ekipmanAspectleri: [
      'Edlith: Kutsal hanedan hançeri. Zırh deler (+1 Vuruş).',
      'Selya İpeği Seyahat Pelerini: Rütbeyi gizler.',
      'Kırmızı Mühürlü Gizli Amadon Zarfı: Kağan vasiyeti.'
    ],
    envanter: [
      { id: 'eq_edlith', ad: 'Edlith (Gümüş Hanedan Hançeri)', tur: 'Silah', aspectEtkisi: 'Zırh deler; ilk başarılı vuruşta +1 şift hasar ekler.', fiyat: 60, yuk: 1 },
      { id: 'eq_pelerin_z', ad: 'Selya İpeği Seyahat Pelerini', tur: 'Zırh', aspectEtkisi: 'Lodvez ile gizlenme girişimlerinde +2.', fiyat: 25, yuk: 1 }
    ],

    gecmis3Cumle: [
      'Arava Sarayı’nda annesiz doğdum; dokuz yaşımda Selya’nın kızıl kayalarına sürüldüm.',
      'Selya limanında çarklı yük vinçlerini kurdum ve Karagöl Çetesini bizzat mağaralarında ezdim.',
      'Bakırsu Boğazı’nda Erthan ile karşı karşıya gelip kan dökmek yerine gizli bir fermanla anlaştım.'
    ],

    ekonomi: { aron: 45, borc: 0 },
    durumlar: ['Teyakkuzda'],
    notlar: 'Amadon\'un gizli vasiyet zarfını sadece Kurultay önünde açacağım.',

    // Legacy uyumluluk
    sayaclar: { yaraKutulari: 3, alınanYaraKutulari: 0, yorgunluk: 0, muhur: 3, leke: 1, supheli: 1 },
    gorunumler: {
      anaKavram: 'Yarının Hükümdarı & Selya Meliği',
      dert: 'Kehanetin Gölgesi: "Bir Domuz Tarafından Deşileceksin"',
      gecmis: 'Dokuz Yaşında Sürgün Edilmiş Yaralı Prens',
      catisma: 'Amadon ve Başvezir Solgar’ın Kanlı Komplosu',
      bag: 'Elyndra Selya ile Kalbi Mühürlü Gizli İttifak'
    },
    beceriler: { Fight: 4, Shoot: 2, Stealth: 0, Investigate: 1, Lore: 2, ProvokeManipulate: 3 },
    nitelikler: { STR: 3, DEX: 2, CON: 3, INT: 2, WIS: 2, CHA: 3 }
  },
  {
    id: 'char_erthan',
    ad: 'Erthan (Almonth\'un Oğlu)',
    oyuncu: 'Oyuncu 2',
    tur: 'İnsan',
    irk: 'Reth',
    koken: 'Halktan',
    olcek: 2, // Sıradan Halk
    hane: 'Arhan',
    eyalet: 'Çukurtepe / Arhan Kırsalı',
    meslek: 'Paralı Asker',
    rutbe: 'İmparatorun Kâbusu & İsyancı Lider',
    cerceve: 'arhan-crimson',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',

    yenileme: 4,
    kaderPuani: 4,

    // 14 Yaklaşım Dağılımı (+4, 2x+3, 3x+2, 3x+1, 2x0, 3x-1)
    yaklasimlar: {
      'Ghardello': 4,    // +4 (1)
      'Lithron': 3,      // +3 (2)
      'Lodvez': 3,       // +3 (Reth Eğilimi)
      'Edor / Edros': 2, // +2 (3)
      'Zel-vash': 2,     // +2
      'Vizer': 2,        // +2
      'Rax-ed': 1,       // +1 (3)
      'Ver-ed': 1,       // +1
      'Xes-hart': 1,     // +1
      'Aronlid': 0,      // 0 (2)
      'Vize-rion': 0,    // 0
      'Aldris': -1,      // -1 (3)
      'Erau': -1,        // -1
      'Loth': -1         // -1
    },

    yaraHatlari: {
      fiziksel: [false, false, false],
      zihinsel: [false, false, false],
      itibar: [false]
    },
    sonuclar: {},

    aspectler: {
      unvanVeKader: 'Çukurtepeli İsyancı Lider & Selrin Taşıyıcısı',
      zayifKanadi: 'Babasının Mürekkep Hatasıyla İdamı (Dinmeyen İntikam)',
      sadakatBagi: 'Edlas Arhan’a Verilmiş Can Borcu & Annesi Sarya',
      serbest1: 'Tek Kollu Gazinin Mirası: "Düşmanın Ayaklarına Bak"',
      serbest2: 'Sadık Savaş Atı Doru’nun Efendisi'
    },

    uzmanliklar: [
      'Sözleşme Kılıcı: Yanımda en az bir müttefik varken Ghardello ile Saldırı ve Savunmada +2.',
      'Yol Kanunu: Kovalanırken ya da pusuda beklerken Zel-vash ile Aşmada +2.',
      'Gözün Mirası: Arhan ağıyla bir sırrı çözerken Vizer ile +2.'
    ],
    yasakIlim: false,

    ekipmanAspectleri: [
      'Selrin: Almonth’un gümüş damarlı efsanevi kılıcı. Ghardello darbelerinde +2 verir.',
      'Sertleştirilmiş Deri Zırh: Darbelere dirençli göğüslük.',
      'Granit Bileyi Taşı: Silahları bileyerek sonraki darbeye +1 ekler.'
    ],
    envanter: [
      { id: 'eq_selrin', ad: 'Selrin (Gümüş Damarlı Kılıç)', tur: 'Silah', aspectEtkisi: 'Ghardello ile Saldırıda sahne başına bir kez +2 bedelsiz çağrılır.', fiyat: 120, yuk: 2 },
      { id: 'eq_deri_e', ad: 'Sertleştirilmiş Deri Göğüslük', tur: 'Zırh', aspectEtkisi: 'Ghardello ile Savunmada sahne başına bir kez +2 bedelsiz çağrılır.', fiyat: 20, yuk: 2 }
    ],

    gecmis3Cumle: [
      'Çukurtepe köyünde tek kollu gazi babam Almonth’un tahta kılıç dersleriyle büyüdüm.',
      'Arava zindanında babamın idam edildiğini öğrenince memurun suratını parçalayıp zindana atıldım; Edlas beni kurtardı.',
      'Bakırsu boğazında Zeandor ile karşılaşıp fikirlerimin yaşaması adına ordumu geri çektim.'
    ],

    ekonomi: { aron: 16, borc: 30 },
    durumlar: ['Kararlı'],
    notlar: 'Baron Valer ve Solgar’ın kanlı borç senedini yırtıp atacağım.',

    sayaclar: { yaraKutulari: 3, alınanYaraKutulari: 0, yorgunluk: 0, muhur: 4, leke: 0, supheli: 3 },
    gorunumler: {
      anaKavram: 'Çukurtepeli İsyancı Lider & Selrin Taşıyıcısı',
      dert: 'Babasının Mürekkep Hatasıyla İdamı ve Dinmeyen İntikam Ateşi',
      gecmis: 'Tek Kollu Gazinin Mirası: "Düşmanın Ayaklarına Bak"',
      catisma: 'Baron Valer ve Solgar’ın Kanlı Borç Senedi',
      bag: 'Edlas Arhan’a Verilmiş Can Borcu & Annesi Sarya'
    },
    beceriler: { Fight: 4, Shoot: 1, Stealth: 2, Investigate: 2, Lore: 0, ProvokeManipulate: 1 },
    nitelikler: { STR: 3, DEX: 2, CON: 3, INT: 1, WIS: 2, CHA: 1 }
  },
  {
    id: 'char_liaher',
    ad: 'Liaher Selya',
    oyuncu: 'Oyuncu 3',
    tur: 'İnsan',
    irk: 'Eran',
    koken: 'Soylu',
    olcek: 5,
    hane: 'Selya',
    eyalet: 'Selyanya Vadisi',
    meslek: 'Garnizon Subayı',
    rutbe: 'Sessiz Fırtına & Yoldaş',
    cerceve: 'selya-sun',
    fotoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',

    yenileme: 3,
    kaderPuani: 3,

    yaklasimlar: {
      'Rax-ed': 4,       // +4 (1)
      'Ghardello': 3,    // +3 (2)
      'Ver-ed': 3,       // +3 (Eran Eğilimi)
      'Zel-vash': 2,     // +2 (3)
      'Lithron': 2,      // +2
      'Edor / Edros': 2, // +2
      'Vizer': 1,        // +1 (3)
      'Xes-hart': 1,     // +1
      'Aldris': 1,       // +1
      'Aronlid': 0,      // 0 (2)
      'Vize-rion': 0,    // 0
      'Lodvez': -1,      // -1 (3)
      'Erau': -1,        // -1
      'Loth': -1         // -1
    },

    yaraHatlari: {
      fiziksel: [false, false, false],
      zihinsel: [false, false, false],
      itibar: [false]
    },
    sonuclar: {},

    aspectler: {
      unvanVeKader: 'Selya’nın Sadık Kalkanı & Garnizon Komutanı',
      zayifKanadi: 'Dilsiz Kara Adam Kehaneti ("Sınavı Kaybedeceksin")',
      sadakatBagi: 'Kız Kardeşi Elyndra’nın Koruyucu Ağabeyi',
      serbest1: 'Babasının Gölgesinde Bilenmiş Çöl ve Sahil Askeri',
      serbest2: 'Kör Yengeç Masasının Kadim Müdavimi'
    },

    uzmanliklar: [
      'Rıhtım Soyu: Gemi ya da limanla ilgili Avantaj kurarken +2.',
      'Nizamın Kılıcı: Muhafız kalkan hattı içindeyken Ghardello ile Savunmada +2.',
      'Söğüt Denge Formu: Zorlu zeminlerde Zel-vash ile Aşmada +2.'
    ],
    yasakIlim: false,

    ekipmanAspectleri: [
      'Selya Mızrağı: Süvari hücumunda Ghardello darbelerine +2 ekler.',
      'Dişbudak Av Yayı: Rax-ed menzilli vuruşlarında +2 verir.',
      'Bronz Armalı Kalkan: Savunmayı güçlendirir.'
    ],
    envanter: [
      { id: 'eq_mizrak_l', ad: 'Selya Süvari Mızrağı', tur: 'Silah', aspectEtkisi: 'Hücumda Ghardello ile Saldırıda +2.', fiyat: 30, yuk: 2 },
      { id: 'eq_kalkan_l', ad: 'Selya Bronz Kalkanı', tur: 'Kalkan', aspectEtkisi: 'Ghardello Savunmasında +2.', fiyat: 25, yuk: 2 }
    ],

    gecmis3Cumle: [
      'Celios’un konağında at sırtında ve mızrak talimlerinde büyüdüm.',
      'Karagöl Çetesi baskınında Zeandor’un hayatını kurtarmak için ikinci kıskacı yönettim.',
      'Zeandor ile Elyndra arasındaki yasak bağı ilk sezen kişi oldum.'
    ],

    ekonomi: { aron: 25, borc: 0 },
    durumlar: ['Teyakkuzda'],
    notlar: 'Kör Yengeç kadınının "Dilsiz Kara Adam" uyarısını aklımdan çıkarmayacağım.',

    sayaclar: { yaraKutulari: 3, alınanYaraKutulari: 0, yorgunluk: 0, muhur: 3, leke: 0, supheli: 1 },
    gorunumler: {
      anaKavram: 'Selya’nın Sadık Kalkanı & Garnizon Komutanı',
      dert: 'Kehanetteki Tehdit: "Dilsiz Bir Kara Adam Karşına Çıktığında Sınavı Kaybedeceksin"',
      gecmis: 'Babasının Gölgesinde Bilenmiş Çöl ve Sahil Askeri',
      catisma: 'Ağabeyi Darios’un Kibri ile Zeandor’un Dostluğu Arasında Sıkışmış',
      bag: 'Kız Kardeşi Elyndra’nın Koruyucu Ağabeyi'
    },
    beceriler: { Fight: 3, Shoot: 4, Stealth: 2, Investigate: 1, Lore: 1, ProvokeManipulate: 1 },
    nitelikler: { STR: 2, DEX: 3, CON: 2, INT: 2, WIS: 2, CHA: 1 }
  },
  {
    id: 'char_elyndra',
    ad: 'Elyndra Selya',
    oyuncu: 'Oyuncu 4',
    tur: 'İnsan',
    irk: 'Eran',
    koken: 'Soylu',
    olcek: 5,
    hane: 'Selya',
    eyalet: 'Selyanya Vadisi',
    meslek: 'Kadim Dil Bilgesi & Casus',
    rutbe: 'Yıldız Işığının Mirası',
    cerceve: 'selya-sun',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',

    yenileme: 3,
    kaderPuani: 3,

    yaklasimlar: {
      'Aldris': 4,       // +4 (1)
      'Ver-ed': 3,       // +3 (Eran Eğilimi)
      'Vizer': 3,        // +3
      'Lodvez': 2,       // +2 (3)
      'Erau': 2,         // +2
      'Edor / Edros': 2, // +2
      'Zel-vash': 1,     // +1 (3)
      'Vize-rion': 1,    // +1
      'Aronlid': 1,      // +1
      'Ghardello': 0,    // 0 (2)
      'Xes-hart': 0,     // 0
      'Lithron': -1,     // -1 (3)
      'Rax-ed': -1,      // -1
      'Loth': -1         // -1
    },

    yaraHatlari: {
      fiziksel: [false, false, false],
      zihinsel: [false, false, false],
      itibar: [false]
    },
    sonuclar: {},

    aspectler: {
      unvanVeKader: 'Her Cümledeki Gizli Çatlağı Sezen Selya Bilgesi',
      zayifKanadi: 'Aile Siyasetine Meze Edilmekten Korkulan Tehlikeli Aşk',
      sadakatBagi: 'Prens Zeandor Stallhart ile Kalbi Mühürlü İttifak',
      serbest1: 'Thaelen’den Öğrenilen Kadim Elf Dili ve Rün Sırları',
      serbest2: 'Denge Konseyi’nin Sahte Kehanetlerini Çözme Arzusu'
    },

    uzmanliklar: [
      'Gölge Zanaatı: Gizlice sızarken ya da belge çalarken Lodvez ile +2.',
      'Saatçi’nin Mürekkebi: Arşiv belgeleri ve kütük araştırmasında Aldris ile +2.',
      'Pupilasız Bakış: Göz temasıyla zihinsel baskı kurarken Xes-hart ile +2.'
    ],
    yasakIlim: false,

    ekipmanAspectleri: [
      'Kadim Elf Şiir Mecmuası: Şifre ve rün çözmede Aldris’e +2 sağlar.',
      'Gölge Pelerini: Karanlıkta gizlenirken Zel-vash/Lodvez atışına +2 verir.',
      'Fildişi Saplı Narin Hançer: Gizlenebilir hafif bıçak.'
    ],
    envanter: [
      { id: 'eq_elf_mecmua', ad: 'Kadim Elf Dili Şiir Mecmuası', tur: 'Hazine', aspectEtkisi: 'Şifre çözmede Aldris ile Avantaj Yaratırken +2.', fiyat: 50, yuk: 1 },
      { id: 'eq_tshavel_e', ad: 'Gölge Pelerini (Tshavel)', tur: 'Zırh', aspectEtkisi: 'Gizlice sızarken Lodvez ile +2.', fiyat: 40, yuk: 1 }
    ],

    gecmis3Cumle: [
      'Selya’nın deniz kokan kütüphanelerinde Thaelen’in kadim elf metinlerini çözerek büyüdüm.',
      'Kör Yengeç fısıltılarını ve ağabeyim Darios’un gizli vergi defterlerini çözdüm.',
      'Zeandor’a sürgün yıllarında en karanlık anlarında bile umut aşıladım.'
    ],

    ekonomi: { aron: 32, borc: 0 },
    durumlar: ['Uyanık'],
    notlar: 'Thaelen\'in bahsettiği Rhovanaur kilitli kutusunun anlamını çözeceğim.',

    sayaclar: { yaraKutulari: 3, alınanYaraKutulari: 0, yorgunluk: 0, muhur: 4, leke: 1, supheli: 1 },
    gorunumler: {
      anaKavram: 'Her Cümledeki Gizli Çatlağı Sezen Selya Bilgesi',
      dert: 'Aile Siyasetine Meze Edilmekten Korkulan Tehlikeli Aşk',
      gecmis: 'Thaelen’den Öğrenilen Kadim Elf Dili ve Rün Sırları',
      catisma: 'Denge Konseyi’nin Sahte Kehanetlerini Çözme Arzusu',
      bag: 'Prens Zeandor Stallhart ile Kalbi Mühürlü İttifak'
    },
    beceriler: { Fight: 0, Shoot: 1, Stealth: 2, Investigate: 3, Lore: 4, ProvokeManipulate: 2 },
    nitelikler: { STR: 1, DEX: 2, CON: 1, INT: 4, WIS: 3, CHA: 3 }
  }
];

// ==========================================
// CANON VILLIANS & BOSSES (NPC SKALASI)
// ==========================================
export const INITIAL_NPCS: NPC[] = CANON_NPCS;
