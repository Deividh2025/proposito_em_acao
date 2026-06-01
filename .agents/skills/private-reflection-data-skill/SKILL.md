---
name: private-reflection-data-skill
description: Padronizar dados privados de reflexao, metacognicao, distracoes, habitos e placar sensivel.
---

# Private Reflection Data Skill

## Quando usar

Use ao criar, revisar ou alterar dados privados de reflexao, Metacognicao, distracoes, energia, habitos, Placar, revisoes, logs de IA ou qualquer dado que possa revelar vida intima.

## Instrucoes praticas

1. Privado por padrao.
2. Minimize coleta, texto bruto, historico e logs.
3. Nao compartilhar com Atalaia sem selecao manual, previa e consentimento granular.
4. Conteudo sensivel deve ter RLS owner-only e fallback local/dev claro.
5. IA deve salvar resultado estruturado, nao prompt/resposta bruta por padrao.
6. Rotas de crise devem orientar ajuda humana adequada, nao produtividade.

## Arquivos relacionados

- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/RLS_POLICIES.md`
- `src/lib/security/`
- `src/ai/guardrails/`

## Saida esperada

Retorne campos sensiveis, retencao, logs permitidos, compartilhamento bloqueado e verificacoes.
