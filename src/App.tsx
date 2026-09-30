import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScannerInput } from './components/ScannerInput';
import { AuditSummary } from './components/AuditSummary';
import { FindingsReport } from './components/FindingsReport';
import { ImprovementPrompt } from './components/ImprovementPrompt';
import { MethodologySection } from './components/MethodologySection';
import { AuditReport } from './lib/types';
import { analyzeWebsiteHtml } from './lib/detector';

export default function App() {
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleAnalyze = async (html: string, sourceUrl?: string) => {
    setIsLoading(true);

    try {
      setLoadingStep('טוען את עץ ה-DOM ומחלץ כותרות ופסקאות...');
      await new Promise((r) => setTimeout(r, 160));

      setLoadingStep('מבצע בדיקת ביטויים שיווקיים וסופרלטיבים באמצעות מילון אלגוריתמי...');
      await new Promise((r) => setTimeout(r, 160));

      setLoadingStep('בודק מאפייני צבע, הילות רקע ואפקטי ערפול...');
      await new Promise((r) => setTimeout(r, 140));

      setLoadingStep('מנתח סימטריה של גריד וקישורי סרק...');
      await new Promise((r) => setTimeout(r, 140));

      setLoadingStep('מחשב את ציון התבניתיות ומגבש את ממצאי הביקורת...');
      await new Promise((r) => setTimeout(r, 120));

      // Deterministic rule-based evaluation - no AI API calls!
      const auditResult = analyzeWebsiteHtml(html, sourceUrl);
      setReport(auditResult);

      setTimeout(() => {
        const el = document.getElementById('audit-report-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    } catch (err) {
      console.error('Audit analysis failed:', err);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Product Top Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Intro Section with Single H1 */}
        <section aria-labelledby="main-heading" className="space-y-2.5">
          <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            ביקורת עיצוב ותוכן • הערכת שבלוניות
          </div>

          <h1 id="main-heading" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            האתר שלכם נראה כמו תבנית AI?
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            בדיקה אלגוריתמית של מראה ותוכן תבניתיים בדפי אינטרנט. הכלי מזהה קלישאות שיווקיות, הילות צבע שכיחות, גרידים סימטריים וקישורי סרק, ומציג דוח ביקורת מבוסס ראיות לצד המלצות לשיפור.
          </p>

          <p className="text-xs text-slate-500 leading-relaxed">
            * הכלי מעריך מידת דמיון לדפוסי עיצוב תבניתיים, ואינו מהווה הוכחה טכנולוגית לשימוש או אי-שימוש ב-AI בבניית האתר.
          </p>
        </section>

        {/* Input Form Section */}
        <section aria-label="טופס בדיקת אתר">
          <ScannerInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        </section>

        {/* Report Output Screen */}
        {report && (
          <div id="audit-report-container" className="space-y-8 pt-4">
            
            {/* 1. Summary, Score & Scope */}
            <AuditSummary report={report} />

            {/* 2. Detailed Findings (Facts vs Interpretation) */}
            <FindingsReport
              findings={report.findings}
              positiveObservations={report.positiveObservations}
            />

            {/* 3. Practical AI Improvement Prompt */}
            <ImprovementPrompt promptText={report.suggestedPrompt} />

            {/* 4. Methodology Explanation */}
            <MethodologySection />

          </div>
        )}

        {/* Methodology (Always available if report not yet generated) */}
        {!report && (
          <MethodologySection />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-mono">AI Vibe Detector • כלי ביקורת עיצוב ותוכן</span>
          <span className="text-[11px] text-slate-400">
            האבחון מבוסס חוקים דטרמיניסטיים ללא העברת נתונים למודלי AI
          </span>
        </div>
      </footer>

    </div>
  );
}
