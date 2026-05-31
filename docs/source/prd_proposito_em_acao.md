# PRD — SaaS de Vida Intencional, Foco e Execução

## 1. IDENTIFICAÇÃO DO PRODUTO

**Nome provisório do produto:** a definir.

**Categoria:** SaaS desktop-first de vida intencional, produtividade, foco, hábitos, autorregulação e execução assistida por IA.

**Formato principal:** aplicação web desktop-first.

**Formato complementar:** PWA ou app mobile leve para captura rápida, marcação de hábitos, Placar da Disciplina, foco curto, Desbloqueador de Ação e Metacognição rápida.

**Tese central:** a plataforma não será apenas um aplicativo de tarefas, agenda ou hábitos. Será um **sistema operacional de vida guiado por propósito**, em que o usuário identifica sua direção, organiza alvos, transforma alvos em projetos, quebra projetos em microtarefas, agenda a execução, recebe apoio de IA para destravar ações e revisa sua caminhada com clareza, responsabilidade e retomada.

**Princípio dominante:** **Chamado antes de agenda.** O sistema não começa pela tarefa, mas pela direção. A agenda passa a ser o lugar onde o Chamado se torna execução concreta.

**Versão deste PRD:** 1.0.

**Status:** documento-base para validação estratégica antes da criação do playbook de prompts e da implementação por etapas.

---

## 2. RESUMO EXECUTIVO

O produto será uma plataforma SaaS desktop-first para pessoas sobrecarregadas, dispersas, procrastinadoras ou com perfil TDAH-like, que precisam transformar intenção em ação diária. A plataforma combinará IA, ciência comportamental, princípios de neurociência aplicada, elementos de TCC, camada cristã, design dopaminérgico e estrutura de execução prática.

O usuário será conduzido por uma jornada progressiva: perfil, Mapa da Vida, descoberta do Chamado Pessoal, criação de alvos SMART-E, decomposição em projetos, tarefas e microtarefas, distribuição no calendário, execução em Modo Foco, criação de hábitos, acompanhamento pelo Placar da Disciplina, apoio do Atalaia, revisão semanal e visualização de progresso pelo Jardim da Vida.

A nova funcionalidade de **Metacognição** será incorporada como módulo transversal de autorregulação. Nela, o usuário poderá informar sentimentos, pensamentos automáticos, angústias, ansiedade, paralisia diante de tarefas, ruminação, vitimização, procrastinação ou bloqueios internos. A IA atuará como mentor com conhecimento em neurociência, TCC e aconselhamento cristão, ajudando o usuário a examinar a estrutura do pensamento, separar fatos de interpretações, identificar distorções cognitivas, confrontar narrativas frágeis, recuperar responsabilidade prática e retornar à próxima ação possível.

A V1 deverá ser **completa em largura e controlada em profundidade**: todos os módulos centrais existirão desde o início, mas com implementação inicial simples, segura e integrada. O objetivo não é lançar um MVP mínimo mutilado, mas uma primeira versão coerente do sistema inteiro.

---

## 3. PROBLEMA

### 3.1 Problema principal

Muitas pessoas vivem com excesso de informação, falta de clareza, dificuldade de iniciar tarefas, baixa constância, agenda reativa, metas vagas, culpa acumulada e pouca percepção de progresso. Ferramentas tradicionais de produtividade costumam tratar sintomas operacionais — tarefas, lembretes e calendários — sem tratar a raiz: ausência de direção, fragmentação mental, baixa autorregulação e dificuldade de transformar intenção em execução.

### 3.2 Problemas específicos

O produto deve resolver ou reduzir os seguintes problemas:

1. O usuário não sabe claramente para onde está indo.
2. O usuário tem desejos vagos, mas não consegue transformá-los em alvos concretos.
3. O usuário cria metas incompatíveis com sua rotina, energia e áreas da vida.
4. O usuário não consegue quebrar objetivos grandes em passos pequenos.
5. O usuário sente paralisia diante de tarefas simples.
6. O usuário começa, falha, sente culpa e abandona.
7. O usuário se perde em ferramentas separadas: agenda, hábitos, tarefas, notas, reflexões e planejamento.
8. O usuário com TDAH ou perfil semelhante sofre com excesso de decisão, interface pesada, pouca clareza visual e falta de próxima ação.
9. O usuário interpreta estados emocionais como verdades absolutas: “não consigo”, “não sou disciplinado”, “sempre falho”, “não adianta começar agora”.
10. O usuário precisa de confrontação amigável, não apenas motivação genérica.
11. O usuário cristão sente falta de uma ferramenta que integre fé, propósito, mordomia do tempo, domínio próprio, descanso, serviço e família sem soar superficial ou moralista.

### 3.3 Oportunidade

Há espaço para um produto que una execução prática com direção existencial, IA contextual, linguagem cristã madura, neurociência aplicada, TCC operacional, gamificação leve e UX TDAH-first. O diferencial não é “ter IA”, mas **usar IA como mentor operacional e metacognitivo**, ajudando o usuário a pensar melhor, decidir melhor e agir em passos pequenos.

---

## 4. OBJETIVOS DO PRODUTO

### 4.1 Objetivo geral

Criar uma plataforma SaaS que ajude o usuário a descobrir sua direção, organizar sua vida em torno dela e executar ações diárias com clareza, constância, autorregulação e acompanhamento inteligente.

### 4.2 Objetivos específicos

1. Conduzir o usuário a construir um perfil pessoal útil para personalização.
2. Diagnosticar áreas da vida por meio de um Mapa da Vida visual e dopaminérgico.
3. Guiar o usuário por uma sessão estruturada de descoberta do Chamado Pessoal.
4. Usar o Chamado como filtro central para alvos, projetos, tarefas, hábitos e agenda.
5. Transformar desejos vagos em alvos SMART-E.
6. Converter alvos em projetos, tarefas e microtarefas.
7. Integrar tarefas, projetos, hábitos e compromissos em um calendário de execução.
8. Disponibilizar um Desbloqueador de Ação sempre acessível.
9. Criar um módulo de Metacognição para examinar pensamentos, sentimentos e bloqueios.
10. Criar hábitos com IA a partir de gatilhos, rotinas mínimas, recompensas e planos se/então.
11. Acompanhar constância pelo Placar da Disciplina.
12. Permitir acompanhamento externo por Atalaia com consentimento granular.
13. Gerar revisão semanal com diagnóstico de padrões, retomada e planejamento.
14. Mostrar progresso por meio do Jardim da Vida e recompensas visuais saudáveis.
15. Proteger dados sensíveis com privacidade, consentimento, RLS e acesso mínimo necessário.

---

## 5. NÃO OBJETIVOS

O produto não deverá:

1. Substituir psicoterapia, atendimento médico, aconselhamento pastoral humano ou acompanhamento psiquiátrico.
2. Diagnosticar TDAH, ansiedade, depressão, transtornos ou condições clínicas.
3. Prometer cura emocional, espiritual ou psicológica.
4. Afirmar que Deus mandou o usuário fazer determinada ação.
5. Usar culpa espiritual para forçar produtividade.
6. Expor dados íntimos ao Atalaia sem consentimento expresso.
7. Criar punições humilhantes, constrangedoras ou espiritualmente abusivas.
8. Transformar gamificação em dependência, comparação social ou pressão pública.
9. Criar uma agenda sobrecarregada que contradiga descanso, família, saúde e fé.
10. Ser apenas um chatbot com aparência de app.

---

## 6. PÚBLICO-ALVO

### 6.1 Público primário

Pessoas adultas ou jovens adultas que enfrentam dificuldade de foco, procrastinação, baixa constância, sensação de caos, desorganização, excesso de pensamentos, dificuldade de priorização e desejo de viver com mais propósito.

### 6.2 Público secundário

Pessoas com diagnóstico, suspeita ou traços de TDAH que precisam de estrutura visual, baixa fricção, microtarefas, feedback imediato, retomada sem culpa, organização externa e próxima ação clara.

### 6.3 Público cristão

Usuários cristãos que desejam integrar fé, propósito, mordomia do tempo, serviço, família, descanso, domínio próprio e crescimento pessoal à execução prática da semana.

### 6.4 Personas iniciais

**Persona 1 — O sobrecarregado funcional**  
Trabalha, entrega o básico, mas vive apagando incêndios. Tem muitas responsabilidades, pouca clareza e sente que está sempre atrasado.

