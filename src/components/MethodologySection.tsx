import React from 'react';
import { Cpu, ShieldCheck, Scale } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  return (
    <section aria-labelledby="methodology-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Scale className="w-4 h-4 text-amber-400" aria-hidden="true" />
        <h3 id="methodology-heading" className="text-base font-bold text-white tracking-tight">
          מתודולוגיית הבדיקה ואופן חישוב הממצאים
        </h3>
      </div>

      <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <p>
          <strong>הבטחת ״ללא שימוש ב-AI בזיהוי״:</strong> שלב האבחון מתבצע כולו באופן דטרמיניסטי ואלגוריתמי על גבי מבנה ה-HTML, ה-DOM וה-CSS. הנתונים אינם נשלחים למודל שפה חיצוני לצורך ״ניחוש״, אלא נבדקים מול כללים היוריסטיים מוגדרים מראש.
        </p>

        <p>
          <strong>מטרת הכלי:</strong> הכלי מעריך את מידת הדמיון החזותי והתחבירי לתבניות שכיחות שנוצרו על ידי מחוללי קוד (כגון v0 או Lovable) ומודלי שפה. הכלי <strong>אינו מוכיח או מפריך טכנולוגית</strong> האם קוד האתר נכתב על ידי אדם או בסיוע AI.
        </p>

        <div className="pt-2">
          <span className="font-semibold text-slate-200 block mb-2">4 הקטגוריות הפעילות שנבדקות:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-amber-400 block mb-0.5">1. קופי וקלישאות תוכן (משקל ~30%)</strong>
              <span className="text-slate-400">איתור ביטויי מפתח מנופחים ("Supercharge", "פורץ דרך") ומבני משפטים נוסחתיים.</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-amber-400 block mb-0.5">2. שפה חזותית וצבעוניות (משקל ~25%)</strong>
              <span className="text-slate-400">זיהוי רקע כהה עם הילות סגול/אינדיגו זוהרות, טקסט גרדיאנט שקוף ותגיות ניצוצות (✨).</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-amber-400 block mb-0.5">3. מבנה וגריד שבלוני (משקל ~25%)</strong>
              <span className="text-slate-400">בדיקת סימטריה מלאכותית (גריד 3 כרטיסיות זהות) וצמד כפתורי Hero סטנדרטיים.</span>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <strong className="text-amber-400 block mb-0.5">4. עוגנים מהעולם האמיתי (משקל ~20%)</strong>
              <span className="text-slate-400">בדיקת קישורי סרק פיקטיביים (#) ונוכחות פרטי התקשרות או כתובת ממשית.</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-1">
          חישוב רמת הביטחון מבוסס על נפח התוכן שחולץ: בעמודים בעלי תוכן עשיר (מעל 120 מילים) נקבעת רמת ביטחון גבוהה, בעוד שבדפי JavaScript ללא SSR התוצאה מוגדרת כחלקית.
        </p>
      </div>
    </section>
  );
};
