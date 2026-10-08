import React, { useState } from 'react';
import { HelpCircle, Sparkles, Scale, Swords, Shield, Scroll, Flame } from 'lucide-react';

export interface LoreTermDetail {
  title: string;
  category: 'Kural' | 'Evren' | 'Çatışma' | 'Büyü';
  summary: string;
  ruleDetail: string;
  icon?: string;
}

export const LORE_DICTIONARY: Record<string, LoreTermDetail> = {
  'Şift': {
    title: 'Şift (Shift)',
    category: 'Kural',
    summary: 'Atış sonucu ile Zorluk arasındaki sayısal farktır.',
    ruleDetail: 'Sonuç - Zorluk = Şift. 1-2 şift tam Başarı, 3+ şift Görkemli Başarı (ödül/güçlendirme) verir. Saldırıda şift kadar hasar vurulur.'
  },
  'Sabit Eşik': {
    title: 'Sabit Eşik Kuralı',
    category: 'Kural',
    summary: 'Statü uçurumunda doğrudan kaba saldırıyı engelleyen imparatorluk kanunu.',
    ruleDetail: 'İki taraf arasında 3 veya daha fazla Ölçek basamağı farkı varsa (Örn: Paralı Asker [2] vs Vali [6]), alt basamaktaki doğrudan Saldıramaz. Önce Ver-ed veya Lodvez ile sahnede bir Gedik (Avantaj Aspect) açmalıdır.'
  },
  'Gedik': {
    title: 'Gedik (Breach / Advantage)',
    category: 'Çatışma',
    summary: 'Sabit Eşiği kırmak için sahneye kazandırılan hukuki, sosyal veya taktiksel zafiyet.',
    ruleDetail: 'Ver-ed (İkna) veya Lodvez (Hile) ile Avantaj Yarat eylemi başarıldığında sahneye konur ("Vali Küçük Düştü", "Kalkan Düzeni Bozuldu"). Gedik açılınca doğrudan Saldırı yapılabilir.'
  },
  'Dello': {
    title: 'Dello (Meydan Düellosu)',
    category: 'Çatışma',
    summary: 'Katliam savaşları yerine liderlerin veya şampiyonların tekil dövüşü.',
    ruleDetail: 'Nefes Hukuku uyarınca insan canı azdır. Meseleler Ghardello Yaklaşımıyla meydanda çözülür. Teslim her zaman mümkündür ve teslim olan Kader Puanı kazanır.'
  },
  'Lomera Barışı': {
    title: 'Lomera Barışı & Denge Çemberi',
    category: 'Büyü',
    summary: 'Mabed rahibinin kireçle çizdiği kutsal tarafsızlık alanı.',
    ruleDetail: 'Rahip iki taraf arasına kireçle çember çizdiğinde toplu savaş durur. Taraflar Edor / Edros testi verir; savunamayan silah bırakır ve meselenin resmî Dello ile çözülmesini kabul eder.'
  },
  'Loth': {
    title: 'Loth (Büyü, Zanaat, Simya)',
    category: 'Büyü',
    summary: 'Simya, zehir ve yasak kadim büyü manipülasyonunun Yaklaşımıdır.',
    ruleDetail: 'Yasak İlim Uzmanlığı olmadan büyü yapılamaz (yalnızca zehir, merhem, simya). Büyü atışlarında Denk veya Başarısız gelirse Büyü İzi ve Zihinsel hasar ödenir.'
  },
  'Yasak İlim': {
    title: 'Yasak İlim (Kapı Uzmanlığı)',
    category: 'Büyü',
    summary: 'KS 0 felaketinden sonra yasaklanan doğaüstü manipulasyon izni.',
    ruleDetail: 'Loth ile büyü yapabilmek için bu Uzmanlık şarttır. Büyücüler engizisyon ve Gölge Veziri tarafından avlanır.'
  },
  'Nefes Hukuku': {
    title: 'Nefes Hukuku (Can Kıymeti)',
    category: 'Evren',
    summary: 'İmparatorlukta insan nüfusunun azlığı sebebiyle canın kutsal tutulması.',
    ruleDetail: 'Toplu katliam yasaktır. Bitmek yalnızca herkesçe kabul edilmiş ölümcül sahnede ölüm demektir; savaş en son çaredir.'
  },
  'Güçlendirme': {
    title: 'Güçlendirme (Boost)',
    category: 'Kural',
    summary: 'Yalnızca tek bir sefer bedava çağrılan geçici mini-Aspect.',
    ruleDetail: 'Görkemli Başarıda veya savuşturmada kazanılır ("Dengesi Bozuldu"). İster kendin kullan (+2 / yeniden at), ister yanındaki dostuna devret.'
  },
  'Aspect': {
    title: 'Aspect (Kader Cümlesi)',
    category: 'Kural',
    summary: 'Karakter, yer ya da durum hakkında doğru olan kısa bir cümle.',
    ruleDetail: 'Hem silahtır hem yük. 1 Kader Puanı harcanarak çağrılır (+2 veya zar tazeleme). Başını belaya soktuğunda Anlatıcı zorlar ve sana +1 Kader Puanı verir.'
  },
  'Kader Puanı': {
    title: 'Kader Puanı (Fate Points)',
    category: 'Kural',
    summary: 'Kaderi bükmek ve Aspect çağırmak için harcanan oturum jetonları.',
    ruleDetail: 'Oturuma Yenileme kotasıyla başlarsın (Soylu: 3, Halktan: 4). Zorlamaları kabul ederek veya zarlar atılmadan teslim olarak Kader Puanı kazanırsın.'
  },
  'Leke': {
    title: 'Leke Sayacı (Ruhani Yozlaşma)',
    category: 'Kural',
    summary: 'Kadim büyü, yasak kalıntılar ve karanlık seçimlerle artan ruh lekesi.',
    ruleDetail: '0-9 arası takip edilir. 6 ve üzeri seviyede Engizisyon ve Gölge Avcıları karakterin izini bulur; 9’da karakter çürümeye uğrar.'
  },
  'Tampon Kutusu': {
    title: 'Tampon Kutusu (Stress Pips)',
    category: 'Çatışma',
    summary: 'Karakterin aldığı darbeleri ölümcül yaraya dönüşmeden soğuran dayanıklılık pencereleri.',
    ruleDetail: 'Fiziksel, Zihinsel ve İtibar olarak ayrılır. Gelen hasar önce boş tampon kutusu işaretlenerek karşılanır. Dolduğunda kalıcı Sonuç (Consequence) alınır.'
  },
  'Kader Çağrısı': {
    title: 'Kader Çağrısı (Invoke)',
    category: 'Kural',
    summary: '1 Mühür/Kader Puanı harcayarak bir Aspect’i lehinize kullanma eylemi.',
    ruleDetail: 'Zar atıldıktan sonra çağrılabilir: Nihai sonuca +2 ekler veya 4 zarı da yeniden yuvarlama (Reroll) hakkı verir.'
  },
  'Kader Kışkırtması': {
    title: 'Kader Kışkırtması (Compel)',
    category: 'Kural',
    summary: 'Anlatıcı’nın karakterinizin Dert veya zayıflığını aleyhinize kullanarak sahneyi zorlaştırması.',
    ruleDetail: 'Kabul ederseniz Anlatıcı size +1 Kader Puanı (Mühür) verir. Reddetmek için cebinizden 1 Kader Puanı ödemeniz gerekir.'
  },
  'Aron': {
    title: 'Aron (Para Birimi)',
    category: 'Evren',
    summary: 'Stallhart Kurultayı ve 12 Hanedanlığın geçerli altın/gümüş sikkesi.',
    ruleDetail: 'Silah, zırh, han konaklaması ve rüşvet ödemelerinde kullanılır. 1 Aron bir askerin haftalık iaşesine denktir.'
  },
  'Mühür': {
    title: 'Divan Mührü (Kader Parası)',
    category: 'Kural',
    summary: 'Kader Puanı harcandığında verilen altın/balmumu imparatorluk jetonları.',
    ruleDetail: 'Zarlara +2 eklemek, büyü geri tepmelerini engellemek veya sahnede beklenmedik bir fırsat yaratmak için harcanır.'
  },
  'Dert': {
    title: 'Dert (Trouble Aspect)',
    category: 'Kural',
    summary: 'Karakterin peşini bırakmayan kişisel zaafı, kan davası veya geçmiş borcu.',
    ruleDetail: 'Anlatıcı en çok bu Aspect üzerinden Kışkırtma (Compel) yapar; böylece karakter zor duruma düşer ama Kader Puanı kazanır.'
  },
  'Sonuç': {
    title: 'Sonuç (Consequences / Kalıcı Yara)',
    category: 'Çatışma',
    summary: 'Tampon kutuları taştığında alınan Hafif (-2), Orta (-4) veya Ağır (-6) kalıcı yara.',
    ruleDetail: 'Düşmanlar bu yaraları size karşı bedelsiz Aspect olarak çağırabilir (+2). Tedavi edilmesi için başarılı Loth/Tıbbi atışı ve dinlenme gerekir.'
  }
};

