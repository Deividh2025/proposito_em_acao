# Incident Response - Beta Fechado

## Objetivo

Responder rapidamente a incidentes de segurança, privacidade, estabilidade e operação do beta.

## Severidades

- P0: vazamento entre usuários, secret exposto, RLS quebrado, Atalaia vê dado privado, Metacognição exposta, cache PWA sensível, provider real dispara sem aprovação.
- P1: Auth indisponível, fluxo central quebrado, deploy instável, erro repetido em server action central.
- P2: falha funcional com contorno.
- P3: copy, visual, documentação ou melhoria menor.

## Processo

1. Detectar e classificar.
2. Conter: pausar fluxo, bloquear coleta, reverter deploy ou desligar provider.
3. Preservar evidência segura: rota, horário, versão, status técnico e logs sanitizados.
4. Corrigir ou acionar rollback.
5. Validar com smoke/RLS/Auth/PWA conforme área.
6. Comunicar beta sem expor detalhes sensíveis.
7. Registrar causa, prevenção e decisão pendente.

## Gatilhos de rollback

- Deploy quebra home, Auth, dashboard ou mobile.
- RLS permite acesso indevido.
- Atalaia acessa dado privado.
- Secret aparece em Git, bundle, log ou UI.
- Service worker cacheia dado sensível.
- IA/e-mail real aciona sem aprovação.

## Comunicação

Mensagem externa deve ser curta, sem detalhes exploráveis e sem dados de usuário. Se houver risco de privacidade, orientar pausa no uso do fluxo afetado.

## Pós-incidente

Registrar:

- O que aconteceu.
- Impacto.
- Dados afetados.
- Correção.
- Verificação.
- Prevenção.
- Decisões do fundador.
