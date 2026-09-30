import React, { useState } from 'react';
import { AnalysisResult } from '../lib/types';
import { Wand2, Copy, Check, X, Sparkles, Terminal, Sliders, ArrowLeft, Bot } from 'lucide-react';

interface PromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

type TargetStyle = 'swiss-minimalist' | 'editorial-serif' | 'warm-artisan' | 'concrete-b2b';
type TargetTool = 'claude' | 'chatgpt' | 'cursor' | 'v0';

export const PromptGeneratorModal: React.FC<PromptGeneratorModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [targetTool, setTargetTool] = useState<TargetTool>('claude');
  const [targetStyle, setTargetStyle] = useState<TargetStyle>('concrete-b2b');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const styleProfiles: Record<TargetStyle, { name: string; desc: string; palette: string }> = {
    'concrete-b2b': {
      name: 'B2B קונקרטי וישיר (High-Trust B2B)',
      desc: 'ללא שום סופרלטיבים. נתונים קונקרטיים, צבעי כחול נייבי עמוק/אפור פלדה, ללא גרדיאנטים.',
      palette: 'Deep Navy (#0a192f), Slate (#64748b), Pure White (#ffffff), Crisp Teal accent',
    },
    'swiss-minimalist': {
      name: 'מינימליזם שוויצרי מודרני (Swiss Minimalist)',
      desc: 'גריד א-סימטרי מדויק, רווחים נדיבים, שחור-לבן ארכיטקטוני עם נגיעת צבע אחת חדה.',
      palette: 'Monochrome Black & White (#000000 / #fcfcfc) with one vivid signal accent (#ff3b00)',
    },
    'editorial-serif': {
      name: 'עריכתי אלגנטי (Editorial High-Fashion)',
      desc: 'טיפוגרפיה סריפית מרשימה, מרווח אותיות מעודן, צבעי אבן ואופ-ווייט יוקרתיים.',
      palette: 'Warm Stone (#f4f1ea), Charcoal (#1a1a1a), Muted Sage (#8b9b88)',
    },
    'warm-artisan': {
      name: 'ארצי ואותנטי (Warm Craft & Organic)',
      desc: 'גווני אדמה חמים, טקסטורות עדינות, תמונות אותנטיות מהעולם האמיתי.',
      palette: 'Terracotta (#c25e3f), Forest Olive (#3b4d3c), Cream Linen (#faf6f0)',
    },
  };

  // Generate customized prompt
  const generatePrompt = () => {
    const buzzwordsList = result.flags
      .find((f) => f.id === 'high-buzzword-density' || f.id === 'moderate-buzzwords')
      ?.snippets?.join(', ') || 'supercharge, seamless, elevate, revolutionize, game-changer';

    const selectedStyleInfo = styleProfiles[targetStyle];

    const flaggedItems = result.flags
      .map((f, i) => `${i + 1}. [${f.title}]: ${f.recommendation}`)
      .join('\n');

    return `### SYSTEM ROLE:
You are an award-winning Principal Product Designer and Senior Copywriter who despises "AI slop" and cookie-cutter website designs.

### TASK:
Completely redesign and rewrite the code for our website: "${result.pageTitle}".
Our website was evaluated by an algorithmic heuristic AI-Vibe detector and scored a critical **${result.overallAiScore}/100 AI-Slop rating**.
Your goal is to humanize the design, eliminate all AI hallmarks, and deliver production-grade code.

### TARGET TOOL FORMAT:
Optimized for: ${targetTool.toUpperCase()}
Design Aesthetic: ${selectedStyleInfo.name}
Target Color Palette: ${selectedStyleInfo.palette}

### STRICT MANDATES:

1. COPYWRITING - TOTAL DE-SLOPPING:
- Purge every single one of these detected AI buzzwords: ${buzzwordsList}.
- Banned phrases: "Whether you are a...", "In today's fast-paced world", "Unlock your potential", "Everything you need to...".
- First 5 words of the Hero headline must immediately define the tangible product action.
- Replace generic claims with verifiable metrics, realistic timeframes, and customer workflows.

2. VISUAL IDENTITY:
- Strictly remove all dark-mode neon purple/indigo radial gradient orbs (blur-3xl) and gradient text (bg-clip-text).
- Remove floating pill badges with sparkle icons (✨ / 🪄 / "AI-Powered").
- Adopt the specified palette: ${selectedStyleInfo.palette}.
- Minimize glassmorphism (backdrop-blur with white/10 borders); use high-contrast solid backgrounds with clear borders.

3. LAYOUT & HIERARCHY:
- Destroy the uniform 3-card symmetrical feature grid.
- Build an asymmetrical Bento Grid or an interactive step-by-step product walkthrough with varied card sizes and realistic UI components.
- Hero CTA: Replace the generic "Get Started" + "Watch Demo" dual buttons with a single clear, compelling primary action.

### SPECIFIC HEURISTIC DEFECTS TO REMOVE:
${flaggedItems}

### OUTPUT REQUIRED:
Provide the full, clean HTML/Tailwind CSS or React component code with accessible contrast, thoughtful typographic hierarchy, and responsive mobile-first structure.`;
  };

  const promptText = generatePrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                מחולל פרומפט AI לשדרוג ושיפור האתר
              </h3>
              <p className="text-xs text-slate-400">
                העתק את הפרומפט הזה ל-Claude, ChatGPT, Cursor או V0 כדי לשכתב את האתר ולמחוק את כל סימני ה-AI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="p-6 pb-2 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target Tool */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>כלי ה-AI שבו תשתמש לעיצוב מחדש:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'claude', name: 'Claude 3.7 / 3.5' },
                  { id: 'chatgpt', name: 'ChatGPT 4o' },
                  { id: 'cursor', name: 'Cursor / Windsurf' },
                  { id: 'v0', name: 'v0 / Lovable' },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setTargetTool(tool.id as TargetTool)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      targetTool === tool.id
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Aesthetic Style */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>סגנון עיצוב חלופי אנושי ומקורי:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(styleProfiles) as TargetStyle[]).map((styleKey) => (
                  <button
                    key={styleKey}
                    onClick={() => setTargetStyle(styleKey)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      targetStyle === styleKey
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {styleProfiles[styleKey].name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-amber-400">סגנון נבחר: </span>
            <span>{styleProfiles[targetStyle].desc}</span>
          </div>
        </div>

        {/* Prompt Preview Codeblock */}
        <div className="px-6 py-2 flex-1 min-h-[220px] flex flex-col">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-mono text-slate-400">Master Prompt מוכן להעתקה:</span>
            <span className="text-[11px] text-emerald-400 font-mono">
              מותאם אישית ל-{result.flags.length} הליקויים שזוהו
            </span>
          </div>

          <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-4">
            <pre
              dir="ltr"
              className="w-full h-48 sm:h-56 overflow-y-auto text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed selection:bg-amber-500/30"
            >
              {promptText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            סגור
          </button>

          <button
            onClick={handleCopy}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>הועתק ללוח בהצלחה!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>העתק פרומפט מלא</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
