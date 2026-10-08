import { EyaletInfo } from './initialData';

export const CANON_EYALETLER: EyaletInfo[] = [
  {
    id: 'merkez_stallhart',
    ad: 'Başsancak (Taç Diyarı - Arava)',
    hane: 'Stallhart',
    vali: 'İmparator Amadon Stallhart & Prens Zeandor',
    nufus: '2.500.000',
    gecim: 'İmparatorluk Hukuku, Saray İdaresi, Niron Nehri Ticareti',
    tarihce: 'Taş burçların gökyüzünü yardığı, imparatorluk kararlarının alındığı kadim merkez. Kanunlar katı, Craber muhafızları ve Elit Birlik affetmezdir.',
    tehlikeSeviyesi: 'Orta',
    kesfedildi: true,
    x: 48,
    y: 45,
    pinler: [
      { id: 'p1', ad: 'Arava Yüksek Taht Salonu', tur: 'Lonca', aciklama: 'Kağan Amadon ve Kurultay vezirlerinin toplandığı mermer salon.' },
      { id: 'p2', ad: 'Terziler Bayırı & Gümüş İğne', tur: 'Han', aciklama: 'Sessiz Avcı ve gölge tüccarlarının gizli buluşma adresi.' },
      { id: 'p3', ad: 'Çatlak Kafatası Meyhanesi', tur: 'Han', aciklama: 'Kayıt memurları ve kaçakçıların kumar oynadığı tekinsiz yer altı sığınağı.' },
      { id: 'p4', ad: 'Arava Zindan İdaresi', tur: 'Kısla', aciklama: 'Almonth’un haksız mürekkep hatasıyla idam edildiği batı kalesi.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Saray Kütüphanesi Arşiv Muhafızlığı', odul: '20 Aron', detay: 'Yasak parşömenlerin çalınmasını engelleyin.' },
      riskli: { baslik: 'Çatlak Kafatası Borç Senedini Ele Geçir', odul: '45 Aron + Hançer', detay: 'Yozlaşmış kâtibin tahrif ettiği mahkeme kaydını zorla geri alın.' },
      tuzak: { baslik: 'Kılıç Geçidi Koruması', odul: '75 Aron', detay: 'Başkomutan Albea kortejine katılın. Suikastçıların pususu bekleniyor!' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'selyanya',
    ad: 'Selya Eyaleti & Güneş Körfezi',
    hane: 'Selya',
    vali: 'Celios Selya, Darios Selya & Zeandor Stallhart',
    nufus: '1.500.000',
    gecim: 'Kalyon İnşası, Deniz Ticareti, Baharat İthalatı, Raylı Yük Vinçleri',
    tarihce: 'Altın güneşin aydınlattığı zengin kıyılar. Prens Zeandor burada sürgünde büyümüş, raylı yük vinçlerini icat etmiş ve Karagöl çetesini burada ezmiştir.',
    tehlikeSeviyesi: 'Düşük',
    kesfedildi: true,
    x: 65,
    y: 35,
    pinler: [
      { id: 'p5', ad: 'Prens İskelesi & Raylı Vinçler', tur: 'Lonca', aciklama: 'Zeandor ve Usta Zylan’ın inşa ettiği devasa yük vinçleri.' },
      { id: 'p6', ad: 'Kör Yengeç Tavernası', tur: 'Han', aciklama: 'Kör kâhinin oturduğu, denizcilerin toplandığı köhne meyhane.' },
      { id: 'p7', ad: 'Selya Valilik Konağı & Bahçeleri', tur: 'Kısla', aciklama: 'Celios, Darios ve Elyndra’nın yaşadığı korunaklı konak.' },
      { id: 'p8', ad: 'Gümrük Binası & Yazıhaneler', tur: 'Lonca', aciklama: 'Baron Linroth’un vergi ve sevkiyatları yönettiği merkez.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Liman Kâtipliği Defter Kontrolü', odul: '15 Aron', detay: 'Tüccarların kaçak kumaş beyanlarını denetleyin.' },
      riskli: { baslik: 'Kör Yengeç’teki Tehdidi Çöz', odul: '40 Aron', detay: 'Zeandor’a yönelen sinsi dedikodunun kaynağını bulun.' },
      tuzak: { baslik: 'Korsan Gemisi Karşılaması', odul: '70 Aron + Zırh', detay: 'Galantha açıklarında kaçakçı kalyonunu durdurun.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'galetsha_eyalet',
    ad: 'Galetsha Eyaleti & Thundar Dağları',
    hane: 'Galetsha',
    vali: 'Metron Galet / Wolrez Galet ("Direnen Kurt")',
    nufus: '1.200.000',
    gecim: 'Bakır Madenciliği, Döküm Ocakları, Kükürt ve Silah İhracatı',
    tarihce: 'Yüzyıllardır imparatorluğun zırhlarını ve kılıçlarını döken maden kalesi. Bayrağında kilitli anahtar motifi bulunur; yer altı galerilerinde isyan fısıltıları dolaşır.',
    tehlikeSeviyesi: 'Yüksek',
    kesfedildi: true,
    x: 40,
    y: 25,
    pinler: [
      { id: 'p9', ad: 'Kuzey Döküm Ocakları', tur: 'Lonca', aciklama: 'Bakır külçelerinin eritildiği devasa bacalı fırınlar.' },
      { id: 'p10', ad: 'Thundar Kaya Galerileri', tur: 'Tehlike', aciklama: 'Maden işçilerinin kazma salladığı kükürtlü karanlık tüneller.' },
      { id: 'p11', ad: 'Galetsha Hisar Kapısı', tur: 'Kısla', aciklama: 'Maden tozuyla altın-bakır rengine bürünmüş aşılmaz surlar.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Bakır Kervanı Koruması', odul: '25 Aron', detay: 'Dağ geçidinde maden konvoyuna refakat edin.' },
      riskli: { baslik: 'Galet Muhafızlarıyla Müzakere', odul: '50 Aron', detay: 'İşçi hakları için valinin kâhyasıyla görüşün.' },
      tuzak: { baslik: 'Çöküntü Tünelinden Kurtarma', odul: '80 Aron', detay: 'Metan gazı biriken derin galeride mahsur kalanları çıkarın.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'bakirsu_vadisi_loc',
    ad: 'Bakırsu Vadisi & Kanlı Boğaz',
    hane: 'Arhan',
    vali: 'İsyancı Komutan Erthan & Zeandor Müzakere Karargâhı',
    nufus: '150.000',
    gecim: 'Paslı Nehirler, Çadır Karargâhları, Maden Kaçakçıları',
    tarihce: 'Reun Solgar’ın süvarilerinin balçığa gömüldüğü sarp boğaz. Erthan madencileriyle burada direnmiş, Zeandor ile gizli barış fermanını burada imzalamıştır.',
    tehlikeSeviyesi: 'Ölümcül',
    kesfedildi: true,
    x: 42,
    y: 32,
    pinler: [
      { id: 'p12', ad: 'Erthan’ın Müzakere Çadırı', tur: 'Gorev', aciklama: 'Zeandor ile Erthan’ın baş başa pazarlık ettiği keçe çadır.' },
      { id: 'p13', ad: 'Kızılkuyu Çakıllı Düzlüğü', tur: 'Tehlike', aciklama: '3.500 imparatorluk mızrağı ile madencilerin karşılaştığı alan.' },
      { id: 'p14', ad: 'Selrin Kılıcının Kaybolduğu Boğaz', tur: 'Tehlike', aciklama: 'Efsanevi Liandryl kılıcının toprağa emanet edildiği sarp yarık.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Yaralı Madencileri Tedavi Et', odul: '20 Aron', detay: 'Şifacı sargılarıyla nehir kıyısındaki yaralılara yardım edin.' },
      riskli: { baslik: 'Solgar Kalıntısı Silahları Topla', odul: '45 Aron', detay: 'Bataklığa gömülen zırh ve kargıları çıkarın.' },
      tuzak: { baslik: 'Rikan Berkov’un Kışkırtmasını Önle', odul: '75 Aron', detay: 'Elit Lejyon subayının barışı bozmasını engelleyin.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'igneada_orman_loc',
    ad: 'İğneada Ormanı & Karagöl Boğazı',
    hane: 'Stallhart',
    vali: 'Gölge Karakolları (Eski Reisi: Kara Hodrev)',
    nufus: '80.000',
    gecim: 'Kerestecilik, Avcılık, Karagöl Çetesi Yağma Kalıntıları',
    tarihce: 'Çamurlu patikaları ve sisli ağaçlarıyla ünlü orman. Erthan atı Doru’yla burada tuzağa düşmüş, Zeandor ise Kara Hodrev’in kellesini bu mağaralarda almıştır.',
    tehlikeSeviyesi: 'Yüksek',
    kesfedildi: true,
    x: 52,
    y: 40,
    pinler: [
      { id: 'p15', ad: 'Kara Hodrev’in Gizli Mağarası', tur: 'Tehlike', aciklama: 'Karagöl Çetesi’nin yağma sandıklarını sakladığı derin galeri.' },
      { id: 'p16', ad: 'Kendir İpi At Tuzağı Yolu', tur: 'Tehlike', aciklama: 'Süvarileri devirmek için kurulan gizli halat düzeneği.' },
      { id: 'p17', ad: 'Jarome Köyü Külleri', tur: 'Gorev', aciklama: 'Elda ve Vidor’un haydutlara karşı direndiği yanık yerleşke.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Orman Yolunu Devriye Gez', odul: '20 Aron', detay: 'Sazlık kolda pusu kuran çetecileri püskürtün.' },
      riskli: { baslik: 'Hodrev’in Yağma Zulasını Bul', odul: '50 Aron', detay: 'Gizli mağaradaki çalınmış Selya kadehlerini kurtarın.' },
      tuzak: { baslik: 'Haydut Artçısını Yakala', odul: '65 Aron', detay: 'Ormanda pusuya yatan son çete üyelerini adalete teslim edin.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'kemik_sirti_arathen',
    ad: 'Kemik Sırtı & Arathen Hududu',
    hane: 'Arathen',
    vali: 'Kral Leno Kridas ("Buzun Oğlu") & General Derevon Kessen',
    nufus: '800.000',
    gecim: 'Volkanik Madenler, Demir Zırh Dökümü, Soğuk Lejyonlar',
    tarihce: 'Doğu sınırının dondurucu kayalıkları. Sol serçe parmağı kopuk Kral Leno Kridas, kar leoparı sancakları altında Stallhart’ın çöküşünü bekler.',
    tehlikeSeviyesi: 'Ölümcül',
    kesfedildi: true,
    x: 75,
    y: 20,
    pinler: [
      { id: 'p18', ad: 'Kalet Şehri & Eretan Dağı', tur: 'Kısla', aciklama: 'Lav nehirleriyle çevrili volkanik maden kenti ve meşe taht odası.' },
      { id: 'p19', ad: 'Buzlu Karakollar & Sınır Siperleri', tur: 'Tehlike', aciklama: 'General Derevon’un gözcülerinin beklediği çetin siperler.' },
      { id: 'p20', ad: 'Kimera Sancağı Karargâhı', tur: 'Lonca', aciklama: 'Kar leoparı ve dağ keçisi boynuzlu Arathen ordusunun üssü.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Ayaz Nöbetine Katıl', odul: '30 Aron', detay: 'Sınır taşlarındaki gözcü hattını teftiş edin.' },
      riskli: { baslik: 'Arathen Elçisinin Rotasını İncele', odul: '55 Aron', detay: 'Örebas’a giden gizli ittifak mektubunu tespit edin.' },
      tuzak: { baslik: 'Kemik Sırtı Düellosu', odul: '90 Aron + Zırh', detay: 'Sınır akıncılarının şampiyonunu teke tekte durdurun.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'orebas_altavar',
    ad: 'Örebas Krallığı & Altavâr Şehri',
    hane: 'Örebas',
    vali: 'Kral Kjizma & Prenses Veyra',
    nufus: '1.800.000',
    gecim: 'Bankalar Konsorsiyumu, Akçelik Gümüş Sikke, Deniz Ticareti',
    tarihce: 'Kıtanın bankalarının toplandığı, kraliçe arı sancağı taşıyan zengin krallık. Altavâr’ın Tenvîr Çarşısı’nda her dil konuşulur, altın asla kaybetmez.',
    tehlikeSeviyesi: 'Düşük',
    kesfedildi: true,
    x: 25,
    y: 60,
    pinler: [
      { id: 'p21', ad: 'Bankalar Federasyonu & Merkez', tur: 'Lonca', aciklama: 'Kuzey Loncası Altın Muhasebe Evi’nin mermer sütunlu binası.' },
      { id: 'p22', ad: 'Kral Kjizma’nın Fıskiyeli Bahçeleri', tur: 'Gorev', aciklama: 'Kjizma ve Elçi Ellan’ın diplomatik hesaplar yaptığı bahçe yolu.' },
      { id: 'p23', ad: 'Prenses Veyra’nın Doğu Çam Köşkü', tur: 'Gorev', aciklama: 'Calden’in beklediği, Prenses Veyra’nın gizli talimat verdiği köşk.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Akçelik Gümüş Taşımacılığı', odul: '25 Aron', detay: 'Banka kasasına külçe gümüş teslimatına refakat edin.' },
      riskli: { baslik: 'Tenvîr Çarşısı Casusunu Yakala', odul: '50 Aron', detay: 'Kumaş tüccarı kılığındaki yabancı ajanı izleyin.' },
      tuzak: { baslik: 'Banka Mahzeni Soygununu Önle', odul: '85 Aron', detay: 'Merkez kasaya tünel kazan çeteyi durdurun.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'cukurtepe_koyu',
    ad: 'Çukurtepe Köyü & Almonth’un Toprakları',
    hane: 'Arhan',
    vali: 'Baron Valer (Açgözlü Toprak Ağası)',
    nufus: '45.000',
    gecim: 'Tahıl Tarımı, Değirmenler, Ağalık Vergileri',
    tarihce: 'Erthan’ın doğduğu, babası Almonth’un tek koluyla sürdüğü killi tarla. Baron Valer’in kasvetli granit malikânesi tepede yükselir.',
    tehlikeSeviyesi: 'Orta',
    kesfedildi: true,
    x: 45,
    y: 50,
    pinler: [
      { id: 'p24', ad: 'Baron Valer’in Granit Malikânesi', tur: 'Kısla', aciklama: 'Erthan’ın rehin anlaşmasını imzaladığı sıcak maun odalı konak.' },
      { id: 'p25', ad: 'Almonth’un İsli Ocağı', tur: 'Gorev', aciklama: 'Sarya’nın beklediği, tahta kılıçlarla talim yapılan baba evi.' },
      { id: 'p26', ad: 'Çukurtepe Su Değirmeni', tur: 'Han', aciklama: 'Köylülerin buğday öğütüp fısıltıları paylaştığı eski değirmen.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Sarya Ana’ya Odun ve Ekmek Taşı', odul: '15 Aron', detay: 'Soğuk kulübeye erzak ulaştırın.' },
      riskli: { baslik: 'Baron Valer’in Kâhyası Olin’i Atlat', odul: '35 Aron', detay: 'Köylülerin sakladığı tohumluk tahılı koruyun.' },
      tuzak: { baslik: 'Valer’in Ağalık Muhafızlarıyla Çatış', odul: '60 Aron', detay: 'Haksız haciz koyan tahsildarları püskürtün.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'solgar_eyalet',
    ad: 'Solgar Eyaleti & Ticaret Kalyonları',
    hane: 'Solgar',
    vali: 'Edun Solgar & Reun Solgar',
    nufus: '1.500.000',
    gecim: 'Bankerlik, Tahvil İhracı, Gümrük İmtiyazları, Nehir Taşımacılığı',
    tarihce: 'Zümrüt yeşili armaların dalgalandığı, imparatorluk maliyesini kontrol eden tüccar eyaleti. Reun’un süvarileri burada yetiştirilir.',
    tehlikeSeviyesi: 'Orta',
    kesfedildi: true,
    x: 35,
    y: 42,
    pinler: [
      { id: 'p27', ad: 'Solgar Hazine Malikânesi', tur: 'Lonca', aciklama: 'Edun Solgar’ın mühür taşlarını çevirdiği abanoz masalı oda.' },
      { id: 'p28', ad: 'Khasinya İskele Yolu', tur: 'Gorev', aciklama: 'Zellan’ın kalyonları sevk ettiği gümrük kapısı.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Poliçe Arşivini Güvenceye Al', odul: '25 Aron', detay: 'Banker senetlerini koruyun.' },
      riskli: { baslik: 'Reun Solgar’ın İstihbaratını Sızdır', odul: '50 Aron', detay: 'Saraydaki gizli mektubu ele geçirin.' },
      tuzak: { baslik: 'Solgar Korumalarını Aş', odul: '75 Aron', detay: 'Zehirli muhafız mangasını etkisiz hale getirin.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'mabed_eyalet',
    ad: 'Mabed Eyaleti & Denge Konseyi',
    hane: 'Mabed',
    vali: 'Yüce Rahip Ertler Serbam & Serme Onneva',
    nufus: '500.000',
    gecim: 'Tapınak Vakıfları, Kutsal Kan Ayinleri, Adak ve Ziyaretçiler',
    tarihce: 'Denge Konseyi’nin 15 Tanrı sunağı ve 6 Ezgi kütüphanesinin bulunduğu mukaddes topraklar. Ak mermerler ve tütsü buharlarıyla kaplıdır.',
    tehlikeSeviyesi: 'Düşük',
    kesfedildi: true,
    x: 30,
    y: 55,
    pinler: [
      { id: 'p29', ad: 'Centruion Yüksek Tapınağı', tur: 'Lonca', aciklama: 'İlahi Mühür ve 15 Tanrı tasvirlerinin yükseldiği ana katedral.' },
      { id: 'p30', ad: 'Kutsal Kan Lahitleri & Katakomp', tur: 'Tehlike', aciklama: 'Merhum imparatorların mumyalandığı yer altı dehlizleri.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Mukaddes Mersiye Arşivini Koru', odul: '20 Aron', detay: 'Maraz ve Şifa ilahilerini temize çekin.' },
      riskli: { baslik: 'Yasak Büyü Parşömenini Araştır', odul: '45 Aron', detay: 'Katakomptaki gizli odayı bulun.' },
      tuzak: { baslik: 'Tapınak Engizisyonundan Kaç', odul: '70 Aron', detay: 'Kutsal Kan doktrinini sorgulayanları savunun.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1548625361-19597793d5f9?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'adamen_cuce_eyalet',
    ad: 'Adamen Cüce Eyaleti & Nimge',
    hane: 'Irun',
    vali: 'Cüce Valisi Gulwar Saert',
    nufus: '400.000',
    gecim: 'Derin Damar Madenciliği, Granit Oymacılığı, Demir İşçiliği',
    tarihce: 'Güneş görmez yeraltı şehirleri. Cüceler kükürt kokulu kaya yarıklarında kazma sallar; Lord Lithrez ve Craeknor hanesi burada tüneller kazar.',
    tehlikeSeviyesi: 'Yüksek',
    kesfedildi: true,
    x: 28,
    y: 30,
    pinler: [
      { id: 'p31', ad: 'Gulwar Saert’in Cevher Kürsüsü', tur: 'Lonca', aciklama: 'Cüce valisinin İmparatorlukla pazarlık yaptığı granit salon.' },
      { id: 'p32', ad: 'Nimge Yeraltı Galerileri', tur: 'Tehlike', aciklama: 'Magma ocaklarına inen raylı tahta vagon hatları.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Cüce Balyozlarını Yağla', odul: '20 Aron', detay: 'Örs ocaklarında demircilere yardım edin.' },
      riskli: { baslik: 'Kaya Lordları Fısıltısını Dinle', odul: '45 Aron', detay: 'İsyan hazırlığındaki tünel liderlerini öğrenin.' },
      tuzak: { baslik: 'Yeraltı Canavarı Taşınmasını Durdur', odul: '80 Aron', detay: 'Derin çatlaklardan tırmanan yaratığı püskürtün.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80' } as any)
  },
  {
    id: 'zela_lougat_eyalet',
    ad: 'Zela Eyaleti & Lougat Malikânesi',
    hane: 'Zela',
    vali: 'Heongea Yonja / Arba İtrez (Dravor)',
    nufus: '700.000',
    gecim: 'Kalderyan Taşçılığı, Keten Dokuma, Şarap Bağları',
    tarihce: 'Arba İtrez’in (Dravor) derin-kapak casusluk ağını yönettiği topraklar. Eron Gjin ve casus Albess’in kaderi bu malikânede kesişmiştir.',
    tehlikeSeviyesi: 'Orta',
    kesfedildi: true,
    x: 38,
    y: 36,
    pinler: [
      { id: 'p33', ad: 'İtrez Malikânesi & Çalışma Odası', tur: 'Gorev', aciklama: 'Arba ve Lena’nın Arathen raporlarını hazırladığı gizli oda.' },
      { id: 'p34', ad: 'Lougat Mahzenleri & İnfaz Meydanı', tur: 'Tehlike', aciklama: 'Casus Albess’in zincirlendiği zindan.' }
    ],
    isPanosu: {
      guvenli: { baslik: 'Bağ Evi Hasatını Koru', odul: '20 Aron', detay: 'Kalderyan üzüm bağlarını teftiş edin.' },
      riskli: { baslik: 'Gizli Parşömen Mührünü Çöz', odul: '50 Aron', detay: 'Eron Gjin’in kurye çantasındaki notu deşifre edin.' },
      tuzak: { baslik: 'İtrez Muhafızlarından Kaç', odul: '75 Aron', detay: 'Gece basılan gizli toplantıdan sağ kurtulun.' }
    },
    ...({ wallpaperUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&auto=format&fit=crop&q=80' } as any)
  }
];
