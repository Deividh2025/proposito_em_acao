# PRD - Proposito em Acao

## Identificacao do produto

- Nome: Proposito em Acao.
- Categoria: SaaS desktop-first de vida intencional, foco, execucao, habitos, autorregulacao e produtividade assistida por IA.
- Formato principal: web desktop-first.
- Formato complementar: PWA/mobile para acoes rapidas.
- Fonte primaria: `docs/source/prd_proposito_em_acao.md`.

## Resumo executivo

Proposito em Acao e um sistema operacional de vida guiado por proposito. A plataforma conduz o usuario do perfil ao Mapa da Vida, do Mapa ao Chamado Pessoal, do Chamado a alvos SMART-E, dos alvos a projetos, tarefas, calendario, foco, habitos, Placar, Atalaia, Revisao Semanal e Jardim da Vida.

A V1 deve ser completa em largura e controlada em profundidade: todos os modulos centrais existem, mas com profundidade inicial simples, segura e integrada.

## Estado operacional atual

Data de sincronizacao: 2026-06-03.

- Classificacao: V1 local ampla / pre-beta real.
- Proximo objetivo: beta real fechado, nao producao aberta.
- Os fluxos locais e E2E cobrem largura relevante, mas varias paginas ainda usam dados demonstrativos ou fallback local/dev. Isso nao deve ser tratado como jornada real persistida do usuario.
- Beta real segue bloqueado por URL HTTPS publicada, Auth SSR/callback/confirmacao/recuperacao validados, secrets no provedor, smoke externo, LGPD minima, rollback aprovado e evidencia fresca de Supabase/RLS.
- Plataforma decidida: dominio e Hostinger VPS KVM 1 com Coolify, com gate obrigatorio de upgrade se a KVM 1 nao sustentar a aplicacao.
- Backend do beta: projeto Supabase principal apenas apos cutover validado e aprovado.
- IA real planejada: seletor `automatic`, `openai` ou `deepseek`, padrao `automatic`, consentimento por provider e sem fallback automatico entre providers.
- E-mail real planejado: Resend para transacional e SMTP customizado do Supabase Auth.
- Analytics planejado: first-party no Supabase, opt-in desligado por padrao, retencao de 90 dias para analytics, feedback beta e metadados de auditoria de IA.

## Problema

Pessoas sobrecarregadas, dispersas, procrastinadoras ou com baixa funcao executiva costumam ter ferramentas separadas para agenda, tarefas, habitos, reflexao e planejamento. Essas ferramentas resolvem sintomas operacionais, mas nao integram direcao, autorregulacao, proxima acao e retomada.

## Objetivos

1. Dar clareza de direcao antes de produtividade.
2. Transformar direcao em alvos, projetos, tarefas e calendario.
3. Reduzir paralisia por microtarefas, foco e Desbloqueador.
4. Apoiar autorregulacao por Metacognicao.
5. Medir constancia sem humilhacao.
6. Permitir acompanhamento externo por Atalaia com consentimento.
7. Proteger dados sensiveis desde a fundacao.

## Nao objetivos

- Substituir terapia, medicina, psiquiatria ou aconselhamento pastoral humano.
- Diagnosticar TDAH, ansiedade, depressao ou qualquer condicao clinica.
- Afirmar vontade divina especifica.
- Usar culpa espiritual.
- Ser apenas chatbot, calendario, lista de tarefas ou app de habitos.
- Expor dados intimos ao Atalaia sem consentimento.
- Criar gamificacao punitiva ou comparacao publica.

## Personas

| Persona | Dor principal | Necessidade |
|---|---|---|
| Sobrecarregado funcional | Vive apagando incendios | Clareza de hoje e semana |
| Procrastinador consciente | Sabe o que fazer, mas trava | Primeiro passo pequeno |
| Usuario TDAH-like | Sofre com memoria de trabalho, tempo e inicio | Baixa friccao e feedback imediato |
| Cristao em busca de direcao | Quer integrar fe e rotina | Camada crista segura e configuravel |
| Realizador sem equilibrio | Avanca sacrificando areas importantes | Analise ecologica e descanso |

## Proposta de valor

Menos caos, mais clareza. Menos intencao vaga, mais execucao concreta. Menos culpa, mais retomada. Menos pensamento automatico, mais consciencia. Menos agenda aleatoria, mais vida guiada por proposito.

## Principios

1. Chamado antes de agenda.
2. Clareza antes de produtividade.
3. Execucao em pequenos passos.
4. TDAH-first.
5. Dopamina saudavel.
6. Fe integrada a vida real.
7. Ciencia aplicada.
8. IA como mentor operacional.
9. Retomada acima de perfeicao.
10. Responsabilidade sem humilhacao.

## Escopo da V1

V1 completa em largura:

