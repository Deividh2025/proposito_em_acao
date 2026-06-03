# Codex Workflow

## Como trabalhar neste projeto

1. Inspecionar o estado atual antes de alterar arquivos.
2. Preservar tudo que ja existir.
3. Criar plano antes de codigo em tarefas complexas.
4. Trabalhar por branches e PRs pequenos.
5. Atualizar documentacao junto com mudancas relevantes.
6. Reportar limitacoes, comandos nao executados e riscos pendentes.

## Quando usar subagentes

Usar subagentes quando houver trabalho em paralelo, risco alto, multiplas areas ou necessidade de revisao especializada. Exemplos: arquitetura, Supabase/RLS, seguranca, IA/guardrails, UX, documentacao e GitHub/DevOps.

## Quando usar skills

Usar skills do projeto quando a tarefa envolver:

- bootstrap de repositorio;
- GitHub e PRs;
- `AGENTS.md`;
- documentacao;
- plano de execucao;
- seguranca e privacidade;
- coerencia com PRD;
- guardrails de IA.

## Plano antes de codigo

O plano deve seguir `PLANS.md`, registrar riscos, criterios de aceite, testes, rollback e docs afetadas. Nao iniciar implementacao se o escopo estiver ambiguo em area de alto risco.

## PRs

Cada PR deve ter escopo claro, checklist preenchido, documentacao sincronizada e revisao Codex/CodeRabbit quando aplicavel.

## GitHub local-first

Estado verificado em 2026-06-03: o remoto `origin` ja aponta para `https://github.com/Deividh2025/proposito_em_acao.git`, a branch principal e `main` e o PR #1 ja foi mergeado.

Antes de producao aberta ainda faltam CI/workflows, branch protection efetiva ou governanca equivalente, releases/tags e rollback verificavel.

Use branches pequenas e publique explicitamente:

```powershell
git switch -c codex/nome-curto
git push -u origin codex/nome-curto
```

Se o trabalho estiver em branch de etapa, publicar o branch explicitamente e abrir PR para `main`:

```powershell
git branch --show-current
git push -u origin <branch-atual>
```

Se GitHub CLI estiver instalado e autenticado:

```powershell
gh repo create Deividh2025/proposito_em_acao --private --source=. --remote=origin --push
```

## Fora de escopo no bootstrap

Nao implementar funcionalidades do SaaS durante a etapa de governanca. Nao criar banco, Supabase, autenticacao, chamadas reais a OpenAI API, telas finais, prompt final de produto ou deploy sem etapa propria.

## Como reportar bloqueios

Informe:

- o que foi tentado;
- comando executado;
- erro ou limitacao;
- impacto;
- alternativa recomendada.

## Como declarar tarefa concluida

Uma tarefa so deve ser declarada concluida quando escopo, arquivos alterados, verificacoes, pendencias e proximos passos forem apresentados claramente.
