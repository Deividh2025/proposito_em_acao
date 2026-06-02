# AGENTS.md

## Identidade do projeto

Projeto: Proposito em Acao.

Produto: SaaS desktop-first de vida intencional, foco, execucao, habitos, autorregulacao e produtividade assistida por IA, com PWA/mobile complementar para acoes rapidas.

Eixo do produto: Chamado Pessoal antes de agenda. O sistema deve partir da direcao de vida e transformar essa direcao em alvos, projetos, tarefas, habitos e calendario.

Regra central: a V1 deve ser completa em largura e controlada em profundidade. Todos os modulos principais devem existir, ainda que alguns nascam simples.

## Fontes de verdade

- `docs/source/prd_proposito_em_acao.md` e o PRD original sao a fonte raiz de escopo.
- `docs/PRODUCT_VISION.md` define visao, proposta de valor e limites do produto.
- `docs/PRD.md` e a fonte operacional de requisitos da V1.
- `docs/MVP_SCOPE.md` define largura/profundidade da V1.
- `docs/USER_FLOWS.md` define fluxos principais.
- `docs/DOMAIN_MODEL.md` e `docs/DATABASE_SCHEMA_DRAFT.md` orientam dominio e banco futuro.
- `docs/AI_ARCHITECTURE.md`, `docs/AI_GUARDRAILS.md` e `docs/METACOGNITION_MODULE.md` orientam IA e Metacognicao.
- `docs/SECURITY_PRIVACY.md` e `docs/DATA_SENSITIVITY_MATRIX.md` orientam seguranca, privacidade, consentimento, Atalaia e LGPD.
- `docs/UX_UI_GUIDE.md` define UX TDAH-first.
- `docs/TESTING_STRATEGY.md` e `docs/ACCEPTANCE_CRITERIA.md` definem qualidade e aceite.
- `AGENTS.md` rege como Codex e agentes devem trabalhar neste repositorio.
- `PLANS.md` rege execucao por etapas.
- `docs/DECISIONS.md` registra decisoes de produto, arquitetura e governanca.
- Mudancas relevantes em arquitetura, IA, banco, UX, seguranca ou escopo devem atualizar a documentacao correspondente.

## Regras de trabalho do Codex

1. Inspecionar antes de alterar arquivos.
2. Preservar tudo que ja existir; nao apagar nem sobrescrever sem justificativa clara.
3. Planejar antes de codar em toda tarefa complexa, multi-arquivo, sensivel ou que mude comportamento de produto.
4. Usar subagentes quando houver multiplos dominios, risco alto, revisao especializada ou trabalho paralelizavel.
5. Trabalhar em escopos pequenos e revisaveis.
6. Nao criar funcionalidades fora do PRD sem aprovacao explicita.
7. Nao escolher stack definitiva sem uma etapa propria de arquitetura.
8. Reportar bloqueios, suposicoes e comandos nao executados.
9. Nunca mascarar risco de seguranca, privacidade, IA ou escopo.

## Limites historicos da etapa de bootstrap

A etapa inicial de bootstrap nao deveria implementar frontend do SaaS, banco de dados, autenticacao, projeto Supabase, chamadas reais a OpenAI API, deploy, telas finais ou prompts finais de produto.

## Limites da etapa atual de Supabase/Auth/RLS

Nesta etapa e permitido criar migrations, policies, storage privado, clientes Supabase seguros, tipos preparatorios, testes/cenarios RLS, documentacao tecnica e skills locais relacionadas. Nao implementar UI completa, onboarding completo, Chamado funcional, Metacognicao funcional, chamadas reais a OpenAI, deploy, uso de service role no frontend ou acesso amplo de Atalaia.

## Limites da etapa atual de Onboarding e Direcao

Prompt 6 autoriza implementar o fluxo inicial de onboarding: perfil essencial, Mapa da Vida, Chamado Pessoal em discernimento, hipotese provisoria e dashboard inicial. A etapa continua proibindo alvos completos, projetos, tarefas, calendario funcional, Metacognicao funcional, Desbloqueador funcional, habitos, Placar completo, Atalaia funcional, deploy, OpenAI real sem autorizacao/configuracao e acesso amplo a dados sensiveis. Sem Auth/Supabase aplicado, qualquer persistencia deve ser apresentada como fallback local/dev e nao como dado produtivo confirmado.