**Persona 2 — O procrastinador consciente**  
Sabe o que precisa fazer, mas trava no início. Consome conteúdo de produtividade, mas não consegue sustentar execução.

**Persona 3 — O usuário TDAH-like**  
Tem dificuldade com memória de trabalho, noção de tempo, início de tarefas, constância e organização. Precisa de estímulo visual e instruções pequenas.

**Persona 4 — O cristão em busca de direção**  
Quer organizar a vida sem separar fé e rotina. Busca propósito, serviço, domínio próprio e equilíbrio entre chamado, família, trabalho e descanso.

**Persona 5 — O realizador sem equilíbrio**  
Tem metas fortes, mas sacrifica saúde, família, descanso ou espiritualidade. Precisa de um filtro ecológico para evitar produtividade destrutiva.

---

## 7. PROPOSTA DE VALOR

### 7.1 Proposta principal

**Um copiloto cristão de execução pessoal que ajuda o usuário a descobrir sua direção, quebrar objetivos em pequenos passos, confrontar bloqueios internos e executar sua semana com clareza.**

### 7.2 Promessas funcionais

1. Menos caos, mais clareza.
2. Menos intenção vaga, mais execução concreta.
3. Menos culpa, mais retomada.
4. Menos agenda aleatória, mais vida guiada por propósito.
5. Menos paralisia, mais próximo passo.
6. Menos pensamento automático, mais metacognição.

### 7.3 Diferenciais

1. Chamado Pessoal como eixo do sistema.
2. Mapa da Vida integrado aos alvos.
3. IA que não apenas responde, mas conduz sessões.
4. Desbloqueador de Ação para paralisia imediata.
5. Metacognição com base em TCC, neurociência e aconselhamento cristão.
6. Alvos SMART-E com análise ecológica.
7. Design TDAH-first.
8. Atalaia com consentimento granular.
9. Jardim da Vida como progresso visual não punitivo.
10. Revisão semanal inteligente.

---

## 8. PRINCÍPIOS DE PRODUTO

### 8.1 Chamado antes de agenda

O usuário não começa organizando tarefas. Primeiro entende direção, valores, áreas da vida e intenção maior.

### 8.2 Clareza antes de produtividade

Produtividade sem clareza vira ocupação. O produto deve reduzir confusão antes de aumentar volume de execução.

### 8.3 Execução em pequenos passos

Todo alvo relevante deve virar projeto, tarefa e microtarefa. O sistema deve favorecer início rápido.

### 8.4 TDAH-first

A experiência deve reduzir atrito, vergonha, excesso de decisão, telas cheias, ambiguidade e fricção de retorno.

### 8.5 Dopamina saudável

O produto deve gerar prazer em avançar, mas sem vício, comparação pública ou punição visual.

### 8.6 Fé integrada à vida real

A camada cristã deve orientar decisões, descanso, serviço, família, mordomia do tempo e domínio próprio.

### 8.7 Ciência aplicada

As funcionalidades devem ter explicação simples de por que funcionam, sem academicismo pesado.

### 8.8 IA como mentor operacional

A IA não deve ser apenas chatbot. Deve conduzir, organizar, confrontar, sugerir, revisar e ajudar a executar.

### 8.9 Retomada acima de perfeição

O produto deve celebrar retorno após falhas. A constância real é medida também pela capacidade de recomeçar.

### 8.10 Responsabilidade sem humilhação

A IA pode confrontar autoengano, vitimização e fuga de responsabilidade, mas sem desprezo, moralismo ou abuso espiritual.

---

## 9. EXPERIÊNCIA CENTRAL DO USUÁRIO

### 9.1 Jornada macro

1. Cadastro e perfil.
2. Mapa da Vida.
3. Sessão de Chamado Pessoal.
4. Hipótese de Chamado ou Chamado consolidado.
5. Criação de alvos SMART-E.
6. Conversão de alvos em projetos.
7. Quebra de projetos em tarefas e microtarefas.
8. Organização no calendário.
9. Execução com Modo Foco.
10. Apoio do Desbloqueador de Ação.
11. Apoio da Metacognição em bloqueios internos.
12. Criação e marcação de hábitos.
13. Acompanhamento pelo Placar da Disciplina.
14. Atalaia, quando autorizado.
15. Revisão semanal.
16. Evolução do Jardim da Vida.

### 9.2 Pergunta central da interface

**Qual é o próximo passo agora?**

Essa pergunta deve orientar dashboard, agenda, tarefas, foco, Metacognição e Desbloqueador de Ação.

### 9.3 Estados centrais

O sistema deve reconhecer os seguintes estados do usuário:

1. Sem direção.
2. Com direção em construção.
3. Com alvo vago.
4. Com projeto sem próxima ação.
5. Com tarefa grande demais.
6. Travado emocionalmente.
7. Com baixa energia.
8. Em foco.
9. Em retomada.
10. Em revisão.
11. Em sobrecarga.
12. Em risco de abandono de hábito/alvo.

---

## 10. ESCOPO DA V1

### 10.1 Definição de V1

A V1 será completa em largura e controlada em profundidade. Isso significa que todos os módulos principais existirão, mas alguns nascerão em versão simples.

### 10.2 Módulos obrigatórios da V1

1. Autenticação e perfil.
2. Mapa da Vida.
3. Chamado Pessoal.
4. Alvos SMART-E.
5. Projetos.
6. Tarefas e microtarefas.
7. Calendário de execução.
8. Caixa de entrada/GTD adaptado.
9. Desbloqueador de Ação.
10. Metacognição.
11. Modo Foco/Pomodoro.
12. Hábitos com IA.
13. Placar da Disciplina.
14. Atalaia básico.
15. Documento de compromisso simples.
16. Alavancas de Compromisso simples.
17. Revisão semanal.
18. Jardim da Vida simples.
19. Dashboard principal.
20. Mobile complementar em PWA ou versão responsiva rápida.
21. Camada cristã configurável.
22. Fundamentação científica leve.
23. Segurança, privacidade e consentimento.

### 10.3 Profundidade inicial por módulo

**Perfil:** completo o suficiente para personalização, sem questionário excessivo.

**Mapa da Vida:** notas, perguntas curtas, feedback visual e análise simples da IA.

**Chamado:** sessão guiada em etapas, com hipótese provisória e possibilidade de revisão.

**Alvos:** criação e revisão SMART-E com IA.

**Projetos:** geração inicial de fases, marcos e tarefas.

**Tarefas:** criação, edição, decomposição e vínculo com calendário.

**Calendário:** visão semanal e diária, blocos e arrastar/soltar se tecnicamente viável na primeira versão; se não, agendamento por formulário simples.

**GTD:** captura e classificação básica por IA.

**Desbloqueador:** fluxo curto com entrada rápida e resposta acionável.

**Metacognição:** fluxo guiado de reflexão, desarticulação de pensamentos frágeis e retorno à ação.

**Modo Foco:** temporizadores 5, 15, 25, 50 e personalizado.

**Hábitos:** criação assistida e marcação diária.

**Placar:** acompanhamento visual simples de hábitos, tarefas-chave e retomadas.

**Atalaia:** convite por e-mail e relatório limitado por alvo autorizado.

**Jardim:** visual inicial por áreas da vida, sem gamificação complexa.

---

## 11. REQUISITOS FUNCIONAIS POR MÓDULO

## 11.1 AUTENTICAÇÃO E PERFIL

### Objetivo

Permitir que o usuário crie conta, configure dados pessoais essenciais e forneça contexto para personalização da IA.

### Requisitos

**RF-PERFIL-001 — Cadastro**  
O sistema deve permitir cadastro por e-mail/senha e, se viável, login social.

**RF-PERFIL-002 — Perfil essencial**  
O sistema deve coletar nome, rotina, ocupação, principais responsabilidades, áreas de maior dificuldade, relação com foco/procrastinação, nível de energia, contexto familiar, relação com fé, expectativas e tipo de suporte desejado pela IA.

**RF-PERFIL-003 — Perfil progressivo**  
O sistema deve permitir que o usuário complete ou refine o perfil posteriormente, sem exigir todos os dados no primeiro acesso.

**RF-PERFIL-004 — Preferência de tom da IA**  
O sistema deve permitir configurar intensidade da IA: leve, equilibrada ou firme.

**RF-PERFIL-005 — Preferência da camada cristã**  
O sistema deve permitir configurar a presença da camada cristã: discreta, equilibrada ou intensa.

