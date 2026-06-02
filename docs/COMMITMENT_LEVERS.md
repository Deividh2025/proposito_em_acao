# Commitment Levers

## Objetivo

Alavancas de Compromisso usam recompensa e consequencia restaurativa para fortalecer compromisso sem vergonha, abuso ou sabotagem.

## Recompensas permitidas

- Pequena celebracao.
- Descanso planejado.
- Experiencia prazerosa proporcional.
- Compra moderada.
- Tempo com familia.
- Marco simbolico no Jardim.

## Consequencias restaurativas permitidas

- Replanejar o alvo.
- Fazer revisao curta.
- Enviar pedido de ajuda ao Atalaia.
- Reduzir escopo.
- Fazer acao minima de retomada.
- Registrar aprendizado.

## Bloqueios

Nao permitir humilhacao, exposicao publica, castigo fisico, castigo espiritual, jejum como punicao, vergonha publica, consequencia financeira desproporcional ou qualquer consequencia abusiva.

## Implementacao Prompt 13

`validateCommitmentLever` classifica alavancas como:

- `safe`
- `needs_review`
- `blocked`

Alavanca bloqueada impede salvar o Documento de Compromisso. Alavanca `needs_review` alerta o usuario antes de persistir.
