# Beta Feedback Plan

## Estado atual verificado em 2026-06-04

- Feedback in-app existe como rascunho local/dev e, na Etapa 7, como persistencia first-party preparada em `beta_feedback_items` quando `FEEDBACK_REAL_ENABLED=true`, houver sessao autenticada, aviso aceito e consentimento ativo `beta_feedback_v1`.
- Feedback externo ainda depende de URL/formulario aprovado.
- Decisao atual: feedback beta, quando coletado, tera retencao de 90 dias.
- Coleta real exige consentimento/aviso claro, acesso restrito, exportacao/exclusao e proibicao de dados sensiveis nos campos livres.
- Indicio de dado sensivel, token, URL privada, e-mail, payload tecnico bruto ou conteudo intimo bloqueia persistencia antes do insert.
- Supabase/Auth/RLS preview e smoke externo ainda nao foram validados nesta etapa.

## Principio

Feedback deve ajudar a reduzir friccao sem coletar conteudo intimo. No beta, campos livres sao risco de privacidade e devem ser curtos, orientados por modulo e revisados.

## Estado de implementacao

- Entrada in-app preparada em `src/components/feedback/`.
- Dominio de validacao em `src/domain/feedback/`.
- Persistencia first-party preparada por server action, desligada por default e dependente de consentimento, aviso e runtime.
- Sem `localStorage`, `sessionStorage`, IndexedDB ou CacheStorage.
- Link externo opcional via `NEXT_PUBLIC_BETA_FEEDBACK_URL`.

## Fluxo in-app

1. Usuario abre "Feedback beta".
2. Escolhe modulo.
3. Preenche tres campos curtos: funcionou, confundiu, travou.
4. Marca clareza, utilidade e peso.
5. Opcionalmente adiciona uma frase.
6. App prepara rascunho local/dev e alerta se houver indicio sensivel.
7. Persistencia first-party so ocorre apos envio explicito, aviso confirmado e consentimento ativo.
8. Se houver indicio sensivel, o envio e bloqueado e o usuario deve remover o dado antes de tentar novamente.

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

## Persistencia e retencao

- Tabela planejada/preparada: `beta_feedback_items`.
- Campos livres devem ser limitados, normalizados e revisados antes de virarem issue.
- Retencao operacional: 90 dias via `expires_at`.
- Feedback nao deve ser duplicado em analytics; analytics pode registrar somente evento minimizado `feedback_submitted` se houver consentimento separado de analytics.
- Respostas brutas nao devem ir para e-mail, logs, docs, changelog ou ferramentas externas sem redacao e aprovacao.
