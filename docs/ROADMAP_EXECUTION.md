# Roadmap de Execucao

Regra central: avancar por PRs pequenos, com plano antes de codigo e documentacao atualizada.

## Fase 0 - Governanca e fontes de verdade

Artefatos:

- `README.md`
- `AGENTS.md`
- `PLANS.md`
- `.agents/skills/`
- `docs/source/`
- `docs/PRODUCT_VISION.md`
- `docs/PRD.md`
- `docs/MVP_SCOPE.md`
- `docs/USER_FLOWS.md`
- `docs/DOMAIN_MODEL.md`
- `docs/AI_ARCHITECTURE.md`
- `docs/DATABASE_SCHEMA_DRAFT.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/UX_UI_GUIDE.md`
- `docs/TESTING_STRATEGY.md`
- `docs/METACOGNITION_MODULE.md`
- `docs/AI_GUARDRAILS.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/OPEN_QUESTIONS.md`

Criterio: fontes de verdade existem, sao navegaveis e nenhuma funcionalidade foi implementada.

## Fase 1 - Stack e arquitetura

Decidir stack, arquitetura web, padroes de pastas, runtime, CI basico, scripts de lint/typecheck/test/build, estrategia de IA, estrategia de logs, arquitetura de consentimento e desenho tecnico de Supabase/Auth/RLS.

Nao criar funcionalidades profundas antes da decisao de stack.

## Fase 2 - Supabase, Auth e RLS

Criar/conectar projeto Supabase em etapa propria, autenticacao, schema inicial, migrations, RLS, storage privado, secrets server-side, matriz de acesso e testes de dono/nao dono/anonimo/Atalaia.

Status da Etapa 3 Prompt 4: migrations, RLS, storage, clientes Supabase e documentacao foram preparados no repositorio. Aplicacao no projeto remoto depende de credenciais administrativas/CLI.

## Fase 3 - Design system e shell do app

Criar layout base, navegacao, componentes fundamentais, estados vazios, loading, erro, acessibilidade e diretrizes TDAH-first.

## Fase 4 - Onboarding e direcao

Perfil, consentimentos, Mapa da Vida, Chamado Pessoal e dashboard inicial.

## Fase 5 - Execucao

Alvos SMART-E, projetos, tarefas, microtarefas, calendario e inbox/GTD.

## Fase 6 - Apoio a acao

Desbloqueador de Acao, Metacognicao, Modo Foco e captura de distracoes.

## Fase 7 - Constancia

Habitos, Placar da Disciplina, Revisao Semanal e Jardim da Vida simples.

## Fase 8 - Responsabilidade externa

Atalaia basico por alvo, Documento de Compromisso, Alavancas de Compromisso, previa de mensagens, e-mails e revogacao.

## Fase 9 - PWA/mobile complementar

Captura rapida, habitos, Placar, foco curto, Desbloqueador, Metacognicao rapida e energia.

## Fase 10 - QA, seguranca, privacidade e deploy

E2E, evals de IA, matriz RLS, hardening de logs, LGPD, acessibilidade, performance, deploy e monitoramento.

## Criterio de avanco

So avancar de fase quando escopo, riscos, testes, privacidade, documentacao e aceite estiverem claros.

## Nao fazer no bootstrap

Nao implementar frontend do SaaS, banco de dados, projeto Supabase, autenticacao, chamadas reais a OpenAI API, telas finais, deploy ou prompt final de produto.
