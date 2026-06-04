# Testing Strategy

## Estado atual

A stack Next.js, Vitest e Playwright existe. Em 2026-06-03, `supabase --version` esta disponivel localmente (`2.98.2`) e o projeto foi listado em modo read-only. Um branch preview foi criado e validado historicamente em 2026-06-02, mas essa evidencia precisa de rerun fresco antes de beta real. Nao ha chamadas reais de IA.

Gates atuais da auditoria transversal do PR #7:

- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 32 arquivos e 194 testes.
- `npm.cmd run build`: passou, 44 paginas/rotas geradas.
- `npm.cmd run test:e2e`: passou, build + 33 testes.
- `git diff --check`: passou, apenas avisos CRLF do Windows.
- Secret scan do diff: nenhum padrao sensivel real encontrado.

Observacao historica: secoes antigas por prompt podem registrar RLS como pendente no momento da implementacao daquele prompt. O status atual consolidado e o do preview Supabase documentado em `docs/RLS_TEST_REPORT.md` e `docs/RELEASE_READINESS.md`.

## Testes unitarios

Quando a stack existir, cobrir regras puras:

- SMART-E.
- Estados de Goal, Project, Task e Microtask.
- Decomposicao de tarefas.
- Energia/tempo.
- Consentimentos.
- Permissoes de Atalaia.
- Validacao de schemas de IA.
- Privacidade por padrao.
- Regras de Placar e retomada.

## Testes de integracao

Estado atual: a Etapa 1 adicionou `src/tests/integration/runtime-error-contracts.test.ts` para contratos de runtime/fallback/erro com Supabase mockado. Isso reduz `QA-INT-001`, mas ainda nao substitui suites reais de Auth/RLS/preview antes do beta.

- Auth e perfil.
- Persistencia de Chamado, alvos, projetos, tarefas e calendario.
- Inbox para destino.
- Foco para atualizacao de tarefa/Placar.
- Desbloqueador para foco ou Metacognicao.
- IA mockada com structured outputs.
- E-mail/convite de Atalaia com previa.
- Logs sem dados sensiveis.

## Etapa 1 - runtime/error contracts

Testes adicionados:

- `src/tests/unit/runtime-action-results.test.ts`: cobre `APP_RUNTIME_MODE`, kill switches default `false`, `local-demo`, fail-closed fora de local-demo e erro real sanitizado.
- `src/tests/integration/runtime-error-contracts.test.ts`: cobre erro real de Supabase retornando `ok:false`, sessao ausente em `local-demo`, fail-closed em `preview`, update sem linha afetada e validacao invalida no calendario.
- `src/tests/unit/inbox-capture-ui.test.ts`: cobre Inbox exibindo falha como `ErrorState`, sem sucesso visual.
- `src/tests/e2e/mobile-pwa.spec.ts`: cobre rota mobile com um unico `<main>`.

Esses testes nao validam Supabase remoto, Auth publicado, RLS dinamico, Resend, IA real, analytics real ou smoke externo.

## Auth readiness e SSR

Antes de beta real, a suite publicada deve cobrir:

- Proxy/middleware SSR renovando/propagando cookies e validando claims em ambiente configurado.
- Signup, confirmacao de e-mail, login, rota protegida, logout, recovery/update de senha e expiracao/refresh de sessao.
- Redirects aceitando apenas destinos internos/allowlist e rejeitando URL externa arbitraria.
- Falha fechada fora de `local-demo` quando Supabase/Auth/redirect/SMTP obrigatorio estiver ausente ou falhar.
- Smoke externo em URL HTTPS real com Site URL/Redirect URLs do Supabase alinhados.
- PWA/service worker sem cache de `/auth`, callbacks, recovery, APIs autenticadas, server actions ou respostas privadas.
- Typegen real com `npm.cmd run supabase:types:preview` em preview aprovado antes de tratar `src/types/database.ts` como contrato do banco.

## Etapa 4 - dados autenticados nas interfaces

Testes adicionados/ajustados:

- Contrato de runtime para dados autenticados: amostras apenas em `local-demo`, falha fechada/empty state fora dele.
- Mappers defensivos para linhas Supabase enquanto os tipos reais continuam genericos.
- Queries de execucao, rotina diaria, Atalaia e mobile com mocks de Supabase.
- Regressao de Inbox com fixture explicita em vez de amostra interna do componente.

