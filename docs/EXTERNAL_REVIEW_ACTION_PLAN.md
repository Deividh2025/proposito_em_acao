# Plano de acao da avaliacao externa - cutover Supabase, CI/CD e caminho para beta real

> Gerado a partir de avaliacao externa do repositorio em 2026-06-15.
> Segue o template obrigatorio de `PLANS.md` e o fluxo local-first + branches `codex/*` + PRs.
> Complementa (nao substitui) `docs/DEPLOYMENT_PLAN.md` (infra Hostinger/Coolify) e `docs/RELEASE_READINESS.md` (gates).

## Objetivo

Levar o produto de "V1 local ampla / pre-beta" para "beta real fechado", aplicando o backend na nuvem com evidencia fresca de RLS, estabelecendo CI/CD e governanca de release, e trocando o nucleo de `local-demo` para jornada persistida com Auth real.

## Contexto

Fontes consultadas: `README.md`, `docs/RELEASE_READINESS.md` (sync 2026-06-05), `docs/DEPLOYMENT_PLAN.md`, `PLANS.md`, `supabase/migrations/*`, `next.config.ts`, `scripts/run-e2e.mjs`, `playwright.config.ts`.

Estado verificado por avaliacao externa em 2026-06-15:

- Repo clonado; scan de segredos limpo; `.gitignore` abrangente; `.env.example` so com placeholders. Tratamento de `service_role` server-only exemplar.
- 17 migrations definem 38 tabelas + schema `app_private`. Todas as 38 usam `create table if not exists` (reaplicar e idempotente no nivel de tabela). RLS e habilitado em massa por loop dinamico em `202605310002_rls_policies.sql` (`execute format('alter table public.%I enable row level security', ...)`) mais `alter table` explicito nas migrations de modulo posteriores; 35 `create policy`. A cobertura de RLS so pode ser confirmada contra o banco ao vivo, nao por leitura estatica.
- Projeto Supabase na nuvem (`bceumcfmjftoukzrfthe`, sa-east-1, Postgres 17, ACTIVE_HEALTHY) contem apenas `public.energy_checkins` (0 linhas); schema `app_private` inexistente; 1 migration registrada (`mobile_pwa_prompt14_alignment`). O schema completo NAO esta aplicado na nuvem; o projeto cloud esta em estado parcial/inconsistente (prompt14 aplicado sem os predecessores). Advisors de seguranca limpos, porem limpos porque quase nao ha schema.
- GitHub: `main` sem branch protection efetiva (API retornou 403 em repo privado de plano gratuito), zero GitHub Actions de fato no repo, zero releases. (O doc menciona Actions "preparado", mas `.github/workflows/` estava vazio.)
- Gates locais passaram na ultima auditoria documentada (2026-06-04): lint, typecheck, test (190), build (44 paginas), e2e (33). Os gates de Supabase remoto (`db push`, `supabase:types:preview`, `supabase:validate:preview`) nunca rodaram por falta de credenciais/ambiente preview aprovado.

Decisoes ja fixadas (respeitar): local-first + branches `codex/*` + PRs pequenos e revisaveis; `service_role` nunca no cliente/`NEXT_PUBLIC_*`; sem fallback automatico entre providers de IA; IA real desativada por padrao; analytics opt-in desligado, retencao 90 dias; deploy alvo Hostinger VPS KVM1 + Coolify; producao aberta e beta bloqueados ate gates externos.

## Arquivos envolvidos

- Criar:
  - `docs/EXTERNAL_REVIEW_ACTION_PLAN.md` (este).
  - `.github/workflows/ci.yml` (entregue junto deste plano).
  - `.github/pull_request_template.md` (espelhar `docs/PR_CHECKLIST.md`) - Etapa 1.
  - `docs/RLS_LIVE_EVIDENCE.md` (evidencia fresca pos-cutover) - Etapa 2.
- Modificar (cada um em PR proprio, na sua etapa):
  - `next.config.ts` (CSP com nonce, remover `'unsafe-inline'`) - Etapa 5.
  - `src/lib/config` (apenas se `getServerEnv` exigir vars adicionais no CI).
  - `docs/RELEASE_READINESS.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md` a cada etapa.
- Nao tocar:
  - Nenhuma alteracao de schema fora de `supabase/migrations/`.
  - Nenhuma escrita direta de schema no projeto principal de producao sem aprovacao e sem o cutover validado em preview.

## Subagentes necessarios

