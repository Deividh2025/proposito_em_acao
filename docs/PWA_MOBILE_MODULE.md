# PWA Mobile Module

## Escopo Prompt 14

O PWA/mobile do Proposito em Acao e complementar ao desktop. Ele serve para acoes rapidas de baixo atrito:

- capturar entrada para Inbox;
- marcar habito;
- marcar Placar;
- iniciar foco curto;
- usar Desbloqueador rapido;
- usar Metacognicao rapida;
- registrar energia;
- acessar atalhos de hoje.

O fluxo esperado e abrir, tocar, registrar e fechar. O mobile nao replica dashboard completo, calendario complexo, edicao profunda de projetos, Atalaia funcional ou revisoes longas.

## Rotas

- `/mobile`: hub PWA e `start_url`.
- `/mobile/capture`: captura rapida para Inbox.
- `/mobile/habits`: marcacao rapida de habito.
- `/mobile/scoreboard`: marcacao rapida do Placar.
- `/mobile/focus`: foco curto de 5 ou 15 minutos.
- `/mobile/unblock`: Desbloqueador rapido com mock seguro.
- `/mobile/metacognition`: Metacognicao rapida com schema existente.
- `/mobile/energy`: check-in simples de energia.
- `/mobile/today`: atalhos do momento.

## PWA

`public/manifest.json` define nome, short name, cores, display standalone, escopo e start URL `/mobile`. Os icones em `public/icons/` foram substituidos em 2026-06-02 por uma marca vetorial simples de direcao, caminho e acao, incluindo versao maskable.

`public/sw.js` e intencionalmente conservador: cacheia apenas assets estaticos declarados e a pagina `/offline`. Navegacao offline cai em `/offline`.

## Offline e cache

Sem fila offline sensivel antes do Prompt 15. O service worker nao deve cachear:

- Metacognicao;
- Inbox bruta;
- calendario;
- Atalaia;
- notificacoes;
- tokens de convite;
- respostas de server actions;
- conteudo privado do usuario.

## Persistencia

As acoes mobile reutilizam server actions existentes de Inbox, Habitos, Placar, Foco, Desbloqueador e Metacognicao. Quando ha sessao Supabase, as actions usam filtros owner-only e RLS preparado. Sem sessao, retornam fallback `local-draft` honesto.

Energia usa `energy_checkins`, tabela privada owner-only criada no Prompt 14. A migration remota `mobile_pwa_prompt14_alignment` foi aplicada no Supabase `proposito_em_acao` em 2026-06-02.

## Fora de escopo

- app nativo;
- push notifications;
- sync offline de dados sensiveis;
- calendario mobile complexo;
- edicao profunda de projetos/tarefas;
- Atalaia mobile funcional;
- OpenAI real acionada pela UI;
- deploy.

## Limites aprovados antes do Prompt 15

- PWA responsivo permanece a estrategia mobile ativa.
- App nativo fica fora ate validacao real do PWA com usuarios.
- Push notifications ficam fora ate prompt proprio com consentimento, conteudo neutro e seguranca.
- Fila offline sensivel fica fora; offline permitido segue limitado a shell, manifest, icones e pagina `/offline`.
