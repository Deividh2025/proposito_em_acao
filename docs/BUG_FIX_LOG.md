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
