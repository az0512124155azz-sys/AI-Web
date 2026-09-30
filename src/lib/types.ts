export type Severity = 'high' | 'medium' | 'low';

export type CategoryKey = 
  | 'copy'
  | 'visual'
  | 'structure'
  | 'identity';

export interface AuditFinding {
  id: string;
  category: CategoryKey;
  title: string;
  severity: Severity;
  scoreImpact: number;
  fact: string; // עובדה ממשית שנמדדה ב-DOM
  snippets: string[]; // ראיות מדויקות: טקסטים, מחלקות או סלקטורים
  interpretation: string; // פרשנות עיצובית: למה הדפוס נתפס כתבניתי
  recommendation: string; // המלצה מעשית לתיקון
}

export interface PositiveObservation {
  id: string;
  title: string;
  fact: string;
  snippets: string[];
  significance: string;
}

export interface EvaluationScope {
  wordCount: number;
  headingsCount: number;
  paragraphsCount: number;
  linksCount: number;
  imagesCount: number;
  buttonsCount: number;
  isPartialContent: boolean;
  partialContentReason?: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  confidenceReason: string;
}

export interface AuditReport {
  url?: string;
  analyzedAt: string;
  pageTitle: string;
  metaDescription?: string;
  templateScore: {
    score: number; // 0 (ייחודי/מותאם) עד 100 (תבניתי ביותר)
    ratingLabel: string;
    explanation: string;
  };
  scope: EvaluationScope;
  findings: AuditFinding[];
  positiveObservations: PositiveObservation[];
  extractedHeadlines: {
    hero: string;
    subhero: string;
    buttons: string[];
  };
  suggestedPrompt: string;
}

export interface PresetSite {
  id: string;
  name: string;
  url: string;
  description: string;
  tag: string;
  html: string;
}
