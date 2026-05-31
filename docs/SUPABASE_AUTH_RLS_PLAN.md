# Supabase Auth RLS Plan

## Objetivo

Entregar a fundacao segura de backend para a V1: Auth, schema inicial, migrations, RLS, storage privado, clientes Supabase e documentacao tecnica.

## Escopo entregue nesta etapa

- Migrations versionadas para schema inicial amplo da V1.
- RLS habilitado nas tabelas do schema `public`.
- Policies de dono por `user_id` e perfil por `id`.
- Modelo limitado de Atalaia por `accountability_grants`.
- Storage privado para `user-uploads`, `inbox-attachments` e `commitment-documents`.
- Helpers Supabase client/server/admin com separacao server-only.
- Skills locais para RLS, migrations, Auth, Atalaia e testes.

## Projeto remoto

O projeto informado pelo fundador e `https://bceumcfmjftoukzrfthe.supabase.co`.

Este agente nao aplicou migrations no projeto remoto porque o workspace nao tem access token Supabase, service role ou senha de banco. A chave publicavel informada nao basta para executar DDL, Auth config ou policies. As migrations estao prontas para aplicacao manual/CLI.

## Auth

- Fluxo inicial: email/senha com confirmacao de email.
- OAuth: futuro, preparado conceitualmente, sem metadata externa para autorizacao.
- Sessao: SSR com cookies via `@supabase/ssr`.
- Perfil: `profiles.id` referencia `auth.users.id`.
- Trigger: `app_private.handle_new_user()` cria perfil minimo apos signup.

## RLS

- Tabelas de produto: dono autenticado por `user_id = auth.uid()`.
- `profiles`: dono por `id = auth.uid()`.
- Logs, consentimentos e eventos: leitura limitada; escrita deve ser server-side.
- Atalaia: acesso somente em tabelas de accountability e documento de compromisso compartilhado.
- Metacognicao, Chamado, revisoes privadas, inbox bruto, calendario completo e distracoes ficam owner-only.

## Storage

Buckets privados:

- `user-uploads`
- `inbox-attachments`
- `commitment-documents`

Objetos devem ficar em path `{user_id}/...`. Atalaia so deve acessar arquivo via signed URL server-side e grant explicito.

## Gates antes do Prompt 5

- Aplicar migrations em Supabase local/remoto.
- Rodar testes RLS por persona.
- Gerar tipos reais com Supabase CLI.
- Confirmar Auth redirects no dashboard.
- Confirmar que nenhuma secret entrou no Git.
