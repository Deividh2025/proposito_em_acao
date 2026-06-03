# AGENTS.md

## Projeto

Projeto: Proposito em Acao.

Produto: SaaS desktop-first de vida intencional, foco, execucao, habitos, autorregulacao e produtividade assistida por IA, com PWA/mobile complementar para acoes rapidas.

Eixo do produto: Chamado Pessoal antes de agenda. O sistema parte da direcao de vida e transforma essa direcao em alvos, projetos, tarefas, habitos e calendario.

Regra central: a V1 deve ser completa em largura e controlada em profundidade. Todos os modulos principais devem existir, ainda que alguns sejam simples.

Estado operacional: V1 local ampla e pre-beta real. Prompt 17 preparou beta fechado, observabilidade, feedback e V1.1, mas beta com usuarios reais e producao aberta continuam bloqueados ate existir URL HTTPS publicada, Auth real validado, smoke externo, secrets configurados no provedor, LGPD minima, rollback aprovado e evidencia fresca de Supabase/RLS.

## Fontes de verdade

- Produto e escopo: `docs/source/prd_proposito_em_acao.md`, `docs/PRODUCT_VISION.md`, `docs/PRD.md`, `docs/MVP_SCOPE.md`, `docs/USER_FLOWS.md`.
- Dominio e banco: `docs/DOMAIN_MODEL.md`, `docs/DATABASE_SCHEMA.md`, `docs/DATABASE_SCHEMA_DRAFT.md`.
- Arquitetura e stack: `docs/STACK_DECISION.md`, `docs/ARCHITECTURE.md`, `docs/FRONTEND_ARCHITECTURE.md`, `docs/BACKEND_ARCHITECTURE.md`.
- IA: `docs/AI_ARCHITECTURE.md`, `docs/AI_AGENTS.md`, `docs/AI_SCHEMAS.md`, `docs/AI_GUARDRAILS.md`, `docs/AI_EVALS.md`, `docs/METACOGNITION_MODULE.md`.
- Seguranca e dados: `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/SECURITY_NOTES.md`, `docs/CONSENT_ACCESS_MODEL.md`.
- Supabase/RLS: `docs/SUPABASE_PLAN.md`, `docs/SUPABASE_PREVIEW_CUTOVER.md`, `docs/RLS_POLICIES.md`, `docs/RLS_ACCESS_MATRIX.md`, `supabase/README.md`.
- UX e qualidade: `docs/UX_UI_GUIDE.md`, `docs/ACCESSIBILITY.md`, `docs/TESTING_STRATEGY.md`, `docs/TESTING_SETUP.md`, `docs/ACCEPTANCE_CRITERIA.md`.
- Release e beta: `docs/RELEASE_READINESS.md`, `docs/BETA_CHECKLIST.md`, `docs/SMOKE_TEST_REPORT.md`, `docs/ROLLBACK_PLAN.md`, `docs/OPERATIONS_RUNBOOK.md`.
- Workflow: `PLANS.md`, `docs/CODEX_WORKFLOW.md`, `docs/PR_CHECKLIST.md`, `docs/DECISIONS.md`, `docs/CHANGELOG.md`.

Quando documentos divergirem, siga a regra mais restritiva, verifique o estado real do repositorio/ambiente e reporte a inconsistencia antes de agir.

## Stack real

- Next.js App Router, React, TypeScript strict e Tailwind CSS.
- Supabase para Auth, Postgres, RLS e Storage.
- OpenAI API e DeepSeek API planejados server-side; chamadas reais ficam desativadas ate aprovacao operacional.
- Zod, React Hook Form, lucide-react, Vitest, Playwright, ESLint e Prettier.
- PWA com `public/manifest.json`, `public/sw.js` e icones em `public/icons/`.
- Dockerfile preparado para preview/deploy via VPS Hostinger + Coolify.
- Plataforma decidida para beta: Hostinger VPS KVM 1 com Coolify, dominio a adquirir na Hostinger e gate obrigatorio de upgrade se a KVM 1 nao sustentar build, runtime, logs, HTTPS e rollback com estabilidade.
- O dominio exato ainda e gate manual antes de qualquer deploy publicado.
- O backend do beta usara o projeto Supabase principal somente apos cutover validado, evidencia fresca de Auth/RLS e aprovacao explicita.
- O usuario podera selecionar provider de IA em configuracoes: `automatic`, `openai` ou `deepseek`; o padrao planejado e `automatic`.
- Consentimento de IA deve ser separado, versionado e revogavel por provider. Nao deve haver fallback automatico entre providers; falha de provider deve usar fallback local seguro ou fluxo manual.
- E-mail transacional planejado: Resend com dominio verificado. Supabase Auth deve usar Resend como SMTP customizado antes de Auth real do beta.
- Analytics planejado: first-party no Supabase, opt-in desligado por padrao. Analytics, feedback beta e metadados de auditoria de IA devem ter retencao de 90 dias.

Nao alterar stack, provider, Auth, deploy, banco, CI/CD, modelo de IA ou estrategia mobile sem etapa propria e aprovacao explicita.

## Comandos principais

Use `npm.cmd` no Windows deste projeto.

