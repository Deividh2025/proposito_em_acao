# Frontend Architecture

## Rotas

Rotas existentes:

- `/`
- `/dashboard`
- `/onboarding`
- `/goals`
- `/goals/new`
- `/goals/[goalId]`
- `/projects`
- `/projects/new`
- `/projects/[projectId]`
- `/tasks`
- `/tasks/new`
- `/tasks/[taskId]`
- `/calendar`
- `/inbox`
- `/focus`
- `/habits`
- `/scoreboard`
- `/metacognition`
- `/review`
- `/garden`
- `/accountability`
- `/settings`

Essas rotas validam shell, navegacao e cobertura ampla da V1 local. Elas nao devem ser confundidas com prontidao de beta real: apos a Etapa 4, listagens e detalhes principais usam queries autenticadas ou empty states reais, enquanto `local-demo` pode exibir amostras rotuladas e mocks de IA continuam apenas para geracao revisavel/local-dev. A prova de dados reais ainda depende de Auth/Supabase/RLS em ambiente validado.

Excecao do Prompt 6:

- `/onboarding` implementa o fluxo inicial de perfil, Mapa da Vida, Chamado em discernimento e resumo.
- `/dashboard` implementa dashboard inicial de direcao e progressao assistida.
- `/goals`, `/projects` e `/tasks` implementam nucleo inicial do Prompt 8 com mock seguro, fallback local/dev e server actions preparadas para Supabase.
- `/calendar` e `/inbox` implementam o centro operacional do Prompt 9 com calendario semana/dia, blocos, agendamento, captura, classificacao mockada e processamento.
- Prompt 10 a 14 adicionaram Desbloqueador, Metacognicao, Foco, Habitos, Placar, Revisao, Jardim, Atalaia, Compromissos e rotas mobile/PWA em profundidade controlada.

## Estado anterior verificado em 2026-06-03

- Varias paginas principais ainda exibem amostras locais: alvos, projetos, tarefas, calendario/inbox, habitos, Placar, Jardim e Atalaia possuem componentes com `sample*`, mocks ou paineis demonstrativos.
- A Inbox atualiza estado local em captura/conversao sem checar `result.ok`; antes do beta real, a UI deve diferenciar falha real de rascunho local.
- Rotas mobile usam `MobileShell` com `<main>` dentro do `<main>` global do AppShell; corrigir antes de tratar mobile/PWA como pronto.
- `/settings` ainda nao implementa seletor real de provider de IA (`automatic`, `openai`, `deepseek`) nem consentimento por provider.
- E2E local valida navegacao e fallback, nao prova dados reais do usuario nem Auth real publicado.

## Estado atual verificado em 2026-06-04 - Etapa 4

- Rotas principais passam a decidir fonte de dados por runtime: `local-demo` pode exibir amostras rotuladas; `preview`, `beta` e `production` devem exibir dados autenticados via server queries ou empty states reais.
- `src/app` e `src/components` nao devem importar `sample*` para listagens/detalhes reais; amostras ficam encapsuladas em queries de `local-demo`, fixtures ou testes.
- Dashboard, execucao, calendario/inbox, foco, habitos, Placar, historicos privados, Jardim, Atalaia, Compromissos e mobile/today receberam superfícies de dados reais ou vazios reais.
- Mocks de IA permanecem apenas em geracao revisavel/local-dev; eles nao substituem dados persistidos em listagens.
- E2E local ainda valida fallback/renderizacao; dados reais autenticados continuam dependentes de preview HTTPS/Auth/RLS.

## App Router

- `src/app/layout.tsx`: layout raiz com `AppShell`.
- `src/app/page.tsx`: home do design system inicial.
- `src/app/*/page.tsx`: placeholders por area, exceto onboarding e dashboard inicial do Prompt 6.

Preferir Server Components por padrao. Usar Client Components somente quando houver estado, evento, browser API ou controle interativo real.

## Componentes

- `src/components/layout`: shell, navegacao, headers e paginas placeholder.
- `src/components/ui`: primitivos reutilizaveis.
- `src/components/execution`: proxima acao, energia, microtarefas, baixa energia e recomeço.
- `src/components/metacognition`: estrutura visual privada da Metacognicao.
- `src/components/action-unblocker`: estrutura visual do Desbloqueador.
- `src/components/scoreboard`: Placar sem vergonha.
- `src/components/garden`: Jardim nao punitivo.
- `src/components/faith`: camada crista discreta e opcional.
- `src/components/mobile`: acoes rapidas do PWA/mobile complementar.
- `src/components/pwa`: registro client-side do service worker.

## Design system

`docs/DESIGN_SYSTEM.md` e a fonte canonica de tokens, componentes, estados e regras visuais. A implementacao tecnica fica em:

- `src/lib/design/tokens.ts`
- `src/lib/design/modes.ts`
- `src/lib/design/navigation.ts`
- `src/types/design.ts`
- `tailwind.config.ts`
- `src/app/globals.css`

Tailwind continua como base de tokens e utilitarios.

## Estado

- Comecar com Server Components e estado local.
- Adicionar estado global somente quando houver necessidade clara.
- Dados remotos futuros devem passar por Supabase/rotas server-side e cache apropriado.

## Formularios

- React Hook Form para formularios reais.
- Zod para schemas compartilhados e validacao.
- Acoes sensiveis devem validar no servidor.
- Sugestoes de IA que virarem dados precisam ser revisaveis/editaveis antes de salvar.

## Onboarding Prompt 6

- `src/components/onboarding/OnboardingFlow.tsx` e o client island do wizard.
- `src/app/onboarding/actions.ts` centraliza o salvamento server-side preparado para Supabase.
- O shell permanece Server Component.
- O fluxo nao usa `localStorage` para conteudo intimo.

## Responsividade

- Desktop e centro operacional.
- Mobile e complementar para captura, habitos, Placar, foco curto, Desbloqueador, Metacognicao rapida e energia.
- `MobileShell` existe para acoes rapidas, nao para copiar o desktop inteiro.

## PWA Prompt 14

- `public/manifest.json` define instalabilidade inicial e `start_url` em `/mobile`.
- `public/sw.js` cacheia apenas assets estaticos e pagina offline.
- `src/app/offline/page.tsx` explica que dados sensiveis nao entram em fila offline.
- Captura offline/sincronizacao sensivel exige prompt proprio de dados, conflitos, privacidade e limpeza.

## Calendario e dashboard

- Calendario deve priorizar semana/dia no desktop.
- Prompt 9 usa componentes headless em `src/components/calendar` e `src/components/inbox`, sem biblioteca externa de calendario.
- Criacao, edicao, conclusao e reagendamento usam formularios acessiveis e server actions preparadas para Supabase.
- Drag-and-drop so deve entrar depois de avaliar acessibilidade, performance e complexidade.
- Dashboard deve responder a pergunta: "qual e a proxima acao fiel agora?".

## Bibliotecas recomendadas a avaliar depois

- Calendario: FullCalendar, React Big Calendar ou alternativa headless.
- Drag-and-drop: dnd-kit se a necessidade sobreviver ao MVP.
- UI: Radix/shadcn apenas se acelerar sem prender o produto a componentes pesados.

## Testes de frontend

Gates basicos:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Playwright deve cobrir home, dashboard, calendario, inbox, Metacognicao, navegacao principal, desktop, largura mobile minima e rotas `/mobile/*`.
