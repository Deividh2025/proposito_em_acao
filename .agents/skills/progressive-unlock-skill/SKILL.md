---
name: progressive-unlock-skill
description: Padronizar progressao assistida, modulos liberados, modulos limitados e comunicacao ao usuario.
---

# Progressive Unlock Skill

## Quando usar

Use ao criar, revisar ou alterar bloqueios, liberacoes, limites de modulo, dashboard inicial, CTA de proxima etapa ou regras antes/depois de hipotese de Chamado.

## Regras

1. Nao use bloqueio hostil.
2. Antes da hipotese de Chamado, libere perfil, Mapa, sessao de Chamado, captura simples futura, Desbloqueador futuro e Metacognicao futura.
3. Antes da hipotese, limite alvos completos, projetos, planejamento estrategico, Atalaia, Placar completo e calendario estrategico.
4. Depois da hipotese, a proxima etapa recomendada e criar primeiro alvo alinhado ao Chamado.
5. Explique o limite como cuidado de direcao, nao como punicao.
6. Dashboard inicial deve mostrar proxima microacao em poucos segundos.
7. Nao liberar Atalaia amplo sem plano proprio de consentimento/RLS.

## Arquivos relacionados

- `src/domain/onboarding/progressive-unlock.ts`
- `src/components/dashboard/`
- `docs/PROGRESSIVE_UNLOCK.md`
- `docs/USER_FLOWS.md`
- `docs/ACCEPTANCE_CRITERIA.md`

## Saida esperada

Retorne estado liberado/limitado, mensagem ao usuario, criterios de aceite, testes e riscos de escopo.
