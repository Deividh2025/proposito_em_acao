# Production Environment

Data: 2026-06-02.

## Ambientes

| Ambiente | Status | Uso |
|---|---|---|
| Local | Ativo | Desenvolvimento e gates automatizados. |
| Preview | Parcial | Supabase branch/preview e RLS dinamica validados; falta deploy Coolify, URL HTTPS, Auth real e smoke externo. |
| Producao | Bloqueado | Somente apos Supabase/RLS/Auth/LGPD/secrets/smoke aprovados. |

## Estado atual verificado em 2026-06-03

- Proximo objetivo: beta real fechado, nao producao aberta.
- GitHub: repositorio privado, `main` sem protecao efetiva pela API, zero workflows, zero releases e zero tags/deployments publicados.
- Supabase CLI local disponivel (`2.98.2`) e projeto `proposito_em_acao` listado em modo read-only; evidencia de RLS preview continua historica de 2026-06-02 e deve ser repetida antes de beta real.
- `/api/health` e liveness simples; nao valida Supabase, Auth, secrets, provider de IA, Resend ou dependencias.
- Dockerfile existe, mas a imagem nao foi validada nesta auditoria e nao possui `HEALTHCHECK`.
- Auth real publicado segue bloqueado por falta de callback/confirmacao/recuperacao/refresh centralizado validados em URL HTTPS.

## Responsavel

- Dono da plataforma: Deividh de Sa.
- E-mail operacional informado: `deividhvianei@gmail.com`.

Este e-mail fica registrado como contato operacional/fundador. Ele ainda nao define `EMAIL_FROM` transacional; envio real exige provider, dominio/remetente e templates aprovados.

## URL

- Local: `http://localhost:3000` ou `http://127.0.0.1:3000`.
- Preview: pendente de dominio temporario e HTTPS na VPS Hostinger/Coolify.
- Producao: pendente de dominio final aprovado.
- Dominio exato: gate manual antes de qualquer deploy publicado.

## Plataforma

- Provedor de infraestrutura: VPS Hostinger.
- Plano inicial: Hostinger KVM 1, com gate obrigatorio de upgrade se nao sustentar a aplicacao com estabilidade.
- PaaS self-hosted: Coolify.
- Plataforma anterior recomendada, Vercel, passa a alternativa de contingencia, nao decisao principal.

## Supabase

Projeto conhecido:

- Project ref: `bceumcfmjftoukzrfthe`.
- Nome: `proposito_em_acao`.
- Regiao: `sa-east-1`.
- Status consultado em 2026-06-02: `ACTIVE_HEALTHY`.

Status de schema remoto:

- Branch preview `preview-release-readiness` criado para validacao.
- Migrations locais alinhadas no preview ate `20260602214345`.
- Matriz RLS dinamica passou no preview para dono, outro usuario, anonimo, Atalaia ativo e Atalaia revogado.
- Security advisor do preview sem issues apos ativar protecao contra senhas vazadas.

## Auth redirects

Configurar no dashboard Supabase:

- Local: `http://localhost:3000/**`.
- Preview Coolify/Hostinger: URL exata do dominio temporario aprovado.
- Producao: URL exata do dominio final, preferencialmente sem wildcard.

## Variaveis por ambiente

Nao registrar valores reais neste documento.

| Variavel | Local | Preview | Producao | Exposicao |
|---|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | opcional | obrigatoria | obrigatoria | Publica |
| `NEXT_PUBLIC_APP_URL` | obrigatoria | obrigatoria | obrigatoria | Publica |
| `NEXT_PUBLIC_BETA_FEEDBACK_URL` | vazio | opcional se aprovado | opcional se aprovado | Publica, sem tokens |
| `NEXT_PUBLIC_SUPABASE_URL` | opcional | obrigatoria apos Supabase preview | obrigatoria | Publica |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | opcional | obrigatoria apos Supabase preview | obrigatoria | Publica |
| `SUPABASE_PROJECT_ID` | opcional | obrigatoria para CLI/tipos | obrigatoria operacional | Nao secret |
| `SUPABASE_SERVICE_ROLE_KEY` | somente operador | server-side se necessario | server-side se necessario | Secret |
| `OPENAI_API_KEY` | vazio ate aprovar IA real | server-side se aprovado | server-side se aprovado | Secret |
| `OPENAI_MODEL` | vazio ate aprovar IA real | server-side se aprovado | server-side se aprovado | Config |
| `DEEPSEEK_API_KEY` | vazio ate aprovar IA real | server-side se aprovado | server-side se aprovado | Secret |
| `DEEPSEEK_BASE_URL` | opcional | `https://api.deepseek.com` se aprovado | `https://api.deepseek.com` se aprovado | Config |
| `DEEPSEEK_MODEL_FLASH` | opcional | `deepseek-chat` se aprovado | `deepseek-chat` se aprovado | Config |
| `DEEPSEEK_MODEL_PRO` | opcional | `deepseek-reasoner` se aprovado | `deepseek-reasoner` se aprovado | Config |
| `EMAIL_PROVIDER` | vazio | vazio ou provider aprovado | provider aprovado | Server-side/config |
| `EMAIL_FROM` | vazio | vazio ou remetente aprovado | remetente aprovado | Config |
| `NODE_ENV` | `development` | `production` | `production` | Config |

## Headers

`next.config.ts` define headers globais de seguranca:

- `X-Content-Type-Options`;
- `X-Frame-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `Content-Security-Policy`;
- `Strict-Transport-Security` em build de producao.

`/sw.js` continua com `Cache-Control: no-store, no-cache, must-revalidate`.

## IA

OpenAI e DeepSeek foram escolhidos como providers reais planejados. Ambos permanecem server-side e desativados nos fluxos de produto ate configurar secrets no Coolify, escolher modelos por agente, aprovar custo/rate limit, ampliar evals e validar guardrails por fluxo.

Modelos DeepSeek informados:

- `deepseek-chat`
- `deepseek-reasoner`

## E-mail

E-mail real permanece desativado. Resend foi decidido para transacional e SMTP customizado do Supabase Auth, mas ainda exige adapter, dominio verificado, secrets, remetente, templates e smoke. Fluxos de Atalaia usam fallback `pending_provider_config` ate isso existir.

## Feedback beta

`NEXT_PUBLIC_BETA_FEEDBACK_URL` pode apontar para um formulario externo aprovado. Por ser publico no browser, nao deve conter tokens, identificadores pessoais, querystrings sensiveis ou secrets. O feedback in-app permanece rascunho local ate haver politica de coleta, consentimento e retencao de 90 dias implementada.