1. Autenticacao e perfil.
2. Mapa da Vida.
3. Chamado Pessoal.
4. Alvos SMART-E.
5. Projetos.
6. Tarefas e microtarefas.
7. Calendario de execucao.
8. Caixa de entrada/GTD adaptado.
9. Desbloqueador de Acao.
10. Metacognicao.
11. Modo Foco/Pomodoro.
12. Habitos com IA.
13. Placar da Disciplina.
14. Atalaia basico.
15. Documento de compromisso.
16. Alavancas de Compromisso.
17. Revisao semanal.
18. Jardim da Vida.
19. Dashboard principal.
20. PWA/mobile complementar.
21. Camada crista configuravel.
22. Fundamentacao cientifica leve.
23. Seguranca, privacidade, consentimento e LGPD.

## Requisitos funcionais por modulo

### Perfil e autenticacao

- Permitir cadastro/login quando a stack existir.
- Coletar perfil essencial e progressivo.
- Configurar tom da IA.
- Configurar intensidade da camada crista.
- Registrar consentimentos.

Aceite: usuario entra no dashboard, perfil alimenta personalizacao e nenhum dado sensivel e compartilhado sem consentimento.

### Mapa da Vida

- Avaliar areas da vida por nota.
- Coletar respostas curtas.
- Exibir feedback visual.
- Gerar leitura por IA.
- Salvar historico.
- Influenciar alvos.

Aceite: usuario completa em poucos minutos, recebe leitura nao culpabilizante e historico fica disponivel.

### Chamado Pessoal

- Conduzir sessao guiada.
- Permitir hipotese provisoria.
- Usar Chamado como filtro.
- Permitir revisao.
- Evitar linguagem de vontade divina especifica.

Aceite: usuario termina com formulacao inicial ou direcao em discernimento e consegue retomar sessao interrompida.

### Alvos SMART-E

- Converter desejo vago em alvo especifico, mensuravel, atingivel, relevante, temporal e ecologico.
- Avaliar alinhamento ao Chamado.
- Sugerir primeira acao.
- Controlar status.

Aceite: cada alvo ativo tem vinculo, medida, prazo, analise ecologica e proxima acao.

### Projetos

- Criar projeto a partir de alvo.
- Definir fases, marcos, riscos, recursos e tarefas.
- Permitir aceitar, editar ou regenerar.
- Gerar plano de retomada.

Aceite: projeto possui proxima acao e nao fica desconectado do alvo.

### Tarefas e microtarefas

- Criar tarefas manuais ou por IA.
- Quebrar tarefas grandes em microtarefas.
- Registrar energia, tempo, status e proxima acao.
- Encaminhar tarefa travada para Desbloqueador ou Metacognicao.

Aceite: tarefa grande nunca fica sem microacao inicial.

### Calendario

- Oferecer visao diaria e semanal.
- Agendar tarefas, foco, habitos e descanso.
- Alertar sobrecarga.
- Permitir fallback simples de agendamento se drag-and-drop nao existir.

Aceite: usuario ve o que fazer hoje e consegue agendar proxima acao.

### Caixa de entrada/GTD

- Capturar rapido.
- Classificar por IA com edicao do usuario.
- Sugerir destino: tarefa, projeto, habito, calendario, referencia, Metacognicao ou descarte.

Aceite: capturas nao ficam soltas e podem virar proxima acao.

### Desbloqueador de Acao

- Acesso global.
- Entrada curta: tarefa, bloqueio, energia e tempo disponivel.
- Saida: primeiro passo, versao minima, tempo e rota para foco.
- Encaminhar bloqueio emocional para Metacognicao.

Aceite: resposta e acionavel, curta e sem palestra.

### Metacognicao

- Nomear estado interno.
- Separar fato, interpretacao, sentimento e impulso.
- Identificar pensamento automatico e distorcoes provaveis.
- Confrontar autoengano com respeito.
- Reformular e gerar proxima acao.
- Manter historico privado por padrao.

Aceite: sessao termina com microacao, descanso legitimo, oracao/reflexao opcional ou ajuda humana adequada.

### Modo Foco/Pomodoro

- Temporizadores 5, 15, 25, 50 e customizado.
- Tela limpa.
- Captura de distracoes.
- Atualizar tarefa e progresso.

Aceite: usuario inicia foco a partir de tarefa e conclui com registro simples.

### Habitos com IA

- Criar habito com gatilho, rotina minima, rotina ideal, recompensa e plano se/entao.
- Vincular a alvo e calendario quando fizer sentido.
- Integrar ao Placar.

Aceite: habito tem versao minima e retomada sem culpa.

### Placar da Disciplina

- Medir tarefas-chave, habitos e retomadas.
- Marcacao rapida.
- Leitura simples de padroes.
- Compartilhamento limitado com Atalaia se autorizado.

