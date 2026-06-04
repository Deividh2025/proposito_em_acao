# Security and Privacy

Este documento e fonte de verdade para seguranca, privacidade, consentimento, Atalaia, Metacognicao, IA, logs e preparacao futura de Supabase/RLS. Ele nao substitui revisao juridica LGPD antes de producao.

## Estado atual verificado em 2026-06-04

- Estado do produto: V1 local ampla / pre-beta real; beta real segue bloqueado.
- Retencao decidida: analytics, feedback beta e metadados de auditoria de IA por 90 dias quando houver persistencia real.
- Consentimento de IA deve ser separado, versionado e revogavel por provider (`openai`, `deepseek` e modo `automatic`).
- Nao havera fallback automatico entre providers de IA; falha usa fallback local seguro ou fluxo manual.
- Etapa 5 implementou roteamento server-side OpenAI/DeepSeek, mas chamada real segue desligada por `AI_REAL_ENABLED=false` por padrao e sem secrets reais.
- Auditoria de IA registra metadados minimos com redaction recursiva; prompt bruto, resposta bruta, conteudo intimo, tokens e chaves continuam proibidos.
- Resend foi decidido para e-mail transacional e SMTP customizado do Supabase Auth, mas ainda nao esta implementado/configurado.
- Analytics sera first-party no Supabase, opt-in desligado por padrao, mas coleta real ainda nao existe.
- Atalaia/consentimento/Auth/escritas reais possuem S0/S1 registrados em `docs/BUG_TRIAGE.md` e bloqueiam beta real ate validacao remota/externa proporcional.
- Etapa 2 reduziu Atalaia localmente: aceite nao usa grant demonstrativo, nao permite escalada de escopo, e criacao/aceite/revogacao exigem auditoria/consentimento minimo ou retornam `ok:false`.

## Auth, sessao e redirects

- Auth SSR completo ainda e bloqueador de beta real.
- O proxy/middleware de SSR deve renovar/propagar cookies de sessao e validar claims sem usar metadata editavel pelo usuario para autorizacao.
- Em `preview`, `beta` e `production`, sessao ausente, refresh falho, token invalido, callback/recovery invalido ou falha real de Supabase/Auth deve bloquear o fluxo ou retornar `ok:false`; somente `local-demo` pode usar fallback local/dev honesto.
- Redirects de Auth devem aceitar apenas destinos relativos internos ou allowlist por ambiente; URLs externas arbitrarias, wildcards amplos em producao e propagacao de tokens em querystring ficam proibidos.
- Logs, analytics, feedback e suporte nao devem registrar access token, refresh token, callback token, invite token, recovery token ou URL com query sensivel.

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

Na Etapa 2, aceite e revogacao do Atalaia passam a ser action server-side auditavel. O convidado nao deve executar update direto que altere escopo; token bruto de convite nao deve aparecer em logs, mensagens de erro ou payloads persistidos.

## Metacognicao

Metacognicao e privada por padrao. O historico pode conter pensamento bruto, emocoes, impulsos e fragilidades internas, portanto nao deve ser compartilhado automaticamente, nao deve entrar em logs brutos e nao deve ser tratado como prontuario clinico.

Compartilhamento com Atalaia so pode ocorrer por selecao manual de um resumo especifico, com consentimento explicito, previa e escopo.

## RLS no Supabase

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
- Atalaia convidado pode ver somente preview pendente sanitizada e nao pode alterar `permissions`, `goal_id`, `user_id`, parceiro, tracking, frequencia, expiracao ou consentimento revisado pelo dono.
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
- modo de invocacao (`mock`, `real` ou `fallback`);
- prompt version;
- output schema;
- status;
- latencia;
- erro categorizado;
- status de guardrail;
- motivo de fallback;
- versao de consentimento quando aplicavel;
- timestamp.

`contains_raw_prompt` e `contains_raw_response` devem permanecer `false`. O helper de redaction remove chaves sensiveis de forma recursiva e case-insensitive, incluindo `prompt`, `raw_prompt`, `response`, `raw_response`, `input`, `output`, `content`, `messages`, `api_key`, `token` e variantes.

OpenAI real fica isolada em modulo server-only. `OPENAI_API_KEY` nao pode ser exposta em `NEXT_PUBLIC_*`, client components, browser, mobile ou logs.

DeepSeek real segue a mesma regra: `DEEPSEEK_API_KEY` fica apenas server-side, sem `NEXT_PUBLIC_*`, sem browser/mobile/logs e sem envio de dados sensiveis antes de minimizacao, guardrails, evals, consentimento por provider e aprovacao operacional.

Na Etapa 5, consentimento por provider e versao e checado antes de qualquer rota real. `safeInvokeAi` tambem bloqueia uso direto de provider real sem autorizacao explicita da rota. Ausencia, revogacao ou consentimento de outro provider deve manter fallback local seguro sem criar consentimento automatico.

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

## Prompt 12 - Revisao Semanal e Jardim

