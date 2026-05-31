# Supabase Policies

As policies oficiais da etapa estao versionadas em:

- `supabase/migrations/202605310002_rls_policies.sql`
- `supabase/migrations/202605310003_private_storage.sql`

## Modelo

- Dono autenticado acessa registros por `user_id = auth.uid()`.
- `profiles` usa `id = auth.uid()`.
- `consent_records`, `audit_events`, `ai_run_audits` e `accountability_events` sao leitura limitada para o dono; escrita deve ser server-side.
- Atalaia autenticado le apenas tabelas de accountability e documentos de compromisso explicitamente compartilhados, mediados por grant ativo.
- Nao ha policy de Atalaia para `callings`, `metacognition_sessions`, `weekly_reviews`, `inbox_items`, `calendar_blocks`, `focus_distractions` ou logs brutos.

## Revisao obrigatoria

Antes de aplicar em producao, revisar:

- RLS habilitado em toda tabela do `public`.
- `with check` em inserts/updates.
- Revogacao de Atalaia em toda checagem.
- Storage privado e objetos por pasta `{user_id}/...`.
- Ausencia de `service_role` no client.