- Agente Supabase/RLS: cutover em preview, typegen, `validate:preview`, evidencia de RLS.
- Agente DevOps/CI: workflow, branch protection, secrets no provedor, deploy Coolify.
- Agente Auth/Dados: Auth SSR real, troca de `local-demo` por persistencia no nucleo.
- Agente Seguranca/Privacidade: CSP por nonce, auditoria de historico do git, LGPD minima.

## Skills necessarias

- Skills do projeto em `.agents/skills/` (governanca/Codex).
- Externas: Supabase CLI 2.98.x, GitHub Actions, Playwright, Coolify/Hostinger.

## Riscos

- Seguranca/dados (ALTO ate validado): ha `grant select, insert, update, delete on all tables in schema public to authenticated`. Se qualquer tabela ficar sem RLS habilitado, usuarios autenticados leem linhas de outros. Como o RLS e aplicado parcialmente por loop dinamico, e obrigatorio confirmar `rowsecurity = true` nas 38 tabelas e a existencia de policy de dono por tabela antes de qualquer dado real.
- Estado inconsistente da nuvem (MEDIO): o projeto principal tem `prompt14` aplicado sem predecessores. Reaplicar a trilha completa por cima e idempotente nas tabelas, mas o historico de migrations do Supabase pode divergir. Mitigacao: fazer o cutover em projeto/branch preview limpo, nunca direto no principal.
- Escopo (MEDIO): nao expandir alem do PRD; cada etapa em PR proprio.
- Dependencia externa (MEDIO-BAIXO): stack bleeding-edge (Next 16, TS 6, React 19.2, openai 6, vitest 4) - versoes reais e instaladas, mas com churn de breaking changes; revisar pins antes de producao.
- UX/rollback: toda etapa precisa de rollback claro (secao abaixo); `main` sempre deployavel.

## Estrategia

Sequencia recomendada de execucao:

### Etapa 1 - CI/CD e governanca de release (baixo risco, nao toca infra)

1. Adicionar `.github/workflows/ci.yml`: job `quality` (`npm ci`, `lint`, `typecheck`, `test`, `build`) e job `e2e` (instalar chromium, `npm run test:e2e`), em `pull_request` e `push` para `main`.
2. Ativar branch protection no `main` exigindo os checks acima + 1 review. Nota: em repo privado de plano gratuito a API retorna 403. Opcoes: (a) GitHub Pro/Team; (b) manter o repo publico; (c) usar rulesets. Decidir e registrar em `docs/DECISIONS.md`.
3. Adicionar `.github/pull_request_template.md` espelhando `docs/PR_CHECKLIST.md`.

Aceite: um PR de teste mostra os checks obrigatorios verdes e o merge fica bloqueado sem eles.

### Etapa 2 - Cutover Supabase em preview com evidencia de RLS (risco ALTO, gate central)

1. Em ambiente/branch preview (NAO no projeto principal de producao), aplicar as 17 migrations em ordem (`supabase db push` ou `supabase migration up`).
2. Rodar `npm run supabase:types:preview` (regenera `src/types/database.ts`) e `npm run supabase:validate:preview` com as credenciais de operador (`SUPABASE_ACCESS_TOKEN`, `SUPABASE_PREVIEW_DB_URL`, `SUPABASE_PREVIEW_PROJECT_REF`, etc.).
3. Coletar evidencia fresca de RLS e gravar em `docs/RLS_LIVE_EVIDENCE.md`:
   - RLS por tabela:
     `select c.relname, c.relrowsecurity, c.relforcerowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' order by c.relname;`
   - Policies por tabela:
     `select schemaname, tablename, policyname, cmd, roles from pg_policies where schemaname in ('public','app_private') order by tablename, policyname;`
   - Advisors de seguranca e performance do Supabase (esperado: zero criticos).
   - Teste de isolamento: dois usuarios distintos; confirmar que A nao le linhas de B em tabelas sensiveis (`callings`, `metacognition_sessions`, `commitment_documents`, etc.).
4. Rodar `npm run typecheck` apos o typegen.

Aceite: `rowsecurity = true` em todas as 38 tabelas; toda tabela com pelo menos a policy de dono; teste de isolamento passa; advisors sem critico; `database.ts` regenerado e typecheck verde.

### Etapa 3 - Auth real e nucleo persistido (risco medio-alto)

