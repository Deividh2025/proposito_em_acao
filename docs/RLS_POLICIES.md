# RLS Policies

## Fonte

Policies implementadas em `supabase/migrations/202605310002_rls_policies.sql` e storage em `supabase/migrations/202605310003_private_storage.sql`.

## Modelo por persona

| Persona | Acesso |
|---|---|
| `anon` | Sem acesso a dados privados. |
| Dono autenticado | CRUD nos registros proprios, exceto tabelas de auditoria/consentimento/eventos que sao leitura limitada. |
| Outro usuario | Sem acesso a registros de terceiros. |
| Atalaia autorizado | Le somente dados em tabelas de accountability e compromisso explicitamente compartilhado para grant ativo. |
| Atalaia revogado | Sem acesso apos `revoked_at`, status revogado ou expiracao. |
| Service role | Apenas server-side, nunca frontend. |

## Owner policies

- `profiles`: `id = auth.uid()`.
- Tabelas com `user_id`: `user_id = auth.uid()`.
- Inserts e updates usam `with check`.
- FKs compostas impedem filhos apontarem para parents de outro usuario.

## Atalaia

Funcao auxiliar: `app_private.has_active_accountability_grant(user_id, goal_id, permission)`.

No Prompt 15, a revisao final reforcou que a funcao auxiliar so pode ser usada junto de filtros row-specific quando o dado pertence a um parceiro/grant concreto. Policies de Atalaia devem restringir tambem por `accountability_partner_id`, `partner_user_id` e/ou `accountability_grant_id` conforme a tabela.

Atalaia pode ler:

- `accountability_grants` ativos.
- `accountability_events` minimos ligados ao grant ativo.
- `accountability_notifications` aprovadas, enfileiradas ou enviadas.
- `commitment_documents` quando `shared_with_atalaias = true` e permissao `commitment_document = true`.

Atalaia nao tem policy em:

- `callings`
- `metacognition_sessions`
- `weekly_reviews`
- `inbox_items`
- `calendar_blocks`
- `focus_distractions`
- `audit_events`
- `ai_run_audits`

## Storage

Buckets privados usam path `{auth.uid()}/...`. Nao ha policy publica nem policy de Atalaia direta.

## Pendencias de validacao

- Rodar migrations em Supabase local/remoto.
- Executar matriz de testes de `supabase/tests/README.md`.
- Rodar Supabase advisors/lints quando CLI estiver instalado.

## Prompt 8 - Execucao

`goals`, `projects`, `tasks` e `microtasks` permanecem owner-only por `user_id = auth.uid()` nas policies atuais. A migration do Prompt 8 nao cria policy de Atalaia nem view publica para execucao.

Checklist adicional:

- user A cria/le/atualiza/deleta seus alvos, projetos, tarefas e microtarefas.
- user B nao acessa registros de user A.
- user B nao cria filho apontando parent de user A.
- `tasks.project_id` e `tasks.goal_id` precisam pertencer ao mesmo alvo quando ambos existem.
- Atalaia nao le `goals`, `projects`, `tasks` ou `microtasks` diretamente nesta etapa.

## Prompt 9 - Calendario e Inbox/GTD

`calendar_blocks` e `inbox_items` permanecem privados por padrao e owner-only por `user_id = auth.uid()` nas policies ja preparadas. A migration do Prompt 9 apenas amplia campos, tipos e indices; nao cria policy publica, policy de Atalaia, view compartilhada ou acesso anonimo.

Checklist adicional:

- user A cria, le, atualiza, conclui, reagenda e deleta seus `calendar_blocks`.
- user B nao seleciona, atualiza ou deleta blocos de user A.
- user B nao agenda tarefa de user A em `calendar_blocks.task_id`.
- user A cria, classifica, processa, arquiva e descarta seus `inbox_items`.
- user B nao acessa captura, classificacao, observacao ou destino de user A.
- `inbox_items.destination_type` e `destination_id` continuam exigindo validacao server-side, pois sao campos polimorficos.
- Processamento autenticado de inbox deve buscar primeiro o item por `id + user_id`, validar status e usar conteudo persistido antes de criar qualquer destino.
- Atalaia nao le `calendar_blocks` nem `inbox_items` nesta etapa, mesmo quando um alvo estiver autorizado.

## Prompt 10 - Desbloqueador e Metacognicao

`action_unblock_sessions` e `metacognition_sessions` permanecem privados por padrao e owner-only por `user_id = auth.uid()`. A migration do Prompt 10 amplia campos e indices, mas nao cria acesso anonimo, view publica, policy de Atalaia ou compartilhamento externo.

Checklist adicional:

