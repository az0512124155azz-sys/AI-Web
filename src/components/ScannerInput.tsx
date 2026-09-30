import React, { useState } from 'react';
import { DEMO_PRESET_SITES } from '../lib/presets';
import { PresetSite } from '../lib/types';
import { Globe, Code2, AlertTriangle, ArrowLeft, RefreshCw, FileText } from 'lucide-react';

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
  const [inputError, setInputError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchHtmlViaNetwork = async (targetUrl: string): Promise<string> => {
    // 1. Try local/Vercel API via GET
    try {
      const getRes = await fetch(`/api/fetch-url?url=${encodeURIComponent(targetUrl)}`);
      if (getRes.ok) {
        const data = await getRes.json();
        if (data.success && data.html && data.html.length > 50) {
          return data.html;
        }
      }
    } catch {
      // Proceed to POST
    }

    // 2. Try local/Vercel API via POST
    try {
      const postRes = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });
      if (postRes.ok) {
        const data = await postRes.json();
        if (data.success && data.html && data.html.length > 50) {
          return data.html;
        }
      }
    } catch {
      // Proceed to public fallback proxies
    }

    // 3. Fallback: allorigins
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 50 && !text.includes('Error: Request failed')) {
          return text;
        }
      }
    } catch {
      // Proceed
    }

    // 4. Fallback: corsproxy
    try {
      const proxyUrl2 = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
      const res2 = await fetch(proxyUrl2);
      if (res2.ok) {
        const text2 = await res2.text();
        if (text2 && text2.length > 50) {
          return text2;
        }
      }
    } catch {
      // Proceed
    }

    throw new Error('לא התקבלה גישה לדף (חסימת בוטים של Cloudflare או אבטחת מקור באתר היעד). מומלץ לפתוח את האתר בדפדפן, להעתיק את קוד המקור (View Source), ולהזינו בלשונית "הדבקת קוד HTML".');
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    setFetchError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('יש להזין כתובת אתר תקינה לבדיקה.');
      return;
    }

    let targetUrl = trimmed;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
      setUrl(targetUrl);
    }

    // URL format validation
    try {
      new URL(targetUrl);
    } catch {
      setInputError('מבנה הכתובת אינו תקין. ודאו שהכתובת כוללת דומיין תקני (לדוגמה: https://mysite.com).');
      return;
    }

    try {
      const html = await fetchHtmlViaNetwork(targetUrl);
      onAnalyze(html, targetUrl);
    } catch (err: unknown) {
      const error = err as Error;
      setFetchError(error.message || 'אירעה שגיאה בטעינת האתר.');
    }
  };

  const handleHtmlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    setFetchError(null);

    const trimmed = htmlCode.trim();
    if (!trimmed) {
      setInputError('יש להדביק קוד HTML לפני הפעלת הבדיקה.');
      return;
    }

    if (trimmed.length < 30) {
      setInputError('הקוד שהודבק קצר מדי (פחות מ-30 תווים). אנא הדביקו קוד HTML תקני.');
      return;
    }

    onAnalyze(trimmed, url || 'קוד HTML שהוזן ידנית');
  };

  const handleSelectPreset = (preset: PresetSite) => {
    setInputError(null);
    setFetchError(null);
    setUrl(preset.url);
    setHtmlCode(preset.html);
    onAnalyze(preset.html, preset.url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7">
      
      {/* Mode Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
        <div className="flex gap-2" role="tablist" aria-label="שיטת הזנת נתוני האתר">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'url'}
            aria-controls="panel-url"
            id="tab-url"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'url'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
            <span>בדיקת כתובת אינטרנט</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'html'}
            aria-controls="panel-html"
            id="tab-html"
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'html'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>הדבקת קוד HTML ישיר</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          בדיקת DOM וסגנונות ללא LLM
        </span>
      </div>

      {/* URL Input Form */}
      {activeTab === 'url' && (
        <form
          id="panel-url"
          role="tabpanel"
          aria-labelledby="tab-url"
          onSubmit={handleUrlSubmit}
          className="space-y-3"
          noValidate
        >
          <div>
            <label
              htmlFor="site-url-input"
              className="block text-sm font-semibold text-slate-200 mb-1.5"
            >
              כתובת האתר לבדיקה
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="site-url-input"
                name="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                dir="ltr"
                aria-required="true"
                aria-invalid={inputError !== null}
                aria-describedby={inputError ? 'url-error-msg' : undefined}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>בודק...</span>
                  </>
                ) : (
                  <>
                    <span>בדיקת האתר</span>
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>

          {inputError && (
            <p
              id="url-error-msg"
              role="alert"
              className="text-xs text-rose-400 flex items-center gap-1.5 pt-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{inputError}</span>
            </p>
          )}
        </form>
      )}

      {/* HTML Input Form */}
      {activeTab === 'html' && (
        <form
          id="panel-html"
          role="tabpanel"
          aria-labelledby="tab-html"
          onSubmit={handleHtmlSubmit}
          className="space-y-3"
          noValidate
        >
          <div>
            <label
              htmlFor="html-code-input"
              className="block text-sm font-semibold text-slate-200 mb-1.5"
            >
              קוד HTML לבדיקה (מקור העמוד)
            </label>
            <textarea
              id="html-code-input"
              name="htmlCode"
              rows={6}
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              placeholder="הדביקו כאן את תגיות ה-HTML של הדף (Ctrl+U בדפדפן > העתקת המקור > הדבקה כאן)..."
              dir="ltr"
              aria-required="true"
              aria-invalid={inputError !== null}
              aria-describedby={inputError ? 'html-error-msg' : undefined}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 font-mono text-xs leading-relaxed resize-y focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              disabled={isLoading}
            />
          </div>

          {inputError && (
            <p
              id="html-error-msg"
              role="alert"
              className="text-xs text-rose-400 flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{inputError}</span>
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>בודק קוד...</span>
                </>
              ) : (
                <>
                  <span>בדיקת קוד ה-HTML</span>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Accessible Loading State */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3"
        >
          <RefreshCw className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" aria-hidden="true" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-amber-400 block mb-0.5">בדיקה אלגוריתמית בפעולה</span>
            <span className="font-mono text-slate-400">{loadingStep}</span>
          </div>
        </div>
      )}

      {/* Access Error Banner with Direct Remediation */}
      {fetchError && (
        <div
          role="alert"
          className="mt-4 p-4 bg-slate-950 border border-rose-500/40 rounded-lg text-xs space-y-2 text-rose-300"
        >
          <div className="flex items-center gap-2 font-semibold text-rose-200 text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" aria-hidden="true" />
            <span>כשל בגישה ישירה לאתר</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {fetchError}
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className="text-amber-400 hover:text-amber-300 underline font-medium text-xs flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>מעבר להדבקת קוד HTML (עוקף חסימות רשת)</span>
            </button>
          </div>
        </div>
      )}

      {/* Documented Demonstration Presets */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>דוגמאות מתועדות להמחשת הדוח (לבדיקה ללא קישור חיצוני):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEMO_PRESET_SITES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-right p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 transition-colors group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {preset.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-2 text-[10px] font-mono text-slate-500 group-hover:text-slate-300 flex items-center gap-1">
                <span>טעינת דוגמה זו</span>
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
