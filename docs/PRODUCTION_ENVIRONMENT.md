# Production Environment

Data: 2026-06-02.

## Ambientes

| Ambiente | Status | Uso |
|---|---|---|
| Local | Ativo | Desenvolvimento e gates automatizados. |
| Preview | Pendente de execucao | Primeiro deploy controlado em VPS Hostinger/Coolify, smoke tests, Supabase branch/preview e Auth real. |
| Producao | Bloqueado | Somente apos Supabase/RLS/Auth/LGPD/secrets/smoke aprovados. |

## Responsavel

- Dono da plataforma: Deividh de Sa.
- E-mail operacional informado: `deividhvianei@gmail.com`.

Este e-mail fica registrado como contato operacional/fundador. Ele ainda nao define `EMAIL_FROM` transacional; envio real exige provider, dominio/remetente e templates aprovados.

## URL

- Local: `http://localhost:3000` ou `http://127.0.0.1:3000`.
- Preview: pendente de dominio temporario e HTTPS na VPS Hostinger/Coolify.
- Producao: pendente de dominio final aprovado.

## Plataforma

- Provedor de infraestrutura: VPS Hostinger.
- PaaS self-hosted: Coolify.
- Plataforma anterior recomendada, Vercel, passa a alternativa de contingencia, nao decisao principal.

## Supabase

Projeto conhecido:

- Project ref: `bceumcfmjftoukzrfthe`.
- Nome: `proposito_em_acao`.
- Regiao: `sa-east-1`.
- Status consultado em 2026-06-02: `ACTIVE_HEALTHY`.

Status de schema remoto:

- Migrations remotas listadas: `20260602134002 mobile_pwa_prompt14_alignment`.
- Tabelas publicas visiveis: `energy_checkins`.
- Conclusao: remoto nao esta alinhado com todas as migrations locais da V1.

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
| `DEEPSEEK_MODEL_FLASH` | opcional | `deepseek-v4-flash` se aprovado | `deepseek-v4-flash` se aprovado | Config |
| `DEEPSEEK_MODEL_PRO` | opcional | `deepseek-v4-pro` se aprovado | `deepseek-v4-pro` se aprovado | Config |
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

- `deepseek-v4-flash`
- `deepseek-v4-pro`

## E-mail

E-mail real permanece desativado. Fluxos de Atalaia usam fallback `pending_provider_config` ate provider/remetente/mensagens serem aprovados.

## Feedback beta

`NEXT_PUBLIC_BETA_FEEDBACK_URL` pode apontar para um formulario externo aprovado. Por ser publico no browser, nao deve conter tokens, identificadores pessoais, querystrings sensiveis ou secrets. O feedback in-app permanece rascunho local ate haver politica de coleta, consentimento e retencao.