**RF-PERFIL-006 — Consentimentos**  
O sistema deve registrar consentimentos de uso de dados, IA, comunicações e compartilhamento com Atalaia.

### Critérios de aceite

1. Usuário consegue criar conta e acessar dashboard inicial.
2. Dados de perfil alimentam recomendações da IA.
3. Usuário pode alterar tom da IA e intensidade da camada cristã.
4. Nenhum dado sensível é compartilhado com terceiros sem consentimento.

---

## 11.2 MAPA DA VIDA

### Objetivo

Diagnosticar o estado atual das áreas da vida de forma visual, rápida e recompensadora.

### Áreas avaliadas

1. Fé e espiritualidade.
2. Saúde e energia.
3. Família.
4. Trabalho/carreira.
5. Finanças.
6. Emoções.
7. Relacionamentos.
8. Aprendizado.
9. Descanso.
10. Serviço/contribuição.

### Requisitos

**RF-MAPA-001 — Avaliação por nota**  
O usuário deve atribuir notas para cada área.

**RF-MAPA-002 — Perguntas curtas**  
Cada área deve ter perguntas rápidas para contextualizar a nota.

**RF-MAPA-003 — Feedback visual imediato**  
O sistema deve exibir representação visual do equilíbrio da vida.

**RF-MAPA-004 — Interpretação por IA**  
A IA deve indicar áreas fortes, fragilizadas, negligenciadas e possíveis desequilíbrios.

**RF-MAPA-005 — Histórico**  
O sistema deve salvar versões do Mapa para comparação futura.

**RF-MAPA-006 — Integração com alvos**  
Ao criar alvos, a IA deve considerar o estado das áreas do Mapa da Vida.

### Critérios de aceite

1. Usuário completa o Mapa em poucos minutos.
2. IA gera leitura clara e não culpabilizante.
3. Sistema identifica áreas que não devem ser sacrificadas por metas agressivas.
4. Histórico pode ser comparado em revisões futuras.

---

## 11.3 CHAMADO PESSOAL

### Objetivo

Conduzir o usuário a descobrir ou formular uma hipótese de Chamado Pessoal que sirva como filtro para decisões, alvos, projetos e agenda.

### Requisitos

**RF-CHAMADO-001 — Sessão guiada**  
A IA deve conduzir uma sessão com perguntas progressivas sobre incômodos, dores que deseja resolver, dons, talentos, experiências marcantes, valores, senso de responsabilidade, serviço e contribuição.

**RF-CHAMADO-002 — Hipótese provisória**  
O sistema deve permitir que o usuário use uma “direção em discernimento” antes de consolidar o Chamado.

**RF-CHAMADO-003 — Bloqueio/progressão assistida**  
Funcionalidades estratégicas devem ser limitadas até que exista ao menos uma hipótese de Chamado, mas o usuário deve conseguir capturar ideias, usar Desbloqueador, usar Metacognição e criar tarefas simples.

**RF-CHAMADO-004 — Revisão do Chamado**  
O usuário deve poder revisar, refinar ou atualizar seu Chamado em revisões futuras.

**RF-CHAMADO-005 — Filtro central**  
A IA deve usar o Chamado para avaliar alvos, projetos, hábitos e compromissos.

**RF-CHAMADO-006 — Linguagem cristã segura**  
A IA deve evitar afirmações definitivas como “Deus quer que você faça X”. Deve usar linguagem de discernimento, sabedoria, oração, Escritura, comunidade e responsabilidade.

### Critérios de aceite

1. Usuário conclui sessão com uma formulação inicial de Chamado ou direção.
2. Alvos criados depois são avaliados à luz desse Chamado.
3. Usuário entende que o Chamado é direção em amadurecimento, não sentença imutável.
4. Sistema permite retomar a jornada caso o usuário interrompa a sessão.

---

## 11.4 ALVOS SMART-E

### Objetivo

Transformar desejos vagos em alvos concretos, mensuráveis, realistas, relevantes, temporais e ecológicos.

### Requisitos

**RF-ALVO-001 — Criação livre**  
Usuário pode escrever um desejo vago em linguagem natural.

**RF-ALVO-002 — Transformação por IA**  
A IA deve transformar o desejo em alvo SMART-E.

**RF-ALVO-003 — Análise ecológica**  
A IA deve avaliar se o alvo prejudica saúde, família, fé, descanso, finanças ou outra área relevante.

**RF-ALVO-004 — Alinhamento ao Chamado**  
A IA deve indicar se o alvo fortalece, desvia ou é neutro em relação ao Chamado.

**RF-ALVO-005 — Primeira ação**  
Todo alvo deve gerar uma primeira ação de baixa fricção.

**RF-ALVO-006 — Status**  
O alvo deve ter status: rascunho, ativo, pausado, concluído, abandonado, em revisão.

**RF-ALVO-007 — Limite saudável**  
A IA deve sugerir limite de alvos ativos para evitar sobrecarga.

### Critérios de aceite

1. Usuário consegue criar alvo a partir de texto vago.
2. IA retorna alvo estruturado.
3. IA alerta quando o alvo é exagerado, abstrato ou destrutivo para outras áreas.
4. Alvo gera projeto ou tarefa inicial.

---

## 11.5 PROJETOS

### Objetivo

Converter alvos em estruturas executáveis com fases, marcos, tarefas, microtarefas e riscos.

### Requisitos

**RF-PROJ-001 — Geração por IA**  
A IA deve sugerir projetos a partir de um alvo.

**RF-PROJ-002 — Estrutura do projeto**  
Projeto deve conter nome, descrição, alvo vinculado, área da vida, fase, marcos, tarefas, riscos, recursos e prazo.

**RF-PROJ-003 — Aceitar/editar/regenerar**  
Usuário pode aceitar, editar ou pedir nova sugestão.

**RF-PROJ-004 — Plano de retomada**  
Todo projeto deve ter plano de retomada caso fique parado.

**RF-PROJ-005 — Ligação com calendário**  
Tarefas do projeto devem poder ser agendadas.

### Critérios de aceite

1. Projeto pode ser criado manualmente ou por IA.
2. Projeto mostra progresso.
3. Projeto contém próxima ação clara.
4. Projeto parado gera alerta de retomada.

---

## 11.6 TAREFAS E MICROTAREFAS

### Objetivo

Permitir execução concreta por meio de ações pequenas, claras e agendáveis.

### Tipos

1. Tarefa pontual.
2. Tarefa de projeto.
3. Trabalho recorrente.
4. Microtarefa.
5. Tarefa de retomada.

### Requisitos

**RF-TAREFA-001 — Criação de tarefa**  
Usuário pode criar tarefa com título, descrição, prazo, área, prioridade, energia necessária e vínculo com alvo/projeto.

**RF-TAREFA-002 — Quebra por IA**  
A IA deve quebrar tarefa grande em microtarefas.

**RF-TAREFA-003 — Próxima ação**  
Toda tarefa grande deve ter uma próxima ação visível.

**RF-TAREFA-004 — Energia e tempo**  
Tarefas devem poder receber estimativa de energia e duração.

**RF-TAREFA-005 — Status**  
Status: pendente, agendada, em foco, concluída, adiada, travada, cancelada.

**RF-TAREFA-006 — Motivo**  
Tarefa vinculada a alvo deve mostrar por que importa.

**RF-TAREFA-007 — Retomada**  
Tarefa adiada repetidamente deve sugerir Desbloqueador ou Metacognição.

### Critérios de aceite

1. Usuário consegue transformar tarefa grande em microtarefas.
2. Tarefa pode ser agendada no calendário.
3. Tarefa travada oferece rotas: Desbloqueador, Metacognição ou reagendamento.
4. Usuário visualiza próxima ação sem abrir várias telas.

---

## 11.7 CALENDÁRIO DE EXECUÇÃO

### Objetivo

Ser o centro operacional do produto no desktop, integrando compromissos, tarefas, hábitos, foco, descanso e revisão.

### Requisitos

**RF-CAL-001 — Visão semanal**  
O sistema deve oferecer visão semanal como padrão.

**RF-CAL-002 — Visão diária**  
O sistema deve oferecer visão diária para execução.

**RF-CAL-003 — Agendamento de tarefas**  
Usuário deve conseguir colocar tarefas em blocos de tempo.

**RF-CAL-004 — Blocos de foco**  
Usuário deve criar blocos de foco vinculados a tarefas.

**RF-CAL-005 — Hábitos e recorrências**  
Calendário deve suportar hábitos e trabalhos recorrentes.

