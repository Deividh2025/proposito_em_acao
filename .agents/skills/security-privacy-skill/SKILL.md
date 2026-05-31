---
name: security-privacy-skill
description: Use when handling secrets, environment files, Supabase RLS, OpenAI API, sensitive user data, Metacognition, Chamado, Atalaia, consent, logs, or LGPD concerns in Proposito em Acao.
---

# Security Privacy Skill

## Quando usar

Use em qualquer fluxo com secrets, dados sensiveis, IA, Supabase, Atalaia, Metacognicao, consentimento ou LGPD.

## Quando nao usar

Nao use como checklist superficial depois do codigo pronto. Use antes e durante a mudanca.

## Instrucoes praticas

1. Trate fe, saude, familia, financas, emocoes, Chamado, Metacognicao, calendario, habitos, revisoes e Atalaia como sensiveis.
2. Bloqueie secrets em Git e cliente.
3. Exija RLS em tabelas expostas quando houver Supabase.
4. Atalaia so acessa dados por alvo, consentimento granular e revogavel.
5. Logs nao devem conter conteudo intimo bruto.
6. Saidas de IA que viram dados devem usar schema e validacao.
7. Nunca exponha `service_role`, secret key, `OPENAI_API_KEY`, tokens de e-mail ou webhooks em cliente, docs, logs ou `NEXT_PUBLIC_*`.
8. Para Supabase, revisar storage privado, views com RLS/`security_invoker`, funcoes `security definer` fora de schema exposto e politicas alem de `auth.uid()` generico.
9. Para Atalaia, excluir por padrao Metacognicao, Chamado completo, saude, familia, financas, emocoes e revisoes privadas.
10. Para IA, revisar minimizacao de dados, nao armazenar prompts/respostas brutas por padrao e tratar crise emocional fora do fluxo de produtividade comum.

## Orquestracao com outras skills

- Mudanca de IA: use tambem `ai-guardrails-skill`.
- Mudanca de escopo/produto: use tambem `prd-product-skill`.
- Mudanca de documentacao: use tambem `docs-sync-skill`.

## Arquivos relacionados

- `.env.example`
- `.gitignore`
- `docs/SECURITY_NOTES.md`
- `AGENTS.md`
- futuro caminho de migrations: `supabase/migrations/`
- futura documentacao de privacidade: `docs/privacy/`

## Formato de saida esperado

Retorne riscos por severidade, arquivos lidos, linhas/trechos relevantes, mitigacao, arquivos afetados, comandos/verificacoes executadas e bloqueios antes de merge.
