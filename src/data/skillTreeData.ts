export type BeceriDaliId = 'kan' | 'golge' | 'leke' | 'gunes';

export interface MuhurTuruTanimi {
  id: BeceriDaliId;
  ad: string;
  ikon: string;
  renk: string;
  badgeSinifi: string;
  aciklama: string;
  kazanimYolu: string;
}

export const MUHURLER: Record<BeceriDaliId, MuhurTuruTanimi> = {
  kan: {
    id: 'kan',
    ad: 'Kızıl Kan Mührü',
    ikon: '🩸',
    renk: '#e11d48',
    badgeSinifi: 'bg-rose-950/80 border-rose-600 text-rose-300',
    aciklama: 'Demir, kılıç ve hayatta kalma azminin kutsal kan damgası.',
    kazanimYolu: 'Ölümcül muharebelerden sağ çıkma, düşman komutanlarını devirme ve ağır yaralıyken zafer kazanma.'
  },
  golge: {
    id: 'golge',
    ad: 'Kuzgun Gölge Mührü',
    ikon: '🗡️',
    renk: '#10b981',
    badgeSinifi: 'bg-emerald-950/80 border-emerald-600 text-emerald-300',
    aciklama: 'Karanlık sokakların, sessiz hançerlerin ve çalınan sırların mührü.',
    kazanimYolu: 'Saray entrikalarını çözme, pusu kurma, kraliyet kasalarını açma ve fark edilmeden sızma.'
  },
  leke: {
    id: 'leke',
    ad: 'Leke ve Boşluk Mührü',
    ikon: '🔮',
    renk: '#a855f7',
    badgeSinifi: 'bg-purple-950/80 border-purple-600 text-purple-300',
    aciklama: 'Yasak Loth ilminin, fısıldayan kadim rünlerin ve tekinsizliğin işareti.',
    kazanimYolu: 'Yasak parşömenleri çözme, öte dünya lekesini aşma ve engizisyon takibinden kurtulma.'
  },
  gunes: {
    id: 'gunes',
    ad: 'Güneş ve Terazi Mührü',
    ikon: '✨',
    renk: '#eab308',
    badgeSinifi: 'bg-amber-950/80 border-amber-500 text-amber-200',
    aciklama: 'Denge Konseyi ilahlarının, Erau’nun nurunun ve Lidros terazisinin ilahi nişanesi.',
    kazanimYolu: 'Mabed ayinlerini yönetme, adil hüküm verme, kutsal yeminleri tutma ve mazlumu koruma.'
  }
};

export interface YetenekDugumu {
  id: string;
  dalId: BeceriDaliId;
  dalAdi: string;
  ad: string;
  unvan: string;
  seviye: 1 | 2 | 3 | 4; // 4 = Apex (Zirve Hüner)
  onKosulIds: string[];
  muhurMaliyeti: number;
  kaderPuaniMaliyeti?: number;
  ikon: string;
  aciklama: string;
  oyunMekanigi: string;
  durumSinerjisi?: string; // İlgili durum efekti: 'Kanamalı', 'Sersemlemiş', 'Kutsanmış', etc.
  pasifBonusMetni: string;
  x: number; // Görsel koordinat (yüzde veya grid)
  y: number;
}

