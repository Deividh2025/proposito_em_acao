# Deployment Plan

## Ambientes

- Local: desenvolvimento com `.env.local` privado.
- Preview: Hostinger VPS KVM 1 com Coolify, branch/PR e variaveis segregadas.
- Producao: dominio final, secrets de producao e observabilidade.

## Estado atual verificado em 2026-06-03

- Hostinger KVM 1 e a VPS inicial escolhida; upgrade e obrigatorio se build/runtime/HTTPS/logs/rollback nao forem estaveis.
- Dominio exato ainda nao foi definido e bloqueia deploy publicado.
- GitHub Actions basico foi preparado nesta etapa, mas releases, tags e branch protection efetiva na `main` ainda precisam de evidencia remota.
- Dockerfile existe com `HEALTHCHECK` em `/api/health`, mas imagem/container ainda nao foram validados porque dependem de Docker daemon/Coolify.
- `/api/health` e apenas liveness; `/api/ready` falha fechado fora de `local-demo` sem Supabase/Auth essencial ou URL HTTPS publicada, mas ainda precisa de smoke externo.
- Beta real depende de smoke externo contra URL HTTPS publicada.

## Estrategia local

- Node.js 20+.
- `npm install`.
- `npm run dev`.
- Supabase local ou remoto autorizado apenas no Prompt 4.

## Preview

- Usar Hostinger VPS KVM 1 com Coolify, conforme decisao atual do fundador.
- Usar projeto Supabase separado ou schema/ambiente isolado.
- Nunca reutilizar service role de producao.

## Producao

- Deploy somente depois de auth, RLS, privacidade, LGPD, logs e backups revisados.
- Variaveis sensiveis no provedor, nunca no Git.
- Checklist de rollback e incident response antes de coleta real.

## Hostinger

Hostinger sera usada via VPS com Coolify. A decisao exclui hospedagem estatica/shared para esta V1.

Plano inicial: KVM 1. Gate obrigatorio: se CPU/memoria/disco/rede nao sustentarem build, runtime Next.js, logs, HTTPS e rollback com estabilidade, fazer upgrade antes de beta real.

No Prompt 16, a avaliacao tecnica concluiu:

- Hostinger VPS pode atender se tiver recursos suficientes, SSH seguro, Docker/Coolify saudavel, Next.js server-side, Node 20+, build, start, variaveis server-side, logs, HTTPS e rollback.
- Hostinger estatica ou hospedagem sem processo Node persistente nao atende.
- Sem acesso operacional Hostinger chamavel nesta sessao, o deploy pela conta nao foi executado.

## Coolify

Coolify sera a camada de deploy na VPS:

- conectar ao GitHub privado;
- configurar app Next.js;
- guardar secrets por ambiente;
- emitir/gerenciar HTTPS via proxy configurado;
- fornecer logs e rollback operacional;
- executar preview antes de producao aberta.

## Etapa 8 - Hostinger/Coolify preview

Escopo desta etapa: documentar o caminho de preview em Hostinger VPS KVM 1 com Coolify. Nenhum recurso remoto foi configurado, nenhum secret real foi solicitado e nenhum valor real deve ser registrado em docs, Git, logs ou comentarios de PR.

Configuracao alvo do preview:

- Infraestrutura: Hostinger VPS KVM 1 nova ou limpa, com sistema Linux estavel e acesso SSH seguro.
- Orquestracao: Coolify instalado na VPS e conectado ao repositorio privado.
- Aplicacao: app Next.js por Dockerfile do repo, porta interna `3000`, comando de build/start definido pelo Dockerfile ou pelo preset Coolify equivalente.
- Ambiente: `APP_RUNTIME_MODE=preview`, `NODE_ENV=production` e variaveis de preview segregadas das variaveis locais e de producao.
- HTTPS: dominio temporario ou subdominio aprovado no Coolify antes de qualquer teste com usuario externo.
- Health: `/api/health` pode ser usado como liveness inicial; `/api/ready` deve validar Supabase/Auth essencial e `NEXT_PUBLIC_APP_URL` HTTPS publicado. Secrets, redirects e Auth real ainda exigem smoke externo.
- Logs: logs do Coolify/servidor devem ser revisados para confirmar ausencia de prompt bruto, dados intimos, tokens, URLs com token, stack traces sensiveis e secrets.
- Rollback: rollback de release no Coolify deve ser testado antes de beta real.

