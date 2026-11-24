# Guia de Deploy Online — CASA NA GRINGA (`casanagringa.com`)

Este guia coloca o SaaS online no **Firebase App Hosting + Auth (MFA) + Cloud Firestore + Storage + Gemini API** em poucos minutos quando você criar sua conta/projeto.

---

## Pré-requisitos
1. Conta Google / Firebase com plano **Blaze (pay-as-you-go)** ativado (necessário para Firebase App Hosting, Cloud Run, Storage e segredos).
2. Domínio `casanagringa.com` registrado (Cloudflare, Registro.br, GoDaddy, Google Cloud Domains etc.).
3. Repositório no GitHub com este projeto enviado (`git push`).

---

## Passo 1 — Criar o Projeto Firebase (Região UE para Compliance LGPD/GDPR)
1. Acesse o [Firebase Console](https://console.firebase.google.com/) e clique em **Adicionar projeto** (ex.: `casa-na-gringa-prod`).
2. Crie um **Web App** no projeto para obter as chaves públicas (para rodar localmente em `.env.local`).
3. Ative os serviços:
   - **Authentication → Sign-in method:** habilite **Email/Password** e **Google**.
   - **Authentication → Settings → Multi-factor authentication (Identity Platform):** habilite **TOTP Authenticator App** (obrigatório conforme nossa arquitetura Zero Trust!).
   - **Authentication → Settings → Authorized domains:** adicione `localhost` e `casanagringa.com`.
   - **Cloud Firestore:** crie o banco no local **`eur3` (Europa)** ou **`europe-southwest1` (Madrid)** para manter dados europeus na UE.
   - **Cloud Storage:** ative na mesma região europeia.

---

## Passo 2 — Configurar Regras de Segurança e Índices
No terminal dentro da pasta do projeto:

```bash
npx firebase-tools login
npx firebase-tools use --add   # selecione seu projeto casa-na-gringa-prod
npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage
```

---

## Passo 3 — Configurar Segredo da IA (Gemini)
1. Gere sua chave em [Google AI Studio](https://aistudio.google.com/apikey) ou no Google Cloud.
2. Salve com segurança no Secret Manager do App Hosting (nunca coloque em código!):

```bash
npx firebase-tools apphosting:secrets:set GEMINI_API_KEY
```

---

## Passo 4 — Publicar no Firebase App Hosting & Conectar `casanagringa.com`
1. No Firebase Console, vá em **Build → App Hosting → Get Started**.
2. Conecte seu repositório GitHub, escolha a branch `main` e a região primária **`europe-west4`** (ou região UE disponível no App Hosting).
3. O Firebase lerá automaticamente `apphosting.yaml` e `package.json`, fará o build do Next.js e publicará sua URL `.hosted.app`.
4. Em **App Hosting → Custom Domains**, adicione `casanagringa.com` e `www.casanagringa.com` e aponte os registros DNS (`A` / `TXT` / `CNAME`) indicados pelo Firebase. O certificado **TLS 1.3 / SSL** será provisionado automaticamente.

---

## Passo 5 — Atribuir Papéis Internos (RBAC)
Por padrão, novos cadastros recebem papel `client`. Para promover seu usuário a `admin` ou `advisor` em produção, execute um script com Firebase Admin SDK definindo *Custom Claims* (`auth.setCustomUserClaims(uid, { role: 'admin' })`).
