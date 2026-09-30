import React, { useState } from 'react';
import {
  HANELER,
  MESLEKLER,
  HAZIR_ESYALAR,
  ZORLUK_MERDIVENI,
  DENGE_KONSEYI,
  Hane,
} from '../rules';
import {
  BookOpen,
  Shield,
  Search,
  Scale,
  Sparkles,
  HelpCircle,
  Coins,
  HeartCrack,
  Flame
} from 'lucide-react';

export const RulesCompendium: React.FC = () => {
  const [altSekme, setAltSekme] = useState<'merdiven' | 'haneler' | 'meslekler' | 'esyalar' | 'denge'>('merdiven');
  const [arama, setArama] = useState('');

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div className="parchment-sheet p-5 rounded-xl border border-[#523e2c] shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h1 className="font-heading font-black text-2xl text-[#f3ece0]">
              Stallhart Kural &amp; Evren Ansiklopedisi
            </h1>
          </div>
          <p className="text-xs text-[#a99c8b]">
            Fate tabanlı 4dF kuralları, zorluk merdiveni, 12 Büyük Hane ve Denge Konseyi panteonu.
          </p>
        </div>

        {/* Sekmeler */}
        <div className="flex items-center bg-[#17120e] p-1 rounded-lg border border-[#443322] flex-wrap gap-1 text-xs font-heading font-bold">
          <button
            onClick={() => setAltSekme('merdiven')}
            className={`px-3 py-1.5 rounded transition-colors ${
              altSekme === 'merdiven'
                ? 'bg-[#3b2a1a] text-amber-200 border border-[#785734]'
                : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Zorluk Merdiveni
          </button>
          <button
            onClick={() => setAltSekme('haneler')}
            className={`px-3 py-1.5 rounded transition-colors ${
              altSekme === 'haneler'
                ? 'bg-[#3b2a1a] text-amber-200 border border-[#785734]'
                : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            12 Büyük Hane
          </button>
          <button
            onClick={() => setAltSekme('meslekler')}
            className={`px-3 py-1.5 rounded transition-colors ${
              altSekme === 'meslekler'
                ? 'bg-[#3b2a1a] text-amber-200 border border-[#785734]'
                : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Meslekler &amp; Zaaflar
          </button>
          <button
            onClick={() => setAltSekme('esyalar')}
            className={`px-3 py-1.5 rounded transition-colors ${
              altSekme === 'esyalar'
                ? 'bg-[#3b2a1a] text-amber-200 border border-[#785734]'
                : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Fiyat Listesi
          </button>
          <button
            onClick={() => setAltSekme('denge')}
            className={`px-3 py-1.5 rounded transition-colors ${
              altSekme === 'denge'
                ? 'bg-[#3b2a1a] text-amber-200 border border-[#785734]'
                : 'text-[#8e7e6d] hover:text-[#d3c7b5]'
            }`}
          >
            Denge Konseyi (Tanrılar)
          </button>
        </div>
      </div>

      {/* MERDİVEN TAB */}
      {altSekme === 'merdiven' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 parchment-sheet p-5 rounded-xl border border-[#523e2c] shadow">
            <h2 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e20] pb-2 mb-4">
              Fate Zorluk Merdiveni
            </h2>
            <div className="space-y-1.5">
              {ZORLUK_MERDIVENI.map((z) => (
                <div
                  key={z.deger}
                  className="flex items-center justify-between p-2 rounded bg-[#18130e] border border-[#39291b]"
                >
                  <span className={`font-heading font-bold text-xs ${z.renk}`}>
                    {z.baslik}
                  </span>
                  <span className="font-mono font-bold text-sm text-stone-200">
                    {z.deger >= 0 ? `+${z.deger}` : z.deger}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="parchment-sheet p-5 rounded-xl border border-[#523e2c] shadow text-xs space-y-3">
              <h3 className="font-heading font-bold text-sm text-amber-200 border-b border-[#3e2e20] pb-1">
                4dF ve Mühür Kullanım Kuralları
              </h3>
              <p className="text-[#c5b7a5] leading-relaxed">
                • <strong>Zar Formülü:</strong> 4dF (toplam −4 ile +4 arası) + Nitelik + Beceri = Sonuç.
              </p>
              <p className="text-[#c5b7a5] leading-relaxed">
                • <strong>Mühür Harcama:</strong> Bir zarı tamamen baştan at veya sonuca <strong>+2 ekle</strong>.
              </p>
              <p className="text-[#c5b7a5] leading-relaxed">
                • <strong>Dert Tetikleme (Compel):</strong> Anlatıcı, karakterinizin Dert Görünüşünü aleyhinize kullanarak sahneyi zorlaştırırsa size <strong>1 Mühür jetonu</strong> verir.
              </p>
              <p className="text-[#c5b7a5] leading-relaxed">
                • <strong>Yara Kademeleri:</strong> Sıyrık (−2), Yara (−4), Ağır Yara (−6, kalıcı yara izi bırakır).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HANELER TAB */}
      {altSekme === 'haneler' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(HANELER) as Hane[]).map((hKey) => {
            const h = HANELER[hKey];
            return (
              <div
                key={hKey}
                className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow space-y-2 text-xs"
              >
                <div className="flex items-center gap-2.5 border-b border-[#3e2e20] pb-2">
                  <div
                    className="w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: h.renk, color: h.ikincilRenk }}
                  >
                    {h.id[0]}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#f1e6d4]">
                      {h.ad}
                    </h3>
                    <span className="text-[10px] text-[#93826e]">{h.unvan}</span>
                  </div>
                </div>
                <p className="text-[#bfb2a0] text-[11px] leading-relaxed">
                  {h.aciklama}
                </p>
                <div className="text-[10px] text-amber-300/90 italic">
                  &quot;{h.motto}&quot;
                </div>
                <div className="pt-1 text-[10px] text-[#867563]">
                  <strong>Merkez Eyalet:</strong> {h.eyalet}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MESLEKLER TAB */}
      {altSekme === 'meslekler' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.keys(MESLEKLER).map((mKey) => {
            const m = MESLEKLER[mKey];
            return (
              <div
                key={mKey}
                className="parchment-sheet p-4 rounded-xl border border-[#523e2c] shadow space-y-2 text-xs"
              >
                <div className="border-b border-[#3e2e20] pb-2 flex items-center justify-between">
                  <h3 className="font-heading font-bold text-sm text-amber-300">
                    {m.ad}
                  </h3>
                  <span className="text-[10px] text-[#a99c8b]">
                    Öneri: {m.oneriNitelik} + {m.oneriBeceri}
                  </span>
                </div>
                <p className="text-[#c4b5a3] text-[11px]">{m.aciklama}</p>
                <div className="space-y-1 pt-1">
                  <span className="font-bold text-[#b4a491] text-[10px] uppercase block">
                    Hünerler:
                  </span>
                  {m.hunerler.map((h, i) => (
                    <div key={i} className="text-[11px] text-[#cfc1b0]">
                      <strong className="text-amber-300">{h.ad}:</strong> {h.aciklama}
                    </div>
                  ))}
                </div>
                <div className="bg-red-950/40 p-2 rounded border border-red-900/40 text-red-200 text-[10px] font-semibold mt-2">
                  Zaaf: {m.zaaf.ad} &mdash; {m.zaaf.aciklama}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EŞYALAR TAB */}
      {altSekme === 'esyalar' && (
        <div className="parchment-sheet p-5 rounded-xl border border-[#523e2c] shadow">
          <h2 className="font-heading font-bold text-sm uppercase text-amber-300 border-b border-[#3e2e20] pb-2 mb-3">
            Standart Aron Fiyat Tarifesi &amp; Ekipman Listesi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {HAZIR_ESYALAR.map((esya) => (
              <div
                key={esya.id}
                className="p-3 rounded bg-[#18130e] border border-[#3e2e20] text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-[#f1e6d4]">{esya.ad}</div>
                  <div className="text-[10px] text-[#93826e]">
                    {esya.tur} • {esya.yuk} Yük
                  </div>
                  <div className="text-[10px] text-[#baa998] italic mt-0.5">
                    {esya.aciklama}
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-amber-300 pl-2">
                  {esya.fiyat} Aron
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DENGE KONSEYİ (TANRILAR) TAB */}
      {altSekme === 'denge' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DENGE_KONSEYI.map((tanri) => (
            <div
              key={tanri.ad}
              className="parchment-sheet p-5 rounded-xl border border-[#523e2c] shadow space-y-2 text-xs"
            >
              <div className="border-b border-[#3e2e20] pb-2">
                <span className="text-[10px] font-heading uppercase text-amber-400 font-bold block">
                  {tanri.unvan}
                </span>
                <h3 className="font-heading font-black text-lg text-[#f1e6d4]">
                  {tanri.ad}
                </h3>
              </div>
              <div>
                <span className="text-[#8e7e6d]">Hükmettiği Alan: </span>
                <span className="font-semibold text-[#eedec8]">{tanri.alan}</span>
              </div>
              <div>
                <span className="text-[#8e7e6d]">Kutsal Sembol: </span>
                <span className="text-[#eedec8]">{tanri.sembol}</span>
              </div>
              <p className="italic text-amber-200/90 text-[11px] bg-[#1a140f] p-2 rounded border border-[#3b2d1f]">
                &quot;{tanri.ogreti}&quot;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
