# Testing Setup

## Ferramentas

- ESLint para analise estatica.
- TypeScript para typecheck.
- Vitest para unidade/integracao.
- Playwright para E2E.
- Next build como verificacao de integracao do app.

## Comandos

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Estrutura

- `src/tests/unit`: schemas, utilitarios e dominio puro.
- `src/tests/integration`: validacao server-side, clients e fluxos sem browser.
- `src/tests/e2e`: jornadas reais no navegador.

O comando `npm run test:e2e` usa `scripts/run-e2e.mjs` para buildar, iniciar o Next, executar Playwright e encerrar o servidor corretamente no Windows.

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

O CLI `supabase` nao esta instalado neste ambiente. Quando estiver disponivel:

```powershell
supabase --version
supabase start
supabase db reset
supabase db lint
supabase migration list --local
```

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
