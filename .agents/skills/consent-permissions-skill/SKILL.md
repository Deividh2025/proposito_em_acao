---
name: consent-permissions-skill
description: Padronizar consentimento granular, permissoes compartilhaveis e revogacao efetiva no Proposito em Acao.
---

# Consent Permissions Skill

## Quando usar

Use quando qualquer dado sair do espaco privado do usuario, especialmente Atalaia, Documento de Compromisso, notificacoes ou compartilhamentos futuros.

## Instrucoes praticas

1. Consentimento deve ser especifico por alvo, finalidade, campo, destinatario e versao.
2. Permissoes devem aparecer para o usuario com labels compreensiveis, nao ids internos.
3. Previa deve mostrar o que sera compartilhado e o que fica excluido.
4. Revogacao precisa ter efeito em leitura, fila de notificacao e proximos envios.
5. Nunca use consentimento generico para Chamado completo, Metacognicao, revisoes privadas, calendario completo, inbox bruto ou dados sensiveis.
6. Persistencia deve registrar `consent_version`, `consent_recorded_at`, status e auditoria minima.
7. Logs nao devem conter conteudo intimo compartilhado.

## Arquivos relacionados

- `src/domain/accountability/`
- `src/app/accountability/actions.ts`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/ACCOUNTABILITY_MODULE.md`

## Saida esperada

Retorne matriz de permissoes, texto de consentimento, revogacao, dados excluidos, testes negativos e pendencias LGPD.
