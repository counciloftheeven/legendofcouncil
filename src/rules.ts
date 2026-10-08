/**
 * STALLHART MASAÜSTÜ RPG SİSTEM REFERANS BELGESİ (SRD)
 * Fate tabanlı 4dF sistemi · Sıfatlar Merdiveni · On Dört Yaklaşım
 * "Aron hanar, Edron rion. Ezra gharan tod dor."
 * (Altın kan, Demir birlik. Ölüme kadar savaşırız.)
 */

// ==========================================
// 1. SIFATLAR MERDİVENİ (-2 Berbat .. +8 Efsanevi)
// ==========================================
export interface MerdivenBasamak {
  deger: number;
  baslik: string;
  ingilizce: string;
  renk: string;
  aciklama: string;
}

export const SIFATLAR_MERDIVENI: MerdivenBasamak[] = [
  { deger: 8, baslik: 'Efsanevi', ingilizce: 'Legendary', renk: 'text-amber-300 font-black', aciklama: 'Tarihe geçen, ilahi sınırındaki mucizevi kudret.' },
  { deger: 7, baslik: 'Destansı', ingilizce: 'Epic', renk: 'text-amber-400 font-bold', aciklama: 'Kıtalar boyu yankılanan kahramanlık seviyesi.' },
  { deger: 6, baslik: 'Muhteşem', ingilizce: 'Fantastic', renk: 'text-yellow-400 font-bold', aciklama: 'Destansı, şansa bağlı en yüksek ölümlü iş.' },
  { deger: 5, baslik: 'Olağanüstü', ingilizce: 'Superb', renk: 'text-emerald-400 font-bold', aciklama: 'Sıradan insanların hayal bile edemeyeceği ustalık.' },
  { deger: 4, baslik: 'Harika', ingilizce: 'Great', renk: 'text-teal-400 font-semibold', aciklama: 'Usta zanaatkâr ve kıdemli savaşçıların seviyesi.' },
  { deger: 3, baslik: 'İyi', ingilizce: 'Good', renk: 'text-cyan-400 font-semibold', aciklama: 'Eğitimli ve ehil bir uzmanın doğal seviyesi.' },
  { deger: 2, baslik: 'Makul', ingilizce: 'Fair', renk: 'text-blue-400', aciklama: 'Ehil olmayanların zorlandığı sağlam ortalama.' },
  { deger: 1, baslik: 'Orta', ingilizce: 'Average', renk: 'text-indigo-300', aciklama: 'Gündelik sıradan kasabalı yeterliliği.' },
  { deger: 0, baslik: 'Sıradan', ingilizce: 'Mediocre', renk: 'text-stone-400', aciklama: 'Çabasız iş; zar atmaya bile değmez.' },
  { deger: -1, baslik: 'Zayıf', ingilizce: 'Poor', renk: 'text-orange-400', aciklama: 'Yetersiz, kusurlu ya da acemice deneme.' },
  { deger: -2, baslik: 'Berbat', ingilizce: 'Terrible', renk: 'text-red-500 font-bold', aciklama: 'Tam bir fiyasko ve felaketle sonuçlanan adım.' }
];

export function merdivenDerecesiBul(toplam: number): string {
  const match = SIFATLAR_MERDIVENI.find(m => m.deger === toplam);
  if (match) return `${match.baslik} (${toplam >= 0 ? '+' : ''}${toplam})`;
  if (toplam > 8) return `Efsanevi Ötesi (+${toplam})`;
  return `Felaket (${toplam})`;
}

// Zorluklar
export const ZORLUKLAR = {
  Siradan: 0,   // Çabasız; zar atmaya değmez
  Makul: 2,     // Ehil olmayan zorlanır
  Harika: 4,    // Usta bile zorlanır
  Muhtesem: 6   // Destansı, şansa bağlı iş
};

// ==========================================
// 2. ON DÖRT YAKLAŞIM (14 APPROACHES)
// ==========================================
export type YaklasimKategori = 'Beden' | 'Söz ve Gölge' | 'Ağ ve Kaynak' | 'İlim ve Sezgi' | 'İrade';

export type YaklasimAdi =
  | 'Ghardello'
  | 'Rax-ed'
  | 'Lithron'
  | 'Zel-vash'
  | 'Lodvez'
  | 'Ver-ed'
  | 'Xes-hart'
  | 'Vize-rion'
  | 'Aronlid'
  | 'Erau'
  | 'Aldris'
  | 'Loth'
  | 'Vizer'
  | 'Edor / Edros';

export interface YaklasimDetay {
  ad: YaklasimAdi;
  kategori: YaklasimKategori;
  fateKarsiligi: string;
  kapsami: string;
  hatRolu: string;
  renk: string;
}

