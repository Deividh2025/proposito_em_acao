# Production Deployment - Prompt 16

Data: 2026-06-02.

## Status

Deploy produtivo aberto: bloqueado.

Preview controlado: proximo passo em Hostinger VPS KVM 1 com Coolify, desde que dominio/URL temporaria, secrets de preview, SSH, firewall, Docker/Coolify, logs, backup e aplicacao das migrations em Supabase branch/preview sejam configurados.

## Decisao tecnica

A stack atual e Next.js App Router com rotas server-side, server actions, Supabase Auth/RLS, OpenAI server-side preparada, DeepSeek server-side planejado e PWA. O deploy precisa de runtime Node.js real, build confiavel, variaveis server-side, HTTPS, logs e rollback.

Plataforma escolhida pelo fundador: Hostinger VPS KVM 1 com Coolify, com upgrade obrigatorio se a KVM 1 nao sustentar a aplicacao com estabilidade.

Justificativa:

- a VPS permite rodar Next.js server-side com controle de processo, rede, logs e Docker;
- Coolify funciona como PaaS self-hosted sobre a VPS, com deploy por Git, variaveis por app, proxy/HTTPS e rollback operacional;
- preserva portabilidade para Docker/Coolify sem depender de Vercel;
- exige mais responsabilidade operacional: updates, firewall, backups, monitoramento, recursos da VPS e resposta a incidente.

## Hostinger

Hostinger sera usada via VPS, nao como hospedagem estatica. A VPS inicial sera KVM 1 e precisa suportar Linux estavel, SSH, Docker/Coolify, Node/Next server-side, variaveis server-side, build `npm.cmd run build`, start `npm.cmd run start`, HTTPS, logs e mecanismo claro de rollback.

Hostinger estatica, PHP/shared sem runtime Node, ou plano sem server-side persistente fica inadequado para esta V1, porque o app depende de validacoes server-side, Supabase/Auth, possivel service role server-only e OpenAI server-only.

Conclusao: Hostinger VPS KVM 1 + Coolify aprovado como direcao inicial. A adequacao final ainda depende de validar recursos da VPS, Docker/Coolify saudavel, dominio/SSL, deploy de preview, logs, backup e rollback; se falhar, fazer upgrade antes de beta real.

## Coolify

Coolify deve ser tratado como camada operacional de deploy, nao como substituto para os gates de seguranca.

Requisitos minimos:

- VPS nova ou limpa, preferencialmente Ubuntu LTS/Debian estavel.
- Acesso SSH seguro.
- Docker instalado/gerenciado pelo processo oficial do Coolify.
- Firewall permitindo apenas portas necessarias.
- Projeto conectado ao GitHub privado.
- Variaveis configuradas no painel Coolify, nunca em Git.
- Dominios e HTTPS configurados antes de beta.
- Logs revisados sem dados sensiveis.
- Rollback de release validado.

Configuracao de preview preparada no repo:

- `Dockerfile` multi-stage com servidor de producao do Next.js.
- `.dockerignore` bloqueando `.env*`, `.next`, `node_modules`, logs e outputs locais.
- Health check HTTP em `/api/health`, atualmente apenas liveness; readiness real ainda precisa validar dependencias.
- Smoke externo parametrizado por `PLAYWRIGHT_BASE_URL` via `npm.cmd run test:e2e:external`.
- Guia operacional em `docs/COOLIFY_PREVIEW_SETUP.md`.

Validacao local:

- Build Next e Playwright local foram rerodados nesta auditoria em 2026-06-03 (`npm.cmd run build` e `npm.cmd run test:e2e`) e passaram.
- Docker build local ainda depende de Docker Desktop/daemon ativo e nao foi validado nesta auditoria.
- Publicacao do preview depende de acesso ao Coolify/Hostinger e URL HTTPS aprovada.
- Cutover Supabase preview em `docs/SUPABASE_PREVIEW_CUTOVER.md`, com typegen e harness Auth/RLS.

## Bloqueios de producao

