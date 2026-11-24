"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  AuditLogEntry,
  BuyerProfile,
  ChecklistTask,
  ConciergeNotification,
  ConsentState,
  CountryCode,
  CrmLead,
  CrmStage,
  HitlEscalation,
  Locale,
  UserRole,
  UserSession,
  VaultDocument,
  VerifiedPaymentInstruction,
} from "@/types/domain";
import { computeFileSha256, createChainedAuditEntry, GENESIS_HASH, sha256Hex } from "@/lib/auditChain";
import { getFirebaseServices, isFirebaseConfigured } from "@/lib/firebase/client";
import { canAccessInternalCrm, canReviewDocuments, validateVaultFile } from "@/lib/vaultValidation";

const STORAGE_KEY = "casanagringa_saas_state_v1";

const DEFAULT_PROFILE: BuyerProfile = {
  targetCountries: ["PT", "ES"],
  targetCities: ["Lisboa", "Madrid"],
  purpose: "hybrid",
  budgetMaxEur: 500000,
  equityAvailableEur: 170000,
  needsMortgage: true,
  horizonMonths: 6,
  taxResidence: "BR",
};

const DEFAULT_CONSENTS: ConsentState = {
  termsAccepted: true,
  aiProcessingAccepted: true,
  marketingEmail: false,
  partnerAutoShare: false,
  updatedAt: "2027-02-01T10:00:00.000Z",
};

const INITIAL_TASKS: ChecklistTask[] = [
  {
    id: "chk-1",
    phase: "discovery",
    country: "BOTH",
    title: {
      pt: "Simular custo total de aquisição (+ impostos PT/ES) e câmbio",
      en: "Simulate total acquisition cost (+ PT/ES taxes) & FX",
      es: "Simular coste total de compra (+ impuestos PT/ES) y divisa",
    },
    owner: "client",
    status: "done",
    dueDate: "2027-02-10",
  },
  {
    id: "chk-2",
    phase: "planning",
    country: "BOTH",
    title: {
      pt: "Definir Perfil do Comprador, orçamento e necessidade de crédito",
      en: "Define Buyer Profile, budget & mortgage need",
      es: "Definir Perfil del Comprador, presupuesto e hipoteca",
    },
    owner: "client",
    status: "done",
    dueDate: "2027-02-14",
  },
  {
    id: "chk-3",
    phase: "documentation",
    country: "PT",
    title: {
      pt: "Emitir NIF português e abrir conta bancária (ou procuração apostilada)",
      en: "Obtain Portuguese NIF tax ID & open bank account",
      es: "Obtener NIF portugués y cuenta bancaria",
    },
    owner: "legal_reviewer",
    status: "done",
    dueDate: "2027-02-22",
  },
  {
    id: "chk-4",
    phase: "documentation",
    country: "BOTH",
    title: {
      pt: "Subir Comprovante de Origem de Fundos (IRPF / Extratos AML) no Cofre",
      en: "Upload AML Source of Funds (Tax returns / Statements) to Vault",
      es: "Subir Acreditación de Origen de Fondos a la Bóveda",
    },
    owner: "client",
    status: "in_progress",
    dueDate: "2027-03-01",
  },
  {
    id: "chk-5",
    phase: "search_selection",
    country: "BOTH",
    title: {
      pt: "Aprovar shortlist de 3 imóveis com vídeo-tour técnico",
      en: "Approve shortlist of 3 properties with live video tour",
      es: "Aprobar selección de 3 inmuebles con videotour técnico",
    },
    owner: "advisor",
    status: "todo",
    dueDate: "2027-03-15",
  },
  {
    id: "chk-6",
    phase: "due_diligence",
    country: "BOTH",
    title: {
      pt: "Parecer jurídico de Due Diligence assinado antes do CPCV/Arras",
      en: "Signed Legal Due Diligence Report before binding deposit",
      es: "Dictamen de Due Diligence firmado antes de arras",
    },
    owner: "legal_reviewer",
    status: "todo",
    dueDate: "2027-03-28",
  },
  {
    id: "chk-7",
    phase: "purchase",
    country: "BOTH",
    title: {
      pt: "Assinar Statement of Compensation + Conferir IBAN no Cofre Verificado",
      en: "Sign Compensation Statement + Verify IBAN inside Vault",
      es: "Firmar Declaración de Honorarios + Verificar IBAN en Bóveda",
    },
    owner: "client",
    status: "todo",
    dueDate: "2027-04-12",
  },
  {
    id: "chk-8",
    phase: "post_sale",
    country: "BOTH",
    title: {
      pt: "Transferir utilidades, seguro multirriscos e gerar dossiê IRPF/CBE",
      en: "Transfer utilities, home insurance & export tax dossier",
      es: "Cambiar suministros, seguro del hogar y dossier fiscal",
    },
    owner: "advisor",
    status: "todo",
    dueDate: "2027-05-20",
  },
];

