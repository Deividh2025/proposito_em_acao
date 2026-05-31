# Prompt 7 - IA central, structured outputs e guardrails

## Objetivo

Implementar a base tecnica da camada central de IA: agentes internos, schemas Zod, prompts versionados, guardrails, providers real/mock, base de conhecimento placeholder, logs seguros e evals iniciais.

## Contexto

Fontes consultadas: `AGENTS.md`, `PLANS.md`, `README.md`, `docs/PRD.md`, `docs/PRODUCT_VISION.md`, `docs/MVP_SCOPE.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_GUARDRAILS.md`, `docs/METACOGNITION_MODULE.md`, `docs/CALLING_MODULE.md`, `docs/DOMAIN_MODEL.md`, `docs/DATABASE_SCHEMA.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/OPENAI_INTEGRATION_PLAN.md`, `docs/TESTING_STRATEGY.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md` e `docs/DECISIONS.md`.

Prompt 6 esta presente no working tree com onboarding, Mapa da Vida, Chamado em discernimento, dashboard inicial, schema `calling_draft_v1`, mock seguro e fallback local/dev. OpenAI real continua desativada por padrao.

Docs oficiais atuais da OpenAI foram consultadas para confirmar que novos projetos devem preferir Responses API e que Structured Outputs exigem schemas estritos, com campos requeridos.

## Arquivos envolvidos

- Criar:
  - `src/lib/openai/errors.ts`
  - `src/lib/openai/provider.ts`
  - `src/lib/openai/mockProvider.ts`
  - `src/lib/openai/safeInvoke.ts`
  - novos schemas em `src/ai/schemas/`
  - prompts versionados em `src/ai/prompts/`
  - guardrails por dominio em `src/ai/guardrails/`
  - eval cases e testes em `src/ai/evals/` e `src/tests/unit/`
  - `knowledge/` com READMEs por dominio
  - docs `AI_AGENTS.md`, `AI_SCHEMAS.md`, `AI_EVALS.md`, `KNOWLEDGE_BASE.md`
  - skills locais novas pedidas no prompt.
- Modificar:
  - `src/lib/openai/client.ts`
  - `src/lib/openai/index.ts`
  - `src/ai/agents/catalog.ts` e `src/ai/agents/index.ts`
  - barrels de schemas/guardrails
  - docs de IA, seguranca, Metacognicao, testes, changelog e decisoes.
- Nao tocar:
  - UI completa de Metacognicao, Atalaia, alvos, projetos, tarefas, calendario e deploy.
  - migrations Supabase existentes, salvo documentacao.
  - secrets, `.env`, `.env.local` ou qualquer chave real.

## Subagentes necessarios

- Arquiteto de IA: consolidou core server-side, contratos por agente e riscos de acoplamento.
- Especialista OpenAI/Structured Outputs: recomendou Responses API, Zod, strict schemas, mock validado e `server-only`.
- Prompt Engineer: recomendou prompts pequenos/versionados, sem prompt gigante e com contexto minimo.
- Seguranca de IA/Guardrails: definiu bloqueios clinicos, pastorais, privacidade, Atalaia e crise.
- Backend/Infra IA: apontou lacunas em provider, fallback, logging seguro e isolamento de secrets.
- QA/Evals de IA: definiu testes de schema, mocks, fallback, guardrails e evals negativos.
- Documentacao: apontou docs a sincronizar, duplicacoes e decisoes a registrar.

## Skills necessarias

`openai-integration-skill`, `ai-structured-output-skill`, `ai-guardrails-skill`, `metacognition-skill`, `security-privacy-skill`, `docs-sync-skill`, `execution-plan-skill`, `prd-product-skill`, `skill-creator`, `superpowers:test-driven-development`, `superpowers:verification-before-completion`.

## Riscos

- OpenAI client ser importado no client bundle.
- Mock do Prompt 6 virar padrao informal para IA real.
- Prompts brutos ou respostas brutas entrarem em logs.
- Metacognicao virar terapia ou diagnostico.
- Chamado virar sentenca espiritual ou afirmacao de vontade divina.
- Atalaia receber dados privados sem consentimento.
- Structured outputs divergirem dos schemas locais.
- Docs duplicadas driftarem.

## Estrategia

1. Criar testes unitarios/evals primeiro para contratos de schemas, providers e guardrails.
2. Implementar schemas Zod para todos os outputs exigidos.
3. Implementar provider interface, mock provider e safe invoke server-side com metadados seguros.
4. Fortalecer OpenAI client com `server-only`, sem chamada real automatica.
5. Criar prompts markdown versionados por agente, com contexto minimo e limites.
6. Criar guardrails deterministas iniciais para clinico, pastoral, privacidade, Atalaia e Metacognicao.
7. Criar knowledge base placeholder, sem material real nem vector store ativo.
8. Atualizar docs e registrar decisoes/pendencias.
9. Rodar lint, typecheck, build e test.

## Criterios de aceite

- Camada central de IA existe sem ativar fluxo visual final.
- Providers real/mock existem e mock e validado pelo mesmo contrato.
- `OPENAI_API_KEY` fica server-side e sem `NEXT_PUBLIC_*`.
- Agentes internos tem contratos de entrada/saida, schema, prompt e guardrails.
- Todos os schemas pedidos existem e sao exportados.
- Prompts internos estao versionados.
- Guardrails clinicos, pastorais, privacidade, Metacognicao e Atalaia existem.
- Knowledge base placeholder existe com limites claros.
- Evals/testes iniciais cobrem schema, mock, fallback e bloqueios.
- Docs sincronizadas.

## Testes e verificacoes

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test`

Se algum comando falhar por causa preexistente do Prompt 6, registrar evidencia, corrigir se for seguro e dentro do escopo, ou declarar pendencia.

## Rollback

Reverter os arquivos criados nesta etapa e restaurar apenas os arquivos modificados pelo Prompt 7 via diff da branch `codex/ai-central-layer`. Nao apagar nem reverter alteracoes preexistentes do Prompt 6.

## Documentacao a atualizar

- `docs/AI_ARCHITECTURE.md`
- `docs/AI_GUARDRAILS.md`
- `docs/OPENAI_INTEGRATION_PLAN.md`
- `docs/AI_AGENTS.md`
- `docs/AI_SCHEMAS.md`
- `docs/AI_EVALS.md`
- `docs/KNOWLEDGE_BASE.md`
- `docs/METACOGNITION_MODULE.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/TESTING_STRATEGY.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/CHANGELOG.md`
- `docs/DECISIONS.md`