export const YAKLASIMLAR: Record<YaklasimAdi, YaklasimDetay> = {
  'Ghardello': {
    ad: 'Ghardello',
    kategori: 'Beden',
    fateKarsiligi: 'Fight (Yakın Dövüş)',
    kapsami: 'Meydan talimi, kalkan duvarı nizami duruşu ve resmî Dello tekil düelloları.',
    hatRolu: 'Fiziksel · Saldırı, Savunma',
    renk: '#dc2626'
  },
  'Rax-ed': {
    ad: 'Rax-ed',
    kategori: 'Beden',
    fateKarsiligi: 'Shoot (Menzilli Dövüş)',
    kapsami: 'Yay, tatar yayı, zırh delen arbaletler ve Meren zıpkınları.',
    hatRolu: 'Fiziksel · Saldırı',
    renk: '#ea580c'
  },
  'Lithron': {
    ad: 'Lithron',
    kategori: 'Beden',
    fateKarsiligi: 'Physique (Beden Gücü)',
    kapsami: 'Plaka zırh taşıma, maden kazması sallama, enkaz kaldırma, cüce gövde mukavemeti.',
    hatRolu: '—',
    renk: '#b45309'
  },
  'Zel-vash': {
    ad: 'Zel-vash',
    kategori: 'Beden',
    fateKarsiligi: 'Athletics (Çeviklik)',
    kapsami: 'Çevik manevra, bataklık ve sarp arazide denge, elf zarafeti ve Meren akışı.',
    hatRolu: 'Fiziksel · Savunma',
    renk: '#16a34a'
  },
  'Lodvez': {
    ad: 'Lodvez',
    kategori: 'Söz ve Gölge',
    fateKarsiligi: 'Deceive (Aldatma)',
    kapsami: 'Yalan, sahte itiraf, kılık değiştirme ve niyet gizleme.',
    hatRolu: 'İtibar · Saldırı',
    renk: '#9333ea'
  },
  'Ver-ed': {
    ad: 'Ver-ed',
    kategori: 'Söz ve Gölge',
    fateKarsiligi: 'Rapport (İlişki Kurma)',
    kapsami: 'Meclis teşrifatı, cüce yumruk açısı adabı, elf aristokratik hitabeti.',
    hatRolu: 'İtibar · Savunma',
    renk: '#3b82f6'
  },
  'Xes-hart': {
    ad: 'Xes-hart',
    kategori: 'Söz ve Gölge',
    fateKarsiligi: 'Provoke (Kışkırtma, Baskı)',
    kapsami: 'Kutsal Kan heybeti, Engizisyon tehdidi, düşmanı hata yapmaya zorlama.',
    hatRolu: 'Zihinsel · Saldırı',
    renk: '#e11d48'
  },
  'Vize-rion': {
    ad: 'Vize-rion',
    kategori: 'Ağ ve Kaynak',
    fateKarsiligi: 'Contacts (Bağlantılar)',
    kapsami: 'İstihbarat ağı, meyhane kulağı, liman fısıltıları, Aralis gözleri.',
    hatRolu: '—',
    renk: '#0284c7'
  },
  'Aronlid': {
    ad: 'Aronlid',
    kategori: 'Ağ ve Kaynak',
    fateKarsiligi: 'Resources (Kaynaklar)',
    kapsami: 'Solgar poliçeleri, banker kredisi, eyalet tahvili ve gümrük payları.',
    hatRolu: '—',
    renk: '#eab308'
  },
  'Erau': {
    ad: 'Erau',
    kategori: 'İlim ve Sezgi',
    fateKarsiligi: 'İlahiyat (Din ve Teoloji)',
    kapsami: 'Denge Konseyi’nin 6 Ezgisi, 15 Tanrı dogması, Mabed hukuku ve ritüeller.',
    hatRolu: '—',
    renk: '#8b5cf6'
  },
  'Aldris': {
    ad: 'Aldris',
    kategori: 'İlim ve Sezgi',
    fateKarsiligi: 'Lore (Tarih, Hukuk, Kütük)',
    kapsami: 'Vergi defterleri, imparatorluk fermanları, sınır protokolleri ve şecereler.',
    hatRolu: 'İtibar · Savunma (hukuki itham)',
    renk: '#0d9488'
  },
  'Loth': {
    ad: 'Loth',
    kategori: 'İlim ve Sezgi',
    fateKarsiligi: 'Magic / Crafts / Alchemy (Büyü, Zanaat, Simya)',
    kapsami: 'Galetsha simyası, maden gazları, dağlama yağları, zehirler ve yasak büyü kalıntıları.',
    hatRolu: 'Zihinsel · Saldırı (büyü)',
    renk: '#c026d3'
  },
  'Vizer': {
    ad: 'Vizer',
    kategori: 'İlim ve Sezgi',
    fateKarsiligi: 'Investigate & Notice (Keşif ve Sezgi)',
    kapsami: 'İnce detayları, sahte mühürleri, pusu izlerini ve vadi tuzaklarını sezme.',
    hatRolu: 'Sosyal Kavga sırası',
    renk: '#059669'
  },
  'Edor / Edros': {
    ad: 'Edor / Edros',
    kategori: 'İrade',
    fateKarsiligi: 'Will (İrade ve Dirayet)',
    kapsami: 'İşkencede çözülmeme, korkuya direnme, zihinsel tahakkümü püskürtme.',
    hatRolu: 'Zihinsel · Savunma',
    renk: '#4f46e5'
  }
};

// Yaklaşım Dağılım Kuralı: +4 ×1, +3 ×2, +2 ×3, +1 ×3, 0 ×2, −1 ×3
export const YAKLASIM_PIRAMIDI = {
  dort: 1,    // +4
  uc: 2,      // +3
  iki: 3,     // +2
  bir: 3,     // +1
  sifir: 2,   // 0
  eksiBir: 3  // -1
};

// ==========================================
// 3. ÖLÇEK (TOPLUMUN MERDİVENİ - 10 BASAMAK)
// ==========================================
export interface OlcekBasamagi {
  basamak: number;
  unvan: string;
  kimler: string;
  aciklama: string;
  baslangic?: 'Soylu' | 'Halktan';
}

export const OLCEK_MERDIVENI: OlcekBasamagi[] = [
  { basamak: 10, unvan: 'İmparator', kimler: 'Tahtta oturan İmparator (Anxes); tanrısal otorite.', aciklama: 'Yalnızca Anlatıcı oynatır.' },
  { basamak: 9, unvan: 'Kutsal Kan Sahibi', kimler: 'Stallhart hanedanı kanı; Kutsal Kan heybeti.', aciklama: 'Yalnızca insanlara aittir; oyun başlangıcı için çok ağırdır.' },
  { basamak: 8, unvan: 'Yönetici', kimler: 'Kurultay’da görevli Şad, Vezir, Melik.', aciklama: 'Kadim insan-olmayan varlıkların tavanı.' },
  { basamak: 7, unvan: 'General', kimler: 'Ordu komutanı, kıdemli komutan, Karabıçak başı.', aciklama: 'Binlerce askerin ve kale garnizonunun efendisi.' },
  { basamak: 6, unvan: 'Vali Ailesi', kimler: 'Kale-şehir lordu (Kont), Vali/Han ve ailesi.', aciklama: 'Eyalet mülkünün ve divanının başı.' },
  { basamak: 5, unvan: 'Soylu Aile', kimler: 'Baron/Ağa, Bey/Lord ailesi, tapınak başı.', aciklama: 'Soylu karakter başlangıcı (Yenileme: 3).', baslangic: 'Soylu' },
  { basamak: 4, unvan: 'Asker', kimler: 'Nizami ordu mensubu: kale muhafızı, erbaş, subay.', aciklama: 'Sancak taşıyan resmî kolluk kuvveti.' },
  { basamak: 3, unvan: 'Memur', kimler: 'Divan kâtibi, vergi ve gümrük görevlisi, kasaba kâhyası.', aciklama: 'Kütük ve mühür yetkilisi.' },
  { basamak: 2, unvan: 'Sıradan Halk', kimler: 'Çiftçi, madenci, tüccar, paralı, kolcu.', aciklama: 'Halktan karakter başlangıcı (Yenileme: 4).', baslangic: 'Halktan' },
  { basamak: 1, unvan: 'Köle', kimler: 'Mülk sayılan, hukuken hakkı olmayan kişi.', aciklama: 'Yalnızca Anlatıcı onayıyla oyuncu başlangıcı olur.' }
];

