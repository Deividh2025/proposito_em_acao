# Backend Architecture

## Estrategia backend

O backend inicial sera composto por capacidades server-side do Next.js, Supabase e OpenAI server-side futuro. Um backend separado nao sera criado nesta etapa.

## Supabase

Supabase sera usado para:

- Auth.
- Postgres.
- RLS.
- Storage privado.
- Edge Functions quando houver fluxo que se beneficie de isolamento ou runtime proprio.

## Server-side routes/functions

Rotas server-side ou server actions devem proteger:

- Chamadas OpenAI.
- Operacoes com `service_role`.
- Validacao de permissoes.
- Envio de email.
- Mensagens e previa ao Atalaia.
- Acoes sensiveis de calendario, Chamado, Metacognicao e revisoes.

## Service role

- Nunca usar `SUPABASE_SERVICE_ROLE_KEY` no cliente.
- Usar somente em codigo server-side estritamente necessario.
- Preferir RLS e usuario autenticado para fluxo normal.
- Auditar qualquer operacao administrativa.

## Validacao

- Toda entrada persistida deve ter schema.
- Saida de IA que vira dado deve ser estruturada e validada.
- Dados sensiveis devem ser minimizados antes de ir para logs ou IA.

## Logs

- Registrar metadados operacionais, nao conteudo intimo bruto.
- Evitar prompts privados, respostas brutas e dados sensiveis.
- Eventos de consentimento e revogacao devem ser auditaveis.

## Estado atual verificado em 2026-06-04

- Backend real continua sendo Next.js server actions/routes + Supabase.
- Supabase CLI esta disponivel localmente (`2.98.2`) e o projeto `proposito_em_acao` foi listado em modo read-only, mas o checkout nao esta linkado para comandos mutaveis.
- Fundacao local de Auth SSR existe: proxy central com refresh/getClaims, callbacks, confirmacao, recuperacao, `next` seguro, rotas protegidas por runtime e `/api/ready`.
- `src/types/database.ts` ainda e generico; tipos reais precisam ser gerados apos cutover validado.
- `/api/health` continua liveness simples; `/api/ready` valida configuracao essencial de Supabase/Auth por runtime sem expor secrets.
- Actions que alteram estado real devem confirmar erros e linha afetada; fallback positivo so e aceitavel para ausencia de configuracao/sessao, nao para falha real.
- Resend foi decidido para e-mail transacional e SMTP customizado do Supabase Auth, mas adapter real ainda nao existe.
- DeepSeek foi decidido como provider planejado junto com OpenAI, mas o codigo ainda aceita apenas provider `mock`/`openai`.
- Analytics planejado sera first-party no Supabase, opt-in desligado por padrao e retencao de 90 dias; ainda nao ha persistencia real.

## Readiness server-side

Antes de beta real, o backend precisa separar claramente liveness e readiness:

- `/api/health` continua liveness simples.
- `/api/ready` falha fechado fora de `local-demo` quando Supabase/Auth essencial esta ausente.
- Auth SSR centraliza refresh/claims em proxy/middleware e server actions sensiveis continuam validando usuario no servidor.
- Redirects de Auth usam apenas caminhos internos relativos e nunca URL arbitraria enviada pelo usuario.
- PWA/service worker nao deve cachear rotas autenticadas, callbacks, recovery, server actions, cookies ou payloads privados.
- Pendente para beta real: smoke externo em URL HTTPS publicada, Supabase Auth redirects configurados, SMTP/Resend decidido operacionalmente e validação de cookies reais.

## Historico Prompt 4

- Projeto remoto Supabase nao foi modificado por falta de credenciais administrativas/CLI.
- Migrations de schema, RLS e storage foram criadas em `supabase/migrations/`.
- Clientes Supabase browser/server/admin foram preparados no app.
- Nenhuma autenticacao real.
- Nenhuma rota de produto.
