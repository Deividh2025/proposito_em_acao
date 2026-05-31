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
