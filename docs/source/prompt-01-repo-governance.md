# PROMPT 1 — PREPARAÇÃO DO REPOSITÓRIO, GOVERNANÇA, GITHUB, AGENTS.MD E SKILLS INICIAIS

Você atuará como engenheiro-chefe do projeto **Propósito em Ação**.

Este é o primeiro passo de implementação. **Não implemente ainda as funcionalidades do SaaS.** Nesta etapa, sua missão é preparar o ambiente, organizar o repositório, criar a governança técnica e deixar o projeto pronto para implementação incremental por PRs pequenos, com documentação, subagentes, skills e critérios de validação.

## 1. CONTEXTO DO PRODUTO

O produto se chama **Propósito em Ação**.

É um SaaS desktop-first de vida intencional, foco, execução, hábitos, autorregulação e produtividade assistida por IA, com app/PWA mobile complementar.

A plataforma terá como eixo central o **Chamado Pessoal**, conduzindo o usuário pela jornada:

perfil → Mapa da Vida → Chamado Pessoal → alvos SMART-E → projetos → tarefas/microtarefas → calendário → foco → hábitos → Placar da Disciplina → Atalaia → revisão semanal → Jardim da Vida.

Além disso, a plataforma terá a funcionalidade **Metacognição**, em que o usuário informa sentimentos, pensamentos ou dificuldades, como angústia, ansiedade, paralisia diante de tarefas, vitimização, ruminação, culpa ou procrastinação. A IA deverá ajudar a separar fato, interpretação, sentimento e impulso, desmontar pensamentos frágeis, confrontar autoengano com respeito e devolver o usuário a uma próxima ação concreta.

A personalidade da IA do produto será de **mentor com elevado conhecimento em neurociência, TCC e aconselhamento cristão**, usando linguagem amigável, encorajadora e confrontadora, sem humilhação, moralismo, diagnóstico clínico ou manipulação espiritual.

A V1 deverá ser **completa em largura e controlada em profundidade**. Ou seja: todos os módulos principais deverão existir desde a primeira versão, ainda que alguns nasçam simples.

## 2. CONTEXTO DO AMBIENTE

Tenho apenas uma pasta local no computador.

Tenho conta no GitHub, mas ainda não criei repositório do projeto.

Tenho conta no Supabase, mas ainda não criei o projeto Supabase.

Você tem acesso ao GitHub, Supabase e aos aplicativos disponíveis no ambiente, incluindo, conforme disponíveis: OpenAI Developers, Supabase, Hostinger, CodeRabbit, GitHub, Superpowers, Computador, Chrome, Navegador e Build Web Apps.

Nesta etapa, priorize Git/GitHub, estrutura local, documentação e governança. **Não crie ainda o projeto Supabase, salvo se for necessário apenas verificar acesso ou preparar instruções.** A criação/configuração profunda do Supabase será feita em prompt próprio.

## 3. OBJETIVO DESTA ETAPA

Preparar o projeto para trabalho sério com Codex.

Você deverá:

1. Inspecionar a pasta local atual.
2. Verificar se já existe Git iniciado.
3. Verificar arquivos existentes e preservar tudo.
4. Criar ou orientar a criação do repositório GitHub.
5. Definir estrutura inicial de pastas.
6. Criar documentação mínima inicial.
7. Criar `AGENTS.md` robusto para orientar todos os trabalhos futuros.
8. Criar `PLANS.md` com o modelo de execução por etapas.
9. Criar `.agents/skills` com skills iniciais do projeto.
10. Criar checklists de PR, segurança, testes e revisão.
11. Preparar o repositório para implementação por branches e PRs pequenos.
12. Não implementar funcionalidades de produto nesta etapa.

## 4. MODO DE TRABALHO OBRIGATÓRIO

Antes de alterar arquivos, faça uma inspeção.

Execute, se disponível:

- listar diretório atual;
- verificar `git status`;
- verificar se existe `package.json`, `README.md`, `.gitignore`, `.env`, `src`, `app`, `pages`, `supabase`, `docs`, `.agents` ou outros arquivos relevantes;
- identificar se a pasta está vazia ou se já contém material;
- informar riscos antes de sobrescrever qualquer coisa.

