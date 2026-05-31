# RLS Access Matrix

| Recurso | Dono | Outro usuario | Anon | Atalaia autorizado | Atalaia revogado |
|---|---|---|---|---|---|
| `profiles` | Select/insert/update proprio | Negado | Negado | Negado | Negado |
| Tabelas de produto com `user_id` | CRUD proprio | Negado | Negado | Negado | Negado |
| `callings` | CRUD proprio | Negado | Negado | Negado | Negado |
| `metacognition_sessions` | CRUD proprio | Negado | Negado | Negado | Negado |
| `weekly_reviews` | CRUD proprio | Negado | Negado | Negado | Negado |
| `inbox_items` | CRUD proprio | Negado | Negado | Negado | Negado |
| `calendar_blocks` | CRUD proprio | Negado | Negado | Negado | Negado |
| `consent_records` | Select proprio | Negado | Negado | Negado | Negado |
| `accountability_partners` | Select/insert/update proprio | Negado | Negado | Negado | Negado |
| `accountability_grants` | Select/insert/update proprio | Negado | Negado | Select grant ativo proprio como parceiro | Negado |
| `accountability_events` | Select proprio | Negado | Negado | Select eventos minimos do grant ativo | Negado |
| `accountability_notifications` | Select/insert/update proprio | Negado | Negado | Select notificacoes aprovadas/enviadas do grant ativo | Negado |
| `commitment_documents` | CRUD proprio | Negado | Negado | Select se compartilhado e permissionado | Negado |
| `audit_events` | Select proprio | Negado | Negado | Negado | Negado |
| `ai_run_audits` | Select proprio | Negado | Negado | Negado | Negado |
| Storage privado | Objetos em `{auth.uid()}/...` | Negado | Negado | Sem policy direta | Sem policy direta |

## Observacoes

- Escritas sensiveis de consentimento, auditoria e eventos devem ocorrer server-side.
- Atalaia nao acessa base tables sensiveis diretamente.
- Revogacao depende de `status`, `revoked_at` e `expires_at`.