export const YETENEK_AGACI_DUGUMLERI: YetenekDugumu[] = [
  // ============================================================
  // 1. DAL: DEMİR VE KAN YOLU (WARRIOR / SURVIVAL)
  // ============================================================
  {
    id: 'kan_1_celik_bilek',
    dalId: 'kan',
    dalAdi: 'Demir ve Kan Yolu',
    ad: 'Çelik Bilek & Sert Duruş',
    unvan: 'Temel Muharip Eğitimi',
    seviye: 1,
    onKosulIds: [],
    muhurMaliyeti: 1,
    ikon: '🛡️',
    aciklama: 'Arava kışlalarında ve Galdor ocaklarında dövülen çelik irade.',
    oyunMekanigi: 'Ghardello ve Lithron ile yapılan tüm savunma hamlelerinde +1 Savunma zarı sağlar.',
    durumSinerjisi: 'Çelik Siper',
    pasifBonusMetni: '+1 Savunma Zarı',
    x: 15,
    y: 15
  },
  {
    id: 'kan_2_kanatan_darbe',
    dalId: 'kan',
    dalAdi: 'Demir ve Kan Yolu',
    ad: 'Kızıl Cellat Çentiği',
    unvan: 'Yırtıcı Hüner',
    seviye: 2,
    onKosulIds: ['kan_1_celik_bilek'],
    muhurMaliyeti: 2,
    ikon: '🩸',
    aciklama: 'Kılıcın veya baltanın çentiğiyle et koparan vahşi vuruş tekniği.',
    oyunMekanigi: 'Başarılı vuruşlarda hedefe otomatik "Kanamalı" (1 Hasar/Tur, -1 Zar) durumu uygular.',
    durumSinerjisi: 'Kanamalı',
    pasifBonusMetni: 'Vuruşta Kanamalı Uygular',
    x: 8,
    y: 38
  },
  {
    id: 'kan_2_kirilmaz_siper',
    dalId: 'kan',
    dalAdi: 'Demir ve Kan Yolu',
    ad: 'Galdor Kalkan Duvarı',
    unvan: 'Kırılmaz Savunma',
    seviye: 2,
    onKosulIds: ['kan_1_celik_bilek'],
    muhurMaliyeti: 2,
    ikon: '🏰',
    aciklama: 'Siper arkasında kilitlenerek düşman oklarına ve balyozlarına göğüs germe sanatı.',
    oyunMekanigi: 'Savunma duruşuna geçildiğinde karaktere anında "Çelik Siper" durumu bahşeder (+2 Savunma).',
    durumSinerjisi: 'Çelik Siper',
    pasifBonusMetni: '+2 Kalkan Savunması',
    x: 22,
    y: 38
  },
  {
    id: 'kan_3_ezici_balyoz',
    dalId: 'kan',
    dalAdi: 'Demir ve Kan Yolu',
    ad: 'Kemik Kıran Darbe',
    unvan: 'Zırh Parçalayan',
    seviye: 3,
    onKosulIds: ['kan_2_kanatan_darbe'],
    muhurMaliyeti: 3,
    ikon: '💥',
    aciklama: 'Tüm gövde ağırlığını silahın ucuna yükleyen ezici darbe.',
    oyunMekanigi: 'Vuruş başarılı olduğunda hedefe "Sersemlemiş" (-2 Zar, -2 Sav) durumu vurur ve zırhını 1 tur kırar.',
    durumSinerjisi: 'Sersemlemiş',
    pasifBonusMetni: 'Sersemletme & Zırh Kırma',
    x: 15,
    y: 62
  },
  {
    id: 'kan_4_olumsuz_hiddet',
    dalId: 'kan',
    dalAdi: 'Demir ve Kan Yolu',
    ad: 'Ölümsüz Hiddet (Apex)',
    unvan: 'Zirve Hüneri · Kağan Muhafızı',
    seviye: 4,
    onKosulIds: ['kan_3_ezici_balyoz', 'kan_2_kirilmaz_siper'],
    muhurMaliyeti: 4,
    kaderPuaniMaliyeti: 1,
    ikon: '⚡',
    aciklama: 'Ölümün kapısını tekmeleyerek kan revan içinden efsanevi bir gazapla doğuş.',
    oyunMekanigi: 'Son yara kutusu dolduğunda karakter düşmez; anında "Hiddetli" (+2 Hasar) durumuna geçer ve öldürücü darbeyi 0 hasara indirir.',
    durumSinerjisi: 'Hiddetli',
    pasifBonusMetni: 'Ölümcül Darbeyi Yutar & +2 Gazap Hasarı',
    x: 15,
    y: 88
  },

  // ============================================================
  // 2. DAL: GÖLGE VE FISILTI YOLU (ROGUE / STEALTH)
  // ============================================================
  {
    id: 'golge_1_sessiz_adim',
    dalId: 'golge',
    dalAdi: 'Gölge ve Fısıltı Yolu',
    ad: 'Kuzgun Adımı (Pusucu)',
    unvan: 'Temel Suikast Eğitimi',
    seviye: 1,
    onKosulIds: [],
    muhurMaliyeti: 1,
    ikon: '👣',
    aciklama: 'Çakıl taşları üzerinde bile ses çıkarmayan yumuşak tabanlı adımlar.',
    oyunMekanigi: 'Lodvez ve Zel-vash ile yapılan gizlilik ve çeviklik atışlarına +2 bonus verir.',
    pasifBonusMetni: '+2 Gizlilik & Pusuda Serbest Çağrı',
    x: 40,
    y: 15
  },
  {
    id: 'golge_2_solgun_sizi',
    dalId: 'golge',
    dalAdi: 'Gölge ve Fısıltı Yolu',
    ad: 'Solgun Sızı Simyası',
    unvan: 'Zehir Üstadı',
    seviye: 2,
    onKosulIds: ['golge_1_sessiz_adim'],
    muhurMaliyeti: 2,
    ikon: '🧪',
    aciklama: 'Engerek zehrini kök sularıyla damıtarak bıçak ağzına yedirme ustalığı.',
    oyunMekanigi: 'Yakın dövüş veya menzilli saldırılarda hedefe "Zehirlenmiş" (1 Hasar/Tur, -1 Zar) durumu aşılar.',
    durumSinerjisi: 'Zehirlenmiş',
    pasifBonusMetni: 'Bıçakta Zehirlenmiş Durumu',
    x: 33,
    y: 38
  },
  {
    id: 'golge_2_keskin_goz',
    dalId: 'golge',
    dalAdi: 'Gölge ve Fısıltı Yolu',
    ad: 'Avcı Sezgisi',
    unvan: 'Soğukkanlı Nişancı',
    seviye: 2,
    onKosulIds: ['golge_1_sessiz_adim'],
    muhurMaliyeti: 2,
    ikon: '🎯',
    aciklama: 'Hedefin zayıf eklemlerini ve zırh deliklerini nefesini tutarak tespit etme.',
    oyunMekanigi: 'Çatışma başlangıcında kullanıcıya otomatik "Odaklanmış" (+1 Zar, +1 Savunma) durumu sağlar.',
    durumSinerjisi: 'Odaklanmış',
    pasifBonusMetni: 'Tur Başı Odaklanmış Bonusu',
    x: 47,
    y: 38
  },
  {
    id: 'golge_3_sis_perdesi',
    dalId: 'golge',
    dalAdi: 'Gölge ve Fısıltı Yolu',
    ad: 'Kireç ve Kükürt Sisi',
    unvan: 'Kör Eden Taktisyen',
    seviye: 3,
    onKosulIds: ['golge_2_solgun_sizi'],
    muhurMaliyeti: 3,
    ikon: '👁️‍🗨️',
    aciklama: 'Kireç tozu ve kükürt bombasıyla hasmın gözlerini yakıp görüşünü yok etme.',
    oyunMekanigi: 'Başarılı kaçınma veya saldırıda rakibi "Körleşmiş" (-2 Zar, -2 Savunma) durumuna mahkûm eder.',
    durumSinerjisi: 'Körleşmiş',
    pasifBonusMetni: 'Düşmanı Körleştirme',
    x: 40,
    y: 62
  },
  {
    id: 'golge_4_golge_danscisi',
    dalId: 'golge',
    dalAdi: 'Gölge ve Fısıltı Yolu',
    ad: 'Karanlığın Sureti (Apex)',
    unvan: 'Zirve Hüneri · Gölge Celladı',
    seviye: 4,
    onKosulIds: ['golge_3_sis_perdesi', 'golge_2_keskin_goz'],
    muhurMaliyeti: 4,
    kaderPuaniMaliyeti: 1,
    ikon: '🌑',
    aciklama: 'Karanlığın içine eriyip düşmanın tam arkasında beliren efsanevi suikast sanatı.',
    oyunMekanigi: 'Gölgeden yapılan ilk vuruşta hedefin savunma zarını tamamen yok sayar (Savunma = 0); hem Kanamalı hem Zehirlenmiş uygular!',
    durumSinerjisi: 'Zehirlenmiş',
    pasifBonusMetni: 'Savunmayı Yok Sayan Gizli Vuruş',
    x: 40,
    y: 88
  },

  // ============================================================
  // 3. DAL: YASAK RÜNLER VE LEKE YOLU (OCCULT / LOTH)
  // ============================================================
  {
    id: 'leke_1_run_dokuma',
    dalId: 'leke',
    dalAdi: 'Yasak Rünler ve Leke Yolu',
    ad: 'Fısıldayan Rün Dokuması',
    unvan: 'Temel Loth Eğitimi',
    seviye: 1,
    onKosulIds: [],
    muhurMaliyeti: 1,
    ikon: '🔮',
    aciklama: 'Havadaki görünmez leke liflerini parmak uçlarıyla eğirip rün nakşetme.',
    oyunMekanigi: 'Loth ile büyü yaparken Büyü Bedeli tablosunda "Başarısız" sonucunu "Denk" seviyesine çeker.',
    pasifBonusMetni: 'Büyü Bedeli Korunması & Loth Serbestisi',
    x: 65,
    y: 15
  },
  {
    id: 'leke_2_wyrfir_alevi',
    dalId: 'leke',
    dalAdi: 'Yasak Rünler ve Leke Yolu',
    ad: 'Wyrfir Katran Alevi',
    unvan: 'Alev Dokuyucu',
    seviye: 2,
    onKosulIds: ['leke_1_run_dokuma'],
    muhurMaliyeti: 2,
    ikon: '🔥',
    aciklama: 'Zel-vash ve Loth ile tutuşturulan söndürülemez mor katran alevleri.',
    oyunMekanigi: 'Büyü hamleleri hedefe doğrudan "Alevler İçinde" (2 Hasar/Tur, -1 Savunma) durumu yakar.',
    durumSinerjisi: 'Alevler İçinde',
    pasifBonusMetni: '2 Yara/Tur Katran Yangını',
    x: 58,
    y: 38
  },
  {
    id: 'leke_2_dehset_aurasi',
    dalId: 'leke',
    dalAdi: 'Yasak Rünler ve Leke Yolu',
    ad: 'Maraz’ın Soğukluğu',
    unvan: 'Korku Hükümdarı',
    seviye: 2,
    onKosulIds: ['leke_1_run_dokuma'],
    muhurMaliyeti: 2,
    ikon: '💀',
    aciklama: 'Ölümün ve mezar taşlarının soğuk aurasını etrafa fısıldama.',
    oyunMekanigi: 'Düşmanların zihnini felç ederek onları "Dehşet İçinde" (-2 Zar) durumuna sokar.',
    durumSinerjisi: 'Dehşet İçinde',
    pasifBonusMetni: 'Zihin Felci & Dehşet Aurası',
    x: 72,
    y: 38
  },
  {
    id: 'leke_3_zirh_parcalayan_loth',
    dalId: 'leke',
    dalAdi: 'Yasak Rünler ve Leke Yolu',
    ad: 'Öz Çürüten Rün',
    unvan: 'Gedik Açıcı',
    seviye: 3,
    onKosulIds: ['leke_2_wyrfir_alevi'],
    muhurMaliyeti: 3,
    ikon: '⚡',
    aciklama: 'Düşmanın demir zırhını ve toplumsal Sabit Eşiğini çürüten karanlık formül.',
    oyunMekanigi: 'Yasak Rün Büyüsü yapıldığında hedefin Zırhını 0 sayar; Sabit Eşik olan düşmanlara bedelsiz Gedik açar.',
    pasifBonusMetni: 'Zırh Delme & Sabit Eşik Kırma',
    x: 65,
    y: 62
  },
  {
    id: 'leke_4_leke_hakimi',
    dalId: 'leke',
    dalAdi: 'Yasak Rünler ve Leke Yolu',
    ad: 'Leke Hakimi (Apex)',
    unvan: 'Zirve Hüneri · Gölge Vezirinin Çırağı',
    seviye: 4,
    onKosulIds: ['leke_3_zirh_parcalayan_loth', 'leke_2_dehset_aurasi'],
    muhurMaliyeti: 4,
    kaderPuaniMaliyeti: 1,
    ikon: '🧿',
    aciklama: 'Lekeye boyun eğmek yerine onun efendisi olarak boşluğa hükmetme.',
    oyunMekanigi: 'Büyü Bedeli hasarlarını tamamen reddeder; devirdiği her güçlü düşmandan +1 Kader Mührü kazanır!',
    pasifBonusMetni: 'Büyü Hasar Bağışıklığı & Mühür Emme',
    x: 65,
    y: 88
  },

  // ============================================================
  // 4. DAL: MABED VE İLAHİ DENGE YOLU (FAITH / DIVINE JUSTICE)
  // ============================================================
  {
    id: 'gunes_1_mabed_nuru',
    dalId: 'gunes',
    dalAdi: 'Mabed ve İlahi Denge Yolu',
    ad: 'Era’nın Kutsal Nuru',
    unvan: 'Temel Ruhaniyet Eğitimi',
    seviye: 1,
    onKosulIds: [],
    muhurMaliyeti: 1,
    ikon: '✨',
    aciklama: 'Denge Konseyi mabedlerinde kireçle kutsanmış tertemiz ruh.',
    oyunMekanigi: 'Karaktere muharebe ve yargılama boyunca pasif olarak "Kutsanmış" (+2 Zar, +1 Savunma) durumu sağlar.',
    durumSinerjisi: 'Kutsanmış',
    pasifBonusMetni: '+2 Kutsanmış Zar & +1 Savunma',
    x: 90,
    y: 15
  },
  {
    id: 'gunes_2_gunah_arinma',
    dalId: 'gunes',
    dalAdi: 'Mabed ve İlahi Denge Yolu',
    ad: 'Kutsal Arınma Dokunuşu',
    unvan: 'Can Suyunun Elleri',
    seviye: 2,
    onKosulIds: ['gunes_1_mabed_nuru'],
    muhurMaliyeti: 2,
    ikon: '🌿',
    aciklama: 'Dualar ve pelid otuyla bedenleri kanamadan, zehirden ve korkudan arındırma.',
    oyunMekanigi: 'Kendisinden veya bir müttefikten Kanamalı, Zehirlenmiş ve Dehşet İçinde durumlarını derhal siler.',
    pasifBonusMetni: 'Tüm Kötü Durumları Arındırma',
    x: 83,
    y: 38
  },
  {
    id: 'gunes_2_adil_hukum',
    dalId: 'gunes',
    dalAdi: 'Mabed ve İlahi Denge Yolu',
    ad: 'Lidros’un Terazisi',
    unvan: 'Hakikat Hakimi',
    seviye: 2,
    onKosulIds: ['gunes_1_mabed_nuru'],
    muhurMaliyeti: 2,
    ikon: '⚖️',
    aciklama: 'Rüşvetin, yalanın ve hilekar unvanların terazide tartılıp hiçe sayılması.',
    oyunMekanigi: 'Aldris (Hukuk) ve Erau atışlarında rakiplerin unvan Aspect\'leri çağrılamaz; Sabit Eşik 2 basamak düşürülür.',
    pasifBonusMetni: 'Hukukta Sabit Eşik Bastırma',
    x: 97,
    y: 38
  },
  {
    id: 'gunes_3_isiltili_kalkan',
    dalId: 'gunes',
    dalAdi: 'Mabed ve İlahi Denge Yolu',
    ad: 'Güneş Duvarı Siperi',
    unvan: 'Mabed Şampiyonu',
    seviye: 3,
    onKosulIds: ['gunes_2_gunah_arinma'],
    muhurMaliyeti: 3,
    ikon: '☀️',
    aciklama: 'Güneşin kavurucu kalkanını müttefiklerin üzerine açan kutsal koruma duası.',
    oyunMekanigi: 'Tüm gruba anında "Çelik Siper" ve "Odaklanmış" durumu aşılar; karanlık büyü saldırılarını saptırır.',
    durumSinerjisi: 'Çelik Siper',
    pasifBonusMetni: 'Tüm Gruba Çelik Siper & Koruma',
    x: 90,
    y: 62
  },
  {
    id: 'gunes_4_denge_elcisi',
    dalId: 'gunes',
    dalAdi: 'Mabed ve İlahi Denge Yolu',
    ad: 'Denge Konseyi Hükümdarı (Apex)',
    unvan: 'Zirve Hüneri · Mabed Başrahibi',
    seviye: 4,
    onKosulIds: ['gunes_3_isiltili_kalkan', 'gunes_2_adil_hukum'],
    muhurMaliyeti: 4,
    kaderPuaniMaliyeti: 1,
    ikon: '👑',
    aciklama: 'Kireçle çizilen kutsal çemberle savaşları durduran veya ilahi adaletle infaz eden başrahip gücü.',
    oyunMekanigi: 'Sahne boyunca 1 kez Dello Düellosu veya Lomera Barışı ilan edebilir; tüm dostlara kalıcı +3 Kutsal Zar desteği verir!',
    durumSinerjisi: 'Kutsanmış',
    pasifBonusMetni: 'Lomera Barışı & +3 İlahi Destek',
    x: 90,
    y: 88
  }
];