Gates locais executados na etapa: `lint`, `typecheck`, `test`, `build`, `test:e2e`, `git diff --check` e secret scan do diff. Preview/Auth/RLS real exige `supabase:validate:preview` e smoke externo apenas quando houver ambiente aprovado.

## Testes E2E

Fluxos minimos:

1. Cadastro -> perfil -> Mapa -> Chamado -> dashboard.
2. Alvo -> projeto -> tarefa -> microtarefa -> calendario -> foco.
3. Inbox -> classificacao -> tarefa/projeto/habito.
4. Desbloqueador -> proximo passo -> foco.
5. Metacognicao -> reformulacao -> microacao.
6. Habito -> Placar -> Revisao semanal -> Jardim.
7. Atalaia -> convite -> permissao -> previa -> revogacao.
8. PWA/mobile -> captura -> habito -> foco curto -> sincronizacao.

## Prompt 6

Testes adicionados/esperados:

- Unitarios para `analyzeLifeMap`, `calling_draft_v1`, guardrails do Chamado, perguntas do Chamado e progressao assistida.
- E2E para `/onboarding`: perfil, Mapa da Vida, Chamado, mock seguro, aceite de hipotese e dashboard inicial.
- E2E para `/dashboard`: direcao inicial, proxima etapa e modulos limitados.

Sem rerun fresco em ambiente aprovado, RLS real permanece pendente. O checkout valida dominio, schema, fallback local e renderizacao.

## Testes de RLS futuros

Para cada tabela exposta:

- Dono pode acessar.
- Outro usuario nao pode acessar.
- Usuario anonimo nao pode acessar dados privados.
- Atalaia autorizado ve somente escopo permitido.
- Atalaia revogado nao ve nada.
- Views respeitam RLS.
- Storage e privado por padrao.
- `service_role` nao aparece no cliente.
- Filho nao pode apontar para parent de outro usuario.
- Metacognicao, Chamado completo e revisoes privadas nao aparecem em acesso de Atalaia.

Status atual: a matriz dinamica em preview cobriu dono, outro usuario, anonimo, Atalaia ativo e Atalaia revogado para alvo, Metacognicao e tabelas principais de accountability. Ainda faltam smoke publicado, Auth real e expansao da matriz para todas as tabelas antes de beta com usuarios reais.

## Testes de IA/evals

Evals minimos:

- Aderencia a schema.
- Bloqueio de diagnostico.
- Bloqueio de terapia substitutiva.
- Bloqueio de culpa espiritual.
- Bloqueio de afirmacao de vontade divina especifica.
- Confronto firme sem humilhacao.
- Deteccao de crise e encaminhamento.
- Atalaia sem vazamento de dados privados.
- Fallback quando IA falha.
- Resistencia a prompt injection simples.

### Auditoria transversal do PR #7

Testes adicionados/validados:

- `src/tests/unit/ai-provider-routing.test.ts` passou a cobrir limite diario bloqueando provider real antes de chamada externa.
- `src/tests/unit/ai-provider-routing.test.ts` valida remocao recursiva de chaves sensiveis antes do provider, preservando conteudo minimo permitido.
- `src/tests/unit/ai-provider-routing.test.ts` valida `AbortSignal` abortado quando o timeout aciona fallback local.
- `src/tests/unit/ai-provider-routing.test.ts` valida bloqueio de output de Atalaia que tenta incluir Metacognicao privada.
- Suite geral pos-correcao passou com 32 arquivos/194 testes; E2E passou com 33 testes.

## Prompt 7

Testes adicionados:

- `src/tests/unit/ai-central-layer.test.ts` valida schemas, catalogo de agentes, guardrails deterministas, mock provider, fallback e redacao de logs.
- `src/ai/evals/schema-validation.test.ts` valida registro inicial de eval cases.
- `src/ai/evals/*.cases.ts` registra casos negativos de Chamado, Metacognicao, seguranca, Atalaia e crise.

`vitest.config.ts` inclui `src/ai/evals/**/*.test.ts`.

## Prompt 8

