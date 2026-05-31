# Supabase RLS Test Scenarios

Estes cenarios devem ser executados quando houver Supabase CLI, projeto vinculado ou ambiente local com Auth.

## Personas

- `anon`: nao autenticado.
- `user_a`: dono de goal, task, metacognition e consent.
- `user_b`: outro usuario.
- `atalia_authorized`: parceiro autenticado com grant ativo para um `goal_id` de `user_a`.
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

## Comandos esperados quando CLI existir

```powershell
supabase start
supabase db reset
supabase migration list --local
supabase db lint
```

## Estado atual

O CLI `supabase` nao esta instalado neste ambiente, entao estes cenarios ficam como checklist manual ate a ferramenta estar disponivel.
