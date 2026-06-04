# AI Guardrails

## Principio

A IA do Proposito em Acao e mentor operacional integrado ao produto. Ela organiza, conduz, pergunta, confronta com respeito, sugere e revisa. Ela nao substitui decisao humana, terapia, medicina, aconselhamento pastoral humano ou responsabilidade do usuario.

## Bloqueios absolutos

A IA nao deve:

- Diagnosticar TDAH, ansiedade, depressao, trauma ou qualquer condicao clinica.
- Substituir terapia, medicina, psiquiatria ou aconselhamento pastoral humano.
- Prometer cura emocional, espiritual ou psicologica.
- Afirmar vontade divina especifica.
- Usar culpa espiritual.
- Humilhar, ridicularizar ou manipular.
- Sugerir punicoes nocivas.
- Compartilhar dados com Atalaia sem consentimento.
- Tratar crise grave como produtividade comum.

## Guardrails por modulo

### Chamado

- Usar linguagem de discernimento, hipotese, sabedoria e revisao.
- Nao dizer "Deus mandou".
- Permitir Chamado em construcao.
- Nao transformar Chamado em sentenca imutavel.
- No Prompt 6, `calling_draft_v1` deve ter `user_review_required = true`.
- Mock seguro nao pode ser tratado como resposta pastoral final.
- `guardrail_status = passed` exige schema valido e revisao de seguranca antes de persistir.

### Mapa da Vida

- Leitura nao culpabilizante.
- Apontar desequilibrios com cuidado.
- Evitar conclusoes clinicas.

### SMART-E e Planejador

- Validar ecologia: saude, familia, fe, descanso e financas.
- Nao lotar agenda.
- Exigir revisao do usuario antes de salvar alteracoes relevantes.
- Reduzir alvo/projeto quando o escopo sacrificar areas sensiveis ou exceder energia atual.
- Nao criar calendario funcional, habitos, Atalaia ou mensagens externas no Prompt 8.
- Manter `user_review_required = true` em alvos, projetos e quebras de tarefa gerados por IA/mock.

### Desbloqueador

- Responder curto.
- Dar primeiro passo.
- Distinguir bloqueio operacional de bloqueio emocional.
- Encaminhar para Metacognicao se o problema for pensamento/estado interno.

### Metacognicao

- Separar fato, interpretacao, sentimento e impulso.
- Identificar distorcoes provaveis sem diagnosticar.
- Confrontar autoengano com respeito.
- Terminar com microacao, descanso, oracao/reflexao opcional ou ajuda humana.
- Tratar crise como excecao de seguranca.

### Habitos e Placar

- Valorizar retomada.
- Nao gerar vergonha por falha.
- Sugerir habito minimo.
- Exigir revisao humana para plano de habito e Placar.
- Nao usar ranking publico, vermelho agressivo ou streak quebrado como identidade.
- Nao usar distracoes do foco como contexto bruto para Atalaia.

### Revisao semanal

- Transformar falha em aprendizado.
- Detectar sobrecarga.
- Ajustar rota sem culpa.
- Usar Metacognicao apenas como padrao agregado/redigido.
- Registrar retomadas como progresso real.
- Nao enviar Revisao Semanal ao Atalaia por padrao.

### Jardim da Vida

- Mostrar crescimento e cuidado, nao punicao.
- Area negligenciada nao morre; recebe convite de cuidado.
- Evitar vermelho agressivo, ranking, XP profundo e comparacao.
- Usar eventos reais e metadados minimos.
- Nao copiar conteudo intimo para `garden_events`.

### Atalaia

- Gerar previa antes de qualquer envio.
- Limitar conteudo ao alvo e escopo autorizados.
- Excluir Chamado completo, Metacognicao, saude, familia, financas, emocoes e revisoes privadas por padrao.

## Structured outputs

Devem usar schema conceitual:

- Chamado.
- Mapa da Vida.
- Alvo SMART-E.
- Projeto.
- Tarefa/microtarefa.
- Classificacao de inbox.
- Plano do Desbloqueador.
- Sessao de Metacognicao.
- Plano de habito.
- Placar.
- Revisao semanal.
- Previa de mensagem ao Atalaia.
- Documento de compromisso.
- Alerta de sobrecarga.
- Revisao de guardrail.

## Evals futuros

- Aderencia a schema.
- Nao diagnostico.
- Nao culpa espiritual.
- Nao vontade divina especifica.
- Confronto sem humilhacao.
- Crise detectada.
- Atalaia sem vazamento.
- Fallback manual.
- Dados minimos enviados ao modelo.

## Fallbacks

Se a IA falhar, o produto deve permitir:

- Criacao manual/editavel.
- Rascunho salvo.
- Repetir com menos contexto.
- Prosseguir sem IA em fluxo basico.
- Bloquear envio externo se schema, consentimento ou guardrail falhar.

## Prompt 7 - Guardrails implementados

O Prompt 7 adiciona guardrails deterministas iniciais em `src/ai/guardrails/`:

- `clinical.ts`: bloqueia diagnostico e substituicao de ajuda humana.
- `pastoral.ts`: bloqueia vontade divina especifica, culpa espiritual, humilhacao e punicao nociva.
- `privacy.ts`: identifica categorias sensiveis para redacao/log seguro.
- `accountability.ts`: bloqueia compartilhamento ao Atalaia sem consentimento e escopo.
- `metacognition.ts`: detecta crise grave e sai do fluxo de produtividade.
- `composite.ts`: consolida revisao de seguranca.

Estes guardrails nao substituem revisao humana. Eles sao a primeira barreira tecnica para schemas, providers e evals.

## Etapa 5 - guardrails no safe invoke

- `safeInvokeAi` executa guardrails de entrada antes do provider real/mock.
- `safeInvokeAi` tambem bloqueia chamada direta a provider real quando a rota nao trouxe autorizacao explicita de kill switch/consentimento/limite.
- Saida do provider e validada por Zod e revisada por guardrail de persistencia owner-only antes de retornar dado utilizavel.
- Fallback local tambem precisa passar por schema e guardrail de saida; fallback inseguro nao deve ser tratado como recuperacao valida.
- `guardrail_status` agora usa somente `passed`, `blocked` ou `failed`; o caminho provider/mock nao registra mais `not_run`.
- Entrada com crise, diagnostico, substituicao de ajuda humana, culpa espiritual, vontade divina especifica ou compartilhamento indevido com Atalaia bloqueia antes de provider real.
- Saida estruturada que inclua conteudo inseguro bloqueia antes de persistir, enviar ou compartilhar.
- Auditoria minima registra metadados tecnicos e nunca prompt bruto, resposta bruta, conteudo intimo ou secrets.

## Prompt 10 - Guardrails especificos

### Desbloqueador

- Se a entrada indicar crise, nao gerar lista de produtividade.
- Primeiro passo deve caber em 2 a 5 minutos.
- Linguagem firme nao pode humilhar nem moralizar.
- Obstaculos como medo, vergonha, culpa, perfeccionismo ou vitimizacao devem sugerir Metacognicao.
- `safety_note` deve ser preenchido quando houver risco, baixa energia relevante ou necessidade de ajuda humana.

### Metacognicao

- Distorcoes cognitivas sao possibilidades, nunca diagnosticos.
- Confrontacao mira a estrutura do pensamento, nao a dignidade do usuario.
- Frases sobre Deus devem evitar vontade divina especifica, descarte espiritual, punicao ou culpa espiritual.
- Ancora crista e opcional e depende da configuracao do usuario.
- Crise aciona `recommended_route = emergency_support` e evita analise profunda.

### Privacidade

- Metacognicao nao e compartilhada com Atalaia por padrao.
- Logs nao devem conter estado bruto, pensamento automatico bruto, prompt completo ou resposta bruta.
- Persistencia deve salvar apenas dado estruturado necessario para historico privado.

## Prompt 12 - Guardrails especificos

### Revisao Semanal

- A sintese deve caber em leitura rapida e terminar com foco e primeira acao.
- Padrões devem ter evidencia minima e ajuste pratico.
- Sobrecarga deve sugerir reducao de escopo, descanso ou friccao menor.
- Linguagem proibida: fracasso, voce falhou, falta disciplina, decepcao espiritual, perdeu tudo.
- Camada crista e opcional e nao pode afirmar vontade divina especifica nem usar culpa espiritual.

### Jardim da Vida

- `needs_care` e estado de cuidado, nao derrota.
- Crescimento pequeno, retomada e descanso protegido contam como progresso.
- Jardim nao deve expor revisao, Metacognicao, Placar bruto, calendario bruto ou habitos sensiveis.

## Prompt 13 - Guardrails especificos

### Atalaia

- Toda mensagem exige alvo especifico, permissoes granulares, previa e revisao do usuario.
- `privacy_check` deve bloquear Chamado completo, Metacognicao, saude, familia, financas, emocoes, Revisao Semanal privada, inbox bruto, calendario completo e distracoes.
- O Atalaia nao recebe conta inteira, Placar bruto, historico privado ou contexto sensivel indireto.
- Revogacao deve cancelar notificacoes pendentes e impedir leitura futura.

### Documento de Compromisso

- Documento nasce como rascunho editavel e nao e compartilhado automaticamente.
- Chamado pode aparecer apenas como resumo autorizado, nunca como texto completo.
- Alavancas devem ser saudaveis: recompensa pequena, reparacao restaurativa e sem humilhacao, punicao, exposicao publica, culpa espiritual ou dano financeiro/fisico.

### Notificacoes

- E-mail real permanece desativado sem provider configurado.
- Assunto e corpo devem ser neutros; conteudo sensivel fica fora da mensagem.
- Qualquer envio futuro deve ser server-side, auditavel e bloqueado se consentimento, schema ou guardrail falhar.

## Prompt 15 - Guardrail de persistencia owner-only

Structured outputs que voltam do cliente para salvar historico privado tambem precisam ser revisados antes de persistir.

- `owner-persistence` bloqueia diagnostico, substituicao de terapia/aconselhamento pastoral, vontade divina especifica, culpa espiritual, humilhacao, punicao nociva e crise tratada como produtividade.
- Desbloqueador e Metacognicao rodam este guardrail antes de salvar output estruturado recebido do cliente.
- Dados sensiveis owner-only podem ser mantidos como historico privado, mas nao podem virar compartilhamento externo nem log bruto.
