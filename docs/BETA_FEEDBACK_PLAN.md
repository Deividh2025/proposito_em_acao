# Beta Feedback Plan

## Estado atual verificado em 2026-06-03

- Feedback in-app existe como rascunho local e alerta de sensibilidade, sem persistencia produtiva.
- Feedback externo ainda depende de URL/formulario aprovado.
- Decisao atual: feedback beta, quando coletado, tera retencao de 90 dias.
- Coleta real exige consentimento/aviso claro, acesso restrito, exportacao/exclusao e proibicao de dados sensiveis nos campos livres.

## Principio

Feedback deve ajudar a reduzir friccao sem coletar conteudo intimo. No beta, campos livres sao risco de privacidade e devem ser curtos, orientados por modulo e revisados.

## Estado de implementacao

- Entrada in-app preparada em `src/components/feedback/`.
- Dominio de validacao em `src/domain/feedback/`.
- Sem persistencia produtiva.
- Sem `localStorage`, `sessionStorage`, IndexedDB ou CacheStorage.
- Link externo opcional via `NEXT_PUBLIC_BETA_FEEDBACK_URL`.

## Fluxo in-app

1. Usuario abre "Feedback beta".
2. Escolhe modulo.
3. Preenche tres campos curtos: funcionou, confundiu, travou.
4. Marca clareza, utilidade e peso.
5. Opcionalmente adiciona uma frase.
6. App prepara rascunho local e alerta se houver indicio sensivel.

## Formulario externo

So deve ser ativado quando o fundador aprovar:

- URL do formulario.
- Politica de acesso as respostas.
- Retencao de 90 dias.
- Exportacao/exclusao.
- Uso de dados em analise interna.
- Aviso para nao inserir dados sensiveis.

## Perguntas qualitativas

- Isso me ajudou a agir hoje?
- Ficou claro qual era o proximo passo?
- A plataforma pareceu pesada?
- A Metacognicao ajudou voce a pensar melhor?
- O Desbloqueador ajudou voce a comecar?
- A camada crista soou madura e util?
- Voce sentiu culpa ou encorajamento?
- O que travou seu uso?
- O que voce usaria todos os dias?
- O que voce removeria ou simplificaria?

## Triagem

Feedback deve virar:

- Bug.
- Friccao UX.
- Duvida de onboarding.
- Risco de privacidade.
- Ideia V1.1.
- Fora de escopo.
