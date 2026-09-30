import { Karakter, NPC, Esya, HAZIR_ESYALAR } from '../rules';

export interface EyaletInfo {
  id: string;
  ad: string;
  hane: string;
  vali: string;
  nufus: string;
  gecim: string;
  tarihce: string;
  tehlikeSeviyesi: 'Düşük' | 'Orta' | 'Yüksek' | 'Ölümcül';
  kesfedildi: boolean; // Savaş sisi için
  x: number; // Harita % koordinatı
  y: number;
  pinler: { id: string; ad: string; tur: 'Gorev' | 'Tehlike' | 'Han' | 'Kısla' | 'Lonca'; aciklama: string }[];
  isPanosu: {
    guvenli: { baslik: string; odul: string; detay: string };
    riskli: { baslik: string; odul: string; detay: string };
    tuzak: { baslik: string; odul: string; detay: string };
  };
}

export const EYALETLER: EyaletInfo[] = [
  {
    id: 'merkez_stallhart',
    ad: 'Stallhart Kalp Eyaleti',
    hane: 'Stallhart',
    vali: 'Yüksek Naip Varis Aldris',
    nufus: '180.000',
    gecim: 'Vergi, Demir Sanayii, Kurultay Hukuku',
    tarihce: 'Taş burçların gökyüzünü yardığı, imparatorluk kararlarının alındığı kadim merkez. Kanunlar katı, nöbetçiler affetmezdir.',
    tehlikeSeviyesi: 'Orta',
    kesfedildi: true,
    x: 48,
    y: 45,
    pinler: [
      { id: 'p1', ad: 'Yüksek Kurultay Divanı', tur: 'Lonca', aciklama: 'Hanedan temsilcilerinin entrikalar çevirdiği salon.' },
      { id: 'p2', ad: 'Kara Karga Hanı', tur: 'Han', aciklama: 'Paralı askerlerin kiralandığı tekinsiz meyhane.' },
      { id: 'p3', ad: 'İmparatorluk Kışlası', tur: 'Kısla', aciklama: 'Dama sancaklı şövalyelerin talim alanı.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Kurultay Arşiv Muhafızlığı', odul: '15 Aron', detay: 'Gece kütüphanesinde yasak parşömenlerin çalınmasını önleyin.' },
      riskli: { baslik: 'Kanalizasyon Kaçakçılarını Temizle', odul: '35 Aron + Çelik Hançer', detay: 'Şehrin alt dehlizlerinde yuvalanan silah kaçakçılarını bastırın.' },
      tuzak: { baslik: 'Sırlı Kadeh Teslimatı', odul: '60 Aron', detay: 'Zehirli bir şarabı rakip soyluya fark ettirmeden ikram etme görevi. Yakalanırsanız cellat bekliyor.' }
    }
  },
  {
    id: 'selyanya',
    ad: 'Selya Güneş Vadisi',
    hane: 'Selya',
    vali: 'Leydi Valeriya Selya',
    nufus: '95.000',
    gecim: 'Şarap Bağları, Kutsal At Yetiştiriciliği, Mızrakçılar',
    tarihce: 'Altın güneşin aydınlattığı geniş vadiler. Halkı dindar, şövalyeleri onuruna ve kan soyuna fanatikçe bağlıdır.',
    tehlikeSeviyesi: 'Düşük',
    kesfedildi: true,
    x: 65,
    y: 35,
    pinler: [
      { id: 'p4', ad: 'Güneş Katedrali', tur: 'Gorev', aciklama: 'Kutsal ateşin hiç sönmediği tapınak.' },
      { id: 'p5', ad: 'Kızıl Asma Bağı', tur: 'Han', aciklama: 'Bordo şarabın su gibi aktığı misafirhane.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Güneş Süvarilerine Nal Dövme', odul: '12 Aron', detay: 'Irun demircisiyle birlikte süvari atlarına kutsal mühürlü nal takın.' },
      riskli: { baslik: 'Sapık Vaizi Yakalama', odul: '30 Aron + Dua Muskası', detay: 'Güneş öğretisini saptıran bir gezgin keşişi diri ele geçirin.' },
      tuzak: { baslik: 'Kayıp Miras Kılıcı', odul: '50 Aron', detay: 'Eski bir mezardan kutsal kılıç getirme. Mezar aslında lanetli bir büyü tuzağıdır.' }
    }
  },
  {
    id: 'arhan_kiyisi',
    ad: 'Arhan Kırmızı Koyu',
    hane: 'Arhan',
    vali: 'Kont Beren Arhan',
    nufus: '70.000',
    gecim: 'Simya, İpek İthalatı, Zehir Ticareti',
    tarihce: 'Lüks villaların ve karanlık pazarların koyu. Kadehlerdeki zehir, kılıç darbelerinden daha çok can almıştır.',
    tehlikeSeviyesi: 'Yüksek',
    kesfedildi: true,
    x: 75,
    y: 58,
    pinler: [
      { id: 'p6', ad: 'Zümrüt Simyahane', tur: 'Lonca', aciklama: 'Uçucu gazların ve parşömenlerin koktuğu atölye.' },
      { id: 'p7', ad: 'Korsan Sığınağı', tur: 'Tehlike', aciklama: 'Kaçak malların indirildiği kayalık mağara.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Nadir Mantar Toplama', odul: '18 Aron', detay: 'Gelgit mağaralarından mor fosforlu mantar getirin.' },
      riskli: { baslik: 'Saray Aşçısına Şantaj', odul: '40 Aron', detay: 'Kontun rakiplerinin menüsünü önceden öğrenin.' },
      tuzak: { baslik: 'Geceyarısı Kadeh Töreni Korumalığı', odul: '75 Aron', detay: 'Aslında bir suikast sahnesidir ve suç üstünüze atılmak istenmektedir.' }
    }
  },
  {
    id: 'galetsha_maden',
    ad: 'Galetsha Kasa & Maden Kenti',
    hane: 'Galetsha',
    vali: 'Büyük Sayman Cassian Galetsha',
    nufus: '110.000',
    gecim: 'Altın Darphanesi, Borç Senetleri, Demir Madenleri',
    tarihce: 'Yerin kilometrelerce altına inen maden galerileri ve kilitli dev kasa salonları.',
    tehlikeSeviyesi: 'Orta',
    kesfedildi: true,
    x: 32,
    y: 40,
    pinler: [
      { id: 'p8', ad: 'Yedinci Kasa Kapısı', tur: 'Lonca', aciklama: 'İmparatorluk borç defterlerinin saklandığı oda.' },
      { id: 'p9', ad: 'Madenci Çukuru Hanı', tur: 'Han', aciklama: 'Gürültülü, kavganın eksik olmadığı kömürcü barı.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Altın Sevkiyatı Eskortu', odul: '20 Aron', detay: 'Merkez bankaya giden külçe arabalarını koruyun.' },
      riskli: { baslik: 'Maden Çöküşünde Mahsur Kalanlar', odul: '45 Aron', detay: 'Metan gazı basan tünelden 4 ustayı çıkarın.' },
      tuzak: { baslik: 'Kayıp Borç Senetlerini Çal', odul: '80 Aron', detay: 'Galetsha muhafızlarının kurduğu bir sadakat testidir.' }
    }
  },
  {
    id: 'onneva_yayla',
    ad: 'Onneva Kül Yaylası',
    hane: 'Onneva',
    vali: 'Ocakbeyi Kaelen Onneva',
    nufus: '55.000',
    gecim: 'Volkanik Çelik, Lav Camı, Savaş Tazıları',
    tarihce: 'Dumanı tüten kraterler ve kül fırtınalarıyla kaplı sert coğrafya. Zayıflar burada ilk kışta can verir.',
    tehlikeSeviyesi: 'Ölümcül',
    kesfedildi: false,
    x: 82,
    y: 20,
    pinler: [
      { id: 'p10', ad: 'Kızıl Ocak Tapınağı', tur: 'Kısla', aciklama: 'Ateşte dövülen çeliklerin kutsandığı krater.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Obsidiyen Çıkarma', odul: '25 Aron', detay: 'Sıcak lav kenarından sivri obsidiyen blokları kırın.' },
      riskli: { baslik: 'Ateş Semenderi Avı', odul: '50 Aron + Zırh Parçası', detay: 'Köyleri yakan canavarı kükürt gölünde pusuya düşürün.' },
      tuzak: { baslik: 'Kül Sunağı Kan Adağı', odul: '100 Aron', detay: 'Kurban olarak seçildiğinizi fark ettiğiniz an iş işten geçebilir.' }
    }
  },
  {
    id: 'zela_bataklik',
    ad: "Z'ela Çürük Sazlıkları",
    hane: 'Zela',
    vali: "Yılan Ana Vespera Z'ela",
    nufus: '40.000',
    gecim: 'Sülük, Bataklık Gazı, Zehir Otları, Kara Büyü',
    tarihce: 'Sislerin ardında kaybolan ahşap iskeleler üzerine kurulu kasvetli eyalet. Batan cesetler kolay kolay çürümez.',
    tehlikeSeviyesi: 'Ölümcül',
    kesfedildi: false,
    x: 20,
    y: 65,
    pinler: [
      { id: 'p11', ad: 'Boğulmuş Mabed', tur: 'Tehlike', aciklama: 'Yarısı su altında kalmış kadim yılan tapınağı.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Bataklık Rehberliği', odul: '15 Aron', detay: 'Bir tüccar kayığını gizli kanallardan geçirin.' },
      riskli: { baslik: 'Sazlık Canavarı İnfazı', odul: '45 Aron', detay: 'Suda kaybolan çocukların peşine düşün.' },
      tuzak: { baslik: 'Yılan Ananın Gençlik İksiri', odul: '70 Aron', detay: 'İçilirse +3 Leke veren lanetli bir karışım.' }
    }
  },
  {
    id: 'mabed_kutsal',
    ad: 'Kutsal Şehir Mabed',
    hane: 'Mabed',
    vali: 'Baş Yargıç Malakor',
    nufus: '130.000',
    gecim: 'Kutsal Vergi, Mahkeme Harçları, Zırh Atölyeleri',
    tarihce: 'Seküler krallıkların üstünde kabul edilen Denge Mahkemesi ve Yedi Çan Kuleleri buradadır.',
    tehlikeSeviyesi: 'Orta',
    kesfedildi: true,
    x: 50,
    y: 78,
    pinler: [
      { id: 'p12', ad: 'Yedi Çan Kulesi', tur: 'Gorev', aciklama: 'Sabah 3 çanının ve akşam dualarının yankılandığı dev kule.' },
      { id: 'p13', ad: 'Engizisyon Zindanları', tur: 'Tehlike', aciklama: 'Lekeli büyücülerin zincirlendiği taş mahzenler.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Çan Kulesi Nöbeti', odul: '15 Aron', detay: 'Gece vakti çan iplerinin kesilmesini engelleyin.' },
      riskli: { baslik: 'Lekeli Kaçağı Yakalama', odul: '50 Aron + Mabed Mührü', detay: 'Leke seviyesi 6’yı aşmış kaçak bir vezini teslim edin.' },
      tuzak: { baslik: 'Engizisyon Şahidi Olma', odul: '40 Aron', detay: 'Yalan beyan vermezseniz mahkeme sizi sanık sandalyesine oturtur.' }
    }
  }
];

