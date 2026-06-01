# Security and Privacy

Este documento e fonte de verdade para seguranca, privacidade, consentimento, Atalaia, Metacognicao, IA, logs e preparacao futura de Supabase/RLS. Ele nao substitui revisao juridica LGPD antes de producao.

## Dados sensiveis

Devem ser tratados como sensiveis desde a concepcao: fe, saude, sono, energia, familia, relacionamentos, financas, emocoes, pensamentos, impulsos, Chamado, Metacognicao, calendario, habitos, Placar, Revisao Semanal, Atalaia e Documento de Compromisso.

## Prompt 6 - Onboarding

O onboarding coleta dados sensiveis de perfil, Mapa da Vida e Chamado. Regras especificas:

- Campos longos e sensiveis devem ser opcionais ou adiaveis.
- O fluxo nao deve gravar conteudo intimo em `localStorage`.
- Sem sessao Supabase/Auth, o app deve exibir fallback local/dev e nao prometer persistencia real.
- Antes de producao, consentimento versionado, retencao, exportacao e exclusao devem estar definidos.
- Chamado completo e respostas do Chamado nao devem ir ao Atalaia por padrao.
- Mock de IA nao envia dados a OpenAI e deve ser marcado como substituivel.

## Principios

- Privacidade por padrao.
- Coleta minima e finalidade clara.
- Consentimento granular, versionado, auditavel e revogavel.
- Menor privilegio.
- Validacao server-side para acoes sensiveis quando a stack existir.
- Logs sem conteudo intimo bruto.
- Compartilhamento externo somente por escopo e previa clara.

## Consentimento

Consentimentos minimos futuros:

1. Termos e politica de privacidade.
2. Uso de IA.
3. Tratamento de dados sensiveis.
4. Comunicacoes.
5. Analytics/telemetria, se houver.
6. Atalaia por alvo e por escopo.
7. Compartilhamento de Documento de Compromisso.
8. Uso de dados em avaliacoes/evals internas, se aprovado.

Cada consentimento deve registrar tipo, versao, data de aceite, data de revogacao, escopo e recurso relacionado quando aplicavel.

## Atalaia

Atalaia deve ser vinculado a um alvo especifico. Nao existe acesso a conta inteira.

Permissoes permitidas na V1:

- Status do alvo.
- Progresso autorizado.
- Marcos autorizados.
- Atraso autorizado.
- Pedido de ajuda.
- Resumo limitado do Placar, se o usuario autorizar.

Excluidos por padrao:

- Chamado completo.
- Metacognicao.
- Saude.
- Familia.
- Financas.
- Emocoes.
- Revisoes privadas.
- Inbox bruto.
- Calendario completo.

Toda mensagem ao Atalaia deve ter previa clara antes de envio. Revogacao deve ter efeito imediato quando a arquitetura permitir.

## Metacognicao

Metacognicao e privada por padrao. O historico pode conter pensamento bruto, emocoes, impulsos e fragilidades internas, portanto nao deve ser compartilhado automaticamente, nao deve entrar em logs brutos e nao deve ser tratado como prontuario clinico.

Compartilhamento com Atalaia so pode ocorrer por selecao manual de um resumo especifico, com consentimento explicito, previa e escopo.

## RLS futura no Supabase

Na fundacao Prompt 4:

- Toda tabela em schema exposto deve ter RLS habilitado.
- Politicas devem refletir dono, escopo, Atalaia autorizado e Atalaia revogado.
- Evitar autorizacao baseada em metadata editavel pelo usuario.
- Preferir `app_metadata` ou tabelas server-managed para autorizacao.
- `service_role` nunca deve ir para cliente, mobile, browser, logs ou `NEXT_PUBLIC_*`.
- Storage privado por padrao.
- Views expostas devem respeitar RLS; em Postgres 15+, preferir `security_invoker = true`.
- Funcoes `security definer` nao devem ficar em schema exposto.
- As migrations preparadas deixam Metacognicao, Chamado completo, revisoes privadas, inbox bruto, calendario completo e logs owner-only.
- Atalaia acessa apenas accountability/grants/notificacoes/documento compartilhado, com grant ativo e revogacao.
- Storage privado exige path por usuario e signed URL server-side para compartilhamento futuro.

## Secrets

- Nunca commitar `.env`, `.env.local`, tokens, chaves, certificados, webhooks ou credenciais.
- `.env.example` contem somente placeholders.
- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e tokens de e-mail sao server-side.
- Qualquer secret exposto deve ser considerado comprometido e rotacionado.

## Logs

Logs permitidos:

- ID interno ou pseudonimizado.
- Evento tecnico.
- Recurso.
- Status.
- Erro categorizado.
- Latencia.
- Versao de schema/consentimento.

Logs proibidos por padrao:

- Pensamentos brutos.
- Prompts privados.
- Respostas brutas de IA.
- Conteudo de Metacognicao.
- Chamado completo.
- Saude, familia, financas, fe e emocoes.
- Mensagens completas ao Atalaia.

## Prompt 7 - IA e logs seguros

A camada central de IA registra somente metadados por `ai_run_audit_v1`:

- agente;
- provider;
- modelo;
- prompt version;
- output schema;
- status;
- latencia;
- erro categorizado;
- status de guardrail.

`contains_raw_prompt` e `contains_raw_response` devem permanecer `false`. O helper `redactAiLogMetadata` remove chaves como `prompt`, `raw_prompt`, `response`, `raw_response`, `input` e `output`.

OpenAI real fica isolada em modulo server-only. `OPENAI_API_KEY` nao pode ser exposta em `NEXT_PUBLIC_*`, client components, browser, mobile ou logs.

## Prompt 8 - Execucao e dados sensiveis

