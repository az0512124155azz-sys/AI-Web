import { AnalysisResult, CategoryKey, DetectedFlag, Severity } from './types';

// Pure algorithmic heuristic lists - ZERO AI calls used for detection!
const AI_BUZZWORDS_EN: { word: string; weight: number; label: string }[] = [
  { word: 'supercharge', weight: 4, label: 'Supercharge' },
  { word: 'seamlessly', weight: 3, label: 'Seamless / Seamlessly' },
  { word: 'seamless', weight: 3, label: 'Seamless' },
  { word: 'revolutionize', weight: 4, label: 'Revolutionize' },
  { word: 'elevate your', weight: 4, label: 'Elevate your...' },
  { word: 'unleash', weight: 3, label: 'Unleash' },
  { word: 'game-changer', weight: 4, label: 'Game-changer' },
  { word: 'game changer', weight: 4, label: 'Game changer' },
  { word: 'transform the way', weight: 4, label: 'Transform the way' },
  { word: 'next-generation', weight: 3, label: 'Next-generation' },
  { word: 'next generation', weight: 3, label: 'Next generation' },
  { word: 'effortless', weight: 2, label: 'Effortless' },
  { word: 'unlock the power', weight: 4, label: 'Unlock the power' },
  { word: 'unlock your potential', weight: 4, label: 'Unlock your potential' },
  { word: 'tailored to your', weight: 3, label: 'Tailored to your needs' },
  { word: 'all-in-one platform', weight: 3, label: 'All-in-one platform' },
  { word: 'all-in-one solution', weight: 3, label: 'All-in-one solution' },
  { word: 'empower', weight: 2, label: 'Empower' },
  { word: 'delve into', weight: 5, label: 'Delve into (classic LLM)' },
  { word: 'tapestry', weight: 5, label: 'Tapestry (classic LLM)' },
  { word: 'beacon of', weight: 5, label: 'Beacon of (classic LLM)' },
  { word: 'testament to', weight: 4, label: 'Testament to' },
  { word: 'cutting-edge', weight: 2, label: 'Cutting-edge' },
  { word: 'frictionless', weight: 3, label: 'Frictionless' },
  { word: 'say goodbye to', weight: 3, label: 'Say goodbye to...' },
  { word: 'in today\'s fast-paced', weight: 4, label: "In today's fast-paced..." },
  { word: 'reimagined', weight: 3, label: 'Reimagined' },
  { word: 'harness the power', weight: 4, label: 'Harness the power' },
  { word: 'ai-powered', weight: 2, label: 'AI-Powered' },
  { word: 'powered by ai', weight: 2, label: 'Powered by AI' },
];

const AI_BUZZWORDS_HE: { word: string; weight: number; label: string }[] = [
  { word: 'לשדרג את', weight: 3, label: 'לשדרג את' },
  { word: 'שדרג את', weight: 3, label: 'שדרג את' },
  { word: 'חוויה חלקה', weight: 4, label: 'חוויה חלקה' },
  { word: 'פורץ דרך', weight: 4, label: 'פורץ דרך' },
  { word: 'הדור הבא', weight: 3, label: 'הדור הבא' },
  { word: 'למצות את הפוטנציאל', weight: 4, label: 'למצות את הפוטנציאל' },
  { word: 'הכל-באחד', weight: 3, label: 'הכל-באחד' },
  { word: 'הכל באחד', weight: 3, label: 'הכל באחד' },
  { word: 'לשנות את כללי המשחק', weight: 4, label: 'לשנות את כללי המשחק' },
  { word: 'בעולם המהיר', weight: 4, label: 'בעולם המהיר של ימינו' },
  { word: 'מבוסס בינה מלאכותית', weight: 2, label: 'מבוסס בינה מלאכותית' },
  { word: 'לרתום את העוצמה', weight: 4, label: 'לרתום את העוצמה' },
  { word: 'ללא מאמץ', weight: 3, label: 'ללא מאמץ' },
  { word: 'להזניק את', weight: 3, label: 'להזניק את' },
  { word: 'פתרון מושלם', weight: 2, label: 'פתרון מושלם' },
  { word: 'כל מה שאתה צריך', weight: 3, label: 'כל מה שאתה צריך' },
];

