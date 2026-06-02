# Production Deployment - Prompt 16

Data: 2026-06-02.

## Status

Deploy produtivo aberto: bloqueado.

Preview controlado: proximo passo em VPS Hostinger com Coolify, desde que dominio/URL temporaria, secrets de preview, SSH, firewall, Docker/Coolify, logs, backup e aplicacao das migrations em Supabase branch/preview sejam configurados.

## Decisao tecnica

A stack atual e Next.js App Router com rotas server-side, server actions, Supabase Auth/RLS, OpenAI server-side preparada, DeepSeek server-side planejado e PWA. O deploy precisa de runtime Node.js real, build confiavel, variaveis server-side, HTTPS, logs e rollback.

Plataforma escolhida pelo fundador: VPS da Hostinger com Coolify.

Justificativa:

- a VPS permite rodar Next.js server-side com controle de processo, rede, logs e Docker;
- Coolify funciona como PaaS self-hosted sobre a VPS, com deploy por Git, variaveis por app, proxy/HTTPS e rollback operacional;
- preserva portabilidade para Docker/Coolify sem depender de Vercel;
- exige mais responsabilidade operacional: updates, firewall, backups, monitoramento, recursos da VPS e resposta a incidente.

## Hostinger

Hostinger sera usada via VPS, nao como hospedagem estatica. A VPS precisa suportar Linux estavel, SSH, Docker/Coolify, Node/Next server-side, variaveis server-side, build `npm run build`, start `npm run start`, HTTPS, logs e mecanismo claro de rollback.

Hostinger estatica, PHP/shared sem runtime Node, ou plano sem server-side persistente fica inadequado para esta V1, porque o app depende de validacoes server-side, Supabase/Auth, possivel service role server-only e OpenAI server-only.

Conclusao: Hostinger VPS + Coolify aprovado como direcao. A adequacao final ainda depende de validar recursos da VPS, Docker/Coolify saudavel, dominio/SSL, deploy de preview, logs, backup e rollback.

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

## Bloqueios de producao

- Supabase remoto `bceumcfmjftoukzrfthe` esta ativo, mas lista somente a migration remota `20260602134002 mobile_pwa_prompt14_alignment`.
- Tabelas publicas remotas visiveis nao cobrem a V1 completa; foi observada `public.energy_checkins` e tabelas de `storage`.
- Migrations locais Prompt 4-14 ainda precisam ser aplicadas/alinhadas em ambiente controlado.
- Matriz RLS dinamica ainda nao foi executada com usuario A, usuario B, Atalaia autorizado e Atalaia revogado.
- Auth real ainda precisa validar signup, login, confirmacao de e-mail, redirects, logout e expiracao.
- Politica minima LGPD de consentimento, retencao, exportacao e exclusao ainda depende de aprovacao.
- OpenAI e DeepSeek reais devem permanecer desativados ate configurar chaves server-side, modelos, custo, rate limit, fallback, roteamento por agente e evals ampliados.
- E-mail real deve permanecer desativado ate provider/remetente/aprovacao de mensagens.

## Passos para preview

1. Provisionar VPS Hostinger e registrar sistema operacional/recursos.
2. Instalar/configurar Coolify em servidor novo/limpo.
3. Conectar Coolify ao repositorio privado.
4. Configurar app Next.js com build `npm run build` e start `npm run start`.
5. Configurar variaveis de preview sem expor valores.
6. Configurar dominio temporario/preview e HTTPS.
7. Aplicar migrations locais em Supabase branch/preview.
8. Gerar tipos Supabase reais.
9. Configurar Auth redirects de preview.
10. Rodar gates locais e build no Coolify.
11. Rodar smoke tests de preview.
12. Registrar resultados em `docs/SMOKE_TEST_REPORT.md`.

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
- Usar DeepSeek API com os modelos `deepseek-v4-flash` e `deepseek-v4-pro`.

Regra operacional:

- Chaves ficam apenas server-side no Coolify.
- Provider e modelo precisam ser escolhidos por agente/fluxo antes de ativar.
- `deepseek-v4-flash` deve ser considerado candidato para fluxos de menor custo/latencia.
- `deepseek-v4-pro` deve ser considerado candidato para fluxos de maior complexidade, apos evals.
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
