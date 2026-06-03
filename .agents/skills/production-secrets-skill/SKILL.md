---
name: production-secrets-skill
description: Padronizar configuracao segura de secrets e variaveis de ambiente em producao.
---

# Production Secrets Skill

## Quando usar

Use ao configurar, revisar ou documentar variaveis de producao, preview, Supabase, OpenAI, e-mail ou tokens.

## Instrucoes praticas

1. Nunca imprimir valores reais de secrets.
2. Nunca commitar `.env`, `.env.local`, tokens, service role, OpenAI key ou secrets de e-mail.
3. `NEXT_PUBLIC_*` so pode conter valores publicos necessarios ao browser.
4. `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` e secrets de e-mail ficam apenas server-side.
5. Separar variaveis por ambiente: local, preview e producao.
6. Rotacionar qualquer valor exposto e registrar incidente.

## Arquivos relacionados

- `.env.example`
- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/PRODUCTION_ENVIRONMENT.md`
- `src/lib/config/env.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/openai/client.ts`

## Saida esperada

Retorne checklist por variavel, local de configuracao, exposicao client/server, pendencias e confirmacao sem valores reais.
