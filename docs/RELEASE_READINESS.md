# Release Readiness - Prompt 15/16

Data: 2026-06-02.

## Status vivo consolidado

- Produto: V1 local ampla, em pre-beta real.
- Gates locais passaram em rodadas anteriores, mas devem ser reexecutados antes de novo PR, release candidate ou deploy.
- Supabase/RLS em branch preview teve evidencia anterior em 2026-06-02; a rodada mais recente preparou o pack revisavel e exige rerun fresco antes de beta com usuarios reais ou producao.
- Beta real e producao aberta continuam bloqueados ate URL HTTPS publicada, Auth real validado, smoke externo, secrets no provedor, LGPD minima, rollback aprovado e decisao operacional de IA/e-mail/analytics.
- SQL versionado, scripts preparados ou docs atualizados nao equivalem a validacao remota aplicada.

## Status

Localmente aprovado para preparar Prompt 16, mas nao aprovado para deploy produtivo imediato sem gates externos.

## Gates locais

- Lint: passou apos correcoes.
- Typecheck: passou apos correcoes.
- Unit/integration/evals: passaram apos correcoes.
- Build: passou.
- E2E Playwright: passou, incluindo PWA/mobile e Auth surface.

## Gates externos obrigatorios antes de producao

- Aplicar todas as migrations locais em Supabase branch/preview.
- Confirmar que migrations remotas estao alinhadas; o remoto consultado mostrou apenas `mobile_pwa_prompt14_alignment`.
- Executar matriz RLS dinamica com usuario A, usuario B, Atalaia autorizado e Atalaia revogado.
- Validar Supabase Auth real: signup, login, confirmacao de e-mail, logout, redirect e expiracao de sessao.
- Configurar secrets no provedor de deploy, nunca no Git.
- Definir politicas LGPD de consentimento, retencao, exportacao e exclusao.
- Definir provider de e-mail e politica de notificacoes antes de envio externo.
- Aprovar modelos OpenAI/DeepSeek, custos, limites, roteamento por agente e base de conhecimento antes de ativar IA real.

## Checklist de aprovacao para Prompt 16

- [ ] Fundador aprova aplicar migrations em ambiente de preview.
- [x] Fundador aprova plataforma de deploy: VPS Hostinger com Coolify.
- [ ] Fundador aprova dominio/URL temporaria e dominio final.
- [ ] Fundador aprova provider de e-mail ou mantem notificacoes desativadas.
- [ ] Fundador aprova politica minima de privacidade/termos/consentimento.
- [x] Fundador aprova providers planejados: OpenAI API e DeepSeek API.
- [ ] Fundador aprova se IA real continua desativada no primeiro deploy.
- [ ] Fundador aprova plano de rollback.

## Decisao

Prompt 15 deixa a V1 localmente verde e auditada. O Prompt 16 deve ser tratado como deploy controlado/preview com validacao Supabase real, nao como producao aberta.

## Addendum Prompt 16

Data: 2026-06-02.

Gates locais frescos do Prompt 16:

- Lint: passou.
- Typecheck: passou.
- Unit/integration/evals: passaram, 13 arquivos e 74 testes.
- Build: passou.
- E2E Playwright: passou, 26 testes.

Evidencia externa atual:

- Supabase `proposito_em_acao` (`bceumcfmjftoukzrfthe`) esta `ACTIVE_HEALTHY`.
- Migrations remotas listadas: somente `20260602134002 mobile_pwa_prompt14_alignment`.
- Tabelas publicas remotas visiveis nao cobrem a V1 completa.

Recomendacao:

- Aprovado para preparar preview controlado em VPS Hostinger com Coolify.
- Bloqueado para producao aberta.
- Beta fechado com usuarios reais depende de aplicar migrations em preview, rodar RLS dinamica, validar Auth real, configurar secrets, aprovar LGPD minima e executar smoke tests publicados.

## Addendum de decisao - VPS/Coolify/IA

Data: 2026-06-02.

Decisoes registradas:

- Infraestrutura: VPS Hostinger.
- Deploy/PaaS: Coolify.
- Dono da plataforma: Deividh de Sa.
- E-mail operacional: `deividhvianei@gmail.com`.
- Providers de IA planejados: OpenAI API e DeepSeek API.
- Modelos DeepSeek planejados: `deepseek-v4-flash` e `deepseek-v4-pro`.

Essas decisoes nao removem os gates: migrations Supabase, RLS dinamica, Auth real, secrets no Coolify, LGPD, smoke publicado, custos/rate limit/evals de IA e provider de e-mail continuam pendentes.

## Addendum Prompt 17

Data: 2026-06-02.

Resultado:

- Plano de beta fechado, metricas, analytics seguro, feedback, bug triage, suporte, incident response, monitoramento e V1.1 foram preparados.
- Feedback in-app foi preparado como rascunho local/beta, sem persistencia produtiva e sem envio externo obrigatorio.
- Contrato local de analytics foi criado com allowlist e sanitizacao de metadados.

Recomendacao:

- Aprovado para ensaio interno e preparacao de preview controlado.
- Beta com usuarios reais segue bloqueado ate migrations Supabase, RLS dinamica, Auth real, secrets, LGPD minima, rollback, smoke publicado e decisao de canal/formulario de feedback.

## Addendum Supabase Preview

Data: 2026-06-02.

Resultado:

- Branch preview Supabase `preview-release-readiness` foi criado sem dados de producao.
- Migrations locais foram alinhadas e aplicadas no preview ate `20260602214345`.
- Matriz RLS dinamica passou para dono, outro usuario, anonimo, Atalaia ativo e Atalaia revogado.
- Fixtures temporarios de teste foram removidos do preview.
- Auth do preview teve `password_hibp_enabled` ativado e advisors de seguranca retornaram sem issues.

Recomendacao:

- Gate de migrations/RLS em preview: aprovado.
- Beta/smoke externo continuam bloqueados ate validar fluxos reais de Auth, configurar secrets no deploy, publicar preview acessivel, aprovar LGPD minima e executar smoke test no URL publicado.
- Artefatos de Coolify/Docker e smoke externo foram preparados, mas `docker build` local depende do Docker daemon ativo e a publicacao depende de acesso/URL Coolify/Hostinger.

## Addendum Cutover Pack

Data: 2026-06-02.

Preparacao adicionada para repetir o cutover Supabase preview de forma segura e revisavel:

- `docs/SUPABASE_PREVIEW_CUTOVER.md` com mapa ordenado de 12 migrations, preflight, dry-run, aplicacao, typegen, harness Auth/RLS, smoke e rollback.
- `scripts/generate-supabase-types.mjs` e `npm.cmd run supabase:types:preview`.
- `scripts/validate-supabase-preview.mjs` e `npm.cmd run supabase:validate:preview`.
- `supabase/README.md` e `supabase/tests/README.md` sincronizados com o fluxo atual.

Status desta rodada: pack pronto, remoto nao alterado. Como `supabase --version` nao esta disponivel localmente, o gate externo permanece dependente de execucao por operador autenticado no preview. Producao aberta segue bloqueada ate evidencia fresca de migrations, typegen real, Auth real publicado, smoke externo, secrets, LGPD minima e rollback.