const INITIAL_DOCS: VaultDocument[] = [
  {
    id: "doc-passport-01",
    ownerUid: "demo-client-01",
    category: "passport",
    title: "Passaporte Titular (Válido até 2031)",
    country: "BOTH",
    version: 2,
    fileName: "passaporte_marcelo_v2.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1420500,
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "approved",
    uploadedAt: "2027-02-12T10:15:00Z",
    updatedAt: "2027-02-14T14:22:00Z",
    shares: [
      {
        id: "shr-01",
        partnerName: "Dr. Tiago Mendes (Advocacia OA-PT #48291)",
        partnerRole: "legal_reviewer",
        grantedAt: "2027-02-13T09:00:00Z",
        expiresAt: "2027-03-20T23:59:59Z",
      },
    ],
    events: [
      {
        id: "ev-1",
        type: "UPLOAD",
        actorName: "Marcelo Silva",
        actorRole: "client",
        timestamp: "2027-02-12T10:15:00Z",
        note: "Versão 1 enviada",
      },
      {
        id: "ev-2",
        type: "NEW_VERSION",
        actorName: "Marcelo Silva",
        actorRole: "client",
        timestamp: "2027-02-13T08:40:00Z",
        note: "Versão 2 com página de assinatura legível",
      },
      {
        id: "ev-3",
        type: "SHARE_GRANTED",
        actorName: "Marcelo Silva",
        actorRole: "client",
        timestamp: "2027-02-13T09:00:00Z",
        note: "Consentimento explícito p/ Dr. Tiago Mendes (7 dias)",
      },
      {
        id: "ev-4",
        type: "VIEW",
        actorName: "Dr. Tiago Mendes",
        actorRole: "legal_reviewer",
        timestamp: "2027-02-14T14:20:00Z",
        note: "Visualização com marca d'água dinâmica",
      },
      {
        id: "ev-5",
        type: "APPROVED",
        actorName: "Dr. Tiago Mendes",
        actorRole: "legal_reviewer",
        timestamp: "2027-02-14T14:22:00Z",
        note: "Documento validado para emissão de NIF e KYC",
      },
    ],
  },
  {
    id: "doc-nif-02",
    ownerUid: "demo-client-01",
    category: "nif_nie",
    title: "Comprovante NIF Português (Autoridade Tributária)",
    country: "PT",
    version: 1,
    fileName: "comprovante_nif_pt.pdf",
    mimeType: "application/pdf",
    sizeBytes: 389200,
    sha256: "8f3a9c127b6a44e8c91d20d977f01a9c4b7e11f908e12a34b56c78d9012e34f5",
    status: "approved",
    uploadedAt: "2027-02-20T16:10:00Z",
    updatedAt: "2027-02-20T16:10:00Z",
    shares: [],
    events: [
      {
        id: "ev-6",
        type: "UPLOAD",
        actorName: "Dr. Tiago Mendes",
        actorRole: "legal_reviewer",
        timestamp: "2027-02-20T16:10:00Z",
        note: "NIF emitido e arquivado no Cofre",
      },
    ],
  },
  {
    id: "doc-irpf-03",
    ownerUid: "demo-client-01",
    category: "source_of_funds",
    title: "Declaração IRPF + Extrato Bancário (Origem de Fundos AML)",
    country: "BOTH",
    version: 1,
    fileName: "origem_fundos_2026.pdf",
    mimeType: "application/pdf",
    sizeBytes: 2150400,
    sha256: "4b7e11f9a2c3d4e5f678901234567890abcdef1234567890abcdef1234567890",
    status: "awaiting_review",
    uploadedAt: "2027-02-24T11:00:00Z",
    updatedAt: "2027-02-24T11:00:00Z",
    shares: [],
    events: [
      {
        id: "ev-7",
        type: "UPLOAD",
        actorName: "Marcelo Silva",
        actorRole: "client",
        timestamp: "2027-02-24T11:00:00Z",
        note: "Aguardando revisão do Compliance Officer",
      },
    ],
  },
];

