---
name: accountability-permission-skill
description: Padronizar acesso do Atalaia por alvo, consentimento granular e revogacao no Proposito em Acao.
---

# Accountability Permission Skill

## Quando usar

Use em qualquer mudanca de Atalaia, grants, consentimentos, mensagens, notificacoes, Documento de Compromisso, Placar compartilhavel ou acesso externo.

## Quando nao usar

Nao use para dados privados do usuario que nao serao compartilhados. Nesses casos, use `security-privacy-skill` e mantenha privado por padrao.

## Instrucoes praticas

1. Atalaia e vinculado a um `goal_id`, nunca a conta inteira.
2. `accountability_partners` nao concede acesso sozinho.
3. `accountability_grants` deve conter escopos explicitos e revogacao.
4. Previa e obrigatoria antes de qualquer mensagem.
5. Metacognicao, Chamado completo, revisoes privadas, inbox bruto, calendario completo, saude, familia, financas e emocoes ficam excluidos por padrao.
6. Revogacao deve cortar leitura e notificacoes pendentes.
7. Logs de Atalaia guardam metadados minimos, nao mensagens intimas completas.
8. Testes negativos devem cobrir outro alvo, outro usuario, permissao ausente e grant revogado.

## Arquivos relacionados

- `docs/RLS_POLICIES.md`
- `docs/SUPABASE_AUTH.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `supabase/migrations/`
- `src/domain/accountability/types.ts`

## Formato de saida esperado

Retorne grants/modelo, escopos permitidos, dados proibidos, policies, criterios de aceite, testes negativos e riscos de vazamento.
