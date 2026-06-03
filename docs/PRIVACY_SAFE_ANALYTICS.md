# Privacy-Safe Analytics

## Estado atual verificado em 2026-06-03

- Analytics real ainda nao esta ativo.
- Decisao atual: analytics first-party no Supabase, com opt-in desligado por padrao.
- Retencao operacional decidida: 90 dias para eventos de analytics, feedback beta e metadados de auditoria de IA.
- O contrato local em `src/domain/analytics/` ainda nao persiste eventos e nao deve ser tratado como coleta pronta.
- Antes de qualquer persistencia, o codigo deve bloquear coleta quando consentimento estiver ausente ou revogado.

## Regra central

Analytics deve medir comportamento de produto sem capturar conteúdo de vida do usuário.

## Consentimento

Antes de qualquer coleta real:

- Criar consentimento específico para analytics/telemetria.
- Registrar versão, data, escopo e revogação.
- Bloquear eventos quando consentimento estiver ausente ou revogado.

## Minimização

Permitido:

- Evento.
- Módulo.
- Status.
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

Feedback livre deve ser tratado como potencialmente sensível. O beta atual só prepara rascunho local e alerta para indícios sensíveis. Envio externo depende de aprovação de política, formulário e acesso.

## Retenção

Politica decidida antes da primeira coleta real:

- Raw events de analytics: 90 dias.
- Feedback beta: 90 dias.
- Metadados de auditoria de IA: 90 dias.
- Rollups agregados podem ser mantidos apenas se nao contiverem identificadores pessoais ou conteudo sensivel.
- Quem acessa.
- Como exportar/excluir quando aplicável.
- Como apagar dados após revogação.

## PWA/mobile

Analytics e feedback mobile não podem usar cache offline sensível, localStorage, sessionStorage ou IndexedDB para conteúdo de usuário.

## Incidentes

Se um evento ou feedback capturar conteúdo sensível:

1. Pausar coleta.
2. Isolar o dado.
3. Excluir ou redigir conforme política aprovada.
4. Registrar incidente.
5. Corrigir allowlist/denylist.
