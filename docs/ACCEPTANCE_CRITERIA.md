# Acceptance Criteria

## Globais

- A V1 cobre todos os modulos centrais em largura.
- Chamado vem antes de agenda e filtra decisoes operacionais.
- Toda acao critica tem proxima acao clara.
- IA que vira dado usa schema estruturado e validacao futura.
- Dados sensiveis sao privados por padrao.
- Atalaia acessa somente alvo e escopo autorizados.
- Metacognicao nao diagnostica, nao substitui terapia e nao humilha.
- Camada crista nao afirma vontade divina especifica nem usa culpa espiritual.
- Fluxos criticos tem fallback quando IA falha.

## Por modulo

| Modulo | Criterios de aceite |
|---|---|
| Perfil/Auth | Usuario cria conta, configura perfil essencial, tom da IA, camada crista e consentimentos. |
| Mapa da Vida | Usuario avalia areas, recebe leitura visual/IA e historico e salvo. |
| Chamado | Usuario conclui ou salva sessao com hipotese de Chamado e pode revisar depois. |
| Alvos SMART-E | Desejo vago vira alvo estruturado, ecologico, alinhado ao Chamado e com primeira acao. |
| Projetos | Alvo vira projeto com fases, marcos, tarefas e proxima acao. |
| Tarefas/microtarefas | Tarefa grande pode ser quebrada; cada item tem status, energia, tempo e proxima acao. |
| Calendario | Usuario ve dia/semana, agenda blocos e recebe alerta de sobrecarga. |
| Inbox/GTD | Captura e classificada, editavel e enviada para destino claro. |
| Desbloqueador | Entrada curta gera primeiro passo pequeno ou encaminha para Metacognicao. |
| Metacognicao | Fluxo separa fato/interpretacao/sentimento/impulso e termina com encaminhamento responsavel. |
| Foco | Usuario inicia timer por tarefa, captura distracoes e registra conclusao. |
| Habitos | Habito tem gatilho, minimo, ideal, recompensa, plano se/entao e retomada. |
| Placar | Marcacao e rapida, valoriza retomadas e nao gera vergonha. |
| Atalaia | Convite, consentimento, previa, escopo por alvo e revogacao funcionam. |
| Documento de compromisso | Documento e gerado, editavel e compartilhavel somente com consentimento. |
| Alavancas | Recompensas/reparacoes sao saudaveis e nao humilhantes. |
| Revisao semanal | Usuario revisa semana, recebe sintese e define foco da proxima semana. |
| Jardim da Vida | Progresso visual aparece por area sem punicao. |
| Dashboard | Proxima acao e evidente em poucos segundos. |
| PWA/mobile | Acoes rapidas exigem pouca navegacao e sincronizam. |
| Camada crista | Intensidade configuravel e linguagem segura. |
| Seguranca | Nenhum dado sensivel e compartilhado sem consentimento; RLS existe nas tabelas expostas quando Supabase estiver aplicado. |

## Criterios negativos

- Nao aprovar se qualquer fluxo de IA diagnosticar.
- Nao aprovar se qualquer mensagem usar culpa espiritual.
- Nao aprovar se Atalaia puder ver conta inteira.
- Nao aprovar se Metacognicao for compartilhada automaticamente.
- Nao aprovar se prompt/resposta bruta entrar em logs por padrao.
- Nao aprovar se mobile virar copia pesada do desktop.
- Nao aprovar se Placar/Jardim punirem falha.

## Evidencia exigida futuramente

- Testes automatizados ou N/A justificado.
- Evals de IA para guardrails quando aplicavel.
- Matriz RLS para banco/Supabase.
- Evidencia visual/acessibilidade para UI.
- Secret scan.
- `git status --short --branch`.

## Prompt 7 - Aceite da camada central de IA

- Agentes internos existem no catalogo e em entrypoints.
- Schemas de structured outputs existem para os fluxos exigidos.
- Prompts internos estao versionados por agente.
- Guardrails clinicos, pastorais, privacidade, Metacognicao e Atalaia existem.
- Provider mock e safe invoke existem.
- OpenAI real permanece server-side e sem uso automatico em UI.
- Logs de IA nao contem prompt bruto nem resposta bruta.
- Base de conhecimento placeholder existe sem material real.
- Evals/testes iniciais existem e devem passar.

## Prompt 8 - Aceite do nucleo de execucao

