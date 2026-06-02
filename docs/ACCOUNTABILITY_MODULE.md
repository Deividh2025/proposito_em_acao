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
7. Atalaia aceita convite.
8. Atalaia acessa painel limitado.
9. Usuario pode revogar acesso.

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

## RLS

Atalaia so le linhas de accountability/documento compartilhado quando houver grant ativo, alvo especifico, permissao e revogacao ausente. Nao ha policy direta em tabelas brutas de metas, tarefas, habitos, Placar, Revisao Semanal, Jardim, Metacognicao, calendario ou inbox.

## Aceite

- Convite e previa aparecem na UI.
- Permissoes sao explicitas e editaveis.
- Painel limitado deixa claro o que nao aparece.
- Revogacao cancela notificacoes pendentes.
- Mensagem ao Atalaia passa por privacy check.
- E-mail real permanece desativado sem provider.
