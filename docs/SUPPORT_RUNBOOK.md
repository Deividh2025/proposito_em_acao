# Support Runbook - Beta Fechado

## Status

Suporte beta pode ser preparado. Atendimento a usuários reais depende dos gates externos do beta.

## Canal

Canal inicial: e-mail operacional `deividhvianei@gmail.com`, até o fundador aprovar ferramenta/canal dedicado.

## Rotina diária no beta

- Verificar incidentes P0/P1.
- Revisar logs técnicos sem conteúdo sensível.
- Conferir Auth, RLS, PWA e server actions.
- Revisar feedbacks novos e redigir dados sensíveis.
- Registrar decisões e correções.

## Templates

### Recebimento

Obrigado por avisar. Vou registrar isso como incidente/feedback do beta. Para proteger seus dados, não envie conteúdo íntimo, prompts, respostas de IA, prints com dados pessoais ou tokens. Se puder, envie apenas tela, horário aproximado, ação que tentou fazer e o que apareceu.

### Pedido de contexto

Consegue me dizer em qual tela aconteceu, qual ação você tocou/clicou e se estava no desktop ou mobile/PWA? Use dados fictícios no exemplo, sem informações pessoais.

### Risco de privacidade

Obrigado. Como pode envolver privacidade, pause o uso dessa parte por enquanto. Vamos verificar RLS/logs/cache/secrets antes de liberar novamente e avisaremos quando estiver seguro.

### Correção aplicada

A correção foi aplicada no ambiente de preview e validada com smoke test. Pode tentar novamente usando dados de teste. Se o comportamento voltar, responda com tela, horário e ação executada.

### Limite do beta

Esse comportamento ainda está desativado no beta. IA real, e-mail real e dados produtivos só serão liberados depois das aprovações de segurança, privacidade e custo.

## O que não pedir

- Conteúdo de Chamado.
- Metacognição.
- Dados médicos, familiares, financeiros ou de fé.
- Prints com dados pessoais.
- Tokens, links de convite ou secrets.

## Escalonamento

- P0: pausar fluxo, acionar rollback/segurança e comunicar fundador.
- P1: corrigir antes de continuar coorte.
- P2: planejar correção na rodada semanal.
- P3: backlog V1.1 ou polimento.