**RF-CAL-006 — Descanso e família**  
O sistema deve permitir reservar descanso, família e espiritualidade como blocos reais, não sobras.

**RF-CAL-007 — Alerta de sobrecarga**  
IA deve alertar quando a agenda está incompatível com energia, sono, família ou limites informados.

**RF-CAL-008 — Painel lateral**  
Ao lado do calendário deve haver inbox, tarefas pendentes, projetos ativos, hábitos da semana, sugestões da IA, Desbloqueador e Metacognição.

### Critérios de aceite

1. Usuário visualiza a semana com clareza.
2. Usuário agenda tarefa em poucos cliques.
3. Sistema alerta sobre excesso.
4. Usuário consegue iniciar foco a partir do calendário.

---

## 11.8 CAIXA DE ENTRADA / GTD ADAPTADO

### Objetivo

Permitir captura rápida de pensamentos, pendências, ideias, preocupações e tarefas, retirando ruído da cabeça do usuário.

### Requisitos

**RF-INBOX-001 — Captura rápida**  
Usuário pode capturar texto, áudio, imagem, link ou nota simples.

**RF-INBOX-002 — Classificação por IA**  
IA classifica entrada como tarefa, projeto, compromisso, hábito, referência, ideia futura, preocupação, descarte ou item que precisa de clareza.

**RF-INBOX-003 — Sugestão de destino**  
IA sugere fazer agora, agendar, transformar em projeto, delegar, arquivar, excluir ou refletir.

**RF-INBOX-004 — Captura mobile**  
Mobile deve permitir abrir, capturar e fechar rapidamente.

**RF-INBOX-005 — Inbox zero realista**  
Sistema deve ajudar a processar entradas em lotes curtos.

### Critérios de aceite

1. Usuário captura item em menos de poucos segundos.
2. IA classifica com estrutura editável.
3. Item capturado vira tarefa, projeto, hábito ou referência.
4. Inbox não vira depósito infinito sem revisão.

---

## 11.9 DESBLOQUEADOR DE AÇÃO

### Objetivo

Ajudar o usuário a iniciar uma ação quando estiver travado, sem exigir reflexão longa.

### Entrada padrão

1. O que precisa fazer?
2. Energia agora.
3. Tempo disponível.
4. Obstáculo principal, opcional.
5. Tom desejado: leve, normal ou firme.

### Saída esperada

1. Primeiro passo de 2 a 5 minutos.
2. Versão mínima aceitável.
3. Sequência de microtarefas.
4. Modo foco recomendado.
5. Recompensa imediata saudável.
6. Frase de reorientação.
7. Plano de retomada.
8. Botão “começar agora”.

### Requisitos

**RF-DESB-001 — Acesso global**  
Desbloqueador deve estar acessível em dashboard, calendário, tarefas, projetos, foco e mobile.

**RF-DESB-002 — Resposta acionável**  
A resposta deve sempre terminar com uma ação concreta e pequena.

**RF-DESB-003 — Sem palestra**  
IA não deve gerar texto longo por padrão.

**RF-DESB-004 — Integração com foco**  
Usuário pode iniciar Modo Foco diretamente da resposta.

**RF-DESB-005 — Detecção de bloqueio emocional**  
Quando o bloqueio parecer cognitivo/emocional, o sistema deve sugerir Metacognição.

### Critérios de aceite

1. Usuário recebe primeiro passo claro.
2. Usuário consegue começar foco a partir do Desbloqueador.
3. Resposta não sobrecarrega.
4. Sistema diferencia bloqueio operacional de bloqueio metacognitivo.

---

## 11.10 METACOGNIÇÃO

## Objetivo

Criar um módulo de autorregulação cognitiva, emocional e espiritual que ajude o usuário a observar pensamentos e sentimentos, examinar sua estrutura, identificar distorções, confrontar narrativas frágeis, recuperar responsabilidade e retornar à ação possível.

A Metacognição deve funcionar como uma sala de clareza interna. O usuário entra quando está angustiado, ansioso, paralisado, irritado, desanimado, confuso, se sentindo vítima, evitando uma tarefa, preso em ruminação ou sustentando uma interpretação que o impede de agir.

## Posicionamento

A funcionalidade não é terapia, não substitui profissional de saúde mental, não diagnostica e não promete cura. É um recurso de reflexão guiada, autorregulação, clareza e retomada de ação.

## Personalidade da IA neste módulo

A IA deve atuar como **Mentor de Metacognição** com as seguintes características:

1. Formação simulada em neurociência aplicada ao comportamento.
2. Elevado conhecimento de TCC, especialmente pensamentos automáticos, distorções cognitivas, reestruturação cognitiva, esquiva, ruminação e relação pensamento-sentimento-comportamento.
3. Postura de conselheiro cristão, com linguagem de graça, verdade, responsabilidade, domínio próprio, sabedoria, oração e retomada.
4. Tom amigável, encorajador e confrontador.
5. Capacidade de perceber quando o usuário está terceirizando responsabilidade, se colocando como vítima absoluta, usando desculpas, exagerando impossibilidades ou confundindo sentimento com fato.
6. Confrontação firme, mas sem humilhação.
7. Linguagem prática, objetiva e orientada à próxima ação.

## Princípio de funcionamento

O módulo deve seguir esta lógica:

1. Acolher o estado sem validar mentira cognitiva.
2. Nomear o que está acontecendo.
3. Separar fato, interpretação, sentimento e impulso.
4. Identificar pensamento automático dominante.
5. Testar se o pensamento tem estrutura lógica suficiente para se sustentar.
6. Identificar distorções cognitivas prováveis.
7. Fazer perguntas socráticas.
8. Confrontar vitimização, fuga ou autoengano quando presentes.
9. Construir interpretação alternativa mais verdadeira e útil.
10. Gerar uma microação coerente.
11. Encaminhar para Desbloqueador, Modo Foco, oração/reflexão ou descanso legítimo.

## Exemplos de entradas do usuário

1. “Estou ansioso e não consigo começar.”
2. “Acho que vou fracassar.”
3. “Não adianta tentar, eu sempre abandono.”
4. “Estou angustiado sem motivo.”
5. “Tenho uma tarefa simples, mas estou paralisado.”
6. “Estou com raiva porque ninguém me ajuda.”
7. “Eu não tenho disciplina.”
8. “Deus deve estar decepcionado comigo.”
9. “Se eu não fizer perfeito, é melhor nem começar.”
10. “Eu me sinto vítima dessa situação.”

## Saída esperada da IA

A resposta deve ser estruturada e breve o suficiente para não sobrecarregar. Deve conter:

1. **Nome do estado:** exemplo: “paralisia por antecipação”, “ruminação”, “catastrofização”, “fuga por perfeccionismo”, “narrativa de impotência”.
2. **Separação:** fato, interpretação, sentimento, impulso.
3. **Desmonte lógico:** por que o pensamento não se sustenta completamente.
4. **Pergunta confrontadora:** uma pergunta que força responsabilidade.
5. **Reformulação:** pensamento alternativo mais verdadeiro.
6. **Próximo passo:** ação de 2 a 5 minutos.
7. **Âncora cristã opcional:** frase curta sobre verdade, graça, domínio próprio ou sabedoria, sem manipulação espiritual.

## Requisitos funcionais

**RF-META-001 — Acesso global**  
Metacognição deve estar acessível em dashboard, calendário, tarefas, projetos, foco, revisão semanal, Placar e mobile.

**RF-META-002 — Entrada rápida**  
Usuário deve conseguir informar sentimento, pensamento ou dificuldade em texto livre.

**RF-META-003 — Intensidade emocional**  
Sistema deve permitir registrar intensidade de 0 a 10.

**RF-META-004 — Contexto opcional**  
Usuário pode vincular a sessão a tarefa, projeto, alvo, hábito ou área da vida.

**RF-META-005 — Classificação do bloqueio**  
IA deve classificar o bloqueio em categorias: ansiedade, angústia, paralisia, perfeccionismo, procrastinação, ruminação, culpa, vitimização, irritação, medo, confusão, baixa energia, esquiva, sobrecarga ou outro.

**RF-META-006 — Separação fato/interpretação/sentimento/impulso**  
IA deve extrair e mostrar esses quatro elementos de forma clara.

**RF-META-007 — Identificação de distorções cognitivas**  
IA pode identificar possíveis distorções, como catastrofização, tudo-ou-nada, leitura mental, generalização, filtro negativo, desqualificação do positivo, raciocínio emocional, deverias rígidos, rotulação e personalização.

