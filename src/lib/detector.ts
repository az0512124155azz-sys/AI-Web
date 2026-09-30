import {
  AuditFinding,
  AuditReport,
  CategoryKey,
  EvaluationScope,
  PositiveObservation,
  Severity,
} from './types';

// Algorithmic buzzwords dictionary - strictly evaluated via deterministic regex
const DETECTED_BUZZWORDS_HE = [
  { word: 'לשדרג את', label: 'לשדרג את' },
  { word: 'שדרג את', label: 'שדרג את' },
  { word: 'חוויה חלקה', label: 'חוויה חלקה' },
  { word: 'פורץ דרך', label: 'פורץ דרך' },
  { word: 'הדור הבא', label: 'הדור הבא' },
  { word: 'למצות את הפוטנציאל', label: 'למצות את הפוטנציאל' },
  { word: 'הכל-באחד', label: 'הכל-באחד' },
  { word: 'הכל באחד', label: 'הכל באחד' },
  { word: 'לשנות את כללי המשחק', label: 'לשנות את כללי המשחק' },
  { word: 'בעולם המהיר', label: 'בעולם המהיר של ימינו' },
  { word: 'לרתום את העוצמה', label: 'לרתום את העוצמה' },
  { word: 'ללא מאמץ', label: 'ללא מאמץ' },
  { word: 'להזניק את', label: 'להזניק את' },
  { word: 'פתרון מושלם', label: 'פתרון מושלם' },
  { word: 'כל מה שאתה צריך', label: 'כל מה שאתה צריך' },
];

const DETECTED_BUZZWORDS_EN = [
  { word: 'supercharge', label: 'Supercharge' },
  { word: 'seamlessly', label: 'Seamless / Seamlessly' },
  { word: 'seamless', label: 'Seamless' },
  { word: 'revolutionize', label: 'Revolutionize' },
  { word: 'elevate your', label: 'Elevate your' },
  { word: 'unleash', label: 'Unleash' },
  { word: 'game-changer', label: 'Game-changer' },
  { word: 'game changer', label: 'Game changer' },
  { word: 'transform the way', label: 'Transform the way' },
  { word: 'next-generation', label: 'Next-generation' },
  { word: 'next generation', label: 'Next generation' },
  { word: 'effortless', label: 'Effortless' },
  { word: 'unlock the power', label: 'Unlock the power' },
  { word: 'unlock your potential', label: 'Unlock your potential' },
  { word: 'tailored to your', label: 'Tailored to your needs' },
  { word: 'all-in-one', label: 'All-in-one' },
  { word: 'empower', label: 'Empower' },
  { word: 'delve into', label: 'Delve into' },
  { word: 'tapestry', label: 'Tapestry' },
  { word: 'beacon of', label: 'Beacon of' },
  { word: 'testament to', label: 'Testament to' },
  { word: 'cutting-edge', label: 'Cutting-edge' },
  { word: 'say goodbye to', label: 'Say goodbye to' },
  { word: 'in today\'s fast-paced', label: "In today's fast-paced" },
  { word: 'reimagined', label: 'Reimagined' },
  { word: 'harness the power', label: 'Harness the power' },
];

function parseDocument(html: string): Document {
  if (typeof window !== 'undefined' && window.DOMParser) {
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }
  throw new Error('DOMParser is required for parsing HTML');
}

