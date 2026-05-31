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
