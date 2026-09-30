import React from 'react';
import { X, Cpu, CheckCircle2, ShieldCheck, Zap, Database, Code } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                מתודולוגיית הזיהוי: אלגוריתם דטרמיניסטי ללא AI
              </h3>
              <p className="text-xs text-slate-400">
                100% שקיפות • חוקים היוריסטיים בלבד • ללא שליחת נתונים למודלי שפה
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto text-sm text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300 mb-1">מדוע אין כאן שימוש ב-AI?</div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                כפי שהוגדר במפורש בדרישות המערכת, מנוע הזיהוי אינו מבצע קריאות API למודלי שפה (כמו GPT או Gemini) כדי "לנחש" או להמציא הזיות. הזיהוי מבוסס על ניתוח תחבירי (AST), ניתוח DOM, וביטויי מפתח מוכחים המאפיינים כלי ייצור אוטומטיים.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>5 העוגנים האלגוריתמיים של מנוע הזיהוי:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">1. מילון קלישאות תוכן (30%)</div>
                <p className="text-slate-400">
                  סריקה מילונית מבוססת Regex לאיתור מילות תואר של LLM כגון "Supercharge", "Seamless", "Revolutionize", "לשדרג את הפוטנציאל".
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">2. גלואו סגול וצבעוניות V0 (25%)</div>
                <p className="text-slate-400">
                  איתור מחלקות עיצוב אופייניות: הילות סגול/אינדיגו (blur-3xl), טקסט שקוף עם גרדיאנט, ותגיות גלולה עם אייקון ✨.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">3. סימטריה וגריד 3 כרטיסיות (20%)</div>
                <p className="text-slate-400">
                  ניתוח עץ ה-DOM: זיהוי גרידים של בדיוק 3 כרטיסיות זהות בגודלן, והירו עם צמד כפתורים גנרי (ראשי בוהק + "Watch Demo").
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">4. נכסים וקישורי סרק (15%)</div>
                <p className="text-slate-400">
                  חישוב אחוז הקישורים הפיקטיביים (href="#"), תגיות meta generator (כמו v0 או lovable) ותמונות סטוק גנריות.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 sm:col-span-2">
                <div className="font-bold text-slate-200 mb-1">5. טיפוגרפיה ועוגני מציאות (10%)</div>
                <p className="text-slate-400">
                  בדיקת הימצאות עוגני עסק אמיתיים: כתובת פיזית, טלפון, ח.פ, ושימוש בגופן יחיד ללא היררכיה מותגית.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-bold text-slate-200">יתרונות הזיהוי ההיוריסטי:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>מהירות מיידית (פחות מ-200ms מרגע טעינת ה-HTML).</li>
              <li>אפס עלויות טוקנים ואפס תלות בספקי ענן חיצוניים.</li>
              <li>תוצאות שקופות, עקביות וניתנות לשחזור מדויק בכל בדיקה.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            הבנתי, תודה
          </button>
        </div>

      </div>
    </div>
  );
};
