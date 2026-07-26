export type CounselMode = "legal" | "tax";

export type LegalCounselSource = {
  kind: "법령" | "판례" | "해석례" | "국세해석" | "포털";
  title: string;
  ref: string;
  summary?: string;
  link?: string;
};

export type LegalCounselHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type LegalCounselSearchBundle = {
  laws: LegalCounselSource[];
  precedents: LegalCounselSource[];
  interpretations: LegalCounselSource[];
  contextText: string;
  warnings: string[];
};