// ==========================================
// 4. TÜR VE IRKLAR (6 TÜR, 12 IRK)
// ==========================================
export type TurAdi = 'İnsan' | 'Zieli' | 'Irun' | 'Yaban' | 'Kadim-Kan' | 'Meren';

export interface IrkInfo {
  ad: string;
  tur: TurAdi;
  kimlik: string;
  egilimYaklasimi: YaklasimAdi;
  anlaticiOnayi?: boolean;
}

export const TUR_VE_IRKLAR: Record<string, IrkInfo> = {
  Eran: { ad: 'Eran', tur: 'İnsan', kimlik: 'Başsancak ve ova insanı; hane, kan ve yemin.', egilimYaklasimi: 'Ver-ed' },
  Reth: { ad: 'Reth', tur: 'İnsan', kimlik: 'Arathen dağlısı; Kutsal Kanı reddeden, gizlice yetişmiş.', egilimYaklasimi: 'Lodvez' },
  Galet_Insan: { ad: 'Galet', tur: 'İnsan', kimlik: 'Galetsha–Memanth dağ ve maden halkı; sert ve dirençli.', egilimYaklasimi: 'Lithron' },
  Zieli_Elf: { ad: 'Zieli', tur: 'Zieli', kimlik: 'Yıldız elfi; kadim, zamana ve büyüye yakın.', egilimYaklasimi: 'Loth' },
  Gaehan: { ad: 'Gaehan', tur: 'Zieli', kimlik: 'Kadim soy elfi; unutmayan, yavaş ve sabırlı.', egilimYaklasimi: 'Edor / Edros' },
  Irun_Cuce: { ad: 'Irun', tur: 'Irun', kimlik: 'Adamen cücesi; çelik, taş ve işçilik.', egilimYaklasimi: 'Lithron' },
  Lithan: { ad: 'Lithan', tur: 'Irun', kimlik: 'Taştan doğan yeraltı cücesi; Nimge’nin sessiz halkı.', egilimYaklasimi: 'Edor / Edros' },
  Gorgar: { ad: 'Gorgar', tur: 'Yaban', kimlik: 'Yaban ork; sınır akınlarının ve cephenin askeri.', egilimYaklasimi: 'Ghardello' },
  Mogar: { ad: 'Mogar', tur: 'Yaban', kimlik: 'Dev kanlı; iri, ağır, yılmaz.', egilimYaklasimi: 'Edor / Edros' },
  Wolanli: { ad: 'Wolanlı', tur: 'Yaban', kimlik: 'Kurt ruhlu sürü soyu (Sarem kanı); iz ve bağ.', egilimYaklasimi: 'Vizer' },
  Golgeli: { ad: 'Gölgeli', tur: 'Kadim-Kan', kimlik: 'Tshame’ye dokunulmuş; sessiz, görünmez, ürkütücü.', egilimYaklasimi: 'Lodvez' },
  Xenor_Kanli: { ad: 'Xenor-kanlı', tur: 'Kadim-Kan', kimlik: 'Namon’dan sızan kan; yasak ve tehlikeli. Anlatıcı onayı.', egilimYaklasimi: 'Loth', anlaticiOnayi: true },
  Meren: { ad: 'Meren', tur: 'Meren', kimlik: 'Okyanus halkı; sudan doğan deniz canlısı; akışkan, fırtına sezgili, zıpkın ustası. Irk seçmez, eğilim türden gelir.', egilimYaklasimi: 'Zel-vash' }
};

// ==========================================
// 5. SEKİZ HANE (SOYLU: HANE MİRASI)
// ==========================================
export type Hane =
  | 'Selya'
  | 'Arhan'
  | 'Onneva'
  | 'Solgar'
  | 'Liandryl'
  | 'Sınglew'
  | 'Khasin'
  | 'Galet'
  | 'Stallhart'
  | 'Zela'
  | 'Seltanya'
  | 'Adamen'
  | 'Mabed'
  | 'Memanth'
  | 'Galetsha'
  | string;

export interface HaneDetay {
  id: Hane;
  ad: string;
  diyar: string;
  haneMirasi: string;
  haneMirasiDetay: string;
  oneriYaklasim: YaklasimAdi;
  motto: string;
  renk: string;
  ikincilRenk?: string;
  eyalet?: string;
  unvan?: string;
  amblem?: string;
  motifi?: string;
  aciklama?: string;
  lider?: string;
  sinir?: string;
}