- Usuario acessa rotas de alvos, projetos e tarefas.
- Usuario consegue criar alvo manual ou gerar alvo por mock seguro.
- Alvo possui SMART-E, analise ecologica, alinhamento com Chamado e primeira acao.
- Usuario consegue gerar projeto a partir de alvo por mock seguro.
- Projeto possui fase, marcos, riscos, recursos, tarefa inicial, plano de retomada e proxima acao.
- Usuario consegue criar tarefa e quebrar tarefa em microtarefas.
- Microtarefas podem ser marcadas localmente como concluidas e mostram a proxima microacao.
- Server actions usam Supabase quando ha sessao e fallback local/dev explicito quando nao ha.
- RLS owner-only permanece o modelo para `goals`, `projects`, `tasks` e `microtasks`.
- Calendario funcional, inbox funcional, habitos, Placar, Atalaia, Metacognicao funcional, Desbloqueador funcional, deploy e OpenAI real seguem fora de escopo.

## Prompt 9 - Aceite do calendario e inbox/GTD

- Usuario acessa `/calendar` com visao semanal e diaria.
- Usuario navega entre dias/semanas e volta para hoje.
- Usuario cria bloco manual, edita, reagenda, conclui e remove/cancela bloco.
- Usuario agenda tarefa existente a partir do painel lateral.
- Tipos iniciais de bloco incluem tarefa, foco, trabalho recorrente, descanso, familia, espiritualidade, saude, aprendizado, servico, compromisso e buffer.
- Proxima acao da agenda fica destacada.
- Alerta simples de sobrecarga existe com linguagem de cuidado.
- Usuario acessa `/inbox`, captura texto rapidamente e ve item nao processado.
- Classificacao de inbox usa IA mockada segura ou provider real futuro com schema estruturado.
- Usuario processa item para tarefa, projeto, bloco de calendario, referencia, ideia futura ou descarte.
- Persistencia usa Supabase/server actions quando ha sessao; sem Auth/Supabase, fallback local/dev e explicitado.
- `calendar_blocks` e `inbox_items` permanecem privados por padrao e sem Atalaia.
- Desbloqueador, Metacognicao funcional, Modo Foco, habitos completos, Placar completo, Revisao Semanal, Jardim funcional, deploy e OpenAI real acionada por UI seguem fora de escopo.

## Prompt 10 - Aceite do Desbloqueador e Metacognicao

- Usuario acessa `/action-unblocker` e gera plano com primeiro passo de 2 a 5 minutos.
- Plano inclui versao minima aceitavel, microtarefas, foco recomendado, recompensa, frase de reorientacao e plano de retomada.
- Bloqueios cognitivos/emocionais sugerem Metacognicao.
- Usuario acessa `/metacognition` e recebe saida estruturada com fato, interpretacao, sentimento, impulso, pensamento automatico, padroes cognitivos, desmonte logico, pergunta confrontadora, reformulacao e proxima acao.
- Confrontacao e firme sem humilhacao, diagnostico ou culpa espiritual.
- Crise aciona guardrail de ajuda humana e nao vira produtividade comum.
- Historico de Metacognicao e privado por padrao e removivel pelo usuario.
- Server actions usam Supabase/RLS owner-only quando ha sessao e fallback local/dev explicito quando nao ha.
- `action_unblock_sessions` e `metacognition_sessions` permanecem sem Atalaia por padrao.
- Modo Foco completo, habitos completos, Placar completo, Revisao Semanal, Jardim funcional, Atalaia funcional, deploy e OpenAI real acionada por UI seguem fora de escopo.

## Prompt 11 - Aceite de Foco, Habitos e Placar

- Usuario acessa `/focus`, escolhe duracao de 5, 15, 25, 50 ou personalizada e inicia sessao.
- Usuario pausa, retoma, conclui ou encerra foco sem culpa.
- Usuario captura distracao durante foco e pode enviar para Inbox explicitamente.
- Usuario acessa `/habits`, gera plano mock seguro e revisa antes de salvar.
- Plano de habito possui identidade, motivo, gatilho, minimo, ideal, recompensa, obstaculo, plano se/entao, ambiente, metrica e retomada.
- Usuario marca habito como minimo, ideal, retomada ou pausa consciente.
- Usuario acessa `/scoreboard`, cria/sugere Placar e marca item como feito, parcial, retomado ou pausado conscientemente.
- Retomadas sao apresentadas como progresso real.
- Foco, distracoes, habitos e Placar permanecem privados por padrao e sem Atalaia.
- Server actions usam Supabase/RLS owner-only quando ha sessao e fallback local/dev explicito quando nao ha.
- Revisao Semanal funcional, Jardim funcional, Atalaia funcional, deploy, integracoes externas e OpenAI real acionada por UI seguem fora de escopo.

## Prompt 12 - Aceite de Revisao Semanal, Padroes e Jardim