Aceite: Placar incentiva constancia sem vergonha.

### Atalaia

- Convidar Atalaia por alvo.
- Definir permissao granular.
- Mostrar previa antes de mensagem.
- Revogar acesso.
- Excluir dados intimos por padrao.

Aceite: Atalaia ve apenas dados autorizados do alvo e revogacao bloqueia acesso futuro.

### Documento de compromisso

- Gerar documento a partir de alvo, motivo, prazo, compromissos e alavancas.
- Permitir edicao.
- Compartilhar apenas com consentimento.

Aceite: usuario revisa antes de salvar ou enviar.

### Alavancas de Compromisso

- Criar recompensa por avanco.
- Criar recompensa por conclusao.
- Criar reparacao saudavel por abandono.
- Bloquear alavancas humilhantes, nocivas ou espiritualmente abusivas.

Aceite: alavancas reforcam responsabilidade sem punicao destrutiva.

### Revisao semanal

- Perguntar avancos, travas, aprendizados, habitos, alvos e areas negligenciadas.
- Gerar sintese por IA.
- Identificar padroes.
- Sugerir foco da proxima semana.

Aceite: falhas viram aprendizado e rota ajustada.

### Jardim da Vida

- Representar areas da vida.
- Crescer por progresso real.
- Sinalizar negligencia sem punir.
- Integrar Revisao Semanal.

Aceite: Jardim motiva cuidado integral.

### Dashboard

- Destacar proxima acao.
- Organizar Agora, Hoje, Semana, Direcao e Progresso.
- Dar acesso rapido a Desbloqueador, Metacognicao, Calendario, Placar e Revisao.

Aceite: usuario entende em poucos segundos o que fazer agora.

### PWA/mobile

- Captura rapida.
- Marcar habitos e Placar.
- Foco curto.
- Desbloqueador rapido.
- Metacognicao rapida.
- Check-in de energia.

Aceite: mobile e leve e nao replica a complexidade do desktop.

### Camada crista

- Configurar intensidade.
- Usar linguagem de graca, sabedoria, dominio proprio, descanso e mordomia.
- Evitar culpa, moralismo e vontade divina especifica.

Aceite: usuario controla intensidade e respostas seguem guardrails.

### Seguranca e privacidade

- Dados privados por padrao.
- Consentimento granular, versionado e revogavel.
- RLS obrigatoria em tabelas expostas.
- Logs sem dados intimos.
- Atalaia por alvo.
- Escritas sensiveis com validacao server-side e confirmacao de resultado.

Aceite: nenhum compartilhamento ocorre sem escopo e consentimento.

## Requisitos nao funcionais

- Seguranca: auth segura, RLS em tabelas expostas, menor privilegio, validacao server-side, Atalaia por grant especifico e confirmacao de escritas sensiveis.
- Privacidade: minimizacao, consentimento granular/versionado/revogavel, retencao definida, exportacao e exclusao antes da primeira coleta real.
- Performance: dashboard rapido, fluxos principais com poucos cliques.
- Confiabilidade: rascunhos em sessoes longas e fallback manual se IA falhar.
- Acessibilidade: contraste, teclado, textos legiveis e baixa estimulacao.
- Observabilidade: metadados tecnicos sem conteudo intimo.

## Metricas

North Star: semanas com pelo menos 3 acoes concluidas alinhadas a um alvo vinculado ao Chamado.

Ativacao: perfil, Mapa, Chamado, primeiro alvo, primeiro projeto, primeira tarefa agendada, primeiro foco, primeira Metacognicao e primeira Revisao.

Retencao: revisoes semanais, foco, habitos, Placar, retomadas, Metacognicoes que viram acao e uso mobile para captura.

Seguranca: zero vazamento entre usuarios, zero compartilhamento indevido com Atalaia, RLS em tabelas expostas e taxa de schemas validos.

## Riscos

- Escopo excessivo.
- IA generica.
- Sobrecarga TDAH.
- Metacognicao parecer terapia.
- Culpa espiritual.
- Vazamento ao Atalaia.
- Dependencia decisoria da IA.

## Roadmap conceitual

1. Fontes de verdade.
2. Stack e arquitetura.
3. Supabase/Auth/RLS.
4. Design system.
5. Onboarding e direcao.
6. Execucao.
7. Apoio a acao.
8. Constancia.
9. Atalaia e compromisso.
10. Mobile/PWA.
11. QA, seguranca e deploy.

## Pendencias de decisao

Ver `docs/OPEN_QUESTIONS.md`.

## Definicao final

Proposito em Acao e uma plataforma para transformar Chamado em acao concreta, com IA operacional, Metacognicao, microtarefas, calendario, foco, habitos, Placar, Atalaia, Revisao Semanal e Jardim da Vida, mantendo responsabilidade sem humilhacao e privacidade desde a fundacao.
