import { PresetSite } from './types';

export const PRESET_SITES: PresetSite[] = [
  {
    id: 'generic-ai-saas',
    name: 'תבנית SaaS ב-AI (ציון גבוה)',
    url: 'https://saasify-nextgen.ai',
    tagline: 'דוגמה לאתר קלאסי של V0/Lovable עם רקע שחור, זוהר סגול, קלישאות ו-3 כרטיסיות',
    expectedScore: 'high',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SaaSify AI - Supercharge Your Next-Gen Workflow</title>
  <meta name="description" content="The all-in-one AI-powered platform to revolutionize and elevate your productivity seamlessly.">
  <meta name="generator" content="v0.dev">
</head>
<body class="bg-[#09090b] text-white">
  <!-- Glowing orbs in background -->
  <div class="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full"></div>
  <div class="absolute top-40 right-10 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full"></div>

  <!-- Header -->
  <header class="border-b border-white/10 backdrop-blur-md px-8 py-4 flex justify-between items-center">
    <div class="font-bold text-xl flex items-center gap-2">
      <span class="text-purple-400">✨</span> SaaSify.ai
    </div>
    <nav class="flex gap-6 text-sm text-zinc-400">
      <a href="#" class="hover:text-white">Features</a>
      <a href="#" class="hover:text-white">Solutions</a>
      <a href="#" class="hover:text-white">Pricing</a>
      <a href="#" class="hover:text-white">About</a>
    </nav>
    <a href="#" class="px-4 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-500">Get Started</a>
  </header>

  <!-- Hero Section -->
  <main class="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
    <!-- Floating Sparkle Badge -->
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold mb-8">
      <span>✨ Powered by AI 2.0</span>
      <span>•</span>
      <span>Introducing Next-Gen Workflows</span>
    </div>

    <!-- Cliche Gradient Heading -->
    <h1 class="text-6xl font-extrabold tracking-tight mb-6">
      Supercharge your productivity with
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400">
        seamless AI intelligence
      </span>
    </h1>

    <p class="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
      In today's fast-paced world, unleash the power of effortless automation. Everything you need to revolutionize your team's potential.
    </p>

    <!-- Two Hero CTAs -->
    <div class="flex items-center justify-center gap-4">
      <a href="#" class="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:opacity-95">
        Get Started Free
      </a>
      <a href="#" class="px-6 py-3.5 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Watch Demo
      </a>
    </div>

    <!-- Symmetrical 3-Card Grid -->
    <section class="mt-32">
      <h2 class="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-4">Features</h2>
      <h3 class="text-3xl font-bold mb-12">Tailored to your needs</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
          <div class="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 text-xl">⚡</div>
          <h4 class="text-xl font-bold mb-2">Automated Workflows</h4>
          <p class="text-zinc-400 text-sm">Say goodbye to repetitive tasks with our revolutionary smart workflows.</p>
        </div>
        <div class="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
          <div class="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 text-xl">🛡️</div>
          <h4 class="text-xl font-bold mb-2">Enterprise Security</h4>
          <p class="text-zinc-400 text-sm">Delve into high-tier enterprise compliance and frictionless security.</p>
        </div>
        <div class="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
          <div class="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6 text-xl">📈</div>
          <h4 class="text-xl font-bold mb-2">Real-time Insights</h4>
          <p class="text-zinc-400 text-sm">Empower your decision making with a tapestry of automated metrics.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials with stock persona -->
    <section class="mt-32 border-t border-white/10 pt-16">
      <div class="p-8 rounded-2xl bg-white/5 border border-white/10 max-w-xl mx-auto">
        <p class="italic text-zinc-300 mb-6">"SaaSify completely transformed the way our team collaborates. A true game-changer!"</p>
        <div class="flex items-center justify-center gap-3">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" class="w-10 h-10 rounded-full" alt="Sarah J.">
          <div class="text-left">
            <div class="font-bold text-sm">Sarah Jenkins</div>
            <div class="text-xs text-zinc-500">VP of Product, Acme Inc.</div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="border-t border-white/10 py-12 text-center text-sm text-zinc-500">
    <div class="flex justify-center gap-6 mb-4">
      <a href="#" class="hover:text-zinc-300">Privacy</a>
      <a href="#" class="hover:text-zinc-300">Terms</a>
      <a href="#" class="hover:text-zinc-300">Contact</a>
    </div>
    <p>© 2025 SaaSify AI. All rights reserved.</p>
  </footer>
</body>
</html>`,
  },
  {
    id: 'authentic-human-craft',
    name: 'אתר אנושי אותנטי (ציון נמוך/אנושי)',
    url: 'https://levin-woodcraft.co.il',
    tagline: 'אתר נגרות בוטיק אותנטי עם סיפור אמיתי, טיפוגרפיה חמה ופרטים מציאותיים',
    expectedScore: 'low',
    html: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>סטודיו לוין - נגרות מסורתית בעץ מלא מאז 1984</title>
  <meta name="description" content="ריהוט בעבודת יד מעץ אלון, אגוז ומייפל בהתאמה אישית בחלל הנגרייה שלנו בקיבוץ גלעד.">
  <link href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@700&family=Assistant:wght@400;600&display=swap" rel="stylesheet">
</head>
<body class="bg-[#f7f5f0] text-[#2c2825] font-sans antialiased">
  <!-- Warm authentic top banner -->
  <div class="bg-[#3e3428] text-[#e8dfd3] py-2 px-6 text-center text-xs tracking-wide">
    סבב הזמנות לחורף 2026 פתוח כעת • 6 שולחנות אחרונים בהקצאה
  </div>

  <header class="max-w-6xl mx-auto px-8 py-8 flex justify-between items-center border-b border-[#e2dcd2]">
    <div>
      <h1 class="font-serif text-2xl font-bold tracking-tight text-[#1c1815]">סטודיו לוין</h1>
      <span class="text-xs text-[#706456]">נגרות עץ מלא • קיבוץ גלעד</span>
    </div>
    <nav class="flex gap-8 text-sm font-medium text-[#4a4035]">
      <a href="/catalog" class="hover:text-black">שולחנות אוכל</a>
      <a href="/process" class="hover:text-black">תהליך הייבוש והחיתוך</a>
      <a href="/workshop" class="hover:text-black">ביקור בנגרייה</a>
      <a href="/contact" class="hover:text-black">יצירת קשר</a>
    </nav>
    <a href="tel:04-8921144" class="px-5 py-2.5 rounded-md bg-[#2c2825] text-[#f7f5f0] text-sm font-semibold hover:bg-black transition-colors">
      התקשרו לנגרייה: 04-8921144
    </a>
  </header>

  <main class="max-w-6xl mx-auto px-8 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7">
        <span class="text-xs font-bold uppercase tracking-wider text-[#8a5d3b]">עבודת יד בלבד</span>
        <h2 class="font-serif text-5xl font-bold text-[#1c1815] mt-3 mb-6 leading-tight">
          שולחנות עץ מלא שנועדו להחזיק שלושה דורות
        </h2>
        <p class="text-lg text-[#554b40] leading-relaxed mb-8">
          אנחנו לא מייצרים בייצור המוני ולא מדביקים שבבים. כל לוח עץ אלון צרפתי או אגוז אמריקאי נבחר ידנית, עובר ייבוש טבעי של שלוש שנים ומלוטש בשמנים טבעיים שלא פולטים רעלים.
        </p>
        <div class="flex gap-4">
          <a href="/catalog" class="px-6 py-3 bg-[#8a5d3b] text-white font-medium rounded-md hover:bg-[#724a2e]">
            צפו בקטלוג השולחנות של השנה
          </a>
          <a href="/visit" class="px-6 py-3 border border-[#c4b9a9] text-[#2c2825] font-medium rounded-md hover:bg-[#ece6dc]">
            תאמו ביקור בנגרייה
          </a>
        </div>
      </div>
      <div class="lg:col-span-5 bg-[#e9e3d8] p-6 rounded-xl border border-[#d6ccbd]">
        <div class="text-sm font-semibold text-[#665a4c] mb-2">מפרט לדוגמה: דגם "כרמל 280"</div>
        <p class="text-xs text-[#706456] leading-relaxed">
          עובי פלטה: 48 מ"מ • חיבורי זנב יונה מסורתיים ללא ברגים נראים לעין • גימור שמן פשתן קר • אחריות ל-25 שנה.
        </p>
      </div>
    </div>
  </main>

  <footer class="bg-[#1f1b17] text-[#a69b8d] py-12 mt-20">
    <div class="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between gap-8 text-xs">
      <div>
        <div class="text-white font-bold text-sm mb-2">סטודיו לוין בע"מ</div>
        <p>קיבוץ גלעד, ד.נ. מגידו 1924500</p>
        <p>טלפון: 04-8921144 | דוא"ל: uri@levin-wood.co.il</p>
        <p>ח.פ: 514892104</p>
      </div>
      <div>
        <p>© 1984–2026 סטודיו לוין. כל הזכויות שמורות.</p>
        <p>צילום נגרייה מקורי: עומר הראל.</p>
      </div>
    </div>
  </footer>
</body>
</html>`,
  },
  {
    id: 'hebrew-ai-landing',
    name: 'דף נחיתה ישראלי בסגנון AI (ציון בינוני-גבוה)',
    url: 'https://growfast-israel.co.il',
    tagline: 'דף נחיתה בעברית עם ביטויי AI אופייניים: "לשדרג את העסק", 3 כרטיסיות ותגיות סגולות',
    expectedScore: 'high',
    html: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>GrowFast - הפלטפורמה המושלמת לניהול העסק שלך</title>
  <meta name="description" content="הדור הבא של ניהול לקוחות. שדרג את הפרודוקטיביות שלך עם פתרון פורץ דרך ללא מאמץ.">
</head>
<body class="bg-slate-900 text-white">
  <div class="py-20 text-center">
    <div class="rounded-full bg-purple-500/20 text-purple-300 text-xs px-4 py-1 inline-block mb-4 border border-purple-500/30">
      ✨ המערכת המובילה בישראל מבוססת בינה מלאכותית
    </div>
    <h1 class="text-5xl font-bold mb-4">
      לשדרג את העסק שלך עם
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        פתרון פורץ דרך
      </span>
    </h1>
    <p class="text-slate-400 max-w-xl mx-auto mb-8">
      בעולם המהיר של ימינו, כל מה שאתה צריך כדי לשנות את כללי המשחק ולמצות את הפוטנציאל שלך במקום אחד.
    </p>
    <div class="flex justify-center gap-4">
      <a href="#" class="px-6 py-3 rounded-full bg-purple-600 text-white font-bold">התחל עכשיו בחינם</a>
      <a href="#" class="px-6 py-3 rounded-full border border-slate-700">צפה בהדגמה</a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20 px-4">
      <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur">
        <h3 class="font-bold text-lg mb-2">אוטומציה חלקה</h3>
        <p class="text-slate-400 text-sm">חוויה חלקה שחוסכת לך זמן יקר בכל יום.</p>
      </div>
      <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur">
        <h3 class="font-bold text-lg mb-2">שליטה מלאה</h3>
        <p class="text-slate-400 text-sm">לרתום את העוצמה של הנתונים לקבלת החלטות חכמות.</p>
      </div>
      <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 backdrop-blur">
        <h3 class="font-bold text-lg mb-2">תמיכה 24/7</h3>
        <p class="text-slate-400 text-sm">מענה מהיר ומקצועי לכל צורך של הארגון.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  },
];
