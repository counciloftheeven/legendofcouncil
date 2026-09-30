import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import {
  FileText,
  Eye,
  Edit3,
  Columns,
  Save,
  CheckSquare,
  List,
  Heading,
  Bold,
  Italic,
  Quote,
  Minus,
  Sparkles,
  BookOpen,
  Check
} from 'lucide-react';

interface MarkdownNotesProps {
  initialNotes?: string;
  onSaveNotes: (notes: string) => void;
  characterName: string;
}

const TEMPLATES = {
  plotHooks: `## 📜 Komplo & İpuçları (Plot Hooks)
- [ ] **Galetsha Senetleri:** Maden galerilerindeki gizli kasanın sahte anahtarı kime ait?
- [ ] **Kanlı Kadeh Hanı:** Hancı Tosh geceleri kime şifreli mektup iletiyor?
- [ ] **Mabed Takibi:** Engizitör Malakor'un kurşun mühürlü 7 celladı ne zaman harekete geçecek?

### 🔍 Şüpheliler & Tanıklıklar
> *"Güneş mızrakları batarken, vadideki gölgeler uzar."* — Leydi Valeriya
- **Cassian Galetsha:** Saray borç defterinde 40.000 Aron açık saklıyor.
- **Kör Karga Tosh:** Kanalizasyon dehlizlerini avucunun içi gibi biliyor.`,

  journeyJournal: `## 🗺️ Yolculuk Seyir Defteri
*Stallhart Kalp Eyaletinden çıkış: 14 Ayaz Ayı.*

### ⚔️ Karşılaşmalar & Olaylar
1. **Karanlık Nehir Köprüsü:** Kar fırtınasında pusu kuran 3 harami bertaraf edildi.
2. **Yedi Çan Mabedi:** Sabah 3 çanı çalarken yasak parşömenin bir sayfası kopyalandı.

### 🎒 Yan Görevler & Sözler
- [ ] Selya sınırındaki demirci ustasına 10 parça volkanik çelik ulaştır.
- [x] Hanın borcunu kapat (12 Aron ödendi).`,

  oathsAndDebts: `## ⚖️ Yeminler, Ahitler ve Borçlar
- **Miras Andı:** Babamın çalınan süvari kılıcını Kurultay cephaneliğinden geri alacağım.
- **Kan Borcu:** Lyra bataklıkta hayatımı kurtardı, ona bir can borçluyum.

### 💰 Finansal Yükümlülükler
- **Galetsha Bankası:** Kalan borç 40 Aron (Aylık faiz: 4 Aron).
- **Kurultay Kefareti:** 100 Aronluk kan parası biriktirilecek.`
};

