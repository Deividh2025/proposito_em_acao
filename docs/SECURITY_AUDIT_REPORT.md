# Security Audit Report - Prompt 15

Data: 2026-06-02.

## Resultado geral

Seguranca local e estatica melhorou durante o Prompt 15, mas deploy produtivo ainda deve aguardar validacao real de Supabase/RLS/Auth e revisao de LGPD/retencao.

## Checklist de seguranca

| Item | Status |
|---|---|
| `.env` real commitado | Nao encontrado no status Git; validar antes de push com secret scan. |
| `.env.example` | Existe com placeholders. |
| `OPENAI_API_KEY` no frontend | Nao deve existir; cliente OpenAI segue server-side. |
| `SUPABASE_SERVICE_ROLE_KEY` no frontend | Nao deve existir; service role fica server-only. |
| RLS em tabelas de usuario | Policies versionadas localmente; validacao remota completa pendente. |
| Usuario A x Usuario B | Cobertura estatica e testes de regressao SQL; execucao dinamica pendente. |
| Metacognicao privada | Confirmada por docs, actions e sem policy Atalaia. |
| Chamado privado | Confirmado por modelo/documentacao; validar remoto. |
| Revisao Semanal privada | Confirmada por modelo/documentacao; validar remoto. |
| Atalaia com grant granular | Policy local corrigida para grant/parceiro especifico. |
| Revogacao Atalaia | Actions cancelam pendentes e RLS checa status/revoked_at; teste dinamico pendente. |
| Logs sensiveis | IA audita metadados, sem prompt/resposta bruta por padrao. |
| PWA/cache | Service worker cacheia apenas assets estaticos seguros e pagina offline. |
| Storage | Privado por padrao nas migrations locais. |

## Achados corrigidos

- RLS de Atalaia foi estreitada para exigir `accountability_partner_id`, `partner_user_id` e `accountability_grant_id` especificos.
- Actions de Atalaia passaram a validar erro de update do grant no aceite.
- Persistencia owner-only de Desbloqueador e Metacognicao passou a rodar guardrails antes de salvar structured output enviado pelo cliente.
- Auth visual basico foi adicionado com server actions, sem service role e sem OAuth prematuro.

## Supabase remoto

- Projeto: `bceumcfmjftoukzrfthe` (`proposito_em_acao`), status ativo.
- Advisors de seguranca: sem lints retornados.
- Advisors de performance: `unused_index` em `idx_energy_checkins_user_captured` e aviso informativo de estrategia de conexoes Auth.
- Migrations remotas listadas: somente `20260602134002 mobile_pwa_prompt14_alignment`; isso nao comprova alinhamento com todas as migrations locais da V1.

## Riscos pendentes

- Aplicar migrations locais em branch/preview Supabase e rodar matriz RLS dinamica.
- Consentimentos precisam ficar granulares, versionados e auditaveis em producao.
- Definir politica de retencao/exportacao/exclusao para dados reflexivos, Chamado, revisoes e energia.
- Revisar convites com expiracao real, reenvio, aceite autenticado e trilha de auditoria.

## Addendum Prompt 16

Data: 2026-06-02.

- Headers minimos de seguranca foram adicionados em `next.config.ts`: CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e HSTS em producao.
- Supabase remoto foi consultado e permanece desalinhado: apenas `20260602134002 mobile_pwa_prompt14_alignment` aparece como migration aplicada.
- Producao aberta segue bloqueada ate aplicar migrations em preview, rodar RLS dinamica, validar Auth real, configurar secrets fora do Git e aprovar LGPD minima.
- OpenAI real e e-mail real seguem desativados por padrao.
