# Relatório de Sessão — 2026-06-18

Repositório: `Deividh2025/proposito_em_acao` (público) · Branch principal: `main`

Resumo das tarefas executadas nesta sessão, em ordem, com artefatos, evidências e decisões.

---

## Índice

1. [Artefatos de avaliação externa + registro do cutover (PR #20)](#1-artefatos-de-avaliação-externa--registro-do-cutover-pr-20)
2. [Confirmação de conclusão](#2-confirmação-de-conclusão)
3. [Scan de segredos no histórico completo (gitleaks)](#3-scan-de-segredos-no-histórico-completo-gitleaks)
4. [CSP com nonce por request, sem `unsafe-inline` em produção (PR #21)](#4-csp-com-nonce-por-request-sem-unsafe-inline-em-produção-pr-21)
5. [Revisão de código do diff de CSP](#5-revisão-de-código-do-diff-de-csp)
6. [Branch protection na `main` + divisão do CI (PR #22)](#6-branch-protection-na-main--divisão-do-ci-pr-22)
7. [Atualização dos PRs #20 e #21 com os novos checks](#7-atualização-dos-prs-20-e-21-com-os-novos-checks)
8. [Estado final e pendências](#estado-final-e-pendências)

---

## 1. Artefatos de avaliação externa + registro do cutover (PR #20)

**Pedido:** Em branch nova `codex/review-artifacts`, commitar os arquivos novos `docs/EXTERNAL_REVIEW_ACTION_PLAN.md`, `docs/RLS_LIVE_EVIDENCE.md` e `.github/pull_request_template.md`; atualizar `docs/CHANGELOG.md` registrando a conclusão do cutover do Supabase em 2026-06-15; abrir PR seguindo `docs/PR_CHECKLIST.md`; não alterar nenhum outro arquivo.

**O que foi feito:**

- Branch `codex/review-artifacts` criada a partir de `main`.
- Commit `420e958` com exatamente 4 arquivos:
  - `.github/pull_request_template.md` (novo)
  - `docs/EXTERNAL_REVIEW_ACTION_PLAN.md` (novo)
  - `docs/RLS_LIVE_EVIDENCE.md` (novo)
  - `docs/CHANGELOG.md` (atualizado, aditivo)
- Entrada no CHANGELOG (seção `Security` de `[Unreleased]`):
  > Cutover do Supabase concluído em 2026-06-15: schema completo aplicado na nuvem (`bceumcfmjftoukzrfthe`, sa-east-1, Postgres 17) com 38 tabelas, RLS forçado em todas as 38, 134 policies e advisors de segurança limpos; evidência ao vivo em `docs/RLS_LIVE_EVIDENCE.md`.
- Nota adicional na seção `Docs` referenciando os três artefatos.
- Secret scan no diff: limpo (apenas menções textuais em docs).

**Limitação encontrada e resolvida:** na primeira tentativa o `gh` estava com token inválido (`HTTP 401: Bad credentials`); após você reautenticar (`gh auth login`), o PR foi aberto.

**Resultado:** PR [#20](https://github.com/Deividh2025/proposito_em_acao/pull/20) — *"docs: artefatos da avaliacao externa e registro do cutover Supabase"*. Corpo do PR preenchido conforme `docs/PR_CHECKLIST.md`.

---

## 2. Confirmação de conclusão

**Pedido:** "Terminou?"

**O que foi feito:** Confirmado o encerramento da tarefa 1 (branch, commit, CHANGELOG, secret scan e PR #20), sem alterações adicionais.

---

## 3. Scan de segredos no histórico completo (gitleaks)

**Pedido:** Rodar `gitleaks detect --redact` em todo o histórico do git; se achar algo, listar redigido, indicar o commit e recomendar rotação; não commitar segredos; resumir.

**O que foi feito:**

- `gitleaks` não estava instalado → instalado **8.30.1** via `scoop`.
- Execução: `gitleaks detect --redact --log-opts="--all"` (histórico inteiro).
- Cobertura: **34 commits**, ~2,94 MB escaneados.
- **Achados: 1 — falso positivo.**

| Campo | Valor |
|---|---|
| Regra | `generic-api-key` |
| Arquivo | `AGENTS.md` (linha 96) |
| Commit | `14ff2669b8a1cdb47e5fd28f97050813ee9bdeff` |
| Autor / Data | Codex `<codex@openai.com>` — 2026-06-03 |
| Trecho (redigido) | `secrets, ‹REDIGIDO›` |
| Entropia | 3.55 (baixa) |

**Análise:** a linha é prosa em português — *"Mudar stack, provider, dominio, CI/CD, secrets, retencao/LGPD ou modelo comercial."* O heurístico se prendeu ao termo `retencao/LGPD` por proximidade da palavra "secrets". Não é credencial.

**Recomendação:** nenhuma rotação necessária (sem segredo real). Opcional: allowlist `.gitleaks.toml` para zerar o ruído e/ou hook de CI — **não aplicado** nesta sessão (apenas o scan foi solicitado).

**Conclusão:** histórico limpo de segredos reais.

---

## 4. CSP com nonce por request, sem `unsafe-inline` em produção (PR #21)

**Pedido:** Em branch `codex/csp-nonce`, ajustar `next.config.ts` (e proxy/middleware se necessário) para servir uma Content-Security-Policy com nonce por request, removendo `'unsafe-inline'` de `script-src` em produção, mantendo o dev funcionando; rodar lint/typecheck/test/build/test:e2e; abrir PR conforme `PR_CHECKLIST.md`.

**Contexto técnico:** o projeto usa **Next.js 16**, onde o middleware se chama `proxy` (`src/proxy.ts` → `src/lib/supabase/proxy.ts`). CSP com nonce por request precisa ser emitida no proxy (o `next.config.ts` é estático).

**O que foi feito (commit `a543285`):**

- **`src/lib/security/csp.ts`** (novo): helpers de CSP.
  - Produção: `script-src 'self' 'nonce-<valor>' 'strict-dynamic'` (sem `unsafe-inline`).
  - Desenvolvimento: `script-src 'self' 'unsafe-inline' 'unsafe-eval'` (HMR/React Refresh).
  - `generateNonce()` (16 bytes aleatórios → base64) e CSP estática para assets.
- **`src/lib/security/index.ts`**: passa a reexportar `./csp`.
- **`src/lib/supabase/proxy.ts`**: gera um nonce por request e injeta a CSP no header da *request* (para o Next carimbar o nonce nos próprios scripts) e da *response*, em todos os caminhos de retorno (`next`, 503 fail-closed, redirect de Auth, recriação no `setAll` de cookies). O `nonce` é gerado uma única vez por request e reusado, evitando divergência.
- **`next.config.ts`**: removida a CSP estática global (que tinha `unsafe-inline`); mantidos os demais headers de segurança em `/:path*` e uma CSP estática apenas nos assets fora do proxy (`/sw.js`, `/manifest.json`), evitando header de CSP duplicado.
- **`src/app/layout.tsx`**: `export const dynamic = "force-dynamic"`.
- **`docs/CHANGELOG.md`**: entrada de `Security` registrando a mudança (resolve o risco residual de CSP `unsafe-inline`).

**Problema descoberto durante a verificação:** o gate `test:e2e` (que roda em **produção**: `next build` + `next start`) reprovou inicialmente — páginas **estáticas** (`/`, `/offline`) não recebem nonce por request, então a CSP bloqueava todos os scripts. Diagnóstico via `next start` + `curl`: no mesmo request o nonce do header e do HTML batem; em páginas estáticas o HTML não tinha nonce algum. **Solução:** `force-dynamic` no layout raiz força todas as rotas a renderizarem dinamicamente (recebendo o nonce). O `/offline` continua funcional no PWA porque o service worker faz precache da resposta dinâmica (HTML + header de CSP juntos).

**Gates (todos verdes):**

| Gate | Resultado |
|---|---|
| `npm run lint` | ✅ |
| `npm run typecheck` | ✅ |
| `npm run test` | ✅ 255 passed |
| `npm run build` | ✅ 0 rotas estáticas |
| `npm run test:e2e` | ✅ 38 passed, 5 skipped (external-smoke) |
| dev manual | ✅ CSP com `unsafe-inline`/`unsafe-eval`, página 200 |
| gitleaks (diff) | ✅ 0 leaks |

**Resultado:** PR [#21](https://github.com/Deividh2025/proposito_em_acao/pull/21) — *"feat(security): CSP com nonce por request, sem unsafe-inline em producao"*.

---

## 5. Revisão de código do diff de CSP

**Pedido:** "Faça o que você entender como melhor."

**O que foi feito:** mantida a decisão de `force-dynamic` (a alternativa reintroduziria `unsafe-inline` nas estáticas ou dependeria de hashes frágeis) e executada uma **revisão de código** do diff de segurança (inline, em alto contexto).

**Pontos verificados (todos OK):**

- Nonce consistente por request (gerado uma vez, reusado em todos os caminhos).
- Sem header de CSP duplicado entre proxy e `next.config.ts`.
- Sem injeção via header de request (uso de `.set()`, não `.append()`).
- Nonce base64 compatível com o regex do Next (`get-script-nonce-from-header.js`).
- Call sites de `createNextResponse` atualizados; testes de proxy verdes.
- `crypto.getRandomValues`/`btoa` disponíveis em edge, node (vitest) e next.config.
- PWA `/offline` consistente (precache de HTML + CSP juntos).

**Observação intencional (não é bug):** assets fora do proxy (`/_next/static/*`, imagens, `favicon.ico`, `/icons/*`) deixam de receber o header de CSP — inerte na prática, pois CSP é política de nível de documento. Demais headers de segurança seguem aplicados a tudo via `/:path*`.

**Conclusão:** nenhum bug de correção; nada a corrigir.

---

## 6. Branch protection na `main` + divisão do CI (PR #22)

**Pedido:** Configurar branch protection na `main` exigindo os checks de CI (jobs `quality` e `e2e`) e 1 aprovação de PR, via `gh`. Se repo privado/free retornasse 403, configurar ruleset equivalente ou registrar limitação em `docs/DECISIONS.md`.

**Constatações:**

- Repo é **público** → branch protection disponível no plano gratuito; **sem 403**, logo o fallback de ruleset/`DECISIONS.md` não se aplicou.
- O CI existente tinha **um único job** (`verify` / "Lint, test, build and E2E"); **não existiam** jobs `quality` e `e2e`. Exigir checks inexistentes travaria todo merge em "pending".

**Decisão (confirmada por você):** dividir o CI em dois jobs e então proteger.

**O que foi feito:**

1. Branch `codex/ci-split-checks`; `.github/workflows/ci.yml` refatorado em dois jobs paralelos:
   - `quality`: lint, typecheck, test, build
   - `e2e`: Playwright (`npm run test:e2e` → next build + start + specs)
2. PR [#22](https://github.com/Deividh2025/proposito_em_acao/pull/22) aberto; CI verde (`quality` 1m10s, `e2e` 1m46s); **mergeado** (squash, `fef1e14`) e branch remota removida.
3. Branch protection aplicada via `gh api PUT .../branches/main/protection`:

| Regra | Valor |
|---|---|
| Required status checks | **`quality`** e **`e2e`** |
| Strict (branch atualizada antes do merge) | ✅ sim |
| Aprovações de PR exigidas | **1** |
| Force pushes | ❌ bloqueado |
| Deleção da branch | ❌ bloqueado |
| `enforce_admins` | ❌ desligado (intencional) |

**Por que `enforce_admins` desligado:** o GitHub não permite aprovar o próprio PR; em repo de um único mantenedor, exigir 1 aprovação travaria os merges. Com admins fora da regra, o owner mantém um override. Pode ser ligado depois (exigirá um segundo revisor).

---

## 7. Atualização dos PRs #20 e #21 com os novos checks

**Pedido:** "Sim" (atualizar as branches dos PRs abertos para pegarem o workflow dividido).

**O que foi feito:**

- `gh pr update-branch 20` e `gh pr update-branch 21` (merge da `main` em cada branch).
- CI re-executado com os novos jobs; ambos verdes:

| PR | `quality` | `e2e` |
|---|---|---|
| #20 | ✅ 1m13s | ✅ 1m44s |
| #21 | ✅ 1m10s | ✅ 1m31s |

Agora os dois reportam exatamente os contextos exigidos pela proteção.

---

## Estado final e pendências

**Pull Requests abertos (verdes, faltando apenas 1 aprovação):**

| PR | Branch | Conteúdo | CI |
|---|---|---|---|
| [#20](https://github.com/Deividh2025/proposito_em_acao/pull/20) | `codex/review-artifacts` | Artefatos de avaliação externa + cutover no CHANGELOG | `quality` ✅ · `e2e` ✅ |
| [#21](https://github.com/Deividh2025/proposito_em_acao/pull/21) | `codex/csp-nonce` | CSP com nonce por request | `quality` ✅ · `e2e` ✅ |

**Mergeado nesta sessão:** PR #22 (divisão do CI).

**`main`:** protegida — `quality` + `e2e` obrigatórios, strict, 1 aprovação, force-push/deleção bloqueados, `enforce_admins` desligado.

**Pendências / decisões para você:**

1. **Mergear #20 e #21** — falta 1 aprovação cada. Opções: *admin override* (possível pois `enforce_admins` está desligado) ou um segundo revisor.
2. **`enforce_admins`** — ligar se quiser proteção total (inclusive para o owner); exigirá segundo revisor.
3. **Allowlist do gitleaks / scan no CI** — opcional, não implementado.
4. **Este relatório** (`RELATORIO_SESSAO_2026-06-18.md`) está na raiz do repo e não foi commitado.

---

*Gerado por Claude Code (Opus 4.8) em 2026-06-18.*
