# Calling Module

## Principio

Chamado Pessoal e tratado como hipotese em discernimento, nao como sentenca final.

## Perguntas do onboarding

O Prompt 6 conduz perguntas sobre:

- incomodo no mundo;
- dor que deseja resolver;
- pessoas que deseja ajudar;
- legado;
- experiencias marcantes;
- dons e inclinacoes;
- valores;
- responsabilidade;
- vida frutifera;
- contribuicao diante de Deus com linguagem nao determinista.

## Schema

`src/ai/schemas/calling.ts` define `calling_draft_v1`:

- `calling_hypothesis`
- `direction_statement`
- `core_values`
- `recurring_burdens`
- `people_to_serve`
- `gifts_and_inclinations`
- `life_map_observations`
- `alignment_notes`
- `risks_or_imbalances`
- `suggested_next_steps`
- `confidence_level`
- `pastoral_safety_note`
- `status_suggestion`
- `user_review_required`

## Mock seguro

O Prompt 6 usa `buildCallingMockDraft`. Ele e previsivel, server/client-safe e nao chama OpenAI real.

## Guardrails

Bloqueios:

- vontade divina especifica;
- certeza absoluta;
- diagnostico;
- culpa espiritual;
- humilhacao;
- pressao emocional.

O usuario revisa e edita antes de aceitar.

## Persistencia

`callings` armazena hipotese, frase, arrays principais, confianca, versao de schema, guardrail e nota pastoral. `calling_session_entries` armazena respostas por pergunta com versao/ordem.

Migration preparatoria: `supabase/migrations/202605310004_onboarding_calling_metadata.sql`.

## Pendencias para IA real

- Definir modelo com docs oficiais atualizadas.
- Versionar prompt interno.
- Rodar evals negativos.
- Validar schema no servidor.
- Registrar apenas metadados minimos.
- Manter `OPENAI_API_KEY` server-only.
