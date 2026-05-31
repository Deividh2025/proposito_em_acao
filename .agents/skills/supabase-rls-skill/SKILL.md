---
name: supabase-rls-skill
description: Padronizar criacao, revisao e testes de RLS em todas as tabelas do Proposito em Acao.
---

# Supabase RLS Skill

## Quando usar

Use em qualquer criacao, alteracao ou revisao de tabela, view, policy, storage policy, grant, funcao de autorizacao ou matriz de acesso Supabase.

## Quando nao usar

Nao use para decisoes puramente visuais, textos sem impacto em dados, ou para substituir revisao de seguranca quando houver Atalaia, Metacognicao, Chamado ou dados sensiveis.

## Instrucoes praticas

1. Toda tabela em schema exposto deve ter RLS habilitado e policy explicita.
2. Dados do dono usam `user_id = auth.uid()` ou chave equivalente segura.
3. Inserts e updates devem usar `with check`; updates tambem precisam de policy de select compativel.
4. Tabelas filhas devem impedir parent de outro usuario por FK composta ou validacao server-side.
5. Atalaia nunca recebe policy ampla em tabelas sensiveis.
6. Revogacao deve aparecer em toda policy de Atalaia: `revoked_at is null` e `status = 'active'`.
7. Views expostas devem usar `security_invoker = true` quando forem usadas.
8. Funcoes `security definer` devem ficar fora de schema exposto e ter `search_path` fixo.

## Arquivos relacionados

- `supabase/migrations/`
- `supabase/policies/`
- `supabase/tests/`
- `docs/RLS_POLICIES.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/SECURITY_PRIVACY.md`

## Formato de saida esperado

Retorne tabelas revisadas, policies criadas, matriz de acesso, riscos, testes executados, falhas encontradas e pendencias antes de merge.