- Usuario acessa `/review` e `/review/weekly`.
- Usuario responde perguntas guiadas da Revisao Semanal.
- IA/mock seguro gera `weekly_review_output_v1`.
- Sintese inclui vitorias, travamentos, padroes, sobrecarga, areas negligenciadas, retomadas, foco da proxima semana e primeira acao.
- Metacognicao entra apenas como resumo agregado/redigido, sem conteudo bruto.
- Linguagem evita vergonha, culpa espiritual, diagnostico e moralismo.
- Usuario salva revisao; server action usa Supabase/RLS owner-only quando ha sessao e fallback local/dev explicito quando nao ha.
- Usuario acessa `/garden`.
- Jardim mostra areas do Mapa da Vida, crescimento, eventos recentes e cuidado necessario sem punicao.
- `garden_state_output_v1` valida snapshot derivado.
- `garden_events.metadata_minimal` bloqueia prompt, resposta bruta, pensamento, nota privada e texto bruto de Metacognicao.
- Atalaia funcional, compartilhamento externo, gamificacao profunda, mobile/PWA completo, deploy e OpenAI real acionada por UI seguem fora de escopo.

## Prompt 13 - Aceite de Atalaia, Compromisso e Alavancas

- Usuario acessa `/accountability`, `/accountability/new` e detalhe de grant de Atalaia.
- Convite de Atalaia e sempre vinculado a um alvo especifico.
- Usuario escolhe nivel, frequencia e permissoes granulares antes de gerar previa.
- Previa mostra exatamente quais campos podem ser compartilhados e bloqueia dados privados.
- Server actions usam Supabase/RLS preparado quando ha sessao e fallback local/dev explicito quando nao ha.
- Revogacao altera o grant e cancela notificacoes pendentes quando ha persistencia.
- Usuario acessa `/commitments` e gera Documento de Compromisso revisavel.
- Documento inclui objetivo, prazo, primeiro passo, projetos/habitos vinculados, Atalaia opcional e permissoes.
- Alavancas bloqueiam humilhacao, punicao nociva, culpa espiritual, exposicao publica, dano fisico ou dano financeiro abusivo.
- E-mail real nao e enviado sem provider configurado; status deve permanecer `pending_provider_config`.
- Atalaia nao recebe Chamado completo, Metacognicao, Revisao Semanal privada, inbox bruto, calendario completo, saude, familia, financas ou emocoes.
- Portal avancado do Atalaia, relatorios externos profundos, mobile/PWA completo, deploy, integracoes externas e OpenAI real acionada por UI seguem fora de escopo.

## Prompt 14 - Aceite de PWA/Mobile Complementar

- Manifest existe com nome `Propósito em Ação`, display standalone e start URL `/mobile`.
- Service worker existe e limita cache a assets estaticos e pagina offline segura.
- Usuario acessa `/mobile` e ve hub de acoes rapidas sem dashboard completo.
- Usuario captura item rapido em `/mobile/capture` e envia para Inbox/fallback local-dev.
- Usuario marca habito em `/mobile/habits`.
- Usuario marca Placar em `/mobile/scoreboard`.
- Usuario inicia foco curto e captura distracao em `/mobile/focus`.
- Usuario usa Desbloqueador rapido em `/mobile/unblock` com mock seguro e primeiro passo.
- Usuario usa Metacognicao rapida em `/mobile/metacognition` com fato x interpretacao e privacidade visivel.
- Usuario registra energia em `/mobile/energy`.
- `energy_checkins` tem migration e RLS owner-only.
- Mobile permanece complementar; app nativo, push notifications, calendario complexo, Atalaia mobile funcional, fila offline sensivel, deploy e OpenAI real acionada pela UI seguem fora de escopo.

## Prompt 17 - Aceite de Beta Fechado e Observabilidade

- Plano de beta fechado existe e preserva gates externos antes de usuarios reais.
- North Star, metricas de ativacao, retencao e qualitativas estao definidas.
- Eventos de analytics usam allowlist e nao capturam conteudo sensivel.
- Feedback in-app existe ou esta documentado como rascunho local, sem envio real obrigatorio.
- Feedback externo depende de URL/canal aprovado, sem tokens ou dados sensiveis.
- Bug triage, feedback triage, suporte, incident response e monitoramento pos-deploy existem.
- V1.1 separa hardening/correcoes de novas features.
- Nenhuma grande funcionalidade nova e implementada nesta etapa.
- Beta com usuarios reais continua bloqueado ate preview, Supabase/Auth/RLS, LGPD, secrets, smoke e rollback estarem aprovados.
