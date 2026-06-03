# Accountability Module

## Objetivo

Atalaia oferece responsabilidade externa saudavel para um alvo especifico. Ele nao supervisiona a conta inteira e nao recebe dados intimos por padrao.

## Fluxo Prompt 13

1. Usuario escolhe um alvo.
2. Informa nome e e-mail do Atalaia.
3. Escolhe nivel: leve, equilibrado ou firme.
4. Escolhe permissoes granulares.
5. Revisa previa da mensagem.
6. Cria convite ou rascunho local/dev.
7. Atalaia autenticado visualiza preview real sanitizada do convite.
8. Atalaia aceita convite por action server-side, sem alterar escopo.
9. Atalaia acessa painel limitado.
10. Usuario pode revogar acesso.

## Permissoes permitidas

- Nome do alvo.
- Prazo.
- Status geral.
- Progresso percentual.
- Marcos concluidos.
- Resumo limitado do Placar vinculado ao alvo.
- Pedido de ajuda.
- Alerta de atraso.
- Conclusao.
- Mensagem personalizada.
- Documento de Compromisso.

## Excluido por padrao

Metacognicao, Chamado completo, Mapa da Vida completo, saude, familia, financas, emocoes, Revisao Semanal completa, inbox bruto, agenda completa, distracoes de foco, prompts e respostas brutas de IA.

## Persistencia

Tabelas usadas:

- `accountability_partners`
- `accountability_grants`
- `accountability_events`
- `accountability_notifications`
- `commitment_documents`

Sem Auth/Supabase, o fluxo retorna `local-draft` e nao promete persistencia real.

Na Etapa 2, o fluxo persistido do Atalaia tambem usa `consent_records` para consentimento versionado de criacao, aceite e revogacao. Eventos e notificacoes obrigatorias retornam `ok:false` quando falham; a action nao deve declarar sucesso se auditoria obrigatoria nao foi persistida.

As actions da Etapa 2 evitam publicar token/estado utilizavel antes das escritas obrigatorias: criacao so ativa o convite depois de auditoria e notificacao; aceite so ativa acesso depois de consentimento e evento. Falhas tentam expirar o convite sem declarar sucesso. RPC transacional em `app_private` segue como melhoria recomendada antes do beta real.

## RLS

Atalaia so le linhas de accountability/documento compartilhado quando houver grant ativo, alvo especifico, permissao e revogacao ausente. Nao ha policy direta em tabelas brutas de metas, tarefas, habitos, Placar, Revisao Semanal, Jardim, Metacognicao, calendario ou inbox.

## Aceite

- Convite e previa reais aparecem na UI quando Supabase/Auth estao configurados.
- Token invalido, expirado, revogado, ja aceito, sem sessao ou com e-mail divergente mostra estado seguro e nao ativa grant.
- Permissoes sao explicitas e editaveis apenas pelo dono antes de salvar.
- Troca de nivel pode sugerir defaults, mas permissoes desmarcadas pelo dono nao voltam automaticamente.
- Aceite ativa apenas o grant vinculado ao token hash, parceiro, owner e e-mail autenticado.
- O convidado nao pode alterar `permissions`, `sharing_permissions`, `goal_id`, `user_id`, `accountability_partner_id`, `tracking_level`, `notification_frequency`, `consent_version`, `consent_recorded_at` ou `expires_at`.
- Painel limitado deixa claro o que nao aparece.
- Revogacao cancela notificacoes pendentes.
- Mensagem ao Atalaia passa por privacy check.
- E-mail real permanece desativado sem provider.

## Migration de hardening

`20260603211654_accountability_acceptance_rls_hardening.sql` adiciona `invite_token_hash` em `accountability_grants`, remove policies diretas de aceite por convidado e cria triggers defensivas em `app_private` com `search_path` seguro. Nenhuma policy nova de Atalaia foi criada em Chamado, Metacognicao, Revisao Semanal, inbox, calendario, saude, familia, financas, emocoes, `audit_events` ou `ai_run_audits`.

Status: validado localmente por testes unitarios/integracao e estaticos. Supabase preview remoto ainda precisa de dry-run, aplicacao em branch aprovada e harness dinamico.