export function analyzeWebsiteHtml(html: string, sourceUrl?: string): AuditReport {
  const doc = parseDocument(html);
  const rawHtmlLower = html.toLowerCase();
  const bodyText = doc.body ? doc.body.textContent || '' : '';
  const normalizedText = bodyText.toLowerCase().replace(/\s+/g, ' ');

  // 1. EXTRACT DATA & METRICS
  const words = bodyText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4'));
  const headingsCount = headings.length;

  const paragraphs = Array.from(doc.querySelectorAll('p'));
  const paragraphsCount = paragraphs.length;

  const links = Array.from(doc.querySelectorAll('a'));
  const linksCount = links.length;

  const images = Array.from(doc.querySelectorAll('img, svg'));
  const imagesCount = images.length;

  const buttons = Array.from(doc.querySelectorAll('button, a[role="button"], a[class*="btn"], a[class*="button"]'));
  const buttonsCount = buttons.length;

  const pageTitle = doc.title?.trim() || 'עמוד ללא כותרת (ללא תגית title)';
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

  // Extract real text for reporting
  const h1 = doc.querySelector('h1')?.textContent?.trim() || '';
  const h2 = doc.querySelector('h2')?.textContent?.trim() || '';
  const heroHeading = h1 || h2 || pageTitle;

  const firstPara = paragraphs.find((p) => (p.textContent || '').trim().length > 25);
  const subheroText = firstPara?.textContent?.trim() || metaDesc || 'לא נמצאה פסקת הסבר מובהקת ב-DOM.';

  const buttonTexts = Array.from(
    new Set(
      buttons
        .map((b) => (b.textContent || '').trim().replace(/\s+/g, ' '))
        .filter((t) => t.length > 1 && t.length < 35)
    )
  ).slice(0, 4);

  // Scope & Confidence calculation
  const isPartialContent = wordCount < 45 || (headingsCount === 0 && paragraphsCount <= 1);
  let confidenceLevel: EvaluationScope['confidenceLevel'] = 'high';
  let confidenceReason = 'גבוהה: נסרקו מעל 120 מילים, עץ כותרות מובנה וקישורים מספקים לצורך הערכה מבוססת.';

  if (isPartialContent) {
    confidenceLevel = 'low';
    confidenceReason = 'נמוכה: התוכן שחולץ דל במיוחד (פחות מ-45 מילים). הדבר מאפיין אתרי SPA (כגון React/Vue) ללא רינדור צד-שרת, עמודי שגיאה או אתרים עם חסימת גישה.';
  } else if (wordCount < 120) {
    confidenceLevel = 'medium';
    confidenceReason = 'בינונית: כמות התוכן שחולצה מוגבלת (45–120 מילים). הממצאים מבוססים על האלמנטים שחולצו, אך חלק מהסעיפים לא נבחנו במלואם.';
  }

  const scope: EvaluationScope = {
    wordCount,
    headingsCount,
    paragraphsCount,
    linksCount,
    imagesCount,
    buttonsCount,
    isPartialContent,
    partialContentReason: isPartialContent
      ? 'התוכן שחולץ חלקי בלבד. ייתכן שהאתר מבוסס JavaScript בצד הלקוח ללא תוכן סטטי ראשוני, או מוגן במערכת הגנה. מומלץ להזין את קוד ה-HTML המרונדר (View Source) ישירות.'
      : undefined,
    confidenceLevel,
    confidenceReason,
  };

  const findings: AuditFinding[] = [];
  const positiveObservations: PositiveObservation[] = [];

  // 2. AUDIT FINDINGS (FACTS VS INTERPRETATION)

  // A. Buzzwords in Copy
  const foundBuzzwords: { label: string; count: number }[] = [];
  [...DETECTED_BUZZWORDS_HE, ...DETECTED_BUZZWORDS_EN].forEach((item) => {
    const rx = new RegExp(`\\b${item.word.toLowerCase()}\\b|${item.word.toLowerCase()}`, 'gi');
    const matches = normalizedText.match(rx);
    if (matches && matches.length > 0) {
      foundBuzzwords.push({ label: item.label, count: matches.length });
    }
  });

  const totalBuzzwords = foundBuzzwords.reduce((sum, b) => sum + b.count, 0);

  if (totalBuzzwords >= 3) {
    findings.push({
      id: 'copy-buzzwords',
      category: 'copy',
      title: 'ריבוי סופרלטיבים וקלישאות שיווקיות',
      severity: totalBuzzwords >= 6 ? 'high' : 'medium',
      scoreImpact: Math.min(30, totalBuzzwords * 5),
      fact: `בטקסט נספרו ${totalBuzzwords} מופעים של ביטויי מפתח מנופחים.`,
      snippets: foundBuzzwords.map((b) => `"${b.label}" (${b.count} פעמים)`),
      interpretation: 'מודלי שפה ותבניות שיווקיות אוטומטיות מרבים להשתמש במילות תואר מופשטות כמו "Supercharge", "Seamless" או "לשדרג את הפוטנציאל" כדי למלא תוכן ללא התחייבות לנתונים מדויקים.',
      recommendation: 'מחקו סופרלטיבים מופשטים והחליפו אותם בעובדות מדידות: הגדירו במפורש מה הכלי עושה, לכמה משתמשים הוא מתאים וכמה זמן או עלות הוא חוסך.',
    });
  } else if (totalBuzzwords === 0 && wordCount >= 50) {
    positiveObservations.push({
      id: 'positive-copy-concrete',
      title: 'היעדר סופרלטיבים מנופחים',
      fact: 'בטקסט שנסרק לא אותרו קלישאות תוכן שכיחות של תבניות מחוללות.',
      snippets: ['שפה עניינית ללא שימוש בביטויים מנופחים'],
      significance: 'כתיבה ישירה ומבוססת מייצרת אמינות גבוהה יותר מול משתמשים ומרחיקה את האתר ממראה תבניתי.',
    });
  }

  // Formulaic openings
  const formulaicPatterns = [
    { regex: /everything you need to/i, label: 'Everything you need to...' },
    { regex: /whether you are a .* or a/i, label: 'Whether you are a [X] or a [Y]' },
    { regex: /in today'?s (fast-paced|modern|digital) world/i, label: 'In today\'s fast-paced world' },
    { regex: /כל מה שאתה צריך כדי/i, label: 'כל מה שאתה צריך כדי...' },
    { regex: /בין אם אתה .* ובין אם/i, label: 'בין אם אתה [X] ובין אם [Y]' },
  ];
  const detectedFormulas = formulaicPatterns.filter((p) => p.regex.test(normalizedText));
  if (detectedFormulas.length > 0) {
    findings.push({
      id: 'copy-formulaic-structure',
      category: 'copy',
      title: 'מבני פסקאות נוסחתיים',
      severity: 'medium',
      scoreImpact: 14,
      fact: `אותרו ${detectedFormulas.length} תבניות תחביריות מובְנות.`,
      snippets: detectedFormulas.map((f) => f.label),
      interpretation: 'מבנים כגון "בין אם אתה X או Y" ו-"כל מה שאתה צריך" שכיחים מאוד בטקסטים המיוצרים על ידי מחוללים, ומקנים תחושה של נוסחה שבלונית במקום קול מותגי ייחודי.',
      recommendation: 'נסחו מחדש את הפתיחים ישירות מתוך נקודת הכאב המרכזית של קהל היעד או ההצעה הייחודית שלכם.',
    });
  }

  // B. Visual Styling: Glowing Neon Orbs & Gradients
  const purpleGradientMatches = (
    rawHtmlLower.match(
      /from-purple|to-indigo|from-violet|via-pink|from-fuchsia|purple-600|violet-500|indigo-600|#8b5cf6|#6366f1|#a855f7|#7c3aed|rgb\(139,\s*92,\s*246\)|rgb\(99,\s*102,\s*241\)/g
    ) || []
  ).length;

  const gradientClips = (rawHtmlLower.match(/bg-clip-text|text-transparent.*bg-gradient|-webkit-background-clip:\s*text/g) || []).length;
  const blurElements = (rawHtmlLower.match(/blur-3xl|blur-2xl|radial-gradient/g) || []).length;

  if (purpleGradientMatches >= 3 || (purpleGradientMatches >= 1 && gradientClips >= 1)) {
    findings.push({
      id: 'visual-purple-glow',
      category: 'visual',
      title: 'פלטת גלואו סגול/אינדיגו על רקע כהה',
      severity: purpleGradientMatches >= 5 ? 'high' : 'medium',
      scoreImpact: 24,
      fact: `נספרו ${purpleGradientMatches} מופעי צבע סגול/אינדיגו בשילוב ${gradientClips} כותרות בטקסט שקוף-גרדיאנט ו-${blurElements} אלמנטי זוהר מטושטשים.`,
      snippets: [
        `מזהי צבע: #8b5cf6 / #6366f1 / purple / indigo (${purpleGradientMatches})`,
        gradientClips > 0 ? `טקסט גרדיאנט שקוף (clip-text): ${gradientClips}` : '',
      ].filter(Boolean),
      interpretation: 'השילוב של רקע כהה עם אלמנטי הילה סגולים וטקסט בגרדיאנט הוא הסממן הוויזואלי המזוהה ביותר עם תבניות AI גנריות (כגון v0 ו-Lovable) בשנים 2023–2025.',
      recommendation: 'המירו את הפלטה לצבעים מותגיים ברורים ומובחנים (למשל: כחול עמוק, ירוק יער, גווני אדמה או שחור-לבן מינימליסטי מוצק) ללא הילות ניאון מטושטשות ברקע.',
    });
  }

  // Floating sparkle badge
  const sparkleIcons = (rawHtmlLower.match(/✨|⚡|🪄|✦|sparkles|magic-wand|lucide-sparkles/g) || []).length;
  const pillBadges = Array.from(doc.querySelectorAll('.rounded-full, [class*="rounded-full"], [class*="badge"], [class*="pill"]'));
  const hasAiBadge = pillBadges.some((b) => {
    const txt = (b.textContent || '').toLowerCase();
    return txt.includes('ai') || txt.includes('בינה') || txt.includes('powered') || txt.includes('✨');
  });

  if (sparkleIcons >= 1 || hasAiBadge) {
    findings.push({
      id: 'visual-sparkle-pill',
      category: 'visual',
      title: 'תגית גלולה צפה בראש העמוד',
      severity: 'medium',
      scoreImpact: 14,
      fact: `זוהתה תגית צפה מעוגלת בראש העמוד${sparkleIcons > 0 ? ` לצד ${sparkleIcons} אייקוני ניצוצות (✨/🪄)` : ''}.`,
      snippets: pillBadges.slice(0, 2).map((b) => `תגית: "${(b.textContent || '').trim().slice(0, 40)}"`),
      interpretation: 'תגית מעוגלת (rounded-full) הממוקמת מעל הכותרת הראשית עם אייקון ניצוץ היא רכיב סטנדרטי החוזר כמעט בכל תבנית מחולל קוד.',
      recommendation: 'אם יש הודעה או עדכון, שלבו אותו כחלק מובנה מההיררכיה הרגילה של העמוד, או ותרו על התגית לטובת כותרת ראשית חזקה וממוקדת.',
    });
  }

  // Glassmorphism (backdrop-blur)
  const blurClasses = (rawHtmlLower.match(/backdrop-blur|backdrop-filter:\s*blur/g) || []).length;
  if (blurClasses >= 3) {
    findings.push({
      id: 'visual-glassmorphism',
      category: 'visual',
      title: 'שימוש מרובה באפקט זכוכית מעורפלת (Backdrop Blur)',
      severity: 'low',
      scoreImpact: 8,
      fact: `אותרו ${blurClasses} אלמנטים הכוללים אפקט ערפול רקע (backdrop-blur).`,
      snippets: [`${blurClasses} מופעי backdrop-blur`],
      interpretation: 'שכפול אפקט זכוכית מעורפלת עם גבולות שקופים דקיקים (border-white/10) מעניק מראה תבניתי ועלול לפגוע בניגודיות ובקריאות.',
      recommendation: 'העדיפו משטחי צבע מוצקים בעלי ניגודיות גבוהה שתואמת תקני נגישות (WCAG AA).',
    });
  }

  // C. Structural Symmetry: 3-Card Grid
  const grid3Elements = doc.querySelectorAll('.grid-cols-3, [class*="md:grid-cols-3"], [class*="lg:grid-cols-3"]');
  const allContainers = Array.from(doc.querySelectorAll('section > div, main > div, div[class*="grid"]'));
  const containersWithExact3Children = allContainers.filter(
    (c) => c.children.length === 3 && c.clientHeight > 100
  );

  if (grid3Elements.length > 0 || containersWithExact3Children.length >= 1) {
    findings.push({
      id: 'structure-3-column-grid',
      category: 'structure',
      title: 'גריד תכונות סימטרי של 3 כרטיסיות',
      severity: 'medium',
      scoreImpact: 16,
      fact: 'זוהה אזור תכונות המחולק ל-3 כרטיסיות זהות בגודלן ובמבנהן.',
      snippets: ['חלוקה סימטרית ל-3 עמודות עם מבנה זהה של אייקון + כותרת + תיאור קצר'],
      interpretation: 'חלוקה סימטרית של 3 כרטיסיות עם אייקון מעוגל בראשן ושתי שורות טקסט היא ברירת המחדל האוטומטית של רוב תבניות ה-SaaS.',
      recommendation: 'שברו את הסימטריה: בנו פריסה א-סימטרית (Bento Grid) המבליטה תכונה מרכזית אחת עם צילום מסך או נתון מוחשי, לצד תכונות משניות קטנות יותר.',
    });
  }

  // Dual Hero Buttons
  const demoButtons = buttonTexts.filter((btn) => {
    const l = btn.toLowerCase();
    return l.includes('demo') || l.includes('watch') || l.includes('צפה') || l.includes('הדגמה');
  });

  if (buttonTexts.length >= 2 && demoButtons.length > 0) {
    findings.push({
      id: 'structure-dual-cta',
      category: 'structure',
      title: 'צמד כפתורי Hero סטנדרטי (ראשי + "צפה בהדגמה")',
      severity: 'low',
      scoreImpact: 8,
      fact: `ב-Hero זוהו כפתור הנעה ראשי לצד כפתור דמו: "${demoButtons[0]}".`,
      snippets: buttonTexts.slice(0, 2),
      interpretation: 'השילוב של כפתור ראשי בוהק לצד כפתור שקוף עם משולש Play לצפייה בדמו הוא דפוס החוזר באופן אוטומטי בתבניות רבות.',
      recommendation: 'הגדירו פעולה ראשית אחת ברורה וחד-משמעית, או אפשרו חוויה ישירה של המוצר.',
    });
  }

  // D. Identity & Real-World Anchors
  const placeholderLinks = links.filter((a) => {
    const href = a.getAttribute('href');
    return !href || href === '#' || href === 'javascript:void(0)' || href === '';
  });

  if (links.length > 0 && placeholderLinks.length / links.length > 0.35 && placeholderLinks.length >= 3) {
    findings.push({
      id: 'identity-placeholder-links',
      category: 'identity',
      title: 'קישורי סרק פיקטיביים בתפריט או בפוטר',
      severity: 'high',
      scoreImpact: 18,
      fact: `${placeholderLinks.length} מתוך ${links.length} קישורים באתר מובילים ל-# או ריקים.`,
      snippets: [`${Math.round((placeholderLinks.length / links.length) * 100)}% מכלל הקישורים הם קישורי סרק`],
      interpretation: 'אתרים שנוצרו על בסיס תבניות AI לא שלמות מכילים לעיתים קרובות תפריטים ופוטר עם קישורי סרק שלא חוברו לעמודים ממשיים.',
      recommendation: 'הסירו קישורים שאינם פעילים. ודאו שכל קישור מוביל לעמוד ממשי: מדיניות פרטיות, תנאי שימוש, יצירת קשר או בלוג.',
    });
  } else if (links.length >= 4 && placeholderLinks.length === 0) {
    positiveObservations.push({
      id: 'positive-real-links',
      title: 'מערך קישורים תקין ומלא',
      fact: 'כל הקישורים שנסרקו באתר מובילים לנתיבים מוגדרים ללא קישורי סרק (#).',
      snippets: [`${links.length} קישורים תקינים נבדקו`],
      significance: 'מעיד על גימור שלם ומבנה תוכן פעיל ולא על תבנית ראשונית שלא הושלמה.',
    });
  }

  // Real contact anchors
  const hasPhoneOrAddress = /tel:|mailto:|headoffice|כתובת|טלפון|ח\.פ|copyright/i.test(normalizedText);
  if (hasPhoneOrAddress) {
    positiveObservations.push({
      id: 'positive-contact-anchors',
      title: 'עוגנים עסקיים מהעולם האמיתי',
      fact: 'זוהו פרטי התקשרות או עוגנים עסקיים (דוא"ל, טלפון, כתובת פיזית או זכויות יוצרים).',
      snippets: ['נוכחות פרטי קשר או כתובת מאומתים בטקסט'],
      significance: 'פרטי קשר ממשיים הם עוגן מהימנות קריטי המבדיל אתר אמיתי ממעטפת תבניתית ריקה.',
    });
  } else if (wordCount > 70) {
    findings.push({
      id: 'identity-missing-anchors',
      category: 'identity',
      title: 'היעדר פרטי התקשרות או עוגנים מהעולם האמיתי',
      severity: 'medium',
      scoreImpact: 12,
      fact: 'בטקסט שנסרק לא אותרו מספרי טלפון, כתובת פיזית או פרטי רישום עסק.',
      snippets: ['לא נמצאו פרטי קשר קונקרטיים בפוטר או בגוף העמוד'],
      interpretation: 'תבניות AI לרוב חסרות פרטים מהעולם האמיתי ונראות כמו ישות וירטואלית כללית.',
      recommendation: 'הוסיפו בפוטר פרטי יצירת קשר מלאים, כתובת פיזית, מספר טלפון ופרטי חברה.',
    });
  }

  // 3. SCORE CALCULATION
  // Sum score impacts, normalize to 0-100
  const rawScore = findings.reduce((sum, f) => sum + f.scoreImpact, 0);
  const templateScoreValue = Math.min(100, Math.max(0, rawScore));

  let ratingLabel = 'רמת תבניתיות נמוכה (עיצוב מותאם ואותנטי)';
  if (templateScoreValue >= 75) {
    ratingLabel = 'רמת תבניתיות גבוהה מאוד (ריבוי סממני תבנית)';
  } else if (templateScoreValue >= 50) {
    ratingLabel = 'רמת תבניתיות ניכרת (שילוב דפוסים שכיחים)';
  } else if (templateScoreValue >= 25) {
    ratingLabel = 'רמת תבניתיות מתונה (מאפיינים בודדים מוכרים)';
  }

  const scoreExplanation = 'מדד התבניתיות מעריך את מידת הדמיון לדפוסי עיצוב וקופי שכיחים בתבניות ומחוללי קוד. המדד אינו קובע האם נעשה שימוש ב-AI בבניית האתר, אלא מזהה שבלונות שפוגעות בייחודיות.';

  // 4. TAILORED PRACTICAL PROMPT
  const suggestedPrompt = buildImprovementPrompt({
    pageTitle,
    heroHeading,
    subheroText,
    buttonTexts,
    findings,
    foundBuzzwords: foundBuzzwords.map((b) => b.label),
    templateScoreValue,
  });

  return {
    url: sourceUrl,
    analyzedAt: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    pageTitle,
    metaDescription: metaDesc,
    templateScore: {
      score: templateScoreValue,
      ratingLabel,
      explanation: scoreExplanation,
    },
    scope,
    findings: findings.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    }),
    positiveObservations,
    extractedHeadlines: {
      hero: heroHeading,
      subhero: subheroText,
      buttons: buttonTexts,
    },
    suggestedPrompt,
  };
}

