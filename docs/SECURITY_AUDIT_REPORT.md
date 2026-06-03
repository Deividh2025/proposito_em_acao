# Security Audit Report - Prompt 15

Data: 2026-06-02.

## Estado atual verificado em 2026-06-03

Veredito: seguranca ainda bloqueia beta real. A evidencia local e historica nao deve ser usada para declarar producao pronta.

Achados bloqueantes:

- S0 `SEC-ATL-001`: aceite do Atalaia pode permitir expansao de escopo se `permissions`/`goal_id`/campos de grant forem alteraveis durante `invited -> active`.
- S0 `SEC-ATL-002`: tela de aceite usa grant demonstrativo em vez de convite real.
- S1 `SEC-CONSENT-001`: consentimento/auditoria/revogacao nao sao confiaveis; `consent_records` nao e escrito e inserts de eventos/notificacoes ignoram erro.
- S1 `AUTH-SSR-001`: Auth SSR incompleto; faltam refresh centralizado, callback, confirmacao e recuperacao validados.
- S2 residual `SEC-CSP-001`: CSP de producao nao usa mais `unsafe-eval`, mas ainda permite `unsafe-inline` ate etapa de nonce/hash.
- S1 `AI-GUARD-001`: path de provider de IA registra guardrails como `not_run`.

Ver `docs/BUG_TRIAGE.md` para IDs, evidencias e criterios de fechamento.

## Resultado geral

Seguranca local e estatica melhorou durante o Prompt 15. No preview Supabase, migrations e matriz RLS dinamica foram validadas historicamente em 2026-06-02; deploy produtivo e beta real ainda devem aguardar rerun fresco, Auth real, secrets/deploy, smoke externo, revisao de LGPD/retencao e correcao dos S0/S1 acima.

## Checklist de seguranca

| Item | Status |
|---|---|
| `.env` real commitado | Nao encontrado no status Git; validar antes de push com secret scan. |
| `.env.example` | Existe com placeholders. |
| `OPENAI_API_KEY` no frontend | Nao deve existir; cliente OpenAI segue server-side. |
| `SUPABASE_SERVICE_ROLE_KEY` no frontend | Nao deve existir; service role fica server-only. |
| RLS em tabelas de usuario | Migrations aplicadas em preview e matriz dinamica passou. |
| Usuario A x Usuario B | Isolamento validado dinamicamente no preview com fixtures temporarios. |
| Metacognicao privada | Confirmada por docs, actions e sem policy Atalaia. |
| Chamado privado | Confirmado por modelo/documentacao; validar remoto. |
| Revisao Semanal privada | Confirmada por modelo/documentacao; validar remoto. |
| Atalaia com grant granular | Policy local corrigida para grant/parceiro especifico. |
| Revogacao Atalaia | Actions cancelam pendentes e RLS checa status/revoked_at; revogacao validada dinamicamente no preview. |
| Logs sensiveis | IA audita metadados, sem prompt/resposta bruta por padrao. |
| PWA/cache | Service worker cacheia apenas assets estaticos seguros e pagina offline. |
| Storage | Privado por padrao nas migrations locais. |

## Achados corrigidos

- Etapa 1 adicionou `APP_RUNTIME_MODE` e helpers de resultado para impedir que erro real de Supabase/Auth vire `local-draft ok:true`.
- Etapa 1 confirmou linha afetada em updates/deletes priorizados e retornou `ok:false` quando RLS/owner/filter resulta em zero linha.
- Etapa 1 passou a checar escritas secundarias ja existentes em Atalaia, Revisao, Compromissos e Foco, sem alterar RLS/migrations ou fluxo transacional.
- Etapa 1 removeu `unsafe-eval` do CSP de producao; `unsafe-inline` permanece como risco residual documentado.
- RLS de Atalaia foi estreitada para exigir `accountability_partner_id`, `partner_user_id` e `accountability_grant_id` especificos.
- Actions de Atalaia passaram a validar erro de update do grant no aceite.
- Persistencia owner-only de Desbloqueador e Metacognicao passou a rodar guardrails antes de salvar structured output enviado pelo cliente.
- Auth visual basico foi adicionado com server actions, sem service role e sem OAuth prematuro.

## Supabase remoto

- Projeto base: `bceumcfmjftoukzrfthe` (`proposito_em_acao`), status ativo.
- Branch preview: `preview-release-readiness`, com migrations locais alinhadas ate `20260602214345`.
- Advisors de seguranca no preview: sem issues apos ativar `password_hibp_enabled` no Auth do preview.
- Advisors de performance: `unused_index` em `idx_energy_checkins_user_captured` e aviso informativo de estrategia de conexoes Auth.
- Matriz RLS dinamica passou no preview para dono, outro usuario, anonimo, Atalaia ativo e Atalaia revogado.

## Riscos pendentes

- Validar Supabase Auth real: signup, login, confirmacao de e-mail, logout, redirect e expiracao de sessao.
- Consentimentos precisam ficar granulares, versionados, revogaveis e auditaveis antes do beta real.
- Implementar retencao de 90 dias para analytics, feedback beta e metadados de auditoria de IA quando houver persistencia real.
- Definir/exportar/excluir dados reflexivos, Chamado, revisoes e energia antes da primeira coleta real.
- Revisar convites com expiracao real, reenvio, aceite autenticado e trilha de auditoria.

## Addendum Prompt 16

Data: 2026-06-02.

- Headers minimos de seguranca foram adicionados em `next.config.ts`: CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e HSTS em producao.
- Supabase preview foi criado, migrations locais foram aplicadas e matriz RLS dinamica passou.
- Producao aberta segue bloqueada ate validar Auth real, configurar secrets fora do Git, publicar preview/deploy, rodar smoke externo e aprovar LGPD minima.
- OpenAI/DeepSeek reais e e-mail real seguem desativados por padrao. Resend foi decidido, mas ainda nao implementado/configurado.
