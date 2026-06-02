---
name: commitment-document-skill
description: Padronizar Documento de Compromisso, revisao humana, compartilhamento opcional e persistencia segura.
---

# Commitment Document Skill

## Quando usar

Use ao criar, revisar ou alterar Documento de Compromisso, prompts/schemas de compromisso, tela `/commitments`, storage ou compartilhamento com Atalaia.

## Instrucoes praticas

1. Documento nasce privado, editavel e revisavel.
2. Compartilhamento exige grant ativo, permissao `commitment_document`, previa e consentimento.
3. Conteudo deve incluir alvo, prazo, compromisso, primeira acao, projetos/habitos de apoio e Atalaia opcional.
4. Chamado so pode entrar como resumo curto autorizado; nunca texto completo automatico.
5. Alavancas devem ser saudaveis, restaurativas e sem vergonha.
6. Sem Auth/Supabase, use fallback local/dev explicito.
7. Documento compartilhado deve registrar revisao, consentimento e horario de compartilhamento.

## Arquivos relacionados

- `src/app/commitments/`
- `src/components/commitments/`
- `src/domain/commitments/`
- `src/ai/schemas/commitment-document.ts`
- `docs/COMMITMENT_DOCUMENT_MODULE.md`

## Saida esperada

Retorne estrutura do documento, permissao de compartilhamento, alavancas, riscos de privacidade, testes e docs afetadas.
