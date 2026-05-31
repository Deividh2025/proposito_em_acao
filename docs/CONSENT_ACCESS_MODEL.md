# Consent Access Model

## Principio

Consentimento e autorizacao sao separados. Um consentimento registra vontade e historico; um grant operacional libera acesso limitado enquanto estiver ativo.

## Consentimentos minimos

- Termos e politica de privacidade.
- Uso de IA.
- Tratamento de dados sensiveis.
- Comunicacoes.
- Analytics/telemetria, se houver.
- Atalaia por alvo e escopo.
- Documento de compromisso.
- Uso em evals internas, se aprovado.

## Campos

`consent_records` registra `consent_type`, `version`, `scope`, `subject_type`, `subject_id`, `accepted_at`, `revoked_at` e `metadata` minimo.

## Atalaia

`accountability_partners` representa a relacao. `accountability_grants` representa a permissao real:

- um `goal_id`;
- escopos em `permissions`;
- `status`;
- `accepted_at`;
- `expires_at`;
- `revoked_at`.

## Revogacao

Revogacao deve:

- parar leitura futura;
- cancelar notificacoes pendentes;
- preservar historico minimo;
- nao apagar automaticamente consentimento historico;
- nao expor conteudo intimo no evento de auditoria.

## Dados fora de compartilhamento padrao

- Chamado completo.
- Metacognicao.
- Revisao semanal.
- Inbox bruto.
- Calendario completo.
- Saude, familia, financas, emocoes e fe.
- Prompts privados e respostas brutas de IA.
