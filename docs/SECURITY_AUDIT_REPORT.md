# Security Audit Report - Prompt 15

Data: 2026-06-02.

## Estado atual verificado em 2026-06-04

Veredito: seguranca ainda bloqueia beta real. A evidencia local e historica nao deve ser usada para declarar producao pronta.

Achados bloqueantes atuais:

- S1 `SEC-CONSENT-001` residual: consentimento/auditoria do Atalaia foi reduzido na Etapa 2, mas consentimentos amplos de IA/analytics/feedback e validacao remota ainda nao foram fechados.
- S1 `AUTH-SSR-001`: fundacao local de Auth SSR foi implementada, mas ainda falta validacao externa em URL HTTPS publicada com redirects reais, SMTP/Resend decidido e cookies reais.
- S1 `DB-TYPES-001`: tipos reais Supabase ainda nao foram gerados a partir de preview aprovado.
- S1 `AI-CONSENT-AUDIT-001`: IA real possui rota segura local, mas consentimento/auditoria ainda nao sao persistidos em banco aprovado.
- S1 `EMAIL-RESEND-001` reduzido localmente: adapter Resend, templates neutros e webhook assinado foram preparados, mas envio real, dominio verificado, SMTP Auth e smoke externo seguem pendentes.
- S2 residual `SEC-CSP-001`: CSP de producao nao usa mais `unsafe-eval`, mas ainda permite `unsafe-inline` ate etapa de nonce/hash.

Ver `docs/BUG_TRIAGE.md` para IDs, evidencias e criterios de fechamento.

## Auditoria transversal do PR #8

Data: 2026-06-04.

Veredito de seguranca: sem S0/S1 novo que bloqueie merge preparatorio do PR #8; beta real segue bloqueado.

Evidencias:

- PR #7 confirmado como mergeado; PR #8 estava `MERGEABLE`, draft e sem checks remotos configurados.
- Subagentes de seguranca/Auth/RLS e demais recortes foram tentados, mas falharam por sessao expirada do conector; a auditoria seguiu com comandos locais reproduziveis.
- `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build`, `npm.cmd run test:e2e` e `git diff --check` passaram na branch da Etapa 6.
- Secret scan nao encontrou `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, database URL com senha ou padrao de chave real no diff. Os hits restantes eram placeholders vazios, documentacao e fixtures de teste.
- `NEXT_PUBLIC_*` sensiveis nao foram adicionados para Resend, OpenAI, DeepSeek, webhook ou service role. As chaves publicas Supabase seguem como anon/publishable.
- `SUPABASE_SERVICE_ROLE_KEY` aparece em modulo server-only (`src/lib/supabase/admin.ts`), docs e testes; nenhum uso client-side novo foi identificado.
- Webhook Resend permanece dependente de `RESEND_WEBHOOK_SECRET` e rejeita secret ausente fora de `local-demo`; payload bruto nao e armazenado como trilha de auditoria.
- Templates/e-mails da Etapa 6 continuam sem conteudo sensivel de Chamado, Metacognicao, saude, familia, financas, emocoes, calendario ou tarefa.
- PWA/cache nao apresentou inclusao de rotas Auth/API autenticadas em cache estatico nesta auditoria local; prova negativa HTTPS continua pendente.

Riscos residuais:

- `SEC-CSP-001`: CSP ainda usa `unsafe-inline`; endurecer com nonce/hash ou aceitar formalmente antes de beta/producao publica.
- Auth/RLS externo, SMTP Auth Resend, webhook real delivered/bounced, PWA em HTTPS e Supabase preview com personas reais ainda nao foram validados nesta auditoria.

## Resultado geral

Seguranca local e estatica melhorou durante o Prompt 15 e a Etapa 2 reduziu a superficie critica de Atalaia/consentimento. No preview Supabase, migrations e matriz RLS dinamica foram validadas historicamente em 2026-06-02, mas a migration da Etapa 2 ainda nao foi aplicada em preview. Deploy produtivo e beta real ainda devem aguardar rerun fresco, Auth real, secrets/deploy, smoke externo, revisao de LGPD/retencao e correcao dos S1 restantes.

## Checklist de seguranca

| Item | Status |
|---|---|
| `.env` real commitado | Nao encontrado no status Git; validar antes de push com secret scan. |
| `.env.example` | Existe com placeholders. |
| `OPENAI_API_KEY` no frontend | Nao deve existir; cliente OpenAI segue server-side. |
| `SUPABASE_SERVICE_ROLE_KEY` no frontend | Nao deve existir; service role fica server-only. |
| RLS em tabelas de usuario | Evidencia historica em preview ate `20260602214345`; Etapa 2 ainda exige rerun remoto. |
| Usuario A x Usuario B | Isolamento validado historicamente no preview com fixtures temporarios; repetir no rerun da Etapa 2. |
| Metacognicao privada | Confirmada por docs, actions e sem policy Atalaia. |
| Chamado privado | Confirmado por modelo/documentacao; validar remoto. |
| Revisao Semanal privada | Confirmada por modelo/documentacao; validar remoto. |
| Atalaia com grant granular | Etapa 2 impede escalada local no aceite por action server-side, token hash no grant, triggers defensivas e testes negativos. |
| Revogacao Atalaia | Actions cancelam pendentes, registram auditoria e revogam consentimento do grant; harness preview foi expandido, mas rerun remoto segue pendente. |
| Logs sensiveis | IA audita metadados, sem prompt/resposta bruta por padrao. |
| PWA/cache | Service worker cacheia apenas assets estaticos seguros e pagina offline; rotas Auth/callback/recovery e respostas autenticadas continuam proibidas para cache. |
| Storage | Privado por padrao nas migrations locais. |

## Achados corrigidos

- Etapa 1 adicionou `APP_RUNTIME_MODE` e helpers de resultado para impedir que erro real de Supabase/Auth vire `local-draft ok:true`.
- Etapa 1 confirmou linha afetada em updates/deletes priorizados e retornou `ok:false` quando RLS/owner/filter resulta em zero linha.
- Etapa 1 passou a checar escritas secundarias ja existentes em Atalaia, Revisao, Compromissos e Foco, sem alterar RLS/migrations ou fluxo transacional.
- Etapa 1 removeu `unsafe-eval` do CSP de producao; `unsafe-inline` permanece como risco residual documentado.
- RLS de Atalaia foi estreitada para exigir `accountability_partner_id`, `partner_user_id` e `accountability_grant_id` especificos.
- Actions de Atalaia passaram a validar erro de update do grant no aceite.
- Etapa 2 removeu o aceite demonstrativo da UI e passou a carregar preview real sanitizada ou estado seguro.
- Etapa 2 impediu reintroducao automatica de permissoes removidas pelo dono.
- Etapa 2 adicionou consentimento/auditoria obrigatoria para criar, aceitar e revogar Atalaia, com retorno `ok:false` em falhas obrigatorias.
- Etapa 2 removeu update direto do convidado em policies de aceite e adicionou triggers de imutabilidade em `app_private`.
- Persistencia owner-only de Desbloqueador e Metacognicao passou a rodar guardrails antes de salvar structured output enviado pelo cliente.
- Auth visual basico foi adicionado com server actions, sem service role e sem OAuth prematuro.
- Etapa 3 adicionou proxy SSR com `auth.getClaims()`, rotas de callback/confirmacao/recuperacao, redirects seguros, protecao de rotas por runtime e `/api/ready`, sem expor `service_role`.
- Etapa 4 moveu leituras de UI para queries server-only por usuario autenticado, sem `service_role`, e impediu amostras de parecerem dados reais fora de `local-demo`.
- Etapa 4 manteve Metacognicao, Inbox, Calendario, Revisao, Jardim e Atalaia como privados/owner-only na UI, com Atalaia lendo apenas grants compartilhados e sanitizados.
- Etapa 5 removeu `guardrail_status: not_run` da auditoria de IA, adicionou roteamento server-side OpenAI/DeepSeek com kill switch default off, consentimento por provider e redaction recursiva de metadados.
- Auditoria transversal do PR #7 reforcou `safeInvokeAi` com minimizacao de chaves sensiveis antes de provider, timeout abortavel por `AbortSignal`, limite diario stub antes de chamada real e guardrail de saida especifico para impedir vazamento de Metacognicao ao Atalaia.
- Fallback de crise de Metacognicao deixou de reecoar impulso/pensamento bruto do usuario bloqueado.
- Etapa 6 adicionou provider Resend server-only bloqueado por default, templates de e-mail sem conteudo sensivel, webhook com assinatura Svix, redaction de tokens/secrets e regressao para provider falho nao marcar notificacao como enviada.

## Supabase remoto

- Projeto base: `bceumcfmjftoukzrfthe` (`proposito_em_acao`), status ativo.
- Branch preview: `preview-release-readiness`, com migrations locais alinhadas ate `20260602214345`.
- Advisors de seguranca no preview: sem issues apos ativar `password_hibp_enabled` no Auth do preview.
- Advisors de performance: `unused_index` em `idx_energy_checkins_user_captured` e aviso informativo de estrategia de conexoes Auth.
- Matriz RLS dinamica passou historicamente no preview para dono, outro usuario, anonimo, Atalaia ativo e Atalaia revogado.
- A migration `20260603211654_accountability_acceptance_rls_hardening.sql` ainda nao foi aplicada em preview remoto nesta etapa.

## Riscos pendentes

- Validar Etapa 4 em preview HTTPS com Auth real, RLS remoto e fixtures de usuario antes de chamar `PROD-DEMO-001` de fechado para beta.
- Validar Supabase Auth real: signup, login, confirmacao de e-mail, callback, recovery/update de senha, logout, redirect seguro, refresh/getClaims e expiracao de sessao.
- Consentimentos de IA, analytics e feedback precisam ficar granulares, versionados, revogaveis e auditaveis antes do beta real.
- IA real ainda precisa de consentimento/auditoria persistidos, contador diario por usuario, readiness/smoke de provider real e evals reais autorizados antes de qualquer ativacao.
- Implementar retencao de 90 dias para analytics, feedback beta e metadados de auditoria de IA quando houver persistencia real.
- Definir/exportar/excluir dados reflexivos, Chamado, revisoes e energia antes da primeira coleta real.
- Validar convites do Atalaia em preview real com Auth SSR, expiracao, e-mail autenticado e trilha de auditoria.

## Addendum Prompt 16

Data: 2026-06-02.

- Headers minimos de seguranca foram adicionados em `next.config.ts`: CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e HSTS em producao.
- Supabase preview foi criado, migrations locais foram aplicadas e matriz RLS dinamica passou historicamente ate `20260602214345`.
- Producao aberta segue bloqueada ate validar Auth real, configurar secrets fora do Git, publicar preview/deploy, rodar smoke externo e aprovar LGPD minima.
- OpenAI/DeepSeek reais e e-mail real seguem desativados por padrao. Resend foi implementado localmente como provider server-only, mas continua bloqueado por dominio/secrets/smoke.
