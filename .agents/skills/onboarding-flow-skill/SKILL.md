---
name: onboarding-flow-skill
description: Padronizar fluxos de entrada, perfil, progresso, salvamento parcial e retomada no Proposito em Acao.
---

# Onboarding Flow Skill

## Quando usar

Use ao criar, revisar ou alterar onboarding, perfil essencial, progresso de entrada, salvamento parcial, retomada ou dashboard inicial.

## Regras

1. Preserve Chamado antes de agenda.
2. Cada tela deve ter uma proxima acao clara e uma saida segura: salvar/continuar depois.
3. Perfil deve ser progressivo; campos sensiveis podem ficar em branco.
4. Nao usar bloqueio hostil. Use progressao assistida.
5. Nao guardar conteudo intimo em `localStorage`.
6. Persistencia real exige Auth/Supabase/RLS aplicados e testados.
7. Em modo sem Auth, marque como fallback local/dev e nao prometa persistencia real.
8. Atualize docs quando o fluxo mudar.

## Arquivos relacionados

- `src/app/onboarding/`
- `src/components/onboarding/`
- `src/domain/onboarding/`
- `docs/ONBOARDING_FLOW.md`
- `docs/PROGRESSIVE_UNLOCK.md`

## Saida esperada

Retorne etapas, dados coletados, salvamento, retomada, riscos de privacidade, criterios de aceite e verificacoes executadas.
