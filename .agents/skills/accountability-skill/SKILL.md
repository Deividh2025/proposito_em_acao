---
name: accountability-skill
description: Padronizar o modulo Atalaia, convites, grants, previa, aceite e revogacao no Proposito em Acao.
---

# Accountability Skill

## Quando usar

Use ao criar, revisar ou alterar telas, dominio, server actions, policies, docs ou testes do Atalaia.

## Instrucoes praticas

1. Atalaia sempre acompanha um `goal_id`, nunca a conta inteira.
2. Convite deve ter pessoa, e-mail, nivel, frequencia, permissoes, previa e versao de consentimento.
3. O usuario revisa a previa antes de registrar ou enviar qualquer comunicacao.
4. Aceite do Atalaia nao amplia escopo; apenas ativa o grant existente.
5. Revogacao deve cortar leitura futura e cancelar notificacoes pendentes.
6. Painel do Atalaia mostra somente dados autorizados e sanitizados.
7. Metacognicao, Chamado completo, revisoes privadas, inbox bruto, calendario completo e categorias sensiveis ficam excluidos por padrao.
8. Sem Auth/Supabase, use fallback local/dev explicito.

## Arquivos relacionados

- `src/app/accountability/`
- `src/components/accountability/`
- `src/domain/accountability/`
- `docs/ACCOUNTABILITY_MODULE.md`
- `docs/RLS_POLICIES.md`
- `supabase/migrations/`

## Saida esperada

Retorne escopo do grant, campos permitidos, dados proibidos, previa, revogacao, testes e riscos pendentes.
