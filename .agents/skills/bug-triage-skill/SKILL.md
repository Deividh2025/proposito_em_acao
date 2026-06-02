---
name: bug-triage-skill
description: Padronizar bug report, severidade, reproducao, verificacao e fila de correcao do beta fechado do Proposito em Acao.
---

# Bug Triage Skill

## Quando usar

Use ao registrar, classificar, reproduzir, corrigir ou revisar bugs do beta, incidentes funcionais, regressao, falhas de Auth/RLS/PWA/IA ou bloqueios de release.

## Instrucoes praticas

1. Reproduzir com dados ficticios e menor fluxo possivel.
2. Classificar S0, S1, S2 ou S3 por impacto, privacidade, seguranca e bloqueio de fluxo.
3. S0 inclui vazamento, RLS quebrado, secret exposto, Metacognicao exposta, Atalaia vendo dado privado, PWA cacheando dado sensivel ou deploy quebrado.
4. Corrigir bug de codigo com teste focado quando possivel.
5. Rodar gate amplo adequado antes de fechar.
6. Atualizar `docs/BUG_TRIAGE.md`, `docs/BUG_FIX_LOG.md` ou relatorio operacional quando a correcao afetar release.

## Arquivos relacionados

- `docs/BUG_TRIAGE.md`
- `docs/BUG_FIX_LOG.md`
- `docs/QA_FINAL_REPORT.md`
- `docs/SMOKE_TEST_REPORT.md`
- `src/tests/`

## Saida esperada

Retorne bug report, severidade, reproducao, evidencia, teste focado, verificacoes, status e criterio de fechamento.
