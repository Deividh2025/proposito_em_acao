# Habits Module

## Objetivo

Habitos transformam direcao em repeticao realista, com baixa friccao, versao minima, gatilho, recompensa, ambiente e retomada.

## Entrada

- Habito desejado.
- Motivo.
- Area da vida.
- Frequencia.
- Dificuldade provavel.
- Melhor horario ou contexto.
- Relacao opcional com alvo ou Chamado.

## Saida de IA/mock

`habit_plan_output_v1` inclui identidade, motivo, area, gatilho, versao minima, versao ideal, sugestao de agenda, recompensa, obstaculo, plano se/entao, ambiente, frequencia, metrica, itens de Placar, plano de retomada, risco de sobrecarga, ajustes e revisao humana obrigatoria.

## Marcacoes

- `done_minimum`: fez o minimo.
- `done_ideal`: fez o ideal.
- `restarted`: retomou depois de falha, pausa ou atraso.
- `paused_consciously`: pausou de forma consciente.
- `missed` e `skipped`: estados tecnicos sem punicao visual.

## Regras

Todo habito deve ter versao minima e plano de retomada. Falha nao vira identidade. Pausa consciente nao e fracasso. Habitos sobre saude, fe, familia, emocoes e rotina sao sensiveis.

## Persistencia

`habits` e `habit_logs` usam Supabase owner-only quando ha sessao e fallback `local-draft` quando Auth/Supabase nao esta ativo.

## Fora de escopo

Automacao externa, recorrencia avancada, notificacoes reais, Atalaia funcional, Revisao Semanal funcional, Jardim funcional e OpenAI real acionada por UI.
