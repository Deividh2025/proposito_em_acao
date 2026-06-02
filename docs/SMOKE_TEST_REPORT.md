# Smoke Test Report - Prompt 16

Data: 2026-06-02.

## Status

Smoke local: passou.

Smoke de producao/preview publicado: nao executado porque ainda nao houve deploy real em VPS Hostinger/Coolify. Producao aberta esta bloqueada por Supabase remoto desalinhado, RLS dinamica pendente e Auth real pendente.

## Comandos locais executados

| Comando | Resultado |
|---|---|
| `npm.cmd run lint` | Passou. |
| `npm.cmd run typecheck` | Passou. |
| `npm.cmd run test` | Passou: 13 arquivos, 74 testes. |
| `npm.cmd run build` | Passou: 39 rotas geradas/analisadas. |
| `npm.cmd run test:e2e` | Passou: 26 testes Playwright. |

## Supabase real consultado

| Item | Resultado |
|---|---|
| Projeto | `proposito_em_acao`, ref `bceumcfmjftoukzrfthe`. |
| Status | `ACTIVE_HEALTHY`. |
| Regiao | `sa-east-1`. |
| Migrations remotas | Apenas `20260602134002 mobile_pwa_prompt14_alignment`. |
| Tabelas publicas visiveis | `energy_checkins`. |
| Veredito | Bloqueado para producao ate alinhamento completo e RLS dinamica. |

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

## Smoke pos-deploy pendente

Usar dados ficticios e nao sensiveis.

| Caso | Status |
|---|---|
| Abrir home via HTTPS | Pendente de URL. |
| Criar conta/login de teste | Pendente de Auth real. |
| Confirmar e-mail e redirect | Pendente de Auth real. |
| Acessar dashboard | Pendente de URL/Auth. |
| Criar alvo/tarefa/item simples | Pendente de Supabase alinhado. |
| Abrir calendario e inbox | Pendente de URL. |
| Usar Desbloqueador e Metacognicao | Pendente de URL, com IA mockada. |
| Iniciar foco curto e marcar habito/Placar | Pendente de URL. |
| Fazer Revisao e ver Jardim | Pendente de URL. |
| Criar Atalaia teste | Pendente de RLS/Auth/consentimento real. |
| Validar que Atalaia nao ve dados privados | Pendente de matriz RLS dinamica. |
| Abrir PWA/mobile e instalar | Pendente de HTTPS/browser real. |
| Testar offline seguro | Pendente de HTTPS/browser real. |
| Logout/login | Pendente de Auth real. |
| Console sem erro critico | Pendente de URL. |

## Falhas/bloqueios

- Critica: Supabase remoto nao esta alinhado com migrations locais da V1.
- Critica: matriz RLS dinamica ainda nao executada.
- Critica: Auth real ainda nao validado em ambiente publicado.
- Alta: variaveis/secrets de preview/producao ainda dependem de aprovacao/configuracao.
- Alta: OpenAI/DeepSeek e e-mail reais permanecem sem aprovacao operacional completa de secrets, custo, rate limit, evals e provider de e-mail.

## Veredito

Localmente apto para preparar preview controlado. Producao aberta nao aprovada.

## Addendum Prompt 17

Data: 2026-06-02.

Smoke de beta publicado: nao executado, pois ainda nao houve URL de preview publicada.

Novos casos a incluir no smoke de preview:

| Caso | Status |
|---|---|
| Abrir feedback beta no desktop | Pendente de URL/build publicado. |
| Preparar rascunho de feedback sem envio externo | Pendente de URL/build publicado. |
| Abrir feedback beta no hub mobile | Pendente de URL/build publicado. |
| Confirmar que feedback nao usa cache/localStorage sensivel | Pendente de URL/browser real. |
| Confirmar que `NEXT_PUBLIC_BETA_FEEDBACK_URL` nao contem token/query sensivel | Pendente de ambiente. |
| Confirmar analytics real desativado ou consentido | Pendente de decisao/ambiente. |
