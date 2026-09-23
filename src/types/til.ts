export type TILCategory = string;

export type TILReflectionKey = "learned" | "tried" | "blocked" | "insights";
export type StoreAnalysisVisualization = {
  type: "store-analysis";
  period: string;
  comparison: string;
  stores: { name: string; revenue: number; share: number; salesChange: number; visitsChange: number; purchasesBefore: number; purchasesAfter: number; conversionPointChange: number; basketChange: number; unitsBefore: number; unitsAfter: number; observation: string }[];
  kpis: { label: string; value: string }[];
  categories: { name: string; changes: number[]; coverDays: number[] }[];
  weeks: { label: string; revenue: number }[];
  promotion: { label: string; dates: string; sales: number[] }[];
  events: { date: string; store: string; text: string }[];
};
type TILMediaSize = { width: number; height: number; caption?: string; prompt?: string };
export type TILBlock =
  | { type: "paragraph"; text: string }
  | ({ type: "image"; src: string; alt: string } & TILMediaSize)
  | ({ type: "video"; src: string; title: string; poster?: string } & TILMediaSize)
  | ({ type: "youtube"; src: string; title: string } & TILMediaSize);

export type TILAction = {
  id: string;
  text: string;
  status: "planned" | "done";
};

export type TILResource = {
  id: string;
  type: "project" | "document" | "github" | "til";
  title: string;
  description?: string;
  href: string;
};

export type TILEntry = {
  id: string;
  slug: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  session?: string;
  category: TILCategory;
  title: string;
  summary: string;
  learned: string[];
  tried: string[];
  blocked: string[];
  insights: string[];
  blocks?: Partial<Record<TILReflectionKey, TILBlock[]>>;
  nextActions: TILAction[];
  skills: string[];
  resources: TILResource[];
  isDemo?: boolean;
  visualizations?: StoreAnalysisVisualization;
};

export type TILCategoryMeta = {
  id: TILCategory;
  label: string;
  tone: "lavender" | "green" | "blue" | "amber" | "rose";
};

export type AcademyJourney = {
  label: string;
  status: string;
  progress?: {
    current: number;
    total: number;
    unitLabel: string;
  };
};
