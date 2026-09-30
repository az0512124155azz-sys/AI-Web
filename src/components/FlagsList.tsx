import React, { useState } from 'react';
import { DetectedFlag, CategoryKey } from '../lib/types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, HelpCircle, Code } from 'lucide-react';

interface FlagsListProps {
  flags: DetectedFlag[];
  selectedCategory: CategoryKey | 'all';
}

export const FlagsList: React.FC<FlagsListProps> = ({ flags, selectedCategory }) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const filteredFlags =
    selectedCategory === 'all'
      ? flags
      : flags.filter((f) => f.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityBadge = (severity: DetectedFlag['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>סממן AI קריטי</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>סממן AI בינוני</span>
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-500/15 border border-sky-500/30 text-sky-400">
            <Info className="w-3.5 h-3.5" />
            <span>דפוס שבלוני</span>
          </span>
        );
    }
  };

  if (filteredFlags.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-white mb-1">לא אותרו ליקויי AI בקטגוריה זו</h4>
        <p className="text-xs text-slate-400">האתר נראה טבעי ואותנטי לפי המדדים ההיוריסטיים שנבדקו.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="recommendations-section">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            פירוט הליקויים והמלצות לשיפור ({filteredFlags.length} אותרו)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            הסבר מעמיק למה כל סממן נתפס כ-AI וכיצד להפוך אותו לעיצוב אנושי ואותנטי
          </p>
        </div>

        <button
          onClick={() => {
            const allExpanded = filteredFlags.every((f) => expandedIds[f.id]);
            const newMap: Record<string, boolean> = {};
            filteredFlags.forEach((f) => {
              newMap[f.id] = !allExpanded;
            });
            setExpandedIds(newMap);
          }}
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
        >
          {filteredFlags.every((f) => expandedIds[f.id]) ? 'כווץ הכל' : 'פתח הכל'}
        </button>
      </div>

      <div className="space-y-3">
        {filteredFlags.map((flag) => {
          const isExpanded = expandedIds[flag.id] ?? true; // expanded by default

          return (
            <div
              key={flag.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all"
            >
              {/* Card Header Bar */}
              <button
                type="button"
                onClick={() => toggleExpand(flag.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-right gap-4 bg-slate-900/80 hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getSeverityBadge(flag.severity)}
                  <span className="font-bold text-slate-100 text-sm sm:text-base">
                    {flag.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline-block">
                    +{flag.scoreContribution} נק' למדד
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Card Content */}
              {isExpanded && (
                <div className="p-4 sm:p-6 pt-0 border-t border-slate-800/60 space-y-4 bg-slate-950/40">
                  
                  {/* Why it looks like AI */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2">
                      <HelpCircle className="w-4 h-4 flex-shrink-0" />
                      <span>למה זה נראה כמו תוצר AI? (הסבר הליקוי)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {flag.whyItLooksLikeAi}
                    </p>
                  </div>

                  {/* Concrete recommendation on what to do */}
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0" />
                      <span>מה לעשות ואיך לשפר? (המלצה מעשית)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-medium">
                      {flag.recommendation}
                    </p>
                  </div>

                  {/* Detected Snippets / Evidence */}
                  {flag.snippets && flag.snippets.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-2">
                        <Code className="w-3.5 h-3.5 text-amber-400" />
                        <span>ראיות שזוהו בסריקה:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {flag.snippets.map((snip, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-mono text-amber-300/90"
                          >
                            {snip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
