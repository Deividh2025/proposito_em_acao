# Life Garden Module

## Objetivo

O Jardim da Vida transforma progresso em percepcao visual. Ele mostra crescimento, cuidado e retomada nas areas do Mapa da Vida sem punir falhas, sem comparar usuarios e sem usar vergonha como motor.

O Jardim inicial e simples: um snapshot visual por area, alimentado por eventos minimos e revisoes semanais.

## Areas

As areas seguem o Mapa da Vida:

- Fe e espiritualidade.
- Saude e energia.
- Familia.
- Trabalho/carreira.
- Financas.
- Emocoes.
- Relacionamentos.
- Aprendizado.
- Descanso.
- Servico/contribuicao.

## Estados visuais

Estados permitidos:

- `seed`: inicio ou pouco dado.
- `sprout`: pequeno crescimento recente.
- `growing`: progresso consistente.
- `fruitful`: area bem cuidada na semana.
- `needs_care`: convite de cuidado.

`needs_care` nao significa morte, punicao ou derrota. A area continua viva e recebe uma mensagem de cuidado.

## Eventos de crescimento

Eventos iniciais aceitos:

- Conclusao de tarefa vinculada a area da vida.
- Sessao de foco concluida.
- Habito marcado.
- Retomada registrada.
- Revisao semanal concluida.
- Alvo avancado.
- Projeto avancado.
- Metacognicao concluida com proxima acao.
- Descanso protegido.
- Bloco de familia, espiritualidade ou saude respeitado.

## Estrutura

Saida estruturada:

```json
{
  "schema_version": "garden_state_output_v1",
  "garden_state": {
    "life_areas": [
      {
        "area": "string",
        "growth_level": 1,
        "recent_events": ["string"],
        "care_needed": true,
        "care_message": "string",
        "visual_state": "seed"
      }
    ],
    "unlocked_items": ["string"],
    "weekly_growth_summary": "string"
  }
}
```

## Persistencia

Tabelas usadas:

- `garden_states`: snapshot atual do Jardim por usuario.
- `garden_events`: eventos minimos de crescimento/cuidado.
- `weekly_reviews`: origem opcional de resumo semanal.

O Jardim e derivado. Ele nao deve virar uma segunda base de dados intimos.

## Privacidade

Regras obrigatorias:

- `garden_events.metadata_minimal` so pode conter metadados curtos, tecnicos e nao intimos.
- Chaves como `raw_thought`, `private_note`, `prompt`, `raw_response` e `metacognition_text` sao proibidas.
- Jardim nao deve expor revisao, Metacognicao, calendario bruto, Placar bruto ou habitos sensiveis a terceiros.
- Atalaia nao tem acesso direto ao Jardim nesta etapa.

## UX

- Mostrar progresso pequeno.
- Valorizar retomadas.
- Usar cores calmas e simbolos de cuidado.
- Evitar vermelho agressivo.
- Evitar ranking, comparacao, streak quebrado ou plantas mortas.
- Em area negligenciada, usar convite: "Convite de cuidado, nao punicao."

## Aceite

- Usuario acessa `/garden`.
- Todas as areas aparecem.
- Area com progresso mostra crescimento.
- Area negligenciada mostra cuidado necessario sem linguagem punitiva.
- Eventos recentes aparecem como acoes reais.
- Snapshot pode ser derivado de revisao semanal.
- Dados permanecem privados e owner-only.

## Fora de escopo

- Loja, moedas, XP, ranking ou gamificacao profunda.
- Compartilhamento publico.
- Avatar/itens cosmeticos complexos.
- Mobile/PWA completo.
