---
name: smoke-test-skill
description: Padronizar smoke tests pos-deploy do Proposito em Acao.
---

# Smoke Test Skill

## Quando usar

Use depois de build, preview, deploy, mudanca de dominio, Auth, Supabase, OpenAI, PWA ou e-mail.

## Instrucoes praticas

1. Usar dados ficticios e nao sensiveis.
2. Validar home, Auth, dashboard, alvos, tarefas, calendario, inbox, Desbloqueador, Metacognicao, foco, habitos, Placar, Revisao, Jardim, Atalaia e PWA/mobile.
3. Validar console sem erro critico e HTTPS ativo.
4. Validar Supabase/Auth/RLS com personas reais quando houver ambiente aplicado.
5. Classificar falhas como critica, alta, media ou baixa.
6. Registrar resultados em `docs/SMOKE_TEST_REPORT.md`.

## Arquivos relacionados

- `docs/SMOKE_TEST_REPORT.md`
- `src/tests/e2e/`
- `scripts/run-e2e.mjs`
- `supabase/tests/README.md`

## Saida esperada

Retorne URL testada, matriz de smoke, resultado por caso, falhas, evidencias, bloqueios e recomendacao.