Se houver arquivos existentes, **não apague e não sobrescreva sem justificativa clara**.

Se alguma ação depender de autenticação, permissão ou confirmação externa, explique exatamente o que precisa ser feito e continue com o que for possível localmente.

## 5. USO OBRIGATÓRIO DE SUBAGENTES

Crie e use subagentes explicitamente nesta etapa.

Você deve dividir o trabalho entre os seguintes subagentes:

### Subagente 1 — Arquiteto de Repositório

Responsável por:
- inspecionar a pasta local;
- propor a estrutura inicial do repo;
- definir diretórios principais;
- verificar riscos de organização;
- sugerir padrão de branches e PRs.

Retorno esperado:
- estado atual da pasta;
- proposta de estrutura;
- riscos;
- ações recomendadas.

### Subagente 2 — Especialista GitHub/DevOps

Responsável por:
- verificar status do Git;
- preparar `.gitignore`;
- preparar fluxo GitHub;
- sugerir branch principal;
- sugerir nomes de branches;
- orientar criação/conexão do repo remoto;
- preparar checklist de PR.

Retorno esperado:
- status Git;
- passos de GitHub;
- arquivos a criar;
- comandos recomendados;
- checklist de PR.

### Subagente 3 — Especialista em Governança Codex/AGENTS.md

Responsável por:
- criar `AGENTS.md`;
- definir regras de trabalho do Codex;
- definir “definition of done”;
- definir comandos obrigatórios futuros;
- definir limites: não alterar escopo sem aprovação, não codar sem plano, não mexer em dados sensíveis sem RLS.

Retorno esperado:
- conteúdo completo do `AGENTS.md`;
- justificativa breve das principais regras.

### Subagente 4 — Especialista em Skills do Projeto

Responsável por:
- criar estrutura `.agents/skills`;
- criar skills iniciais em arquivos `SKILL.md`;
- definir quando cada skill deve ser usada;
- não criar skills genéricas demais.

Retorno esperado:
- lista de skills criadas;
- descrição de cada skill;
- quando deve ser invocada.

### Subagente 5 — Documentação Técnica

Responsável por:
- criar `README.md`;
- criar `docs/PROJECT_OVERVIEW.md`;
- criar `docs/ROADMAP_EXECUTION.md`;
- criar `docs/PR_CHECKLIST.md`;
- criar `docs/CHANGELOG.md`;
- criar `docs/DECISIONS.md`.

Retorno esperado:
- arquivos criados;
- resumo do conteúdo;
- pendências.

### Subagente 6 — Segurança e Privacidade Inicial

Responsável por:
- criar checklist inicial de segurança;
- orientar uso de `.env.example`;
- impedir commit de chaves;
- preparar regras para dados sensíveis;
- preparar nota sobre Supabase/RLS, OpenAI API, Atalaia, Metacognição e LGPD para etapas futuras.

Retorno esperado:
- riscos iniciais;
- arquivos de segurança criados;
- regras para secrets;
- recomendações para próximas etapas.

Aguarde todos os subagentes terminarem e, depois, apresente uma síntese consolidada.

## 6. SKILLS QUE DEVEM SER USADAS OU CRIADAS NESTA ETAPA

Crie a pasta:

`.agents/skills`

Dentro dela, crie skills iniciais. Cada skill deve ter seu próprio diretório e um `SKILL.md`.

Crie pelo menos as seguintes skills:

### 6.1 `repo-bootstrap-skill`

Finalidade:
Preparar repositório, estrutura inicial, Git, `.gitignore`, README e governança mínima.

### 6.2 `github-workflow-skill`

Finalidade:
Padronizar branches, PRs, commits, checklist de revisão, integração com CodeRabbit/Codex Review e fluxo de aprovação.

### 6.3 `agents-md-skill`

Finalidade:
Manter e revisar o `AGENTS.md` sempre que o projeto evoluir.

### 6.4 `docs-sync-skill`

Finalidade:
Garantir que mudanças de arquitetura, escopo, banco, IA, UX ou segurança atualizem a documentação correspondente.

### 6.5 `execution-plan-skill`

Finalidade:
Obrigar qualquer etapa complexa a gerar plano antes de implementar.

