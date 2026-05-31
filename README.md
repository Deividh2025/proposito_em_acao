# Proposito em Acao

SaaS desktop-first de vida intencional, foco, execucao, habitos, autorregulacao e produtividade assistida por IA, com PWA/mobile complementar para acoes rapidas.

Status atual: fontes de verdade, governanca tecnica, stack Next.js e fundacao Supabase/Auth/RLS em arquivos versionados. Nenhuma tela funcional completa do SaaS foi implementada ainda.

## Visao

O produto ajuda o usuario a transformar direcao em execucao diaria, tendo o Chamado Pessoal como eixo central. A jornada prevista e:

perfil -> Mapa da Vida -> Chamado Pessoal -> alvos SMART-E -> projetos -> tarefas e microtarefas -> calendario -> foco -> habitos -> Placar da Disciplina -> Atalaia -> revisao semanal -> Jardim da Vida.

## Modulos da V1

- Perfil e autenticacao.
- Mapa da Vida.
- Chamado Pessoal.
- Alvos SMART-E.
- Projetos.
- Tarefas e microtarefas.
- Calendario de execucao.
- Inbox/GTD adaptado.
- Desbloqueador de Acao.
- Metacognicao.
- Modo Foco/Pomodoro.
- Habitos com IA.
- Placar da Disciplina.
- Atalaia.
- Documento de compromisso e alavancas.
- Revisao semanal.
- Jardim da Vida.
- Dashboard principal.
- PWA/mobile complementar.
- Camada crista configuravel.
- Seguranca, privacidade, consentimento e LGPD.

## Stack

Stack definida para a fundacao inicial:

- Next.js App Router.
- React.
- TypeScript strict.
- Tailwind CSS.
- Supabase para Auth, Postgres, RLS e Storage.
- OpenAI server-side em etapa futura, com structured outputs.
- Zod, React Hook Form, Vitest, Playwright, ESLint e Prettier.

## Organizacao do repositorio

- `AGENTS.md`: regras operacionais para Codex e agentes.
- `PLANS.md`: modelo obrigatorio para planos de execucao.
- `docs/source/`: fontes originais registradas.
- `docs/`: fontes de verdade derivadas, roadmap, seguranca, criterios e fluxo de trabalho.
- `.agents/skills/`: skills locais do projeto.
- `supabase/migrations/`: migrations versionadas de schema, RLS e storage.
- `src/lib/supabase/`: clients Supabase separados por browser, server e admin server-only.

## Fontes de verdade principais

- `docs/source/prd_proposito_em_acao.md`
- `docs/PRODUCT_VISION.md`
- `docs/PRD.md`
- `docs/MVP_SCOPE.md`
- `docs/USER_FLOWS.md`
- `docs/DOMAIN_MODEL.md`
- `docs/AI_ARCHITECTURE.md`
- `docs/METACOGNITION_MODULE.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/UX_UI_GUIDE.md`
- `docs/TESTING_STRATEGY.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/OPEN_QUESTIONS.md`

## Governanca e suporte

- `docs/ROADMAP_EXECUTION.md`
- `docs/PR_CHECKLIST.md`
- `docs/SECURITY_NOTES.md`
- `docs/DECISIONS.md`
- `docs/CHANGELOG.md`
- `docs/CODEX_WORKFLOW.md`
- `docs/DATABASE_SCHEMA_DRAFT.md`
- `docs/AI_GUARDRAILS.md`

## Contribuicao

O trabalho deve ocorrer por branches pequenas e PRs revisaveis. Cada mudanca relevante deve manter documentacao sincronizada e respeitar o PRD. Nenhum PR deve expandir escopo fora do PRD sem aprovacao explicita.

## Seguranca

Nunca commitar `.env`, chaves, tokens ou secrets. Dados de fe, saude, familia, financas, emocoes, Chamado, Metacognicao, calendario, habitos, revisoes e Atalaia sao sensiveis e privados por padrao.

## GitHub

Fluxo local primeiro. O repositorio remoto informado pelo fundador e `Deividh2025/proposito_em_acao`.

Remote local esperado:

```powershell
git remote add origin https://github.com/Deividh2025/proposito_em_acao.git
```

Push inicial, PRs e configuracoes do repositorio privado devem ocorrer em etapa propria, com autenticacao GitHub validada.