- Branch preview Supabase foi criado e migrations/RLS dinamicas passaram historicamente em 2026-06-02, mas producao aberta e beta real continuam bloqueados ate rerun fresco e smoke em URL publicada.
- Auth real ainda precisa validar signup, login, confirmacao de e-mail, redirects, logout e expiracao na URL do preview.
- Politica minima LGPD de consentimento, revogacao, exportacao e exclusao ainda depende de aprovacao; retencao de analytics, feedback beta e auditoria de IA foi decidida em 90 dias, mas enforcement tecnico e pendente.
- OpenAI e DeepSeek reais devem permanecer desativados ate configurar chaves server-side, modelos, custo, rate limit, fallback local/manual, roteamento por agente, consentimento por provider e evals ampliados.
- E-mail real deve permanecer desativado ate Resend, dominio, remetente, SMTP Auth e mensagens serem aprovados.

## Passos para preview

1. Provisionar VPS Hostinger e registrar sistema operacional/recursos.
2. Instalar/configurar Coolify em servidor novo/limpo.
3. Conectar Coolify ao repositorio privado.
4. Configurar app Next.js com Dockerfile do repo, porta `3000` e health check `/api/health`.
5. Configurar variaveis de preview sem expor valores.
6. Configurar dominio temporario/preview e HTTPS.
7. Executar o roteiro de `docs/SUPABASE_PREVIEW_CUTOVER.md`.
8. Gerar tipos Supabase reais via `npm.cmd run supabase:types:preview`.
9. Rodar harness Auth/RLS via `npm.cmd run supabase:validate:preview`.
10. Configurar Auth redirects de preview.
11. Rodar gates locais e build no Coolify.
12. Rodar smoke tests de preview.
13. Registrar resultados em `docs/SMOKE_TEST_REPORT.md`.

## Variaveis

Obrigatorias no preview/producao:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_PROJECT_ID`
- `NODE_ENV`

Server-side, somente quando aprovadas:

- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_MODEL_FLASH`
- `DEEPSEEK_MODEL_PRO`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`

## IA em producao

Decisao do fundador:

- Usar OpenAI API.
- Usar DeepSeek API com modelos configuraveis por ambiente, inicialmente `deepseek-chat` e `deepseek-reasoner`.

Regra operacional:

- Chaves ficam apenas server-side no Coolify.
- Provider e modelo precisam ser escolhidos por agente/fluxo antes de ativar.
- `deepseek-chat` deve ser considerado candidato para fluxos de menor custo/latencia.
- `deepseek-reasoner` deve ser considerado candidato para fluxos de maior complexidade, apos evals.
- OpenAI permanece candidato para fluxos que exigirem melhor aderencia a structured outputs/evals.
- Nenhum provider real deve receber Metacognicao, Chamado, Atalaia ou revisoes privadas sem minimizacao, guardrail, logs seguros e aprovacao.

## Resultado Prompt 16

Nesta execucao, o deploy real nao foi realizado porque os gates externos bloqueiam producao segura. A etapa produziu documentacao operacional, habilidades locais, verificacoes locais verdes e recomendacao tecnica para preview controlado.

## Fontes oficiais consultadas

- Next.js Deploying: https://nextjs.org/docs/14/app/building-your-application/deploying
- Hostinger Node.js hosting options: https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/
- Hostinger Next.js hosting: https://www.hostinger.com/web-apps-hosting/nextjs-hosting
- Hostinger environment variables: https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/
- Coolify installation: https://coolify.io/docs/installation
- Coolify applications: https://coolify.io/docs/applications/index
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel rollback CLI: https://vercel.com/docs/cli/rollback
- Supabase Auth redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- DeepSeek API changelog: https://api-docs.deepseek.com/updates/
- DeepSeek models and pricing: https://api-docs.deepseek.com/quick_start/pricing

Disponibilidade rechecada em 2026-06-03 para Hostinger, Coolify, Supabase Auth/SMTP, Resend SMTP Supabase, OpenAI Structured Outputs e DeepSeek docs. A checagem confirma fontes oficiais acessiveis, nao configuracao operacional.