- Instalar dependencias: `npm.cmd install`.
- Desenvolvimento local: `npm.cmd run dev`.
- Build: `npm.cmd run build`.
- Servir build local: `npm.cmd run start`.
- Lint: `npm.cmd run lint`.
- Typecheck: `npm.cmd run typecheck`.
- Testes unitarios/integracao/evals: `npm.cmd run test`.
- E2E local: `npm.cmd run test:e2e`.
- Smoke externo: definir `PLAYWRIGHT_BASE_URL` ou `PREVIEW_URL` e rodar `npm.cmd run test:e2e:external`.
- Gerar tipos Supabase de preview: `npm.cmd run supabase:types:preview`.
- Validar Supabase preview/Auth/RLS: `npm.cmd run supabase:validate:preview`.

`npm.cmd run test:e2e` usa `scripts/run-e2e.mjs`: faz build, sobe `next start` em `127.0.0.1:3000`, aguarda readiness, roda Playwright com `--workers=1` e encerra o servidor no Windows. Prefira esse caminho ao `webServer` do Playwright.

SQL versionado, scripts preparados ou migrations locais nao sao prova de validacao remota. So declare Supabase/Auth/RLS validado quando houver evidencia fresca do ambiente correto.

## Estrutura importante

- `src/app/`: rotas App Router e server actions.
- `src/components/`: componentes de UI, layout e modulos.
- `src/domain/`: regras de dominio, tipos e persistencia/fallbacks.
- `src/ai/`: agentes, schemas, prompts, guardrails e evals.
- `src/lib/supabase/`: clients separados para browser, server e admin server-only.
- `src/lib/openai/` e `src/lib/email/`: providers reais/mockados e barreiras server-side.
- `src/tests/unit`, `src/tests/integration`, `src/tests/e2e`: testes.
- `supabase/migrations/`: migrations versionadas.
- `scripts/`: harnesses de E2E, smoke externo e Supabase preview.
- `knowledge/`: placeholder de base de conhecimento da IA; nao e memoria do projeto e nao deve receber material real/vector store/file search sem aprovacao.
- `.agents/skills/`: skills locais do projeto; use a skill relevante quando a tarefa envolver seu dominio.

## Regras de trabalho

1. Inspecionar antes de alterar arquivos.
2. Preservar trabalho existente; nao apagar, sobrescrever ou reverter mudancas sem justificativa e aprovacao quando houver risco.
3. Planejar antes de tarefa complexa, multi-arquivo, sensivel ou que mude comportamento de produto.
4. Usar subagentes quando houver dominios independentes, risco alto, revisao especializada ou trabalho paralelizavel.
5. Trabalhar em escopos pequenos, revisaveis e alinhados ao PRD.
6. Nao criar funcionalidade fora do PRD ou da decisao aprovada.
7. Atualizar documentacao quando houver mudanca relevante de arquitetura, IA, banco, UX, seguranca, release ou escopo.
8. Reportar bloqueios, suposicoes, comandos nao executados e validacoes pendentes.
9. Nunca mascarar risco de seguranca, privacidade, IA, Supabase, Atalaia, LGPD ou escopo.
10. Fallback positivo `local-draft` so pode representar ausencia de configuracao/sessao ou modo local/dev. Falha real de Supabase, Auth, RLS, provider, e-mail, consentimento ou escrita sensivel deve retornar `ok: false` ou bloquear o fluxo.
11. Updates/deletes e escritas sensiveis devem confirmar erro e linha afetada quando o resultado altera estado real.
12. Aceite do Atalaia nunca pode ampliar escopo definido pelo dono; permissoes, alvo, consentimento e grant revisados devem permanecer imutaveis durante o aceite.

## Nunca fazer sem aprovacao explicita

- Ativar OpenAI/DeepSeek real em fluxo de produto.
- Enviar e-mail real ou notificacao externa.
- Coletar analytics/feedback real com usuarios.
- Aplicar migrations em ambiente remoto/producao.
- Alterar policies RLS, Auth, roles ou grants de Atalaia.
- Relaxar seguranca para passar teste.
- Expor ou usar `service_role` no cliente, browser, mobile, logs ou `NEXT_PUBLIC_*`.
- Publicar deploy, preview publico, beta com usuarios reais ou producao aberta.
- Mudar stack, provider, dominio, CI/CD, secrets, retencao/LGPD ou modelo comercial.
- Compartilhar Chamado, Metacognicao, Revisao Semanal, saude, familia, financas, emocoes ou dados privados com Atalaia.
- Cachear dados sensiveis no PWA/offline.

## Seguranca e privacidade

- Nunca commitar `.env`, `.env.local`, tokens, chaves, credenciais, access tokens, DB URLs com senha ou secrets.
- `.env.example` deve conter apenas placeholders.
- Dados de fe, saude, familia, financas, emocoes, Chamado, Metacognicao, Atalaia, calendario, habitos, revisoes, feedback e analytics sao sensiveis.
- Dados sensiveis sao privados por padrao, minimizados, coletados com finalidade clara e protegidos por consentimento quando aplicavel.
- Logs nao devem conter conteudo intimo, prompts privados, respostas brutas de IA, secrets ou erros tecnicos sensiveis.
- Consentimentos devem ser granulares, versionados, auditaveis e revogaveis.
- Acoes sensiveis exigem validacao server-side.

