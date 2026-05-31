---
name: domain-model-skill
description: Use when defining or reviewing entities, relationships, states, permissions, naming, data dependencies, database drafts, or Supabase preparation for the Proposito em Acao domain.
---

# Domain Model Skill

## Quando usar

Use ao criar ou alterar modelo de dominio, schema conceitual, entidades, relacoes, estados, eventos, permissoes, nomes de campos, dependencias entre modulos, drafts de banco ou preparacao futura de Supabase/RLS.

## Quando nao usar

Nao use para criar migrations reais, escolher stack definitiva, alterar banco em producao, configurar Supabase ou improvisar entidade fora do PRD sem decisao aprovada.

## Instrucoes praticas

1. Preserve Chamado como eixo: `Calling -> Goal -> Project -> Task -> CalendarBlock`.
2. Modele Atalaia por alvo e concessao granular, nunca por conta inteira.
3. Modele Metacognicao como privada por padrao e transversal a tarefa, projeto, alvo, foco e revisao.
4. Prefira nomes estaveis, campos auditaveis e estados explicitos.
5. Para futuras politicas RLS, inclua `user_id` em tabelas filhas quando isso simplificar autorizacao.
6. Evite JSON generico quando integridade referencial for importante; se usar JSON no draft, registre validacao server-side futura.
7. Separe fonte primaria de dados de snapshots derivados, como Jardim da Vida.

## Arquivos relacionados

- `docs/DOMAIN_MODEL.md`
- `docs/DATABASE_SCHEMA_DRAFT.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/source/prd_proposito_em_acao.md`

## Formato de saida esperado

Retorne entidades afetadas, relacoes, campos principais, estados, eventos, permissoes, riscos de modelagem, impacto em RLS futuro e pendencias de arquitetura.
