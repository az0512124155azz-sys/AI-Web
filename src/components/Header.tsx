import React from 'react';
import { ShieldAlert, Cpu, Sparkles, Terminal, Info } from 'lucide-react';

interface HeaderProps {
  onOpenMethodology: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMethodology }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">AI Vibe Detector</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                v1.2 Algorithmic
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              מזהה אתרי AI ומדד AI-Slop • ללא שימוש ב-AI בזיהוי
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>זיהוי דטרמיניסטי 100% ללא שימוש במודל AI</span>
          </div>

          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
            title="איך הזיהוי עובד?"
          >
            <Info className="w-4 h-4 text-slate-400" />
            <span>איך זה מזהה?</span>
          </button>
        </div>
      </div>
    </header>
  );
};
