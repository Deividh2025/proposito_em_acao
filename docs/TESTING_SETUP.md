# Testing Setup

## Ferramentas

- ESLint para analise estatica.
- TypeScript para typecheck.
- Vitest para unidade/integracao.
- Playwright para E2E.
- Next build como verificacao de integracao do app.

## Comandos

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

## Estrutura

- `src/tests/unit`: schemas, utilitarios e dominio puro.
- `src/tests/integration`: validacao server-side, clients e fluxos sem browser.
- `src/tests/e2e`: jornadas reais no navegador.

O comando `npm.cmd run test:e2e` usa `scripts/run-e2e.mjs` para buildar, iniciar o Next, executar Playwright e encerrar o servidor corretamente no Windows.

## Minimo por PR

- Lint.
- Typecheck.
- Testes afetados.
- Build quando tocar App Router, config, dependencia ou dados carregados no servidor.

## Testes futuros de RLS

- Usuario nao acessa dados de outro usuario.
- Atalaia so acessa alvo concedido.
- Revogacao bloqueia leitura futura.
- Metacognicao nunca aparece em grant padrao.
- Views respeitam RLS.
- Storage privado permite apenas path `{auth.uid()}/...`.

## Supabase CLI

Estado 2026-06-03: o CLI `supabase` esta disponivel localmente (`2.98.2`), mas o checkout nao esta linkado ao projeto. Use comandos read-only sem aprovacao; comandos que criam fixtures, aplicam migrations ou escrevem no remoto exigem etapa propria e aprovacao.

```powershell
supabase --version
supabase migration list --local
```

Para preview aprovado, seguir `docs/SUPABASE_PREVIEW_CUTOVER.md` e registrar evidencia em `docs/RLS_TEST_REPORT.md`.

## Testes futuros de IA

- Saidas obedecem schema.
- Guardrails bloqueiam diagnostico e culpa espiritual.
- Crise emocional recebe encaminhamento adequado.
- Mensagem ao Atalaia exige previa e consentimento.
- Falha de IA tem fallback manual.

## Riscos

- Testes E2E prematuros podem ficar frageis antes de UI real.
- Testes de IA precisam cobrir casos negativos, nao apenas caminho feliz.
- RLS sem testes automatizados e risco critico no Prompt 4.