export const INITIAL_CHARACTERS: Karakter[] = [
  {
    id: 'char_1',
    ad: 'Goran Demirkanat',
    hane: 'Stallhart',
    koken: 'Halk',
    meslek: 'Paralı Asker',
    rutbe: 'Yüzbaşı',
    cerceve: 'stallhart-gold',
    fotoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    nitelikler: { STR: 2, DEX: 2, CON: 2, INT: 1, WIS: 1, CHA: 1 },
    beceriler: { Fight: 2, Shoot: 1, Stealth: 1, Investigate: 1, Lore: 1, ProvokeManipulate: 2 },
    luck: 3,
    gorunumler: {
      anaKavram: 'Stallhart Sınırlarının Kıdemli Kılıcı',
      dert: 'Ödenmemiş Kan Borcu ve Şarap Zaafı',
      gecmis: 'Dama Sancağı Altında On Beş Kanlı Kuşatma',
      catisma: 'Galetsha Tefecileri Peşimde',
      bag: 'Küçük Kardeşimin Mabed’deki Kefareti'
    },
    ucEvre: {
      koken: 'Karanlık Nehir kıyısındaki demirci çıraklığından orduya kaçtım.',
      yukselenCatisma: 'Kızıl Kül vadisinde komutanımı sırtlayıp yangından kurtardım ama leyliyi terk ettim.',
      konukYildiz: 'Lyra ile bir zindan baskınında sırt sırta verip kasayı patlattık.'
    },
    sayaclar: {
      yaraKutulari: 4, // 2 + CON (2)
      alınanYaraKutulari: 1,
      yorgunluk: 1,
      muhur: 4, // 2 + Luck (3) -> harcanabilir
      leke: 2,
      supheli: 3
    },
    ekonomi: {
      aron: 18,
      borc: 40,
      sicil: 2,
      un: 4
    },
    envanter: [
      HAZIR_ESYALAR[0], // Stallhart Kılıç
      HAZIR_ESYALAR[3], // Deri Zırh
      HAZIR_ESYALAR[5], // Kalkan
      HAZIR_ESYALAR[7]  // Sefer Heybesi
    ],
    yaraIzleri: ['Sol yanakta kılıç çentiği', 'Sağ omuzda yanık lekesi'],
    yaralar: {
      siyrik: 'Kaburga Ezilmesi (-2)'
    },
    durumlar: ['Teyakkuzda'],
    kilometreTaslari: {
      kucuk: 2,
      orta: 1,
      buyuk: 0
    },
    notlar: `## 📜 Sınır Kuşatması ve Komplo Notları
- [ ] **Galetsha Borç Senedi:** Maden muhafızlarına olan 40 Aron borcu gecikirse kellemize ödül konacak.
- [ ] **Karanlık Nehir Pususu:** Kaçakçıların ele geçirdiği askeri haritayı Kurultay Divanına teslim et.
- [x] Kardeşimin Mabed kefareti için ilk taksit ödendi (15 Aron).

### 🔍 Şüpheliler & Önemli İsimler
> *"Demir bükülür, taş çatlar; fakat verilen kan sözü asla unutulmaz."*
- **Büyük Sayman Cassian:** Bize gizli bir görev teklif etti ama arkasında zehir kokusu var.
- **Kör Karga Tosh:** 5 Aron karşılığında saray nöbetçi değişim saatlerini satacak.

### 🎒 Planlanan Sefer
1. Galetsha maden kasasına girmeden önce kalkanı demircide dövdür (+1 Zırh).
2. Puslu ormanda iz sürerken Kolcu yollarını kullan.`
  },
  {
    id: 'char_2',
    ad: "Lyra Vespera Z'ela",
    hane: 'Zela',
    koken: 'Soylu',
    meslek: 'Vezin (Büyücü)',
    rutbe: 'Rün Dokuyucusu',
    cerceve: 'zela-venom',
    fotoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    nitelikler: { STR: 0, DEX: 2, CON: 1, INT: 3, WIS: 2, CHA: 1 },
    beceriler: { Fight: 0, Shoot: 1, Stealth: 2, Investigate: 2, Lore: 3, ProvokeManipulate: 0 },
    luck: 3,
    gorunumler: {
      anaKavram: 'Sazlıkların Yılan Gözlü Vezini',
      dert: 'Dokumanın Fısıltısı Beni Delirtiyor (Leke Açlığı)',
      gecmis: 'Yasak Yılan Kütüphanesinden Çalınan Parşömen',
      catisma: 'Mabed Engizisyonunun Kara Listesinde',
      bag: 'Goran ile Birlikte Tutulan Sessizlik Yemini'
    },
    ucEvre: {
      koken: 'Küf kokulu bataklık kalesinde kadim rünlerle büyütüldüm.',
      yukselenCatisma: 'Kutsal kan iddiasında bulunan bir sahtekarın rünlerini yaktım.',
      konukYildiz: 'Goran’ın yarasını dindirmek için yasak bir simya kökü kullandım.'
    },
    sayaclar: {
      yaraKutulari: 3,
      alınanYaraKutulari: 0,
      yorgunluk: 0,
      muhur: 5,
      leke: 5, // Sınırda! (6'da bozulma)
      supheli: 6  // 5+ olduğu için takipte!
    },
    ekonomi: {
      aron: 26,
      borc: 10,
      sicil: 4,
      un: 2
    },
    envanter: [
      HAZIR_ESYALAR[2], // Gizli Hançer
      HAZIR_ESYALAR[6], // Şifacı Çantası
      HAZIR_ESYALAR[9]  // Rün Feneri
    ],
    yaraIzleri: ['Kollarda parlayan mor rün damarları'],
    yaralar: {},
    durumlar: ['Tedirgin'],
    kilometreTaslari: {
      kucuk: 3,
      orta: 0,
      buyuk: 0
    },
    notlar: `## 🔮 Yasak Rünler & Leke Günlüğü
- [ ] **Engizitör Malakor'un Gözleri:** Şüphe seviyem 6 oldu. Mabed avcıları ayak seslerimi takip ediyor.
- [ ] **Kadim Rün Çözümü:** Z'ela kütüphanesinden çaldığım 3. parşömen metnini çevir.
- [x] Goran'ın ölümcül yarasını dindirmek için yasak simya kökü hazırlandı.

### 🕯️ Rün Fısıltıları & Leke Eşiği
> *"Dokuma seni çağırdığında kulaklarını tıkama, fakat kanını da ateşe teslim etme."*
- **Leke Seviyesi:** 5/9 (6'ya ulaşırsa ruhum gerçekliğin dokusunu kontrolsüzce bükecek).`
  }
];

