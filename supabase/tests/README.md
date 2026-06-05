# Supabase RLS Test Scenarios

Estes cenarios devem ser executados quando houver Supabase CLI, branch preview ou ambiente local com Auth.

O roteiro operacional completo esta em `docs/SUPABASE_PREVIEW_CUTOVER.md`.

## Personas

- `anon`: nao autenticado.
- `user_a`: dono de goal, task, metacognition e consent.
- `user_b`: outro usuario.
- `atalia_authorized` / `atalia_active`: parceiro autenticado com grant ativo para um `goal_id` de `user_a`.
- `atalia_invited`: parceiro autenticado ou link convidado durante a transicao `invited -> active`, sem permissao para alterar escopo definido pelo dono.
- `atalia_revoked`: parceiro com grant revogado ou expirado.

## Casos minimos

1. `user_a` seleciona, insere, atualiza e deleta registros proprios nas tabelas de produto.
2. `user_b` nao le, nao atualiza e nao deleta registros de `user_a`.
3. `user_a` nao consegue criar filho com parent de `user_b`.
4. `anon` nao acessa dados privados.
5. `atalia_authorized` le apenas `accountability_grants`, `accountability_events`, `accountability_notifications` aprovadas e `commitment_documents` compartilhados para o alvo autorizado.
6. `atalia_authorized` nao le `metacognition_sessions`, `callings`, `weekly_reviews`, `inbox_items`, calendario completo ou distracoes.
7. `atalia_revoked` nao le dados depois de `revoked_at`.
8. Storage permite apenas objetos em `{auth.uid()}/...`.
9. Links/arquivos para Atalaia devem ser gerados por servidor e grant explicito, nao por policy publica.

## Prompt 8 - Execucao

10. `user_a` cria e atualiza `goals`, `projects`, `tasks` e `microtasks` proprios.
11. `user_b` nao seleciona, atualiza ou deleta registros de execucao de `user_a`.
12. `user_b` nao cria `project` com `goal_id` de `user_a`.
13. `user_b` nao cria `task` com `project_id` ou `goal_id` de `user_a`.
14. `user_b` nao cria `microtask` com `task_id` de `user_a`.
15. `task.project_id` e `task.goal_id` divergentes sao bloqueados quando ambos existem.
16. Atalaia nao acessa `goals`, `projects`, `tasks` ou `microtasks` diretamente nesta etapa.

## Prompt 9 - Calendario e Inbox/GTD

17. `user_a` cria, atualiza, conclui, reagenda e deleta seus `calendar_blocks`.
18. `user_b` nao seleciona, atualiza ou deleta `calendar_blocks` de `user_a`.
19. `user_b` nao cria `calendar_block` apontando `task_id` de `user_a`.
20. `user_a` cria, classifica, processa, arquiva e descarta seus `inbox_items`.
21. `user_b` nao seleciona, atualiza ou deleta `inbox_items` de `user_a`.
22. Atalaia nao acessa `calendar_blocks` nem `inbox_items`, mesmo com grant ativo em alvo relacionado.
23. Campos polimorficos de destino da inbox sao validados no servidor antes de criar tarefa, projeto ou bloco.

## Prompt 10 - Desbloqueador e Metacognicao

24. `user_a` cria, le e remove suas `action_unblock_sessions`.
25. `user_b` nao seleciona, atualiza ou remove `action_unblock_sessions` de `user_a`.
26. `user_b` nao cria sessao apontando tarefa, projeto, alvo ou bloco de calendario de `user_a`.
27. `user_a` cria, le e remove suas `metacognition_sessions`.
28. `user_b` nao seleciona, atualiza ou remove `metacognition_sessions` de `user_a`.
29. Atalaia nao acessa `metacognition_sessions`, mesmo com grant ativo.
30. Atalaia nao acessa `action_unblock_sessions` nesta etapa.
31. Flags de crise sao registradas sem detalhe bruto em logs.

## Prompt 11 - Foco, Habitos e Placar

32. `user_a` cria, le, conclui e interrompe suas `focus_sessions`.
33. `user_b` nao seleciona, atualiza ou remove `focus_sessions` de `user_a`.
34. `user_b` nao cria `focus_session` apontando `task_id`, `calendar_block_id` ou `action_unblock_session_id` de `user_a`.
35. `user_a` cria e roteia suas `focus_distractions`.
36. `user_b` nao seleciona, atualiza ou remove `focus_distractions` de `user_a`.
37. Atalaia nao acessa `focus_sessions` nem `focus_distractions` nesta etapa.
38. `user_a` cria, atualiza e pausa seus `habits`; `user_b` nao acessa.
39. `user_b` nao cria `habit` apontando `goal_id` de `user_a`.
40. `user_a` cria/atualiza `habit_logs`; `user_b` nao acessa nem aponta `habit_id` de `user_a`.
41. `user_a` cria `discipline_scoreboards`, `scoreboard_items` e `scoreboard_entries`.
42. `user_b` nao acessa Placar, itens ou entradas de `user_a`.
43. `user_b` nao cria item/entrada apontando Placar, habito, tarefa ou alvo de `user_a`.
44. `scoreboard_entries` nao duplica item/data para o mesmo usuario.
45. Atalaia nao acessa Placar bruto nesta etapa, mesmo com grant ativo.

