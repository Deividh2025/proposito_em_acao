---
name: distraction-capture-skill
description: Padronizar captura de distracoes durante foco e envio opcional para inbox sem quebrar a sessao.
---

# Distraction Capture Skill

## Quando usar

Use ao criar, revisar ou alterar captura de pensamento, ideia, lembrete, tarefa paralela, preocupacao, link ou nota durante Modo Foco.

## Instrucoes praticas

1. Captura deve acontecer em ate poucos segundos e devolver o usuario ao foco.
2. Campo deve ser curto, com limite de tamanho e sem classificacao obrigatoria no momento.
3. Conteudo pode ser intimo; nao logar texto bruto.
4. Roteamento para Inbox deve ser explicito ou claramente indicado.
5. Distracao fica owner-only por RLS.
6. Nada vai ao Atalaia nesta etapa.
7. Se a distracao indicar risco emocional grave, orientar rota humana adequada fora do fluxo de produtividade.

## Arquivos relacionados

- `src/components/focus/DistractionCapture.tsx`
- `src/app/focus/actions.ts`
- `src/domain/focus/persistence.ts`
- `src/domain/inbox/`
- `docs/FOCUS_MODE_MODULE.md`

## Saida esperada

Retorne tipos capturados, destino, limites de privacidade, fallback e testes.