## Supabase/RLS

- Toda tabela em schema exposto deve ter Row Level Security habilitado.
- Policies devem refletir owner-only, escopo por usuario, alvo, grant e consentimento quando aplicavel.
- Atalaia acessa apenas dados autorizados por alvo, permissao granular e revogacao efetiva.
- Roles e permissoes nao devem depender de metadata editavel pelo usuario; prefira `app_metadata` ou tabelas server-managed.
- Storage e privado por padrao.
- Views expostas devem respeitar RLS; em Postgres 15+, preferir `security_invoker = true`.
- Funcoes `security definer` nao devem ficar em schema exposto.
- `SUPABASE_SERVICE_ROLE_KEY` e somente server/operador autorizado; nunca browser, mobile, logs ou docs.

## IA

- IA e camada operacional integrada, nao chatbot solto.
- Saidas de IA que viram dados devem usar schemas estruturados e validacao.
- IA nao deve diagnosticar, substituir terapia, prometer cura, afirmar vontade divina especifica, usar culpa espiritual, humilhar ou manipular.
- Fluxos com risco emocional grave devem orientar ajuda humana adequada, nao tratar crise como produtividade comum.
- Mudancas em Chamado, Metacognicao, Desbloqueador, Revisao Semanal, Atalaia, analytics ou feedback exigem revisao de guardrails.
- Prompt bruto, resposta bruta e conteudo intimo nao devem ser armazenados por padrao.

## Metacognicao e Atalaia

- Metacognicao e privada por padrao, nao e terapia nem atendimento clinico.
- Deve separar fato, interpretacao, sentimento e impulso; pode confrontar sem humilhar; termina com microacao, descanso legitimo, oracao/reflexao opcional ou encaminhamento adequado.
- Compartilhamento com Atalaia so pode ocorrer por selecao manual, previa clara e consentimento explicito.
- Atalaia e vinculado a alvo especifico, nunca a conta inteira.
- Excluir por padrao: Chamado completo, Metacognicao, saude, familia, financas, emocoes, revisoes privadas, inbox bruto e calendario completo.

## Testes e verificacao

Antes de concluir, rode verificacoes proporcionais ao risco:

- Docs-only: `git diff --check` e revisao de diff/status.
- Mudanca de codigo comum: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`.
- App Router, server actions, config, dependencia ou comportamento de build: incluir `npm.cmd run build`.
- Jornada de usuario ou UI funcional: incluir `npm.cmd run test:e2e`.
- Supabase/RLS: revisar migrations, testes estaticos e, em ambiente aprovado, `npm.cmd run supabase:validate:preview`.
- Preview/deploy: incluir smoke externo com `npm.cmd run test:e2e:external` contra URL HTTPS publicada.

Se uma verificacao nao for executada, informe o motivo e o risco residual. Nao declare sucesso externo sem evidencia fresca.

## Git, branches e PRs

- Branch principal: `main`.
- Remoto esperado: `origin` em `https://github.com/Deividh2025/proposito_em_acao.git`.
- Preferir branches pequenas com prefixo claro, normalmente `codex/`.
- Commits devem seguir Conventional Commits.
- PRs devem ser pequenos, com checklist preenchido, docs sincronizadas e revisao Codex/CodeRabbit quando disponivel.
- Antes de commit/push, revisar `git status --short --branch`, diff, secrets, arquivos ignorados e verificacoes.

## Checklist obrigatorio antes de PR ou push

- `git status --short --branch` revisado.
- Arquivos criados/alterados listados e diff entendido.
- Nenhum secret, dado sensivel ou `.env*` real no diff.
- Escopo corresponde ao PRD ou decisao aprovada.
- Documentacao sincronizada quando houve mudanca relevante.
- RLS/policies revisadas quando houver Supabase.
- Schemas, prompts e guardrails revisados quando houver IA.
- Verificacoes executadas e resultados registrados.
- Limitacoes, riscos pendentes e proximos passos declarados.
- Nenhuma acao externa pendente apresentada como concluida.

## Auditoria de bugs e seguranca

- Classificar bugs por severidade, impacto, privacidade e bloqueio de fluxo.
- Reproduzir com dados ficticios e menor fluxo possivel.
- Bugs de vazamento, RLS, Auth, Atalaia, cache sensivel, IA insegura, secrets ou deploy quebrado bloqueiam beta/producao.
- Registrar achados em `docs/BUG_TRIAGE.md`, `docs/BUG_FIX_LOG.md`, `docs/SECURITY_AUDIT_REPORT.md`, `docs/RLS_TEST_REPORT.md` ou `docs/RELEASE_READINESS.md`, conforme o caso.

## Como lidar com duvidas

Se a duvida for discoverable no repositorio, inspecione primeiro. Se for preferencia de produto, tradeoff de arquitetura, risco de privacidade ou decisao comercial, pergunte ou registre uma suposicao explicita apenas quando a decisao for segura e reversivel.
