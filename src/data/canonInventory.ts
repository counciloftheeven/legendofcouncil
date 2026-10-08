import { EkipmanAspect } from '../rules';

export const CANON_SHOP_ITEMS: EkipmanAspect[] = [
  // ==========================================
  // 1. SİLAHLAR & DURUM SİNERJİLERİ
  // ==========================================
  {
    id: 'silah_kizil_centik',
    ad: 'Kızıl Çentik Arbaleti',
    tur: 'Silah',
    nadir: 'Usta İşi',
    fiyat: 28,
    yuk: 2,
    kusandiMi: false,
    hasarBonus: 2,
    aspectEtkisi: 'Rax-ed ile 50 adımdan subay avlayan öküz sinirli arbalet.',
    aciklama: 'Kemik Sırtı dağlarında Arathen muhafızlarının zırhlarını delmek için yapılmış çelik yaylı ağır arbalet.',
    durumSinerjisi: {
      hedefDurum: 'Kanamalı',
      tetiklenme: 'Vuruşta',
      aciklama: 'İsabetli vuruşta hedefe derin yırtık açar ve "Kanamalı" durumu uygular (1 Hasar/Tur, -1 Zar).'
    }
  },
  {
    id: 'silah_solgun_kama',
    ad: 'Solgun Sızı Zehirli Kaması',
    tur: 'Silah',
    nadir: 'Usta İşi',
    fiyat: 24,
    yuk: 1,
    kusandiMi: false,
    hasarBonus: 1,
    aspectEtkisi: 'Gölgeden yapılan vuruşlarda zırhı yok sayar.',
    aciklama: 'Karasu bataklığından toplanan engerek zehriyle çeliği kaynatılmış ince uçlu suikastçı kaması.',
    durumSinerjisi: {
      hedefDurum: 'Zehirlenmiş',
      tetiklenme: 'Vuruşta',
      aciklama: 'Başarılı darbede damarlara zehir zerk eder ve "Zehirlenmiş" durumu uygular (1 Hasar/Tur, -1 Zar).'
    }
  },
  {
    id: 'silah_koz_balyozu',
    ad: 'Köz Balyozu (Galdor Dövmesi)',
    tur: 'Silah',
    nadir: 'Efsanevi',
    fiyat: 38,
    yuk: 3,
    kusandiMi: false,
    hasarBonus: 3,
    aspectEtkisi: 'Kalkanları parçalar, siperleri ezer.',
    aciklama: 'Thundar dağlarının kükürt ocağında dövülmüş, kor gibi parlayan devasa iki elli madenci balyozu.',
    durumSinerjisi: {
      hedefDurum: 'Alevler İçinde',
      tetiklenme: 'Vuruşta',
      aciklama: 'Darbe anında kükürt patlar; hedefe "Alevler İçinde" durumu vurur (2 Hasar/Tur, -1 Savunma).'
    }
  },
  {
    id: 'silah_avci_yayi',
    ad: 'Kartal Gözü Uzun Yay',
    tur: 'Silah',
    nadir: 'Usta İşi',
    fiyat: 22,
    yuk: 2,
    kusandiMi: false,
    hasarBonus: 2,
    aspectEtkisi: 'Menzilli pusuda ilk atışa +2 Vuruş.',
    aciklama: 'İğneada porsuk ağacından bükülmüş, geyik kirişli avcı yayı.',
    durumSinerjisi: {
      kullaniciDurum: 'Odaklanmış',
      tetiklenme: 'Kuşanıldığında',
      aciklama: 'Kuşanıldığında avcının zihnini berraklaştırır ve "Odaklanmış" durumu kazandırır (+1 Zar, +1 Sav).'
    }
  },
  {
    id: 'silah_engizisyon_kirbaci',
    ad: 'Çivili Engizisyon Kırbacı',
    tur: 'Silah',
    nadir: 'Usta İşi',
    fiyat: 20,
    yuk: 1,
    kusandiMi: false,
    hasarBonus: 1,
    aspectEtkisi: 'Xes-hart ile sorguda ve sindirmede +2.',
    aciklama: 'Arava zindan gardiyanlarının mahkûmların etini soymak için kullandığı kurşun bilyeli deri kırbaç.',
    durumSinerjisi: {
      hedefDurum: 'Dehşet İçinde',
      tetiklenme: 'Vuruşta',
      aciklama: 'Kırbaç şaklaması kurbanın moralini felç eder ve "Dehşet İçinde" durumu aşılar (-2 Zar, -1 Sav).'
    }
  },
  {
    id: 'silah_leke_palasi',
    ad: 'Leke Kazınmış Celios Palası',
    tur: 'Silah',
    nadir: 'Yasak Büyülü',
    fiyat: 45,
    yuk: 2,
    kusandiMi: false,
    hasarBonus: 3,
    aspectEtkisi: 'Zırhı deler, vuruş sonrası büyü lekesi bırakır.',
    aciklama: 'Kabzasında fısıldayan yasak bir rün taşıyan karanlık çelik kılıç.',
    durumSinerjisi: {
      hedefDurum: 'Kanamalı',
      tetiklenme: 'Vuruşta',
      aciklama: 'Açtığı yaralar büyü sebebiyle pıhtılaşmaz, hedefe "Kanamalı" durumu uygular.'
    }
  },

  // ==========================================
  // 2. ZIRHLAR & KALKANLAR
  // ==========================================
  {
    id: 'zirh_craber_plaka',
    ad: 'Craber Elit Lejyoner Zırhı',
    tur: 'Zırh',
    nadir: 'Usta İşi',
    fiyat: 40,
    yuk: 3,
    kusandiMi: false,
    zirhPuani: 2,
    aspectEtkisi: 'Nizami manga kalkan hattında zırh puanını ikiye katlar.',
    aciklama: 'Kağan muhafızlarının giydiği dövme çelik göğüslük, omuzluk ve dizçek seti.',
    durumSinerjisi: {
      kullaniciDurum: 'Çelik Siper',
      tetiklenme: 'Kuşanıldığında',
      aciklama: 'Ağır çelik gövdeyi mermer gibi örter, "Çelik Siper" savunma desteği verir (+2 Savunma).'
    }
  },
  {
    id: 'kalkan_zean_aynasi',
    ad: 'Zean Parlak Bronz Kalkanı',
    tur: 'Kalkan',
    nadir: 'Efsanevi',
    fiyat: 26,
    yuk: 2,
    kusandiMi: false,
    kalkanSavunma: 2,
    aspectEtkisi: 'Güneş ışığını yansıtarak karşıdakinin gözünü kamaştırır.',
    aciklama: 'Güneş Tanrısı Era’nın tapınak muhafızlarının taşıdığı kusursuz cilalı ayna kalkan.',
    durumSinerjisi: {
      hedefDurum: 'Körleşmiş',
      tetiklenme: 'Savunmada',
      aciklama: 'Başarılı bir savunma savuşturmasında saldırganın gözünü alarak "Körleşmiş" yapar (-2 Zar).'
    }
  },
  {
    id: 'zirh_golge_yelegi',
    ad: 'Tshavel Gölge Yeleği',
    tur: 'Zırh',
    nadir: 'Usta İşi',
    fiyat: 30,
    yuk: 1,
    kusandiMi: false,
    zirhPuani: 1,
    aspectEtkisi: 'Sessiz adımlar ve gölgede gizlenme.',
    aciklama: 'Yağlı ipek ve yumuşak kuzu derisinden dikilmiş, ses çıkarmayan suikastçı yeleği.',
    durumSinerjisi: {
      kullaniciDurum: 'Odaklanmış',
      tetiklenme: 'Kuşanıldığında',
      aciklama: 'Giyildiğinde kullanıcının reflekslerini artırarak "Odaklanmış" durumu kazandırır.'
    }
  },

  // ==========================================
  // 3. BÜYÜLÜ YADİGARLAR & RÜNİK NESNELER
  // ==========================================
  {
    id: 'yadigar_era_asasi',
    ad: 'Era’nın Şafak Asası',
    tur: 'Büyülü Yadigar',
    nadir: 'Efsanevi',
    fiyat: 55,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Karanlık büyüleri defeder, müttefikleri iyileştirir.',
    aciklama: 'Akçaçeşme Baş Mabedi’nin kulesinde yüzyıllarca kutsanmış fildişi ve altın alaşımlı asa.',
    durumSinerjisi: {
      kullaniciDurum: 'Kutsanmış',
      tetiklenme: 'Kuşanıldığında',
      aciklama: 'Elde tutulduğu sürece taşıyıcıya ilahi nur bahşeder ve "Kutsanmış" durumu verir (+2 Zar, +1 Sav).'
    }
  },
  {
    id: 'yadigar_ofke_muskasi',
    ad: 'Wolkmar Kurt Pençesi Muskası',
    tur: 'Büyülü Yadigar',
    nadir: 'Usta İşi',
    fiyat: 32,
    yuk: 0,
    kusandiMi: false,
    aspectEtkisi: 'Kan kokusunu alınca savaş gücünü kabartır.',
    aciklama: 'Kemik Sırtı dağ kurdunun gümüşe geçirilmiş pençesi.',
    durumSinerjisi: {
      kullaniciDurum: 'Hiddetli',
      tetiklenme: 'Kuşanıldığında',
      aciklama: 'Kuşanan kişiyi kana susamış bir yırtıcıya çevirir: "Hiddetli" durumu sağlar (+2 Hasar, +1 Zar, -1 Sav).'
    }
  },
  {
    id: 'yadigar_karanlik_fener',
    ad: 'Namon Soğuk Köz Feneri',
    tur: 'Büyülü Yadigar',
    nadir: 'Yasak Büyülü',
    fiyat: 48,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Büyü izlerini ve görünmez gölgeleri görünür kılar.',
    aciklama: 'Külleri asla sönmeyen mor ışıklı yasak ilim feneri.',
    durumSinerjisi: {
      hedefDurum: 'Dehşet İçinde',
      tetiklenme: 'Kullanıldığında',
      aciklama: 'Açıldığında etrafa ürperti salar; çevredeki hasımlara "Dehşet İçinde" durumu yayar.'
    }
  },

  // ==========================================
  // 4. TIBBİ & İKSİRLER (SARGI VE PANZEHİRLER)
  // ==========================================
  {
    id: 'tibbi_karasu_merhemi',
    ad: 'Karasu Şifacı Sargısı & Merhemi',
    tur: 'Tıbbi',
    nadir: 'Sıradan',
    fiyat: 10,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Açık yaraları mühürler, kanı durdurur.',
    aciklama: 'Pelid otu ve çam reçinesinden mamul antiseptik sargı bezi.',
    durumSinerjisi: {
      kaldirilanDurumlar: ['Kanamalı'],
      tetiklenme: 'Kullanıldığında',
      aciklama: 'Kullanıldığında hastanın "Kanamalı" durumunu anında temizler ve 1 Can iyileştirir.'
    }
  },
  {
    id: 'tibbi_solgun_panzehir',
    ad: 'Solgun Sızı Panzehiri',
    tur: 'Tıbbi',
    nadir: 'Usta İşi',
    fiyat: 14,
    yuk: 0,
    kusandiMi: false,
    aspectEtkisi: 'Engerek ve örümcek zehrini nötralize eder.',
    aciklama: 'Kraliyet hekimlerinin özel tarifiyle şişelenmiş gümüş rengi tentür.',
    durumSinerjisi: {
      kaldirilanDurumlar: ['Zehirlenmiş'],
      tetiklenme: 'Kullanıldığında',
      aciklama: 'İçildiğinde bedendeki "Zehirlenmiş" durumunu tamamen söker atar.'
    }
  },
  {
    id: 'tibbi_mabed_tutsusu',
    ad: 'Mabed Arındırma Tütsüsü',
    tur: 'Tıbbi',
    nadir: 'Usta İşi',
    fiyat: 16,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Zihinsel felç ve dehşeti dağıtır.',
    aciklama: 'Lidros tapınağının sedir ağacı ve lavanta tütsüsü.',
    durumSinerjisi: {
      kaldirilanDurumlar: ['Dehşet İçinde', 'Körleşmiş'],
      kullaniciDurum: 'Odaklanmış',
      tetiklenme: 'Kullanıldığında',
      aciklama: '"Dehşet İçinde" ve "Körleşmiş" durumlarını temizler, zihni "Odaklanmış" yapar.'
    }
  },
  {
    id: 'tibbi_can_iksiri',
    ad: 'Galdor Ateş Şerbeti',
    tur: 'Tıbbi',
    nadir: 'Usta İşi',
    fiyat: 18,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Sersemliği kovar, bedeni ayağa diker.',
    aciklama: 'Dağ balı, kına kına kabuğu ve Kalderyan brendisi karışımı güçlü kuvvet şurubu.',
    durumSinerjisi: {
      kaldirilanDurumlar: ['Sersemlemiş'],
      kullaniciDurum: 'Odaklanmış',
      tetiklenme: 'Kullanıldığında',
      aciklama: 'İçildiğinde "Sersemlemiş" sersemliğini derhal siler, zihne canlılık katar.'
    }
  },

  // ==========================================
  // 5. TEÇHİZAT & MACERA ALETLERİ
  // ==========================================
  {
    id: 'techizat_tırmanma_kancasi',
    ad: 'Cüce Çeliği Tırmanma Kancası & İpi',
    tur: 'Teçhizat',
    nadir: 'Sıradan',
    fiyat: 8,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Duvarlara ve surlara tırmanırken Lithron/Zel-vash atışına +2.',
    aciklama: 'İpek örgü mukavim urgan ve üç tırnaklı hafif kanca takımı.'
  },
  {
    id: 'techizat_cilingir_seti',
    ad: 'Hırsız Loncası Çilingir Şişleri',
    tur: 'Teçhizat',
    nadir: 'Usta İşi',
    fiyat: 12,
    yuk: 0,
    kusandiMi: false,
    aspectEtkisi: 'Saray kilitlerini açarken Lodvez atışına +2.',
    aciklama: 'Kadife kılıfında ince temperli cımbızlar ve kilit maymuncukları.'
  },
  {
    id: 'techizat_kukurt_bombasi',
    ad: 'Kükürtlü Sis Bombası (3 Adet)',
    tur: 'Teçhizat',
    nadir: 'Usta İşi',
    fiyat: 15,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Görüşü kapatır, kaçış koridoru açar.',
    aciklama: 'İnce kilden çömlek içine hapsedilmiş sönmemiş kireç ve kükürt tozu.',
    durumSinerjisi: {
      hedefDurum: 'Körleşmiş',
      tetiklenme: 'Kullanıldığında',
      aciklama: 'Yere çarpıldığında odayı dumanla kaplar ve etraftaki düşmanları "Körleşmiş" yapar (-2 Zar).'
    }
  },
  {
    id: 'techizat_tuz_kesesi',
    ad: 'Kutsanmış Tuz Kesesi',
    tur: 'Teçhizat',
    nadir: 'Sıradan',
    fiyat: 6,
    yuk: 1,
    kusandiMi: false,
    aspectEtkisi: 'Hortlakları ve gölge varlıkları eşikten kovar.',
    aciklama: 'Denizden kurutulmuş ve Mabed sunağında dualanmış saf beyaz kaya tuzu.'
  }
];
