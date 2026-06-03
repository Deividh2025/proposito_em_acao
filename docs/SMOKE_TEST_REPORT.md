# Smoke Test Report - Prompt 16

Data: 2026-06-02.

## Status

Smoke local: passou.

Smoke de producao/preview publicado: nao executado porque ainda nao houve deploy real em VPS Hostinger/Coolify. Producao aberta segue bloqueada por Auth real nao validado em URL publicada, secrets/deploy pendentes e LGPD minima pendente.

Preparacao de deploy em 2026-06-02:

- `Dockerfile`, `.dockerignore`, `/api/health` e smoke externo parametrizado por `PLAYWRIGHT_BASE_URL` foram preparados.
- `npm.cmd run test:e2e` passou com 29 testes usando servidor de producao local e Playwright com `--workers=1`.
- `docker build` nao foi validado localmente porque o Docker daemon/Desktop nao estava em execucao.
- Nao havia CLI/variaveis locais de Coolify/Hostinger para publicar URL de preview nesta sessao.

## Comandos locais executados

| Comando | Resultado |
|---|---|
| `npm.cmd run lint` | Passou. |
| `npm.cmd run typecheck` | Passou. |
| `npm.cmd run test` | Passou: 13 arquivos, 74 testes. |
| `npm.cmd run build` | Passou: 39 rotas geradas/analisadas. |
| `npm.cmd run test:e2e` | Passou: 26 testes Playwright. |

Comando preparado para smoke externo:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://URL-DE-PREVIEW"
npm.cmd run test:e2e:external
```

## Supabase real consultado

| Item | Resultado |
|---|---|
| Projeto | `proposito_em_acao`, ref `bceumcfmjftoukzrfthe`. |
| Status | `ACTIVE_HEALTHY`. |
| Regiao | `sa-east-1`. |
| Branch preview | `preview-release-readiness`. |
| Migrations/RLS preview | Alinhadas e matriz dinamica passou em 2026-06-02. |
| Security advisor preview | Sem issues apos ativar protecao de senha vazada. |
| Veredito | Gate Supabase/RLS preview aprovado; falta URL publicada/Auth/smoke externo. |

## Fluxos cobertos localmente por E2E

- Home/design system shell.
- Auth surface `/auth`.
- Onboarding e dashboard inicial.
- Alvos, projetos, tarefas e microtarefas.
- Calendario e Inbox.
- Desbloqueador e Metacognicao.
- Foco, Habitos e Placar.
- Revisao Semanal e Jardim.
- Atalaia e Documento de Compromisso.
- PWA/mobile: hub, captura, habitos, Placar, foco curto, Desbloqueador rapido, Metacognicao rapida e energia.
- Feedback beta: desktop e mobile preparam rascunho local/dev sem envio externo e com aviso de dados sensiveis.

## Smoke pos-deploy pendente

Usar dados ficticios e nao sensiveis.

| Caso | Status |
|---|---|
| Abrir home via HTTPS | Pendente de URL. |
| Criar conta/login de teste | Pendente de Auth real. |
| Confirmar e-mail e redirect | Pendente de Auth real. |
| Acessar dashboard | Pendente de URL/Auth. |
| Criar alvo/tarefa/item simples | Pendente de URL/Auth. |
| Abrir calendario e inbox | Pendente de URL. |
| Usar Desbloqueador e Metacognicao | Pendente de URL, com IA mockada. |
| Iniciar foco curto e marcar habito/Placar | Pendente de URL. |
| Fazer Revisao e ver Jardim | Pendente de URL. |
| Criar Atalaia teste | Pendente de RLS/Auth/consentimento real. |
| Validar que Atalaia nao ve dados privados | Matriz RLS passou no preview; pendente confirmar fluxo publicado. |
| Abrir PWA/mobile e instalar | Pendente de HTTPS/browser real. |
| Testar offline seguro | Pendente de HTTPS/browser real. |
| Logout/login | Pendente de Auth real. |
| Console sem erro critico | Pendente de URL. |

## Falhas/bloqueios

- Critica: Auth real ainda nao validado em ambiente publicado.
- Alta: variaveis/secrets de preview/producao ainda dependem de aprovacao/configuracao.
- Alta: URL HTTPS de preview ainda nao foi publicada no Coolify.
- Alta: Docker build local ainda depende de Docker daemon ativo.
- Alta: OpenAI/DeepSeek e e-mail reais permanecem sem aprovacao operacional completa de secrets, custo, rate limit, evals e provider de e-mail.

## Veredito

Localmente apto para preparar preview controlado. Producao aberta nao aprovada.

## Addendum Prompt 17

Data: 2026-06-02.

Smoke de beta publicado: nao executado, pois ainda nao houve URL de preview publicada.

Novos casos a incluir no smoke de preview:

| Caso | Status |
|---|---|
| Abrir feedback beta no desktop | Coberto localmente por Playwright; pendente URL publicada. |
| Preparar rascunho de feedback sem envio externo | Coberto localmente por Playwright; pendente URL publicada. |
| Abrir feedback beta no hub mobile | Coberto localmente por Playwright; pendente URL publicada. |
| Confirmar que feedback nao usa cache/localStorage sensivel | Pendente de URL/browser real. |
| Confirmar que `NEXT_PUBLIC_BETA_FEEDBACK_URL` nao contem token/query sensivel | Pendente de ambiente. |
| Confirmar analytics real desativado ou consentido | Pendente de decisao/ambiente. |
