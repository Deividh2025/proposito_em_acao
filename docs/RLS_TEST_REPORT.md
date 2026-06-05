# RLS Test Report - Prompt 15

Data: 2026-06-02.

## Estado atual verificado em 2026-06-03

- Supabase CLI esta disponivel localmente (`2.98.2`) e o projeto `proposito_em_acao` foi listado em modo read-only.
- O checkout nao esta linkado ao projeto; nenhuma migration, fixture ou harness remoto foi executado nesta auditoria documental.
- Branches lidas: `main` e `preview-release-readiness`.
- A evidencia de preview/RLS de 2026-06-02 e historica e deve ser repetida antes de beta real.
- Novos cenarios obrigatorios antes de beta: `atalia_invited` nao pode alterar escopo durante aceite; aceite deve ativar apenas o grant do convite; `permissions`, `goal_id`, `user_id`, parceiro e consentimento devem ser imutaveis para o convidado.
- A matriz deve ser expandida para todas as tabelas sensiveis e para zero-linha-afetada em updates/deletes.

## Escopo

Revisao de policies locais, regressao estatica de SQL e consulta remota limitada via Supabase plugin.

## Testes criados

- `src/tests/unit/rls-policy-safety.test.ts`

Este teste garante que policies de Atalaia nao fiquem apenas em `user_id + goal_id + permission`, exigindo tambem parceiro/grant especificos para grants, eventos e notificacoes.

## Correcoes aplicadas

- `accountability_grants`: select do Atalaia agora restringe pelo parceiro autenticado e pelo grant especifico.
- `accountability_events`: select do Atalaia exige evento vinculado ao grant/parceiro especifico.
- `accountability_notifications`: regressao confirma dependencia de grant/parceiro especifico.

## Validacao remota

- Projeto Supabase ativo encontrado: `bceumcfmjftoukzrfthe`.
- Advisors de seguranca nao retornaram lints.
- Migrations remotas listadas nao cobrem todo o conjunto local da V1, entao a validacao RLS remota completa permanece pendente.

## Matriz minima pendente

- `user_a` cria/le/atualiza/deleta dados proprios.
- `user_b` nao acessa dados de `user_a`.
- `user_b` nao cria filhos apontando para parents de `user_a`.
- Atalaia autorizado le somente alvo/grant permitido.
- Outro Atalaia no mesmo alvo nao le grant/evento/notificacao alheia.
- Atalaia revogado perde acesso.
- Metacognicao, Chamado e Revisao Semanal seguem privados.
- Storage privado bloqueia acesso fora do prefixo do usuario.

## Status

A regressao local passou. Deploy produtivo deve aguardar execucao dinamica em Supabase branch/preview.

## Addendum Prompt 16

Data: 2026-06-02.

Consulta Supabase real confirmou:

- Projeto `bceumcfmjftoukzrfthe` esta ativo.
- Migrations remotas listadas: apenas `20260602134002 mobile_pwa_prompt14_alignment`.
- Tabelas publicas visiveis nao cobrem a V1 completa.

Conclusao: matriz RLS dinamica continua bloqueante antes de producao aberta ou beta com usuarios reais.

## Addendum Preview Branch

Data: 2026-06-02.

Preview Supabase criado para validacao antes de producao:

- Branch preview: `preview-release-readiness`.
- Migrations locais foram aplicadas no preview depois de reconciliar historico equivalente da migration mobile/PWA.
- Matriz dinamica inicial confirmou isolamento owner-only e privacidade de Metacognicao.
- Falha encontrada: Atalaia ativo nao conseguia ler grant/evento autorizado porque as policies dependiam de `accountability_partners`, mas o parceiro ativo nao tinha leitura da propria relacao.
- Correcao versionada: `20260602214345_accountability_partner_active_select_policy.sql` permite ao Atalaia ler somente sua propria relacao ativa, aceita e nao revogada.

Validacao final executada no preview:

- Atalaia ativo le propria relacao, grant ativo e evento minimo autorizado.
- Atalaia ativo nao le `goals` nem `metacognition_sessions`.
- Atalaia revogado nao le a propria relacao revogada nem grant revogado.
- Outro usuario continua sem acesso ao alvo e a Metacognicao do dono.
- Anonimo nao le alvo privado.
- Fixtures temporarios foram removidos apos a matriz; contagem remanescente retornou `0`.

Status historico: matriz RLS dinamica passou no branch preview em 2026-06-02. Producao aberta e beta real ainda dependem de rerun fresco, Auth real, secrets/deploy, LGPD minima, smoke test publicado e cobertura dos novos cenarios de Atalaia convidado.

## Addendum Cutover Pack

Data: 2026-06-02.

Esta rodada preparou o pack revisavel para repetir o cutover em branch preview, sem aplicar nada no remoto:

- Roteiro central: `docs/SUPABASE_PREVIEW_CUTOVER.md`.
- Harness dinamico: `scripts/validate-supabase-preview.mjs`.
- Script npm: `npm.cmd run supabase:validate:preview`.
- Personas cobertas originalmente: `user_a`, `user_b`, `atalia-active` e `atalia-revoked`.
- Cobertura: Auth por anon key, owner-only, bloqueio user B/anon, integridade cross-owner, Atalaia ativo/revogado, `energy_checkins` e storage privado.

Status desta rodada: nao executado contra Supabase remoto porque o pedido explicitamente proibiu aplicar remoto sem aprovacao. A proxima execucao deve anexar evidencia fresca de comandos, branch preview, migrations, lint/advisors, fixtures removidos e resultado do harness.

## Addendum Etapa 2 - Atalaia convidado

Data: 2026-06-03.

Mudancas locais versionadas:

- Migration nova: `supabase/migrations/20260603211654_accountability_acceptance_rls_hardening.sql`.
- Policies de update direto do convidado para aceite foram removidas.
- `accountability_grants` agora possui `invite_token_hash` para vincular aceite ao grant especifico.
- Triggers `app_private.assert_accountability_partner_acceptance_scope_immutable` e `app_private.assert_accountability_grant_acceptance_scope_immutable` protegem campos revisados pelo dono.
- `app_private.has_active_accountability_grant` foi recriada com `search_path = pg_catalog, public`.
- `accountability_partners_partner_select_active` passa a exigir grant ativo associado para evitar leitura residual de relacao ativa apos revogacao do grant.
- Convites pendentes legados recebem backfill apenas quando ha um unico grant `invited` inequivoco; casos ambiguos devem ser expirados/reemitidos em preview.

Testes locais executados nesta etapa:

- `npm.cmd run test -- src\tests\unit\rls-policy-safety.test.ts`: passou, 1 arquivo e 6 testes.
- `npm.cmd run test -- src\tests\unit\accountability-commitments-domain.test.ts src\tests\integration\accountability-secure-actions.test.ts src\tests\unit\rls-policy-safety.test.ts src\tests\unit\supabase-preview-harness.test.ts src\tests\unit\accountability-acceptance-ui.test.ts`: passou, 5 arquivos e 26 testes.

Cobertura adicionada ao harness `scripts/validate-supabase-preview.mjs`:

- Personas: `user_a`, `user_b`, `atalia_invited`, `atalia_active`, `atalia_revoked` e `anon`.
- `atalia_invited` le somente a preview pendente do proprio convite.
- Tentativas de alterar `permissions`, `goal_id`, `user_id`, `tracking_level`, `notification_frequency` e `expires_at` falham.
- Aceite controlado ativa apenas o grant vinculado ao token hash especifico.
- Grant irmao permanece `invited`.
- Revogacao corta leitura futura de partner, grant, evento, notificacao e documento compartilhado.
- Harness recusa por padrao o project ref principal conhecido e pode validar `SUPABASE_PREVIEW_PROJECT_REF` quando informado.

Status remoto: nao aplicado e nao executado contra Supabase preview nesta etapa. O projeto principal nao foi modificado. A evidencia RLS remota continua pendente ate executar dry-run, push em branch preview aprovada, `supabase:types:preview` e `supabase:validate:preview`.

Risco residual: criacao/aceite/revogacao usam actions server-side com ordem fail-closed e compensacao de falha, nao RPC transacional. Antes de beta real, preferir RPC em `app_private` ou validar compensacao no preview com falhas induzidas.

## Addendum Etapa 7 - Privacidade, analytics e feedback

Data: 2026-06-04.

Cobertura local/documental preparada para novos cenarios:

- `product_analytics_events`: user A le apenas evento proprio; insert direto por cliente anonimo/autenticado fica revogado e a persistencia real deve passar por action server-side/admin apos `product_analytics_v1`, allowlist e minimizacao. User B/anon/Atalaia nao acessam; ausencia/revogacao de consentimento bloqueia antes do banco/admin.
- `beta_feedback_items`: user A le apenas feedback proprio; insert direto por cliente anonimo/autenticado fica revogado e a persistencia real deve passar por action server-side/admin apos aviso, `beta_feedback_v1` e bloqueio de indicio sensivel. User B/anon/Atalaia nao acessam.
- `user_preferences`: owner-only para preferencias de settings; outro usuario nao le nem atualiza.
- `consent_records`: dono le historico proprio; grant/revoke real passa por server-side e service role server-only.
- `account_deletion_requests`: solicitacao exige confirmacao explicita e owner-only; status operacional/admin nao deve ser atualizavel pelo cliente.
- Export JSON: resposta autenticada deve conter apenas dados do dono e remover secrets/tokens/hashes/logs internos antes de retornar.
- Retencao: prune de 90 dias deve apagar apenas `product_analytics_events`, `beta_feedback_items` e `ai_run_audits` expirados.

Status remoto: nao executado contra Supabase preview nesta etapa. Fechamento exige aplicar a migration de hardening `20260605130314_analytics_feedback_server_only_persistence.sql` em branch aprovada, typegen, harness atualizado e `npm.cmd run supabase:validate:preview` com evidencia fresca.