**RF-META-008 — Desarticulação do pensamento**  
IA deve testar a consistência do pensamento, apontando exageros, contradições, falta de evidência, confusão entre sentimento e fato, ou fuga de responsabilidade.

**RF-META-009 — Confrontação responsável**  
Quando houver vitimização, desculpa recorrente, autoengano ou terceirização de responsabilidade, IA deve confrontar com firmeza e respeito.

**RF-META-010 — Reformulação cognitiva**  
IA deve propor uma reformulação mais equilibrada, verdadeira e útil.

**RF-META-011 — Próxima ação**  
Toda sessão deve terminar com uma microação, descanso legítimo, oração/reflexão ou encaminhamento para Desbloqueador.

**RF-META-012 — Histórico de sessões**  
Sistema deve salvar histórico privado de sessões metacognitivas, com data, estado, pensamento, reformulação e ação escolhida.

**RF-META-013 — Padrões recorrentes**  
Na revisão semanal, IA deve identificar padrões recorrentes das sessões de Metacognição.

**RF-META-014 — Proteção de privacidade**  
Sessões de Metacognição nunca devem ser compartilhadas com Atalaia por padrão.

**RF-META-015 — Consentimento explícito para compartilhamento**  
Se o usuário quiser compartilhar algum resumo com Atalaia, deve escolher manualmente o que será compartilhado.

**RF-META-016 — Guardrails de crise**  
Quando o usuário expressar risco emocional grave, perda de controle, ameaça a si ou a terceiros, o sistema deve interromper o fluxo comum e orientar busca de ajuda humana imediata, contato com pessoa de confiança e recursos locais de emergência.

**RF-META-017 — Limite terapêutico**  
A IA deve deixar claro, quando necessário, que o recurso é de reflexão e apoio, não atendimento clínico.

**RF-META-018 — Modo rápido**  
Mobile deve oferecer modo rápido: “nomear → desmontar → próximo passo”.

**RF-META-019 — Modo profundo**  
Desktop deve oferecer modo profundo com perguntas guiadas, histórico e integração com revisão semanal.

**RF-META-020 — Integração com Placar**  
O usuário pode registrar uma “retomada metacognitiva” no Placar, valorizando não apenas acertos, mas recuperação de consciência e ação.

## Critérios de aceite

1. Usuário consegue iniciar sessão em menos de poucos cliques.
2. IA identifica o pensamento central sem transformar tudo em sermão.
3. IA separa fato, interpretação, sentimento e impulso.
4. IA confronta sem humilhar.
5. IA termina com ação concreta.
6. Histórico permanece privado.
7. Sessões aparecem como padrões na revisão semanal.
8. Sistema não oferece diagnóstico ou substituição terapêutica.

## Exemplos de tom

**Usuário:** “Eu não consigo fazer isso.”  
**IA:** “Vamos separar. O fato é que você ainda não começou. A interpretação é ‘eu não consigo’. Essa interpretação é mais forte do que as evidências permitem. Você não provou que não consegue; provou apenas que está evitando começar agora. A pergunta honesta é: qual parte mínima você está disposto a fazer por 2 minutos?”

**Usuário:** “Ninguém me ajuda, então não adianta.”  
**IA:** “Pode ser verdade que faltou apoio. Mas transformar falta de apoio em impossibilidade total é uma conclusão frágil. Isso tira sua responsabilidade e entrega seu próximo passo nas mãos de outras pessoas. O que ainda está sob sua mordomia hoje, mesmo que seja pequeno?”

**Usuário:** “Deus deve estar decepcionado comigo.”  
**IA:** “Esse pensamento mistura culpa, medo e interpretação espiritual. Falhar em uma rotina não autoriza concluir que Deus descartou você. A resposta madura não é se esconder, é voltar para a verdade e para o próximo passo. Qual atitude simples expressa arrependimento, retomada e responsabilidade hoje?”

---

## 11.11 MODO FOCO / POMODORO

### Objetivo

Ajudar o usuário a executar uma tarefa com ambiente visual limpo, tempo definido e captura de distrações.

### Requisitos

**RF-FOCO-001 — Tempos padrão**  
Sistema deve oferecer 5, 15, 25, 50 minutos e tempo personalizado.

**RF-FOCO-002 — Tela limpa**  
Durante foco, mostrar apenas tarefa atual, próximo passo, tempo restante, motivo, captura de distração, pausa e concluir.

**RF-FOCO-003 — Captura de distração**  
Usuário pode registrar distração sem sair do foco.

**RF-FOCO-004 — Baixa energia**  
Sistema deve sugerir foco curto quando energia estiver baixa.

**RF-FOCO-005 — Bloqueio durante foco**  
Se usuário travar durante foco, pode acionar Desbloqueador ou Metacognição.

### Critérios de aceite

1. Usuário inicia foco a partir de tarefa.
2. Distração é capturada sem abandonar foco.
3. Sessão concluída atualiza tarefa, Placar e progresso.

---

## 11.12 HÁBITOS COM IA

### Objetivo

Ajudar usuário a criar hábitos realistas, com gatilho, rotina mínima, recompensa, ambiente e plano de retomada.

### Requisitos

**RF-HAB-001 — Criação por linguagem natural**  
Usuário descreve hábito desejado.

**RF-HAB-002 — Plano de hábito**  
IA retorna identidade associada, motivo, gatilho, rotina mínima, versão ideal, recompensa, obstáculo, plano se/então, ambiente, frequência e métrica.

**RF-HAB-003 — Integração com calendário**  
Hábito pode ser agendado.

**RF-HAB-004 — Integração com Placar**  
Hábito pode ser acompanhado no Placar.

**RF-HAB-005 — Retomada**  
Falha no hábito deve gerar plano de recomeço, não culpa.

**RF-HAB-006 — Hábito mínimo**  
Todo hábito deve ter versão mínima aceitável.

### Critérios de aceite

1. Usuário cria hábito com plano completo.
2. Hábito aparece no calendário e no Placar.
3. Falha gera sugestão de retomada.

---

## 11.13 PLACAR DA DISCIPLINA

### Objetivo

Acompanhar comportamentos-chave, hábitos, tarefas e retomadas de forma visual, leve e motivadora.

### Requisitos

**RF-PLACAR-001 — Criação por IA**  
IA sugere placar com base em alvos, hábitos e projetos.

**RF-PLACAR-002 — Marcação rápida**  
Usuário deve marcar itens pelo desktop ou mobile.

**RF-PLACAR-003 — Baixo atrito**  
Marcação deve exigir o mínimo de passos.

**RF-PLACAR-004 — Retomadas**  
Placar deve medir também retomadas após falha.

**RF-PLACAR-005 — Sem vergonha**  
Design não deve punir visualmente falhas de forma agressiva.

**RF-PLACAR-006 — Integração com Atalaia**  
Usuário pode permitir que Atalaia veja progresso limitado de um alvo.

### Critérios de aceite

1. Placar é gerado automaticamente e editável.
2. Usuário marca comportamento em poucos segundos.
3. Sistema mostra padrões sem humilhar.
4. Retomadas são valorizadas.

---

## 11.14 ATALAIA

### Objetivo

Permitir que o usuário escolha uma pessoa para acompanhar um alvo específico, aumentando responsabilidade e apoio, com privacidade granular.

### Requisitos

**RF-ATALAIA-001 — Escolha por alvo**  
Atalaia deve ser vinculado a um alvo específico, não à conta inteira.

**RF-ATALAIA-002 — Convite por e-mail**  
Sistema deve enviar convite ao Atalaia.

**RF-ATALAIA-003 — Consentimento granular**  
Usuário escolhe exatamente o que o Atalaia pode ver.

**RF-ATALAIA-004 — Acesso limitado**  
Atalaia vê apenas status, progresso, marcos e pedidos de ajuda autorizados.

**RF-ATALAIA-005 — Revogação**  
Usuário pode revogar acesso a qualquer momento.

**RF-ATALAIA-006 — Notificações**  
Atalaia pode receber e-mails quando houver avanço, atraso, pedido de ajuda ou conclusão, conforme autorização.

**RF-ATALAIA-007 — Exclusões padrão**  
Atalaia não vê Chamado completo, Metacognição, saúde, família, finanças, emoções, revisões privadas ou dados sensíveis sem autorização explícita.

### Critérios de aceite

