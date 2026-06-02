---
name: mobile-low-energy-skill
description: Use when creating or reviewing mobile low-energy mode, reduced choices, energy check-ins, minimal actions, restart paths, or overload prevention in Proposito em Acao.
---

# Mobile Low Energy Skill

## Quando usar

Use em mobile/PWA quando o usuario registra energia baixa, sobrecarga, travamento, interrupcao, cansaco ou retomada.

## Instrucoes praticas

1. Energia baixa deve reduzir escopo, nao gerar vergonha.
2. Priorizar foco de 5 minutos, versao minima, descanso legitimo ou Desbloqueador.
3. Manter no maximo dois campos obrigatorios.
4. Evitar estatisticas, historico longo, alertas agressivos e linguagem moralizante.
5. Dar feedback curto e uma proxima rota clara.
6. Energia e dado sensivel; manter owner-only e sem Atalaia.

## Arquivos relacionados

- `src/domain/energy/`
- `src/app/mobile/energy/`
- `src/components/mobile/MobileEnergyCheckIn.tsx`
- `docs/MOBILE_UX_GUIDE.md`
- `docs/MOBILE_PRIVACY.md`

## Saida esperada

Retorne sugestao de ajuste, proxima rota, reducoes de UI, privacidade, testes e pendencias.
