import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScannerInput } from './components/ScannerInput';
import { ScoreGauge } from './components/ScoreGauge';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { FlagsList } from './components/FlagsList';
import { PromptGeneratorModal } from './components/PromptGeneratorModal';
import { MethodologyModal } from './components/MethodologyModal';
import { AnalysisResult, CategoryKey } from './lib/types';
import { analyzeWebsiteHtml } from './lib/detector';
import { PRESET_SITES } from './lib/presets';
import { ShieldAlert, Sparkles, Wand2, Compass, Layers, CheckCircle2, ArrowDown } from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);

  const handleAnalyze = async (html: string, sourceUrl?: string) => {
    setIsLoading(true);

    try {
      // Step-by-step simulation to visualize the 5 deterministic scanner stages
      setLoadingStep('טוען עץ DOM ומשקף מבנה אלמנטים...');
      await new Promise((r) => setTimeout(r, 220));

      setLoadingStep('סורק ביטויי מפתח מנופחים וקלישאות LLM (Regex Dictionary)...');
      await new Promise((r) => setTimeout(r, 220));

      setLoadingStep('מאתר פלטת סגול/אינדיגו, אפקטי זוהר ו-Glassmorphism...');
      await new Promise((r) => setTimeout(r, 220));

      setLoadingStep('מנתח סימטריה של גריד 3 כרטיסיות וקישורי סרק...');
      await new Promise((r) => setTimeout(r, 200));

      setLoadingStep('מחשב ציון משוקלל ומייצר פרומפט שדרוג ייעודי...');
      await new Promise((r) => setTimeout(r, 150));

      // Pure algorithmic analysis - NO AI API CALLS!
      const analysis = analyzeWebsiteHtml(html, sourceUrl);
      setResult(analysis);
      setSelectedCategory('all');

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById('results-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleScrollToRecommendations = () => {
    const el = document.getElementById('recommendations-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Header onOpenMethodology={() => setIsMethodologyModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>סורק ה-AI Slop המוביל לדפי אינטרנט</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            כמה האתר שלך נראה כמו{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              תוצר AI גנרי?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            הזן קישור לאתר או הדבק קוד HTML. המערכת תסרוק את האתר בשיטה אלגוריתמית דטרמיניסטית{' '}
            <strong className="text-emerald-400 font-semibold">(ללא שימוש ב-AI בזיהוי)</strong>, תספק ציון התאמה מדויק, תסביר למה כל סממן נראה כמו AI, ותפיק פרומפט מותאם אישית לשדרוגו.
          </p>
        </section>

        {/* Scanner Input Panel */}
        <section className="max-w-4xl mx-auto">
          <ScannerInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        </section>

        {/* Results View */}
        {result && (
          <section id="results-section" className="space-y-8 pt-6 animate-in fade-in slide-in-from-bottom-6 duration-300">
            
            {/* Score Gauge Card */}
            <ScoreGauge
              result={result}
              onOpenPrompt={() => setIsPromptModalOpen(true)}
              onScrollToRecommendations={handleScrollToRecommendations}
            />

            {/* Category Breakdown (5 pillars) */}
            <CategoryBreakdown
              categories={result.categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Flags & Detailed Explanations */}
            <FlagsList
              flags={result.flags}
              selectedCategory={selectedCategory}
            />

            {/* Bottom Sticky Action Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-400 font-bold text-lg">
                  <Wand2 className="w-5 h-5" />
                  <span>רוצה ש-AI ישכתב ויתקן את האתר עבורך?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  הפקנו פרומפט פיתוח מדויק המפרט בדיוק אילו קלישאות למחוק, באיזו פלטת צבעים להשתמש ואיך לעצב מחדש.
                </p>
              </div>

              <button
                onClick={() => setIsPromptModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 whitespace-nowrap transition-all active:scale-[0.98]"
              >
                <Wand2 className="w-4 h-4" />
                <span>פתח את מחולל הפרומפטים</span>
              </button>
            </div>

          </section>
        )}

        {/* Initial Empty State / Feature Explainer (when no scan run yet) */}
        {!result && !isLoading && (
          <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-right space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">זיהוי מבוסס כללים וחוקים</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ללא הזיות וללא קריאות ל-LLM. ניתוח דטרמיניסטי של מילים, מבנה HTML, אלמנטי CSS ואייקונים שמאפיינים תבניות V0, Lovable ו-ChatGPT.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-right space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">הסבר "למה זה נראה AI"</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                לא סתם ציון יבש – אלא הסבר מפורט על כל נקודת תורפה: למה גלואו סגול משדר תבנית, למה 3 כרטיסיות צועקות AI, ואיך להפוך אותן לאותנטיות.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-right space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">פרומפט מובנה לשדרוג</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                במקום לכתוב הוראות בעצמך, קבל Master Prompt מוכן להעתקה ל-Claude, Cursor או ChatGPT שמוחק את כל הסממנים ומייצר קוד אנושי ומקורי.
              </p>
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-mono">AI Vibe Detector</span>
            <span>• סורק אתרי אינטרנט היוריסטי</span>
          </div>

          <div className="text-emerald-400/90 font-mono text-[11px] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>הזיהוי מתבצע באופן דטרמיניסטי על גבי ה-DOM ללא מודל AI</span>
          </div>

          <div className="text-slate-400">
            נבנה עבור סטודיו ופיתוח אתרים מקוריים
          </div>
        </div>
      </footer>

      {/* Modals */}
      {result && (
        <PromptGeneratorModal
          isOpen={isPromptModalOpen}
          onClose={() => setIsPromptModalOpen(false)}
          result={result}
        />
      )}

      <MethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />

    </div>
  );
}
