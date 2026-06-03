# Feedback Triage

## Objetivo

Transformar feedback beta em decisão operacional sem virar backlog infinito.

## Categorias

- Bug.
- Fricção UX.
- Dúvida de onboarding.
- Risco de privacidade.
- Métrica/analytics.
- Ideia V1.1.
- Fora de escopo.

## Severidade

- F0: feedback indica vazamento, culpa espiritual, diagnóstico, terapia substitutiva, Atalaia amplo demais ou coleta sensível.
- F1: bloqueia fluxo central ou impede ativação.
- F2: aumenta fricção, mas tem contorno.
- F3: melhoria ou preferência.

## Processo semanal

1. Revisar feedbacks recebidos.
2. Remover/redigir conteúdo sensível antes de compartilhar internamente.
3. Agrupar por módulo e categoria.
4. Marcar impacto/esforço.
5. Converter F0/F1 em bug ou decisão de segurança.
6. Converter padrões recorrentes em V1.1.
7. Fechar feedback com resposta curta ao usuário beta quando aplicável.

## Template

```md
ID:
Modulo:
Categoria:
Severidade:
Resumo sanitizado:
Evidencia sem dado sensivel:
Impacto:
Frequencia:
Decisao:
Destino:
Responsavel:
Status:
```

## Regras de privacidade

- Não colar feedback bruto com dados íntimos em issue, changelog ou docs.
- Não pedir prints com dados pessoais.
- Não enviar feedback sensível para ferramenta externa sem consentimento.
- Em caso de conteúdo sensível acidental, tratar como incidente operacional.