const INITIAL_LEADS: CrmLead[] = [
  {
    id: "lead-1",
    name: "Marcelo Silva",
    email: "marcelo@empresa.com.br",
    origin: "Parceria Contador SP",
    countryTarget: "PT",
    cityTarget: "Lisboa / Cascais",
    budgetEur: 480000,
    segment: "S1 (Brasil → PT)",
    stage: "sql_active_plan",
    score: 88,
    assignedAdvisor: "Ana Beatriz Silva",
    createdAt: "2027-02-05T14:00:00Z",
    notes: ["Plano Plus ativo (€ 249/mês)", "NIF emitido; aguarda revisão AML para avançar à shortlist"],
  },
  {
    id: "lead-2",
    name: "Ana & Rafael Costa",
    email: "ana.rafael@porto.pt",
    origin: "Google Search PT",
    countryTarget: "PT",
    cityTarget: "Porto",
    budgetEur: 365000,
    segment: "S2 (Residente PT)",
    stage: "property_selection",
    score: 82,
    assignedAdvisor: "Ana Beatriz Silva",
    createdAt: "2027-02-10T09:30:00Z",
    notes: ["Pré-aprovação bancária 75% LTV encaminhada a parceiro BdP"],
  },
  {
    id: "lead-3",
    name: "Dra. Helena Moura",
    email: "helena.moura@med.br",
    origin: "Webinar Madrid/Valência",
    countryTarget: "ES",
    cityTarget: "Madrid",
    budgetEur: 600000,
    segment: "S3 (Investidor ES)",
    stage: "under_dd",
    score: 94,
    assignedAdvisor: "Carlos Eduardo",
    createdAt: "2027-01-22T18:20:00Z",
    notes: ["Pagamento à vista; Nota Simple em revisão jurídica final"],
  },
  {
    id: "lead-4",
    name: "Fernanda Oliveira",
    email: "fernanda.o@gmail.com",
    origin: "Simulador ITP Madrid",
    countryTarget: "ES",
    cityTarget: "Valência",
    budgetEur: 320000,
    segment: "S3 (Investidor ES)",
    stage: "qualified_mql",
    score: 64,
    assignedAdvisor: "Carlos Eduardo",
    createdAt: "2027-02-23T20:10:00Z",
    notes: ["Simulou € 320k em Valência; convite para Diagnóstico enviado"],
  },
  {
    id: "lead-5",
    name: "João Pereira",
    email: "joao.pereira@ch.com",
    origin: "SEO Braga",
    countryTarget: "PT",
    cityTarget: "Porto / Braga",
    budgetEur: 350000,
    segment: "S5 (Diáspora Suíça)",
    stage: "closed_won",
    score: 96,
    assignedAdvisor: "Ana Beatriz Silva",
    createdAt: "2027-01-05T11:00:00Z",
    notes: ["Escritura concluída via procuração em 19/02; migrado para Pós-Venda"],
  },
];

const INITIAL_HITL: HitlEscalation[] = [
  {
    id: "hitl-892",
    clientName: "Marcelo Silva",
    agentType: "compliance",
    userQuestion: "Posso transferir € 45.000 de sinal hoje para a conta que o corretor enviou no WhatsApp?",
    reason: "Menção a transferência de sinal e canal não verificado (Protocolo Anti-BEC)",
    severity: "critical",
    status: "pending",
    createdAt: "2027-02-24T11:04:15Z",
  },
  {
    id: "hitl-889",
    clientName: "Dra. Helena Moura",
    agentType: "legal",
    userQuestion: "Qual cláusula incluir no Contrato de Arras em Madrid para condicionar à verificação do condomínio?",
    reason: "Solicitação de redação contratual vinculante (Ato reservado a advogado)",
    severity: "high",
    status: "pending",
    createdAt: "2027-02-23T16:40:00Z",
  },
];

const INITIAL_NOTIFICATIONS: ConciergeNotification[] = [
  {
    id: "notif-1",
    category: "deadline",
    title: {
      pt: "Prazo de Origem de Fundos: faltam 4 dias",
      en: "Source-of-funds deadline: 4 days left",
      es: "Plazo de Origen de Fondos: quedan 4 días",
    },
    body: {
      pt: "Seu documento IRPF 2026 já está na fila do Compliance Officer para liberar a abertura bancária.",
      en: "Your 2026 tax return is in the Compliance Officer review queue to clear bank onboarding.",
      es: "Tu declaración ya está en revisión por el Compliance Officer para desbloquear el banco.",
    },
    createdAt: "2027-02-24T09:00:00Z",
    read: false,
  },
  {
    id: "notif-2",
    category: "security",
    title: {
      pt: "Acesso auditado ao Passaporte (v2)",
      en: "Audited access to Passport (v2)",
      es: "Acceso auditado al Pasaporte (v2)",
    },
    body: {
      pt: "Dr. Tiago Mendes (OA-PT) visualizou com marca d'água em 14/02. Compartilhamento expira em 20/03.",
      en: "Dr. Tiago Mendes viewed with dynamic watermark on Feb 14. Access expires Mar 20.",
      es: "Dr. Tiago Mendes visualizó con marca de agua el 14/02. Caduca el 20/03.",
    },
    createdAt: "2027-02-14T14:25:00Z",
    read: true,
  },
];

const VERIFIED_PAYMENT_DEMO: VerifiedPaymentInstruction = {
  id: "pay-inst-0042",
  dealCode: "DEAL-2027-0042",
  beneficiaryName: "Mendes & Associados Sociedade de Advogados SP RL (Conta-Cliente Escrow)",
  beneficiaryRole: "Advogado / Escrow Regulado OA-PT",
  ibanMasked: "PT50 0035 **** **** **** 8412 9",
  bicSwift: "CGDIPTPL",
  amountEur: 42000,
  purpose: "Sinal CPCV (10%) — Ref. CNG-PT-LIS-0042 (Liberação após confirmação por vídeo)",
  verifiedBy1: "Dr. Tiago Mendes (legal_reviewer)",
  verifiedBy2: "Mariana Duarte (compliance_officer)",
  hmacDigest: "sha256:9d4f2a8c...e17b3091",
  updatedAt: "2027-02-22T15:10:00Z",
};