## Limites da etapa atual de Alvos, Projetos e Tarefas

Prompt 8 autoriza implementar o nucleo de execucao: alvos SMART-E revisaveis, projetos, tarefas, microtarefas, proxima acao, mocks seguros e persistencia Supabase preparada por server actions. A etapa continua proibindo calendario funcional, inbox funcional, habitos funcionais, Placar completo, Metacognicao funcional, Desbloqueador funcional, Atalaia funcional, deploy, OpenAI real acionada por UI e qualquer uso de service role no frontend. Sem Auth/Supabase aplicado, persistencia deve ser fallback local/dev e nao dado produtivo confirmado.

## Limites da etapa atual de Calendario e Inbox/GTD

Prompt 9 autoriza implementar calendario de execucao simples, visao semanal, visao diaria, blocos de tempo, agendamento/reagendamento, alerta basico de sobrecarga, caixa de entrada, captura rapida, classificacao mock/IA preparada e processamento revisavel. A etapa continua proibindo Desbloqueador funcional, Metacognicao funcional, Modo Foco funcional, habitos completos, Placar completo, Atalaia funcional, revisao semanal funcional, Jardim funcional, deploy, OpenAI real acionada por UI, integracoes externas de calendario, drag-and-drop obrigatorio, recorrencia avancada e qualquer uso de service role no frontend. Sem Auth/Supabase aplicado, persistencia deve ser fallback local/dev e nao dado produtivo confirmado.

## Limites da etapa atual de Desbloqueador e Metacognicao

Prompt 10 autoriza implementar Desbloqueador de Acao funcional, Metacognicao funcional, mocks seguros, schemas estruturados, historico privado, persistencia Supabase preparada por server actions, guardrails clinicos/pastorais/de crise e evals principais. A etapa continua proibindo Modo Foco completo, habitos completos, Placar completo, Atalaia funcional, revisao semanal funcional, Jardim funcional, deploy, OpenAI real acionada por UI, compartilhamento automatico de Metacognicao, diagnostico clinico, terapia profunda, afirmacao de vontade divina especifica e qualquer uso de service role no frontend. Sem Auth/Supabase aplicado, persistencia deve ser fallback local/dev e nao dado produtivo confirmado.

## Limites da etapa atual de Foco, Habitos e Placar

Prompt 11 autoriza implementar Modo Foco/Pomodoro, captura de distracoes, conclusao de foco, habitos com IA mockada/real preparada, marcacao diaria de habitos, Placar da Disciplina, retomadas, indicadores leves, migrations preparatorias, RLS owner-only, testes e documentacao. A etapa continua proibindo Atalaia funcional, compartilhamento de Placar com Atalaia, Revisao Semanal funcional, Jardim funcional, Modo Foco mobile/PWA completo, integracoes externas de calendario, deploy, OpenAI real acionada por UI sem autorizacao/configuracao e qualquer uso de service role no frontend. Sem Auth/Supabase aplicado, persistencia deve ser fallback local/dev e nao dado produtivo confirmado.

## Limites da etapa atual de PWA/Mobile Complementar

Prompt 14 autoriza implementar PWA responsivo complementar, manifest, icones PWA simples, service worker seguro, shell `/mobile`, captura rapida, marcacao rapida de habitos e Placar, foco curto, Desbloqueador rapido, Metacognicao rapida, check-in de energia, migration `energy_checkins`, RLS owner-only, testes e documentacao. A etapa continua proibindo app nativo, push notifications, fila offline sensivel, cache de dados sensiveis, calendario mobile complexo, edicao profunda de projetos/tarefas, Atalaia mobile funcional, deploy, OpenAI real acionada pela UI e qualquer uso de service role no frontend. Sem Auth/Supabase aplicado, persistencia deve ser fallback local/dev e nao dado produtivo confirmado.

## Limites da etapa atual de QA final V1

