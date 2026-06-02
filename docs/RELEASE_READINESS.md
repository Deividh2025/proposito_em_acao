# Release Readiness - Prompt 15

Data: 2026-06-02.

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
- Aprovar modelo OpenAI, custos, limites e base de conhecimento antes de ativar IA real.

## Checklist de aprovacao para Prompt 16

- [ ] Fundador aprova aplicar migrations em ambiente de preview.
- [ ] Fundador aprova dominio/plataforma de deploy.
- [ ] Fundador aprova provider de e-mail ou mantem notificacoes desativadas.
- [ ] Fundador aprova politica minima de privacidade/termos/consentimento.
- [ ] Fundador aprova se OpenAI real continua desativada no primeiro deploy.
- [ ] Fundador aprova plano de rollback.

## Decisao

Prompt 15 deixa a V1 localmente verde e auditada. O Prompt 16 deve ser tratado como deploy controlado/preview com validacao Supabase real, nao como producao aberta.