// Helper Functions
export function getCharacterSeals(karakter: any): { kan: number; golge: number; leke: number; gunes: number } {
  return {
    kan: karakter.muhurler?.kan ?? 2,
    golge: karakter.muhurler?.golge ?? 2,
    leke: karakter.muhurler?.leke ?? 1,
    gunes: karakter.muhurler?.gunes ?? 2
  };
}

export function isNodeUnlocked(karakter: any, nodeId: string): boolean {
  return (karakter.yetenekler || []).includes(nodeId);
}

export function canUnlockNode(karakter: any, node: YetenekDugumu): { possible: boolean; reason?: string } {
  if (isNodeUnlocked(karakter, node.id)) {
    return { possible: false, reason: 'Bu yetenek zaten öğrenildi.' };
  }

  // Check prerequisites
  for (const preId of node.onKosulIds) {
    if (!isNodeUnlocked(karakter, preId)) {
      const preNode = YETENEK_AGACI_DUGUMLERI.find((n) => n.id === preId);
      return {
        possible: false,
        reason: `Önce "${preNode?.ad || preId}" yeteneğini öğrenmelisiniz.`
      };
    }
  }

  // Check unique seal requirement
  const seals = getCharacterSeals(karakter);
  const sealAvailable = seals[node.dalId] || 0;
  if (sealAvailable < node.muhurMaliyeti) {
    const sealInfo = MUHURLER[node.dalId];
    return {
      possible: false,
      reason: `Yetersiz Mühür: ${node.muhurMaliyeti} adet ${sealInfo.ad} gerekli (Mevcut: ${sealAvailable}).`
    };
  }

  // Check Fate point requirement (if apex)
  if (node.kaderPuaniMaliyeti) {
    const kp = karakter.kaderPuani ?? 3;
    if (kp < node.kaderPuaniMaliyeti) {
      return {
        possible: false,
        reason: `Apex Hüneri için ${node.kaderPuaniMaliyeti} Kader Puanı gerekli (Mevcut: ${kp}).`
      };
    }
  }

  return { possible: true };
}