1. Usuário convida Atalaia para um alvo.
2. Atalaia acessa somente o permitido.
3. Usuário revoga acesso.
4. Dados privados permanecem protegidos.

---

## 11.15 DOCUMENTO DE COMPROMISSO

### Objetivo

Gerar documento visual simples que consolide um alvo importante, compromisso, prazo, hábitos de suporte e Atalaia.

### Requisitos

**RF-COMP-001 — Geração automática**  
Sistema gera documento a partir do alvo.

**RF-COMP-002 — Conteúdo mínimo**  
Documento deve conter usuário, alvo, relação com Chamado, prazo, projetos, hábitos, Placar, Atalaia, recompensa, consequência saudável e primeira ação.

**RF-COMP-003 — Compartilhamento**  
Usuário pode salvar ou compartilhar com Atalaia.

### Critérios de aceite

1. Documento é gerado a partir de dados existentes.
2. Usuário pode revisar antes de compartilhar.
3. Compartilhamento respeita consentimento.

---

## 11.16 ALAVANCAS DE COMPROMISSO

### Objetivo

Usar recompensas e consequências saudáveis para fortalecer compromisso sem vergonha ou punição destrutiva.

### Requisitos

**RF-ALAV-001 — Recompensa por avanço**  
Usuário pode definir recompensa saudável por marco.

**RF-ALAV-002 — Recompensa por conclusão**  
Usuário pode definir celebração final.

**RF-ALAV-003 — Reparação por abandono**  
Consequência deve ser restaurativa, não humilhante.

**RF-ALAV-004 — Validação por IA**  
IA deve alertar se recompensa sabota o alvo ou se consequência é inadequada.

### Critérios de aceite

1. Usuário define alavancas para alvo.
2. IA bloqueia ou alerta sobre escolhas nocivas.
3. Linguagem usa celebração e reparação.

---

## 11.17 JARDIM DA VIDA

### Objetivo

Representar o progresso do usuário de forma visual, dopaminérgica, simbólica e não punitiva.

### Requisitos

**RF-JARDIM-001 — Áreas representadas**  
Cada área do Mapa da Vida deve ter representação visual.

**RF-JARDIM-002 — Crescimento por progresso**  
Ações, hábitos, foco e revisões devem gerar crescimento visual.

**RF-JARDIM-003 — Negligência sem punição**  
Área negligenciada deve indicar necessidade de cuidado, não fracasso.

**RF-JARDIM-004 — Desbloqueios simples**  
V1 deve conter desbloqueios visuais simples.

**RF-JARDIM-005 — Ligação com revisão**  
Revisão semanal deve mostrar evolução do Jardim.

### Critérios de aceite

1. Usuário vê progresso visual.
2. Visual motiva sem constranger.
3. Áreas negligenciadas geram convite ao cuidado.

---

## 11.18 REVISÃO SEMANAL

### Objetivo

Fechar o ciclo semanal, identificar padrões, ajustar rota e planejar a próxima semana.

### Requisitos

**RF-REV-001 — Perguntas semanais**  
Sistema pergunta o que avançou, travou, aprendeu, quais alvos caminharam, quais hábitos foram mantidos e quais áreas foram negligenciadas.

**RF-REV-002 — Síntese por IA**  
IA gera resumo da semana.

**RF-REV-003 — Padrões**  
IA identifica padrões de tarefas, hábitos, Metacognição, foco e sobrecarga.

**RF-REV-004 — Ajustes**  
IA sugere ajustes para a próxima semana.

**RF-REV-005 — Planejamento**  
IA sugere foco da próxima semana e ações prioritárias.

**RF-REV-006 — Tom sem culpa**  
Revisão deve reforçar aprendizado e retomada.

### Critérios de aceite

1. Usuário conclui revisão em tempo razoável.
2. IA gera diagnóstico útil.
3. Próxima semana recebe foco claro.
4. Falhas viram aprendizado e ajuste.

---

## 11.19 DASHBOARD PRINCIPAL

### Objetivo

Dar ao usuário clareza imediata sobre direção, semana, hoje e próximo passo.

### Estrutura recomendada

1. **Agora:** próxima ação, botão foco, Desbloqueador, Metacognição.
2. **Hoje:** tarefas, compromissos, hábitos e energia.
3. **Semana:** foco semanal, alvos, projetos, Placar e revisão.
4. **Direção:** Chamado resumido e Mapa da Vida.
5. **Progresso:** Jardim da Vida e marcos.

### Requisitos

**RF-DASH-001 — Próximo passo destacado**  
Dashboard deve sempre destacar a próxima ação recomendada.

**RF-DASH-002 — Camadas**  
Não mostrar tudo ao mesmo tempo; organizar em Agora, Hoje e Semana.

**RF-DASH-003 — Acesso aos módulos centrais**  
Dashboard deve dar acesso rápido a Desbloqueador, Metacognição, Calendário, Placar e Revisão.

**RF-DASH-004 — Alertas inteligentes**  
Mostrar sobrecarga, tarefa travada, hábito em risco e revisão pendente.

### Critérios de aceite

1. Usuário entende o que fazer em poucos segundos.
2. Dashboard não parece poluído.
3. Próxima ação é sempre evidente.

---

## 11.20 APP MOBILE COMPLEMENTAR / PWA

### Objetivo

Permitir ações rápidas fora do desktop, sem tentar replicar a plataforma inteira.

### Requisitos

**RF-MOB-001 — Captura rápida**  
Abrir, tocar, registrar e fechar.

**RF-MOB-002 — Marcar hábitos**  
Usuário marca hábitos em poucos toques.

**RF-MOB-003 — Marcar Placar**  
Usuário marca Placar rapidamente.

**RF-MOB-004 — Foco curto**  
Usuário inicia foco de 5 ou 15 minutos.

**RF-MOB-005 — Desbloqueador rápido**  
Usuário pede próximo passo.

**RF-MOB-006 — Metacognição rápida**  
Usuário registra sentimento/pensamento e recebe desmonte breve com próxima ação.

**RF-MOB-007 — Check-in de energia**  
Usuário registra energia atual.

### Critérios de aceite

1. Mobile não é pesado.
2. Ações rápidas não exigem navegação profunda.
3. Dados sincronizam com desktop.

---

## 12. ARQUITETURA DE IA DO PRODUTO

## 12.1 Princípio geral

A IA deve ser uma camada operacional integrada ao produto, não um chatbot solto. Cada saída que altera dados deve ser estruturada, validada por schema e revisável pelo usuário.

## 12.2 Agentes internos do produto

### 1. Copiloto de Jornada

Conduz o usuário pela plataforma, explica etapas e mantém coerência da experiência.

### 2. Agente do Chamado Pessoal

Conduz a sessão de descoberta, formula hipótese de Chamado e sugere refinamentos.

### 3. Agente do Mapa da Vida

Interpreta notas, respostas e desequilíbrios.

### 4. Agente de Alvos SMART-E

Transforma desejos vagos em alvos concretos, mensuráveis e ecológicos.

### 5. Agente Planejador

Converte alvos em projetos, tarefas, microtarefas e blocos de agenda.

### 6. Agente Classificador de Inbox

Classifica capturas e sugere destino.

### 7. Agente Desbloqueador de Ação

Gera próximo passo imediato, foco recomendado e plano mínimo.

### 8. Agente de Metacognição

Examina pensamento/sentimento, desarticula narrativas frágeis e conduz retomada.

### 9. Agente de Hábitos

Cria planos de hábitos com gatilho, rotina mínima, recompensa e plano se/então.

### 10. Agente Revisor Semanal

Identifica padrões, sobrecarga, desalinhamentos e ajustes.

### 11. Agente Atalaia

Gera mensagens limitadas e consentidas para acompanhamento externo.

### 12. Agente Guardrail/Revisor

Valida segurança, privacidade, tom, risco emocional, culpa espiritual e schema.

## 12.3 Saídas estruturadas obrigatórias

Devem usar estrutura rígida:

1. Chamado Pessoal.
2. Leitura do Mapa da Vida.
3. Alvo SMART-E.
4. Projeto.
5. Tarefa/microtarefa.
6. Classificação de inbox.
7. Plano do Desbloqueador.
8. Sessão de Metacognição.
9. Plano de hábito.
10. Placar.
11. Revisão semanal.
12. Mensagem ao Atalaia.
13. Alertas de sobrecarga.

## 12.4 Base de conhecimento

O produto deve possuir uma base própria com materiais sobre:

