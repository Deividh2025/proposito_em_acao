# Focus Mode Module

## Objetivo

Modo Foco ajuda o usuario a executar uma tarefa com ambiente limpo, tempo definido, captura de distracoes e rota segura de retomada.

## Fluxo V1

1. Usuario escolhe tarefa, proximo passo, motivo e duracao.
2. Duracoes padrao: 5, 15, 25, 50 minutos e personalizado.
3. Timer mostra tempo restante, tarefa atual e proximo passo.
4. Usuario captura distracao sem sair do foco.
5. Usuario pausa, retoma, conclui ou encerra sem culpa.
6. Conclusao registra sessao, nota opcional, energia pos-foco e tarefa/bloco quando aplicavel.

## Captura de distracoes

Tipos: pensamento, ideia, lembrete, tarefa paralela, preocupacao, link e nota. Conteudo e curto, privado por padrao e pode ir para Inbox somente por escolha explicita.

## Integracoes

- Tarefas: `task_id` opcional, status `in_focus` ao iniciar e `completed` se usuario marcar.
- Calendario: `calendar_block_id` preparado por migration.
- Desbloqueador: `action_unblock_session_id` preparado para foco recomendado.
- Metacognicao: rota manual quando o bloqueio for interno.
- Placar: conclusao de foco prepara marcacao futura, mas nao cria Atalaia.

## Dados e privacidade

`focus_sessions` e `focus_distractions` permanecem owner-only por RLS. Distracoes podem conter conteudo intimo e nao devem ir para logs, Atalaia ou analytics.

## Fora de escopo

Mobile/PWA completo, integracoes externas de calendario, bloqueio real de apps/sites, som ambiente, ranking, Atalaia e OpenAI real acionada pela UI.
