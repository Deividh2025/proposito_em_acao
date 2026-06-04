# Data Sensitivity Matrix

| dado | modulo | sensibilidade | pode ser compartilhado com Atalaia? | exige consentimento? | observacoes de seguranca | politica futura de acesso |
|---|---|---:|---|---|---|---|
| Nome e e-mail | Perfil/Auth | Media | Apenas dados minimos de convite | Sim | Evitar exposicao desnecessaria | Dono; backend; Atalaia so convite/status autorizado |
| Rotina e responsabilidades | Perfil | Alta | Nao por padrao | Sim | Pode revelar familia, trabalho e saude | Dono por RLS |
| Contexto de fe | Perfil/Camada crista | Critica | Nao por padrao | Sim, destacado | Dado sensivel de crenca | Dono; uso minimo pela IA |
| Energia, sono e saude percebida | Perfil/Mapa/Foco | Critica | Nao por padrao | Sim | Nao diagnosticar nem expor | Dono; agregados anonimos somente se aprovado |
| Familia e relacionamentos | Perfil/Mapa/Calendario | Alta | Nao por padrao | Sim | Alto risco contextual | Dono; resumo manual opcional |
| Financas | Mapa/Alvos | Alta | Nao por padrao | Sim | Excluir de mensagens externas | Dono |
| Emocoes e pensamentos | Metacognicao | Critica | Nao, salvo selecao manual excepcional | Sim, destacado | Nao logar bruto; historico privado | Dono; sem Atalaia por padrao |
| Pensamento automatico bruto | Metacognicao | Critica | Nao | Sim, destacado | Conteudo intimo; evitar retencao bruta | Dono; apagar/exportar futuramente |
| Fato/interpretacao/sentimento/impulso | Metacognicao | Critica | Nao por padrao | Sim | Compartilhamento so manual e granular | Dono |
| Chamado completo | Chamado | Critica | Nao | Sim | Identidade, valores, fe e dores | Dono; Atalaia so resumo de alvo autorizado |
| Hipotese de Chamado | Chamado | Alta | Nao por padrao | Sim | Direcao em discernimento | Dono |
| Alvos SMART-E | Alvos | Alta | Sim, se alvo autorizado | Sim | Pode revelar vida intima | Dono; Atalaia por `AccountabilityGrant` ativo |
| Analise ecologica de alvo | Alvos/IA | Alta | Nao por padrao | Sim | Pode citar saude/familia/financas | Dono |
| Projetos e marcos | Projetos | Media/Alta | Sim, se alvo autorizado | Sim | Verificar campos sensiveis | Dono; Atalaia por alvo |
| Tarefas e microtarefas | Tarefas | Media/Alta | Sim, somente itens autorizados | Sim | Podem revelar rotina privada | Dono; Atalaia por alvo e escopo |
| Calendario | Calendario | Alta | Nao por padrao | Sim | Revela local, rotina, familia e disponibilidade | Dono; compartilhamento minimo |
| Inbox bruto | Inbox | Alta | Nao por padrao | Sim | Captura pode conter qualquer dado sensivel | Dono; classificacao server-side |
| Sessoes de foco | Foco | Media | Resumo limitado se autorizado | Sim | Evitar conteudo de distracoes sensiveis | Dono; Atalaia so progresso |
| Distracoes capturadas | Foco | Alta | Nao por padrao | Sim | Conteudo possivelmente intimo | Dono |
| Habitos | Habitos | Alta | Sim, se ligado ao alvo e autorizado | Sim | Saude/fe/familia podem aparecer | Dono; Atalaia por escopo |
| Habit logs | Habitos/Placar | Media/Alta | Resumo se autorizado | Sim | Evitar vergonha e exposicao | Dono; agregados autorizados |
| Placar | Placar | Media/Alta | Resumo limitado se autorizado | Sim | Nao usar ranking publico | Dono; Atalaia por alvo |
| Revisao semanal | Revisao | Critica | Nao por padrao | Sim | Contem padroes, falhas e emocoes | Dono; resumo manual excepcional |
| Jardim da Vida | Jardim | Media | Nao por padrao | Sim | Snapshot derivado, nao fonte primaria | Dono |
| Atalaia parceiro | Atalaia | Alta | N/A | Sim | Email, status e relacao de confianca | Dono; backend; auditoria |
| AccountabilityGrant | Atalaia | Critica | N/A | Sim, granular | Base de autorizacao externa | Dono; Atalaia autorizado; revogacao imediata |
| Mensagem ao Atalaia | Atalaia/IA | Alta/Critica | Sim, apos previa e consentimento | Sim, por envio/escopo | Corpo neutro; link autenticado se sensivel | Envio auditado; escopo minimo |
| Documento de compromisso | Compromisso | Alta | Sim, se usuario escolher | Sim | Revisar antes de compartilhar | Dono; Atalaia autorizado |
| ConsentRecord | Consentimento | Critica | Nao | N/A | Registro auditavel e versionado | Dono; backend; auditoria |
| Logs tecnicos | Observabilidade | Media | Nao | Politica clara | Sem prompt bruto, pensamento ou dado intimo | Operacional minimo; retencao definida |
| Eventos de analytics | Beta/Observabilidade | Media/Alta | Nao | Sim | Apenas eventos/metadados minimos; sem conteudo sensivel | Consentimento especifico; retencao curta; agregacao |
| Feedback beta | Beta/Feedback | Alta | Nao | Sim | Campo livre pode conter dado intimo; redigir antes de compartilhar | Rascunho local ate formulario/canal aprovado |
| Auditoria de IA | IA/Observabilidade | Media/Alta | Nao | Sim, por provider quando houver chamada real | Somente metadados: provider, modelo, agente, schema/prompt version, guardrail, latencia, fallback e consentimento; sem prompt/resposta bruta | Backend owner/operacional minimo; retencao futura de 90 dias |
| Anexos de usuario | Storage | Alta | Nao por padrao | Sim | Bucket privado e path por usuario | Dono; signed URL server-side se autorizado |
| Documento anexado de compromisso | Storage/Compromisso | Alta | Sim, se usuario escolher | Sim, por alvo/escopo | Nunca publico; previa antes de compartilhar | Dono; Atalaia via signed URL curta e grant ativo |
| Check-in de energia | Mobile/PWA | Alta/Critica | Nao por padrao | Sim | Pode revelar saude, sono, rotina e emocao | Dono por RLS; sem cache/offline sensivel |

