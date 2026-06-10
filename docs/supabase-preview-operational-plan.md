# Supabase Preview Operational Plan

Plano documental para preparar um preview Supabase/Auth seguro, sem aplicar migrations remotas, sem alterar Coolify, sem ativar `APP_RUNTIME_MODE=preview` e sem usar dados reais.

## 1. Estado atual

- Deploy atual em Coolify/Oracle.
- URL atual em `sslip.io` via HTTP.
- `APP_RUNTIME_MODE=local-demo`.
- Sem dominio proprio.
- Sem HTTPS definitivo.
- Sem Supabase real ativo.
- PR #16 preparou a fundacao Supabase/Auth local preservando `local-demo`.
- PR #17 prepara `healthcheck`, smoke e validacao de deploy.

## 2. Objetivo da futura etapa preview

- Testar Supabase/Auth com dados ficticios.
- Validar RLS com fixtures e personas de prova.
- Validar typegen a partir de preview aprovado.
- Validar callbacks, recovery e logout em URL publicada.
- Nao abrir para usuarios reais.

## 3. Inventario local

Arquivos mapeados:

- `supabase/migrations/*.sql`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/supabase/proxy.ts`
- `src/lib/supabase/guards.ts`
- `src/lib/supabase/index.ts`
- `src/lib/auth/redirects.ts`
- `src/app/auth/*`
- `src/types/database.ts`
- `scripts/*.mjs`
- docs: `docs/SUPABASE_PLAN.md`, `docs/SUPABASE_PREVIEW_CUTOVER.md`, `docs/SUPABASE_AUTH.md`, `docs/SUPABASE_AUTH_RLS_PLAN.md`, `docs/RLS_POLICIES.md`, `docs/RLS_ACCESS_MATRIX.md`, `docs/SUPABASE_STORAGE.md`, `docs/CONSENT_ACCESS_MODEL.md`, `docs/SECURITY_PRIVACY.md`, `docs/OPERATIONS_RUNBOOK.md`, `docs/RELEASE_READINESS.md`, `docs/BETA_CHECKLIST.md`, `docs/SMOKE_TEST_REPORT.md`, `docs/RLS_TEST_REPORT.md`

Scripts npm existentes:

- `npm.cmd run supabase:types:preview`
- `npm.cmd run supabase:validate:preview`
- suporte operacional: `npm.cmd run healthcheck`, `npm.cmd run smoke`, `npm.cmd run smoke:external`, `npm.cmd run test:e2e`, `npm.cmd run test:e2e:external`

Observacao:

- `src/types/database.ts` ainda e um placeholder generico ate rodar typegen aprovado em preview.
- Nao existe um wrapper npm separado para `supabase db push`; isso fica para o fluxo do operador/CLI.

## 4. Variaveis

### A) Runtime publicas

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### B) Runtime server-only futuras

- `SUPABASE_SERVICE_ROLE_KEY`

### C) Operador/CLI

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PREVIEW_DB_URL`
- `SUPABASE_PREVIEW_PROJECT_REF`
- `SUPABASE_PREVIEW_CONFIRM`
- `SUPABASE_TYPES_OUTPUT`

### D) Coolify local-demo atual

```txt
NIXPACKS_NODE_VERSION=22
NEXT_PUBLIC_APP_NAME=Propósito em Ação
NEXT_PUBLIC_APP_URL=http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io
APP_RUNTIME_MODE=local-demo
```

Regras de separacao:

- `NEXT_PUBLIC_*` so pode carregar valores publicos.
- `SUPABASE_ACCESS_TOKEN` e `SUPABASE_PREVIEW_DB_URL` ficam fora do runtime do app.
- `SUPABASE_SERVICE_ROLE_KEY` nunca vai para browser, mobile, logs ou `NEXT_PUBLIC_*`.
- Preview e production nao devem compartilhar o mesmo conjunto de secrets.

## 5. Migrations existentes

As migrations versionadas hoje sao estas:

1. `202605310001_initial_schema.sql` - schema base, `profiles`, Auth-linked trigger, breadth tables, indices e constraints iniciais.
2. `202605310002_rls_policies.sql` - RLS baseline, `force row level security`, owner policies e helper de accountability.
3. `202605310003_private_storage.sql` - buckets privados e policies de storage por prefixo de usuario.
4. `202605310004_onboarding_calling_metadata.sql` - alinhamento de metadata de onboarding/Calling.
5. `202605310005_execution_prompt8_alignment.sql` - goals, projects, tasks e microtasks com integridade de parent/child.
6. `202605310006_calendar_inbox_prompt9_alignment.sql` - calendario e inbox/GTD.
7. `202605310007_action_unblocker_metacognition_prompt10_alignment.sql` - Desbloqueador e Metacognicao.
8. `202605310008_focus_habits_scoreboard_prompt11_alignment.sql` - foco, habitos e Placar.
9. `202605310009_weekly_review_garden_prompt12_alignment.sql` - Revisao Semanal e Jardim.
10. `202606010010_accountability_commitment_prompt13_alignment.sql` - Atalaia, convites, grants, notificacoes e Documento de Compromisso.
11. `202606010011_mobile_pwa_prompt14_alignment.sql` - `energy_checkins` e runtime mobile.
12. `20260602214345_accountability_partner_active_select_policy.sql` - leitura ativa de relacao do Atalaia.
13. `20260603211654_accountability_acceptance_rls_hardening.sql` - hardening do aceite do Atalaia e imutabilidade de escopo.
14. `202606050001_privacy_settings_analytics_feedback.sql` - preferencias, consentimentos, analytics, feedback e retencao.
15. `20260605130314_analytics_feedback_server_only_persistence.sql` - persistencia server-only/admin de analytics e feedback.
16. `20260605172000_ai_audit_persistence_contract.sql` - contrato de auditoria de IA e retencao.
17. `20260610020145_auth_foundation_runtime_grants.sql` - grants de runtime para `energy_checkins` e `account_deletion_requests`.

Regras de aplicacao:

- Nao aplicar em producao.
- Fazer dry-run/review antes de qualquer `db push`.
- Validar apenas em branch/projeto preview sem dados reais.
- Se houver divergencia de historico remoto, preferir recriar branch preview data-less em vez de reparar no escuro.

## 6. RLS

O preview precisa provar estes principios:

- Toda tabela exposta em `public` tem RLS habilitado e forçado.
- `anon` nao ganha acesso por acidente.
- `authenticated` nao vira atalho para leitura ou escrita sensivel sem policy especifica.
- `service_role` nunca sai do servidor.
- Acesso compartilhado existe so onde o modelo pede Atalaia, grant ativo ou documento explicitamente compartilhado.
- `consent_records`, `audit_events` e `ai_run_audits` ficam com escrita controlada por server-side.
- `accountability` convite/aceite/revogacao continua action/server-side e nao pode deixar o convidado ampliar escopo.

### Matriz de RLS por tabela

#### Identidade, consentimento e auditoria

| Tabela | Leitura | Insert | Update | Delete | Observacao |
|---|---|---|---|---|---|
| `profiles` | owner | owner | owner | blocked | Perfil vinculado a `auth.users`; delete direto nao deve ser o fluxo normal. |
| `user_preferences` | owner | owner | owner | owner | Preferencias de settings do usuario. |
| `consent_records` | owner | server-side | server-side | server-side | Escritas de consentimento devem ser auditaveis e controladas por action/admin. |
| `audit_events` | owner | server-side | server-side | server-side | Auditoria minima, sem payload bruto. |
| `ai_run_audits` | owner | server-side | server-side | server-side | Apenas metadados tecnicos e retencao de 90 dias. |

#### Vida, execucao, foco e mobilidade

| Tabela | Leitura | Insert | Update | Delete | Observacao |
|---|---|---|---|---|---|
| `life_areas` | owner | owner | owner | owner | Mapa da Vida do dono. |
| `life_map_assessments` | owner | owner | owner | owner | Resumo e respostas do proprio usuario. |
| `life_map_area_scores` | owner | owner | owner | owner | FK composta por owner. |
| `callings` | owner | owner | owner | owner | Chamado pessoal privado. |
| `calling_session_entries` | owner | owner | owner | owner | Historico do discernimento. |
| `goals` | owner | owner | owner | owner | Alvos SMART-E do dono. |
| `projects` | owner | owner | owner | owner | Projeto precisa permanecer dentro do mesmo owner/goal. |
| `tasks` | owner | owner | owner | owner | `project_id` e `goal_id` devem ser validados no servidor. |
| `microtasks` | owner | owner | owner | owner | Filhos de task do mesmo owner. |
| `calendar_blocks` | owner | owner | owner | owner | Agenda privada por padrao. |
| `inbox_items` | owner | owner | owner | owner | `destination_type`/`destination_id` continuam server-side. |
| `focus_sessions` | owner | owner | owner | owner | Sessoes de foco privadas. |
| `focus_distractions` | owner | owner | owner | owner | Distracoes podem ser sensiveis. |
| `habits` | owner | owner | owner | owner | Habitos do dono. |
| `habit_logs` | owner | owner | owner | owner | Logs por habito e data. |
| `discipline_scoreboards` | owner | owner | owner | owner | Placar bruto continua privado. |
| `scoreboard_items` | owner | owner | owner | owner | Itens do placar. |
| `scoreboard_entries` | owner | owner | owner | owner | Entradas idempotentes por usuario/item/data. |
| `metacognition_sessions` | owner | owner | owner | owner | Nao compartilhar com Atalaia por padrao. |
| `action_unblock_sessions` | owner | owner | owner | owner | Desbloqueio de acao permanece privado. |
| `weekly_reviews` | owner | owner | owner | owner | Revisao semanal privada por padrao. |
| `garden_states` | owner | owner | owner | owner | Snapshot derivado. |
| `garden_events` | owner | owner | owner | owner | Eventos minimos e redigidos. |
| `energy_checkins` | owner | owner | owner | owner | Dado sensivel mobile/PWA. |

#### Accountability e compromisso

| Tabela | Leitura | Insert | Update | Delete | Observacao |
|---|---|---|---|---|---|
| `accountability_partners` | owner + invitee/partner limitado | owner | server-side | owner | Convite/aceite/revogacao precisam ficar em fluxo controlado; preview do convidado deve ser limitado. |
| `accountability_grants` | owner + partner ativo | owner | server-side | owner | Grant especifico por alvo; convidado nao pode ampliar escopo. |
| `accountability_events` | owner + partner ativo | server-side | server-side | server-side | Eventos minimos, sem payload bruto. |
| `accountability_notifications` | owner + partner ativo | server-side | server-side | server-side | Estado do provider e payload redigido. |
| `commitment_documents` | owner + partner quando compartilhado | owner | owner | owner | Compartilhamento exige revisao humana e consentimento versionado. |
| `commitment_levers` | owner | owner | owner | owner | Alavancas restaurativas apenas. |

#### Privacidade, analytics, feedback e exclusao

| Tabela | Leitura | Insert | Update | Delete | Observacao |
|---|---|---|---|---|---|
| `product_analytics_events` | owner | server-side | server-side | server-side | Opt-in, allowlist e metadata minimizada; cliente nao insere direto. |
| `beta_feedback_items` | owner | server-side | server-side | server-side | Sem indicio sensivel e sem insert direto por cliente. |
| `account_deletion_requests` | owner | owner | server-side | server-side | Confirmacao explicita e status operacional ficam no servidor. |

Notas de leitura:

- A matriz acima e o contrato que o preview precisa provar.
- Se o preview mostrar qualquer acesso de `anon` ou escrita direta de cliente onde a observacao pede `server-side`, o go/no-go falha.
- Se a migracao versionada estiver mais permissiva que esta matriz, a divergencia vira follow-up documental/SQL antes de liberar preview real.

## 7. Auth

Fluxo minimo futuro:

- email/senha primeiro.
- confirmacao de e-mail.
- recovery/update password.
- callback.
- logout.

Rotas/redirects futuros:

- `/auth/callback`
- `/auth/confirm`
- `/auth/update-password`

Regras:

- Preview real so pode ser validado em HTTPS publicado.
- `sslip.io` em HTTP continua valendo apenas como demo/local.
- `NEXT_PUBLIC_APP_URL` precisa apontar para a URL publica exata do preview aprovado.
- `next` e `redirectTo` continuam aceitando apenas caminho interno seguro.
- SMTP customizado do Supabase Auth fica para etapa futura, nao para esta.

## 8. Coolify

Quando adicionar as variaveis:

- somente depois de existir preview HTTPS publicado e branch preview Supabase pronto.
- somente em um ambiente separado do local-demo atual.

Como adicionar:

- separar runtime publicas, runtime server-only e variaveis de operador/CLI.
- manter `NEXT_PUBLIC_*` apenas com valores publicos.
- manter `SUPABASE_ACCESS_TOKEN` e `SUPABASE_PREVIEW_DB_URL` fora do runtime do app.

O que nao alterar agora:

- nao mudar o deployment atual de local-demo.
- nao trocar `APP_RUNTIME_MODE`.
- nao trocar `NEXT_PUBLIC_APP_URL`.
- nao misturar variaveis de preview com produçao.

## 9. Health e smoke

- Use `/api/health` como primeira validacao depois do PR #17.
- Use `/api/ready` como leitura de config e dependencias.
- Use `npm.cmd run test:e2e:external` quando existir URL HTTPS publicada.
- O smoke externo deve usar a origem do preview, sem path, query, hash ou credenciais.
- HTTP `sslip.io` nao prova preview real; no maximo prova demo/local.

## 10. Rollback

Sequencia futura de rollback:

1. Voltar `APP_RUNTIME_MODE=local-demo`.
2. Reverter deployment no Coolify.
3. Remover Redirect URLs temporarias do Supabase Auth.
4. Limpar fixtures ficticias do preview Supabase.
5. Se o preview ainda for data-less, recriar a branch preview em vez de insistir em reparos duvidosos.

## 11. Checklist go/no-go

| Item | Obrigatorio? | Status | Evidencia |
|---|---|---|---|
| Projeto Supabase preview criado sem dados reais | Sim | Pendente | A confirmar antes de qualquer push. |
| `NEXT_PUBLIC_SUPABASE_URL` e chave publica configurados no preview | Sim | Pendente | A confirmar no secret store do preview. |
| Migrations aplicadas em branch preview e dry-run limpo | Sim | Pendente | `supabase db push --dry-run` sem surpresa. |
| Typegen gerado e revisado | Sim | Pendente | `npm.cmd run supabase:types:preview`. |
| RLS validado com fixtures e personas ficticias | Sim | Pendente | `npm.cmd run supabase:validate:preview`. |
| Redirect URLs e Site URL configurados em HTTPS | Sim | Pendente | URL publicada aprovada. |
| `APP_RUNTIME_MODE=preview` ativado apenas apos HTTPS | Sim | Pendente | Mudanca documentada e aprovada. |
| Smoke externo passou | Sim | Pendente | `npm.cmd run test:e2e:external` em URL publicada. |
| Rollback ensaiado | Sim | Pendente | Reversao comprovada no Coolify. |
| Nenhum secret, token ou `.env` real no diff | Sim | Pendente | Scan basico antes de PR/push. |

## 12. Proximos prompts sugeridos

1. Criar projeto Supabase preview sem dados reais.
2. Aplicar migrations em preview e reconciliar historico.
3. Validar RLS com fixtures ficticias e `atalia_invited`.
4. Gerar types e revisar diff.
5. Virar `APP_RUNTIME_MODE=preview` apenas apos HTTPS publicado.
