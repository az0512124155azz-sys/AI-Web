import React from 'react';
import { AnalysisResult } from '../lib/types';
import { ShieldAlert, Sparkles, AlertTriangle, CheckCircle, FileText, Wand2 } from 'lucide-react';

interface ScoreGaugeProps {
  result: AnalysisResult;
  onOpenPrompt: () => void;
  onScrollToRecommendations: () => void;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  result,
  onOpenPrompt,
  onScrollToRecommendations,
}) => {
  const { overallAiScore, verdict, statistics, pageTitle, url } = result;

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallAiScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score <= 25) return { stroke: '#10b981', text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    if (score <= 50) return { stroke: '#38bdf8', text: 'text-sky-400', bg: 'bg-sky-500/10' };
    if (score <= 75) return { stroke: '#f59e0b', text: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { stroke: '#f43f5e', text: 'text-rose-400', bg: 'bg-rose-500/10' };
  };

  const colors = getScoreColor(overallAiScore);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow matching score level */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          overallAiScore > 75 ? 'bg-rose-600' : overallAiScore > 50 ? 'bg-amber-600' : 'bg-emerald-600'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left/Center: Score Circular Gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={colors.stroke}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Gauge Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold font-mono tracking-tighter ${colors.text}`}>
                {overallAiScore}%
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mt-0.5">
                מדד AI Slop
              </span>
            </div>
          </div>

          {/* Verdict Info */}
          <div className="text-center sm:text-right space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
              {overallAiScore > 70 ? (
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              ) : overallAiScore > 40 ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{verdict.sublabel}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {verdict.label}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {overallAiScore > 75
                ? 'האתר מציג חתימה מובהקת של מחולל AI: צבעי ניאון סגולים, קלישאות שיווקיות ריקות, מבנה 3 כרטיסיות זהות ותגיות גלולה גנריות.'
                : overallAiScore > 45
                ? 'באתר קיימים אלמנטים טיפוסיים לתוכן או תבניות AI (כגון מילות תואר מנופחות או סכמת צבעים מוכרת), אך גם נוכחות של מבנה מותאם.'
                : 'האתר מציג מאפיינים מובהקים של עיצוב אנושי אותנטי: תוכן ישיר וקונקרטי, היררכיה מקורית ועוגנים מהעולם האמיתי.'}
            </p>

            {url && (
              <div className="text-xs text-slate-400 font-mono truncate max-w-md pt-1" dir="ltr">
                סריקה עבור: {url}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
          <button
            onClick={onOpenPrompt}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Wand2 className="w-4 h-4" />
            <span>הפק פרומפט AI לשדרוג האתר</span>
          </button>

          <button
            onClick={onScrollToRecommendations}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-medium text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>צפה בהמלצות לשיפור ({result.flags.length} נקודות)</span>
          </button>
        </div>
      </div>

      {/* Bottom Quick Stats Strip */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-right">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
          <div className="text-xs text-slate-400 mb-1">מילות קלישאה שזוהו</div>
          <div className="text-lg font-bold font-mono text-amber-400">
            {statistics.buzzwordCount}
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
          <div className="text-xs text-slate-400 mb-1">אלמנטי סגול/ניאון</div>
          <div className="text-lg font-bold font-mono text-purple-400">
            {statistics.gradientElementsCount}
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
          <div className="text-xs text-slate-400 mb-1">גריד כרטיסיות</div>
          <div className="text-lg font-bold font-mono text-sky-400">
            {statistics.cardCount}
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
          <div className="text-xs text-slate-400 mb-1">קישורי סרק (href="#")</div>
          <div className="text-lg font-bold font-mono text-rose-400">
            {statistics.placeholderLinksCount}
          </div>
        </div>
      </div>
    </div>
  );
};
