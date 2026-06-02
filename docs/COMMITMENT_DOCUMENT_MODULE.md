# Commitment Document Module

## Objetivo

Documento de Compromisso consolida um alvo importante em texto revisavel, com primeira acao, projetos, habitos, Placar limitado, Atalaia escolhido, recompensa e consequencia restaurativa.

## Regra central

O documento nasce privado e nao e enviado automaticamente. Compartilhamento exige revisao do usuario, grant ativo, permissao `commitment_document` e previa segura.

## Conteudo minimo

- Nome do usuario.
- Nome do alvo.
- Resumo curto do Chamado somente se autorizado.
- Prazo.
- Projetos vinculados.
- Habitos de suporte.
- Itens limitados do Placar.
- Atalaia escolhido.
- Recompensa.
- Consequencia restaurativa.
- Primeira acao.
- Declaracao de compromisso.
- Data de criacao quando persistido.
- Permissoes de compartilhamento.

## Privacidade

Chamado completo, Metacognicao, saude, familia, financas, emocoes, revisoes privadas, inbox bruto e calendario completo ficam fora por padrao.

## Persistencia

Tabelas usadas:

- `commitment_documents`
- `commitment_levers`

A migration `202606010010_accountability_commitment_prompt13_alignment.sql` adiciona `structured_content`, `sharing_permissions`, `privacy_check`, `reviewed_at`, `shared_at` e checks contra chaves sensiveis.

## Aceite

- Usuario gera documento por mock seguro.
- Usuario revisa antes de salvar.
- Documento salvo fica privado por padrao.
- Compartilhamento nao acontece sem grant e permissao explicita.
