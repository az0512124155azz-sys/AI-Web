import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Wand2 } from 'lucide-react';

interface ImprovementPromptProps {
  promptText: string;
}

export const ImprovementPrompt: React.FC<ImprovementPromptProps> = ({ promptText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const openChatGPT = () => {
    const url = `https://chatgpt.com/?q=${encodeURIComponent(promptText)}`;
    window.open(url, '_blank');
  };

  const openClaude = () => {
    const url = `https://claude.ai/new?q=${encodeURIComponent(promptText)}`;
    window.open(url, '_blank');
  };

  return (
    <section aria-labelledby="prompt-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 id="prompt-heading" className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>פרומפט ממוקד להזנה במודל שפה (AI) לשיפור האתר</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            הפרומפט כולל את נתוני האתר שחולצו ואת רשימת התיקונים המדויקת מהדוח, ללא סופרלטיבים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openChatGPT}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>פתיחה ב-ChatGPT</span>
          </button>

          <button
            type="button"
            onClick={openClaude}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>פתיחה ב-Claude</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="generated-prompt-box" className="sr-only">
          תוכן הפרומפט המומלץ
        </label>
        <textarea
          id="generated-prompt-box"
          readOnly
          rows={7}
          value={promptText}
          className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-sans text-slate-200 leading-relaxed resize-none focus:outline-none focus:border-amber-400"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div
          role="status"
          aria-live="polite"
          className="text-xs text-emerald-400 font-medium"
        >
          {copied && 'הפרומפט הועתק ללוח בהצלחה!'}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-950" aria-hidden="true" />
              <span>הועתק ללוח</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" aria-hidden="true" />
              <span>העתקת הפרומפט המלא</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