Testes adicionados/esperados:

- `src/tests/unit/execution-domain.test.ts` valida SMART-E mock, plano de projeto, quebra de tarefa e overview de execucao.
- `src/tests/unit/ai-central-layer.test.ts` valida os schemas atualizados de SMART-E, project plan, task breakdown e agente `taskBreakdown`.
- E2E recomendado: criar alvo manual, gerar alvo mock, gerar projeto, criar tarefa, quebrar em microtarefas e marcar microtarefa.
- RLS real permanece pendente ate rerun fresco em ambiente aprovado; usar checklist de `supabase/tests/README.md` e `docs/RLS_POLICIES.md`.

## Prompt 9

Testes adicionados/esperados:

- `src/tests/unit/calendar-inbox-domain.test.ts` valida montagem de semana, proxima acao, sobrecarga, classificacao de inbox e processamento.
- `src/tests/unit/ai-central-layer.test.ts` valida `inbox_classification_output_v1`, `schedule_overload_output_v1` e agente `scheduleReviewer`.
- `src/tests/e2e/calendar-inbox.spec.ts` cobre abertura do calendario, criacao de bloco, agendamento de tarefa, reagendamento, captura na inbox, classificacao e conversao para bloco.
- RLS real de `calendar_blocks` e `inbox_items` permanece pendente ate rerun fresco em ambiente aprovado; usar `supabase/tests/README.md` e `docs/RLS_POLICIES.md`.
- Testes de logs sensiveis devem confirmar que capturas, links, preocupacoes e agenda nao aparecem em logs brutos quando observabilidade existir.

## Prompt 10

Testes adicionados/esperados:

- `src/tests/unit/action-metacognition-domain.test.ts` valida Desbloqueador, sugestao de Metacognicao, crise, separacao fato/interpretacao/sentimento/impulso e privacidade.
- `src/ai/evals/action-unblocker.cases.ts` registra casos do Desbloqueador.
- `src/ai/evals/crisis-guardrail.cases.ts` registra casos de crise.
- `src/ai/evals/metacognition.cases.ts` foi ampliado com privacidade, crise e linguagem pastoral segura.
- `src/ai/evals/schema-validation.test.ts` valida guardrails, schemas e evals.
- E2E recomendado: `/action-unblocker` gera plano, `/metacognition` gera reflexao, historico privado carrega e crise mostra rota de ajuda humana.
- RLS real de `action_unblock_sessions` e `metacognition_sessions` permanece pendente ate rerun fresco em ambiente aprovado; usar `supabase/tests/README.md`.

## Prompt 11

Testes adicionados/esperados:

- `src/tests/unit/focus-habits-scoreboard-domain.test.ts` valida duracoes de foco, captura de distracao, plano de habito, retomada e Placar.
- `src/tests/e2e/focus-habits-scoreboard.spec.ts` cobre iniciar foco, capturar distracao, concluir foco, gerar habito mock, marcar retomada e marcar Placar.
- `src/tests/unit/ai-central-layer.test.ts` valida `habit_plan_output_v1` ampliado e `scoreboard_plan_output_v1`.
- RLS real de `focus_sessions`, `focus_distractions`, `habits`, `habit_logs`, `discipline_scoreboards`, `scoreboard_items` e `scoreboard_entries` permanece pendente ate rerun fresco em ambiente aprovado.

## Prompt 12

Testes adicionados/esperados:

- `src/tests/unit/review-garden-domain.test.ts` valida perguntas da revisao, `weekly_review_output_v1`, retomadas sem vergonha, `garden_state_output_v1` e metadados minimos do Jardim.
- `src/tests/unit/ai-central-layer.test.ts` valida `weekly_review_output_v1` ampliado e `garden_state_output_v1`.
- `src/tests/e2e/review-garden.spec.ts` cobre abrir revisao, gerar sintese mock, visualizar foco da proxima semana, salvar revisao em fallback local/dev, abrir Jardim e validar cuidado sem punicao.
- RLS real de `weekly_reviews`, `garden_states` e `garden_events` permanece pendente ate rerun fresco em ambiente aprovado.
- Evals futuros devem cobrir culpa espiritual, vergonha, diagnostico, vazamento de Metacognicao e compartilhamento indevido com Atalaia.

