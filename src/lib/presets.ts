import { PresetSite } from './types';

export const DEMO_PRESET_SITES: PresetSite[] = [
  {
    id: 'demo-generic-saas',
    name: 'דוגמה מתועדת א׳: תבנית SaaS שבלונית',
    url: 'https://demo-template-saas.internal',
    tag: 'הדגמת סממנים תבניתיים',
    description: 'דף הדגמה הבנוי עם רקע שחור, גלואו סגול, תגית ניצוצות ✨, 3 כרטיסיות זהות וסופרלטיבים ("Supercharge", "Seamless").',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SaaSify AI - Supercharge Your Next-Gen Workflow</title>
  <meta name="description" content="The all-in-one AI-powered platform to revolutionize and elevate your productivity seamlessly.">
  <meta name="generator" content="v0.dev">
</head>
<body class="bg-[#09090b] text-white">
  <div class="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>
  <header class="border-b border-white/10 backdrop-blur-md px-8 py-4 flex justify-between items-center">
    <div class="font-bold text-xl flex items-center gap-2">
      <span class="text-purple-400">✨</span> SaaSify.ai
    </div>
    <nav class="flex gap-6 text-sm text-zinc-400">
      <a href="#" class="hover:text-white">Features</a>
      <a href="#" class="hover:text-white">Pricing</a>
      <a href="#" class="hover:text-white">About</a>
    </nav>
  </header>
  <main class="max-w-5xl mx-auto px-6 pt-20 pb-20 text-center">
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold mb-8">
      <span>✨ Powered by AI 2.0</span>
      <span>•</span>
      <span>Introducing Next-Gen Workflows</span>
    </div>
    <h1 class="text-5xl font-extrabold tracking-tight mb-6">
      Supercharge your productivity with
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        seamless AI intelligence
      </span>
    </h1>
    <p class="text-lg text-zinc-400 max-w-2xl mx-auto mb-10">
      In today's fast-paced world, unleash the power of effortless automation. Everything you need to revolutionize your team's potential.
    </p>
    <div class="flex items-center justify-center gap-4">
      <a href="#" class="px-6 py-3 rounded-full bg-purple-600 text-white font-semibold">Get Started Free</a>
      <a href="#" class="px-6 py-3 rounded-full border border-white/20 text-white font-medium">Watch Demo</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
        <h3 class="font-bold mb-2">Automated Workflows</h3>
        <p class="text-zinc-400 text-sm">Say goodbye to repetitive tasks with our revolutionary smart workflows.</p>
      </div>
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
        <h3 class="font-bold mb-2">Enterprise Security</h3>
        <p class="text-zinc-400 text-sm">Delve into high-tier enterprise compliance and frictionless security.</p>
      </div>
      <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
        <h3 class="font-bold mb-2">Real-time Insights</h3>
        <p class="text-zinc-400 text-sm">Empower your decision making with a tapestry of automated metrics.</p>
      </div>
    </div>
  </main>
  <footer class="border-t border-white/10 py-8 text-center text-xs text-zinc-500">
    <a href="#" class="mx-2">Privacy</a>
    <a href="#" class="mx-2">Terms</a>
    <p class="mt-2">© 2025 SaaSify AI.</p>
  </footer>
</body>
</html>`,
  },
  {
    id: 'demo-authentic-artisan',
    name: 'דוגמה מתועדת ב׳: אתר מלאכה אותנטי',
    url: 'https://demo-levin-woodcraft.internal',
    tag: 'הדגמת אתר מותאם וייחודי',
    description: 'דף הדגמה אותנטי עם שפה עניינית ללא סופרלטיבים, עוגני יצירת קשר מאומתים, וטיפוגרפיה מותאמת.',
    html: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>סטודיו לוין - נגרות מסורתית בעץ מלא מאז 1984</title>
  <meta name="description" content="ריהוט בעבודת יד מעץ אלון ואגוז בהתאמה אישית בקיבוץ גלעד.">
</head>
<body class="bg-[#f7f5f0] text-[#2c2825] font-sans">
  <header class="max-w-5xl mx-auto px-6 py-8 flex justify-between items-center border-b border-[#e2dcd2]">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[#1c1815]">סטודיו לוין</h1>
      <span class="text-xs text-[#706456]">נגרות עץ מלא • קיבוץ גלעד</span>
    </div>
    <nav class="flex gap-6 text-sm font-medium text-[#4a4035]">
      <a href="/catalog">שולחנות אוכל</a>
      <a href="/process">תהליך הייבוש והחיתוך</a>
      <a href="/contact">יצירת קשר</a>
    </nav>
    <a href="tel:04-8921144" class="px-4 py-2 rounded-md bg-[#2c2825] text-white text-xs font-semibold">
      טלפון: 04-8921144
    </a>
  </header>
  <main class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="text-4xl font-bold text-[#1c1815] mb-6">
      שולחנות עץ מלא שנועדו להחזיק שלושה דורות
    </h2>
    <p class="text-base text-[#554b40] leading-relaxed max-w-2xl mb-8">
      אנחנו לא מדביקים שבבים ולא מייצרים בסרט נע. כל לוח עץ אלון צרפתי נבחר ידנית, עובר ייבוש טבעי של 3 שנים ומלוטש בשמנים טבעיים.
    </p>
    <div class="flex gap-4">
      <a href="/catalog" class="px-5 py-2.5 bg-[#8a5d3b] text-white text-sm font-medium rounded-md">
        צפו בקטלוג הדגמים
      </a>
      <a href="/contact" class="px-5 py-2.5 border border-[#c4b9a9] text-[#2c2825] text-sm font-medium rounded-md">
        תאמו ביקור בנגרייה
      </a>
    </div>
  </main>
  <footer class="bg-[#1f1b17] text-[#a69b8d] py-10 mt-16 text-xs">
    <div class="max-w-5xl mx-auto px-6 flex justify-between items-start">
      <div>
        <p class="text-white font-bold mb-1">סטודיו לוין בע"מ</p>
        <p>קיבוץ גלעד, ד.נ. מגידו 1924500</p>
        <p>טלפון: 04-8921144 | דוא"ל: uri@levin-wood.co.il | ח.פ 514892104</p>
      </div>
      <p>© 1984–2026 סטודיו לוין. כל הזכויות שמורות.</p>
    </div>
  </footer>
</body>
</html>`,
  },
];
