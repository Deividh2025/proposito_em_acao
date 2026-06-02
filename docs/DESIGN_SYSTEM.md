# Design System

Fonte canonica do design system inicial do Proposito em Acao. Este documento orienta tokens, layout, componentes, estados, responsividade, acessibilidade e modos TDAH-first.

## Escopo da etapa

Esta etapa entrega fundacao visual e tecnica:

- Tokens visuais em `src/lib/design/tokens.ts`.
- Modos em `src/lib/design/modes.ts`.
- Navegacao e rotas placeholder em `src/lib/design/navigation.ts`.
- Shell desktop-first em `src/components/layout`.
- Componentes base em `src/components/ui` e componentes visuais iniciais por dominio.
- Rotas placeholder para validar largura da V1 sem implementar fluxos finais, exceto `/onboarding` e `/dashboard`, que no Prompt 6 recebem fluxo inicial de direcao.

Fora de escopo da fundacao visual original:

- Onboarding funcional.
- Auth visual completa.
- Chamado funcional.
- Metacognicao funcional.
- Desbloqueador funcional.
- Calendario funcional.
- Atalaia funcional.
- Chamadas reais a Supabase ou OpenAI.
- Deploy.

Atualizacao Prompt 6: onboarding funcional inicial e dashboard inicial foram implementados com mock seguro, sem Auth UI completa, sem OpenAI real e sem deploy.

Atualizacao Prompt 8: alvos, projetos, tarefas e microtarefas ganharam rotas e componentes iniciais com proxima acao clara, mock seguro, fallback local/dev e sem calendario funcional, Atalaia funcional ou OpenAI real.

Atualizacao Prompt 9: calendario e inbox deixam de ser placeholders e passam a usar componentes desktop-first, densos mas respiraveis, com captura rapida, agenda semana/dia, blocos revisaveis e linguagem sem culpa.

Atualizacao Prompt 10: Desbloqueador e Metacognicao deixam de ser placeholders e passam a usar formularios rapidos, resultado estruturado, historico privado e avisos de dados sensiveis sem sobrecarga emocional.

## Principios visuais

- Clareza antes de densidade.
- Proxima acao sempre evidente.
- Ambiente de construcao de vida, nao painel corporativo generico.
- Responsabilidade sem humilhacao.
- Retomada acima de perfeicao.
- Dopamina saudavel: feedback breve, real e nao viciante.
- Fe integrada de forma configuravel, discreta e madura.
- Desktop como centro operacional; mobile/PWA para acoes rapidas.

## Tokens

### Cores

Tokens iniciais:

| Uso | Token | Valor |
|---|---|---|
| Fundo | `background` | `#f7f8f5` |
| Superficie | `surface` | `#ffffff` |
| Texto principal | `ink.900` | `#17211b` |
| Texto secundario | `ink.500` | `#657168` |
| Proposito/marca | `purpose.700` | `#17633f` |
| Acao | `action.700` | `#174f69` |
| Aviso calmo | `warmth.500` | `#b98022` |
| Erro sem agressividade | `gentleDanger.500` no Tailwind / `danger.500` nos tokens TS | `#b94a48` |

Regras:

- Evitar vermelho agressivo para falha comum.
- Usar `danger` apenas para erro real ou risco, nunca para "usuario falhou".
- Placar e Jardim devem usar convite de cuidado, nao alerta punitivo.
- Conteudo nao deve depender apenas de cor.

### Tipografia

- Fonte inicial: system sans via `--font-sans`.
- Titulo de pagina: forte, claro, sem escala hero desnecessaria.
- Labels: curtos, sem jargao.
- Corpo: linhas confortaveis, texto curto por padrao e expansivel quando necessario.

### Espacamento e radius

- Controles: `0.375rem`.
- Cards: `0.5rem`.
- Paineis: `0.75rem`.
- Evitar cards aninhados e wrappers decorativos excessivos.

### Sombra e bordas

- Usar sombra suave apenas para shell, paineis e superficies elevadas.
- Bordas funcionais devem ter contraste perceptivel.

### Motion

- Duracoes: `120ms`, `180ms`, `240ms`.
- Motion deve reforcar feedback, nao chamar atencao por si.
- Respeitar `prefers-reduced-motion`.

## Layout

### Desktop-first

Shell base:

- `AppShell`
- `Sidebar`
- `Topbar`
- `MainContent`
- `RightPanel`
- `PageHeader`
- `SectionHeader`

Desktop usa navegacao lateral, topbar e painel direito contextual. O painel direito deve reservar espaco para modos de apoio, privacidade e lembretes de escopo.

### Mobile/PWA

Mobile usa `MobileShell` com navegacao curta. A regra e abrir, tocar, registrar e fechar. Nao copiar a complexidade do desktop.

## Componentes

### UI basica

Componentes iniciais:

- `Button`, `IconButton`
- `Card`, `Panel`
- `Badge`, `Tag`
- `Input`, `Textarea`, `Select`
- `Checkbox`, `RadioGroup`, `Switch`, `Slider`
- `Progress`, `Stepper`, `Tabs`
- `Modal`, `Drawer`, `Tooltip`, `Toast`
- `EmptyState`, `LoadingState`, `ErrorState`, `SuccessState`
- `SensitiveDataNotice`

Regras:

- Todo controle precisa de nome acessivel.
- Botao primario deve ser unico por contexto.
- Estados disabled devem ser visiveis e nao depender apenas de opacidade.
- Modais e drawers interativos futuros precisam de foco gerenciado, retorno de foco, backdrop/inert quando modal real e escape.

### Execucao

Componentes iniciais:

- `NextActionCard`
- `EnergySelector`
- `TimeAvailableSelector`
- `MicrotaskList`
- `FocusStartButton`
- `ProgressNudge`
- `RestartPrompt`
- `LowEnergyPrompt`

Regra central: toda superficie deve responder "qual e o proximo passo agora?".

### Metacognicao

Componentes iniciais:

- `MetacognitionEntryCard`
- `EmotionIntensityScale`
- `ThoughtBreakdownPreview`
- `FactInterpretationFeelingImpulseGrid`
- `CognitivePatternBadge`
- `ReframeCard`
- `ConfrontationQuestionCard`
- `NextActionAfterReflectionCard`

Regras:

- Privada por padrao.
- Nao diagnosticar.
- Separar fato, interpretacao, sentimento e impulso.
- Terminar com microacao, descanso legitimo, oracao/reflexao opcional ou ajuda humana.
- Nada vai ao Atalaia automaticamente.

### Desbloqueador

Componentes iniciais:

- `ActionUnblockerCard`
- `ObstacleSelector`
- `TinyStepCard`
- `MinimumViableActionCard`

Regras:

- Entrada curta.
- Saida curta.
- Primeiro passo visivel.
- Encaminhar para Metacognicao quando o bloqueio for cognitivo/emocional.

### Placar

Componentes iniciais:

- `ScoreboardCard`
- `ScoreboardItem`
- `ScoreboardMarker`
- `StreakSoftIndicator`
- `RestartCountBadge`

Regras:

- Valorizar retomadas.
- Nao usar ranking publico.
- Nao tratar streak quebrado como derrota.

### Jardim

Componentes iniciais:

- `LifeGardenPreview`
- `GardenAreaTile`
- `GardenGrowthIndicator`
- `CareNeededIndicator`

Regra: areas negligenciadas aparecem como convite de cuidado, nao vergonha.

### Camada crista discreta

Componentes iniciais:

- `ReflectionCard`
- `GratitudePrompt`
- `WisdomNote`

Regras:

- Sempre opcional/configuravel em etapa futura.
- Sem culpa espiritual.
- Sem afirmar vontade divina especifica.

## Estados

- Vazio: orientar proximo passo, nao apontar falha.
- Loading: texto claro e curto.
- Erro: informar problema e alternativa sem culpar o usuario.
- Sucesso: feedback breve, sem confete excessivo.
- Baixa energia: reduzir opcoes e campos.
- Recomeço: menor retorno honesto e ajuste de rota.
- Dados sensiveis: aviso contextual sem alarmismo.
- Sugestao de IA: sempre editavel/revisavel antes de salvar quando virar dado.

## Padrões TDAH-first

- Uma acao principal por tela/contexto.
- Poucas opcoes visiveis.
- Microtarefas e tempo/energia aparentes.
- Profundidade progressiva.
- Linguagem curta, objetiva e acolhedora.
- Retomada sem culpa.
- Mobile com fluxos curtos.

## Prompt 14 - Mobile/PWA

- `/mobile` e a superficie de acoes rapidas, nao um dashboard completo.
- Componentes mobile usam cards simples, botoes grandes e uma acao primaria.
- Navegacao mobile aponta para hub, captura, foco, energia e Metacognicao rapida.
- Estados de baixa energia devem sugerir 5 minutos, versao minima, descanso legitimo ou Desbloqueador.
- Offline visual deve ser calmo e honesto: sem fila sensivel, sem prometer salvamento produtivo.

## Acessibilidade

Resumo operacional:

- Contraste WCAG 2.2 AA como minimo.
- Foco visivel global.
- Navegacao por teclado.
- Labels e nomes acessiveis.
- Reduced motion respeitado.
- Conteudo nao depende apenas de cor.
- Textos curtos, legiveis e expansivos.

Detalhes vivem em `docs/ACCESSIBILITY.md`.

## Exemplos de uso

```tsx
<NextActionCard />
<LowEnergyPrompt />
<RestartPrompt />
```

Use componentes de dominio como blocos visuais de orientacao. Eles ainda nao devem persistir dados, chamar IA ou disparar acoes externas.

## Verificacoes

Gates esperados quando tocar UI:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

`npm.cmd` deve ser preferido no PowerShell por causa de ExecutionPolicy.