Revisao Semanal e dado critico. Ela pode combinar travamentos, emocoes, rotina, fe, familia, saude, financas, habitos, Placar e padroes de Metacognicao.

Regras especificas:

- `weekly_reviews` e privado por padrao e owner-only.
- Metacognicao bruta nao deve ser copiada para revisao; usar apenas resumo manual/agregado.
- Calendario, Placar, habitos e foco entram como contagens, tendencias e retomadas, nao como conteudo bruto sensivel.
- Jardim da Vida e snapshot derivado; `garden_events.metadata_minimal` nao pode conter prompts, respostas brutas, pensamentos, notas privadas ou sessoes.
- Atalaia nao recebe Revisao Semanal, Jardim, Metacognicao, calendario bruto ou Placar bruto automaticamente.
- Logs nao devem conter respostas da revisao, sintese completa, eventos intimos do Jardim, prompt ou resposta bruta de IA.
- Sem Auth/Supabase, a UI deve declarar fallback local/dev.

## Prompt 13 - Atalaia, Compromisso e E-mail

Atalaia envolve compartilhamento com terceiro e permanece dado sensivel.

Regras especificas:

- Atalaia e sempre vinculado a um alvo especifico, nunca a conta inteira.
- Usuario escolhe permissoes granulares e revisa a previa antes de criar convite ou notificacao.
- `accountability_partners` nao concede acesso sozinho; acesso real depende de `accountability_grants` ativo.
- Revogacao cancela notificacoes pendentes e bloqueia acesso futuro.
- `accountability_notifications.preview_payload` guarda metadados estruturados, nao corpo intimo da mensagem.
- Documento de Compromisso nasce privado e so pode ser compartilhado com permissao `commitment_document`, revisao e consentimento.
- Alavancas de Compromisso bloqueiam humilhacao, exposicao publica, castigo fisico, castigo espiritual, jejum como punicao, vergonha publica e consequencia financeira desproporcional.
- Sem provider de e-mail configurado, notificacoes ficam em `pending_provider_config` e nenhum e-mail real e enviado.
- OpenAI real nao e acionada pela UI do Prompt 13; mensagens e documentos usam mock/contrato estruturado.

## Retencao

A politica de retencao de analytics, feedback beta e metadados de auditoria de IA foi definida como 90 dias antes da primeira coleta real. A regra base dos demais dados sensiveis e reter apenas pelo tempo necessario a finalidade declarada, com exportacao e exclusao disponiveis em fase apropriada.

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
| Revisao Semanal duplicando Metacognicao bruta | Critica | Apenas resumo agregado/redigido, sanitizacao server-side e sem Atalaia |
| Jardim virando banco paralelo de dados intimos | Alta | Snapshot derivado, eventos minimos e bloqueio de metadados sensiveis |

## Prompt 14 - PWA/Mobile

PWA/mobile e superficie complementar para acoes rapidas. Regras especificas:

- `public/sw.js` cacheia apenas assets estaticos declarados e pagina offline segura.
- Metacognicao, Inbox bruta, calendario, Atalaia, notificacoes, tokens, respostas de server actions, rotas `/auth`, callbacks, recovery, APIs autenticadas e conteudo sensivel nao devem ser cacheados.
- Nao usar `localStorage`, `sessionStorage`, IndexedDB ou CacheStorage para dados sensiveis nesta etapa.
- `energy_checkins` e dado sensivel e permanece owner-only.
- Migration remota de `energy_checkins` aplicada em 2026-06-02 no Supabase `proposito_em_acao`; testes RLS por persona ainda dependem de validacao automatizada completa.
- Sem fila offline sensivel, push notifications ou app nativo antes do Prompt 15.
- Sem Auth/Supabase, a UI deve declarar fallback local/dev, sem prometer persistencia produtiva.
- Nada do mobile e compartilhado automaticamente com Atalaia.

## Prompt 17 - Beta, analytics e feedback

Analytics e feedback entram como superficie operacional sensivel. Regras especificas:

- Analytics real exige consentimento especifico, LGPD minima, retencao definida, ambiente seguro e allowlist de eventos.
- Eventos nao podem registrar conteudo de Chamado, Metacognicao, Inbox, calendario, saude, familia, financas, fe, emocoes, prompts, respostas de IA, titulos, notas, tokens ou mensagens ao Atalaia.
- Feedback in-app do beta e rascunho local/preparado; envio externo depende de `NEXT_PUBLIC_BETA_FEEDBACK_URL` aprovado, sem tokens e com politica de acesso.
- Campo livre de feedback deve ser curto, com aviso para nao inserir dados intimos e triagem/redacao quando houver indicio sensivel.
- Suporte nao deve pedir prints com dados intimos nem copiar feedback bruto sensivel para issues, docs, e-mail ou ferramentas externas.
- PWA/mobile nao deve armazenar feedback ou analytics sensivel em localStorage, sessionStorage, IndexedDB ou CacheStorage.
- Metricas do beta devem ser agregadas e orientadas a acoes significativas, nao pageviews com conteudo de vida.