1. Publicar URL HTTPS (imagem `standalone` do `Dockerfile` no Coolify/Hostinger; ver `docs/DEPLOYMENT_PLAN.md`).
2. Configurar Supabase Site URL/Redirect URLs e SMTP via Resend (`EMAIL_REAL_ENABLED=true`, dominio verificado); validar login/recuperacao com cookies reais (smoke de cookies).
3. Trocar `local-demo` por persistencia no nucleo: perfil -> Chamado Pessoal -> alvos SMART-E -> tarefas, lendo/escrevendo via RLS por usuario autenticado.

Aceite: um usuario real cria perfil, define Chamado, cria alvo e tarefa; os dados persistem e reaparecem apos logout/login; smoke externo passa nessas rotas.

### Etapa 4 - Smoke externo, secrets, LGPD e rollback (gate de pre-beta)

1. Secrets reais no provedor (nunca no repo); confirmar que nenhum `NEXT_PUBLIC_*` carrega segredo.
2. `npm run smoke:external` contra a URL publicada.
3. LGPD minima: consentimento versionado, exportacao e exclusao de conta funcionando.
4. Ensaiar o rollback (secao abaixo) e aprovar.

Aceite: checklists de `docs/BETA_CHECKLIST.md` e `docs/RELEASE_READINESS.md` verdes; rollback testado.

### Etapa 5 - Endurecimento de seguranca (paralelo, baixo risco)

1. CSP sem `'unsafe-inline'` em `script-src` (nonce por request) em `next.config.ts`.
2. Auditar o historico completo do git atras de segredos antigos (clone full + gitleaks); rotacionar o que aparecer.
3. Revisar pins das dependencias bleeding-edge.

Aceite: CSP sem `unsafe-inline` com o app funcionando; scan de historico limpo.

### Etapa 6 - Abrir beta real fechado

Pre-condicao: Etapas 1-4 verdes. Conduzir conforme `docs/BETA_PLAN.md`.

Limites (nao sera feito nesta sequencia): nenhuma chamada real a OpenAI/DeepSeek (IA segue off ate etapa propria); nenhum aumento de escopo de produto; nenhuma escrita de schema fora de migrations versionadas.

## Criterios de aceite

Macro: backend persistido com RLS provado ao vivo (38/38 tabelas); CI obrigatorio verde no `main`; nucleo persistido funcionando com usuario real; gates de pre-beta de `RELEASE_READINESS.md` satisfeitos. Cada etapa tem aceite proprio acima.

## Testes e verificacoes

Comandos exatos:

- `npm ci`
- `npm run lint`            # eslint . --max-warnings=0
- `npm run typecheck`       # tsc --noEmit
- `npm run test`            # vitest run
- `npm run build`           # next build
- `npm run test:e2e`        # build + next start + Playwright (chromium)
- `npm run supabase:types:preview`      # typegen (precisa de credenciais de operador)
- `npm run supabase:validate:preview`   # validacao RLS/preview (precisa de credenciais)
- SQL de evidencia de RLS (Etapa 2).

Resultado esperado: todos verdes; o SQL confirma RLS em 38/38 tabelas com policies por tabela.

## Rollback

- CI/branch protection: desabilitar a regra e remover o workflow. Sem impacto em runtime.
- Cutover preview: descartar a branch/projeto preview. Nunca aplicar no principal antes da aprovacao. Se aplicado e preciso reverter, `supabase migration down` ou restaurar backup do preview.
- Auth/nucleo persistido: feature flag de runtime de volta ao `local-demo` (`APP_RUNTIME_MODE=local-demo`, `*_REAL_ENABLED=false`); reverter o PR.
- CSP: reverter `next.config.ts` para o header anterior.
- Geral: cada etapa e um PR pequeno e revertivel; `main` sempre deployavel.

## Documentacao a atualizar

`docs/RELEASE_READINESS.md` (evidencia por etapa), `docs/CHANGELOG.md`, `docs/RLS_LIVE_EVIDENCE.md` (novo), `docs/DEPLOYMENT_PLAN.md` (se a infra mudar), `docs/ROLLBACK_PLAN.md`, `docs/DECISIONS.md` (decisao sobre branch protection / plano GitHub).

## Roadmap macro

Etapa 1 (CI/governanca) -> Etapa 2 (cutover Supabase + evidencia de RLS) -> Etapa 3 (Auth real + nucleo persistido) -> Etapa 4 (smoke/secrets/LGPD/rollback) -> Etapa 5 (hardening, em paralelo) -> Etapa 6 (beta real fechado) -> futuro: IA real e producao aberta.
