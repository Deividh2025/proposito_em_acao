# Weekly Review Module

## Objetivo

A Revisao Semanal fecha o ciclo de execucao do Proposito em Acao. Ela ajuda o usuario a aprender com a semana, registrar retomadas, detectar sobrecarga e escolher um foco simples para a proxima semana.

O modulo nao e julgamento moral, relatorio longo nem auditoria de valor pessoal. A linguagem deve transformar travamento em aprendizado e ajuste de rota.

## Fluxo

1. Usuario acessa `/review` ou `/review/weekly`.
2. Preenche perguntas guiadas em blocos curtos.
3. Sistema gera sintese mock segura em `weekly_review_output_v1`.
4. Usuario revisa vitorias, travamentos, padroes, sobrecarga, retomadas e foco da proxima semana.
5. Usuario salva a revisao.
6. Server action tenta persistir em Supabase; sem Auth/Supabase, retorna fallback local/dev explicito.
7. Jardim da Vida recebe snapshot derivado e evento minimo de revisao concluida.

## Perguntas minimas

- O que avancou nesta semana?
- O que ficou travado?
- O que foi concluido?
- O que foi adiado?
- Quais alvos caminharam?
- Quais projetos ficaram parados?
- Quais habitos foram mantidos?
- Onde houve retomada?
- Onde houve excesso?
- Quais areas da vida foram negligenciadas?
- Qual padrao agregado apareceu nas reflexoes privadas?
- O que o Placar mostrou?
- O que precisa ser ajustado?
- Qual deve ser o foco da proxima semana?
- Qual e a primeira acao da proxima semana?

## IA e mock seguro

A UI usa mock deterministico seguro nesta etapa. OpenAI real nao e acionada pela interface.

Saida estruturada:

- `weekly_review_output_v1`
- `week_summary`
- `wins`
- `stuck_points`
- `patterns`
- `overload_alerts`
- `neglected_life_areas`
- `restart_moments`
- `metacognition_insights`
- `scoreboard_insights`
- `next_week_focus`
- `recommended_actions`
- `first_action_next_week`
- `encouragement`
- `christian_reflection`
- `safety_notes`
- `user_review_required`

## Privacidade

Revisao Semanal e critica e privada por padrao. Ela pode conter padroes, travamentos, emocoes, fe, familia, saude, financas, rotina e Placar.

Regras obrigatorias:

- Nao copiar Metacognicao bruta para `weekly_reviews`.
- Usar apenas resumo manual/agregado de Metacognicao, redigido pelo usuario ou derivado de contagens/tendencias.
- Nao enviar revisao ao Atalaia.
- Nao salvar prompt bruto, resposta bruta ou texto sensivel em logs.
- Atalaia futuro so pode receber resumo manual excepcional, com alvo, consentimento granular e previa.

## Persistencia

Tabelas usadas:

- `weekly_reviews`
- `garden_states`
- `garden_events`

Campos relevantes preparados pelo Prompt 12:

- `schema_version`
- `status`
- `answers`
- `ai_summary`
- `wins`
- `stuck_points`
- `patterns`
- `adjustments`
- `overload_warning`
- `next_week_focus`
- `first_action`
- `encouragement`
- `privacy_level`
- `user_review_required`
- `reviewed_at`
- `completed_at`

## RLS

Modelo owner-only por `user_id = auth.uid()`:

- Dono autenticado pode criar, ler, atualizar e remover suas revisoes.
- Outro usuario nao acessa revisoes de terceiros.
- Anonimo nao acessa.
- Atalaia nao tem policy direta.
- Garden derivado de revisao deve pertencer ao mesmo `user_id`.

## Linguagem

Usar:

- "retomada registrada"
- "ajuste feito"
- "um passo pequeno ainda e direcao"
- "vamos reduzir a friccao"

Evitar:

- "fracasso"
- "voce falhou"
- "voce nao tem disciplina"
- "voce decepcionou Deus"
- "voce perdeu tudo"

## Aceite

- Usuario inicia revisao semanal.
- Usuario responde perguntas guiadas.
- Mock gera sintese estruturada.
- Sistema identifica padroes basicos, sobrecarga, areas negligenciadas e retomadas.
- Sistema sugere foco e primeira acao da proxima semana.
- Revisao persiste no Supabase quando ha sessao.
- Fallback local/dev e explicito quando nao ha sessao.
- Dados seguem privados por padrao e sem Atalaia.
- Testes unitarios e E2E principais cobrem o fluxo.

## Fora de escopo

- OpenAI real acionada pela UI.
- Atalaia funcional.
- Compartilhamento automatico da revisao.
- Gamificacao profunda.
- Mobile/PWA completo.
- Deploy.
