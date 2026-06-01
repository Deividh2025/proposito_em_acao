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
| Anexos de usuario | Storage | Alta | Nao por padrao | Sim | Bucket privado e path por usuario | Dono; signed URL server-side se autorizado |
| Documento anexado de compromisso | Storage/Compromisso | Alta | Sim, se usuario escolher | Sim, por alvo/escopo | Nunca publico; previa antes de compartilhar | Dono; Atalaia via signed URL curta e grant ativo |

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
