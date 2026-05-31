---
name: rls-testing-skill
description: Padronizar testes de seguranca, isolamento por usuario e acesso limitado em RLS do Proposito em Acao.
---

# RLS Testing Skill

## Quando usar

Use ao criar ou revisar migrations, policies, storage policies, Auth, grants, consentimentos, ou qualquer mudanca que possa expor dados.

## Quando nao usar

Nao use como substituto para testes de UX, unidade ou E2E comuns quando a mudanca nao toca dados/autorizacao.

## Instrucoes praticas

1. Testar `anon`, `user_a`, `user_b`, `atalia_authorized`, `atalia_revoked` e service role apenas para setup.
2. Verificar select, insert, update e delete separadamente.
3. Confirmar que user A nao le nem altera user B.
4. Confirmar que user A nao cria filho apontando parent de user B.
5. Confirmar que Atalaia sem grant, com grant revogado ou com permissao ausente nao acessa.
6. Confirmar que Metacognicao nao aparece em nenhuma rota/view/policy de Atalaia.
7. Confirmar que storage privado exige pasta do usuario e signed URL server-side quando necessario.
8. Registrar testes nao automatizados em `supabase/tests/README.md`.

## Arquivos relacionados

- `supabase/tests/`
- `supabase/migrations/`
- `docs/RLS_POLICIES.md`
- `docs/TESTING_STRATEGY.md`
- `docs/ACCEPTANCE_CRITERIA.md`

## Formato de saida esperado

Retorne matriz de casos, comandos, resultados, falhas, evidencias e itens que permanecem manuais.