export const SEKIZ_HANE: Record<string, HaneDetay> = {
  Selya: {
    id: 'Selya',
    ad: 'Selya Hanesi',
    diyar: 'Selya',
    eyalet: 'Selyanya Vadisi',
    haneMirasi: 'Rıhtım Soyu',
    haneMirasiDetay: 'Çünkü liman ve tersane ailemin işi, bir gemi ya da limanla ilgili Avantaj kurarken +2.',
    oneriYaklasim: 'Vize-rion',
    motto: 'Karanlığı sadece yanan kan arındırır.',
    renk: '#800020',
    ikincilRenk: '#e6b800'
  },
  Arhan: {
    id: 'Arhan',
    ad: 'Arhan Hanesi',
    diyar: 'Galetsha',
    eyalet: 'Galetsha / Arhan',
    haneMirasi: 'Gözün Mirası',
    haneMirasiDetay: 'Çünkü Arhan ağı casus işler, bir sırrı çözerken ya da saklarken Avantaj +2.',
    oneriYaklasim: 'Vizer',
    motto: 'En tatlı kadeh, son yudumdur.',
    renk: '#8b1e2f',
    ikincilRenk: '#ffffff'
  },
  Onneva: {
    id: 'Onneva',
    ad: 'Onneva Hanesi',
    diyar: 'Onneva',
    eyalet: 'Onneva Ovası',
    haneMirasi: 'Ovanın Bereketi',
    haneMirasiDetay: 'Çünkü hasadı ve iaşeyi bilirim, kıtlık ve ikmal zorluklarında Aşma +2.',
    oneriYaklasim: 'Aronlid',
    motto: 'Yanmayan demir şekil almaz.',
    renk: '#dc2626',
    ikincilRenk: '#18181b'
  },
  Solgar: {
    id: 'Solgar',
    ad: 'Solgar Hanesi',
    diyar: 'Solgar',
    eyalet: 'Solgar Gölleri',
    haneMirasi: 'Paranın Sesi',
    haneMirasiDetay: 'Çünkü ticaret hanesinde yetiştim, altın ve borç pazarlıklarında +2.',
    oneriYaklasim: 'Aronlid',
    motto: 'Rüzgarın yönünü sadece kanatları titreyen bilir.',
    renk: '#0f172a',
    ikincilRenk: '#38bdf8'
  },
  Liandryl: {
    id: 'Liandryl',
    ad: 'Liandryl Hanesi',
    diyar: 'Çukurtepe',
    eyalet: 'Çukurtepe',
    haneMirasi: 'Eski Kan',
    haneMirasiDetay: 'Çünkü soyluluğum eski kayıtlara dayanır, soy ve miras tartışmalarında +2.',
    oneriYaklasim: 'Aldris',
    motto: 'Unutulan kan pas tutmaz.',
    renk: '#374151',
    ikincilRenk: '#9ca3af'
  },
  Sınglew: {
    id: 'Sınglew',
    ad: 'Sınglew Hanesi',
    diyar: 'Memanth',
    eyalet: 'Memanth Hududu',
    haneMirasi: 'Hudutçunun Kılıcı',
    haneMirasiDetay: 'Çünkü hududu savundum, dar geçit ve pusuya karşı Savunma +2.',
    oneriYaklasim: 'Ghardello',
    motto: 'Siper düşmeden baş eğilmez.',
    renk: '#1f2937',
    ikincilRenk: '#4b5563'
  },
  Khasin: {
    id: 'Khasin',
    ad: 'Khasin Hanesi',
    diyar: 'Khasinya',
    eyalet: 'Khasin Fiyortları',
    haneMirasi: 'Ada Gölgesi',
    haneMirasiDetay: 'Çünkü ailemde kehanet ve okült miras var, bir alamet ya da işareti okurken +2.',
    oneriYaklasim: 'Erau',
    motto: 'Buz merhamet tanımaz.',
    renk: '#115e59',
    ikincilRenk: '#f1f5f9'
  },
  Galet: {
    id: 'Galet',
    ad: 'Galet Hanesi',
    diyar: 'Galetsha',
    eyalet: 'Galetsha Maden Havzası',
    haneMirasi: 'Derin Damar',
    haneMirasiDetay: 'Çünkü madende büyüdüm, yeraltı ve göçük ortamında Aşma +2.',
    oneriYaklasim: 'Lithron',
    motto: 'Her sırrın bir kilidi vardır.',
    renk: '#2c2c2c',
    ikincilRenk: '#eab308'
  },
  Stallhart: {
    id: 'Stallhart',
    ad: 'Stallhart Hanedanı',
    diyar: 'Arava / Taç Diyarı',
    eyalet: 'Başsancak Arava',
    haneMirasi: 'Tahtın Ağırlığı',
    haneMirasiDetay: 'Çünkü imparatorluk sancağını taşırım, meclis ve divan oturumlarında Ver-ed ile +2.',
    oneriYaklasim: 'Ver-ed',
    motto: 'Aron hanar, Edron rion. Ezra gharan tod dor.',
    renk: '#d4af37',
    ikincilRenk: '#18181b'
  },
  Memanth: {
    id: 'Memanth',
    ad: 'Memanth Hanesi',
    diyar: 'Memanth',
    eyalet: 'Memanth Hududu',
    haneMirasi: 'Hudutçunun Kılıcı',
    haneMirasiDetay: 'Çünkü hududu savundum, dar geçit ve pusuya karşı Savunma +2.',
    oneriYaklasim: 'Ghardello',
    motto: 'Siper düşmeden baş eğilmez.',
    renk: '#1f2937',
    ikincilRenk: '#4b5563'
  },
  Galetsha: {
    id: 'Galetsha',
    ad: 'Galetsha Hanesi',
    diyar: 'Galetsha',
    eyalet: 'Galetsha Maden Havzası',
    haneMirasi: 'Derin Damar',
    haneMirasiDetay: 'Çünkü madende büyüdüm, yeraltı ve göçük ortamında Aşma +2.',
    oneriYaklasim: 'Lithron',
    motto: 'Her sırrın bir kilidi vardır.',
    renk: '#2c2c2c',
    ikincilRenk: '#eab308'
  }
};

export const HANELER = SEKIZ_HANE;

// ==========================================
// 6. ON SEKİZ MESLEK (HALKTAN: EYALET & MESLEK)
// ==========================================
export type MeslekKategori = 'Silah ve Yol' | 'Söz ve Gölge' | 'Emek, Deniz ve Ruh';

export interface MeslekDetay {
  ad: string;
  kategori: MeslekKategori;
  meslekHüneri: string;
  hunerMetni: string;
  oneriYaklasim: YaklasimAdi;
  yuk: string; // Zayıf Kanadı
  yasakIlimZorunlu?: boolean;
}