## Prompt 8

Alvos SMART-E, analise ecologica, alinhamento com Chamado, projetos, tarefas e microtarefas entram como dados de execucao sensiveis. Mesmo quando um alvo puder ser compartilhado futuramente com Atalaia, a analise ecologica e o Chamado completo permanecem excluidos por padrao.

## Prompt 9

Calendario e inbox deixam de ser apenas entidades futuras e entram no centro operacional. Capturas brutas, links, preocupacoes, observacoes, rotina, descanso, familia e espiritualidade permanecem owner-only, sem Atalaia e sem logs de conteudo bruto. Audio/imagem sao somente placeholders de tipo nesta etapa.

## Prompt 10

Desbloqueador e Metacognicao entram como dados de autorregulacao sensiveis. `action_unblock_sessions` pode conter obstaculo, energia, evitacao e tarefas privadas. `metacognition_sessions` pode conter pensamento automatico, fato, interpretacao, sentimento e impulso. Ambos sao privados por padrao; Metacognicao fica excluida de Atalaia, e-mails, relatorios externos e logs brutos.

## Prompt 11

- `focus_sessions`: media sensibilidade; pode revelar rotina, energia e execucao.
- `focus_distractions`: alta sensibilidade; conteudo bruto nao deve ser compartilhado nem logado.
- `habits`: alta sensibilidade; pode revelar saude, fe, familia, sono, energia e rotina.
- `habit_logs`: media/alta; devem evitar justificativas intimas longas.
- `discipline_scoreboards`, `scoreboard_items`, `scoreboard_entries`: media/alta; privados por padrao e sem Atalaia bruto.

## Prompt 12

- `weekly_reviews`: critica; contem respostas, padroes, travamentos, retomadas, foco semanal e possiveis inferencias de vida privada. Owner-only e sem Atalaia por padrao.
- `weekly_reviews.metacognition_insights`: critica se vier de Metacognicao; aceitar apenas resumo agregado/redigido, nunca pensamento bruto ou estrutura fato/interpretacao/sentimento/impulso.
- `garden_states`: media/alta; snapshot derivado por area da vida, sem conteudo intimo bruto.
- `garden_events`: media/alta; metadados devem ser minimos e sanitizados.
- `neglected_life_areas`: alta; deve aparecer como cuidado necessario, nao como falha moral.

## Prompt 13

- `accountability_partners`: alta; contem relacao de confianca, nome/e-mail e estado do convite.
- `accountability_grants`: critica; e a base operacional de autorizacao externa por alvo, permissao, status e revogacao.
- `accountability_notifications`: alta/critica; deve guardar apenas preview estruturado, privacy check e metadados, nunca corpo intimo ou payload bruto.
- `commitment_documents`: alta; pode conter direcao, alvo, prazo, Atalaia e compromissos. Nasce privado e so e compartilhavel com revisao, grant e consentimento.
- `commitment_levers`: media/alta; recompensas e consequencias podem revelar vulnerabilidades ou gerar abuso se mal desenhadas.
- E-mail de Atalaia: alta/critica; sem provider configurado, manter `pending_provider_config`. Quando houver provider, corpo deve ser minimo e dados sensiveis ficam atras de acesso autenticado/expiravel.

## Prompt 14

- `energy_checkins`: alta/critica; registra energia baixa, media ou alta e observacao opcional. Owner-only e sem Atalaia.
- Captura mobile continua sendo `inbox_items`: alta; nao cachear ou logar conteudo bruto.
- Metacognicao mobile continua sendo `metacognition_sessions`: critica; privada por padrao e sem compartilhamento automatico.
- Service worker/CacheStorage nao deve armazenar dados sensiveis, tokens, notificacoes ou respostas de actions.

## Prompt 17

- Eventos de analytics futuros devem registrar somente evento, modulo, status, contagens, buckets e consentimento. Sem texto de usuario, titulos, notas, prompts ou respostas.
- Feedback beta futuro deve ser minimizado, redigido quando sensivel e protegido por consentimento/retencao. Nao compartilhar com Atalaia ou terceiros por padrao.

## Etapa 5 - IA real preparada

- OpenAI/DeepSeek reais nao podem receber dados sensiveis sem minimizacao, consentimento versionado do provider e guardrails.
- Auditoria de IA deve permanecer como metadado tecnico redigido, sem prompt bruto, resposta bruta, conteudo intimo, tokens, API keys, e-mail com contexto sensivel ou payload de Atalaia.
- DeepSeek JSON mode nao e considerado schema estrito; toda saida que vira dado continua validada por Zod.
