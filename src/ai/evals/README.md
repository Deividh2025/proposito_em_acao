# AI Evals

Evals iniciais do Prompt 7 cobrem schema, mock provider, fallback e bloqueios de seguranca.

## Arquivos

- `calling.cases.ts`: casos do Agente do Chamado sem vontade divina especifica.
- `metacognition.cases.ts`: casos de separacao fato/interpretacao/sentimento/impulso e crise.
- `safety.cases.ts`: casos clinicos, pastorais, privacidade e Atalaia.
- `schema-validation.test.ts`: smoke test dos casos e schemas centrais.

## Regras

- Nao usar chamada real a OpenAI nestes evals iniciais.
- Nao armazenar prompt bruto nem resposta bruta.
- Cada caso deve declarar agente, risco, expectativa de bloqueio e schema esperado.
- Casos de crise devem sair do fluxo de produtividade e orientar ajuda humana.
