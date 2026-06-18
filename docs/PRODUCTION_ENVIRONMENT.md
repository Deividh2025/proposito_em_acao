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
- `/api/health` e liveness simples; `/api/ready` valida Supabase/Auth essencial e URL HTTPS publicada fora de `local-demo`, mas nao valida provider de IA, Resend ou smoke autenticado real.
- Dockerfile existe com `HEALTHCHECK` em `/api/health`, mas a imagem ainda precisa ser validada com Docker daemon/Coolify.
- Auth real publicado segue bloqueado por falta de callback/confirmacao/recuperacao/refresh centralizado validados em URL HTTPS.

## Responsavel

- Dono da plataforma: Deividh de Sa.
- E-mail operacional informado: `deividhvianei@gmail.com`.

Este e-mail fica registrado como contato operacional/fundador. Ele ainda nao define `EMAIL_FROM` transacional; envio real exige provider, dominio/remetente e templates aprovados.

## URL

- Local: `http://localhost:3000` ou `http://127.0.0.1:3000`.
- Producao: `https://proposito-em-acao.app.br` (apos DNS + HTTPS configurados no Coolify).
- Dominio adquirido: `proposito-em-acao.app.br` em 2026-06-18 via Registro.br.
- Dominio temporario atual (Coolify demo): `http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io`.

## Plataforma

- Provedor de infraestrutura: Oracle Cloud (Always Free Tier / VPS).
- PaaS self-hosted: Coolify (ja rodando na VPS Oracle Cloud).
- Dominio adquirido: `proposito-em-acao.app.br` (Registro.br, adquirido em 2026-06-18).
- URL de producao: `https://proposito-em-acao.app.br` (apos DNS + HTTPS configurados).
- Fallback de contingencia: Vercel (nao e a decisao principal).

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

Separacao operacional obrigatoria:

- Local usa `.env.local` privado e pode operar em `APP_RUNTIME_MODE=local-demo`.
- Preview usa apenas variaveis cadastradas no Coolify para o app de preview; nao deve herdar `.env.local`, secrets de producao ou service role de outro ambiente.
- Producao deve ter app/projeto/secret set proprio e so pode ser configurada apos aprovacao explicita.
- Valores `NEXT_PUBLIC_*` sao publicos no bundle cliente; nunca colocar tokens, senhas, URLs privadas com senha, service role, API keys ou webhook secrets nessa familia.
- Secrets server-side incluem `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, SMTP password, tokens de CLI e URLs Postgres com senha.
- Variaveis de operador para CLI, como `SUPABASE_ACCESS_TOKEN` e `SUPABASE_PREVIEW_DB_URL`, nao pertencem ao runtime do app e nao devem ser configuradas como `NEXT_PUBLIC_*`.

## Hostinger/Coolify preview - Etapa 8

Estado desta etapa:

- Plano documentado: Hostinger VPS KVM 1 + Coolify para preview controlado.
- Sem evidencia local de dominio temporario configurado.
- Sem evidencia local de HTTPS publicado.
- Sem evidencia local de deploy Coolify executado.
- Sem evidencia local de secrets inseridos no provedor.
- Sem smoke externo executado contra URL publicada.

Regras para o ambiente de preview:

- `APP_RUNTIME_MODE` deve ser `preview`.
- `NEXT_PUBLIC_APP_URL` deve apontar para a URL HTTPS exata do preview depois de publicada.
- Supabase Auth deve ter Site URL e Redirect URLs alinhadas com a URL HTTPS exata.
- E-mail real, IA real, analytics real e feedback real ficam desligados ate aprovacao operacional e smoke especifico.
- Logs e variaveis devem ser conferidos antes de qualquer convite de beta.

Gate de recurso:

- A KVM 1 permanece adequada somente se sustentar build, runtime Next.js, Coolify, logs, HTTPS e rollback com estabilidade.
- Upgrade para KVM 2 e obrigatorio antes de beta real se a KVM 1 apresentar saturacao, deploy instavel, falta de memoria/CPU/disco, indisponibilidade de logs, proxy/HTTPS instavel ou rollback lento/inseguro.

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