// Helper to sanitize and create DOM
function parseHtml(html: string): Document {
  if (typeof window !== 'undefined' && window.DOMParser) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }
  throw new Error('DOMParser is required for browser execution');
}

export function analyzeWebsiteHtml(html: string, sourceUrl?: string): AnalysisResult {
  const doc = parseHtml(html);
  const flags: DetectedFlag[] = [];
  
  // Extract text and basic elements
  const pageTitle = doc.title?.trim() || 'ללא כותרת (No title tag)';
  const metaDescTag = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
  const metaDescription = metaDescTag?.getAttribute('content') || '';
  const bodyText = doc.body ? doc.body.textContent || '' : '';
  const normalizedBodyText = bodyText.toLowerCase().replace(/\s+/g, ' ');
  const rawHtmlLower = html.toLowerCase();

  // Statistics trackers
  const words = bodyText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // ----------------------------------------------------
  // 1. COPYWRITING & BUZZWORDS ANALYSIS (30% weight)
  // ----------------------------------------------------
  const detectedBuzzwords: { label: string; count: number; weight: number }[] = [];
  let buzzwordTotalScore = 0;

  [...AI_BUZZWORDS_EN, ...AI_BUZZWORDS_HE].forEach((item) => {
    const regex = new RegExp(`\\b${item.word.toLowerCase()}\\b|${item.word.toLowerCase()}`, 'gi');
    const matches = normalizedBodyText.match(regex);
    if (matches && matches.length > 0) {
      detectedBuzzwords.push({ label: item.label, count: matches.length, weight: item.weight });
      buzzwordTotalScore += matches.length * item.weight;
    }
  });

  const totalBuzzwordCount = detectedBuzzwords.reduce((sum, b) => sum + b.count, 0);

  if (detectedBuzzwords.length >= 4 || totalBuzzwordCount >= 6) {
    flags.push({
      id: 'high-buzzword-density',
      category: 'copywriting',
      title: 'הצפת קלישאות וביטויי AI נפוצים (High AI Buzzword Density)',
      severity: 'critical',
      scoreContribution: Math.min(35, totalBuzzwordCount * 4),
      whyItLooksLikeAi: 'מודלי שפה (LLMs) משתמשים שוב ושוב באותן מילות תואר מנופחות ("Supercharge", "Seamless", "Revolutionize", "לשדרג את הפוטנציאל") במקום להסביר עובדות קונקרטיות ומה המוצר באמת עושה.',
      recommendation: 'מחק את כל הסופרלטיבים! החלף הבטחות מופשטות כמו "Supercharge your workflow" בנתונים מדידים: "חסוך 4 שעות שבועיות בניהול מלאי".',
      snippets: detectedBuzzwords.map((b) => `"${b.label}" (הופיע ${b.count} פעמים)`),
    });
  } else if (detectedBuzzwords.length >= 1) {
    flags.push({
      id: 'moderate-buzzwords',
      category: 'copywriting',
      title: 'נוכחות ביטויי שיווק שבלוניים של AI',
      severity: 'warning',
      scoreContribution: Math.min(18, totalBuzzwordCount * 3),
      whyItLooksLikeAi: 'נמצאו ביטויים אופייניים לפרומפטים גנריים של יצירת תוכן שיווקי.',
      recommendation: 'כתוב מחדש את הפסקאות בקול אותנטי, ישיר ואישי בגובה העיניים.',
      snippets: detectedBuzzwords.map((b) => `"${b.label}" (${b.count})`),
    });
  }

  // Formulaic headline check: "Everything you need to..." / "The only platform you'll ever need"
  const formulaicPatterns = [
    { regex: /everything you need to/i, label: 'Everything you need to...' },
    { regex: /whether you are a .* or a/i, label: 'Whether you are a [X] or a [Y]' },
    { regex: /in today'?s (fast-paced|modern|digital) world/i, label: 'In today\'s fast-paced world' },
    { regex: /כל מה שאתה צריך כדי/i, label: 'כל מה שאתה צריך כדי...' },
    { regex: /בין אם אתה .* ובין אם/i, label: 'בין אם אתה [X] ובין אם [Y]' },
  ];
  const detectedFormulas = formulaicPatterns.filter((p) => p.regex.test(normalizedBodyText));
  if (detectedFormulas.length > 0) {
    flags.push({
      id: 'formulaic-sentence-structures',
      category: 'copywriting',
      title: 'מבני משפטים נוסחתיים (Formulaic Sentence Structure)',
      severity: 'warning',
      scoreContribution: 12,
      whyItLooksLikeAi: 'תבנית המשפטים "בין אם אתה X או Y" או "כל מה שאתה צריך" היא החתימה המובהקת ביותר של ChatGPT בעת כתיבת דפי נחיתה.',
      recommendation: 'היפטר מהמבנה הנוסחתי. פתח מיד בבעיה המרכזית שהלקוח חווה או בפתרון החד-משמעי.',
      snippets: detectedFormulas.map((f) => f.label),
    });
  }

  // ----------------------------------------------------
  // 2. VISUAL STYLING & DESIGN TROPES (25% weight)
  // ----------------------------------------------------
  let visualScore = 0;

  // A. Purple / Indigo / Violet Neon Gradient Glow
  const purpleGradients = (
    rawHtmlLower.match(/from-purple|to-indigo|from-violet|via-pink|from-fuchsia|purple-600|violet-500|indigo-600|#8b5cf6|#6366f1|#a855f7/g) || []
  ).length;

  const gradientClips = (rawHtmlLower.match(/bg-clip-text|text-transparent.*bg-gradient/g) || []).length;
  const glowingOrbs = (rawHtmlLower.match(/blur-3xl|blur-2xl|blur-xl.*opacity/g) || []).length;

  if (purpleGradients >= 4 || (purpleGradients >= 2 && gradientClips >= 1)) {
    visualScore += 25;
    flags.push({
      id: 'purple-neon-gradient-trope',
      category: 'visualStyling',
      title: 'קלישאת הגלואו הסגול/אינדיגו הניאוני (The Purple AI Glow)',
      severity: 'critical',
      scoreContribution: 25,
      whyItLooksLikeAi: 'מעל 85% מכל אתרי ה-AI שנוצרו ב-2023-2025 משתמשים באותו רקע שחור עם הילת סגול-אינדיגו זוהרת וטקסט עם מפל גרדיאנט. זו החותמת הוויזואלית הכי מזוהה עם כלי AI כמו V0 ו-Lovable.',
      recommendation: 'בחר פלטת צבעים מובחנת ומותגית! עבור לצבעים ארציים (טרה-קוטה, זית, ענבר), כחול עמוק קלאסי או מונוכרום שוויצרי נקי ללא גרדיאנטים זוהרים.',
      snippets: [
        `זוהו ${purpleGradients} מופעי צבע סגול/אינדיגו/פוקסיה בסגנון V0`,
        gradientClips > 0 ? `כותרות עם טקסט גרדיאנט שקוף (bg-clip-text): ${gradientClips}` : '',
        glowingOrbs > 0 ? `אלמנטי זוהר מטושטשים (blur-3xl): ${glowingOrbs}` : '',
      ].filter(Boolean),
    });
  }

  // B. Sparkles / Stars / Magic Wand on Badges
  const sparkleIcons = (rawHtmlLower.match(/✨|⚡|🪄|sparkles|magic-wand|lucide-sparkles/g) || []).length;
  const pillBadges = doc.querySelectorAll('.rounded-full, [class*="rounded-full"]');
  let aiPillBadgeFound = false;

  pillBadges.forEach((badge) => {
    const text = badge.textContent?.toLowerCase() || '';
    if (
      text.includes('ai') ||
      text.includes('בינה') ||
      text.includes('powered') ||
      text.includes('new') ||
      text.includes('חדש') ||
      text.includes('✨')
    ) {
      aiPillBadgeFound = true;
    }
  });

  if (sparkleIcons >= 2 || aiPillBadgeFound) {
    visualScore += 15;
    flags.push({
      id: 'sparkle-pill-badge',
      category: 'visualStyling',
      title: 'תגית גלולה צפה עם ניצוצות (Floating Sparkle Pill Badge)',
      severity: 'warning',
      scoreContribution: 15,
      whyItLooksLikeAi: 'תגית "rounded-full" קטנה בראש עמוד ה-Hero עם אייקון נצנוץ ✨ או הכיתוב "AI-Powered" היא תבנית שבלונית של תבניות מחוללי קוד.',
      recommendation: 'אם יש לך בשורה אמיתית, הבע אותה בכותרת הראשית או בהודעה אינפורמטיבית ללא אייקוני ניצוצות וסופרלטיבים.',
      snippets: [
        sparkleIcons > 0 ? `אייקוני ניצוצות/קסם (✨/🪄): ${sparkleIcons}` : '',
        aiPillBadgeFound ? 'תגית עליונה מסוג "rounded-full" בסגנון AI זוהתה' : '',
      ].filter(Boolean),
    });
  }

  // C. Excessive Glassmorphism (backdrop-blur)
  const backdropBlurCount = (rawHtmlLower.match(/backdrop-blur/g) || []).length;
  if (backdropBlurCount >= 3) {
    visualScore += 12;
    flags.push({
      id: 'glassmorphism-overload',
      category: 'visualStyling',
      title: 'עודף אפקט זכוכית מעורפלת (Glassmorphism Overload)',
      severity: 'info',
      scoreContribution: 10,
      whyItLooksLikeAi: 'שימוש מופרז ב-backdrop-blur יחד עם גבולות דקיקים (border-white/10) מעניק מראה של תבנית מעוצבת ע"י אלגוריתם שלא נבדקה בניגודיות אמיתית.',
      recommendation: 'צמצם את ה-glassmorphism. השתמש במשטחי צבע מוצקים (Solid) בעלי ניגודיות גבוהה ונגישות ברורה.',
      snippets: [`נמצאו ${backdropBlurCount} אלמנטים עם backdrop-blur`],
    });
  }

  // ----------------------------------------------------
  // 3. STRUCTURAL & LAYOUT ARCHETYPE (20% weight)
  // ----------------------------------------------------
  let layoutScore = 0;

  // A. Symmetrical 3-Card Feature Grid
  const grid3Cards = doc.querySelectorAll('.grid-cols-3, [class*="md:grid-cols-3"], [class*="lg:grid-cols-3"]');
  const featureSectionCards = doc.querySelectorAll('.grid > div, [class*="grid"] > div');
  const totalCards = featureSectionCards.length;

  if (grid3Cards.length >= 1) {
    layoutScore += 18;
    flags.push({
      id: 'symmetrical-3-card-grid',
      category: 'layoutArchetype',
      title: 'גריד תכונות סימטרי של 3 כרטיסיות (Cookie-Cutter 3-Column Grid)',
      severity: 'warning',
      scoreContribution: 18,
      whyItLooksLikeAi: 'הסידור של בדיוק 3 כרטיסיות זהות (אייקון בעיגול בראש, כותרת מודגשת של 2 מילים, ו-2 שורות הסבר) הוא ברירת המחדל האוטומטית של כל מחולל אתרים.',
      recommendation: 'שבור את הסימטריה! עצב פריסת Bento Grid עם כרטיס ראשי גדול ותמונת המחשה, לצד כרטיסים צדדיים קטנים יותר, או הראה צילומי מסך אמיתיים מתוך המערכת.',
      snippets: [`זוהו גרידים של 3 עמודות: ${grid3Cards.length}`],
    });
  }

  // B. Standard 2-Button Hero Pattern (Glowing CTA + Outline "Watch Demo")
  const heroButtons = doc.querySelectorAll('main a, main button, header + div a, header + div button');
  const playButtonIcons = (rawHtmlLower.match(/lucide-play|fa-play|<polygon.*points/g) || []).length;
  const demoButtons = Array.from(heroButtons).filter((btn) => {
    const text = btn.textContent?.toLowerCase() || '';
    return text.includes('demo') || text.includes('הדגמה') || text.includes('watch') || text.includes('צפה');
  });

  if (demoButtons.length > 0 && heroButtons.length >= 2) {
    layoutScore += 12;
    flags.push({
      id: 'generic-hero-cta-pair',
      category: 'layoutArchetype',
      title: 'זוג כפתורי Hero שבלוניים (Primary Glow + "Watch Demo")',
      severity: 'info',
      scoreContribution: 10,
      whyItLooksLikeAi: 'כפתור ראשי בוהק ("Get Started Free" / "התחל עכשיו") לצד כפתור שקוף עם משולש Play ("Watch Demo") הוא הדפוס המועתק ביותר מתבניות AI SaaS.',
      recommendation: 'התמקד בהנעה אחת מרכזית ומדויקת לפעולה (Single Strong CTA) או אפשר למשתמש לחוות את המוצר מיד במקום לצפות ב"דמו".',
      snippets: demoButtons.map((b) => `כפתור שזוהה: "${b.textContent?.trim()}"`),
    });
  }

  // C. 3-Tier Pricing with "Most Popular" center badge
  const pricingCards = doc.querySelectorAll('[class*="pricing"], [id*="pricing"], [class*="plan"]');
  const popularBadges = (rawHtmlLower.match(/most popular|הכי פופולרי|מומלץ|best value|popular/gi) || []).length;

  if (popularBadges > 0 || (pricingCards.length >= 3 && pricingCards.length <= 4)) {
    layoutScore += 10;
    flags.push({
      id: 'pricing-table-cliche',
      category: 'layoutArchetype',
      title: 'מבנה תמחור 3 דרגות קלאסי (Classic 3-Tier Pricing Cliché)',
      severity: 'info',
      scoreContribution: 10,
      whyItLooksLikeAi: 'שלוש עמודות (בסיסי, מקצועי, ארגוני) כאשר האמצעית מודגשת עם גבול סגול/גלולה "Most Popular".',
      recommendation: 'עצב את מודל התמחור לפי הערך הייחודי של העסק שלך במקום לשכפל את תבנית ה-SaaS הגנרית.',
      snippets: [`זוהו תגיות פופולריות/המלצה: ${popularBadges}`],
    });
  }

  // ----------------------------------------------------
  // 4. STOCK ASSETS & TECHNICAL FINGERPRINTS (15% weight)
  // ----------------------------------------------------
  let stockScore = 0;

  // Placeholder links (#)
  const links = Array.from(doc.querySelectorAll('a'));
  const placeholderLinks = links.filter((a) => {
    const href = a.getAttribute('href');
    return !href || href === '#' || href === 'javascript:void(0)' || href === '';
  });

  if (links.length > 0 && placeholderLinks.length / links.length > 0.45 && placeholderLinks.length >= 3) {
    stockScore += 20;
    flags.push({
      id: 'dead-placeholder-links',
      category: 'stockAndAssets',
      title: 'ריבוי קישורי סרק פיקטיביים (href="#")',
      severity: 'critical',
      scoreContribution: 20,
      whyItLooksLikeAi: 'מודלי AI מייצרים לעיתים קרובות תפריטי ניווט ופוטר מלאים בקישורים שמובילים לשום מקום (#).',
      recommendation: 'הסר קישורים מיותרים. אתר אמיתי כולל עמודי מדיניות, תנאי שימוש, יצירת קשר ובלוג אמיתי.',
      snippets: [`${placeholderLinks.length} מתוך ${links.length} קישורים באתר מובילים ל-#`],
    });
  }

  // Meta Generator & Tool fingerprints
  const metaGenerator = doc.querySelector('meta[name="generator"]')?.getAttribute('content')?.toLowerCase() || '';
  const isV0OrBolt = 
    metaGenerator.includes('v0') || 
    metaGenerator.includes('bolt') || 
    metaGenerator.includes('lovable') ||
    rawHtmlLower.includes('v0.dev') ||
    rawHtmlLower.includes('lovable.dev');

  if (isV0OrBolt) {
    stockScore += 30;
    flags.push({
      id: 'generator-fingerprint',
      category: 'stockAndAssets',
      title: 'חתימת קוד טכנית של מחולל AI (v0 / Lovable / Bolt)',
      severity: 'critical',
      scoreContribution: 30,
      whyItLooksLikeAi: 'נמצאו תגיות מטא או מחלקות המעידות ישירות על ייצוא ממחולל קוד AI אוטומטי.',
      recommendation: 'נקה תגיות מטא של כלי הפיתוח והגדר מטא-דאטה מותאם אישית למותג שלך.',
      snippets: [`Generator tag / footprint: ${metaGenerator || 'v0/lovable artifact'}`],
    });
  }

  // Stock Avatars & Images
  const imgElements = Array.from(doc.querySelectorAll('img'));
  const stockAvatars = imgElements.filter((img) => {
    const src = img.getAttribute('src') || '';
    return src.includes('unsplash.com/photo-') || src.includes('randomuser.me') || src.includes('i.pravatar.cc') || src.includes('placeholder.com');
  });

  if (stockAvatars.length >= 2) {
    stockScore += 15;
    flags.push({
      id: 'generic-stock-avatars',
      category: 'stockAndAssets',
      title: 'תמונות פרופיל גנריות (Stock Personas)',
      severity: 'warning',
      scoreContribution: 15,
      whyItLooksLikeAi: 'שימוש בתמונות Unsplash אקראיות של אנשים מחייכים עם שמות כמו "Sarah J., VP of Engineering at TechCorp" כהוכחה חברתית פיקטיבית.',
      recommendation: 'החלף בציטוטי לקוחות אמיתיים, קישורים לפרופילי LinkedIn מאומתים, או מקרי בוחן (Case Studies) מפורטים.',
      snippets: stockAvatars.slice(0, 3).map((img) => img.getAttribute('src')?.slice(0, 60) + '...'),
    });
  }

  // ----------------------------------------------------
  // 5. TYPOGRAPHY & IDENTITY MONOTONY (10% weight)
  // ----------------------------------------------------
  let typographyScore = 0;

  // Single system font without display font
  const fontLinks = (rawHtmlLower.match(/fonts\.googleapis\.com\/css2\?family=([^"&]+)/g) || []);
  const usesOnlyInter = rawHtmlLower.includes('font-sans') && !rawHtmlLower.includes('font-serif') && !rawHtmlLower.includes('font-mono') && fontLinks.length <= 1;

  if (usesOnlyInter) {
    typographyScore += 12;
    flags.push({
      id: 'default-inter-typography',
      category: 'typographyIdentity',
      title: 'טיפוגרפיה אחידה וברירת-מחדל (Default Sans Monotony)',
      severity: 'info',
      scoreContribution: 10,
      whyItLooksLikeAi: 'כל מחוללי ה-AI משתמשים בפונט ברירת המחדל Inter / System-UI לכל רוחב האתר ללא שילוב של פונט כותרות מובחן (Display / Serif) שמעניק אופי.',
      recommendation: 'צור היררכיה טיפוגרפית עשירה: שלב פונט כותרות עם נוכחות (Serif מעודן, גופן סריפי אלגנטי או גופן מודרני מודגש) לצד גופן קריאה נוח.',
      snippets: ['נמצא שימוש בגופן יחיד ללא גיוון היררכי או פונט מותג'],
    });
  }

  // Missing real contact details or physical address
  const hasPhoneOrAddress = /tel:|mailto:|headoffice|כתובת|טלפון|ח\.פ|copyright/i.test(normalizedBodyText);
  if (!hasPhoneOrAddress && words.length > 80) {
    typographyScore += 10;
    flags.push({
      id: 'missing-real-world-anchor',
      category: 'typographyIdentity',
      title: 'היעדר עוגנים מהעולם האמיתי (No Real-World Anchors)',
      severity: 'warning',
      scoreContribution: 10,
      whyItLooksLikeAi: 'אתרי AI לרוב חסרים כתובת פיזית, מספר טלפון, פרטי חברה רשומים, או צוות אמיתי, ונראים כמו "מעטפת וירטואלית".',
      recommendation: 'הוסף בפוטר פרטי יצירת קשר אמיתיים, מיקום פיזי, רישום חברה ומדיניות פרטיות ברורה.',
      snippets: ['לא נמצאו מספרי טלפון, כתובת פיזית או פרטי יצירת קשר קונקרטיים'],
    });
  }

  // ----------------------------------------------------
  // WEIGHTED TOTAL SCORE CALCULATION
  // ----------------------------------------------------
  const normCopyScore = Math.min(100, Math.round((buzzwordTotalScore / 18) * 100));
  const normVisualScore = Math.min(100, Math.round((visualScore / 35) * 100));
  const normLayoutScore = Math.min(100, Math.round((layoutScore / 30) * 100));
  const normStockScore = Math.min(100, Math.round((stockScore / 40) * 100));
  const normTypoScore = Math.min(100, Math.round((typographyScore / 20) * 100));

  // Category weights: Copy 30%, Visual 25%, Layout 20%, Stock 15%, Typo 10%
  const weightedScore = Math.round(
    normCopyScore * 0.3 +
    normVisualScore * 0.25 +
    normLayoutScore * 0.2 +
    normStockScore * 0.15 +
    normTypoScore * 0.1
  );

  const overallAiScore = Math.min(100, Math.max(0, weightedScore));

  // Determine Verdict
  let verdict: AnalysisResult['verdict'];
  if (overallAiScore <= 22) {
    verdict = {
      label: 'עיצוב אנושי אותנטי',
      sublabel: 'Human-Crafted & Bespoke',
      level: 'authentic',
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    };
  } else if (overallAiScore <= 48) {
    verdict = {
      label: 'נגיעות AI קלות',
      sublabel: 'Subtle AI Touches / Mostly Human',
      level: 'moderate',
      color: 'text-sky-400',
      bgGradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    };
  } else if (overallAiScore <= 74) {
    verdict = {
      label: 'ניחוח AI מובהק',
      sublabel: 'Strong AI Signature',
      level: 'high',
      color: 'text-amber-400',
      bgGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    };
  } else {
    verdict = {
      label: 'תבנית AI גנרית מובהקת',
      sublabel: 'Pure AI Slop Blueprint',
      level: 'extreme',
      color: 'text-rose-400',
      bgGradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    };
  }

  // ----------------------------------------------------
  // DYNAMIC AI REFACTOR PROMPT GENERATION
  // ----------------------------------------------------
  const prompt = buildRefactorPrompt({
    pageTitle,
    flags,
    detectedBuzzwords: detectedBuzzwords.map((b) => b.label),
    overallAiScore,
  });

  return {
    url: sourceUrl,
    analyzedAt: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    pageTitle,
    metaDescription,
    overallAiScore,
    verdict,
    categories: {
      copywriting: {
        name: 'קופי וקלישאות תוכן',
        score: normCopyScore,
        weight: 30,
        flagCount: flags.filter((f) => f.category === 'copywriting').length,
        description: 'זיהוי ביטויי מפתח מנופחים של מודלי שפה, ניסוחים נוסחתיים והיעדר נתונים ממשיים.',
      },
      visualStyling: {
        name: 'שפה חזותית וצבעוניות',
        score: normVisualScore,
        weight: 25,
        flagCount: flags.filter((f) => f.category === 'visualStyling').length,
        description: 'איתור רקע שחור עם גלואו סגול/אינדיגו, עודף אפקט זכוכית מעורפלת ותגיות ניצוצות.',
      },
      layoutArchetype: {
        name: 'מבנה וגריד שבלוני',
        score: normLayoutScore,
        weight: 20,
        flagCount: flags.filter((f) => f.category === 'layoutArchetype').length,
        description: 'בדיקת סימטריה גנרית: 3 כרטיסיות אחידות, הירו עם שני כפתורים וטבלת מחירים צפויה.',
      },
      stockAndAssets: {
        name: 'נכסים ומטא-דאטה טכני',
        score: normStockScore,
        weight: 15,
        flagCount: flags.filter((f) => f.category === 'stockAndAssets').length,
        description: 'זיהוי קישורי סרק (#), תמונות סטוק Unsplash גנריות וחתימות של מחוללי קוד.',
      },
      typographyIdentity: {
        name: 'טיפוגרפיה ועוגני מציאות',
        score: normTypoScore,
        weight: 10,
        flagCount: flags.filter((f) => f.category === 'typographyIdentity').length,
        description: 'מונוטוניות בגופנים (Inter בלבד) והיעדר עוגנים פיזיים של עסק אותנטי.',
      },
    },
    flags,
    statistics: {
      wordCount,
      buzzwordCount: totalBuzzwordCount,
      gradientElementsCount: purpleGradients,
      cardCount: totalCards,
      placeholderLinksCount: placeholderLinks.length,
      badgeCount: pillBadges.length,
      imageCount: imgElements.length,
    },
    aiRefactorPrompt: prompt,
  };
}

// Builds the requested ready-to-copy AI Refactor prompt
function buildRefactorPrompt(params: {
  pageTitle: string;
  flags: DetectedFlag[];
  detectedBuzzwords: string[];
  overallAiScore: number;
}): string {
  const { pageTitle, flags, detectedBuzzwords, overallAiScore } = params;

  const buzzwordList = detectedBuzzwords.length > 0 
    ? detectedBuzzwords.slice(0, 10).join(', ') 
    : 'supercharge, seamless, elevate, revolutionize';

  const criticalIssues = flags
    .filter((f) => f.severity === 'critical' || f.severity === 'warning')
    .map((f, i) => `${i + 1}. [${f.title}]: ${f.recommendation}`)
    .join('\n');

  return `You are an elite principal web designer and veteran product copywriter known for distinctive, high-converting human web experiences.

I need you to completely refactor and de-slop our website ("${pageTitle}").
Currently, an algorithmic AI-vibe scanner flagged our site with an AI Slop Score of ${overallAiScore}/100.
We need to eliminate every single AI cliché and replace it with bespoke, human-crafted design and sharp editorial copywriting.

CRITICAL DIRECTIVES:

1. COPYWRITING - ZERO SLOP & CONCRETE OUTCOMES:
- Ruthlessly purge these detected AI buzzwords: ${buzzwordList}.
- Delete all formulaic openings like "Whether you are...", "Everything you need to...", or "In today's fast-paced world".
- Write like a confident founder talking to a peer: specific metrics, concrete workflows, and verifiable customer outcomes.
- State exactly what the product does in the first 5 words of the hero headline.

2. VISUAL IDENTITY & PALETTE:
- BAN the generic "dark mode with neon purple/indigo radial glow" and gradient text (bg-clip-text).
- Shift to a deliberate, authentic color palette (e.g., warm stone & terracotta, deep forest slate with crisp parchment accents, or high-contrast architectural monochrome).
- Eliminate floating sparkle badges ("✨ AI-Powered") and excessive glassmorphism (backdrop-blur with border-white/10).

3. LAYOUT & ASYMMETRICAL RHYTHM:
- Break the generic 3-card symmetrical feature grid into a modern Bento Grid or an editorial story layout with varying card weights, real UI previews, and micro-interactions.
- Replace the dual CTA pattern ("Get Started Free" + "Watch Demo") with one unified, frictionless action.

SPECIFIC ISSUES TO FIX BASED ON SCANNER FLAGS:
${criticalIssues || '1. Elevate typography pairing (use a strong editorial serif or distinctive display sans).\n2. Add concrete social proof with verifiable company details.\n3. Make spacing rhythmic and intentional rather than uniform py-20 blocks.'}

Deliver the complete, production-ready code with responsive Tailwind CSS, clean semantic HTML, and zero placeholder links (#).`;
}