export const ON_SEKIZ_MESLEK: Record<string, MeslekDetay> = {
  // Silah ve Yol
  Kolcu: {
    ad: 'Kolcu',
    kategori: 'Silah ve Yol',
    meslekHüneri: 'Yol Bekçisi',
    hunerMetni: 'Çünkü yolları, kapıları ve geceyi bilirim; nöbet, kervan ve kapı sahnelerinde Vizer ile Avantaj Yaratırken +2.',
    oneriYaklasim: 'Vizer',
    yuk: 'Uykusuz Nöbetler'
  },
  Asker: {
    ad: 'Asker',
    kategori: 'Silah ve Yol',
    meslekHüneri: 'Nizamın Kılıcı',
    hunerMetni: 'Çünkü birlikte ve emirle savaşırım; bir birliğin ya da muhafız kalkan hattının içindeyken Ghardello ile Savunmada +2.',
    oneriYaklasim: 'Ghardello',
    yuk: 'Emre Bağlıyım'
  },
  'Paralı Asker': {
    ad: 'Paralı Asker',
    kategori: 'Silah ve Yol',
    meslekHüneri: 'Sözleşme Kılıcı',
    hunerMetni: 'Çünkü savaş benim işim; yanımda en az bir müttefik varken omuz omuza çarpışırken Ghardello ile Saldırı ve Savunmada +2.',
    oneriYaklasim: 'Ghardello',
    yuk: 'Borçlar Beni Kovalar'
  },
  Haydut: {
    ad: 'Haydut',
    kategori: 'Silah ve Yol',
    meslekHüneri: 'Yol Kanunu',
    hunerMetni: 'Çünkü hayatta kalmayı dağda ve sokakta öğrendim; kovalanırken, kaçarken ya da pusuda beklerken Zel-vash ile Aşmada +2.',
    oneriYaklasim: 'Zel-vash',
    yuk: 'Başıma Ödül Konmuş'
  },
  Korsan: {
    ad: 'Korsan',
    kategori: 'Silah ve Yol',
    meslekHüneri: 'Tuzlu Çengel',
    hunerMetni: 'Çünkü abordajı bilirim; bir geminin güvertesinde ya da bordalama esnasında Ghardello ile Saldırıda +2.',
    oneriYaklasim: 'Ghardello',
    yuk: 'Limanlarda Aranıyorum'
  },
  'Avcı / İzci': {
    ad: 'Avcı / İzci',
    kategori: 'Silah ve Yol',
    meslekHüneri: 'İz Sürücü',
    hunerMetni: 'Çünkü ormanı okurum; iz sürerken, pusu kurarken ve vahşi doğada Vizer ile Avantaj Yaratırken +2.',
    oneriYaklasim: 'Vizer',
    yuk: 'Şehirde Yabancıyım'
  },

  // Söz ve Gölge
  Ozan: {
    ad: 'Ozan',
    kategori: 'Söz ve Gölge',
    meslekHüneri: 'Meydan Şarkısı',
    hunerMetni: 'Çünkü şarkı ve hikâye taşırım; bir halk kalabalığını ya da saray divanını etkilerken Ver-ed ile Avantaj Yaratırken +2.',
    oneriYaklasim: 'Ver-ed',
    yuk: 'Dilim Başıma Bela'
  },
  Laklakçı: {
    ad: 'Laklakçı',
    kategori: 'Söz ve Gölge',
    meslekHüneri: 'Fısıltı Ağı',
    hunerMetni: 'Çünkü her hanın, pazarın ve kapının dedikodusunu bilirim; bir haberi aramak ya da yaymak için Vize-rion ile Avantaj Yaratırken +2.',
    oneriYaklasim: 'Vize-rion',
    yuk: 'İki Efendiye Hizmet'
  },
  Casus: {
    ad: 'Casus',
    kategori: 'Söz ve Gölge',
    meslekHüneri: 'Gölge Zanaatı',
    hunerMetni: 'Çünkü kimlik, mühür ve kilit benim işimdir; gizlice sızarken, kimlik taklit ederken ya da belge çalarken Lodvez ile Aşmada +2.',
    oneriYaklasim: 'Lodvez',
    yuk: 'Kimliğim Çürüyor'
  },
  Elçi: {
    ad: 'Elçi',
    kategori: 'Söz ve Gölge',
    meslekHüneri: 'Elçi Dokunulmazlığı',
    hunerMetni: 'Çünkü bir lordun sözünü taşırım; sahnede bir kez, elçi sıfatımı öne sürerek ölümcül bir tehlikeden ya da tutuklamadan bedelsiz Aşma hakkı kazanırım.',
    oneriYaklasim: 'Ver-ed',
    yuk: 'Başkasının Sözüyle Konuşurum'
  },
  Diplomat: {
    ad: 'Diplomat',
    kategori: 'Söz ve Gölge',
    meslekHüneri: 'Müzakere Ustası',
    hunerMetni: 'Çünkü iki tarafın çıkarını da tartarım; müzakere masasında karşı tarafın zayıf noktasını açığa çıkarırken Ver-ed ile Avantaj Yaratırken +2.',
    oneriYaklasim: 'Ver-ed',
    yuk: 'Her Masada Bir Düşman'
  },
  'Kâtip / Arşivci': {
    ad: 'Kâtip / Arşivci',
    kategori: 'Söz ve Gölge',
    meslekHüneri: 'Saatçi’nin Mürekkebi',
    hunerMetni: 'Çünkü kayıtları, mühürleri ve soyağaçlarını bilirim; arşiv belgeleri, kütükler ve soy araştırmasında Aldris ile Avantaj Yaratırken +2.',
    oneriYaklasim: 'Aldris',
    yuk: 'Fazla Bilirim'
  },

  // Emek, Deniz ve Ruh
  Denizci: {
    ad: 'Denizci',
    kategori: 'Emek, Deniz ve Ruh',
    meslekHüneri: 'Tuzlu Bilek',
    hunerMetni: 'Çünkü gemide yetiştim; gemi, liman mekanizmaları ve fırtına şartlarında Zel-vash ile Aşmada +2.',
    oneriYaklasim: 'Zel-vash',
    yuk: 'Karada Huzursuzum'
  },
  'Tüccar / Kervancı': {
    ad: 'Tüccar / Kervancı',
    kategori: 'Emek, Deniz ve Ruh',
    meslekHüneri: 'Gümüşün Gözü',
    hunerMetni: 'Çünkü her şeyin bir fiyatı var; pazarlık, gümrük memuru bağlama ve yol erzak hesaplarında Aronlid ile +2.',
    oneriYaklasim: 'Aronlid',
    yuk: 'Her Şeyin Bir Fiyatı Var'
  },
  'Demirci / Madenci': {
    ad: 'Demirci / Madenci',
    kategori: 'Emek, Deniz ve Ruh',
    meslekHüneri: 'Örs ve Damar',
    hunerMetni: 'Çünkü demiri ve taşı tanırım; silah, zırh onarımı, tahkimat ve yeraltı maden geçitlerinde Lithron ile Aşmada +2.',
    oneriYaklasim: 'Lithron',
    yuk: 'Ocağa Bağlıyım'
  },
  Şifacı: {
    ad: 'Şifacı',
    kategori: 'Emek, Deniz ve Ruh',
    meslekHüneri: 'Can Suyunun Elleri',
    hunerMetni: 'Çünkü yara sararım; bir müttefikin Fiziksel Sonucunu tedavi ederken Loth ile +2.',
    oneriYaklasim: 'Loth',
    yuk: 'Hiçbir Yarayı Bırakamam'
  },
  'Rahip / Novis': {
    ad: 'Rahip / Novis',
    kategori: 'Emek, Deniz ve Ruh',
    meslekHüneri: 'Mabed’in Sözü',
    hunerMetni: 'Çünkü ayin ve yemin bilirim; dinî tören, dua, cenaze ve yemin sahnelerinde Erau ile Avantaj Yaratırken +2.',
    oneriYaklasim: 'Erau',
    yuk: 'Mabed’in Gözü Üstümde'
  },
  Büyücü: {
    ad: 'Büyücü',
    kategori: 'Emek, Deniz ve Ruh',
    meslekHüneri: 'Yasak İlim',
    hunerMetni: 'Loth ile doğaüstü manipülasyon yapabilirsin; ancak her kullanım Büyü Bedeli (fiziksel/zihinsel hasar ve engizisyon takibi) riskine tabidir.',
    oneriYaklasim: 'Loth',
    yuk: 'Gölge Veziri Peşimde',
    yasakIlimZorunlu: true
  }
};

