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
export type JournalFigure = {
  heading: string;
  title: string;
  kind: "composition" | "bars";
  percentages?: boolean;
  unit: string;
  note: string;
  rows: { label: string; value: number; highlight?: boolean }[];
};

type TILMediaSize = { width: number; height: number; caption?: string; prompt?: string };
export type TILBlock =
  | { type: "paragraph"; text: string }
  | ({ type: "image"; src: string; alt: string; presentation?: "triptych" } & TILMediaSize)
  | ({ type: "video"; src: string; title: string; poster?: string } & TILMediaSize)
  | ({ type: "youtube"; src: string; title: string } & TILMediaSize);

export type TILJournalSection = {
  heading?: string;
  blocks: TILBlock[];
};

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
  format?: "reflection" | "journal";
  journal?: TILJournalSection[];
  learned: string[];
  tried: string[];
  blocked: string[];
  insights: string[];
  blocks?: Partial<Record<TILReflectionKey, TILBlock[]>>;
  nextActions: TILAction[];
  skills: string[];
  resources: TILResource[];
  isDemo?: boolean;
  visualizations?: StoreAnalysisVisualization | { type: "journal-figures"; figures: JournalFigure[] };
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
