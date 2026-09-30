import React from 'react';
import { Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 py-3">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
            AI Vibe Detector
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs text-slate-400">כלי ביקורת עיצוב ותוכן</span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          סריקה אלגוריתמית דטרמיניסטית
        </div>
      </div>
    </header>
  );
};