export const INITIAL_NPCS: NPC[] = [
  {
    id: 'npc_1',
    ad: 'Büyük Sayman Cassian Galetsha',
    hane: 'Galetsha',
    eyalet: 'Galetsha Kasa & Maden Kenti',
    rol: 'Vezir',
    tehdit: 'Yüksek',
    tutum: -1, // Soğuk/Tereddütlü
    anaKavram: 'İmparatorluk Hazinesinin Anahtarcısı',
    dert: 'Borç Defterindeki Gizli Açığı Saklamak Zorunda',
    sir: 'Stallhart ordusunun son seferini gizlice finanse eden faiz anlaşması sahtedir.',
    ipuclari: ['Masasındaki altın kutuda zehirli mühür yüzüğü taşır.', 'Geceleri maden tünellerine gizlice iner.'],
    anlaticiNotlari: 'Karakterler borçlarını ödemezse peşlerine 3 infazcı takar. Rüşvet olarak kadim rün taşlarını kabul eder.',
    stats: { fight: 1, savunma: 2, yaraKutulari: 3, mevcutYara: 0 }
  },
  {
    id: 'npc_2',
    ad: 'Leydi Valeriya Selya',
    hane: 'Selya',
    eyalet: 'Selya Güneş Vadisi',
    rol: 'Vali',
    tehdit: 'Yüksek',
    tutum: 1, // Ilımlı müttefik
    anaKavram: 'Güneş Mızraklarının Demir Leydisi',
    dert: 'Babası Lekeli Büyücülük Yüzünden Gizlice İdam Edildi',
    sir: 'Kendi kanında da bastırılmış rün ateşi uyanmaktadır.',
    ipuclari: ['Sol eldivenini asla çıkarmaz, altında yanık lekesi vardır.', 'Kurultayda Stallhart’a karşı gizli ittifak arıyor.'],
    anlaticiNotlari: 'Oyunculara şerefli bir görev verebilir. Eğer dürüst davranırlarsa Selya atlarından armağan eder.',
    stats: { fight: 3, savunma: 3, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'npc_3',
    ad: 'Engizitör Malakor',
    hane: 'Mabed',
    eyalet: 'Kutsal Şehir Mabed',
    rol: 'Mabed Yargıcı',
    tehdit: 'Ölümcül',
    tutum: -2, // Düşmanca / Kuşkucu
    anaKavram: 'Denge Mahkemesinin Acımasız Celladı',
    dert: 'Merhamet Göstermeyi En Büyük Günah Sayar',
    sir: 'Eski bir Vezin idi, kendi dilini keserek büyüden arındığını iddia eder.',
    ipuclari: ['Boynunda 7 adet kurşun mühür asılıdır.', 'Gözleri karanlıkta fersiz bir alev gibi parlar.'],
    anlaticiNotlari: 'Leke seviyesi 5 üstü karakterleri kokusundan tanır. Mabed çanları çalarken saldırır.',
    stats: { fight: 3, savunma: 2, yaraKutulari: 5, mevcutYara: 0 }
  },
  {
    id: 'npc_4',
    ad: 'Kör Karga Tosh',
    hane: 'Memanth',
    eyalet: 'Stallhart Kalp Eyaleti',
    rol: 'Casus',
    tehdit: 'Düşük',
    tutum: 2, // Dostane bilgi kaynağı
    anaKavram: 'Kanalizasyonların Gözü Kulağı',
    dert: 'Sürekli Yüksek Kaliteli Şarap İster',
    sir: 'Kurultay divanının altındaki havalandırma deliğinden tüm gizli konuşmaları dinler.',
    ipuclari: ['Bir gözü kördür ama kulakları sinek vızıltısını duyar.', 'Aron yerine bazen sır takası yapar.'],
    anlaticiNotlari: '5 Aron karşılığında saraydaki nöbetçi değişim saatlerini satar.',
    stats: { fight: 1, savunma: 2, yaraKutulari: 2, mevcutYara: 0 }
  }
];
