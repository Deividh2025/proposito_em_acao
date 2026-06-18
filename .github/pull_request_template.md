<!-- Espelha docs/PR_CHECKLIST.md. Marque o que se aplica; reporte limitacoes. -->

## Resumo

<!-- O que este PR entrega, em 1-3 frases. -->

## Plano / contexto

<!-- Link ou referencia ao plano aprovado (PLANS.md / docs/). Fonte de verdade consultada. -->

## Como testar

<!-- Passos e comandos para verificar. -->

## Rollback

<!-- Como desfazer com seguranca, se necessario. -->

---

### Escopo

- [ ] PR pequeno e focado.
- [ ] Escopo alinhado ao PRD e ao plano aprovado.
- [ ] Nenhuma funcionalidade fora do combinado.
- [ ] Nenhum arquivo existente sobrescrito sem justificativa.

### Governanca

- [ ] Plano consultado ou criado quando necessario.
- [ ] `AGENTS.md` respeitado.
- [ ] Skills/subagentes usados quando aplicavel.
- [ ] Decisoes relevantes registradas em `docs/DECISIONS.md`.

### Seguranca e privacidade

- [ ] Nenhum `.env`, token, chave ou secret no diff.
- [ ] Dados sensiveis tratados como privados por padrao.
- [ ] Mudancas de banco demonstram RLS habilitado em todas as tabelas expostas.
- [ ] Politicas RLS testadas para dono, nao dono, anonimo, Atalaia autorizado e Atalaia revogado quando aplicavel.
- [ ] Autorizacao nao usa metadata editavel pelo usuario; roles/permissoes vem de `app_metadata` ou tabelas server-managed.
- [ ] Storage privado, views com `security_invoker` e funcoes privilegiadas fora de schemas expostos foram revisados quando aplicavel.
- [ ] Atalaia limitado por alvo e consentimento granular quando aplicavel.
- [ ] IA nao diagnostica, nao substitui profissionais e nao usa culpa espiritual.
- [ ] PRs que introduzem autenticacao, banco, IA real, analytics ou coleta de perfil incluem checklist LGPD antes da primeira coleta real.

### Documentacao

- [ ] README/docs atualizados quando comportamento, arquitetura, escopo ou fluxo muda.
- [ ] CHANGELOG atualizado quando houver mudanca relevante.
- [ ] `docs/SECURITY_NOTES.md` atualizado quando houver dados sensiveis, Supabase, IA ou Atalaia.

### Verificacao

- [ ] Lint, typecheck, testes e build executados quando houver stack.
- [ ] Limitacoes ou comandos nao executados foram reportados.
- [ ] Secret scan executado quando houver arquivos novos ou alterados.

### Release/preview

- [ ] Mudancas de deploy/release documentam se houve ou nao URL HTTPS publicada.
- [ ] Preview Hostinger/Coolify so e marcado pronto com dominio/HTTPS, secrets no provedor, logs, health/ready, smoke externo e rollback ensaiado.
- [ ] Beta/producao permanecem bloqueados se `OPS-GH-001`, `OPS-DOCKER-001` ou `OPS-HEALTH-001` seguirem sem evidencia fresca.
- [ ] Branch protection efetiva, CI/gates, release/tag e deployment anterior conhecido foram verificados ou a limitacao operacional foi registrada.

### Revisao

- [ ] PR pronto para revisao Codex/CodeRabbit quando disponivel.
- [ ] Criterios de aceite demonstraveis.
