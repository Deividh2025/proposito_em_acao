---
name: focus-mode-skill
description: Padronizar Modo Foco, temporizadores, distracoes, pausa, conclusao e integracao com tarefas/calendario no Proposito em Acao.
---

# Focus Mode Skill

## Quando usar

Use ao criar, revisar ou alterar tela de foco, timer, sessao Pomodoro, pausa, conclusao, captura de distracao ou integracao com tarefas, calendario, Desbloqueador, Metacognicao, Habitos e Placar.

## Instrucoes praticas

1. Tela ativa deve mostrar somente tarefa, proxima acao, motivo, tempo restante, captura de distracao, pausa, concluir e rotas de apoio.
2. Tempos padrao: 5, 15, 25, 50 e personalizado.
3. Baixa energia prioriza 5 ou 15 minutos e uma acao minima.
4. Timer deve calcular tempo por timestamp, nao depender apenas de decremento visual.
5. Distracoes devem ser capturadas sem navegar para fora da sessao.
6. Ao concluir, registrar sessao, energia opcional, tarefa/bloco se aplicavel e entrada futura de Placar quando houver vinculo.
7. Se travar, oferecer Desbloqueador para bloqueio operacional e Metacognicao para bloqueio interno.
8. Sem Atalaia, sem logs de conteudo sensivel e sem service role no frontend.

## Arquivos relacionados

- `src/app/focus/`
- `src/components/focus/`
- `src/domain/focus/`
- `supabase/migrations/`
- `docs/FOCUS_MODE_MODULE.md`

## Saida esperada

Retorne fluxos afetados, dados persistidos, riscos de distracao/sobrecarga, validacao RLS, testes e docs atualizadas.