export const MESLEKLER = ON_SEKIZ_MESLEK;

// ==========================================
// 7. YARA HATLARI (DAMAGE TRACKS & STRESS)
// ==========================================
export interface YaraHatKutulari {
  fiziksel: [boolean, boolean, boolean]; // 3 kutu tampon (1, 1, 1)
  zihinsel: [boolean, boolean, boolean]; // 3 kutu tampon (1, 1, 1)
  itibar: [boolean];                     // 1 kutu tampon (1)
}

export interface Sonuclar {
  hafif?: string; // -2 (1 sahne)
  orta?: string;  // -4 (1 oturum)
  agir?: string;  // -6 (1 hikâye dönümü)
}

// ==========================================
// 8. TEOLOJİK HÜNERLER (DENGE KONSEYİ & MABED)
// ==========================================
export interface TeolojikHuner {
  ad: string;
  doktrin: string;
  yaklasim: YaklasimAdi;
  aciklama: string;
}

export const TEOLOJIK_HUNERLER: TeolojikHuner[] = [
  {
    ad: 'Lidros’un Terazisi',
    doktrin: 'Hukuki Doktrin',
    yaklasim: 'Aldris',
    aciklama: 'Bir mahkemede ya da resmî divan ithamında Aldris (Hukuk) zarı atarken tarafsız gerçeği savunuyorsan rakiplerin unvan Aspect’leri çağrılamaz ve Sabit Eşik devreye girmez.'
  },
  {
    ad: 'Maraz’ın Arpı',
    doktrin: 'Ölüm Sezgisi',
    yaklasim: 'Erau',
    aciklama: 'Ölüm döşeğindeki birinin başında Erau kullanarak maktulün son fısıltısını çözer; ölümün doğal mı, zehir kaynaklı mı olduğunu kesin tespit eder.'
  },
  {
    ad: 'Lomera Barışı (Denge Çemberi)',
    doktrin: 'Çember İlanı',
    yaklasim: 'Edor / Edros',
    aciklama: 'İki taraf arasına kireçle çember çizip Lomera Barışı ilan eder. Taraflar toplu savaşı durdurup meseleyi resmî Dello düellosuna bırakmak için Edor / Edros testi vermek zorunda kalır.'
  }
];

// ==========================================
// 9. BÜYÜ KURALLARI (LOTH & YASAK İLİM)
// ==========================================
export interface BuyuBedeliSonuc {
  sonuc: 'Görkemli Başarı' | 'Başarı' | 'Denk' | 'Başarısız';
  durum: string;
  bedel: string;
}

export const BUYU_BEDELI_TABLOSU: BuyuBedeliSonuc[] = [
  { sonuc: 'Görkemli Başarı', durum: 'Çalışır ve bir ödül verir (Güçlendirme).', bedel: 'Yok. İz kalmaz.' },
  { sonuc: 'Başarı', durum: 'Tam çalışır.', bedel: 'Yok. İz kalmaz.' },
  { sonuc: 'Denk', durum: 'Çalışır.', bedel: 'Sahneye bir Büyü İzi Aspect’i konur (“Mor Alev Kokusu”, “Kırılan Gölgeler”) ya da 1 şift Zihinsel hasar alırsın.' },
  { sonuc: 'Başarısız', durum: 'Çalışmaz ya da ters teper.', bedel: 'Büyü İzi ve 2 şift Zihinsel hasar (Edor / Edros ile savunulmaz); Anlatıcı sana Av Aspect’i koyabilir (“Gölge Veziri Beni Arıyor”).' }
];

// ==========================================
// 10. EKİPMAN ASPECT'LERİ (ITEM ASPECTS & LOAD)
// ==========================================
export interface DurumSinerjisi {
  hedefDurum?: string;          // Hedefe uygulanan durum: 'Kanamalı', 'Zehirlenmiş', 'Alevler İçinde', etc.
  kullaniciDurum?: string;      // Kuşanıldığında/kullanıldığında kazanılan durum: 'Kutsanmış', 'Odaklanmış', 'Çelik Siper', etc.
  kaldirilanDurumlar?: string[]; // Temizlenen durumlar: ['Kanamalı', 'Zehirlenmiş', 'Dehşet İçinde'], etc.
  tetiklenme: 'Vuruşta' | 'Kuşanıldığında' | 'Kullanıldığında' | 'Savunmada';
  aciklama: string;
}

export interface EkipmanAspect {
  id: string;
  ad: string;
  tur: 'Silah' | 'Zırh' | 'Kalkan' | 'Teçhizat' | 'Tıbbi' | 'Görünüş Nesnesi' | 'Hazine' | 'Büyülü Yadigar';
  aspectEtkisi?: string;
  fiyat: number; // Aron
  yuk?: number;  // Yük Puanı (0..3)
  aciklama?: string;
  hasarBonus?: number;
  zirhPuani?: number;
  kalkanSavunma?: number;
  kusandiMi?: boolean;
  nadir?: 'Sıradan' | 'Usta İşi' | 'Efsanevi' | 'Yasak Büyülü';
  durumSinerjisi?: DurumSinerjisi;
}

export function hesaplaKarakterYuk(envanter: EkipmanAspect[] = []): number {
  return envanter.reduce((sum, item) => sum + (item.yuk ?? 1), 0);
}

export function hesaplaMaksimumYuk(karakter?: any): number {
  const str = karakter?.nitelikler?.STR ?? 2;
  return Math.max(6, 6 + (str > 2 ? (str - 2) * 2 : (str - 2)));
}

