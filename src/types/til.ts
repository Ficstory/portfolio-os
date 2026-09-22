export type TILCategory = string;

export type TILReflectionKey = "learned" | "tried" | "blocked" | "insights";
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
