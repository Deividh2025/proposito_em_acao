---
name: security-audit-skill
description: Use when auditing security, secrets, Supabase RLS, Auth, logs, LGPD, Atalaia, Metacognition, PWA cache, storage, OpenAI, and email before release in Proposito em Acao.
---

# Security Audit Skill

## Quando usar

Use em auditoria de seguranca, privacidade, LGPD, RLS, secrets, logs, mobile/PWA, IA, Atalaia, Metacognicao, storage ou notificacoes.

## Instrucoes praticas

1. Procure secrets, `NEXT_PUBLIC_*` indevido, `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e tokens.
2. Confirme `service_role` apenas server-only e nunca reexportado para cliente.
3. Revise RLS owner-only, FKs compostas, Atalaia por grant especifico e revogacao.
4. Confirme Metacognicao, Chamado, Revisao, Inbox, calendario, energia e distracoes privados por padrao.
5. Revise logs, e-mails, service worker/cache e notificacoes contra dados sensiveis.
6. Crie testes negativos quando achar risco reproduzivel.
7. Atualize `docs/SECURITY_AUDIT_REPORT.md`, `docs/RLS_TEST_REPORT.md` e docs de seguranca afetadas.

## Arquivos relacionados

- `docs/SECURITY_AUDIT_REPORT.md`
- `docs/RLS_TEST_REPORT.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/RLS_POLICIES.md`
- `supabase/migrations/`
- `src/lib/security/`

## Saida esperada

Retorne riscos por severidade, evidencias, correcoes, verificacoes, lacunas manuais e bloqueios antes de deploy.