export const HAZIR_EKIPMANLAR: EkipmanAspect[] = [
  { id: 'eq_agir_zirh', ad: 'Ağır Plaka Zırh', tur: 'Zırh', aspectEtkisi: 'Sahne boyunca Ghardello ile yapılan Savunmada sahne başına 1 kez bedelsiz çağrılabilir (+2).', fiyat: 25, yuk: 2, zirhPuani: 2, nadir: 'Usta İşi', durumSinerjisi: { kullaniciDurum: 'Çelik Siper', tetiklenme: 'Kuşanıldığında', aciklama: 'Kuşanıldığında "Çelik Siper" sağlar (+2 Savunma).' } },
  { id: 'eq_balta', ad: 'Çift Elli Balta / Kargı', tur: 'Silah', aspectEtkisi: 'Bir engeli Lithron ile kırarken ya da Ghardello ile Saldırıda sahne başına 1 kez bedelsiz çağrılabilir (+2).', fiyat: 20, yuk: 2, hasarBonus: 2, nadir: 'Usta İşi' },
  { id: 'eq_hancer', ad: 'Zehirli Hançer', tur: 'Silah', aspectEtkisi: 'Ghardello ile yapılan ilk başarılı vuruşta hedefe bedelsiz ek 1 şift hasar ekler.', fiyat: 15, yuk: 1, hasarBonus: 1, nadir: 'Usta İşi', durumSinerjisi: { hedefDurum: 'Zehirlenmiş', tetiklenme: 'Vuruşta', aciklama: 'Vuruşta hedefe "Zehirlenmiş" durumu uygular (1 Hasar/Tur).' } },
  { id: 'eq_yay', ad: 'Dişbudak Av Yayı & Sadak', tur: 'Silah', aspectEtkisi: 'Rax-ed ile menzilli atışlarda sahne başına 1 kez bedelsiz çağrılabilir (+2).', fiyat: 18, yuk: 2, hasarBonus: 1, nadir: 'Sıradan', durumSinerjisi: { kullaniciDurum: 'Odaklanmış', tetiklenme: 'Kuşanıldığında', aciklama: 'Kuşanıldığında "Odaklanmış" durumu sağlar (+1 Zar, +1 Sav).' } },
  { id: 'eq_kalkan', ad: 'Bronz Siper Kalkanı', tur: 'Kalkan', aspectEtkisi: 'Kalkan duvarında veya Ghardello ile savunurken sahne başına 1 kez bedelsiz çağrılabilir (+2).', fiyat: 12, yuk: 2, kalkanSavunma: 1, nadir: 'Sıradan' },
  { id: 'eq_pelerin', ad: 'Gölge Pelerini (Tshavel)', tur: 'Teçhizat', aspectEtkisi: 'Karanlıkta veya sis altında Lodvez/Zel-vash atarken bedelsiz çağrılabilir (+2).', fiyat: 30, yuk: 1, nadir: 'Usta İşi' },
  { id: 'eq_sifa', ad: 'Şifacı Sargı Bezi ve Merhemi', tur: 'Tıbbi', aspectEtkisi: 'Fiziksel Hafif Sonucu tedavi ederken Loth atışına +2 verir.', fiyat: 8, yuk: 1, nadir: 'Sıradan', durumSinerjisi: { kaldirilanDurumlar: ['Kanamalı'], tetiklenme: 'Kullanıldığında', aciklama: 'Kullanıldığında hastanın "Kanamalı" durumunu temizler.' } }
];

export const HAZIR_ESYALAR = HAZIR_EKIPMANLAR;
export type Esya = EkipmanAspect;

// ==========================================
// 11. KARAKTER MODELİ (STALLHART CHARACTER SHEET)
// ==========================================
export interface KarakterAspectler {
  unvanVeKader: string; // Kim olduğun ve peşinde olduğun şey
  zayifKanadi: string;   // Seni hep başına iş açan yön (Yük)
  sadakatBagi: string;   // Biri ya da bir şey için verilmiş söz
  serbest1: string;      // Bir yer, yara, alet veya sır
  serbest2: string;
}

export interface Karakter {
  id: string;
  ad: string;
  oyuncu?: string;
  tur: TurAdi;
  irk: string;
  koken: 'Soylu' | 'Halktan';
  olcek: number; // 1..10 (Soylu: 5, Halktan: 2)
  hane: Hane;
  eyalet: string;
  meslek: string;
  rutbe?: string;
  fotoUrl?: string;
  cerceve?: string;

  // Yenileme ve Kader Puanı
  yenileme: number; // Soylu: 3, Halktan: 4
  kaderPuani: number; // Mevcut Fate Puanı jetonları

  // 14 Yaklaşım Değerleri
  yaklasimlar: Record<YaklasimAdi, number>;

  // 3 Yara Hattı (Stres Kutuları)
  yaraHatlari: YaraHatKutulari;

  // Sonuçlar (3 hat için ortak)
  sonuclar: Sonuclar;

  // 5 Aspect
  aspectler: KarakterAspectler;

  // Uzmanlıklar
  uzmanliklar: string[];
  yasakIlim: boolean; // Loth ile büyü yapma izni

  // Ekipman Aspect'leri
  ekipmanAspectleri: string[];
  envanter: EkipmanAspect[];

  // Geçmiş: Karakteri Tanımlayan 3 Cümle
  gecmis3Cumle: [string, string, string];

  // Ekonomi & Durum
  ekonomi: {
    aron: number;
    borc: number;
    sicil?: number;
    un?: number;
  };
  kilometreTaslari?: {
    kucuk: number;
    orta: number;
    buyuk: number;
  };
  durumlar: string[];
  yetenekler?: string[]; // Yetenek Ağacı Düğüm ID'leri
  muhurler?: {
    kan: number;     // 🩸 Kızıl Kan Mührü (Demir & Kan)
    golge: number;   // 🗡️ Kuzgun Gölge Mührü (Gölge & Fısıltı)
    leke: number;    // 🔮 Leke ve Boşluk Mührü (Yasak Rünler)
    gunes: number;   // ✨ Güneş ve Terazi Mührü (Mabed & Denge)
  };
  notlar?: string;

  // Geriye Dönük Uyumluluk (Legacy Getters)
  sayaclar: {
    yaraKutulari: number;
    alınanYaraKutulari: number;
    yorgunluk: number;
    muhur: number;
    leke: number;
    supheli: number;
  };
  gorunumler: {
    anaKavram: string;
    dert: string;
    gecmis: string;
    catisma: string;
    bag: string;
  };
  beceriler: {
    Fight: number;
    Shoot: number;
    Stealth: number;
    Investigate: number;
    Lore: number;
    ProvokeManipulate: number;
  };
  nitelikler: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
}

// ==========================================
// 12. NPC / FİGÜRAN SKALASI
// ==========================================
export type NpcTuru = 'Sıradan Figüran' | 'Önemli Rakip' | 'Canavar' | 'Vahşi Hayvan' | 'Kadim Varlık' | 'Boss';
export type NpcKategori = 'İnsansı' | 'Canavar' | 'Vahşi Hayvan' | 'Hortlak / Yaratık' | 'Kadim Boss';

