---
name: qa-final-v1-skill
description: Use when auditing final V1 readiness, functional coverage, critical flows, bugs, regressions, QA reports, and Prompt 15 acceptance for Proposito em Acao.
---

# QA Final V1 Skill

## Quando usar

Use em QA final, auditoria de largura da V1, matriz funcional, bugs, regressao, pronto para deploy e aprovacao antes do Prompt 16.

## Instrucoes praticas

1. Leia `AGENTS.md`, `PLANS.md`, `README.md` e docs centrais antes de corrigir.
2. Separe cobertura funcional, seguranca, IA, UX, RLS, mobile/PWA, build e docs.
3. Nao implemente feature nova; corrija bugs, regressao, teste faltante e lacuna pequena.
4. Classifique achados como critica, alta, media ou baixa.
5. Rode ou registre `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e `npm run test:e2e`.
6. Gere `docs/QA_FINAL_REPORT.md` e referencie relatórios especializados.
7. Nao declarar pronto para deploy com falha critica, RLS nao validado ou Auth/mobile pendente.

## Arquivos relacionados

- `docs/QA_FINAL_REPORT.md`
- `docs/BUG_FIX_LOG.md`
- `docs/RELEASE_READINESS.md`
- `src/tests/`
- `supabase/tests/README.md`

## Saida esperada

Retorne matriz de cobertura, bugs encontrados/corrigidos/pendentes, comandos, resultados, riscos, decisoes do fundador e checklist de aprovacao.
