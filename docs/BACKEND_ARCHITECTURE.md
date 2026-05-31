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

## Estado Prompt 4

- Projeto remoto Supabase nao foi modificado por falta de credenciais administrativas/CLI.
- Migrations de schema, RLS e storage foram criadas em `supabase/migrations/`.
- Clientes Supabase browser/server/admin foram preparados no app.
- Nenhuma autenticacao real.
- Nenhuma rota de produto.
