import React from 'react';
import { AuditFinding, PositiveObservation } from '../lib/types';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, FileSearch, Lightbulb, Check } from 'lucide-react';

interface FindingsReportProps {
  findings: AuditFinding[];
  positiveObservations: PositiveObservation[];
}

export const FindingsReport: React.FC<FindingsReportProps> = ({
  findings,
  positiveObservations,
}) => {
  const getSeverityBadge = (severity: AuditFinding['severity']) => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-400" aria-hidden="true" />
            <span>חומרה גבוהה</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-400" aria-hidden="true" />
            <span>חומרה בינונית</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
            <Info className="w-3 h-3 text-slate-400" aria-hidden="true" />
            <span>השפעה קלה</span>
          </span>
        );
    }
  };

  return (
    <section aria-labelledby="findings-heading" className="space-y-6">
      
      {/* Findings Section */}
      <div className="space-y-4">
        <div>
          <h3 id="findings-heading" className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>ממצאי ביקורת לפי סדר חומרה ({findings.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            הפרדה ברורה בין עובדות שנאספו מהקוד לבין פרשנות עיצובית והמלצת תיקון
          </p>
        </div>

        {findings.length === 0 ? (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-400">
            לא אותרו סממנים תבניתיים מובהקים בעמוד שנבדק.
          </div>
        ) : (
          <div className="space-y-3.5">
            {findings.map((finding) => (
              <article
                key={finding.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3.5"
              >
                {/* Finding Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(finding.severity)}
                    <h4 className="font-bold text-sm sm:text-base text-slate-100">
                      {finding.title}
                    </h4>
                  </div>
                </div>

                {/* Grid: Fact vs Interpretation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                  
                  {/* Observable Fact */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/90 space-y-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                      עובדה שנמדדה ב-DOM:
                    </span>
                    <p className="text-slate-200">
                      {finding.fact}
                    </p>

                    {finding.snippets.length > 0 && (
                      <div className="pt-1.5 flex flex-wrap gap-1">
                        {finding.snippets.map((snip, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-amber-300/90"
                          >
                            {snip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Design Interpretation */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/90 space-y-1.5">
                    <span className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                      פרשנות עיצובית (מדוע זה תבניתי?):
                    </span>
                    <p className="text-slate-300">
                      {finding.interpretation}
                    </p>
                  </div>

                </div>

                {/* Practical Recommendation */}
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold text-emerald-300 block mb-0.5">המלצת תיקון:</span>
                    <span className="text-emerald-200/90 leading-relaxed">
                      {finding.recommendation}
                    </span>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}
      </div>

      {/* Positive Observations (Balanced Evidence) */}
      {positiveObservations.length > 0 && (
        <div className="space-y-3 pt-2">
          <div>
            <h3 className="text-sm font-bold text-slate-200 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>בחירות מוצלחות ומותאמות שאותרו באתר ({positiveObservations.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              היבטים המעידים על גימור מותאם וייחודי המרחיקים את האתר ממראה של תבנית
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {positiveObservations.map((pos) => (
              <div
                key={pos.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>{pos.title}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {pos.fact}
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800">
                  {pos.significance}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
