# Deployment Plan

## Ambientes

- Local: desenvolvimento com `.env.local` privado.
- Preview: branch/PR com variaveis segregadas.
- Producao: dominio final, secrets de producao e observabilidade.

## Estrategia local

- Node.js 20+.
- `npm install`.
- `npm run dev`.
- Supabase local ou remoto autorizado apenas no Prompt 4.

## Preview

- Preferir plataforma com suporte nativo a Next.js server-side.
- Usar projeto Supabase separado ou schema/ambiente isolado.
- Nunca reutilizar service role de producao.

## Producao

- Deploy somente depois de auth, RLS, privacidade, LGPD, logs e backups revisados.
- Variaveis sensiveis no provedor, nunca no Git.
- Checklist de rollback e incident response antes de coleta real.

## Hostinger

Hostinger pode ser considerado se o plano suportar runtime Node/Next adequado, variaveis server-side, build confiavel, HTTPS, logs e estrategia de rollback. Se o plano for apenas hospedagem estatica, nao atende o backend server-side necessario para OpenAI, Supabase service role e validacoes sensiveis.

## Alternativas

- Vercel: melhor encaixe operacional para Next, mas avaliar custo e residencia/privacidade.
- Render/Fly/Railway: Node server com mais controle operacional.
- Coolify/VPS: controle e custo, com maior responsabilidade de operacao.

## Variaveis por ambiente

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
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
- manter OpenAI real desativada ate modelo, custo, guardrails e base de conhecimento serem aprovados.

## Checklist PWA futuro

- HTTPS ativo em producao.
- `public/manifest.json` valido, com `start_url` em `/mobile`.
- Service worker servido com `Cache-Control: no-store` para o arquivo `sw.js`.
- Cache versionado e rollback do service worker documentado.
- Cache restrito a assets estaticos e pagina offline; sem dados sensiveis.
- Icones finais substituem placeholders antes de producao.
- Teste de instalabilidade e offline seguro em mobile real.
- Sem push notifications ate prompt proprio.