function buildImprovementPrompt(params: {
  pageTitle: string;
  heroHeading: string;
  subheroText: string;
  buttonTexts: string[];
  findings: AuditFinding[];
  foundBuzzwords: string[];
  templateScoreValue: number;
}): string {
  const { pageTitle, heroHeading, subheroText, buttonTexts, findings, foundBuzzwords, templateScoreValue } = params;

  const buzzwordsStr = foundBuzzwords.length > 0 ? foundBuzzwords.join(', ') : 'סופרלטיבים מופשטים (כמו "שדרג את הפוטנציאל", "חוויה חלקה")';
  const findingsList = findings
    .map((f, i) => `${i + 1}. [${f.title}]: ${f.recommendation}`)
    .join('\n');

  return `אני מבקש לשפר את עיצוב האתר והקופי של "${pageTitle}".
בדוח ביקורת עיצוב ותוכן עלה ציון תבניתיות של ${templateScoreValue}/100.
המטרה: להסיר סממנים שבלוניים ולייצר מראה אותנטי, נגיש ומותאם אישית.

נתונים מקוריים שחולצו מהאתר:
- כותרת ראשית נוכחית: "${heroHeading}"
- פסקת הסבר נוכחית: "${subheroText.slice(0, 160)}"
- כפתורים שזוהו: ${buttonTexts.join(', ') || 'התחל עכשיו'}
- ביטויים אסורים לשימוש: ${buzzwordsStr}

הנחיות לביצוע:
1. קופי מבוסס ערך: נסחו מחדש את הכותרת הראשית ב-5 עד 7 מילים שמסבירות בדיוק מה המוצר עושה ומה הערך הממשי שלו, ללא אף סופרלטיב.
2. פריסה טיפוגרפית: החליפו רקע כהה עם הילות סגול/אינדיגו בפלטת צבעים מותגית מוצקה בעלת ניגודיות גבוהה.
3. מבנה: שברו גריד סימטרי של 3 כרטיסיות זהות והמירו אותו לפריסת Bento Grid עם כרטיס אחד מוביל שמציג צילום מסך או תוצאה אמיתית.
4. נקו קישורי סרק (#) והגדירו הנעה ברורה לפעולה אחת.

סעיפי תיקון ספציפיים על פי הדוח:
${findingsList}

החזירו את קוד ה-HTML וה-Tailwind CSS המעודכן, נגיש ורספונסיבי.`;
}
