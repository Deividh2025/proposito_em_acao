---
name: execution-domain-skill
description: Padronizar integracao entre Chamado, Alvos, Projetos, Tarefas e execucao.
---

# Execution Domain Skill

## Quando usar

Use ao criar, revisar ou alterar o fluxo `Chamado -> Alvos SMART-E -> Projetos -> Tarefas -> Microtarefas -> Proxima acao`.

## Regras

1. Chamado vem antes de agenda e filtra alvos.
2. Alvo gera projeto; projeto gera tarefa; tarefa grande gera microtarefas.
3. Toda camada deve preservar `user_id` para RLS e isolamento por usuario.
4. Proxima acao e conceito central, nao detalhe visual.
5. Dados sensiveis de Chamado, ecologia, Mapa da Vida e rotina ficam privados por padrao.
6. Atalaia so entra futuramente por alvo, permissao granular, previa e revogacao.
7. OpenAI real so pode ser acionada server-side apos autorizacao/configuracao; mock seguro e valido para desenvolvimento.
8. Calendario, inbox, habitos, Placar, Desbloqueador, Metacognicao e Atalaia funcionais ficam fora do Prompt 8.

## Arquivos relacionados

- `src/domain/execution/`
- `src/app/goals/`
- `src/app/projects/`
- `src/app/tasks/`
- `supabase/migrations/`
- `docs/EXECUTION_DOMAIN.md`

## Saida esperada

Retorne fluxo completo, limites de escopo, dados/tabelas, policies, IA/mock, UI, testes, docs e riscos.
