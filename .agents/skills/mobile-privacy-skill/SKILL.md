---
name: mobile-privacy-skill
description: Use when creating or reviewing mobile/PWA privacy, cache, storage, session, token handling, sensitive data, notification, or offline behavior in Proposito em Acao.
---

# Mobile Privacy Skill

## Quando usar

Use em qualquer fluxo mobile/PWA que toque dados sensiveis, cache, storage local, service worker, tokens, sessao, Metacognicao, Inbox, energia, Atalaia ou notificacoes.

## Instrucoes praticas

1. Privado por padrao e minimo necessario.
2. Nao usar localStorage, sessionStorage, IndexedDB ou CacheStorage para conteudo sensivel nesta etapa.
3. Service worker nao deve cachear rotas autenticadas ou respostas com dados do usuario.
4. Tokens de convite, signed URLs e secrets nunca entram em logs, referrer ou cache.
5. Metacognicao, Inbox bruta, calendario, Atalaia e notificacoes nao ficam offline.
6. Fallback local/dev deve ser honesto e nao prometer persistencia produtiva.
7. Push notifications ficam fora ate prompt proprio.

## Arquivos relacionados

- `public/sw.js`
- `docs/MOBILE_PRIVACY.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/RLS_POLICIES.md`

## Saida esperada

Retorne dados sensiveis envolvidos, armazenamento permitido/proibido, cache, sessao, RLS, logs, riscos e mitigacoes.