1. Chamado e propósito.
2. Desígnio, incômodo central, dons e serviço.
3. Victor Frankl e sentido.
4. Mordomia do tempo.
5. Domínio próprio.
6. Descanso e limites.
7. Hábitos.
8. TDAH-first e autorregulação.
9. Neurociência aplicada à atenção e execução.
10. TCC aplicada a pensamentos automáticos e reestruturação cognitiva.
11. Metacognição.
12. Produtividade, foco e planejamento semanal.
13. Linguagem pastoral segura.

## 12.5 Guardrails da IA

A IA deve:

1. Não diagnosticar.
2. Não substituir profissionais.
3. Não afirmar vontade divina específica.
4. Não usar culpa espiritual.
5. Não humilhar.
6. Não sugerir punições nocivas.
7. Não compartilhar dados privados sem consentimento.
8. Não tratar crise grave como simples produtividade.
9. Encaminhar para ajuda humana quando necessário.
10. Priorizar privacidade, segurança e responsabilidade.

---

## 13. REQUISITOS NÃO FUNCIONAIS

## 13.1 Segurança

1. Autenticação segura.
2. Row Level Security em todas as tabelas expostas.
3. Políticas por usuário e por escopo.
4. Separação clara entre dados privados e dados compartilháveis com Atalaia.
5. Storage privado.
6. Logs sem conteúdo sensível desnecessário.
7. Auditoria de consentimentos.
8. Controle de acesso por alvo para Atalaia.
9. Proteção contra vazamento de prompts e materiais internos.
10. Validação server-side para ações sensíveis.

## 13.2 Privacidade

1. Metacognição privada por padrão.
2. Chamado privado por padrão.
3. Saúde, fé, família, finanças e emoções tratados como dados sensíveis.
4. Exportação de dados pelo usuário.
5. Exclusão de conta e dados.
6. Consentimento versionado.
7. Política clara de uso de IA.

## 13.3 Performance

1. Dashboard deve carregar rapidamente.
2. Ações principais devem exigir poucos cliques.
3. Mobile deve ser leve.
4. Chamadas de IA devem ter estados de carregamento claros.
5. Fluxos críticos devem funcionar mesmo se IA falhar, com fallback manual.

## 13.4 Confiabilidade

1. Dados não podem ser perdidos em sessões longas.
2. Sessão de Chamado deve salvar progresso.
3. Revisão semanal deve salvar rascunho.
4. Capturas offline ou instáveis devem sincronizar quando possível.

## 13.5 Acessibilidade

1. Contraste adequado.
2. Navegação por teclado nos fluxos principais.
3. Textos legíveis.
4. Evitar excesso de animações.
5. Modo de baixa estimulação visual.

## 13.6 Observabilidade

1. Métricas de uso por módulo.
2. Erros de IA.
3. Latência de respostas.
4. Taxa de conclusão de fluxos.
5. Falhas de classificação.
6. Eventos de consentimento.

---

## 14. MODELO DE DADOS CONCEITUAL

## Entidades principais

### User

- id
- name
- email
- created_at
- timezone
- faith_mode
- ai_tone_preference
- onboarding_status

### UserProfile

- user_id
- occupation
- routine_summary
- focus_challenges
- energy_pattern
- responsibilities
- family_context
- faith_context
- support_preference

### LifeArea

- id
- user_id
- name
- current_score
- color
- icon

### LifeMapAssessment

- id
- user_id
- date
- area_scores
- answers
- ai_summary

### Calling

- id
- user_id
- status
- statement
- hypothesis
- values
- burdens
- gifts
- people_to_serve
- contribution
- created_at
- updated_at

### Goal

- id
- user_id
- calling_id
- life_area_id
- title
- smart_specific
- smart_measurable
- smart_achievable
- smart_relevant
- smart_timebound
- ecological_analysis
- status
- deadline

### Project

- id
- user_id
- goal_id
- title
- description
- phase
- status
- risks
- resources

### Task

- id
- user_id
- project_id
- goal_id
- title
- description
- type
- status
- energy_level
- estimated_minutes
- due_date
- scheduled_start
- scheduled_end
- next_action

### Microtask

- id
- task_id
- title
- order
- status

### CalendarBlock

- id
- user_id
- task_id
- habit_id
- type
- start_time
- end_time
- status

### InboxItem

- id
- user_id
- content
- content_type
- ai_classification
- status
- destination_type
- destination_id

### FocusSession

- id
- user_id
- task_id
- duration_minutes
- started_at
- ended_at
- status
- distractions_captured

### Habit

- id
- user_id
- goal_id
- title
- identity
- trigger
- minimum_version
- ideal_version
- reward
- frequency
- metric
- status

### HabitLog

- id
- habit_id
- date
- status
- notes

### DisciplineScoreboard

- id
- user_id
- title
- period
- items
- visibility

### ScoreboardEntry

- id
- scoreboard_id
- date
- item_id
- value
- note

### MetacognitionSession

- id
- user_id
- related_task_id
- related_goal_id
- related_project_id
- emotional_state
- intensity
- raw_thought
- fact
- interpretation
- feeling
- impulse
- cognitive_patterns
- ai_reframe
- confrontation_question
- next_action
- privacy_level
- created_at

### ActionUnblockSession

- id
- user_id
- task_id
- state
- energy
- time_available
- obstacle
- ai_plan
- started_focus

### WeeklyReview

- id
- user_id
- week_start
- week_end
- answers
- ai_summary
- patterns
- next_week_focus

### AccountabilityPartner

- id
- user_id
- name
- email
- status

### AccountabilityGrant

- id
- user_id
- accountability_partner_id
- goal_id
- permissions
- revoked_at

### CommitmentDocument

- id
- user_id
- goal_id
- content
- shared_with_atalaias

### GardenState

- id
- user_id
- area_states
- unlocked_items
- updated_at

### ConsentRecord

- id
- user_id
- consent_type
- version
- accepted_at
- revoked_at

---

## 15. MÉTRICAS DE SUCESSO

## 15.1 North Star Metric

**Semanas com pelo menos 3 ações concluídas alinhadas a um alvo vinculado ao Chamado.**

## 15.2 Métricas de ativação

1. Cadastro concluído.
2. Perfil essencial concluído.
3. Mapa da Vida concluído.
4. Hipótese de Chamado criada.
5. Primeiro alvo SMART-E criado.
6. Primeiro projeto gerado.
7. Primeira tarefa agendada.
8. Primeiro uso do Desbloqueador.
9. Primeira sessão de Metacognição concluída.
10. Primeira revisão semanal concluída.

## 15.3 Métricas de retenção

1. Usuários que retornam semanalmente.
2. Revisões semanais concluídas.
3. Sessões de foco realizadas.
4. Hábitos marcados.
5. Placar preenchido.
6. Retomadas após falha.
7. Metacognições que viram ação.
8. Tarefas reagendadas conscientemente.
9. Uso de mobile para captura.

## 15.4 Métricas qualitativas

1. “Isso me ajudou a agir hoje.”
2. “Eu sei qual é meu próximo passo.”
3. “Eu entendi melhor por que estava travado.”
4. “A plataforma me ajudou a retomar sem culpa.”
5. “Minha semana ficou mais clara.”

## 15.5 Métricas de segurança

1. Zero vazamento de dados entre usuários.
2. Zero compartilhamento indevido com Atalaia.
3. Percentual de tabelas com RLS habilitado.
4. Número de respostas bloqueadas por guardrail.
5. Taxa de respostas de IA que seguem schema.

---

## 16. UX/UI — DIRETRIZES

## 16.1 Direção visual

O produto deve fugir do padrão frio de apps de tarefa. Deve parecer um ambiente de construção de vida, com elementos visuais vivos, simbólicos e organizados.

## 16.2 Regras TDAH-first

1. Uma próxima ação por vez.
2. Poucas opções por tela.
3. Botões grandes.
4. Feedback imediato.
5. Microtarefas visíveis.
6. Estados emocionais reconhecidos.
7. Retomada fácil.
8. Modo baixa energia.
9. Modo recomeço.
10. Visual dopaminérgico sem poluição.
11. Textos curtos por padrão.
12. Profundidade progressiva.

## 16.3 Padrões de tela

### Dashboard

Foco em Agora, Hoje e Semana.

### Calendário

Centro operacional desktop.

### Chamado

Experiência de sessão guiada, quase como entrevista reflexiva.

### Metacognição

