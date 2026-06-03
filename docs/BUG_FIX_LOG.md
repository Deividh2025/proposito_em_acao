# Bug Fix Log - Prompt 15

Data: 2026-06-02.

## Correcoes

| Area | Problema | Correcao |
|---|---|---|
| Revisao Semanal | ID de pergunta divergia do schema. | Alinhado para `firstActionNextWeek`. |
| Jardim | Areas em frases naturais nao eram detectadas. | Normalizacao e comparacao por texto. |
| Atalaia actions | Aceite nao checava erro de update do grant. | Validacao explicita de `grantUpdateError`. |
| Atalaia RLS | Policy permitia leitura por usuario/alvo/permissao sem grant/parceiro especifico. | Policies estreitadas para grant/parceiro especifico. |
| IA persistencia | Structured output do cliente podia ser salvo sem guardrail. | Guardrail owner-only antes de persistir. |
| Build Next | `themeColor` em metadata gerava warning. | Movido para `viewport`. |
| Auth V1 | Criar conta/login nao tinha superficie visual. | Criada rota `/auth`, server actions e E2E de presenca. |

## Testes relacionados

- `src/tests/unit/review-garden-domain.test.ts`
- `src/tests/unit/rls-policy-safety.test.ts`
- `src/tests/unit/action-metacognition-domain.test.ts`
- `src/tests/e2e/auth.spec.ts`
- Suite completa `npm.cmd run test`
- Suite completa `npm.cmd run test:e2e`

## Etapa 1 - contratos de runtime e erro

Data: 2026-06-03.

| Bug | Correcao | Evidencia |
|---|---|---|
| `DATA-WRITE-001` | Criado helper central de resultados para distinguir `local-demo`, ausencia de sessao/configuracao e erro real; `catch` de actions no escopo deixa de transformar falha configurada em `local-draft ok:true`. | `src/domain/execution/action-results.ts`, `src/tests/unit/runtime-action-results.test.ts`, `src/tests/integration/runtime-error-contracts.test.ts`. |
| `DATA-WRITE-002` | Updates/deletes priorizados passam a usar `.select("id").maybeSingle()` ou equivalente e retornam `ok:false` quando nenhuma linha e afetada. | `goals`, `projects`, `tasks`, `habits`, `focus` e `accountability` actions; teste de update sem linha em `runtime-error-contracts.test.ts`. |
| `UX-INBOX-001` | Inbox so altera estado local quando `result.ok` e verdadeiro; falhas aparecem como `ErrorState`. | `src/components/inbox/InboxCapture.tsx`, `src/tests/unit/inbox-capture-ui.test.ts`. |
| `CAL-VAL-001` | Actions do calendario usam `safeParse` e retornam erro controlado para input invalido. | `src/app/calendar/actions.ts`, teste de validacao em `runtime-error-contracts.test.ts`. |
| `A11Y-MAIN-001` | `MobileShell` deixa de renderizar `<main>` interno. | `src/components/mobile/MobileShell.tsx`, E2E de landmark unico em `src/tests/e2e/mobile-pwa.spec.ts`. |
| `SEC-CSP-001` | `unsafe-eval` removido do `script-src` em producao; `unsafe-inline` permanece como risco residual ate etapa de nonce/hash. | `next.config.ts`; build/E2E locais devem validar compatibilidade. |

Testes focados executados nesta etapa:

- `npm.cmd run test -- src/tests/unit/runtime-action-results.test.ts src/tests/integration/runtime-error-contracts.test.ts src/tests/unit/inbox-capture-ui.test.ts`: passou, 13 testes.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 17 arquivos e 94 testes.
- `npm.cmd run build`: passou, 39 paginas.
- `npm.cmd run test:e2e`: passou, 30 testes.

## Etapa 2 - Supabase, RLS e Atalaia seguro

Data: 2026-06-03.

| Bug | Correcao | Evidencia |
|---|---|---|
| `SEC-ATL-001` | Aceite deixou de depender de update amplo do convidado. A migration remove policies diretas de aceite, adiciona `invite_token_hash` no grant, triggers de imutabilidade e `search_path` seguro; a action valida token/e-mail/parceiro/grant antes de ativar o grant especifico. | `supabase/migrations/20260603211654_accountability_acceptance_rls_hardening.sql`, `src/app/accountability/actions.ts`, `src/tests/unit/rls-policy-safety.test.ts`, `src/tests/integration/accountability-secure-actions.test.ts`. |
| `SEC-ATL-002` | Tela de aceite nao fabrica mais grant demonstrativo; carrega preview real sanitizada ou estado seguro sem botao de aceite. | `src/app/accountability/partner/[inviteToken]/page.tsx`, `src/tests/unit/accountability-acceptance-ui.test.ts`. |
| `SEC-ATL-003` | Permissoes salvas passam a refletir exatamente a selecao revisada pelo dono, sem reintroduzir defaults do nivel. | `src/domain/accountability/persistence.ts`, `src/tests/unit/accountability-commitments-domain.test.ts`. |
| `SEC-CONSENT-001` | Criacao, aceite e revogacao do Atalaia registram consentimento/auditoria/notificacao obrigatoria ou retornam `ok:false`; convite so vira `invited` depois de auditoria/notificacao, aceite so ativa acesso depois de consentimento/evento, e falhas tentam expirar o convite sem declarar sucesso. Payloads usam metadados minimos e hash de e-mail/usuario quando necessario. | `src/app/accountability/actions.ts`, `src/tests/integration/accountability-secure-actions.test.ts`. |
| `QA-INT-001` | Harness preview ganhou persona `atalia_invited`, tentativas de escalada, aceite de grant especifico e revogacao que corta leitura futura. | `scripts/validate-supabase-preview.mjs`, `src/tests/unit/supabase-preview-harness.test.ts`. |

Testes focados executados nesta etapa antes dos gates completos:

- `npm.cmd run test -- src\tests\unit\accountability-commitments-domain.test.ts src\tests\integration\accountability-secure-actions.test.ts src\tests\unit\rls-policy-safety.test.ts src\tests\unit\supabase-preview-harness.test.ts src\tests\unit\accountability-acceptance-ui.test.ts`: passou, 5 arquivos e 26 testes.
- `npm.cmd run typecheck`: passou.

Pendencia: migration e harness nao foram aplicados em Supabase remoto/principal nesta etapa. Preview deve ser validado somente em branch/ambiente aprovado.

Risco residual: fluxo ainda nao usa RPC transacional em `app_private`; a Etapa 2 evita token/ativacao utilizavel antes das escritas obrigatorias e implementa compensacao local, mas ainda registra a pendencia de validar/aprimorar em preview.