Prompt 15 autoriza QA final, testes automatizados/manuais criticos, auditoria de seguranca, RLS, IA, UX TDAH-first, PWA/mobile, correcoes indispensaveis, Auth basico faltante, relatorios e checklist de release. A etapa continua proibindo funcionalidades novas fora da V1, relaxar seguranca para passar teste, desabilitar RLS, expor secrets, ativar OpenAI real sem decisao, aplicar migrations/deploy produtivo sem aprovacao e declarar pronto para producao sem validar Supabase/RLS/Auth reais.

## Limites da etapa atual de Beta Fechado e Observabilidade

Prompt 17 autoriza preparar beta fechado, observabilidade basica, metricas de produto, eventos seguros de analytics, feedback beta, triagem de bugs/feedback, suporte, incident response, monitoramento pos-deploy, skills operacionais e plano V1.1. A etapa continua proibindo grandes funcionalidades novas, analytics com conteudo sensivel, coleta real sem consentimento/LGPD/retencao, beta com usuarios reais antes de preview/Supabase/RLS/Auth/smoke publicados, OpenAI/DeepSeek/e-mail real sem aprovacao operacional, deploy produtivo aberto e mudancas de migrations sem plano proprio.

## Skills locais obrigatorias por dominio

- Produto/escopo: `prd-product-skill`.
- Documentacao: `docs-sync-skill`.
- Plano: `execution-plan-skill`.
- Regras operacionais: `agents-md-skill`.
- Seguranca/privacidade: `security-privacy-skill`.
- IA/guardrails: `ai-guardrails-skill`.
- UX TDAH-first: `ux-tdah-first-skill`.
- Metacognicao: `metacognition-skill`.
- Modelo de dominio: `domain-model-skill`.
- Structured outputs de IA: `ai-structured-output-skill`.
- Supabase/RLS: `supabase-rls-skill`.
- Migrations de banco: `database-migration-skill`.
- Auth seguro: `auth-security-skill`.
- Atalaia/permissoes: `accountability-permission-skill`.
- Testes RLS: `rls-testing-skill`.
- Alvos SMART-E: `smart-goals-skill`.
- Planejamento de projetos: `project-planning-skill`.
- Tarefas/microtarefas: `task-breakdown-skill`.
- Dominio de execucao: `execution-domain-skill`.
- Calendario de execucao: `calendar-execution-skill`.
- Inbox/GTD: `gtd-inbox-skill`.
- Trabalho recorrente simples: `recurring-work-skill`.
- Sobrecarga de agenda: `schedule-overload-skill`.
- Classificador de inbox: `inbox-classifier-skill`.
- Desbloqueador de Acao: `action-unblocker-skill`.
- Reflexao TCC/metacognitiva: `cbt-reflection-skill`.
- Crise emocional: `crisis-guardrail-skill`.
- Dados reflexivos privados: `private-reflection-data-skill`.
- Modo Foco: `focus-mode-skill`.
- Design de habitos: `habit-design-skill`.
- Placar: `scoreboard-skill`.
- Captura de distracoes: `distraction-capture-skill`.
- Medicao de retomadas: `restart-tracking-skill`.
- PWA/mobile: `pwa-mobile-skill`.
- Captura mobile: `mobile-capture-skill`.
- Interacao rapida: `fast-interaction-skill`.
- Privacidade mobile: `mobile-privacy-skill`.
- Baixa energia mobile: `mobile-low-energy-skill`.
- QA final V1: `qa-final-v1-skill`.
- Release readiness: `release-readiness-skill`.
- Auditoria de seguranca: `security-audit-skill`.
- Testes de regressao: `regression-testing-skill`.
- Operacao beta: `beta-operations-skill`.
- Analytics de produto: `product-analytics-skill`.
- Triagem de feedback: `feedback-triage-skill`.
- Triagem de bugs: `bug-triage-skill`.
- Roadmap V1.1: `v1-1-roadmap-skill`.

## Git e GitHub

- Branch principal: `main`.
- Branches futuras devem seguir escopo claro, por exemplo `chore/bootstrap-repo-governance`, `docs/product-sources-of-truth`, `feat/onboarding-profile`, `security/supabase-rls-baseline`.
- Commits devem preferir Conventional Commits, por exemplo `chore: bootstrap project governance`.
- PRs devem ser pequenos, com checklist preenchido e revisao humana/Codex/CodeRabbit quando disponivel.
- GitHub remoto recomendado: repositorio privado `proposito-em-acao`.