Ambiente calmo, com blocos: sentir, pensar, separar, confrontar, reformular, agir.

### Desbloqueador

Tela mínima, resposta curta e botão de ação.

### Jardim

Visual simbólico, recompensador e não punitivo.

---

## 17. CAMADA CRISTÃ

## 17.1 Objetivo

Integrar princípios cristãos à vida prática do usuário, sem transformar produtividade em peso espiritual.

## 17.2 Conceitos

1. Chamado.
2. Mordomia do tempo.
3. Domínio próprio.
4. Sabedoria.
5. Descanso.
6. Família.
7. Serviço.
8. Frutificação.
9. Gratidão.
10. Exame pessoal.
11. Arrependimento como retorno prático.
12. Graça como base para recomeço.

## 17.3 Regras de linguagem

A IA deve dizer:

1. “À luz do que você compartilhou...”
2. “Isso pode indicar uma direção a discernir...”
3. “Considere levar isso em oração e sabedoria...”
4. “O próximo passo fiel agora pode ser pequeno.”

A IA não deve dizer:

1. “Deus mandou você...”
2. “Se você não fizer, está em desobediência.”
3. “Sua falta de produtividade é falta de fé.”
4. “Você decepcionou Deus por falhar nessa tarefa.”

---

## 18. FUNDAMENTAÇÃO CIENTÍFICA E PSICOLÓGICA

## 18.1 Princípios aplicados

1. Capturar pensamentos reduz carga mental.
2. Quebrar tarefas reduz barreira de início.
3. Feedback visual reforça comportamento.
4. Recompensas imediatas aumentam aderência.
5. Revisão semanal melhora autorregulação.
6. Hábitos dependem de gatilho, repetição e contexto.
7. Planejamento visual melhora percepção de tempo.
8. Metacognição ajuda a observar pensamentos em vez de obedecê-los automaticamente.
9. Reestruturação cognitiva ajuda a avaliar pensamentos, evidências e interpretações.
10. Microações reduzem paralisia e criam ativação comportamental.

## 18.2 Como aparecerá no produto

A fundamentação deve aparecer em cards curtos, tooltips ou seções “por que isso funciona?”, sem transformar o app em curso teórico.

---

## 19. RISCOS E MITIGAÇÕES

## 19.1 Escopo excessivo

**Risco:** tentar construir profundidade completa de todos os módulos na V1.  
**Mitigação:** V1 completa em largura, profundidade controlada, milestones e PRs pequenos.

## 19.2 IA genérica

**Risco:** IA virar chatbot solto.  
**Mitigação:** agentes especializados, outputs estruturados, base de conhecimento e guardrails.

## 19.3 Produto pesado para TDAH

**Risco:** excesso de etapas gerar abandono.  
**Mitigação:** progressão assistida, modo rápido, próxima ação clara, retomada e mobile simples.

## 19.4 Metacognição parecer terapia

**Risco:** usuário tratar o app como substituto clínico.  
**Mitigação:** limites explícitos, guardrails, linguagem de apoio/reflexão e encaminhamento quando necessário.

## 19.5 Culpa espiritual

**Risco:** camada cristã reforçar vergonha.  
**Mitigação:** política de linguagem, revisão de prompts e guardrail contra manipulação espiritual.

## 19.6 Vazamento de dados ao Atalaia

**Risco:** compartilhamento indevido de dados sensíveis.  
**Mitigação:** consentimento granular, acesso por alvo, RLS, logs e revogação.

## 19.7 Dependência de IA

**Risco:** usuário terceirizar decisões sempre para IA.  
**Mitigação:** IA deve devolver responsabilidade, perguntas e ação, não decidir tudo pelo usuário.

---

## 20. ROADMAP DE IMPLEMENTAÇÃO CONCEITUAL

## Fase 0 — Fontes de verdade

1. PRD aprovado.
2. Product Vision.
3. User Flows.
4. Domain Model.
5. AI Architecture.
6. Security/Privacy.
7. UX Guide.
8. AGENTS.md.
9. PLANS.md.

## Fase 1 — Fundação técnica

1. Stack.
2. Autenticação.
3. Banco.
4. RLS.
5. Layout base.
6. Design system inicial.
7. Infra de IA.
8. Logs e consentimentos.

## Fase 2 — Onboarding e direção

1. Perfil.
2. Mapa da Vida.
3. Chamado.
4. Dashboard inicial.

## Fase 3 — Execução

1. Alvos.
2. Projetos.
3. Tarefas.
4. Microtarefas.
5. Calendário.
6. Inbox.

## Fase 4 — Apoio à ação

1. Desbloqueador.
2. Metacognição.
3. Modo Foco.
4. Captura de distrações.

## Fase 5 — Constância

1. Hábitos.
2. Placar.
3. Revisão semanal.
4. Jardim simples.

## Fase 6 — Responsabilidade externa

1. Atalaia.
2. Documento de compromisso.
3. Alavancas de compromisso.
4. E-mails e permissões.

## Fase 7 — Mobile/PWA

1. Captura.
2. Hábito.
3. Placar.
4. Foco curto.
5. Desbloqueador.
6. Metacognição rápida.

---

## 21. CRITÉRIOS GERAIS DE PRONTO

A V1 só deve ser considerada pronta se:

1. Usuário consegue completar perfil, Mapa e Chamado.
2. Usuário consegue criar alvo SMART-E.
3. Usuário consegue gerar projeto e tarefas.
4. Usuário consegue agendar tarefas.
5. Usuário consegue iniciar foco.
6. Usuário consegue usar Desbloqueador.
7. Usuário consegue usar Metacognição.
8. Usuário consegue criar hábito.
9. Usuário consegue marcar Placar.
10. Usuário consegue fazer revisão semanal.
11. Jardim mostra progresso básico.
12. Atalaia funciona com acesso limitado.
13. Dados privados estão protegidos por RLS.
14. IA usa outputs estruturados onde necessário.
15. Guardrails estão implementados.
16. Build, lint, typecheck e testes principais passam.

---

## 22. DECISÕES DE PRODUTO JÁ FIXADAS

1. O produto é desktop-first.
2. Mobile é complementar e rápido.
3. Chamado é eixo central.
4. V1 é completa em largura.
5. IA será modular, não chatbot único.
6. Metacognição será módulo central.
7. TDAH-first é requisito de UX, não marketing.
8. Camada cristã é diferencial real, mas configurável.
9. Atalaia terá acesso limitado por alvo.
10. Dados sensíveis exigem privacidade desde o início.
11. Retomada importa tanto quanto acerto.
12. O produto deve confrontar autoengano sem humilhar.

---

## 23. PENDÊNCIAS PARA VALIDAÇÃO DO FUNDADOR

1. Nome final do produto.
2. Nome final do módulo Metacognição: “Metacognição”, “Sala de Clareza”, “Clareza Interna”, “Exame da Mente” ou outro.
3. Intensidade padrão da camada cristã.
4. Público inicial: cristãos em geral, profissionais sobrecarregados, pessoas com TDAH-like ou nicho específico.
5. Stack técnica preferida.
6. Nível inicial de gamificação do Jardim da Vida.
7. Se Atalaia entra na V1 completa ou em V1.1.
8. Se mobile será PWA inicialmente ou app nativo.
9. Política comercial: assinatura individual, plano família, plano igreja/grupo, plano mentor.
10. Materiais próprios que alimentarão a IA.

---

## 24. DEFINIÇÃO FINAL DO PRODUTO

A plataforma será um SaaS desktop-first com app/PWA mobile complementar, criado para conduzir o usuário da confusão à clareza, da intenção à execução e da paralisia à próxima ação. Seu eixo será o Chamado Pessoal, filtrando alvos, projetos, tarefas, hábitos e decisões de agenda.

A IA atuará como mentor operacional, metacognitivo e cristão: ajudará o usuário a discernir direção, estruturar objetivos, quebrar tarefas, confrontar pensamentos frágeis, retomar responsabilidade e executar com pequenos passos.

A V1 deverá entregar a experiência completa em largura: perfil, Mapa da Vida, Chamado, alvos, projetos, tarefas, calendário, inbox, Desbloqueador, Metacognição, foco, hábitos, Placar, Atalaia, compromisso, revisão e Jardim da Vida.

A promessa final do produto é: **menos caos, mais clareza; menos intenção solta, mais execução; menos culpa, mais retomada; menos pensamento automático, mais consciência; menos agenda aleatória, mais vida guiada por propósito.**

