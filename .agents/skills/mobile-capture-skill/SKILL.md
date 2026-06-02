---
name: mobile-capture-skill
description: Use when creating or reviewing quick capture, mobile Inbox entry, distraction capture, low-friction text entry, or capture privacy in Proposito em Acao.
---

# Mobile Capture Skill

## Quando usar

Use ao criar ou revisar captura rapida mobile, captura durante foco, envio para Inbox ou qualquer fluxo de entrada curta.

## Instrucoes praticas

1. Captura deve pedir uma frase e salvar sem classificacao obrigatoria.
2. Evite campos extras no primeiro toque.
3. Limite tamanho e nao coloque conteudo bruto em URL, logs, localStorage ou CacheStorage.
4. Destino inicial e Inbox owner-only.
5. Classificacao e processamento sao revisaveis depois.
6. Sem Atalaia, sem notificacao e sem OpenAI real acionada pela UI.

## Arquivos relacionados

- `src/app/mobile/capture/`
- `src/components/mobile/MobileCaptureForm.tsx`
- `src/app/inbox/actions.ts`
- `src/domain/inbox/`
- `docs/MOBILE_PRIVACY.md`

## Saida esperada

Retorne campos capturados, destino, feedback local/dev ou Supabase, riscos de privacidade, testes e docs.
