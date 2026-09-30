export type Severity = 'critical' | 'warning' | 'info';

export type CategoryKey = 
  | 'copywriting'
  | 'visualStyling'
  | 'layoutArchetype'
  | 'stockAndAssets'
  | 'typographyIdentity';

export interface DetectedFlag {
  id: string;
  category: CategoryKey;
  title: string;
  severity: Severity;
  scoreContribution: number;
  whyItLooksLikeAi: string;
  recommendation: string;
  snippets?: string[];
}

export interface CategoryScore {
  name: string;
  score: number; // 0 - 100 (100 = full AI slop)
  weight: number;
  flagCount: number;
  description: string;
}

export interface AnalysisResult {
  url?: string;
  analyzedAt: string;
  pageTitle: string;
  metaDescription?: string;
  overallAiScore: number; // 0 - 100
  verdict: {
    label: string;
    sublabel: string;
    level: 'authentic' | 'moderate' | 'high' | 'extreme';
    color: string;
    bgGradient: string;
  };
  categories: Record<CategoryKey, CategoryScore>;
  flags: DetectedFlag[];
  statistics: {
    wordCount: number;
    buzzwordCount: number;
    gradientElementsCount: number;
    cardCount: number;
    placeholderLinksCount: number;
    badgeCount: number;
    imageCount: number;
  };
  aiRefactorPrompt: string;
}

export interface PresetSite {
  id: string;
  name: string;
  url: string;
  tagline: string;
  expectedScore: 'high' | 'medium' | 'low';
  html: string;
}
