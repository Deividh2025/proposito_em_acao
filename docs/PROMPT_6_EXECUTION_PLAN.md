# Prompt 6 - Onboarding, Mapa da Vida e Chamado

## Objetivo

Entregar o primeiro fluxo funcional de direcao do usuario: boas-vindas, perfil essencial, Mapa da Vida, sessao de Chamado Pessoal, hipotese provisoria e dashboard inicial.

## Contexto

Fontes consultadas: `AGENTS.md`, `PLANS.md`, `docs/source/prd_proposito_em_acao.md`, `docs/PRD.md`, `docs/MVP_SCOPE.md`, `docs/USER_FLOWS.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_GUARDRAILS.md`, `docs/SECURITY_PRIVACY.md`, `docs/UX_UI_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, migrations Supabase e estrutura `src/`.

O checkout ja possui Supabase/Auth/RLS em migrations e clients, mas nao possui Auth UI, projeto remoto aplicado nem OpenAI real autorizado. Portanto a entrega deve incluir caminho Supabase server-side preparado e fallback local/mock explicitamente identificado para desenvolvimento.

## Arquivos envolvidos

- Criar: componentes de onboarding, life map, calling e dashboard; dominio de onboarding; schema/mock/guardrails de Chamado; docs e skills locais do Prompt 6; testes unitarios e E2E.
- Modificar: paginas `/onboarding` e `/dashboard`, navegacao, docs de IA, seguranca, banco, testes e changelog.
- Nao tocar: alvos, projetos, tarefas, calendario funcional, Metacognicao funcional, Desbloqueador, habitos, Placar funcional, Atalaia funcional, deploy e chamadas reais OpenAI.

## Subagentes necessarios

- Produto/Onboarding.
- UX TDAH-first.
- Frontend.
- Backend/Supabase/RLS.
- IA/Chamado.
- Seguranca/Privacidade.
- QA/Testes.
- Documentacao.

## Skills necessarias

`prd-product-skill`, `ux-tdah-first-skill`, `design-system-skill`, `supabase-rls-skill`, `database-migration-skill`, `auth-security-skill`, `rls-testing-skill`, `security-privacy-skill`, `ai-structured-output-skill`, `ai-guardrails-skill`, `docs-sync-skill`, `execution-plan-skill`, `nextjs-tailwind-skill`, `testing-architecture-skill`, `frontend-playwright-qa-skill`.

## Riscos

- Escopo: avancar para alvos/projetos/tarefas antes da etapa correta.
- Privacidade: coletar fe, familia, emocoes, Chamado e Mapa sem minimizacao ou nota clara.
- IA: linguagem determinista sobre vontade divina ou diagnostico.
- Supabase: claims de persistencia real sem Auth/env/migrations aplicadas.
- UX: onboarding longo demais e com cara de formulario burocratico.

## Estrategia

1. Criar testes unitarios vermelhos para dominio, schema, mock e progressao.
2. Implementar dominio puro e mock seguro.
3. Implementar server action de salvamento com Supabase quando houver sessao e fallback local explicitamente marcado.
4. Implementar UI client-side com salvamento parcial, retomada e feedback visual.
5. Implementar dashboard inicial com estado da jornada e progresso assistido.
6. Criar docs e skills locais novas.
7. Rodar lint, typecheck, build, tests e E2E quando possivel.

## Criterios de aceite

- Usuario percorre onboarding, preenche perfil, Mapa e Chamado.
- Mapa da Vida mostra leitura visual imediata.
- Hipotese de Chamado usa mock seguro e editavel.
- Dados podem ser enviados ao caminho Supabase server-side quando Auth/env existem; em dev sem Auth, fallback local fica claro.
- RLS existente protege as tabelas usadas.
- Dashboard mostra direcao, resumo do Mapa, proxima etapa e modulos limitados.
- Docs e skills novas existem.

## Testes e verificacoes

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd run test`
- `npm.cmd run test:e2e`
- Browser QA local em `http://127.0.0.1:3000` quando a build subir.

## Rollback

Remover os arquivos criados nesta etapa, restaurar `src/app/onboarding/page.tsx`, `src/app/dashboard/page.tsx` e docs alteradas ao estado anterior pelo diff. Nenhuma migration remota ou deploy deve ser aplicado nesta etapa.

## Documentacao a atualizar

`docs/ONBOARDING_FLOW.md`, `docs/LIFE_MAP_MODULE.md`, `docs/CALLING_MODULE.md`, `docs/PROGRESSIVE_UNLOCK.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_GUARDRAILS.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATABASE_SCHEMA.md`, `docs/TESTING_STRATEGY.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md`.
