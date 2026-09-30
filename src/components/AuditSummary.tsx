import React from 'react';
import { AuditReport } from '../lib/types';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AuditSummaryProps {
  report: AuditReport;
}

export const AuditSummary: React.FC<AuditSummaryProps> = ({ report }) => {
  const { templateScore, scope, pageTitle, url, analyzedAt } = report;

  const getScoreBadge = (score: number) => {
    if (score >= 75) {
      return {
        color: 'text-rose-400',
        bg: 'bg-rose-950/40 border-rose-500/40',
        icon: <ShieldAlert className="w-4 h-4 text-rose-400" aria-hidden="true" />,
      };
    }
    if (score >= 45) {
      return {
        color: 'text-amber-400',
        bg: 'bg-amber-950/40 border-amber-500/40',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />,
      };
    }
    return {
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-500/40',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
    };
  };

  const badge = getScoreBadge(templateScore.score);

  return (
    <section aria-labelledby="audit-summary-heading" className="space-y-4">
      {/* Partial Content Limitation Warning */}
      {scope.isPartialContent && (
        <div
          role="note"
          aria-label="מגבלת נתונים חלקיים"
          className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-1"
        >
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" aria-hidden="true" />
            <span>מגבלת בדיקה: חולץ תוכן חלקי בלבד</span>
          </div>
          <p className="leading-relaxed">
            {scope.partialContentReason}
          </p>
        </div>
      )}

      {/* Main Score & Meta Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7">
        
        {/* URL and Title Header */}
        <div className="border-b border-slate-800 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="audit-summary-heading" className="text-lg font-bold text-white tracking-tight">
              דוח ביקורת עיצוב ותוכן
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              <span>כותרת הדף שנבדק: </span>
              <span className="font-semibold text-slate-200">"{pageTitle}"</span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 text-left" dir="ltr">
            {url && (
              <span className="block truncate max-w-xs sm:max-w-md text-slate-300" title={url}>
                {url}
              </span>
            )}
            <span className="text-[11px] text-slate-400">בוצע ב-{analyzedAt}</span>
          </div>
        </div>

        {/* Score & Verdict Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Score display */}
          <div className="md:col-span-4 flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-center min-w-[70px]">
              <div className={`text-4xl font-extrabold font-mono tracking-tighter ${badge.color}`}>
                {templateScore.score}
                <span className="text-sm font-normal text-slate-500">/100</span>
              </div>
              <div className="text-[10px] uppercase font-mono text-slate-400 mt-0.5">
                ציון תבניתיות
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" aria-hidden="true" />

            <div className="space-y-1">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bg} ${badge.color}`}>
                {badge.icon}
                <span>{templateScore.ratingLabel}</span>
              </span>
            </div>
          </div>

          {/* Explanation text */}
          <div className="md:col-span-8 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p className="font-medium text-slate-200">
              {templateScore.explanation}
            </p>
            <p className="text-xs text-slate-400">
              הערכה זו מבוססת על השוואת עץ ה-DOM, הטיפוגרפיה, הקופי והסגנונות מול חוקים היוריסטיים בלבד, ללא מעורבות מודל שפה בשלב האבחון.
            </p>
          </div>

        </div>

        {/* Scope of Inspected Data & Confidence Metric */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          
          {/* Scope counts */}
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="font-semibold text-slate-300">היקף המידע שנבדק:</span>
            <span><strong className="text-slate-200 font-mono">{scope.wordCount}</strong> מילים</span>
            <span>•</span>
            <span><strong className="text-slate-200 font-mono">{scope.headingsCount}</strong> כותרות</span>
            <span>•</span>
            <span><strong className="text-slate-200 font-mono">{scope.paragraphsCount}</strong> פסקאות</span>
            <span>•</span>
            <span><strong className="text-slate-200 font-mono">{scope.linksCount}</strong> קישורים</span>
            <span>•</span>
            <span><strong className="text-slate-200 font-mono">{scope.buttonsCount}</strong> כפתורים</span>
          </div>

          {/* Confidence metric with defined rationale */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">רמת ביטחון בהערכה:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                scope.confidenceLevel === 'high'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  : scope.confidenceLevel === 'medium'
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                  : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
              }`}
              title={scope.confidenceReason}
            >
              {scope.confidenceLevel === 'high'
                ? 'גבוהה'
                : scope.confidenceLevel === 'medium'
                ? 'בינונית'
                : 'נמוכה (מידע חלקי)'}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
