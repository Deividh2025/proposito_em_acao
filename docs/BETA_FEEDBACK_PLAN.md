# Beta Feedback Plan

## Princípio

Feedback deve ajudar a reduzir fricção sem coletar conteúdo íntimo. No beta, campos livres são risco de privacidade e devem ser curtos, orientados por módulo e revisados.

## Estado de implementação

- Entrada in-app preparada em `src/components/feedback/`.
- Domínio de validação em `src/domain/feedback/`.
- Sem persistência produtiva.
- Sem `localStorage`, `sessionStorage`, IndexedDB ou CacheStorage.
- Link externo opcional via `NEXT_PUBLIC_BETA_FEEDBACK_URL`.

## Fluxo in-app

1. Usuário abre "Feedback beta".
2. Escolhe módulo.
3. Preenche três campos curtos: funcionou, confundiu, travou.
4. Marca clareza, utilidade e peso.
5. Opcionalmente adiciona uma frase.
6. App prepara rascunho local e alerta se houver indício sensível.

## Formulário externo

Só deve ser ativado quando o fundador aprovar:

- URL do formulário.
- Política de acesso às respostas.
- Retenção.
- Exportação/exclusão.
- Uso de dados em análise interna.
- Aviso para não inserir dados sensíveis.

## Perguntas qualitativas

- Isso me ajudou a agir hoje?
- Ficou claro qual era o próximo passo?
- A plataforma pareceu pesada?
- A Metacognição ajudou você a pensar melhor?
- O Desbloqueador ajudou você a começar?
- A camada cristã soou madura e útil?
- Você sentiu culpa ou encorajamento?
- O que travou seu uso?
- O que você usaria todos os dias?
- O que você removeria ou simplificaria?

## Triagem

Feedback deve virar:

- Bug.
- Fricção UX.
- Dúvida de onboarding.
- Risco de privacidade.
- Ideia V1.1.
- Fora de escopo.
