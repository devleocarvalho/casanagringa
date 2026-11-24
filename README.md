# 🏛️ Casa na Gringa

Plataforma inteligente de assessoria imobiliária, segurança jurídica e planejamento tributário transfronteiriço para compra de imóveis de alto padrão em **Portugal** e na **Espanha**.

---

## 🚀 Sobre o Projeto

O **Casa na Gringa** foi desenvolvido para solucionar as maiores dores de compradores brasileiros e internacionais ao adquirir patrimônio imobiliário na Europa:
1. **Auditoria Jurídica Prévia:** Verificação de matrículas, certidões prediais, dívidas ocultas e licenças antes de qualquer sinal ou contrato de reserva.
2. **Engenharia Fiscal & Câmbio:** Simuladores em tempo real para impostos de transmissão (IMT e Imposto do Selo em Portugal; ITP e AJD na Espanha), taxas notariais e estruturação cambial compatível com Banco Central e normativas europeias (AML/KYC).
3. **Cofre Seguro com Trilha de Auditoria:** Armazenamento seguro de documentos criptografados com integridade garantida por **cadeia de custódia SHA-256 à prova de adulteração**.
4. **Agentes de IA com Guardrails Regulatórios:** Assistentes especializados alimentados por IA (Gemini) equipados com travas de compliance jurídico e territorial.

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions & Static Optimization)
- **UI & Estilização:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Linguagem & Tipagem:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Validação de Dados:** [Zod](https://zod.dev/)
- **Backend & Nuvem:** [Firebase](https://firebase.google.com/) (Auth com MFA/TOTP, Cloud Firestore, Cloud Storage, App Hosting)
- **Inteligência Artificial:** [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini API) com RAG jurídico e Guardrails
- **Testes & Qualidade:** [Vitest](https://vitest.dev/), [ESLint 9](https://eslint.org/) (Flat Config)

---

## 📂 Estrutura do Repositório

```text
├── docs/                     # 23 documentos de arquitetura, negócio, segurança e LGPD/GDPR
├── src/
│   ├── app/                  # Rotas do Next.js (Home, Imóveis, Cofre, CRM, Assistentes, Simuladores)
│   │   └── api/ai/chat/      # API Route com Gemini e Guardrails
│   ├── components/           # Componentes reutilizáveis (Navbar, Footer, Parallax, SecurityGate)
│   ├── context/              # Contexto global da aplicação (Autenticação, Moeda, Idioma)
│   ├── data/                 # Catálogo editorial de propriedades curadas
│   ├── lib/
│   │   ├── ai/               # Orquestração de Agentes e Guardrails
│   │   ├── firebase/         # SDK client do Firebase
│   │   ├── i18n/             # Dicionários multilíngue (PT, ES, EN)
│   │   ├── auditChain.ts     # Trilha de auditoria criptográfica (SHA-256)
│   │   ├── taxCalculator.ts  # Motor de cálculo tributário (Portugal & Espanha)
│   │   └── vaultValidation.ts# Schemas Zod para documentos e segurança
│   └── types/                # Definições de tipos de domínio
├── firestore.rules           # Regras de segurança granulares Zero-Trust (RBAC)
├── storage.rules             # Regras de controle de acesso ao Cloud Storage
└── apphosting.yaml           # Configuração de deploy para Firebase App Hosting
```

---

## ⚡ Como Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/devleocarvalho/casanagringa.git
cd casanagringa
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env.local` na raiz com suas credenciais:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
GEMINI_API_KEY=sua_chave_do_gemini
```

### 4. Executar os scripts
```bash
# Rodar servidor de desenvolvimento
npm run dev

# Rodar testes unitários
npm run test

# Checagem de tipagem estática
npm run typecheck

# Linter de código
npm run lint

# Build de produção
npm run build
```

---

## 🔒 Segurança e Compliance

- **Zero-Trust RBAC:** Acesso baseado em funções (`client`, `advisor`, `admin`) validado nas regras do Firestore.
- **GDPR / LGPD:** Arquitetura desenhada para centros de dados na União Europeia (`europe-west4` / `europe-southwest1`).
- **Audit Trail:** Registros imutáveis de cada upload de documento e alteração de proposta.

---

## 📄 Licença

Proprietário — Todos os direitos reservados a **Casa na Gringa**.
