# RLS Live Evidence

Data: 2026-06-15. Projeto Supabase: `proposito_em_acao` (`bceumcfmjftoukzrfthe`, sa-east-1, Postgres 17).

## Contexto

Cutover do schema completo aplicado em producao via pipeline do proprio repo:

```
supabase migration repair --status reverted 20260602134002   # remove entrada fantasma da prompt14
supabase migration repair --status applied  202606010011     # prompt14 (energy_checkins) ja estava aplicada
supabase db push --include-all                                # aplica as 16 migrations restantes
```

Resultado do `db push`: "Finished supabase db push" sem erros. Todos os `NOTICE ... skipping` foram as guardas idempotentes das proprias migrations (drop-if-exists / create-if-not-exists), comportamento esperado. O banco saiu de 1 tabela (`energy_checkins`) para o schema completo.

Evidencia coletada ao vivo logo apos o push, via Management API (HTTPS), consultando `pg_class` / `pg_policies` e os advisors do Supabase.

## Cobertura de RLS (38/38 tabelas)

Todas as tabelas de `public` com `rls_on = true` E `rls_forced = true` (RLS forcado: nem o dono da tabela ignora as policies). Toda tabela tem ao menos a policy de dono.

| Tabela | RLS | Forced | Policies |
| --- | --- | --- | --- |
| account_deletion_requests | sim | sim | 2 |
| accountability_events | sim | sim | 2 |
| accountability_grants | sim | sim | 4 |
| accountability_notifications | sim | sim | 4 |
| accountability_partners | sim | sim | 5 |
| action_unblock_sessions | sim | sim | 4 |
| ai_run_audits | sim | sim | 1 |
| audit_events | sim | sim | 1 |
| beta_feedback_items | sim | sim | 1 |
| calendar_blocks | sim | sim | 4 |
| calling_session_entries | sim | sim | 4 |
| callings | sim | sim | 4 |
| commitment_documents | sim | sim | 5 |
| commitment_levers | sim | sim | 4 |
| consent_records | sim | sim | 1 |
| discipline_scoreboards | sim | sim | 4 |
| energy_checkins | sim | sim | 4 |
| focus_distractions | sim | sim | 4 |
| focus_sessions | sim | sim | 4 |
| garden_events | sim | sim | 4 |
| garden_states | sim | sim | 4 |
| goals | sim | sim | 4 |
| habit_logs | sim | sim | 4 |
| habits | sim | sim | 4 |
| inbox_items | sim | sim | 4 |
| life_areas | sim | sim | 4 |
| life_map_area_scores | sim | sim | 4 |
| life_map_assessments | sim | sim | 4 |
| metacognition_sessions | sim | sim | 4 |
| microtasks | sim | sim | 4 |
| product_analytics_events | sim | sim | 1 |
| profiles | sim | sim | 3 |
| projects | sim | sim | 4 |
| scoreboard_entries | sim | sim | 4 |
| scoreboard_items | sim | sim | 4 |
| tasks | sim | sim | 4 |
| user_preferences | sim | sim | 4 |
| weekly_reviews | sim | sim | 4 |

Total: 38 tabelas, 134 policies. As tabelas com 1 policy (`ai_run_audits`, `audit_events`, `beta_feedback_items`, `consent_records`, `product_analytics_events`) expoem so leitura do dono; a escrita vai por caminho server-only (service role / funcoes SECURITY DEFINER), conforme as migrations de persistencia server-only. `profiles` tem 3 (sem delete direto; exclusao via `account_deletion_requests`).

Query usada:
```sql
select c.relname, c.relrowsecurity, c.relforcerowsecurity,
       (select count(*) from pg_policies p where p.schemaname='public' and p.tablename=c.relname)
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r' order by c.relname;
```

## Advisors de seguranca

Zero lints. Nenhum alerta de seguranca com o schema completo aplicado.

## Advisors de performance (nenhum bloqueador)

- `unused_index` (INFO, varios): muitos indices marcados como nunca usados. **Falso-positivo esperado**: o banco tem 0 linhas e nenhuma query rodou ainda. Reavaliar depois que houver trafego real.
- `unindexed_foreign_keys` (INFO, varios): FKs compostas (em geral `(*_id, user_id)`) sem indice de cobertura. Comum; impacta apenas em escala. Avaliar indices conforme os padroes de query reais aparecerem.
- `multiple_permissive_policies` (WARN, 5 tabelas): `accountability_events`, `accountability_grants`, `accountability_notifications`, `accountability_partners`, `commitment_documents` tem mais de uma policy permissiva de SELECT para `authenticated`. **Por design** (dono + parceiro com acesso ativo). Custo de performance marginal; funcionalmente correto.
- `auth_rls_initplan` (WARN, 1): a policy `accountability_partners_invitee_select_pending` reavalia `auth.<func>()` por linha. Otimizacao simples: trocar por `(select auth.<func>())`. Candidato a uma micro-migration.
- `auth_db_connections_absolute` (INFO, 1): Auth configurado com 10 conexoes absolutas; trocar para alocacao percentual ao escalar o instance. Ajuste de producao, nao urgente.

## Conclusao

Backend persistido aplicado em producao, com RLS habilitado e forcado em todas as 38 tabelas, 134 policies, e zero alertas de seguranca. O gargalo central da avaliacao (banco vazio na nuvem) esta resolvido. As pendencias de performance sao menores e/ou esperadas em banco vazio; nenhuma bloqueia beta.

## Pendencias opcionais (micro-migrations futuras, via db push)

1. Envolver `auth.<func>()` em `(select ...)` na policy `accountability_partners_invitee_select_pending` (e revisar padrao nas demais).
2. Avaliar indices de cobertura para as FKs compostas mais consultadas, quando os padroes de query reais existirem.
3. Consolidar policies permissivas multiplas de SELECT nas tabelas de accountability, se a performance pedir em escala.