interface ContextTooltipProps {
  term: keyof typeof LORE_DICTIONARY | string;
  children: React.ReactNode;
  className?: string;
}

export const ContextTooltip: React.FC<ContextTooltipProps> = ({ term, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const info = LORE_DICTIONARY[term];

  if (!info) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`relative inline-flex items-center gap-0.5 cursor-help group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="border-b border-dotted border-amber-500/70 text-[#f5ebd7] group-hover:text-amber-300 transition-colors">
        {children}
      </span>
      <HelpCircle className="w-3 h-3 text-amber-500/70 inline ml-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Pop-over Lore Kartı */}
      {isOpen && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 p-3 rounded-xl bg-[#120d09] border-2 border-amber-600/90 shadow-2xl text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          style={{ textShadow: 'none' }}
        >
          <span className="flex items-center justify-between border-b border-[#3b2b1d] pb-1.5 mb-1.5">
            <span className="font-heading font-black text-xs text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{info.title}</span>
            </span>
            <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
              {info.category}
            </span>
          </span>

          <span className="text-[11px] text-[#ded1be] font-serif block italic mb-1.5 leading-snug">
            {info.summary}
          </span>

          <span className="text-[10px] text-[#a49684] block bg-[#19120c] p-1.5 rounded border border-[#312317] leading-relaxed">
            <strong className="text-amber-400 not-italic block mb-0.5">Sistem Kuralı:</strong>
            {info.ruleDetail}
          </span>

          {/* Mini ok */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-amber-600/90" />
        </span>
      )}
    </span>
  );
};
