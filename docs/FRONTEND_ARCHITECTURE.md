# Frontend Architecture

## Rotas

Rotas existentes:

- `/`
- `/dashboard`
- `/onboarding`
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

Essas rotas validam shell, navegacao e componentes fundacionais. Elas nao implementam fluxos finais de produto.

Excecao do Prompt 6:

- `/onboarding` implementa o fluxo inicial de perfil, Mapa da Vida, Chamado em discernimento e resumo.
- `/dashboard` implementa dashboard inicial de direcao e progressao assistida.
- As demais rotas continuam placeholders de largura da V1.

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
- Mobile e complementar para captura, habitos, foco curto, Desbloqueador e Metacognicao rapida.
- `MobileShell` existe para acoes rapidas, nao para copiar o desktop inteiro.

## PWA futuro

- Manifesto, icons e service worker serao avaliados em etapa propria.
- Captura offline/sincronizacao exigira plano de dados e conflitos.

## Calendario e dashboard

- Calendario deve priorizar semana/dia no desktop.
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

Playwright deve cobrir home, dashboard, Metacognicao, navegacao principal, desktop e largura mobile minima.
