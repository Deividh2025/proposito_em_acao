---
name: pwa-mobile-skill
description: Use when creating or reviewing PWA, manifest, service worker, installability, mobile shell, responsive behavior, offline limits, or mobile/PWA docs in Proposito em Acao.
---

# PWA Mobile Skill

## Quando usar

Use ao criar ou revisar manifest, icones, service worker, pagina offline, shell mobile, instalacao PWA, headers, cache, start URL ou rotas `/mobile`.

## Instrucoes praticas

1. Mobile e complementar: abrir, tocar, registrar e fechar.
2. `start_url` deve apontar para `/mobile`.
3. Cachear apenas assets estaticos, icones e pagina offline segura.
4. Nao cachear dados sensiveis, server actions, Metacognicao, Inbox, calendario, Atalaia, tokens ou notificacoes.
5. Service worker deve ser versionado, removivel e sem logs de conteudo do usuario.
6. PWA exige HTTPS em producao, manifest valido e icones suficientes.
7. Offline real com fila sensivel exige prompt proprio.

## Arquivos relacionados

- `public/manifest.json`
- `public/sw.js`
- `public/icons/`
- `src/app/mobile/`
- `src/app/offline/page.tsx`
- `docs/PWA_MOBILE_MODULE.md`

## Saida esperada

Retorne manifest, SW/cache, rotas mobile, limites offline, riscos de privacidade, testes PWA e docs atualizadas.
