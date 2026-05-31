# UX/UI Guide

Este guia define a experiencia TDAH-first do Proposito em Acao. Detalhes tecnicos de tokens e componentes vivem em `docs/DESIGN_SYSTEM.md`; regras de acessibilidade vivem em `docs/ACCESSIBILITY.md`.

## Direcao visual

O produto deve parecer um ambiente de construcao de vida, nao um painel frio de tarefas. A linguagem visual deve ser clara, viva, simbolica e calma, com reforco positivo sem excesso de estimulo.

## Desktop-first

Desktop e o centro operacional para:

- Planejamento semanal.
- Calendario.
- Chamado.
- Mapa da Vida.
- Projetos.
- Revisao semanal.
- Configuracoes de Atalaia e consentimento.

## Mobile complementar

PWA/mobile existe para acoes rapidas:

- Capturar item.
- Marcar habito.
- Marcar Placar.
- Iniciar foco curto.
- Usar Desbloqueador rapido.
- Usar Metacognicao rapida.
- Registrar energia.

Regra: abrir, tocar, registrar e fechar.

## UX TDAH-first

- Uma proxima acao por vez.
- Poucas opcoes visiveis.
- Botao principal claro.
- Textos curtos por padrao.
- Microtarefas visiveis.
- Energia e tempo sempre considerados.
- Feedback imediato apos acao.
- Profundidade progressiva.
- Retomada facil apos falha.
- Sem ranking publico, vergonha ou punicao visual.

## Componentes principais

Componentes do design system relacionados a UX:

- `NextActionCard`: proxima acao destacada.
- `EnergySelector`: energia atual e modo baixa energia.
- `TimeAvailableSelector`: tempo disponivel em escolhas curtas.
- `MicrotaskList`: passos pequenos e ordenados.
- `ProgressNudge`: reforco breve e saudavel.
- `RestartPrompt`: convite de retomada sem culpa.
- `LowEnergyPrompt`: versao minima aceitavel.
- `MetacognitionEntryCard`: entrada privada e curta de Metacognicao.
- `ActionUnblockerCard`: desbloqueio de acao em formato curto.
- `ScoreboardCard`: constancia sem vergonha.
- `LifeGardenPreview`: progresso simbolico sem punicao.
- `ReflectionCard`, `GratitudePrompt`, `WisdomNote`: camada crista opcional e configuravel.

Componentes futuros recomendados para fluxos com IA/consentimento:

- `AiSuggestionCard`: sugestao editavel e revisavel.
- `ConsentPreview`: previa do que sera salvo/enviado.
- `SensitiveDataNotice`: aviso contextual sem alarmismo.
- `FocusTimer`: temporizador limpo com captura de distracao.

## Padroes por tela

### Dashboard

Organizar em Agora, Hoje, Semana, Direcao e Progresso. A primeira dobra deve responder: o que eu faco agora?

### Calendario

Visao semanal padrao, visao diaria para execucao. Mostrar descanso, familia, foco e compromissos reais. O painel lateral deve ser colapsavel e contextual.

### Chamado

Sessao guiada em etapas. Salvar rascunho, permitir direcao em discernimento e evitar linguagem definitiva sobre vontade divina.

### Alvos e projetos

Criar a partir de linguagem natural, mas sempre mostrar estrutura editavel: especifico, medida, prazo, analise ecologica, primeira acao e vinculo com Chamado.

### Tarefas

Toda tarefa grande deve oferecer quebrar em microtarefas. Mostrar tempo estimado, energia, status e botao para foco/desbloqueio.

## Modo baixa energia

Modo baixa energia reduz a tarefa para:

- versao minima aceitavel;
- duracao curta;
- menos campos;
- linguagem compassiva e objetiva;
- opcao de descanso legitimo.

O design system materializa esse padrao em `src/lib/design/modes.ts` e em componentes como `LowEnergyPrompt`.

## Modo recomeço

Modo recomeço aparece quando houve falha, atraso ou abandono. Deve perguntar:

1. Qual e o menor retorno honesto?
2. O que precisa ser ajustado?
3. Qual microacao cabe agora?

Nao deve exibir culpa, streak quebrado como derrota ou mensagem moralista. O design system materializa esse padrao em `RestartPrompt`, `RestartCountBadge` e feedbacks suaves de Placar/Jardim.

## Design da Metacognicao

Blocos sugeridos:

1. Sentir: nomear estado e intensidade.
2. Pensar: registrar pensamento automatico.
3. Separar: fato, interpretacao, sentimento e impulso.
4. Testar: evidencias, alternativas e distorcoes provaveis.
5. Confrontar: responsabilidade sem humilhacao.
6. Reformular: leitura mais verdadeira e util.
7. Agir: microacao, descanso, oracao/reflexao ou ajuda humana.

Metacognicao e privada por padrao e nao deve parecer terapia nem interrogatorio.

## Design do Desbloqueador

Tela minima:

- O que voce esta tentando fazer?
- O que te travou?
- Energia atual.
- Tempo disponivel.
- Botao: gerar proximo passo.

Saida curta: primeiro passo, versao minima, tempo, frase de retomada, botao de foco.

## Design do Jardim da Vida

O Jardim deve ser simbolico, recompensador e nao punitivo. Areas crescem por progresso real; areas negligenciadas aparecem como convite de cuidado, nao como vergonha.

## Acessibilidade

- Contraste adequado.
- Navegacao por teclado.
- Tamanhos de fonte legiveis.
- Estados de foco visiveis.
- Animacoes discretas e reduziveis.
- Conteudo nao depender apenas de cor.
- Textos curtos, com possibilidade de expandir.

## Criterios de aceite UX

- Usuario entende a proxima acao em poucos segundos.
- Fluxos criticos funcionam com baixa energia.
- Mobile nao replica toda a complexidade do desktop.
- Metacognicao nao parece terapia nem interrogatorio.
- Placar e Jardim nao punem visualmente.
- Toda sugestao de IA que vira dado e editavel antes de salvar.