- user A cria, le, salva historico e remove suas sessoes.
- user B nao seleciona, atualiza ou remove sessoes de user A.
- user B nao vincula sessao a tarefa, projeto, alvo ou bloco de calendario de user A.
- Atalaia nao le `metacognition_sessions`, mesmo com grant ativo.
- `action_unblock_sessions` tambem nao e exposta ao Atalaia nesta etapa.
- Crise deve ser registrada apenas como flag/categoria minima, sem detalhe bruto em logs.

## Prompt 11 - Foco, Habitos e Placar

`focus_sessions`, `focus_distractions`, `habits`, `habit_logs`, `discipline_scoreboards`, `scoreboard_items` e `scoreboard_entries` permanecem owner-only por `user_id = auth.uid()`.

Checklist adicional:

- user A cria, le, atualiza, conclui e interrompe suas sessoes de foco.
- user B nao acessa sessoes, distracoes, habitos, logs, placares, itens ou entradas de user A.
- user B nao vincula `focus_session.task_id`, `calendar_block_id`, `habit.goal_id`, `habit_log.habit_id`, `scoreboard_item.scoreboard_id`, `linked_goal_id`, `linked_habit_id`, `linked_task_id`, `scoreboard_entry.scoreboard_id` ou `scoreboard_item_id` a registro de user A.
- `focus_distractions.content` nao deve ser exposto em logs, Atalaia ou views publicas.
- `scoreboard_entries` devem ser idempotentes por usuario, item e data.
- Atalaia nao tem policy direta nessas tabelas nesta etapa, mesmo com grant ativo.

## Prompt 12 - Revisao Semanal e Jardim

`weekly_reviews`, `garden_states` e `garden_events` permanecem owner-only por `user_id = auth.uid()`. A migration do Prompt 12 reforca RLS e FKs compostas para manter revisao, snapshot e evento dentro do mesmo usuario.

Checklist adicional:

- user A cria, le, atualiza e remove suas revisoes semanais.
- user B nao acessa revisoes, estados de Jardim ou eventos de user A.
- anonimo nao acessa revisoes nem Jardim.
- user B nao cria `garden_state` ou `garden_event` apontando para `weekly_review` de user A.
- `garden_events.metadata_minimal` nao contem prompt, resposta bruta, Metacognicao bruta ou nota privada.
- Atalaia nao tem policy direta em `weekly_reviews`, `garden_states` ou `garden_events` nesta etapa.
- Qualquer resumo futuro para Atalaia exigira alvo, consentimento granular, previa e projecao sanitizada.

## Prompt 13 - Atalaia e Compromisso

Atalaia passa de placeholder para fluxo funcional local/dev com persistencia preparada. O modelo RLS permanece:

- Dono gerencia `accountability_partners`, `accountability_grants`, `accountability_events`, `accountability_notifications`, `commitment_documents` e `commitment_levers`.
- Atalaia autenticado so le grants/eventos/notificacoes/documentos que passem por grant ativo e pelo parceiro/grant especifico da propria linha.
- Revogacao exige `status = 'revoked'`, `revoked_at` preenchido e cancelamento de notificacoes pendentes.
- `accountability_notifications.preview_payload` nao deve conter corpo bruto; a migration Prompt 13 adiciona constraint contra chaves sensiveis.
- `commitment_documents` compartilhado exige `status = 'active'`, `reviewed_at`, `shared_at`, `consent_version` e permissao `commitment_document`.

Sem Supabase CLI/MCP disponivel, as policies permanecem versionadas mas nao foram aplicadas/testadas localmente nesta sessao.

## Prompt 14 - PWA/Mobile

`energy_checkins` deve permanecer owner-only:

- user A cria, le, atualiza e remove seus check-ins de energia.
- user B nao acessa check-ins de user A.
- anonimo nao acessa `energy_checkins`.
- Atalaia nao tem policy direta em `energy_checkins`, mesmo com grant ativo.

As acoes mobile que reutilizam Inbox, Habitos, Placar, Foco, Desbloqueador e Metacognicao herdam as policies owner-only desses modulos. Service worker e cache nao substituem RLS nem armazenam dados sensiveis.

Status remoto: a migration `mobile_pwa_prompt14_alignment` foi aplicada em 2026-06-02 no Supabase `proposito_em_acao`. A validacao automatizada completa de RLS por usuario ainda depende de CLI/testes com usuarios de prova.

## Prompt 15 - QA final RLS

- Regressao estatica adicionada em `src/tests/unit/rls-policy-safety.test.ts`.
- Policies locais de `accountability_grants` e `accountability_events` foram corrigidas para exigir grant/parceiro especifico.
- Projeto Supabase remoto `bceumcfmjftoukzrfthe` foi encontrado ativo e advisors de seguranca nao retornaram lints.
- Migrations remotas listadas nao cobrem todo o conjunto local da V1; validacao RLS dinamica segue pendente antes de producao.
