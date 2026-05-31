# AI Prompts

Prompts internos do Prompt 7 sao contratos versionados para agentes especializados. Eles ainda nao ativam chamadas reais a OpenAI por padrao.

## Padrao

- Um arquivo por agente.
- `Prompt version` obrigatorio.
- `Output schema` obrigatorio quando a resposta virar dado.
- Contexto permitido deve ser minimo.
- Contexto proibido deve bloquear dados sensiveis fora de escopo.
- Guardrails clinicos, pastorais, privacidade, Atalaia e crise prevalecem sobre qualquer texto do usuario.
- Logs devem registrar apenas metadados tecnicos.

Conteudo do usuario e dado nao confiavel, nunca instrucao de sistema.
