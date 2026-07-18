export const CONTACT_METHODS = ["visit", "phone", "email", "web"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

export const PIPELINE_STAGES = [
  "new",
  "touring",
  "contracting",
  "closed",
  "dormant",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const PURPOSES = ["invest", "reside"] as const;
export type CustomerPurpose = (typeof PURPOSES)[number];

export const MOVE_URGENCIES = ["high", "mid", "low"] as const;
export type MoveUrgency = (typeof MOVE_URGENCIES)[number];

export const INTERACTION_CHANNELS = [
  "visit",
  "phone",
  "email",
  "web",
  "tour",
  "other",
] as const;
export type InteractionChannel = (typeof INTERACTION_CHANNELS)[number];

export type CustomerInteractionDTO = {
  id: string;
  customerId: string;
  occurredAt: string;
  channel: InteractionChannel | string;
  title: string;
  body: string;
  createdAt: string;
};

export type CustomerCardDTO = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  currentAddress: string | null;
  profileImage: string | null;
  primaryContactMethod: ContactMethod | string;
  hasTraded: boolean;
  isSubscribed: boolean;
  pipelineStage: PipelineStage | string;
  budgetRange: string | null;
  needsLoan: boolean;
  purpose: CustomerPurpose | string;
  moveUrgency: MoveUrgency | string;
  moveDate: string | null;
  familyMembers: string | null;
  preferredBrand: string | null;
  decisionMaker: string | null;
  inquiryDetails: string;
  requestNotes: string;
  specialNotes: string;
  createdAt: string;
  updatedAt: string;
  interactions?: CustomerInteractionDTO[];
};

export type CustomerRelatedConsultation = {
  id: string;
  clientName: string;
  category: string;
  status: string;
  createdAt: string;
};

export type CustomerRelatedSubscriber = {
  id: string;
  name: string | null;
  subscriptionType: string;
  status: string;
  createdAt: string;
};

export type CustomerWriteInput = {
  name: string;
  phone?: string;
  email?: string | null;
  currentAddress?: string | null;
  profileImage?: string | null;
  primaryContactMethod?: string;
  hasTraded?: boolean;
  isSubscribed?: boolean;
  pipelineStage?: string;
  budgetRange?: string | null;
  needsLoan?: boolean;
  purpose?: string;
  moveUrgency?: string;
  moveDate?: string | null;
  familyMembers?: string | null;
  preferredBrand?: string | null;
  decisionMaker?: string | null;
  inquiryDetails?: string;
  requestNotes?: string;
  specialNotes?: string;
};

export type SeedCustomerSpec = CustomerWriteInput & {
  interactions?: { channel: string; title: string; body: string; daysAgo: number }[];
};

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function phonesMatch(a: string | null | undefined, b: string | null | undefined) {
  const na = normalizePhone(a ?? "");
  const nb = normalizePhone(b ?? "");
  return Boolean(na && nb && na === nb);
}

export const CONTACT_METHOD_LABELS: Record<string, string> = {
  visit: "방문상담",
  phone: "전화상담",
  email: "메일상담",
  web: "웹사이트 문의",
};

/** primary_contact_method 에 복수 경로를 쉼표로 저장 (예: visit,phone) */
export function parseContactMethods(value: string | null | undefined): string[] {
  if (!value?.trim()) return ["phone"];
  const parts = value
    .split(/[,|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => (CONTACT_METHODS as readonly string[]).includes(s));
  return parts.length ? parts : ["phone"];
}

export function formatContactMethods(methods: string[]): string {
  const uniq = [...new Set(methods.filter((m) => (CONTACT_METHODS as readonly string[]).includes(m)))];
  return (uniq.length ? uniq : ["phone"]).join(",");
}

export function primaryContactOf(value: string | null | undefined): string {
  return parseContactMethods(value)[0] ?? "phone";
}

export const PIPELINE_LABELS: Record<string, string> = {
  new: "신규 접수",
  touring: "매물 투어",
  contracting: "계약 조율",
  closed: "계약 완료",
  dormant: "휴면",
};

export const PURPOSE_LABELS: Record<string, string> = {
  invest: "투자",
  reside: "실거주",
};

export const URGENCY_LABELS: Record<string, string> = {
  high: "상",
  mid: "중",
  low: "하",
};

export const CHANNEL_LABELS: Record<string, string> = {
  visit: "방문상담",
  phone: "전화상담",
  email: "메일상담",
  web: "웹 문의",
  tour: "현장 투어",
  other: "기타",
};