Gates manuais ainda pendentes nesta branch:

- Dominio temporario de preview nao foi evidenciado localmente.
- HTTPS publicado nao foi evidenciado localmente.
- Acesso operacional a Hostinger/Coolify nao foi usado nesta etapa.
- Docker build/runtime na VPS nao foi evidenciado localmente nesta etapa.
- Smoke externo contra URL HTTPS publicada nao foi executado.

Gate de upgrade: a KVM 1 e apenas o ponto inicial. Upgrade para KVM 2 e obrigatorio antes de beta real se houver instabilidade de build, falta de memoria/CPU/disco, deploy lento demais para rollback seguro, logs inacessiveis, HTTPS instavel, reinicios do processo Next.js, saturacao durante smoke externo ou impossibilidade de manter Coolify e a aplicacao com folga operacional.

## Alternativas

- Vercel: alternativa de contingencia se Coolify/VPS nao atender estabilidade, logs, SSL ou rollback.
- Render/Fly/Railway: Node server com mais controle operacional.
- Coolify/VPS: controle e custo, com maior responsabilidade de operacao.

## Variaveis por ambiente

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_MODEL_FLASH`
- `DEEPSEEK_MODEL_PRO`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`
- `NODE_ENV`

## Checklist de deploy futuro

- Build passa.
- Lint/typecheck/testes passam.
- Secrets configurados fora do Git.
- RLS revisada.
- Logs sem conteudo sensivel bruto.
- Politica de privacidade e consentimentos prontos.
- Plano de rollback documentado.
- Backups e monitoramento definidos.

## Prompt 15 - release readiness

Status local: gates de lint, typecheck, testes, build e E2E passaram apos correcoes.

Status externo: nao liberar producao ate concluir:

- aplicar todas as migrations locais em branch/preview Supabase;
- confirmar que o remoto nao esta parcialmente aplicado;
- rodar matriz RLS dinamica usuario A x usuario B x Atalaia autorizado x Atalaia revogado;
- validar `/auth` com Supabase Auth real, confirmacao de e-mail, redirects e logout;
- configurar secrets no provedor de deploy;
- aprovar LGPD, consentimentos, retencao, exportacao e exclusao;
- definir provider de e-mail ou manter notificacoes externas desativadas;
- manter IA real desativada ate modelos, custo, rate limit, guardrails, roteamento por agente e base de conhecimento serem aprovados.

## Checklist PWA futuro

- HTTPS ativo em producao.
- `public/manifest.json` valido, com `start_url` em `/mobile`.
- Service worker servido com `Cache-Control: no-store` para o arquivo `sw.js`.
- Cache versionado e rollback do service worker documentado.
- Cache restrito a assets estaticos e pagina offline; sem dados sensiveis.
- Icones finais substituem placeholders antes de producao.
- Teste de instalabilidade e offline seguro em mobile real.
- Sem push notifications ate prompt proprio.

## Prompt 16 - deploy readiness

Status local fresco em 2026-06-02:

- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 13 arquivos e 74 testes.
- `npm.cmd run build`: passou.
- `npm.cmd run test:e2e`: passou, 26 testes Playwright.

Status externo:

- Supabase `bceumcfmjftoukzrfthe` consultado como `ACTIVE_HEALTHY`.
- Migrations remotas listadas: apenas `20260602134002 mobile_pwa_prompt14_alignment`.
- Tabelas publicas remotas visiveis nao cobrem a V1 completa.

Decisao atualizada pelo fundador:

- Producao aberta bloqueada.
- Primeiro passo recomendado e escolhido: preview controlado em VPS Hostinger com Coolify.
- OpenAI API e DeepSeek API serao providers reais planejados, com DeepSeek configuravel por ambiente (`deepseek-chat` e `deepseek-reasoner` como placeholders atuais).
- Documentos operacionais criados: `PRODUCTION_DEPLOYMENT.md`, `PRODUCTION_ENVIRONMENT.md`, `SMOKE_TEST_REPORT.md`, `ROLLBACK_PLAN.md`, `OPERATIONS_RUNBOOK.md` e `BETA_CHECKLIST.md`.
