import React, { useState } from 'react';
import { Globe, Code2, Play, Sparkles, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PRESET_SITES } from '../lib/presets';
import { PresetSite } from '../lib/types';

interface ScannerInputProps {
  onAnalyze: (html: string, url?: string) => void;
  isLoading: boolean;
  loadingStep: string;
}

export const ScannerInput: React.FC<ScannerInputProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'html'>('url');
  const [url, setUrl] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setFetchError(null);
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
      setUrl(targetUrl);
    }

    try {
      // Step 1: Attempt to fetch via local backend proxy
      const response = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json();

      if (data.success && data.html) {
        onAnalyze(data.html, targetUrl);
        return;
      }

      // Step 2: Fallback to public CORS proxy if backend blocked or rate-limited
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
        const fallbackRes = await fetch(proxyUrl);
        if (fallbackRes.ok) {
          const fallbackHtml = await fallbackRes.text();
          if (fallbackHtml && fallbackHtml.length > 100) {
            onAnalyze(fallbackHtml, targetUrl);
            return;
          }
        }
      } catch {
        // Fallback failed too
      }

      setFetchError(
        data.error || 'לא ניתן היה לטעון את האתר (ייתכן שיש חסימת בוטים או Cloudflare). נסה להדביק את קוד ה-HTML ישירות בלשונית "הדבקת HTML".'
      );
    } catch (err: unknown) {
      const error = err as Error;
      setFetchError(
        `שגיאת תקשורת: ${error.message || 'בדוק את הקישור או הדבק את קוד ה-HTML ישירות'}`
      );
    }
  };

  const handleHtmlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!htmlCode.trim()) return;
    setFetchError(null);
    onAnalyze(htmlCode, 'קוד HTML שהודבק ידנית');
  };

  const handleSelectPreset = (preset: PresetSite) => {
    setFetchError(null);
    setUrl(preset.url);
    setHtmlCode(preset.html);
    onAnalyze(preset.html, preset.url);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-xl">
      {/* Mode switcher tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'url'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>סריקת קישור (URL)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'html'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>הדבקת קוד (HTML)</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
          סריקה אלגוריתמית מיידית
        </span>
      </div>

      {/* URL Scan Form */}
      {activeTab === 'url' && (
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="הכנס קישור לאתר (למשל: https://example.com או my-startup.io)..."
                dir="ltr"
                className="w-full pl-4 pr-12 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono text-sm"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>סורק...</span>
                </>
              ) : (
                <>
                  <span>נתח אתר</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* HTML Paste Form */}
      {activeTab === 'html' && (
        <form onSubmit={handleHtmlSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={5}
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              placeholder="הדבק כאן את קוד ה-HTML של דף הנחיתה (כולל תגיות head ו-body או העתקה מ-Inspect Element)..."
              dir="ltr"
              className="w-full p-4 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono text-xs leading-relaxed resize-y"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !htmlCode.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>סורק מבנה...</span>
                </>
              ) : (
                <>
                  <span>סרוק קוד HTML</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Loading Steps Indicator */}
      {isLoading && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin flex-shrink-0" />
          <div className="text-sm">
            <div className="font-semibold text-amber-300">בדיקה אלגוריתמית בתהליך...</div>
            <div className="text-xs text-slate-400 font-mono">{loadingStep}</div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {fetchError && (
        <div className="mt-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-200">לא הצלחנו לקרוא את כתובת האתר ישירות</p>
            <p className="text-xs text-rose-300/90">{fetchError}</p>
            <p className="text-xs text-slate-300 mt-2">
              💡 טיפ: פתח את האתר בדפדפן, לחץ מקש ימני &gt; View Page Source, העתק והדבק בלשונית <button type="button" onClick={() => setActiveTab('html')} className="underline text-amber-400 font-bold">הדבקת קוד (HTML)</button>.
            </p>
          </div>
        </div>
      )}

      {/* Presets Quick Picker */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>או נסה מיד אתרי הדגמה מוכנים בלחיצה אחת:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESET_SITES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-right p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      preset.expectedScore === 'high'
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                        : preset.expectedScore === 'low'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                    }`}
                  >
                    {preset.expectedScore === 'high'
                      ? 'AI מובהק'
                      : preset.expectedScore === 'low'
                      ? 'אנושי אותנטי'
                      : 'AI בינוני'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.tagline}
                </p>
              </div>

              <div className="mt-2 text-[10px] font-mono text-slate-500 group-hover:text-slate-300 flex items-center gap-1">
                <span>בדוק דוגמה זו</span>
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
