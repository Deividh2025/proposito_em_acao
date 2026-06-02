# Prompt 14 Execution Plan

## Objetivo

Entregar PWA/mobile complementar para acoes rapidas, com captura, habitos, Placar, foco curto, Desbloqueador, Metacognicao e energia sem copiar o desktop.

## Contexto

Fontes obrigatorias revisadas: `AGENTS.md`, `PLANS.md`, `README.md`, PRD, escopo MVP, visao, fluxos, dominio, banco, RLS, seguranca, matriz de sensibilidade, UX, design system, IA, calendario, inbox, Desbloqueador, Metacognicao, foco, habitos, Placar, aceite, changelog e decisoes.

Estado atual: Prompt 12/13 ainda deixa muitos arquivos modificados no checkout; essas alteracoes devem ser preservadas. A base ja tem server actions e fallback local/dev para Inbox, Habitos, Placar, Foco, Desbloqueador e Metacognicao. Falta camada `/mobile`, manifest, service worker seguro, check-in de energia e docs dedicadas.

Decisao operacional segura: implementar PWA responsivo complementar, nao app nativo. Offline fica restrito a assets estaticos e pagina offline; sem cache de dados sensiveis.

## Arquivos envolvidos

- Criar: `public/manifest.json`, `public/sw.js`, `public/icons/*`, `src/app/mobile/**`, `src/app/offline/page.tsx`, `src/components/mobile/**`, `src/components/pwa/PwaRegister.tsx`, `src/domain/energy/**`, `docs/PWA_MOBILE_MODULE.md`, `docs/MOBILE_PRIVACY.md`, `docs/MOBILE_UX_GUIDE.md`, skills locais mobile.
- Modificar: `src/app/layout.tsx`, `next.config.ts`, `src/components/layout/MobileShell.tsx`, `src/lib/design/navigation.ts`, `docs/PRD.md`, `docs/UX_UI_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md`, `README.md`, `AGENTS.md`.
- Nao tocar: service role no cliente, OpenAI real acionada pela UI, push notifications, app nativo, calendario mobile complexo, Atalaia mobile funcional.

## Subagentes necessarios

1. Produto/Mobile Complementar: limitar escopo e aceite.
2. UX TDAH-first Mobile: reduzir toques e carga.
3. Frontend/PWA: rotas, manifest, SW e responsividade.
4. Backend/Supabase: tabelas, actions, RLS e sincronizacao.
5. IA Mobile: reutilizar schemas e mocks de Desbloqueador/Metacognicao.
6. Seguranca/Privacidade: cache, storage, tokens e Metacognicao.
7. QA Mobile: viewport, E2E, PWA e regressao.
8. Documentacao: docs, decisoes, changelog e pendencias.

## Skills necessarias

`prd-product-skill`, `ux-tdah-first-skill`, `design-system-skill`, `supabase-rls-skill`, `security-privacy-skill`, `ai-structured-output-skill`, `ai-guardrails-skill`, `docs-sync-skill`, `execution-plan-skill`, `focus-mode-skill`, `habit-design-skill`, `scoreboard-skill`, `action-unblocker-skill`, `metacognition-skill`, `low-energy-mode-skill`, `private-reflection-data-skill`.

## Riscos

- Mobile virar desktop compactado.
- Cache/Service Worker armazenar conteudo intimo.
- Metacognicao ou Inbox bruta irem para localStorage, CacheStorage, logs ou Atalaia.
- Prometer sincronizacao real quando a sessao/Supabase nao esta aplicada.
- Criar check-in de energia sem RLS owner-only.
- Criar fluxos de IA paralelos sem schema e guardrails.
- Duplicidade por double tap sem idempotencia completa.

## Estrategia

1. Criar testes RED para dominio de energia e E2E mobile.
2. Implementar `src/domain/energy`, action server-side e migration `energy_checkins` owner-only.
3. Criar PWA minimo: manifest, icones PWA simples, SW restrito a assets/offline e registro client-side.
4. Criar rotas `/mobile/*` e componentes enxutos, delegando para actions existentes.
5. Atualizar navigation mobile para apontar para a superficie complementar.
6. Criar skills locais mobile.
7. Sincronizar docs e criterios de aceite.
8. Rodar lint, typecheck, build, unit tests e E2E.

## Criterios de aceite

- `/mobile` existe como hub complementar.
- Captura, Habitos, Placar, Foco, Desbloqueador, Metacognicao e Energia funcionam em fluxo curto.
- Manifest e SW existem sem cache inseguro de dados sensiveis.
- Energia tem contrato, action e migration owner-only.
- IA mobile reutiliza schemas existentes e mock seguro.
- Docs, skills e aceite estao atualizados.
- Testes principais passam ou falhas ficam justificadas.

## Testes e verificacoes

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd run test`
- `npm.cmd run test:e2e`

RLS real por persona depende de Supabase CLI/projeto aplicado; nesta etapa sera revisado estaticamente e documentado como pendencia se o CLI continuar indisponivel.

## Rollback

Remover arquivos `src/app/mobile/**`, `src/components/mobile/**`, `src/domain/energy/**`, `src/components/pwa/PwaRegister.tsx`, `public/manifest.json`, `public/sw.js`, `public/icons/**`, migration Prompt 14 e reverter docs/navigation/layout/next config tocados nesta etapa.

## Documentacao a atualizar

`docs/PWA_MOBILE_MODULE.md`, `docs/MOBILE_PRIVACY.md`, `docs/MOBILE_UX_GUIDE.md`, `docs/DEPLOYMENT_PLAN.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md`, `README.md`, `AGENTS.md`.