## Prompt 15 - regressao Atalaia/RLS

46. Dois Atalaias diferentes no mesmo alvo nao leem grants, eventos ou notificacoes um do outro.
47. `atalia_authorized` so le `accountability_events` quando `accountability_grant_id` e `accountability_partner_id` pertencem ao proprio grant ativo.
48. `atalia_authorized` nao le notificacao se `accountability_grant_id` divergir, mesmo com permissao no mesmo alvo.
49. Revogacao de grant corta leitura futura e cancela notificacoes pendentes.
50. Metacognicao, Chamado e Revisao Semanal continuam sem policy de Atalaia mesmo depois das correcoes do Prompt 15.
51. `atalia_invited` nao consegue alterar `permissions`, `goal_id`, `accountability_partner_id`, `user_id`, `consent_version` ou qualquer campo de escopo durante aceite.
52. Aceite ativa apenas o grant associado ao convite especifico, nao todos os grants convidados do parceiro.
53. `atalia_invited` le somente a propria relacao pendente por e-mail autenticado, nao o grant completo antes do aceite.
54. `atalia_invited` nao consegue alterar `tracking_level`, `notification_frequency` ou `expires_at`.
55. Revogacao dinamica corta leitura futura de partner, grant, evento, notificacao e documento compartilhado.

## Etapa 7 - privacidade, analytics e feedback

56. `user_a` cria/le suas `user_preferences`; `user_b` nao le nem altera.
57. `user_a` le historico proprio de `consent_records`; `user_b`, anonimo e Atalaia nao leem.
58. `product_analytics_events` nao aceita insert direto por cliente anonimo/autenticado; fixture e persistencia real usam caminho server-side/admin apos action preparar evento/minimetadata allowlisted.
59. Ausencia ou revogacao de `product_analytics_v1` bloqueia persistencia antes do banco/admin.
60. `user_b`, anonimo e Atalaia nao leem `product_analytics_events` de `user_a`.
61. `beta_feedback_items` nao aceita insert direto por cliente anonimo/autenticado; fixture e persistencia real usam caminho server-side/admin apos aviso/consentimento `beta_feedback_v1`; indicio sensivel bloqueia antes do insert.
62. `user_b`, anonimo e Atalaia nao leem `beta_feedback_items` de `user_a`.
63. `account_deletion_requests` exige dono autenticado e confirmacao explicita; cliente nao atualiza status operacional/admin.
64. Exportacao autenticada retorna somente dados do dono e remove secrets, tokens, hashes, logs internos, stack traces e registros de terceiros.
65. Prune de retencao remove apenas `product_analytics_events`, `beta_feedback_items` e `ai_run_audits` expirados.

## Comandos esperados quando CLI existir

```powershell
npx.cmd -y supabase --version
npx.cmd -y supabase migration list --db-url "$env:SUPABASE_PREVIEW_DB_URL"
npx.cmd -y supabase db push --dry-run --db-url "$env:SUPABASE_PREVIEW_DB_URL"
npx.cmd -y supabase db lint --db-url "$env:SUPABASE_PREVIEW_DB_URL"
```

## Harness dinamico de preview

Depois de aplicar as migrations em branch preview e configurar as variaveis operacionais:

```powershell
$env:SUPABASE_PREVIEW_CONFIRM="preview"
$env:NEXT_PUBLIC_SUPABASE_URL="https://SEU-PREVIEW.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-ou-publishable-key"
$env:SUPABASE_SERVICE_ROLE_KEY="service-role-do-preview"
npm.cmd run supabase:validate:preview
```

O harness cria usuarios ficticios `user-a`, `user-b`, `atalia_invited`, `atalia_active` e `atalia_revoked`, valida Auth com anon key, testa isolamento RLS nas tabelas criticas, valida Atalaia convidado/ativo/revogado e remove fixtures ao final. Use `SUPABASE_PREVIEW_KEEP_FIXTURES=1` apenas para depuracao manual em branch sem dados reais.

Desde a Etapa 2, o harness tambem tenta escalar `permissions`, `goal_id`, `user_id`, `tracking_level`, `notification_frequency` e `expires_at`, valida aceite de grant especifico por token hash e confirma que revogacao corta leituras futuras.

Na Etapa 7, o harness local foi ampliado para cobrir isolamento de `product_analytics_events`, `beta_feedback_items` e `account_deletion_requests` entre user A/user B/anon/Atalaia. A migration de hardening `20260605130314_analytics_feedback_server_only_persistence.sql` muda analytics/feedback para persistencia server-only/admin; o harness deve criar essas fixtures via admin e provar que `user_a.client` tambem nao consegue inserir diretamente. Exportacao redigida, ausencia/revogacao de consentimento e retencao de 90 dias tambem ficam cobertas por testes de dominio locais; a validacao remota ainda exige aplicar a migration em preview aprovado.

## Estado local verificado em 2026-06-03

O CLI `supabase` esta disponivel neste terminal (`2.98.2`) e `npx.cmd -y supabase --version` retorna versao mais nova. A Etapa 2 expandiu o harness, mas nenhuma migration/harness remoto foi executado contra Supabase preview nesta etapa. A evidencia de preview/RLS continua historica ate rerun fresco antes do beta real.
