import { NPC, YaklasimAdi } from '../rules';

// ============================================================================
// VAHŞİ HAYVANLAR (WILD BEASTS OF THE REALM)
// ============================================================================
export const VAHSI_HAYVANLAR: NPC[] = [
  {
    id: 'beast_kurt_khasin_1',
    ad: 'Khasinya Ayaz Kurdu ("Ak Yele")',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Khasin',
    eyalet: 'Khasinya Boğazı & Karlı Sırtlar',
    rol: 'Alfa Yırtıcı Sürü Lideri',
    tehdit: 'Yüksek',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Tipi Fırtınasında Avını Kokusuzca Çevreleyen Alfa Kurt',
    dert: 'Açlıktan Çıldıran Sürüsünü Doyurma Mecburiyeti',
    sir: 'Khasinya Dağ Muhafızlarının bıraktığı kanlı etlerle insan etine alışmıştır.',
    ipuclari: ['Kafatasında eski mızrak izi.', 'Gözleri ayaz mavisi parlar.', 'Nefesi buharlaşarak donar.'],
    anlaticiNotlari: 'Sürüyle saldırırken +2 Vuruş kazanır. Isırığı hedefi dondurarak (Yavaşlatılmış) durumu verir.',
    yaklasimlar: { 'Zel-vash': 4, 'Ghardello': 3, 'Lithron': 3, 'Vizer': 2 },
    stats: { fight: 4, savunma: 3, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'beast_kurt_suru_2',
    ad: 'Ayaz Sürüsü Bozkır Kurdu',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Khasin',
    eyalet: 'Khasinya Dağ Geçitleri',
    rol: 'Sürü Avcısı',
    tehdit: 'Orta',
    tutum: -3,
    olcek: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1590424693427-0cf19aa3be00?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Kurbanın Bacaklarını Çevreleyip Yere Çeken Çevik Avcı',
    dert: 'Baskın Ateş ve Meşalelerden Ürkme',
    sir: 'Yaralı kurbanların kan kokusunu 5 mil öteden alabilir.',
    ipuclari: ['Sert gri kürk, sararmış sivri dişler, yere yakın sinsi yürüyüş.'],
    anlaticiNotlari: 'Arkadan saldırdığında hedefi yere devirir (Yere Düşmüş durumu).',
    yaklasimlar: { 'Zel-vash': 3, 'Ghardello': 2, 'Lithron': 2 },
    stats: { fight: 3, savunma: 2, yaraKutulari: 2, mevcutYara: 0 }
  },
  {
    id: 'beast_ayi_cukurtepe',
    ad: 'Çukurtepe Kızıl Pençeli Mağara Ayısı',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Liandryl',
    eyalet: 'Çukurtepe Kırsalı & Mağaralar',
    rol: 'Devasa Bölge Muhafızı',
    tehdit: 'Ölümcül',
    tutum: -2,
    olcek: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'İki İnsan Boyunda, Zırh Delen Pençelere Sahip Orman Hükümdarı',
    dert: 'Kış Uykusundan Erken Uyanmanın Getirdiği Dinmeyen Açlık ve Hiddet',
    sir: 'Sırtında eski bir madenci kazması saplanmış halde dolaşır, kazmayı çekmeye çalışanı parçalar.',
    ipuclari: ['Kalın kürkünün altında kurumuş kan tabakası.', 'Gürültülü soluma ve yer sarsan adımlar.'],
    anlaticiNotlari: 'Ezici darbe: 4dF vuruşunda en az 2 fark varsa hedefi duvara veya ağaca fırlatır (+3 hasar).',
    yaklasimlar: { 'Lithron': 5, 'Ghardello': 4, 'Zel-vash': 2, 'Xes-hart': 3 },
    stats: { fight: 4, savunma: 3, yaraKutulari: 6, mevcutYara: 0 }
  },
  {
    id: 'beast_pars_igneada',
    ad: 'İğneada Gölge Parsı',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Zieli',
    eyalet: 'İğneada Sık Ormanları',
    rol: 'Ağaç Tepesi Pusu Avcısı',
    tehdit: 'Yüksek',
    tutum: -2,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Göz Açıp Kapayıncaya Kadar Ağaç Dalları Arasında Kaybolan Katil Kedi',
    dert: 'Bölgesine Giren İnsanların Kokusuyla Çıldıran Bölgecilik',
    sir: 'Gece vaktinde gözleri ışık saçmaz, kürkünün yapısı meşale ışığını emer.',
    ipuclari: ['Ayak izi bırakmaz.', 'Ağaç kabuklarında derin tırmık yaraları.'],
    anlaticiNotlari: 'Ağaçtan atlayış: İlk vuruşta sürpriz avantajı (+3 vuruş) ve hedefi sessizce boğma denemesi.',
    yaklasimlar: { 'Zel-vash': 5, 'Ghardello': 3, 'Vizer': 3, 'Lodvez': 2 },
    stats: { fight: 3, savunma: 4, yaraKutulari: 3, mevcutYara: 0 }
  },
  {
    id: 'beast_tazi_selya',
    ad: 'Selya Bataklık Çamur Tazısı',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Selya',
    eyalet: 'Selyanya Bataklıkları',
    rol: 'İz Sürücü Saldırı Köpeği',
    tehdit: 'Orta',
    tutum: -2,
    olcek: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Çamura Batmadan Koşan ve Paçaya Kilitlenen Av Köpeği',
    dert: 'Selya Kaçakçıları Tarafından Zincirle Dövülerek Eğitilmiş Olma Travması',
    sir: 'Su altındaki kurbanların nefes kabarcıklarını bile koklayabilir.',
    ipuclari: ['Kısa sert tüyler, çamur tabakası, kan kırmızısı göz akı.'],
    anlaticiNotlari: 'Çene kilitleme: Isırdığı hedefin hareketini engeller; hedef kurtulmak için Lithron testi yapmalıdır.',
    yaklasimlar: { 'Zel-vash': 3, 'Ghardello': 3, 'Lithron': 2 },
    stats: { fight: 3, savunma: 2, yaraKutulari: 2, mevcutYara: 0 }
  },
  {
    id: 'beast_domuz_onneva',
    ad: 'Onneva Kuduz Zırhlı Yaban Domuzu',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Onneva',
    eyalet: 'Onneva Tahıl Havzası & Çalılıkları',
    rol: 'Vahşi Taarruz Tankı',
    tehdit: 'Orta',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1598755257130-c2aaca1f061c?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Gövdesi Kemik Plakalarla Kaplanmış, Körlemesine Yaran Domuz',
    dert: 'Kuduz Paraziti Yüzünden Acıyı Algılayamama ve Durmaksızın Saldırma',
    sir: 'Onneva tahıl ambarlarına bulaşan kara mahmuz mantarıyla beslendiği için çılgına dönmüştür.',
    ipuclari: ['Ağzından köpükler saçar.', 'Kavisli yarım metre uzunluğunda sarı fildişleri.'],
    anlaticiNotlari: 'Kör Hücum: Düz bir hatta 10 metre koşarak vurduğunda kalkanları deler ve kurbanı savurur.',
    yaklasimlar: { 'Lithron': 4, 'Ghardello': 3, 'Zel-vash': 1 },
    stats: { fight: 3, savunma: 2, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'beast_akbaba_kargasi',
    ad: 'Karga Tepesi Leş Akbabası',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Memanth',
    eyalet: 'Memanth Hududu & Savaş Kalıntıları',
    rol: 'Havadaki Fırsatçı Avcı',
    tehdit: 'Düşük',
    tutum: -2,
    olcek: 1,
    fotoUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Yaralı Askerlerin Gözlerini Oymak İçin Gökyüzünde Süzülen Dev Kuş',
    dert: 'Yalnızca Çürüyen ve Hareketsiz Hedeflere Cesaret Edebilme',
    sir: 'Eski savaş meydanındaki zehirli ok uçlarını yuttuğu için gagası enfeksiyonludur.',
    ipuclari: ['İki metre kanat açıklığı, tüysüz kırmızı kafa, keskin ciyaklama.'],
    anlaticiNotlari: 'Göz oyma hamlesi: Yaralı hedeflere vururken kör etme riski taşır.',
    yaklasimlar: { 'Zel-vash': 4, 'Vizer': 3, 'Ghardello': 1 },
    stats: { fight: 2, savunma: 3, yaraKutulari: 1, mevcutYara: 0 }
  },
  {
    id: 'beast_yilan_solgar',
    ad: 'Solgar Sazlık Boğucu Pitonu',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Solgar',
    eyalet: 'Solgar Gölleri & Sazlıkları',
    rol: 'Su Altı Pusu Sürüngeni',
    tehdit: 'Yüksek',
    tutum: -2,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1531386151447-fd7640330138?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Yedi Metrelik Kas Yığınıyla Hedefini Boğup Su Dibine Çeken Yılan',
    dert: 'Soğukkanlı Olması Nedeniyle Ateş ve Soğuk Büyülerine Karşı Hassasiyet',
    sir: 'Göl kenarında altın kolyeli bir tüccar cesedini yutmuş, midesinde ziynet taşır.',
    ipuclari: ['Sazlıkların arasında sessiz dalgalanmalar.', 'Timsah derisi kalınlığında pullar.'],
    anlaticiNotlari: 'Sarma ve Boğma: Başarılı vuruşta her tur otomatik 2 zırh yok sayan ezilme hasarı verir.',
    yaklasimlar: { 'Lithron': 4, 'Zel-vash': 3, 'Ghardello': 3 },
    stats: { fight: 3, savunma: 3, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'beast_cakal_surusu',
    ad: 'Bozkır Gece Çakalları',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Galet',
    eyalet: 'Galetsha Çorak Toprakları',
    rol: 'Grup Avcısı Hayvanlar',
    tehdit: 'Orta',
    tutum: -2,
    olcek: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1590424693427-0cf19aa3be00?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Kurbanın Etrafını Sarılarak Havlamalarla Dikkatini Dağıtan Çakal Sürüsü',
    dert: 'Büyük Yırtıcılara Karşı Korkak Olma',
    sir: 'Maden atıklarından sızan arsenikli suları içtikleri için kanları zehirlidir.',
    ipuclari: ['Kemikli cılız gövdeler, parlayan sarı gözler, tüyler ürpertici kahkahamsı uluma.'],
    anlaticiNotlari: 'Dikkati Dağıtma: Hedefin savunma zarına -2 ceza verdirir.',
    yaklasimlar: { 'Zel-vash': 3, 'Lodvez': 2, 'Ghardello': 2 },
    stats: { fight: 2, savunma: 2, yaraKutulari: 3, mevcutYara: 0 }
  },
  {
    id: 'beast_kartal_zirve',
    ad: 'Altavâr Ak Pençeli Av Kartalı',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Stallhart',
    eyalet: 'Başsancak Arava Zirveleri',
    rol: 'Göklerin Hakim Yırtıcısı',
    tehdit: 'Orta',
    tutum: -1,
    olcek: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Güneşin Önünden Dalışa Geçerek Hedefin Miğferini Yaran Yırtıcı Kuş',
    dert: 'Okçuların Menzilinden Kaçınma Zorunluluğu',
    sir: 'Arava Şahinler Loncası’ndan kaçmış eski bir soylu av kartalıdır.',
    ipuclari: ['Ayaklarında gümüş halka.', 'Jilet gibi çelikleşmiş pençe uçları.'],
    anlaticiNotlari: 'Hızlı Pike: Menzilli yay saldırılarına karşı +2 savunma; dalışta +2 darbe bonusu.',
    yaklasimlar: { 'Zel-vash': 5, 'Vizer': 4, 'Ghardello': 2 },
    stats: { fight: 3, savunma: 4, yaraKutulari: 2, mevcutYara: 0 }
  },
  {
    id: 'beast_akrep_kanyon',
    ad: 'Taş Kanyon Zırhlı Çöl Akrebi',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Memanth',
    eyalet: 'Kızıl Kanyon Yolu',
    rol: 'Kitin Zırhlı Zehirli Canlı',
    tehdit: 'Yüksek',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'İki Kıskaçlı, Sırtında Felç Edici Zehir İğnesi Taşıyan Dev Eklembacaklı',
    dert: 'Sırtındaki Hassas Eklemlerin Kılıç Darbelerine Açık Olması',
    sir: 'Kabuğundaki fosfor gece karanlığında hafifçe mor parıldar.',
    ipuclari: ['Kayanın renginde kitin kabuk.', 'Kuyruğun ucunda damlayan siyah zehir.'],
    anlaticiNotlari: 'Felç Edici Sokma: Zehir isabet ederse hedef 2 tur boyunca hareket edemez.',
    yaklasimlar: { 'Lithron': 4, 'Ghardello': 3, 'Zel-vash': 2 },
    stats: { fight: 3, savunma: 4, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'beast_kopekbaligi_meren',
    ad: 'Meren Karanlık Körfez Zıpkın Köpekbalığı',
    tur: 'Vahşi Hayvan',
    kategori: 'Vahşi Hayvan',
    hane: 'Meren',
    eyalet: 'Meren Derin Denizleri & Resifler',
    rol: 'Su Altı Canavarı',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Su İçinde Yıldırım Gibi Süzülen, Üç Sıra Çelik Dişli Deniz Dehşeti',
    dert: 'Karaya Çıkamama ve Sığ Sularda Manevra Kaybetme',
    sir: 'Batık korsan kalyonunun etrafında devriye gezerek hazineyi koruyan bekçi gibidir.',
    ipuclari: ['Yüzeyde keskin üçgen sırt yüzgeci.', 'Sudaki kan kokusunu hemen fark eder.'],
    anlaticiNotlari: 'Deniz Savaşı: Suda yapılan tüm yakın dövüşlerde +3 ezici vuruş ve kanama etkisi.',
    yaklasimlar: { 'Lithron': 5, 'Zel-vash': 4, 'Ghardello': 4 },
    stats: { fight: 4, savunma: 3, yaraKutulari: 5, mevcutYara: 0 }
  }
];

// ============================================================================
// CANAVARLAR & KADİM YARATIKLAR (MONSTERS & ELDRITCH HORRORS)
// ============================================================================
export const CANAVARLAR_VE_YARATIKLAR: NPC[] = [
  {
    id: 'monster_mor_kul_hortlagi',
    ad: 'Mor Kül Hortlağı ("Ölümsüz Madenci")',
    tur: 'Canavar',
    kategori: 'Hortlak / Yaratık',
    hane: 'Galetsha',
    eyalet: 'Galetsha Çökmüş Derin Galerileri',
    rol: 'Lanetli Kadim Yaşayan Ölü',
    tehdit: 'Yüksek',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Mor Rün Tozlarıyla Dirilen ve Acı Çığlıkları Atan Madenci Bedeni',
    dert: 'Güneş Işığı ve Kutsal Mabed Külüne Karşı Aşırı Zayıflık',
    sir: 'İçinde yanan kadim mor kor, öldüğünde patlayarak etrafa şarapnel saçar.',
    ipuclari: ['Kül kokusu.', 'Göz yuvalarından mor duman yükselir.', 'Derisi kömürleşmiştir.'],
    anlaticiNotlari: 'Mor Kül Dokunuşu: Vurulan oyuncunun zihnine +1 Leke ve korku aşılar.',
    yaklasimlar: { 'Lithron': 4, 'Ghardello': 3, 'Xes-hart': 4, 'Loth': 2 },
    stats: { fight: 3, savunma: 2, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'monster_cozulmus_buz_golemi',
    ad: 'Khasinya Çözülmüş Buz Golemi',
    tur: 'Canavar',
    kategori: 'Canavar',
    hane: 'Khasin',
    eyalet: 'Buzul Sırtları & Donmuş Göller',
    rol: 'Büyülü Buz Abidesi',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 5,
    fotoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Kadim Büyüyle Hareket Eden, Keskin Buz Sarkıtlarından Oluşmuş Heyula',
    dert: 'Yoğun Ateş Saldırıları ve Termal Şok Karşısında Çatlama',
    sir: 'Göğsünün ortasında Khasin hanesinin kayıp bir mührü buzun içine gömülüdür.',
    ipuclari: ['Her adımında zemin donar.', 'Yaklaştıkça nefes ciğerlerde donar.', 'Cam kırılması sesleri.'],
    anlaticiNotlari: 'Buz Zırhı: Fiziksel silahlardan alınan ilk 2 puan hasarı tamamen emer. Donma Dalgası yaratır.',
    yaklasimlar: { 'Lithron': 5, 'Ghardello': 4, 'Xes-hart': 3 },
    stats: { fight: 4, savunma: 4, yaraKutulari: 6, mevcutYara: 0 }
  },
  {
    id: 'monster_bataklik_cirkinligi',
    ad: 'Selya Bataklık Çirkinliği ("Balçık Yutan")',
    tur: 'Canavar',
    kategori: 'Canavar',
    hane: 'Selya',
    eyalet: 'Çürük Su Havzası',
    rol: 'Bataklık Dehşeti & Gulyabani',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Çürümüş Cesetler ve Bataklık Balçığının Birleşmesinden Doğan Devasa Yaratık',
    dert: 'Alevli Yağ ve Ateşli Silahların Bedenini Tutuşturması',
    sir: 'Bataklığa düşen soyluların yüzüklerini midesindeki balçıkta biriktirir.',
    ipuclari: ['Koku kilometrelerce öteden gelir.', 'Suyun altından kollar ve dokunaçlar uzanır.'],
    anlaticiNotlari: 'Balçık Yutuşu: Kurbanı içine çekmeye çalışır. Yutulan oyuncu her tur boğulma hasarı alır.',
    yaklasimlar: { 'Lithron': 4, 'Ghardello': 3, 'Lodvez': 3, 'Xes-hart': 4 },
    stats: { fight: 3, savunma: 3, yaraKutulari: 5, mevcutYara: 0 }
  },
  {
    id: 'monster_leke_ifriti',
    ad: 'Gölge Leke İfriti ("Aklın Çürümesi")',
    tur: 'Canavar',
    kategori: 'Kadim Boss',
    hane: 'Memanth',
    eyalet: 'Yasak Kütüphane Mahzenleri',
    rol: 'Ruhani Bozulma Varlığı',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Fiziksel Bedeni Olmayan, Sadece Zihinleri Delirten Gölgeli Dehşet',
    dert: 'Işık Rünleri ve Mabed Dualarının Ses Dalgaları Karşısında Dağılma',
    sir: 'Eski bir Konsey Büyücüsünün yasak deney sırasında bedenini kaybetmiş ruhudur.',
    ipuclari: ['Ortamdaki mumlar siyah alevle yanar.', 'Fısıltılar kafanın içinde yankılanır.'],
    anlaticiNotlari: 'Zihinsel Terör: Fiziksel zırhı yok sayar, doğrudan Zihinsel Tampon kutularına saldırır.',
    yaklasimlar: { 'Loth': 5, 'Xes-hart': 5, 'Lodvez': 4, 'Vizer': 3 },
    stats: { fight: 2, savunma: 5, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'monster_kizil_kan_vampiri',
    ad: 'Adamen Kan Lordu Uşağı ("Nosferat")',
    tur: 'Canavar',
    kategori: 'Hortlak / Yaratık',
    hane: 'Adamen',
    eyalet: 'Karanlık Mahzenler & Kriptalar',
    rol: 'Soylu Kan Emici Canavar',
    tehdit: 'Yüksek',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Aristokrat Kıyafetler İçinde Çürüyen, İnsan Kanına Aç Gece Avcısı',
    dert: 'Güneş Işığı ve Gümüş Alaşımlı Bıçakların Yakıcı Etkisi',
    sir: 'Adamen soylularının gizli davetlerinde kalan kurbanların cesetlerini temizlemektedir.',
    ipuclari: ['Bembeyaz solgun ten.', 'Uzamış sivri tırnaklar.', 'Pahalı kadife cübbe üzerinde kan lekeleri.'],
    anlaticiNotlari: 'Kan Emme: Verdiği hasar kadar kendi mevcut yarasını iyileştirir.',
    yaklasimlar: { 'Ghardello': 4, 'Zel-vash': 4, 'Lodvez': 3, 'Xes-hart': 3 },
    stats: { fight: 4, savunma: 3, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'monster_magara_wyrm',
    ad: 'Çukurtepe Derinlik Wyrm\'ı',
    tur: 'Canavar',
    kategori: 'Canavar',
    hane: 'Liandryl',
    eyalet: 'Çukurtepe Maden Kuyuları',
    rol: 'Yeraltı Tünel Canavarı',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 5,
    fotoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Gözleri Olmayan, Titreşimlerle Avlanan, Asit Kusucu Devasa Solucan-Ejder',
    dert: 'Ses Tuzakları ve Yüksek Frekanslı Metal Çınlamalarına Karşı Yönünü Şaşırma',
    sir: 'Madenin en zengin altın damarını yuva olarak kullanmakta ve yumurtalarını korumaktadır.',
    ipuclari: ['Kükürt kokusu.', 'Tünel duvarlarında erimiş kaya izleri.', 'Yer altından gelen derin gurultu.'],
    anlaticiNotlari: 'Asit Tükürüğü: Zırh puanlarını 1 tur boyunca yok sayar ve zırha kalıcı çentik atar.',
    yaklasimlar: { 'Lithron': 5, 'Ghardello': 4, 'Zel-vash': 2 },
    stats: { fight: 4, savunma: 4, yaraKutulari: 6, mevcutYara: 0 }
  },
  {
    id: 'monster_iskelet_korsan',
    ad: 'Meren Boğulmuş Kalyon İskeleti',
    tur: 'Canavar',
    kategori: 'Hortlak / Yaratık',
    hane: 'Meren',
    eyalet: 'Khasinya Kayalıkları Batıkları',
    rol: 'Lanetli Deniz Savaşçısı',
    tehdit: 'Orta',
    tutum: -3,
    olcek: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Yosun Tutmuş Kemiklerine Paslı Kılıç Kaynamış Hayalet Tayfa',
    dert: 'Kırıcı Çekiç ve Topuz Darbelerine Karşı Kemiklerin Kolayca Kırılması',
    sir: 'Kaptanın lanetli altın pusulasını göğüs kafesinde saklamaktadır.',
    ipuclari: ['Tuz kokusu, takırdayan kemikler, yırtık denizci yeleği.'],
    anlaticiNotlari: 'Delici silahlardan (ok, mızrak) sadece yarı hasar alır.',
    yaklasimlar: { 'Ghardello': 3, 'Lithron': 2, 'Zel-vash': 2 },
    stats: { fight: 2, savunma: 2, yaraKutulari: 2, mevcutYara: 0 }
  },
  {
    id: 'monster_runik_muhafiz',
    ad: 'Mabed Kadim Rünik Taş Muhafızı',
    tur: 'Canavar',
    kategori: 'Kadim Boss',
    hane: 'Mabed',
    eyalet: 'Terk Edilmiş Mabed Mahzenleri',
    rol: 'Büyülü Koruyucu Heykel',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 5,
    fotoUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Kutsal Yazıtlarla Donatılmış, Büyüye Bağışıklı İki Tonluk Mermer Heykel',
    dert: 'Büyü Mührünün Kazınması veya Rünlerin Kazmayla Kırılması Halinde Hareketsiz Kalma',
    sir: 'Kalbinde ilk Başrahibin kutsanmış yakut asası bulunmaktadır.',
    ipuclari: ['Gözlerinde parlayan altın rünler.', 'Her adımında zemin çatlar.'],
    anlaticiNotlari: 'Büyü Bağışıklığı: Her türlü büyüsel hasarı yok sayar, yalnızca saf fiziksel güçle yıkılabilir.',
    yaklasimlar: { 'Lithron': 5, 'Ghardello': 4, 'Xes-hart': 2 },
    stats: { fight: 4, savunma: 5, yaraKutulari: 7, mevcutYara: 0 }
  },
  {
    id: 'monster_ogre_zincirli',
    ad: 'Zindan Zincirli Dev Ogre',
    tur: 'Canavar',
    kategori: 'Canavar',
    hane: 'Stallhart',
    eyalet: 'Arava Zindan Çukurları',
    rol: 'Kontrolsüz Yıkım Makinesi',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Bileklerine Ağır Gülleler Zincirlenmiş, Körlemesine Salınan Dev İblis',
    dert: 'Aşırı Hantal Olması ve Arkadan Saldırılara Karşı Savunmasızlığı',
    sir: 'Eski bir saray muhafızı komutanı üzerinde yapılan yasak simya deneyinin kurbanıdır.',
    ipuclari: ['Körleştirilmiş sağ göz.', 'Vücuduna perçinlenmiş paslı demir plakalar.'],
    anlaticiNotlari: 'Zincir Süpürmesi: Ön saftaki tüm hedeflere aynı anda hasar verir.',
    yaklasimlar: { 'Lithron': 5, 'Ghardello': 3, 'Xes-hart': 3 },
    stats: { fight: 4, savunma: 2, yaraKutulari: 6, mevcutYara: 0 }
  },
  {
    id: 'monster_kurtadam_kripta',
    ad: 'Kripta Mezarlık Lanetlisi ("Ay Azmanı")',
    tur: 'Canavar',
    kategori: 'Canavar',
    hane: 'Onneva',
    eyalet: 'Onneva Eski Kriptaları',
    rol: 'Şekil Değiştiren Dehşet',
    tehdit: 'Yüksek',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Gündüzleri Ürkek Bir Mezarcı, Geceleri Kasaplaşan İki Metrelik Kurt Adam',
    dert: 'Gümüş Silahların Verdiği Hasarın İyileştirilememesi',
    sir: 'Köy muhtarının kayıp oğludur; muhtar onu öldürmesinler diye kriptaya kitlemektedir.',
    ipuclari: ['İnsan gözleri kurt suratında bakar.', 'Tırnakları mezar taşlarını parçalamıştır.'],
    anlaticiNotlari: 'Hızlı Yenilenme: Her tur sonunda 1 yara kutusunu otomatik temizler (gümüş hasarı hariç).',
    yaklasimlar: { 'Ghardello': 4, 'Zel-vash': 4, 'Lithron': 3, 'Xes-hart': 3 },
    stats: { fight: 4, savunma: 3, yaraKutulari: 5, mevcutYara: 0 }
  },
  {
    id: 'monster_katran_iblis',
    ad: 'Alevli Katran Canavarı',
    tur: 'Canavar',
    kategori: 'Canavar',
    hane: 'Arhan',
    eyalet: 'Galetsha Zift Çukurları',
    rol: 'Yanıcı Zift Yaratığı',
    tehdit: 'Yüksek',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Erimiş Katran ve Ziftten Meydana Gelen, Dokunduğu Her Şeyi Ateşe Veren Varlık',
    dert: 'Soğuk ve Su Büyülerinin Katranı Katılaştırıp Kırması',
    sir: 'Arhan simyacılarının ordu için ürettiği gizli yangın silahının kontrolden çıkmış halidir.',
    ipuclari: ['Kaynayan zift kabarcıkları.', 'Yoğun siyah duman ve is kokusu.'],
    anlaticiNotlari: 'Alev Püskürtme: Hedefe isabet ettiğinde 3 tur boyunca yanma durumu verir.',
    yaklasimlar: { 'Lithron': 4, 'Ghardello': 3, 'Loth': 3 },
    stats: { fight: 3, savunma: 3, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'monster_bataklik_hidrasi',
    ad: 'Selya Üç Başlı Zehir Hidrası',
    tur: 'Canavar',
    kategori: 'Kadim Boss',
    hane: 'Selya',
    eyalet: 'Selya Kara Gölcükleri',
    rol: 'Mitolojik Su Dehşeti',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 5,
    fotoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Her Biri Farklı Bir Yöne Saldıran, Zehir Salgılayan Üç Başlı Amfibi Ejder',
    dert: 'Kesilen Başın Ateşle Dağlanmaması Durumunda Yeniden Büyümesi',
    sir: 'Selya Lordlarının asırlar önce kurbanlar atarak beslediği kutsal tapınak yaratığıdır.',
    ipuclari: ['Su yeşili kalın pullar.', 'Ağızlarından asit buharı yükselir.', 'Üçlü tıslama korosu.'],
    anlaticiNotlari: 'Çoklu Saldırı: Aynı tur içinde 2 farklı hedefe eşzamanlı saldırı yapabilir.',
    yaklasimlar: { 'Lithron': 5, 'Ghardello': 4, 'Zel-vash': 3, 'Lodvez': 3 },
    stats: { fight: 5, savunma: 3, yaraKutulari: 7, mevcutYara: 0 }
  }
];

// ============================================================================
// TEHLİKELİ RASTGELE DÜŞMAN NPC'LER (BANDITS, ZEALOTS, SORCERERS, LEGIOS)
// ============================================================================
export const RASTGELE_DUSMAN_NPCLER: NPC[] = [
  {
    id: 'enemy_fanatik_engizitor',
    ad: 'Mabed Fanatik Engizitörü Malakor',
    tur: 'Önemli Rakip',
    kategori: 'İnsansı',
    hane: 'Mabed',
    eyalet: 'Başsancak Arava Engizisyon Avlusu',
    rol: 'Kutsal Ateş İnfazcısı',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Kafirlere Merhamet Etmeyen, Alevli Mabed Topuzu Taşıyan Engizitör',
    dert: 'Konseyin Bazı Soylularını Korumak İçin Verdiği Emirlere İtaat Etme İkilemi',
    sir: 'Kendisi de gizlice yasak kan büyüsü parşömeni okuyarak gücünü arttırmaktadır.',
    ipuclari: ['Kızıl cübbe, göğsünde pirinç mabed güneşi, demir çivili ağır topuz.'],
    anlaticiNotlari: 'Mabed Gazabı: Xes-hart ile kışkırtma yapar; kurban başarısız olursa korkudan kaçar.',
    yaklasimlar: { 'Ghardello': 4, 'Xes-hart': 4, 'Lithron': 3, 'Vizer': 2 },
    stats: { fight: 4, savunma: 3, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'enemy_arhan_suikastci',
    ad: 'Arhan Zehirli Hançer Avcısı ("Gölge Karası")',
    tur: 'Önemli Rakip',
    kategori: 'İnsansı',
    hane: 'Arhan',
    eyalet: 'Galetsha Sınır Kasabaları',
    rol: 'Sözleşmeli Suikastçı',
    tehdit: 'Yüksek',
    tutum: -3,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Kokusuz Zehirle Kaplanmış Çift Kama Sallayan Çatı Celladı',
    dert: 'Sessiz Pazar Loncası ile Arhan Hanesi Arasında İkili Casusluk Yapma Riski',
    sir: 'Darios Selya’nın yaverini zehirlemek için 500 Aron avans almıştır.',
    ipuclari: ['Karasu pelerini, parmak uçlarında zehir yanıkları, tek kelime etmez.'],
    anlaticiNotlari: 'Zehirli Bıçaklar: Her isabetli darbede hedef 2 tur boyunca zehir hasarı çeker.',
    yaklasimlar: { 'Zel-vash': 4, 'Lodvez': 4, 'Ghardello': 3 },
    stats: { fight: 3, savunma: 3, yaraKutulari: 3, mevcutYara: 0 }
  },
  {
    id: 'enemy_kan_buyucusu_adamen',
    ad: 'Adamen Kan Dokuyucusu Vespera',
    tur: 'Önemli Rakip',
    kategori: 'İnsansı',
    hane: 'Adamen',
    eyalet: 'Adamen Kırmızı Kulesi',
    rol: 'Yasak Büyü Ustası',
    tehdit: 'Ölümcül',
    tutum: -3,
    olcek: 4,
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Dökülen Kandan Büyülü Mızraklar Var Eden Sürgün Büyücü',
    dert: 'Kendi Damarlarını Yakan Yasak Kan Büyüsü Zehirlenmesi',
    sir: 'Stallhart arşivinden çalınan İlk Meclis Kan Anlaşması’nı yanında taşır.',
    ipuclari: ['Gözbebekleri kızıl hareyle çevrilidir.', 'Kollarında kan rünleri kazılıdır.'],
    anlaticiNotlari: 'Kan Mızrağı: Hedefin zırhını tamamen yok sayar (4dF + Loth).',
    yaklasimlar: { 'Loth': 5, 'Xes-hart': 4, 'Lodvez': 3, 'Zel-vash': 2 },
    stats: { fight: 3, savunma: 4, yaraKutulari: 4, mevcutYara: 0 }
  },
  {
    id: 'enemy_solgar_tahsildar',
    ad: 'Solgar Demir Baltalı Borç Tahsildarı Borgan',
    tur: 'Önemli Rakip',
    kategori: 'İnsansı',
    hane: 'Solgar',
    eyalet: 'Solgar Bankerler Çarşısı',
    rol: 'Kiralık Zorba & Kasap',
    tehdit: 'Orta',
    tutum: -2,
    olcek: 3,
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Ödenmeyen Senetlerin Karşılığını Kemik Kırarak Alan Dev Fedai',
    dert: 'Solgar Tüccarlarının Başarısızlık Durumunda Onu Zindana Attırma Korkusu',
    sir: 'Topladığı borçların üçte birini gizlice kendi zulasına aktarmaktadır.',
    ipuclari: ['Kısa çift balta, deri önlük, altın diş, kırık burun.'],
    anlaticiNotlari: 'Ağır Darbe: Vuruş farkı 2 ise hedefi sersemletir.',
    yaklasimlar: { 'Lithron': 4, 'Ghardello': 3, 'Aronlid': 3 },
    stats: { fight: 3, savunma: 2, yaraKutulari: 3, mevcutYara: 0 }
  },
  {
    id: 'enemy_korsan_barutcu',
    ad: 'Khasinya Korsan Barutçusu Zale',
    tur: 'Sıradan Figüran',
    kategori: 'İnsansı',
    hane: 'Khasin',
    eyalet: 'Khasinya Fırtına Koyu',
    rol: 'El Bombacısı & Kundakçı',
    tehdit: 'Orta',
    tutum: -2,
    olcek: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Kalyon Güvertelerine Çömlek Bombaları Fırlatan Çılgın Korsan',
    dert: 'Üzerindeki Fitillerin Islanması veya Kazara Patlaması',
    sir: 'Galantha donanmasının barut deposunun anahtarını çalmıştır.',
    ipuclari: ['İsli yüz, barut kokusu, omzunda meşale ve fitil çantası.'],
    anlaticiNotlari: 'Çömlek Bombası: Alandaki herkese 2 yangın hasarı verir.',
    yaklasimlar: { 'Rax-ed': 3, 'Zel-vash': 3, 'Lodvez': 2 },
    stats: { fight: 2, savunma: 2, yaraKutulari: 2, mevcutYara: 0 }
  },
  {
    id: 'enemy_dag_okcusu',
    ad: 'Karagöl Keskin Nişancı Çöl Avcısı',
    tur: 'Sıradan Figüran',
    kategori: 'İnsansı',
    hane: 'Memanth',
    eyalet: 'Kızıl Kanyon Kayalıkları',
    rol: 'Pusu Okçusu',
    tehdit: 'Orta',
    tutum: -2,
    olcek: 2,
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    anaKavram: 'Sarp Kayalardan Hedefin Gözünü Vuran Kompozit Yay Ustası',
    dert: 'Yakın Dövüşe Yakalanması Halinde Dayanıksız Olma',
    sir: 'Memanth sınır garnizonunun nöbet saatlerini haramilerle paylaşır.',
    ipuclari: ['Tüy başlıklı uzun oklar, kamuflaj pelerini, parmak koruyucu deri.'],
    anlaticiNotlari: 'Uzaktan Vuruş: Menzilli saldırıda +2 Vuruş kazanır.',
    yaklasimlar: { 'Rax-ed': 4, 'Vizer': 3, 'Zel-vash': 2 },
    stats: { fight: 3, savunma: 2, yaraKutulari: 2, mevcutYara: 0 }
  }
];

// ============================================================================
// TÜM EN DÜŞMAN VE CANAVARLAR LİSTESİ (TOPLU KOLEKSİYON)
// ============================================================================
export const TUM_YENI_DUSMANLAR: NPC[] = [
  ...VAHSI_HAYVANLAR,
  ...CANAVARLAR_VE_YARATIKLAR,
  ...RASTGELE_DUSMAN_NPCLER,
];

// ============================================================================
// DÜŞMAN ENCOUNTER GRUPLARI (HAZIR SAVAŞ EKİPLERİ - 4v4 & TAKIM)
// ============================================================================
export interface DusmanGrubu {
  id: string;
  ad: string;
  kategori: 'Vahşi Hayvan Sürüsü' | 'Kadim Canavar İni' | 'Eşkıya & Haydut Pususu' | 'Mabed Engizisyonu' | 'Leke Dehşeti';
  aciklama: string;
  taktikZemin: string;
  dusmanlar: NPC[];
}

export const HAZIR_DUSMAN_GRUPLARI: DusmanGrubu[] = [
  {
    id: 'grup_kurt_surusu',
    ad: '🐺 Khasinya Buz Kurdu Kuşatması (Sürü Baskını)',
    kategori: 'Vahşi Hayvan Sürüsü',
    aciklama: 'Tipi fırtınasında göz gözü görmezken partiyi çevreleyen aç ve dondurucu alfa kurt ve sürü avcıları.',
    taktikZemin: '🌫️ Zehirli Sis Bulutu',
    dusmanlar: [
      VAHSI_HAYVANLAR[0], // Khasinya Ayaz Kurdu ("Ak Yele")
      VAHSI_HAYVANLAR[1], // Ayaz Sürüsü Bozkır Kurdu
      VAHSI_HAYVANLAR[1], // Ayaz Sürüsü Bozkır Kurdu 2
      VAHSI_HAYVANLAR[3], // İğneada Gölge Parsı
    ]
  },
  {
    id: 'grup_canavar_ini',
    ad: '👹 Çukurtepe Derinlik Canavarı & Mağara Ayısı',
    kategori: 'Kadim Canavar İni',
    aciklama: 'Yeraltı maden tünellerinde uyanan kadim wyrm ve mağarasını savunan kızıl pençeli dev ayı.',
    taktikZemin: '🛡️ Yıkılmış Sütun (Siper)',
    dusmanlar: [
      CANAVARLAR_VE_YARATIKLAR[5], // Çukurtepe Derinlik Wyrm'ı
      VAHSI_HAYVANLAR[2],          // Çukurtepe Kızıl Pençeli Mağara Ayısı
      CANAVARLAR_VE_YARATIKLAR[0], // Mor Kül Hortlağı
    ]
  },
  {
    id: 'grup_bataklik_dehseti',
    ad: '🐊 Selya Balçık Gulyabanisi & Üç Başlı Hidra',
    kategori: 'Kadim Canavar İni',
    aciklama: 'Zehirli bataklık sazlıklarında kurbanlarını bekleyen balçık yutan çirkinlik ve boğucu pitonlar.',
    taktikZemin: '🩸 Kaygan Kan Zemini',
    dusmanlar: [
      CANAVARLAR_VE_YARATIKLAR[2],  // Bataklık Çirkinliği
      CANAVARLAR_VE_YARATIKLAR[11], // Selya Üç Başlı Zehir Hidrası
      VAHSI_HAYVANLAR[4],          // Bataklık Tazısı
      VAHSI_HAYVANLAR[7],          // Boğucu Piton
    ]
  },
  {
    id: 'grup_mabed_engizisyonu',
    ad: '⚖️ Mabed Kızıl Engizisyon İnfaz Mangası',
    kategori: 'Mabed Engizisyonu',
    aciklama: 'Kafirlik ve büyücülükle suçlananları ateşe vermek üzere kurulan fanatik infaz birliği.',
    taktikZemin: '🔥 Alevli Yağ Barikatı (+2 Saldırı)',
    dusmanlar: [
      RASTGELE_DUSMAN_NPCLER[0],   // Mabed Fanatik Engizitörü
      CANAVARLAR_VE_YARATIKLAR[7], // Rünik Taş Muhafızı
      RASTGELE_DUSMAN_NPCLER[5],   // Keskin Nişancı Okçu
      RASTGELE_DUSMAN_NPCLER[1],   // Zehirli Hançer Avcısı
    ]
  },
  {
    id: 'grup_leke_salgini',
    ad: '👁️ Kozmik Leke İfritleri & Kül Hortlakları',
    kategori: 'Leke Dehşeti',
    aciklama: 'Ruhani yozlaşmanın zirveye ulaştığı noktada peyda olan akıl çürütücü gölgeler ve yürüyen cesetler.',
    taktikZemin: '⚡ Çatlayan Rün Mührü',
    dusmanlar: [
      CANAVARLAR_VE_YARATIKLAR[3], // Leke İfriti
      CANAVARLAR_VE_YARATIKLAR[0], // Mor Kül Hortlağı
      CANAVARLAR_VE_YARATIKLAR[4], // Kan Vampiri
      CANAVARLAR_VE_YARATIKLAR[9], // Kripta Kurtadamı
    ]
  }
];

// ============================================================================
// DİNAMİK RASTGELE DÜŞMAN ÜRETİCİSİ (PROCEDURAL GENERATOR)
// ============================================================================
const CANAVAR_UNVANLARI = [
  'Karanlık Dehşeti', 'Buzul Azmanı', 'Kızıl Kükreyen', 'Kemik Kıran',
  'Zehir Salgılayan', 'Kör Pençeli', 'Balçık Yutan', 'Kutsal Lanetli',
  'Ayaz Yırtıcısı', 'Gölge Avcısı', 'Alev Kusan', 'Mahzen Hortlağı'
];

const CANAVAR_TUR_ISIMLERI = [
  'Ulu Kurt', 'Dev Mağara Ayısı', 'Gölge Kedisi', 'Zehirli Engerek',
  'Kül Hortlağı', 'Rünik Abide', 'Bataklık Canavarı', 'Bozkır Tazısı',
  'Karanlık İfriti', 'Demir Zırhlı Domuz', 'Korsan Zombisi', 'Kan Çıyanı'
];

export function rastgeleDusmanUret(turTipi: 'Vahşi Hayvan' | 'Canavar' | 'Rastgele NPC'): NPC {
  const unvan = CANAVAR_UNVANLARI[Math.floor(Math.random() * CANAVAR_UNVANLARI.length)];
  const isim = CANAVAR_TUR_ISIMLERI[Math.floor(Math.random() * CANAVAR_TUR_ISIMLERI.length)];
  const fight = Math.floor(Math.random() * 3) + 2; // 2..4
  const def = Math.floor(Math.random() * 3) + 2;   // 2..4
  const yara = Math.floor(Math.random() * 4) + 2;  // 2..5
  const tehditler: ('Düşük' | 'Orta' | 'Yüksek' | 'Ölümcül')[] = ['Orta', 'Yüksek', 'Ölümcül'];
  const seciliTehdit = tehditler[Math.floor(Math.random() * tehditler.length)];

  const haneler = ['Khasin', 'Liandryl', 'Selya', 'Memanth', 'Galetsha', 'Onneva', 'Arhan', 'Stallhart'];
  const seciliHane = haneler[Math.floor(Math.random() * haneler.length)];

  const fotolar = [
    'https://images.unsplash.com/photo-1564865878688-9a244444042a?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590424693427-0cf19aa3be00?w=600&auto=format&fit=crop&q=80'
  ];

  return {
    id: `procedural_${turTipi.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    ad: `${isim} ("${unvan}")`,
    tur: turTipi === 'Vahşi Hayvan' ? 'Vahşi Hayvan' : turTipi === 'Canavar' ? 'Canavar' : 'Önemli Rakip',
    kategori: turTipi === 'Vahşi Hayvan' ? 'Vahşi Hayvan' : turTipi === 'Canavar' ? 'Canavar' : 'İnsansı',
    hane: seciliHane,
    eyalet: `${seciliHane} Vahşi Sınırları`,
    rol: turTipi === 'Vahşi Hayvan' ? 'Vahşi Yırtıcı' : turTipi === 'Canavar' ? 'Kadim Yaratık' : 'Harami / Düşman',
    tehdit: seciliTehdit,
    tutum: -3,
    olcek: seciliTehdit === 'Ölümcül' ? 4 : 3,
    fotoUrl: fotolar[Math.floor(Math.random() * fotolar.length)],
    anaKavram: `${unvan} Özelliğiyle Bilinen ${isim}`,
    dert: 'Bölgesine Yaklaşan Herkesi Parçalama Vahşeti',
    sir: 'Kadim mühürlerin kırılmasıyla derin inlerden yüzeye çıkmıştır.',
    ipuclari: ['Karanlıkta parlayan gözler.', 'Kemik çatırtıları ve ağır nefes alıp verme.'],
    anlaticiNotlari: 'Vahşi Darbe: 4dF atışında başarı elde ettiğinde hedefin zırhına +1 ek yırtılma uygular.',
    yaklasimlar: {
      'Ghardello': fight,
      'Lithron': fight + 1,
      'Zel-vash': def,
      'Xes-hart': 2
    },
    stats: {
      fight,
      savunma: def,
      yaraKutulari: yara,
      mevcutYara: 0
    }
  };
}