## Seguranca e privacidade

- Nunca commitar `.env`, `.env.local`, secrets, tokens, chaves ou credenciais.
- `.env.example` deve conter somente placeholders.
- Dados de fe, saude, familia, financas, emocoes, Chamado, Metacognicao, Atalaia, calendario, habitos e revisoes sao sensiveis.
- Dados sensiveis devem ser privados por padrao, coletados com finalidade clara e minimizados.
- Logs nao devem conter conteudo intimo, prompts privados, respostas brutas de IA ou dados sensiveis desnecessarios.
- Consentimentos devem ser granulares, versionados, auditaveis e revogaveis.
- Acoes sensiveis exigem validacao server-side quando a stack existir.

## Supabase

- Toda tabela em schema exposto deve ter Row Level Security habilitado.
- Politicas devem refletir o modelo real de acesso por usuario, escopo e, quando aplicavel, alvo.
- Roles e permissoes de autorizacao nao devem depender de metadata editavel pelo usuario. Preferir `app_metadata` ou tabelas server-managed.
- `service_role` ou secret key nunca podem ir para cliente, browser, mobile ou logs.
- Storage deve ser privado por padrao.
- Views expostas devem respeitar RLS; em Postgres 15+, preferir `security_invoker = true`.
- Funcoes `security definer` nao devem ficar em schema exposto.
- Atalaia deve acessar apenas dados autorizados por alvo, por permissao granular e com revogacao efetiva.

## IA

- IA e camada operacional integrada, nao chatbot solto.
- Saidas de IA que virarem dados devem usar schemas estruturados e validacao.
- IA nao deve diagnosticar, substituir terapia, prometer cura, afirmar vontade divina especifica, usar culpa espiritual, humilhar ou manipular.
- Fluxos com risco emocional grave devem orientar ajuda humana adequada, nao tratar crise como simples produtividade.
- Mudancas em Chamado, Metacognicao, Desbloqueador de Acao, Revisao Semanal ou Atalaia exigem revisao de guardrails.

## Metacognicao

- Privada por padrao.
- Nao e terapia nem atendimento clinico.
- Deve separar fato, interpretacao, sentimento e impulso.
- Pode confrontar autoengano, vitimizacao e fuga de responsabilidade sem humilhar.
- Deve terminar com microacao, descanso legitimo, oracao/reflexao opcional ou encaminhamento adequado.
- Compartilhamento com Atalaia so pode ocorrer por selecao manual e consentimento explicito.

## Atalaia

- Vinculado a alvo especifico, nunca a conta inteira.
- Consentimento granular, revogavel e auditavel.
- Acesso minimo: status, progresso, marcos e pedidos autorizados.
- Excluir por padrao: Chamado completo, Metacognicao, saude, familia, financas, emocoes e revisoes privadas.
- Mensagens ao Atalaia devem ter previa clara do que sera enviado.

## Definition of Done

Uma tarefa so pode ser concluida quando:

- O escopo corresponde ao PRD ou a decisao aprovada.
- O plano foi executado ou desvios foram documentados.
- Documentacao foi atualizada quando houve mudanca relevante.
- Nenhum secret ou dado sensivel entrou no diff.
- RLS/politicas foram revisadas quando houver Supabase.
- Schemas e guardrails foram revisados quando houver IA.
- Lint, typecheck, testes e build passam quando a stack existir.
- Limitacoes, riscos pendentes e proximos passos foram declarados.

## Checklist antes de concluir

- `git status --short --branch` revisado.
- Arquivos criados/alterados listados.
- Verificacoes executadas e resultados registrados.
- Documentacao sincronizada.
- Nenhuma funcionalidade fora de escopo adicionada.
- Nenhuma acao externa pendente foi apresentada como concluida.

## Como lidar com duvidas

Se a duvida for discoverable no repositorio, inspecione primeiro. Se for preferencia de produto, tradeoff de arquitetura, risco de privacidade ou decisao comercial, pergunte ou registre uma suposicao explicita quando a decisao for segura.