Alvos, projetos, tarefas e microtarefas podem revelar Chamado, rotina, familia, saude, financas, emocoes, trabalho e responsabilidades. Regras especificas:

- Analise ecologica e alinhamento com Chamado sao owner-only.
- Mock de IA nao envia dados a OpenAI real.
- Server actions devem validar entrada com Zod antes de persistir.
- Sem sessao Auth/Supabase, o app deve declarar fallback local/dev.
- Logs nao devem conter desejo bruto, analise ecologica completa, Chamado, tarefas intimas ou microtarefas sensiveis.
- Atalaia nao acessa `goals`, `projects`, `tasks` ou `microtasks` diretamente nesta etapa.
- Qualquer acesso futuro de Atalaia a progresso de execucao deve usar projecao sanitizada, permissao granular por alvo, previa e revogacao.

## Prompt 9 - Calendario e Inbox/GTD

Calendario e inbox sao dados de alta sensibilidade: podem revelar rotina, familia, saude, fe, preocupacoes, links privados, compromissos e disponibilidade. Regras especificas:

- `calendar_blocks` e `inbox_items` sao privados por padrao e owner-only.
- Capturas brutas da inbox nao devem ser enviadas ao Atalaia, a logs ou a terceiros nesta etapa.
- Links capturados devem ser tratados como texto sensivel; previews automáticos, fetch remoto e scraping ficam fora da etapa.
- Audio/imagem sao apenas placeholders de tipo, sem upload/processamento real.
- Classificacao por IA usa mock seguro; OpenAI real nao e acionada por UI.
- Logs nao devem conter conteudo de captura, preocupacao, agenda, notas ou observacao do usuario.
- Processamento de inbox autenticado deve validar dono/status antes de criar tarefa ou bloco e nao confiar em `content` vindo do cliente.
- Campos de titulo, notas, resumo e classificacao devem ter limite de tamanho no app e no banco.
- Alertas de sobrecarga devem usar linguagem de cuidado, nunca falha, vergonha ou culpa espiritual.
- Compartilhamento futuro de agenda com Atalaia exigira decisao propria, projecao minima, consentimento granular e previa.

## Prompt 10 - Desbloqueador e Metacognicao

Metacognicao e dado emocionalmente sensivel e permanece privada por padrao. O Desbloqueador pode receber tarefas, obstaculos, energia e evitacao; esses dados tambem devem ser tratados como sensiveis quando revelarem saude, familia, trabalho, fe ou emocoes.

Regras especificas:

- `metacognition_sessions` e `action_unblock_sessions` sao owner-only.
- Metacognicao nao e enviada ao Atalaia, relatorios externos, e-mails ou mensagens por padrao.
- Historico de Metacognicao so aparece para o dono autenticado; sem Auth/Supabase, o app mostra fallback local/dev.
- Server actions validam entrada e vinculam tarefa/projeto/alvo/calendario somente quando o registro pertence ao mesmo `user_id`.
- Logs nao devem conter texto bruto de estado interno, pensamento automatico, fato/interpretacao/sentimento/impulso ou resposta completa da IA.
- Eventos de crise devem ser registrados de forma minima e nao invasiva, com categoria de seguranca, sem detalhe grafico.
- Compartilhamento futuro so pode ocorrer por resumo manual, granular, com consentimento explicito e previa.

## Prompt 11 - Foco, Habitos e Placar

- `focus_sessions`, `focus_distractions`, `habits`, `habit_logs`, `discipline_scoreboards`, `scoreboard_items` e `scoreboard_entries` sao privados por padrao.
- Distracoes capturadas durante foco podem conter pensamentos, preocupacoes, links ou tarefas paralelas sensiveis; nao devem ir para logs ou Atalaia.
- Habitos podem revelar saude, fe, familia, energia, sono e rotina; usar minimizacao e revisao humana.
- Placar mede constancia, nao valor pessoal; sem ranking publico, vergonha ou punitivismo.
- Atalaia futuro so pode receber resumo limitado por alvo, consentimento granular, previa e revogacao efetiva.
- Sem Auth/Supabase, a UI deve declarar fallback local/dev.

## Retencao

A politica de retencao deve ser definida antes da primeira coleta real. A regra base e reter apenas pelo tempo necessario a finalidade declarada, com exportacao e exclusao disponiveis em fase apropriada.

## Exportacao e exclusao

A arquitetura futura deve prever:

- Exportacao de dados do usuario.
- Exclusao de conta e dados.
- Exclusao seletiva de sessoes de Metacognicao.
- Revogacao de Atalaia.
- Registro de consentimentos historicos quando juridicamente necessario.

## Riscos e mitigacoes

| Risco | Severidade | Mitigacao |
|---|---:|---|
| Vazamento entre usuarios | Critica | RLS, testes por persona de acesso, menor privilegio |
| Atalaia vendo dados intimos | Critica | Grants por alvo, exclusoes padrao, previa, auditoria, revogacao |
| Metacognicao virar terapia | Alta | Limites claros, guardrails, crise fora do fluxo de produtividade |
| Culpa espiritual | Alta | Linguagem segura e camada crista configuravel |
| Prompts brutos em logs | Alta | Redacao, minimizacao e metadados tecnicos |
| Consentimento generico | Alta | Consentimento granular e versionado |
| IA alterando dados sem revisao | Alta | Saidas estruturadas, revisao do usuario e validacao server-side |
| Migration aplicada sem teste RLS | Alta | Aplicar em ambiente controlado e rodar matriz de acesso antes de producao |
| Metacognicao exposta em historico compartilhado | Critica | Owner-only, sem Atalaia por padrao, exclusao seletiva e consentimento manual futuro |
