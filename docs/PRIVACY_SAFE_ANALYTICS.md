# Privacy-Safe Analytics

## Estado atual verificado em 2026-06-04

- Decisao atual: analytics first-party no Supabase, com opt-in desligado por padrao.
- Retencao operacional decidida: 90 dias para eventos de analytics, feedback beta e metadados de auditoria de IA.
- A Etapa 7 preparou persistencia first-party em `product_analytics_events`, mas coleta real continua desligada por default e bloqueada sem `ANALYTICS_REAL_ENABLED=true`, sessao autenticada e consentimento ativo `product_analytics_v1`.
- O contrato local em `src/domain/analytics/` bloqueia ausencia/revogacao de consentimento, evento fora da allowlist e metadata sensivel antes de persistir.
- Validacao remota Supabase/Auth/RLS e smoke externo ainda nao foram executados; nao declarar analytics real pronto para usuarios beta.

## Regra central

Analytics deve medir comportamento de produto sem capturar conteúdo de vida do usuário.

## Consentimento

Antes de qualquer persistencia real:

- Exigir consentimento específico `product_analytics_v1`.
- Registrar versão, data, escopo e revogação.
- Bloquear eventos quando consentimento estiver ausente ou revogado.
- Manter opt-in desligado por padrao em preferencias.

## Minimização

Permitido:

- Evento allowlisted.
- Módulo allowlisted.
- Status allowlisted.
- Buckets e contagens.
- Duração aproximada.
- Superfície desktop/mobile.
- Versão de schema/consentimento.

Proibido:

- Conteúdo de campos.
- Texto de formulário.
- Prompt/resposta de IA.
- Mensagem ao Atalaia.
- Calendário detalhado.
- Qualquer dado íntimo ou identificador desnecessário.

## Feedback

Feedback livre deve ser tratado como potencialmente sensível. A Etapa 7 prepara persistencia first-party em `beta_feedback_items` apenas apos envio explicito, aviso/consentimento `beta_feedback_v1` e ausencia de indicio sensivel. Envio externo continua dependente de aprovacao de politica, formulario e acesso.

## Retenção

Politica decidida antes da primeira coleta real:

- Raw events de analytics: 90 dias.
- Feedback beta: 90 dias.
- Metadados de auditoria de IA: 90 dias.
- Rollups agregados podem ser mantidos apenas se nao contiverem identificadores pessoais ou conteudo sensivel.
- Quem acessa.
- Como exportar/excluir quando aplicável.
- Como apagar dados após revogação.
- O prune deve mirar somente `product_analytics_events`, `beta_feedback_items` e `ai_run_audits`; dados principais do produto nao entram nessa rotina operacional.

## PWA/mobile

Analytics e feedback mobile não podem usar cache offline sensível, localStorage, sessionStorage ou IndexedDB para conteúdo de usuário.

## Incidentes

Se um evento ou feedback capturar conteúdo sensível:

1. Pausar coleta.
2. Isolar o dado.
3. Excluir ou redigir conforme política aprovada.
4. Registrar incidente.
5. Corrigir allowlist/denylist.