export interface NPC {
  id: string;
  ad: string;
  tur?: NpcTuru; // 'Sıradan Figüran' | 'Önemli Rakip' | 'Canavar' | 'Vahşi Hayvan' | 'Kadim Varlık' | 'Boss'
  kategori?: NpcKategori;
  hane: Hane;
  eyalet: string;
  rol: string;
  tehdit: 'Düşük' | 'Orta' | 'Yüksek' | 'Ölümcül';
  tutum: number; // -3..+3
  fotoUrl?: string;
  anaKavram: string;
  dert: string;
  sir: string;
  ipuclari: string[];
  anlaticiNotlari: string;
  olcek?: number;

  // Yaklaşım Dağılımı (Önemli Rakip ise)
  yaklasimlar?: Partial<Record<YaklasimAdi, number>>;

  // Stres
  stats: {
    fight: number;
    savunma: number;
    yaraKutulari: number;
    mevcutYara: number;
  };
}

// ==========================================
// 13. ZAR MOTORU (4dF)
// ==========================================
export function zarAt4dF(): number[] {
  // 4 zar, her biri -1, 0, +1
  const zarlar: number[] = [];
  for (let i = 0; i < 4; i++) {
    const r = Math.floor(Math.random() * 3) - 1;
    zarlar.push(r);
  }
  return zarlar;
}

export interface FateAtisSonucu {
  zarlar: number[]; // [-1, 0, 1, 1]
  zarToplami: number; // -4 .. +4
  yaklasimDegeri: number;
  bonus: number;
  toplam: number;
  zorluk: number;
  sift: number; // toplam - zorluk
  derece: string; // Sıfatlar Merdiveni
  sonucTuru: 'Görkemli Başarı' | 'Başarı' | 'Denk' | 'Başarısız';
  aciklama: string;
}

export function fateAtisiHesapla(
  yaklasimDegeri: number,
  zorluk: number = ZORLUKLAR.Makul,
  bonus: number = 0,
  ozelZarlar?: number[]
): FateAtisSonucu {
  const zarlar = ozelZarlar || zarAt4dF();
  const zarToplami = zarlar.reduce((a, b) => a + b, 0);
  const toplam = zarToplami + yaklasimDegeri + bonus;
  const sift = toplam - zorluk;

  let sonucTuru: 'Görkemli Başarı' | 'Başarı' | 'Denk' | 'Başarısız' = 'Başarı';
  let aciklama = '';

  if (sift >= 3) {
    sonucTuru = 'Görkemli Başarı';
    aciklama = 'Tam başarı ve bir ödül! Bir Güçlendirme (Aspect) kazandın ya da fazladan şift aldın.';
  } else if (sift >= 1) {
    sonucTuru = 'Başarı';
    aciklama = 'Tam başarı! Amacına ulaştın.';
  } else if (sift === 0) {
    sonucTuru = 'Denk';
    aciklama = 'Başarırsın ama bir bedel ödersin (zaman, dikkat kaybı ya da zarar).';
  } else {
    sonucTuru = 'Başarısız';
    aciklama = 'Yapamazsın ya da çok ağır bir bedelle yaparsın.';
  }

  return {
    zarlar,
    zarToplami,
    yaklasimDegeri,
    bonus,
    toplam,
    zorluk,
    sift,
    derece: merdivenDerecesiBul(toplam),
    sonucTuru,
    aciklama
  };
}

// Sabit Eşik Kontrolü
export function sabitEsikGecerliMi(saldiranOlcek: number, hedefOlcek: number): {
  engellendi: boolean;
  olcekFarki: number;
  mesaj: string;
} {
  const fark = hedefOlcek - saldiranOlcek;
  if (fark >= 3) {
    return {
      engellendi: true,
      olcekFarki: fark,
      mesaj: `Sabit Eşik işler (Ölçek farkı: ${fark})! Alt basamaktaki doğrudan saldıramaz. Önce Ver-ed ya da Lodvez ile bir gedik (Avantaj) açmalıdır.`
    };
  }
  return {
    engellendi: false,
    olcekFarki: fark,
    mesaj: 'Statü farkı saldırıyı engellemiyor.'
  };
}

// Legacy Aliases
export type Nitelikler = { STR: number; DEX: number; CON: number; INT: number; WIS: number; CHA: number };
export type Beceriler = { Fight: number; Shoot: number; Stealth: number; Investigate: number; Lore: number; ProvokeManipulate: number };

export interface ZarSonucu {
  id: string;
  zaman: string;
  atan: string;
  tur: string;
  zarlar: number[];
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

export function saldiriHesapla(
  saldiriToplami: number,
  savunmaToplami: number,
  hedefZirh: number = 0
) {
  const fark = saldiriToplami - savunmaToplami;
  const netHasar = Math.max(0, fark - hedefZirh);
  let onerilenYaraKademesi: 'Yok' | 'Sıyrık' | 'Yara' | 'Ağır Yara' | 'Ölümcül Darbe' = 'Yok';
  if (netHasar >= 6) onerilenYaraKademesi = 'Ölümcül Darbe';
  else if (netHasar >= 4) onerilenYaraKademesi = 'Ağır Yara';
  else if (netHasar >= 2) onerilenYaraKademesi = 'Yara';
  else if (netHasar >= 1) onerilenYaraKademesi = 'Sıyrık';

  return {
    vurusFarki: fark,
    netHasar,
    onerilenYaraKademesi,
    aciklama: `Net Hasar: ${netHasar} (${onerilenYaraKademesi})`
  };
}

export const ZORLUK_MERDIVENI = SIFATLAR_MERDIVENI;
export function hesaplaMaksYaraKutusu(con: number = 2) { return 3; }
export function hesaplaMaksYuk(str: number = 2) { return 6; }
export function hesaplaBaslangicMuhur(luck: number = 3) { return 4; }
export function hesaplaSavunma(dex: number = 2, envanter: any[] = []) { return dex; }
export function hesaplaToplamAgirlik(envanter: any[] = []) { return envanter.reduce((a, b) => a + (b.yuk || 1), 0); }
export function hesaplaToplamZirh(envanter: any[] = []) { return envanter.length > 0 ? 1 : 0; }
export function cepheZariAt() {
  const rion = Math.floor(Math.random() * 6) + 1;
  const garion = Math.floor(Math.random() * 6) + 1;
  return { sonuc: `Rion (${rion}) vs Garion (${garion})`, netice: rion - garion, aciklama: 'Cephe hattı zarı atıldı.' };
}

export * from './rules/statusEffects';
