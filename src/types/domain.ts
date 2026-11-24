export type Locale = "pt" | "en" | "es";

export type UserRole =
  | "client"
  | "advisor"
  | "legal_reviewer"
  | "compliance_officer"
  | "admin";

export type CountryCode = "PT" | "ES";

export type PhaseCode =
  | "discovery"
  | "planning"
  | "documentation"
  | "search_selection"
  | "due_diligence"
  | "purchase"
  | "post_sale";

export type AgentType =
  | "orchestrator"
  | "real_estate"
  | "financial"
  | "legal"
  | "tax"
  | "relocation"
  | "concierge"
  | "compliance"
  | "due_diligence";

export interface ConsentState {
  termsAccepted: boolean;
  aiProcessingAccepted: boolean;
  marketingEmail: boolean;
  partnerAutoShare: boolean;
  updatedAt: string;
}

export interface BuyerProfile {
  targetCountries: CountryCode[];
  targetCities: string[];
  purpose: "residence" | "investment" | "vacation" | "hybrid";
  budgetMaxEur: number;
  equityAvailableEur: number;
  needsMortgage: boolean;
  horizonMonths: number;
  taxResidence: "BR" | "PT" | "ES" | "OTHER";
}

export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  mfaEnrolled: boolean;
  mfaVerified: boolean;
  authMode: "firebase" | "sandbox";
  consents: ConsentState;
  buyerProfile: BuyerProfile;
}

export interface PropertyTranslation {
  title: string;
  subtitle: string;
  description: string;
  ddSummary: string;
}

export interface DueDiligenceCheckItem {
  label: Record<Locale, string>;
  status: "pass" | "warning" | "pending";
}

export interface CuratedProperty {
  id: string;
  canonicalRef: string;
  country: CountryCode;
  regionCode: "PT-CONT" | "ES-MD" | "ES-CT" | "ES-VC" | "ES-AN";
  city: string;
  neighborhood: string;
  propertyType: "apartment" | "house" | "penthouse";
  condition: "used" | "new_build";
  priceEur: number;
  areaSqm: number;
  bedrooms: number;
  bathrooms: number;
  energyRating: string;
  ddScore: number;
  estYieldPct: number;
  imageSrc?: string;
  mapPos: { x: number; y: number };
  partnerBroker: string;
  partnerLicense: string;
  commissionDisclosure: Record<Locale, string>;
  checks: DueDiligenceCheckItem[];
  translations: Record<Locale, PropertyTranslation>;
}

export interface ChecklistTask {
  id: string;
  phase: PhaseCode;
  country: CountryCode | "BOTH";
  title: Record<Locale, string>;
  owner: "client" | "advisor" | "legal_reviewer";
  status: "todo" | "in_progress" | "awaiting_review" | "done";
  dueDate: string;
}

export interface DocumentShare {
  id: string;
  partnerName: string;
  partnerRole: string;
  grantedAt: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface DocumentEventEntry {
  id: string;
  type: "UPLOAD" | "NEW_VERSION" | "VIEW" | "DOWNLOAD" | "SHARE_GRANTED" | "SHARE_REVOKED" | "APPROVED" | "REJECTED";
  actorName: string;
  actorRole: UserRole;
  timestamp: string;
  note?: string;
}

export interface VaultDocument {
  id: string;
  ownerUid: string;
  category: string;
  title: string;
  country: CountryCode | "BOTH";
  version: number;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  status: "pending" | "ai_screened" | "awaiting_review" | "approved" | "rejected";
  storagePath?: string;
  previewDataUrl?: string;
  uploadedAt: string;
  updatedAt: string;
  shares: DocumentShare[];
  events: DocumentEventEntry[];
}

export interface AuditLogEntry {
  seq: number;
  id: string;
  timestamp: string;
  actorUid: string;
  actorName: string;
  actorRole: UserRole | "system";
  action: string;
  resourceType: string;
  resourceId: string;
  summary: string;
  prevHash: string;
  entryHash: string;
}

export type CrmStage =
  | "new_lead"
  | "qualified_mql"
  | "diagnostic_scheduled"
  | "sql_active_plan"
  | "property_selection"
  | "under_dd"
  | "closed_won";

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  origin: string;
  countryTarget: CountryCode;
  cityTarget?: string;
  budgetEur: number;
  segment: string;
  stage: CrmStage;
  score: number;
  assignedAdvisor: string;
  createdAt: string;
  notes: string[];
}

export interface HitlEscalation {
  id: string;
  clientName: string;
  agentType: AgentType;
  userQuestion: string;
  reason: string;
  severity: "high" | "critical";
  status: "pending" | "resolved";
  resolutionNote?: string;
  createdAt: string;
}

export interface VerifiedPaymentInstruction {
  id: string;
  dealCode: string;
  beneficiaryName: string;
  beneficiaryRole: string;
  ibanMasked: string;
  bicSwift: string;
  amountEur: number;
  purpose: string;
  verifiedBy1: string;
  verifiedBy2: string;
  hmacDigest: string;
  updatedAt: string;
}

export interface ConciergeNotification {
  id: string;
  category: "deadline" | "security" | "dd" | "concierge";
  title: Record<Locale, string>;
  body: Record<Locale, string>;
  createdAt: string;
  read: boolean;
}

export interface AiCitation {
  sourceId: string;
  title: string;
  jurisdiction: "PT" | "ES" | "GLOBAL";
  effectiveDate: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent" | "system";
  agentType?: AgentType;
  text: string;
  citations?: AiCitation[];
  disclaimer?: string;
  hitlTriggered?: boolean;
  antiBecAlert?: boolean;
  mode?: "gemini_live" | "rag_sandbox";
  timestamp: string;
}
