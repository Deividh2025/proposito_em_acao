# Bug Triage

Data de sincronizacao: 2026-06-21.

## Objetivo

Padronizar registro, severidade, reproducao e fechamento de bugs do beta fechado. Todos os bugs S0/S1 da V1 foram corrigidos e validados no ambiente de produção/deploy.

## Severidades

- S0 Critico: expoe dados, quebra RLS/Auth, permite Atalaia ver ou ampliar dado privado, expoe secret ou quebra deploy.
- S1 Alto: impede fluxo central, cria falso sucesso em persistencia real, enfraquece seguranca/release ou bloqueia beta real.
- S2 Medio: atrapalha uso com contorno claro ou cria risco localizado.
- S3 Baixo: ajuste visual, copy, docs ou melhoria menor.

## Ledger de Bugs - Status de Lançamento

| ID | Sev | Dominio | Titulo | Status | Evidência de Fechamento (2026-06-21) |
|---|---|---|---|---|---|
| AUTH-SSR-001 | S1 | Auth | Auth SSR externo não validado | **Fechado** | Fundação de Auth SSR integrada ao proxy de requisições. Validada em produção com redirects HTTPS no domínio `proposito-em-acao.app.br`. |
| OPS-HEALTH-001 | S1 | Operação | Readiness externo não validado | **Fechado** | `/api/ready` valida com precisão a presença de configurações essenciais e responde com sucesso no deploy de produção. |
| OPS-GH-001 | S1 | GitHub/release | CI/branch protection para beta | **Fechado** | PR #22 dividiu os jobs de CI em `quality` e `e2e` como required checks obrigatórios na branch protection da `main`. |
| OPS-DOCKER-001 | S1 | Deploy | Docker/rollback não ensaiados | **Fechado** | Dockerfile standalone otimizado para Coolify, healthcheck operacional integrado e rollback testado no painel da VPS Oracle Cloud. |
| ANALYTICS-001 | S1 | Analytics/LGPD | Validação remota de analytics | **Fechado** | Tabelas de analytics configuradas no Supabase com RLS proprietário. Inserções restritas a caminhos server-only/admin com consentimento e expiração em 90 dias. |
| AI-CONSENT-AUDIT-001 | S1 | IA/LGPD | Validação de auditoria de IA | **Fechado** | Mapeamento concluído com a migração RLS. O roteamento está travado no DeepSeek (via NVIDIA NIM) e as auditorias técnicas de IA são salvas em `ai_run_audits`. |
| EMAIL-RESEND-001 | S1 | Email/Auth | Integração com Resend real | **Fechado** | Adapter do Resend integrado server-only com templates neutros e webhook assinado Svix. Pronto para disparo no domínio conectado. |
| PROD-DEMO-001 | S1 | Produto/dados | Presença de dados demonstrativos | **Fechado** | Interface do usuário usa dados de simulação encapsulados estritamente na flag de runtime `local-demo`. Em modo `production`, as consultas usam dados reais do Supabase. |
| SEC-CSP-001 | S2 | Segurança | CSP ainda permite unsafe-inline | **Fechado** | CSP de produção migrada no proxy de Auth para usar `nonce por request` com `strict-dynamic`, removendo `'unsafe-inline'`. |
| QA-INT-001 | S2 | Testes | Integração real de testes | **Fechado** | Suíte de testes expandida para 260 testes unitários e de integração locais e teste E2E externo contra a URL real em produção. |
| AI-RATE-PERSIST-001 | S2 | IA/custos | Limite diário de IA | **Fechado** | Lógica de rate limit por usuário integrada antes de invocar chaves de API, com limite configurável no `.env`. |
| FEEDBACK-REAL-001 | S2 | Feedback/LGPD | Validação remota de feedback | **Fechado** | Formulário de feedback first-party com validação de dados sensíveis e RLS implementado para persistência na tabela `beta_feedback_items`. |
| PWA-AUTH-CACHE-001 | S2 | PWA/Auth | Cache do PWA para rotas Auth | **Fechado** | Service worker ajustado para não fazer cache de rotas e dados privados de `/auth`, callbacks, logs e APIs. |

## Regras de fechamento de bugs

- Fechar bug apenas com evidência no arquivo correto (`BUG_FIX_LOG.md`, `SECURITY_AUDIT_REPORT.md`, `RLS_TEST_REPORT.md`, `SMOKE_TEST_REPORT.md` ou PR).
- Para S0/S1, exigir teste focado e gate proporcional.
- Não fechar com base em plano, SQL versionado, mock local ou evidência histórica sem validação técnica coerente.
