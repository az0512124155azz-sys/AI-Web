import React, { useState } from 'react';
import { DEMO_PRESET_SITES } from '../lib/presets';
import { PresetSite } from '../lib/types';
import { Globe, Code2, AlertTriangle, ArrowLeft, RefreshCw, FileText, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const [isNetworkFetching, setIsNetworkFetching] = useState(false);

  // Fetch with strict timeout using AbortController
  const fetchWithTimeout = async (requestUrl: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(requestUrl, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  const fetchHtmlViaNetwork = async (targetUrl: string): Promise<string> => {
    // 1. Try local/Vercel server API first (fastest if backend exists)
    try {
      const getRes = await fetchWithTimeout(`/api/fetch-url?url=${encodeURIComponent(targetUrl)}`, {}, 3000);
      if (getRes.ok) {
        const data = await getRes.json();
        if (data.success && data.html && data.html.length > 50) {
          return data.html;
        }
      }
    } catch {
      // Proceed to public proxies
    }

    // 2. Try codetabs proxy
    try {
      const proxyRes = await fetchWithTimeout(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`, {}, 3500);
      if (proxyRes.ok) {
        const text = await proxyRes.text();
        if (text && text.length > 50 && !text.includes('CodeTabs - Error')) {
          return text;
        }
      }
    } catch {
      // Proceed
    }

    // 3. Try corsproxy.io
    try {
      const proxyRes = await fetchWithTimeout(`https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`, {}, 3500);
      if (proxyRes.ok) {
        const text = await proxyRes.text();
        if (text && text.length > 50) {
          return text;
        }
      }
    } catch {
      // Proceed
    }

    // 4. Try allorigins json endpoint
    try {
      const proxyRes = await fetchWithTimeout(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, {}, 3500);
      if (proxyRes.ok) {
        const json = await proxyRes.json();
        if (json && json.contents && json.contents.length > 50) {
          return json.contents;
        }
      }
    } catch {
      // All attempts exhausted
    }

    throw new Error(
      'דפדפנים אינם מאפשרים סריקה ישירה של אתרים חיצוניים ללא שרת (מגבלת CORS / הגנת Cloudflare). באפשרותך לפתוח את האתר בדפדפן, להעתיק את קוד המקור (Ctrl+U) ולהדביק אותו בלשונית "הדבקת קוד HTML", או לבחור באחת מדוגמאות ההמחשה המוכנות מראש.'
    );
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    setFetchError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('נא להזין כתובת אתר (לדוגמה: example.com) או לבחור דוגמה מוכנה למטה.');
      return;
    }

    let targetUrl = trimmed;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
      setUrl(targetUrl);
    }

    try {
      new URL(targetUrl);
    } catch {
      setInputError('מבנה הכתובת אינו תקין. יש לוודא שהכתובת כוללת דומיין (למשל: https://mysite.com).');
      return;
    }

    setIsNetworkFetching(true);
    try {
      const html = await fetchHtmlViaNetwork(targetUrl);
      setIsNetworkFetching(false);
      onAnalyze(html, targetUrl);
    } catch (err: unknown) {
      setIsNetworkFetching(false);
      const error = err as Error;
      setFetchError(error.message || 'אירעה שגיאה בגישה לאתר.');
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

  const isBusy = isLoading || isNetworkFetching;

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
            onClick={() => {
              setActiveTab('url');
              setInputError(null);
              setFetchError(null);
            }}
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
            onClick={() => {
              setActiveTab('html');
              setInputError(null);
              setFetchError(null);
            }}
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
          בדיקה אלגוריתמית 100% דטרמיניסטית
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
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder="https://example.com"
                dir="ltr"
                aria-required="true"
                aria-invalid={inputError !== null}
                className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                disabled={isBusy}
              />

              <button
                type="submit"
                disabled={isBusy}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isBusy ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>{isNetworkFetching ? 'מתחבר לאתר...' : 'בודק...'}</span>
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
              role="alert"
              className="text-xs text-rose-400 flex items-center gap-1.5 pt-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{inputError}</span>
            </p>
          )}

          {/* Quick Demo Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="text-[11px] text-slate-400">או נסו דוגמה מיידית:</span>
            {DEMO_PRESET_SITES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{preset.name.replace(/דוגמה מתועדת [א-ת]׳:\s*/, '')}</span>
              </button>
            ))}
          </div>
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
              onChange={(e) => {
                setHtmlCode(e.target.value);
                if (inputError) setInputError(null);
              }}
              placeholder="הדביקו כאן את תגיות ה-HTML של הדף (Ctrl+U בדפדפן > בחירת הכל Ctrl+A > העתקה והדבקה כאן)..."
              dir="ltr"
              aria-required="true"
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 font-mono text-xs leading-relaxed resize-y focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              disabled={isBusy}
            />
          </div>

          {inputError && (
            <p
              role="alert"
              className="text-xs text-rose-400 flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{inputError}</span>
            </p>
          )}

          <div className="flex justify-between items-center pt-1">
            <span className="text-[11px] text-slate-400">
              * קוד ה-HTML מעובד מקומית בדפדפן בלבד ואינו נשלח לשום שרת
            </span>
            <button
              type="submit"
              disabled={isBusy}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isBusy ? (
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
      {isBusy && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-3 animate-pulse"
        >
          <RefreshCw className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" aria-hidden="true" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-amber-400 block mb-0.5">
              {isNetworkFetching ? 'מתחבר ומוריד את דף האתר...' : 'בדיקה אלגוריתמית בפעולה'}
            </span>
            <span className="font-mono text-slate-400">
              {loadingStep || 'מנתח מבנה תגיות, טיפוגרפיה וסגנונות...'}
            </span>
          </div>
        </div>
      )}

      {/* Access Error Banner with Direct Remediation */}
      {fetchError && (
        <div
          role="alert"
          className="mt-4 p-4 bg-slate-950 border border-amber-500/40 rounded-lg text-xs space-y-3"
        >
          <div className="flex items-center gap-2 font-semibold text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>האתר מוגן מפני סריקה ישירה ברשת</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            {fetchError}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className="text-amber-400 hover:text-amber-300 underline font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>הדבקת קוד HTML ידנית (פועל תמיד)</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => handleSelectPreset(DEMO_PRESET_SITES[0])}
              className="text-slate-300 hover:text-white underline font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>הרצת בדיקה מיידית על אתר דוגמה</span>
            </button>
          </div>
        </div>
      )}

      {/* Documented Demonstration Presets */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
          <span>דוגמאות מתועדות להמחשת הבדיקה והדוח:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEMO_PRESET_SITES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-right p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all group flex flex-col justify-between cursor-pointer"
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

              <div className="mt-2 text-[10px] font-mono text-slate-500 group-hover:text-amber-300 flex items-center gap-1">
                <span>לחץ לסריקת דוגמה זו</span>
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