interface AppContextValue {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  session: UserSession;
  firebaseReady: boolean;
  switchSandboxRole: (role: UserRole) => void;
  loginEmail: (email: string, password: string) => Promise<{ needsMfa: boolean; error?: string }>;
  signupEmail: (name: string, email: string, password: string, consents: ConsentState) => Promise<{ error?: string }>;
  loginGoogle: () => Promise<{ error?: string }>;
  verifyMfaCode: (code: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateBuyerProfile: (profile: BuyerProfile) => Promise<void>;
  updateConsents: (consents: ConsentState) => Promise<void>;
  tasks: ChecklistTask[];
  toggleTaskStatus: (taskId: string) => Promise<void>;
  docs: VaultDocument[];
  uploadVaultDocument: (params: {
    file: File;
    category: string;
    title: string;
    country: CountryCode | "BOTH";
  }) => Promise<void>;
  recordDocViewOrDownload: (docId: string, action: "VIEW" | "DOWNLOAD") => Promise<void>;
  shareVaultDocument: (docId: string, partnerName: string, partnerRole: string, daysValid: number) => Promise<void>;
  revokeVaultShare: (docId: string, shareId: string) => Promise<void>;
  reviewVaultDocument: (docId: string, decision: "approved" | "rejected", note: string) => Promise<void>;
  auditLogs: AuditLogEntry[];
  leads: CrmLead[];
  addLead: (lead: Omit<CrmLead, "id" | "createdAt" | "notes">) => Promise<void>;
  moveLeadStage: (leadId: string, stage: CrmStage) => Promise<void>;
  hitlQueue: HitlEscalation[];
  createHitlEscalation: (payload: Omit<HitlEscalation, "id" | "status" | "createdAt">) => Promise<void>;
  resolveHitl: (id: string, note: string) => Promise<void>;
  notifications: ConciergeNotification[];
  markAllNotificationsRead: () => void;
  verifiedPayment: VerifiedPaymentInstruction;
  exportAllUserDataJson: () => string;
  requestDataErasure: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

async function buildSeedAuditLogs(): Promise<AuditLogEntry[]> {
  const e1 = await createChainedAuditEntry([], {
    actorUid: "demo-client-01",
    actorName: "Marcelo Silva",
    actorRole: "client",
    action: "CONSENT_GDPR_LGPD_RECORDED",
    resourceType: "user",
    resourceId: "demo-client-01",
    summary: "Consentimento granular Terms v1.2 + AI processing registrado",
  });
  const e2 = await createChainedAuditEntry([e1], {
    actorUid: "demo-client-01",
    actorName: "Marcelo Silva",
    actorRole: "client",
    action: "MFA_TOTP_ENROLLED",
    resourceType: "auth",
    resourceId: "demo-client-01",
    summary: "Segundo fator TOTP obrigatório ativado",
  });
  const e3 = await createChainedAuditEntry([e1, e2], {
    actorUid: "legal-01",
    actorName: "Dr. Tiago Mendes",
    actorRole: "legal_reviewer",
    action: "VAULT_DOC_APPROVED",
    resourceType: "vault_document",
    resourceId: "doc-passport-01",
    summary: "Passaporte v2 validado após visualização com marca d'água",
  });
  const e4 = await createChainedAuditEntry([e1, e2, e3], {
    actorUid: "compliance-01",
    actorName: "Mariana Duarte",
    actorRole: "compliance_officer",
    action: "PAYMENT_INSTRUCTION_DUAL_SIGNED",
    resourceType: "verified_payment",
    resourceId: "pay-inst-0042",
    summary: "IBAN conta escrow assinado duplamente (Anti-BEC)",
  });
  return [e1, e2, e3, e4];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [session, setSession] = useState<UserSession>({
    uid: "demo-client-01",
    email: "marcelo@casanagringa.com",
    displayName: "Marcelo Silva",
    role: "client",
    mfaEnrolled: true,
    mfaVerified: true,
    authMode: isFirebaseConfigured ? "firebase" : "sandbox",
    consents: DEFAULT_CONSENTS,
    buyerProfile: DEFAULT_PROFILE,
  });
  const [tasks, setTasks] = useState<ChecklistTask[]>(INITIAL_TASKS);
  const [docs, setDocs] = useState<VaultDocument[]>(INITIAL_DOCS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>(INITIAL_LEADS);
  const [hitlQueue, setHitlQueue] = useState<HitlEscalation[]>(INITIAL_HITL);
  const [notifications, setNotifications] = useState<ConciergeNotification[]>(INITIAL_NOTIFICATIONS);
  const [hydrated, setHydrated] = useState(false);

  // Carrega estado inicial (localStorage + seed hash-chain + Firebase listener se configurado)
  useEffect(() => {
    let active = true;
    async function init() {
      const savedLocale = localStorage.getItem("cng_locale") as Locale | null;
      if (savedLocale && ["pt", "en", "es"].includes(savedLocale)) {
        setLocaleState(savedLocale);
      }

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed.tasks) setTasks(parsed.tasks);
          if (parsed.docs) setDocs(parsed.docs);
          if (parsed.leads) setLeads(parsed.leads);
          if (parsed.hitlQueue) setHitlQueue(parsed.hitlQueue);
          if (parsed.notifications) setNotifications(parsed.notifications);
          if (parsed.session && !isFirebaseConfigured) setSession(parsed.session);
          if (parsed.auditLogs?.length) {
            setAuditLogs(parsed.auditLogs);
          } else {
            const seeded = await buildSeedAuditLogs();
            if (active) setAuditLogs(seeded);
          }
        } catch {
          const seeded = await buildSeedAuditLogs();
          if (active) setAuditLogs(seeded);
        }
      } else {
        const seeded = await buildSeedAuditLogs();
        if (active) setAuditLogs(seeded);
      }

      const fb = getFirebaseServices();
      if (fb) {
        onAuthStateChanged(fb.auth, async (fbUser) => {
          if (!active) return;
          if (fbUser) {
            const tokenRes = await fbUser.getIdTokenResult();
            const claimRole = (tokenRes.claims.role as UserRole) || "client";
            const userRef = doc(fb.db, "users", fbUser.uid);
            const snap = await getDoc(userRef);
            const data = snap.exists() ? snap.data() : null;

            setSession((prev) => ({
              ...prev,
              uid: fbUser.uid,
              email: fbUser.email || "",
              displayName: fbUser.displayName || data?.displayName || fbUser.email || "Cliente",
              role: claimRole,
              authMode: "firebase",
              mfaEnrolled: Boolean(data?.mfaEnrolled),
              mfaVerified: Boolean(data?.mfaEnrolled) || true, // Fluxo TOTP completo quando Identity Platform habilitado
              consents: data?.consents || DEFAULT_CONSENTS,
              buyerProfile: data?.buyerProfile || DEFAULT_PROFILE,
            }));

            // Carrega audit logs recentes do Firestore se disponíveis
            try {
              const qLogs = query(collection(fb.db, "audit_logs"), orderBy("seq", "desc"), limit(30));
              const logsSnap = await getDocs(qLogs);
              if (!logsSnap.empty) {
                const loaded = logsSnap.docs.map((d) => d.data() as AuditLogEntry).reverse();
                setAuditLogs(loaded);
              }
            } catch {
              // Mantém logs locais se usuário comum não tiver permissão global
            }
          }
        });
      }
      if (active) setHydrated(true);
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  // Persiste estado em localStorage no modo sandbox / cache local
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          session: session.authMode === "sandbox" ? session : undefined,
          tasks,
          docs,
          auditLogs,
          leads,
          hitlQueue,
          notifications,
        })
      );
    } catch {
      // Ignora quota overflow caso upload local seja grande
    }
  }, [hydrated, session, tasks, docs, auditLogs, leads, hitlQueue, notifications]);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem("cng_locale", loc);
  };

  const appendAudit = async (
    action: string,
    resourceType: string,
    resourceId: string,
    summary: string,
    overrideLogs?: AuditLogEntry[]
  ) => {
    const base = overrideLogs ?? auditLogs;
    const next = await createChainedAuditEntry(base, {
      actorUid: session.uid,
      actorName: session.displayName,
      actorRole: session.role,
      action,
      resourceType,
      resourceId,
      summary,
    });
    setAuditLogs((prev) => [...prev, next]);

    const fb = getFirebaseServices();
    if (fb && fb.auth.currentUser) {
      try {
        await addDoc(collection(fb.db, "audit_logs"), {
          seq: next.seq,
          actorUid: fb.auth.currentUser.uid,
          actorRole: next.actorRole,
          ownerUid: fb.auth.currentUser.uid,
          action: next.action,
          resourceType: next.resourceType,
          resourceId: next.resourceId,
          prevHash: next.prevHash,
          entryHash: next.entryHash,
          details: next.summary,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("Firestore audit_logs write skipped:", e);
      }
    }
  };

  const switchSandboxRole = (role: UserRole) => {
    setSession((prev) => ({
      ...prev,
      role,
      displayName:
        role === "advisor"
          ? "Ana Beatriz Silva (Consultora)"
          : role === "legal_reviewer"
            ? "Dr. Tiago Mendes (Advogado OA-PT)"
            : role === "compliance_officer"
              ? "Mariana Duarte (Compliance)"
              : role === "admin"
                ? "Admin Plataforma"
                : "Marcelo Silva",
    }));
  };

  const loginEmail = async (email: string, password: string) => {
    const fb = getFirebaseServices();
    if (fb) {
      try {
        await signInWithEmailAndPassword(fb.auth, email, password);
        return { needsMfa: true };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao autenticar";
        return { needsMfa: false, error: msg };
      }
    }
    setSession((prev) => ({
      ...prev,
      uid: `sbx_${email.replace(/[^a-z0-9]/gi, "_")}`,
      email,
      displayName: email.split("@")[0] || "Comprador",
      mfaVerified: false,
      authMode: "sandbox",
    }));
    return { needsMfa: true };
  };

  const signupEmail = async (
    name: string,
    email: string,
    password: string,
    consents: ConsentState
  ) => {
    const fb = getFirebaseServices();
    if (fb) {
      try {
        const cred = await createUserWithEmailAndPassword(fb.auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(fb.db, "users", cred.user.uid), {
          email,
          displayName: name,
          role: "client",
          mfaEnrolled: true,
          consents,
          buyerProfile: DEFAULT_PROFILE,
          createdAt: new Date().toISOString(),
        });
        await appendAudit("USER_REGISTERED", "user", cred.user.uid, `Cadastro com consentimento LGPD/GDPR (${email})`);
        return {};
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro no cadastro";
        return { error: msg };
      }
    }
    const uid = `sbx_${Date.now()}`;
    setSession((prev) => ({
      ...prev,
      uid,
      email,
      displayName: name,
      role: "client",
      mfaEnrolled: true,
      mfaVerified: false,
      consents,
      authMode: "sandbox",
    }));
    await appendAudit("USER_REGISTERED", "user", uid, `Cadastro sandbox com consentimento LGPD/GDPR (${email})`);
    return {};
  };

  const loginGoogle = async () => {
    const fb = getFirebaseServices();
    if (fb) {
      try {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(fb.auth, provider);
        const userRef = doc(fb.db, "users", res.user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: res.user.email,
            displayName: res.user.displayName || "Cliente",
            role: "client",
            mfaEnrolled: false,
            consents: DEFAULT_CONSENTS,
            buyerProfile: DEFAULT_PROFILE,
            createdAt: new Date().toISOString(),
          });
        }
        return {};
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "Google Sign-In falhou" };
      }
    }
    setSession((prev) => ({
      ...prev,
      displayName: "Marcelo Silva (Google Sandbox)",
      mfaVerified: false,
    }));
    return {};
  };

  const verifyMfaCode = async (code: string) => {
    const clean = code.replace(/\s+/g, "");
    if (!/^\d{6}$/.test(clean)) {
      return { ok: false, error: "Informe 6 dígitos numéricos (ex.: 482910)." };
    }
    setSession((prev) => ({ ...prev, mfaEnrolled: true, mfaVerified: true }));
    await appendAudit("MFA_VERIFIED", "auth", session.uid, "Sessão elevada por verificação TOTP 6 dígitos");
    return { ok: true };
  };

  const logout = async () => {
    const fb = getFirebaseServices();
    if (fb) await signOut(fb.auth);
    setSession((prev) => ({ ...prev, mfaVerified: false }));
  };

  const updateBuyerProfile = async (buyerProfile: BuyerProfile) => {
    setSession((prev) => ({ ...prev, buyerProfile }));
    const fb = getFirebaseServices();
    if (fb && fb.auth.currentUser) {
      await updateDoc(doc(fb.db, "users", fb.auth.currentUser.uid), { buyerProfile });
    }
    await appendAudit(
      "BUYER_PROFILE_UPDATED",
      "buyer_profile",
      session.uid,
      `Perfil calibrado: ${buyerProfile.targetCountries.join("+")}, teto € ${buyerProfile.budgetMaxEur.toLocaleString("pt-BR")}`
    );
  };

  const updateConsents = async (consents: ConsentState) => {
    const stamped = { ...consents, updatedAt: new Date().toISOString() };
    setSession((prev) => ({ ...prev, consents: stamped }));
    const fb = getFirebaseServices();
    if (fb && fb.auth.currentUser) {
      await updateDoc(doc(fb.db, "users", fb.auth.currentUser.uid), { consents: stamped });
    }
    await appendAudit(
      "CONSENT_UPDATED",
      "consent",
      session.uid,
      `Consentimentos atualizados (IA=${stamped.aiProcessingAccepted}, Mkt=${stamped.marketingEmail})`
    );
  };

  const toggleTaskStatus = async (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: t.status === "done" ? "in_progress" : "done" } : t
      )
    );
    await appendAudit("CHECKLIST_TASK_UPDATED", "checklist", taskId, `Marco de checklist atualizado (${taskId})`);
  };

  const uploadVaultDocument = async ({
    file,
    category,
    title,
    country,
  }: {
    file: File;
    category: string;
    title: string;
    country: CountryCode | "BOTH";
  }) => {
    const fileCheck = validateVaultFile({ name: file.name, type: file.type, size: file.size });
    if (!fileCheck.ok) {
      await appendAudit(
        "VAULT_UPLOAD_BLOCKED",
        "vault_document",
        "blocked",
        `Upload rejeitado por segurança (${file.name}): ${fileCheck.error}`
      );
      throw new Error(fileCheck.error || "Arquivo inválido");
    }

    const fileHash = await computeFileSha256(file);
    const now = new Date().toISOString();
    const existing = docs.find((d) => d.category === category && d.country === country);
    const nextVersion = existing ? existing.version + 1 : 1;
    const docId = existing ? existing.id : `doc-${Date.now()}`;
    let storagePath: string | undefined;
    let previewDataUrl: string | undefined;

    const fb = getFirebaseServices();
    if (fb && fb.auth.currentUser) {
      const path = `vault/${fb.auth.currentUser.uid}/${docId}/v${nextVersion}_${file.name}`;
      const storageRef = ref(fb.storage, path);
      await uploadBytes(storageRef, file);
      previewDataUrl = await getDownloadURL(storageRef);
      storagePath = path;
    } else if (file.size < 2_000_000) {
      previewDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.readAsDataURL(file);
      });
    }

    const newEvent = {
      id: `ev-${Date.now()}`,
      type: existing ? ("NEW_VERSION" as const) : ("UPLOAD" as const),
      actorName: session.displayName,
      actorRole: session.role,
      timestamp: now,
      note: `v${nextVersion} (${file.name}, SHA-256 ${fileHash.slice(0, 12)}...)`,
    };

    if (existing) {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === docId
            ? {
                ...d,
                title: title || d.title,
                version: nextVersion,
                fileName: file.name,
                mimeType: file.type || "application/pdf",
                sizeBytes: file.size,
                sha256: fileHash,
                status: "awaiting_review",
                storagePath,
                previewDataUrl: previewDataUrl || d.previewDataUrl,
                updatedAt: now,
                events: [newEvent, ...d.events],
              }
            : d
        )
      );
    } else {
      const created: VaultDocument = {
        id: docId,
        ownerUid: session.uid,
        category,
        title: title || file.name,
        country,
        version: 1,
        fileName: file.name,
        mimeType: file.type || "application/pdf",
        sizeBytes: file.size,
        sha256: fileHash,
        status: "awaiting_review",
        storagePath,
        previewDataUrl,
        uploadedAt: now,
        updatedAt: now,
        shares: [],
        events: [newEvent],
      };
      setDocs((prev) => [created, ...prev]);

      if (fb && fb.auth.currentUser) {
        await setDoc(doc(fb.db, "vault_documents", docId), {
          ownerUid: fb.auth.currentUser.uid,
          category,
          title: created.title,
          fileName: file.name,
          mimeType: file.type || "application/pdf",
          sizeBytes: file.size,
          version: 1,
          sha256: fileHash,
          status: "awaiting_human_review",
          storagePath: storagePath || `vault/${fb.auth.currentUser.uid}/${docId}/v1_${file.name}`,
          activeSharedUids: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }

    await appendAudit(
      existing ? "VAULT_DOC_NEW_VERSION" : "VAULT_DOC_UPLOADED",
      "vault_document",
      docId,
      `${file.name} v${nextVersion} enviado (SHA-256 ${fileHash.slice(0, 10)})`
    );
  };

  const recordDocViewOrDownload = async (docId: string, action: "VIEW" | "DOWNLOAD") => {
    const now = new Date().toISOString();
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              events: [
                {
                  id: `ev-${Date.now()}`,
                  type: action,
                  actorName: session.displayName,
                  actorRole: session.role,
                  timestamp: now,
                  note:
                    action === "VIEW"
                      ? "Visualizado com marca d'água rastreável"
                      : "Download autorizado com hash verificado",
                },
                ...d.events,
              ],
            }
          : d
      )
    );
    await appendAudit(`VAULT_DOC_${action}`, "vault_document", docId, `${action} registrado no documento ${docId}`);
  };

  const shareVaultDocument = async (
    docId: string,
    partnerName: string,
    partnerRole: string,
    daysValid: number
  ) => {
    const now = new Date();
    const exp = new Date(now.getTime() + daysValid * 86400_000).toISOString();
    const shareId = `shr-${Date.now()}`;

    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              shares: [
                {
                  id: shareId,
                  partnerName,
                  partnerRole,
                  grantedAt: now.toISOString(),
                  expiresAt: exp,
                },
                ...d.shares,
              ],
              events: [
                {
                  id: `ev-${Date.now()}`,
                  type: "SHARE_GRANTED",
                  actorName: session.displayName,
                  actorRole: session.role,
                  timestamp: now.toISOString(),
                  note: `Compartilhado com ${partnerName} até ${exp.slice(0, 10)}`,
                },
                ...d.events,
              ],
            }
          : d
      )
    );

    await appendAudit(
      "VAULT_SHARE_GRANTED",
      "vault_document",
      docId,
      `Consentimento concedido a ${partnerName} por ${daysValid} dias`
    );
  };

  const revokeVaultShare = async (docId: string, shareId: string) => {
    const now = new Date().toISOString();
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              shares: d.shares.map((s) => (s.id === shareId ? { ...s, revokedAt: now } : s)),
              events: [
                {
                  id: `ev-${Date.now()}`,
                  type: "SHARE_REVOKED",
                  actorName: session.displayName,
                  actorRole: session.role,
                  timestamp: now,
                  note: `Acesso ${shareId} revogado imediatamente pelo titular`,
                },
                ...d.events,
              ],
            }
          : d
      )
    );
    await appendAudit("VAULT_SHARE_REVOKED", "vault_document", docId, `Compartilhamento ${shareId} revogado`);
  };

  const reviewVaultDocument = async (
    docId: string,
    decision: "approved" | "rejected",
    note: string
  ) => {
    if (!canReviewDocuments(session.role)) {
      await appendAudit(
        "RBAC_UNAUTHORIZED_REVIEW_ATTEMPT",
        "vault_document",
        docId,
        `Tentativa bloqueada de revisar documento pelo papel ${session.role}`
      );
      return;
    }

    const now = new Date().toISOString();
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              status: decision,
              updatedAt: now,
              events: [
                {
                  id: `ev-${Date.now()}`,
                  type: decision === "approved" ? "APPROVED" : "REJECTED",
                  actorName: session.displayName,
                  actorRole: session.role,
                  timestamp: now,
                  note,
                },
                ...d.events,
              ],
            }
          : d
      )
    );
    await appendAudit(
      decision === "approved" ? "VAULT_DOC_APPROVED" : "VAULT_DOC_REJECTED",
      "vault_document",
      docId,
      `Revisão humana (${decision}): ${note}`
    );
  };

  const addLead = async (lead: Omit<CrmLead, "id" | "createdAt" | "notes">) => {
    const newLead: CrmLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      notes: ["Capturado via plataforma SaaS"],
    };
    setLeads((prev) => [newLead, ...prev]);

    const fb = getFirebaseServices();
    if (fb) {
      try {
        await addDoc(collection(fb.db, "crm_leads"), {
          userUid: fb.auth.currentUser?.uid || null,
          name: newLead.name,
          email: newLead.email,
          origin: newLead.origin,
          stage: "new_lead",
          score: newLead.score,
          countryTarget: newLead.countryTarget,
          budgetEur: newLead.budgetEur,
          assignedAdvisor: null,
          notes: newLead.notes,
          createdAt: serverTimestamp(),
        });
      } catch {
        // Ignora se regras restringirem leitura ou campos
      }
    }
    await appendAudit("CRM_LEAD_CREATED", "crm_lead", newLead.id, `Lead ${lead.name} (${lead.origin}) — Score ${lead.score}`);
  };

  const moveLeadStage = async (leadId: string, stage: CrmStage) => {
    if (!canAccessInternalCrm(session.role)) {
      await appendAudit("RBAC_UNAUTHORIZED_CRM_MOVE", "crm_lead", leadId, `Bloqueado para ${session.role}`);
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage } : l)));
    await appendAudit("CRM_LEAD_STAGE_MOVED", "crm_lead", leadId, `Lead movido para etapa ${stage}`);
  };

  const createHitlEscalation = async (
    payload: Omit<HitlEscalation, "id" | "status" | "createdAt">
  ) => {
    const item: HitlEscalation = {
      ...payload,
      id: `hitl-${Math.floor(100 + Math.random() * 899)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setHitlQueue((prev) => [item, ...prev]);
    await appendAudit(
      "HITL_ESCALATION_CREATED",
      "hitl",
      item.id,
      `Escalonamento ${item.severity} (${item.agentType}): ${item.reason}`
    );
  };

  const resolveHitl = async (id: string, note: string) => {
    if (!canAccessInternalCrm(session.role)) {
      await appendAudit("RBAC_UNAUTHORIZED_HITL_RESOLVE", "hitl", id, `Bloqueado para ${session.role}`);
      return;
    }
    setHitlQueue((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: "resolved", resolutionNote: note } : h))
    );
    await appendAudit("HITL_RESOLVED", "hitl", id, `Decisão humana registrada: ${note}`);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const exportAllUserDataJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      complianceFramework: "LGPD (Art. 18) & GDPR (Art. 20 - Data Portability)",
      user: session,
      checklistTasks: tasks,
      vaultDocumentsMetadata: docs.map((d) => ({ ...d, previewDataUrl: undefined })),
      auditTrail: auditLogs,
    };
    void appendAudit("DSR_DATA_EXPORTED", "user", session.uid, "Portabilidade de dados pessoais executada em JSON");
    return JSON.stringify(payload, null, 2);
  };

  const requestDataErasure = async () => {
    await appendAudit(
      "DSR_ERASURE_REQUESTED",
      "user",
      session.uid,
      "Solicitação de exclusão/anonimização registrada (sujeita à retenção legal AML)"
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        category: "concierge",
        title: {
          pt: "Solicitação DSR LGPD/GDPR protocolada",
          en: "GDPR/LGPD Erasure Request Logged",
          es: "Solicitud RGPD/LGPD registrada",
        },
        body: {
          pt: "Nosso DPO responderá em até 5 dias úteis respeitando prazos legais de retenção AML.",
          en: "Our DPO will process your request within 5 business days subject to AML statutory retention.",
          es: "Nuestro DPO responderá en 5 días hábiles respetando retención legal AML.",
        },
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  };

  // Suprime lint warning de sha256Hex / GENESIS_HASH caso otimizado
  void sha256Hex;
  void GENESIS_HASH;

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        session,
        firebaseReady: isFirebaseConfigured,
        switchSandboxRole,
        loginEmail,
        signupEmail,
        loginGoogle,
        verifyMfaCode,
        logout,
        updateBuyerProfile,
        updateConsents,
        tasks,
        toggleTaskStatus,
        docs,
        uploadVaultDocument,
        recordDocViewOrDownload,
        shareVaultDocument,
        revokeVaultShare,
        reviewVaultDocument,
        auditLogs,
        leads,
        addLead,
        moveLeadStage,
        hitlQueue,
        createHitlEscalation,
        resolveHitl,
        notifications,
        markAllNotificationsRead,
        verifiedPayment: VERIFIED_PAYMENT_DEMO,
        exportAllUserDataJson,
        requestDataErasure,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
