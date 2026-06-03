# Consent Access Model

## Estado atual verificado em 2026-06-03

- Consentimento de IA deve ser separado por provider (`openai`, `deepseek` e modo `automatic`), versionado, auditavel e revogavel.
- Analytics e feedback beta exigem opt-in antes de coleta real; analytics sera first-party no Supabase e desligado por padrao.
- Retencao decidida: 90 dias para analytics, feedback beta e metadados de auditoria de IA.
- Atalaia nao pode ampliar permissoes no aceite do convite; o escopo revisado pelo dono deve ser imutavel para o convidado.
- Etapa 2 persiste consentimento minimo do Atalaia em criacao, aceite e revogacao do grant, mas nao fecha consentimentos amplos de IA, analytics ou feedback.

## Principio

Consentimento e autorizacao sao separados. Um consentimento registra vontade e historico; um grant operacional libera acesso limitado enquanto estiver ativo.

## Consentimentos minimos

- Termos e politica de privacidade.
- Uso de IA por provider (`openai`, `deepseek` e modo `automatic`).
- Tratamento de dados sensiveis.
- Comunicacoes.
- Analytics/telemetria.
- Feedback beta e pesquisa de produto.
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

Na criacao do convite, o consentimento registra versao, alvo, permissoes revisadas, nivel, frequencia e hash do e-mail do Atalaia. No aceite, a action registra aceite do convite com hash do usuario/e-mail autenticado e referencia minima ao grant/parceiro. Na revogacao, o grant muda para `revoked`, notificacoes pendentes sao canceladas e o consentimento ativo do alvo e marcado com `revoked_at`.

Falhas obrigatorias de `consent_records`, `accountability_events` ou `accountability_notifications` devem retornar `ok:false`. Na criacao, token/estado de convite so se tornam utilizaveis depois das escritas obrigatorias; no aceite, acesso so e ativado depois de consentimento e evento. Logs, mensagens e payloads nao devem conter token bruto de convite, prompt bruto, resposta bruta, conteudo intimo, e-mail com contexto sensivel ou secrets.

## Revogacao

Revogacao deve:

- parar leitura futura;
- cancelar notificacoes pendentes;
- preservar historico minimo;
- nao apagar automaticamente consentimento historico;
- nao expor conteudo intimo no evento de auditoria.

Na Etapa 2, a revogacao do Atalaia corta grant/parceiro e cancela notificacoes antes de declarar sucesso; se a auditoria final falhar, retorna `ok:false` sem reabrir acesso. A validacao dinamica de revogacao em Supabase preview ainda deve ser repetida antes do beta real.

## Dados fora de compartilhamento padrao

- Chamado completo.
- Metacognicao.
- Revisao semanal.
- Inbox bruto.
- Calendario completo.
- Saude, familia, financas, emocoes e fe.
- Prompts privados e respostas brutas de IA.

## Analytics e feedback

Analytics de produto exige consentimento especifico, versao, finalidade, retencao e revogacao. Eventos devem usar allowlist e metadados minimos, sem Chamado, Metacognicao, Inbox, calendario detalhado, fe, saude, familia, financas, emocoes, prompts, respostas de IA ou mensagens ao Atalaia.

Feedback beta com campo livre deve ser tratado como potencialmente sensivel. Envio externo so pode ocorrer apos aprovacao de formulario/canal, acesso, retencao e aviso claro para nao inserir dados intimos.