## Prompt 13

Testes adicionados/esperados:

- `src/tests/unit/accountability-commitments-domain.test.ts` valida permissoes por nivel, previa sem dados privados, Documento de Compromisso revisavel e bloqueio de alavancas abusivas.
- `src/tests/unit/ai-central-layer.test.ts` valida `accountability_message_output_v1` atualizado e `commitment_document_output_v1`.
- `src/tests/e2e/accountability-commitments.spec.ts` cobre abertura de Atalaia, geracao de previa, painel limitado do Atalaia, Documento de Compromisso e bloqueio de alavanca abusiva.
- RLS real de `accountability_partners`, `accountability_grants`, `accountability_events`, `accountability_notifications`, `commitment_documents` e `commitment_levers` permanece pendente ate rerun fresco em ambiente aprovado. Incluir `atalia_invited` e imutabilidade de escopo no aceite.
- Testes RLS futuros devem confirmar Atalaia autorizado, Atalaia revogado, permissao ausente, outro alvo, documento nao compartilhado e notificacao cancelada.
- Testes de e-mail futuro devem confirmar provider server-side, assunto/corpo neutros, sem dados sensiveis e `pending_provider_config` quando ambiente nao estiver configurado.

## Prompt 14

Testes adicionados/esperados:

- `src/tests/unit/mobile-energy-domain.test.ts` valida schema de energia, sugestao de baixa energia e fallback local/dev.
- `src/tests/e2e/mobile-pwa.spec.ts` cobre `/mobile`, captura, habito, Placar, foco curto, Desbloqueador rapido, Metacognicao rapida e energia em viewport 390x844.
- PWA deve validar manifest, icones, pagina offline e service worker sem cache de dados sensiveis.
- RLS real de `energy_checkins` permanece pendente ate rerun fresco em ambiente aprovado.
- Testes futuros devem cobrir double tap/idempotencia, matriz mobile de viewports e eventual fila offline segura se aprovada.

## Prompt 17

Testes adicionados/esperados:

- `src/tests/unit/beta-operations-domain.test.ts` valida allowlist/sanitizacao de analytics e feedback beta local.
- `src/tests/e2e/beta-feedback.spec.ts` abre feedback beta no desktop e mobile, prepara rascunho local sem envio externo e confirma aviso de dados sensiveis.
- Smoke publicado deve validar que `NEXT_PUBLIC_BETA_FEEDBACK_URL`, se configurada, nao contem token ou query sensivel.
- Testes futuros de analytics real devem confirmar consentimento, bloqueio sem consentimento, rejeicao de chaves sensiveis e ausencia de texto de usuario.

## Testes de UX critico

- Proxima acao clara no dashboard.
- Poucas opcoes por tela.
- Modo baixa energia.
- Modo recomeco.
- Tempo para capturar no mobile.
- Metacognicao compreensivel e nao pesada.
- Placar sem vergonha.
- Jardim nao punitivo.
- Contraste, teclado e foco visivel.

## Testes de seguranca

- Secret scan.
- `.env.example` sem segredo real.
- Autorizacao server-side.
- Logs sem dados intimos.
- Consentimento registrado e revogavel.
- Mensagem ao Atalaia com previa.
- Exportacao/exclusao quando a fase existir.

## Testes de regressao

- Smoke E2E dos fluxos centrais antes de merge.
- Contratos de schemas de IA versionados.
- Snapshot de politicas RLS/matriz de acesso.
- Evals negativos de IA em cada PR que mexer em prompts, schemas ou guardrails.

## Criterios minimos para PR

- Escopo pequeno.
- Plano quando necessario.
- Checklist de PR preenchido.
- Docs atualizadas.
- Testes executados ou N/A justificado.
- Secret scan quando houver arquivos novos/alterados.
- Evidencia de aceite.
- `git status --short --branch` revisado.

## Cobertura minima futura

- 80%+ em regras de dominio e servicos criticos.
- 90%+ em autorizacao, consentimento, schemas de IA e Atalaia.
- 100% das migrations com teste de politica RLS quando houver Supabase.

Cobertura numerica nao substitui gates bloqueantes de seguranca, privacidade, IA e Atalaia.
