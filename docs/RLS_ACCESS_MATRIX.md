# RLS Access Matrix

Data de sincronizacao: 2026-06-03.

| Recurso | Dono | Outro usuario | Anon | Atalaia convidado | Atalaia autorizado | Atalaia revogado |
|---|---|---|---|---|---|---|
| `profiles` | Select/insert/update proprio | Negado | Negado | Negado | Negado | Negado |
| Tabelas de produto com `user_id` | CRUD proprio | Negado | Negado | Negado | Negado | Negado |
| `callings` | CRUD proprio | Negado | Negado | Negado | Negado | Negado |
| `metacognition_sessions` | CRUD proprio | Negado | Negado | Negado | Negado | Negado |
| `weekly_reviews` | CRUD proprio | Negado | Negado | Negado | Negado | Negado |
| `inbox_items` | CRUD proprio | Negado | Negado | Negado | Negado | Negado |
| `calendar_blocks` | CRUD proprio | Negado | Negado | Negado | Negado | Negado |
| `consent_records` | Select proprio | Negado | Negado | Negado | Negado | Negado |
| `accountability_partners` | Select/insert/update proprio | Negado | Negado | Aceite restrito do convite especifico | Select da propria relacao ativa aceita | Negado |
| `accountability_grants` | Select/insert/update proprio | Negado | Negado | Update apenas para aceitar grant do convite, sem alterar escopo | Select grant ativo proprio como parceiro | Negado |
| `accountability_events` | Select proprio | Negado | Negado | Negado | Select eventos minimos do grant ativo | Negado |
| `accountability_notifications` | Select/insert/update proprio | Negado | Negado | Negado | Select notificacoes aprovadas/enviadas do grant ativo | Negado |
| `commitment_documents` | CRUD proprio | Negado | Negado | Negado | Select se compartilhado e permissionado | Negado |
| `audit_events` | Select proprio | Negado | Negado | Negado | Negado | Negado |
| `ai_run_audits` | Select proprio | Negado | Negado | Negado | Negado | Negado |
| Storage privado | Objetos em `{auth.uid()}/...` | Negado | Negado | Sem policy direta | Sem policy direta | Sem policy direta |

## Observacoes

- Escritas sensiveis de consentimento, auditoria e eventos devem ocorrer server-side e checar erro/linha afetada.
- Atalaia nao acessa base tables sensiveis diretamente; `accountability_partners` expoe apenas a propria relacao ativa aceita para viabilizar grants/eventos especificos.
- Revogacao depende de `status`, `revoked_at` e `expires_at`.
- Aceite de convite precisa preservar o escopo revisado pelo dono. `permissions`, `goal_id`, `user_id`, `accountability_partner_id`, `consent_version` e campos equivalentes nao podem ser alterados pelo convidado.
- A matriz de 2026-06-02 foi historica em preview; repetir antes de beta real.