export const MarkdownNotes: React.FC<MarkdownNotesProps> = ({
  initialNotes = '',
  onSaveNotes,
  characterName,
}) => {
  const [content, setContent] = useState<string>(initialNotes);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync when character changes
  useEffect(() => {
    setContent(initialNotes || '');
    setIsSaved(true);
  }, [initialNotes]);

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSaved) {
        onSaveNotes(content);
        setIsSaved(true);
        setSaveSuccessNotice(true);
        setTimeout(() => setSaveSuccessNotice(false), 2000);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [content, isSaved, onSaveNotes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  const handleManualSave = () => {
    sound.playSealStamp();
    onSaveNotes(content);
    setIsSaved(true);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
  };

  // Helper to insert formatting tags at cursor position
  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end) || 'metin';
    const replacement = `${prefix}${selection}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    setIsSaved(false);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selection.length
      );
    }, 50);
  };

  // Insert Templates
  const handleInsertTemplate = (type: keyof typeof TEMPLATES) => {
    sound.playSealStamp();
    const template = TEMPLATES[type];
    const newContent = content.trim() ? `${content}\n\n${template}` : template;
    setContent(newContent);
    setIsSaved(false);
  };

  // Interactive Checkbox Toggle in Preview
  const handleToggleCheckbox = (lineIndex: number) => {
    const lines = content.split('\n');
    if (lines[lineIndex] !== undefined) {
      const line = lines[lineIndex];
      if (line.includes('- [ ]')) {
        lines[lineIndex] = line.replace('- [ ]', '- [x]');
      } else if (line.includes('- [x]')) {
        lines[lineIndex] = line.replace('- [x]', '- [ ]');
      }
      const updated = lines.join('\n');
      setContent(updated);
      setIsSaved(false);
      onSaveNotes(updated);
      sound.playSealStamp();
    }
  };

  // Custom Markdown Parser & Renderer for Dark Fantasy Aesthetics
  const renderFormattedMarkdown = (md: string) => {
    if (!md.trim()) {
      return (
        <div className="py-12 text-center text-[#7e6f5f] text-xs italic">
          Henüz parşömen notu kaydedilmedi. Sol editörden veya yukarıdaki şablonlardan yazmaya başlayın.
        </div>
      );
    }

    const lines = md.split('\n');
    return (
      <div className="space-y-2 text-xs leading-relaxed text-[#ded5c5] font-serif">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Heading 1
          if (trimmed.startsWith('# ')) {
            return (
              <h1
                key={idx}
                className="font-heading font-black text-xl text-amber-200 border-b border-[#4d3a27] pb-1 pt-2"
              >
                {trimmed.replace('# ', '')}
              </h1>
            );
          }

          // Heading 2
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={idx}
                className="font-heading font-bold text-base text-amber-300 border-b border-[#3e2e1f] pb-1 pt-2 flex items-center gap-1.5"
              >
                {trimmed.replace('## ', '')}
              </h2>
            );
          }

          // Heading 3
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={idx}
                className="font-heading font-bold text-sm text-[#e6d0aa] pt-1 text-amber-400/90"
              >
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // Horizontal rule
          if (trimmed === '---' || trimmed === '***') {
            return <hr key={idx} className="border-[#473625] my-2" />;
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="p-2.5 rounded bg-[#1f1711] border-l-4 border-amber-600 italic text-[#cfc0ae] my-1 text-[11px]"
              >
                {parseInlineFormatting(trimmed.replace('> ', ''))}
              </blockquote>
            );
          }

          // Todo / Checkbox list item
          if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
            const isChecked = trimmed.startsWith('- [x]');
            const itemText = trimmed.replace(/- \[[ x]\]/, '').trim();
            return (
              <div
                key={idx}
                onClick={() => handleToggleCheckbox(idx)}
                className={`flex items-start gap-2 p-1 rounded hover:bg-[#201811] cursor-pointer transition-colors ${
                  isChecked ? 'line-through opacity-60 text-stone-400' : 'text-[#f0e5d5]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="mt-0.5 accent-amber-600 rounded cursor-pointer"
                />
                <span className="flex-1 text-[11px] leading-snug">
                  {parseInlineFormatting(itemText)}
                </span>
              </div>
            );
          }

          // Standard Bullet Item
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <li key={idx} className="ml-4 list-disc text-[#d6caba] text-[11px]">
                {parseInlineFormatting(trimmed.replace(/^[-*] /, ''))}
              </li>
            );
          }

          // Numbered Item
          if (/^\d+\.\s/.test(trimmed)) {
            return (
              <div key={idx} className="ml-4 font-mono text-amber-400 text-[11px]">
                {parseInlineFormatting(trimmed)}
              </div>
            );
          }

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Standard paragraph line
          return (
            <p key={idx} className="text-[#ded5c5] text-[11px]">
              {parseInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Inline formatting parser (**bold**, *italic*, `code`)
  const parseInlineFormatting = (text: string): React.ReactNode => {
    // Simple inline replacements
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matchText = match[0];
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="text-amber-200 font-bold">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
        parts.push(
          <em key={match.index} className="text-amber-300/90 italic">
            {matchText.slice(1, -1)}
          </em>
        );
      } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-[#17120e] border border-[#483726] text-amber-300 font-mono text-[10px]"
          >
            {matchText.slice(1, -1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="bg-[#16120e] rounded-xl border border-[#443322] shadow-2xl p-4 sm:p-6 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#36271a] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full wax-seal flex items-center justify-center text-amber-200">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-black text-base sm:text-lg text-amber-200 flex items-center gap-2">
              <span>{characterName} Seyir Defteri &amp; Notlar</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#251b13] border border-[#523e2c] text-[#a99c8b] rounded">
                Markdown
              </span>
            </h2>
            <p className="text-[11px] text-[#93826e] italic">
              Karakterinizin yolculuğu, komplo kancaları (plot hooks) ve gizli yeminleri.
            </p>
          </div>
        </div>

        {/* Action Controls & Views */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status indicator */}
          <div className="text-[10px] font-mono">
            {saveSuccessNotice ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold animate-pulse">
                <Check className="w-3 h-3" /> Arşive Mühürlendi
              </span>
            ) : !isSaved ? (
              <span className="text-amber-400 italic">Kaydediliyor...</span>
            ) : (
              <span className="text-[#756654]">Kayıtlı</span>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#100d0a] p-0.5 rounded border border-[#3b2b1d]">
            <button
              onClick={() => setViewMode('editor')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'editor'
                  ? 'bg-[#352517] text-amber-200 font-bold'
                  : 'text-[#887866] hover:text-[#d3c7b5]'
              }`}
              title="Yalnızca Düzenle"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yaz</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-[#352517] text-amber-200 font-bold'
                  : 'text-[#887866] hover:text-[#d3c7b5]'
              }`}
              title="Bölünmüş Görünüm (Yaz &amp; Önizle)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bölünmüş</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'preview'
                  ? 'bg-[#352517] text-amber-200 font-bold'
                  : 'text-[#887866] hover:text-[#d3c7b5]'
              }`}
              title="Yalnızca Parşömen Önizlemesi"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Önizle</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleManualSave}
            className="px-3 py-1.5 rounded wax-seal text-white font-heading font-bold text-xs hover:brightness-110 flex items-center gap-1.5 shadow"
            title="Notları Anında Arşive Kaydet"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            <span>Mühürle &amp; Kaydet</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar & Preset Templates */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1a140f] p-2 rounded-lg border border-[#3b2b1d] text-xs">
        {/* Markdown Action Buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => insertText('## ', '')}
            className="p-1.5 rounded hover:bg-[#2c2017] text-[#c5b5a2] hover:text-white"
            title="Başlık Ekle (## )"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertText('**', '**')}
            className="p-1.5 rounded hover:bg-[#2c2017] text-[#c5b5a2] hover:text-white font-bold"
            title="Kalın Vurgu (**metin**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertText('*', '*')}
            className="p-1.5 rounded hover:bg-[#2c2017] text-[#c5b5a2] hover:text-white italic"
            title="İtalik Vurgu (*metin*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertText('- [ ] ', '')}
            className="p-1.5 rounded hover:bg-[#2c2017] text-[#c5b5a2] hover:text-white"
            title="Görev / İpucu Kutusu (- [ ] )"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            onClick={() => insertText('- ', '')}
            className="p-1.5 rounded hover:bg-[#2c2017] text-[#c5b5a2] hover:text-white"
            title="Madde İşareti (- )"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertText('> ', '')}
            className="p-1.5 rounded hover:bg-[#2c2017] text-[#c5b5a2] hover:text-white"
            title="Alıntı / Fısıltı (> )"
          >
            <Quote className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => insertText('\n---\n', '')}
            className="p-1.5 rounded hover:bg-[#2c2017] text-[#c5b5a2] hover:text-white"
            title="Ayraç Çizgisi (---)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ready Lore Templates */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-[#867563] font-heading font-semibold">
            Hazır Şablon Ekle:
          </span>
          <button
            onClick={() => handleInsertTemplate('plotHooks')}
            className="px-2 py-0.5 rounded bg-[#251c14] hover:bg-[#382a1e] text-amber-300 text-[11px] border border-[#4d3a28]"
          >
            + Komplo &amp; İpuçları
          </button>
          <button
            onClick={() => handleInsertTemplate('journeyJournal')}
            className="px-2 py-0.5 rounded bg-[#251c14] hover:bg-[#382a1e] text-cyan-300 text-[11px] border border-[#4d3a28]"
          >
            + Seyir Defteri
          </button>
          <button
            onClick={() => handleInsertTemplate('oathsAndDebts')}
            className="px-2 py-0.5 rounded bg-[#251c14] hover:bg-[#382a1e] text-red-300 text-[11px] border border-[#4d3a28]"
          >
            + Ahitler &amp; Borç
          </button>
        </div>
      </div>

      {/* Editor & Preview Panes */}
      <div
        className={`grid gap-4 ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {/* Editor Textarea */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] uppercase font-heading font-bold text-[#8d7c6b] px-1">
              Parşömen Yazarı (Markdown Girişi)
            </span>
            <textarea
              ref={textareaRef}
              rows={14}
              value={content}
              onChange={handleChange}
              placeholder="Karakterinizin yolculuk notlarını, görev ipuçlarını ve şüphelilerini buraya yazın... (Markdown desteklenir: ## Başlık, - [ ] Görev, **kalın**, *italik*)"
              className="w-full bg-[#120f0c] border border-[#443322] rounded-lg p-3.5 text-xs text-[#f1e6d4] font-mono leading-relaxed focus:outline-none focus:border-amber-500 shadow-inner resize-y min-h-[300px]"
            />
          </div>
        )}

        {/* Rendered Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-heading font-bold text-amber-400">
                Parşömen Defteri Önizlemesi
              </span>
              <span className="text-[10px] text-[#786958] italic">
                (Kutucuklara tıklayarak görevleri tamamlayabilirsiniz)
              </span>
            </div>
            <div className="w-full bg-[#17130f] border border-[#4a3827] rounded-lg p-4 shadow-inner min-h-[300px] max-h-[500px] overflow-y-auto">
              {renderFormattedMarkdown(content)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
