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
