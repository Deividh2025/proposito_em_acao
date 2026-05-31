# PR Checklist

## Escopo

- [ ] PR pequeno e focado.
- [ ] Escopo alinhado ao PRD e ao plano aprovado.
- [ ] Nenhuma funcionalidade fora do combinado.
- [ ] Nenhum arquivo existente sobrescrito sem justificativa.

## Governanca

- [ ] Plano consultado ou criado quando necessario.
- [ ] `AGENTS.md` respeitado.
- [ ] Skills/subagentes usados quando aplicavel.
- [ ] Decisoes relevantes registradas em `docs/DECISIONS.md`.

## Seguranca e privacidade

- [ ] Nenhum `.env`, token, chave ou secret no diff.
- [ ] Dados sensiveis tratados como privados por padrao.
- [ ] Mudancas de banco demonstram RLS habilitado em todas as tabelas expostas.
- [ ] Politicas RLS testadas para dono, nao dono, anonimo, Atalaia autorizado e Atalaia revogado quando aplicavel.
- [ ] Autorizacao nao usa metadata editavel pelo usuario; roles/permissoes vem de `app_metadata` ou tabelas server-managed.
- [ ] Storage privado, views com `security_invoker` e funcoes privilegiadas fora de schemas expostos foram revisados quando aplicavel.
- [ ] Atalaia limitado por alvo e consentimento granular quando aplicavel.
- [ ] IA nao diagnostica, nao substitui profissionais e nao usa culpa espiritual.
- [ ] PRs que introduzem autenticacao, banco, IA real, analytics ou coleta de perfil incluem checklist LGPD antes da primeira coleta real.

## Documentacao

- [ ] README/docs atualizados quando comportamento, arquitetura, escopo ou fluxo muda.
- [ ] CHANGELOG atualizado quando houver mudanca relevante.
- [ ] `docs/SECURITY_NOTES.md` atualizado quando houver dados sensiveis, Supabase, IA ou Atalaia.

## Verificacao

- [ ] Lint, typecheck, testes e build executados quando houver stack.
- [ ] Limitacoes ou comandos nao executados foram reportados.
- [ ] Secret scan executado quando houver arquivos novos ou alterados.

## Revisao

- [ ] PR pronto para revisao Codex/CodeRabbit quando disponivel.
- [ ] Criterios de aceite demonstraveis.