### 6.6 `security-privacy-skill`

Finalidade:
Revisar riscos de dados sensíveis, `.env`, secrets, Supabase RLS, OpenAI API, Metacognição, Atalaia e LGPD.

### 6.7 `prd-product-skill`

Finalidade:
Manter coerência com o PRD do produto **Propósito em Ação**, especialmente a V1 completa em largura.

### 6.8 `ai-guardrails-skill`

Finalidade:
Preparar regras para futuras funcionalidades de IA, especialmente Chamado, Metacognição, Desbloqueador de Ação e Atalaia.

Cada `SKILL.md` deve conter:

- frontmatter com `name` e `description`;
- quando usar;
- quando não usar;
- instruções práticas;
- arquivos relacionados;
- formato de saída esperado.

Não instale dependências externas nesta etapa, salvo se estritamente necessário e justificado.

## 7. ARQUIVOS QUE DEVEM SER CRIADOS OU ATUALIZADOS

Crie ou atualize, preservando conteúdo existente:

```txt
README.md
AGENTS.md
PLANS.md
.gitignore
.env.example
docs/PROJECT_OVERVIEW.md
docs/ROADMAP_EXECUTION.md
docs/PR_CHECKLIST.md
docs/CHANGELOG.md
docs/DECISIONS.md
docs/SECURITY_NOTES.md
docs/CODEX_WORKFLOW.md
.agents/skills/repo-bootstrap-skill/SKILL.md
.agents/skills/github-workflow-skill/SKILL.md
.agents/skills/agents-md-skill/SKILL.md
.agents/skills/docs-sync-skill/SKILL.md
.agents/skills/execution-plan-skill/SKILL.md
.agents/skills/security-privacy-skill/SKILL.md
.agents/skills/prd-product-skill/SKILL.md
.agents/skills/ai-guardrails-skill/SKILL.md

---

Se algum arquivo já existir, analise o conteúdo e atualize sem destruir informação útil.

8. CONTEÚDO MÍNIMO DO README.md

O README.md deve conter:

Nome do projeto: Propósito em Ação.
Descrição curta do produto.
Status atual: preparação inicial.
Visão resumida.
Módulos principais previstos.
Stack: “a definir na próxima etapa”.
Como o repositório será organizado.
Como contribuir via branches/PRs.
Observação de segurança: não commitar .env nem secrets.
Link interno para docs principais.

Não invente stack definitiva ainda.

9. CONTEÚDO MÍNIMO DO AGENTS.md

O AGENTS.md deve ser robusto e prático.

Ele deve conter:

Identidade do projeto.
Objetivo do produto.
Regra central: V1 completa em largura, profundidade controlada.
Regra: planejar antes de codar.
Regra: usar subagentes em tarefas complexas.
Regra: não criar funcionalidades fora do PRD sem aprovação.
Regra: toda alteração relevante deve atualizar documentação.
Regra: nunca commitar secrets.
Regra: Supabase deve usar RLS em todas as tabelas expostas.
Regra: dados de Metacognição, fé, saúde, família, finanças, emoções e Atalaia são sensíveis.
Regra: IA não deve diagnosticar, substituir terapia, afirmar vontade divina específica ou usar culpa espiritual.
Regra: Atalaia só pode acessar dados por alvo e mediante consentimento granular.
Regra: outputs de IA que virarem dados devem usar schemas estruturados.
Regra: testes, lint, typecheck e build serão obrigatórios nas etapas de implementação.
Convenções futuras de branch.
Convenções futuras de commit.
Definition of Done.
Checklist antes de concluir uma tarefa.
Como lidar com dúvidas.
Como reportar limitações.
10. CONTEÚDO MÍNIMO DO PLANS.md

O PLANS.md deve conter:

Modelo de plano antes de implementação.
Campos obrigatórios:
objetivo;
contexto;
arquivos envolvidos;
subagentes necessários;
skills necessárias;
riscos;
estratégia;
critérios de aceite;
testes;
rollback;
documentação a atualizar.
Roadmap macro:
preparação do repo;
fontes de verdade;
stack/arquitetura;
Supabase/Auth/RLS;
design system;
onboarding;
IA central;
alvos/projetos/tarefas;
calendário/inbox;
Desbloqueador/Metacognição;
foco/hábitos/Placar;
revisão/Jardim;
Atalaia/compromisso;
mobile/PWA;
QA/segurança;
deploy.
11. CONTEÚDO MÍNIMO DO .gitignore

Inclua padrões para:

Node/Next/React;
Python, se algum script futuro for usado;
ambiente local;
.env;
builds;
logs;
caches;
arquivos temporários de IDE;
Supabase local, se aplicável futuramente.
12. CONTEÚDO MÍNIMO DO .env.example

Não inclua secrets reais.

Inclua placeholders como:

# App
NEXT_PUBLIC_APP_NAME="Propósito em Ação"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# OpenAI
OPENAI_API_KEY=""

# Email
EMAIL_PROVIDER=""
EMAIL_FROM=""

# Environment
NODE_ENV="development"

Se a stack ainda não estiver definida, deixe claro que esses nomes poderão ser ajustados na etapa de arquitetura.

13. CONTEÚDO MÍNIMO DE docs/PROJECT_OVERVIEW.md

Inclua:

Visão do produto.
Público-alvo.
Jornada principal.
Módulos da V1.
Papel da IA.
Papel da Metacognição.
Papel da camada cristã.
Papel do Atalaia.
Dados sensíveis.
Premissa de desktop-first e mobile complementar.
14. CONTEÚDO MÍNIMO DE docs/CODEX_WORKFLOW.md

Inclua:

Como o Codex deve trabalhar neste projeto.
Quando usar subagentes.
Quando usar skills.
Como criar plano antes de código.
Como abrir PR.
Como pedir revisão do CodeRabbit/Codex Review.
Como atualizar documentação.
Como reportar bloqueios.
Como declarar tarefa concluída.
Como evitar alterações fora de escopo.
15. NÃO FAZER NESTA ETAPA

Não fazer:

Não implementar frontend do SaaS.
Não criar banco de dados ainda.
Não criar projeto Supabase ainda, salvo apenas verificação/orientação.
Não criar chamadas reais à OpenAI API.
Não instalar stack definitiva sem aprovação.
Não criar telas finais.
Não criar autenticação ainda.
Não commitar secrets.
Não apagar arquivos existentes.
Não fazer deploy.
Não criar prompt de produto final.
Não avançar para a Etapa 2 sem aprovação.
16. COMPORTAMENTO ESPERADO

Se você encontrar ambiguidade, faça perguntas objetivas.

Se conseguir avançar sem risco, avance.

Se alguma ferramenta não estiver disponível ou falhar, informe claramente e forneça alternativa manual.

Se precisar criar repo GitHub e houver permissão, crie com nome recomendado:

proposito-em-acao

Se não puder criar automaticamente, forneça comandos e instruções exatas para criação manual.

17. FORMATO DA RESPOSTA FINAL

Ao final, apresente:

Resumo do que foi inspecionado.
Subagentes usados e achados de cada um.
Arquivos criados/alterados.
Estrutura final de diretórios.
Status Git/GitHub.
Se o repositório remoto foi criado/conectado ou se falta ação manual.
Skills criadas.
Conteúdo resumido do AGENTS.md.
Riscos pendentes.
Próximos passos recomendados.
Confirmação objetiva de que nenhuma funcionalidade do SaaS foi implementada ainda.
Checklist para eu aprovar antes do Prompt 2.
18. CRITÉRIO DE SUCESSO DESTA ETAPA

Esta etapa será considerada concluída somente se:

O repositório estiver organizado ou houver instrução precisa para organizá-lo.
AGENTS.md existir e orientar o Codex de forma clara.
PLANS.md existir e definir o modelo de execução.
.agents/skills existir com as skills iniciais.
README.md e docs iniciais existirem.
.gitignore e .env.example existirem.
Nenhum secret tiver sido exposto.
Nenhuma funcionalidade do SaaS tiver sido implementada.
O próximo passo estiver claramente preparado: criação das fontes de verdade completas do produto.

Agora execute esta etapa com cuidado, usando os subagentes indicados, aguardando todos e consolidando o resultado final.

::contentReference[oaicite:1]{index=1}