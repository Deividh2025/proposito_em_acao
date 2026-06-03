# Security Notes

Nota: a fonte principal e mais completa de seguranca, privacidade, consentimento, Atalaia, Metacognicao, RLS futura e LGPD agora e `docs/SECURITY_PRIVACY.md`. A matriz detalhada de dados esta em `docs/DATA_SENSITIVITY_MATRIX.md`.

Este documento registra riscos e regras iniciais de seguranca e privacidade. Ele nao substitui uma politica juridica de privacidade, DPIA/LIA ou revisao LGPD antes de producao.

## Dados sensiveis

Tratar como sensiveis desde o modelo de produto:

- Fe e espiritualidade.
- Saude, energia, sono e rotina.
- Familia e relacionamentos.
- Financas.
- Emocoes, pensamentos, impulsos e bloqueios.
- Chamado Pessoal.
- Metacognicao.
- Atalaia, convites, concessoes e mensagens.
- Calendario, tarefas, habitos, foco e revisoes semanais.
- Documentos de compromisso e alavancas.

## Regras gerais

- Privacidade por padrao.
- Coleta minima.
- Finalidade clara.
- Consentimento granular para compartilhamento.
- Exportacao e exclusao de dados em fase futura.
- Logs sem conteudo sensivel bruto.
- Secrets nunca no cliente, docs ou Git.

## `.env` e secrets

- `.env`, `.env.local` e `.env.*` devem ficar fora do Git.
- `.env.example` deve conter apenas placeholders.
- `NEXT_PUBLIC_*` e publico no browser; nunca guardar secrets nesse prefixo.
- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, tokens de e-mail e webhooks so podem existir em ambiente server-side seguro.
- Se um secret for exposto, considerar comprometido e rotacionar.

## Credenciais Supabase registradas

- A URL publica e a chave publicavel do Supabase foram registradas somente em `.env.local`, que e ignorado pelo Git.
- A chave publicavel fica em `NEXT_PUBLIC_SUPABASE_ANON_KEY` porque os helpers atuais usam esse nome para inicializar o client.
- Nenhuma `SUPABASE_SERVICE_ROLE_KEY` foi informada ou registrada.
- A chave publicavel nao autoriza DDL, policies, advisors ou aplicacao de migrations; essas acoes exigem credenciais administrativas e etapa propria.

## Supabase e RLS

- RLS obrigatorio em todas as tabelas em schemas expostos.
- Politicas por usuario devem ser o padrao minimo.
- Roles e permissoes nao devem depender de `user_metadata` ou metadata editavel pelo usuario.
- Dados de autorizacao devem vir de `app_metadata` ou tabelas controladas pelo servidor.
- Atalaia deve acessar via concessao granular por alvo, nao por conta inteira.
- Revogacao deve ter efeito imediato.
- Views expostas devem respeitar RLS.
- Funcoes privilegiadas nao devem ficar em schema exposto.
- `service_role` nao pode simplificar fluxo normal do app.
- O harness `npm.cmd run supabase:validate:preview` usa `SUPABASE_SERVICE_ROLE_KEY` somente no terminal do operador para criar/remover fixtures ficticios em branch preview; nunca deve rodar contra producao nem dentro do runtime do app.

## OpenAI e IA

- Chamadas a modelos devem ocorrer no backend.
- Enviar o minimo necessario ao modelo.
- Dados sensiveis nao devem ir para IA sem consentimento claro.
- Prompts/respostas brutas nao devem ser armazenados por padrao.
- Saidas que viram dados devem ser validadas por schema.
- Usuario deve revisar mudancas que alterem agenda, alvos, tarefas ou mensagens a Atalaia.
- Prompt 7 adiciona provider OpenAI server-only, provider mock, safe invoke e metadados `ai_run_audit_v1`.
- Prompt 16 aprova DeepSeek como provider planejado adicional, tambem server-only, com modelos `deepseek-v4-flash` e `deepseek-v4-pro`; a chave DeepSeek nao pode ir para client, logs ou `NEXT_PUBLIC_*`.
- Provider real existe como preparacao tecnica; fluxos de produto continuam sem chamada real por padrao.
- Falhas reais de escrita no Supabase nao devem ser reportadas como persistencia local bem-sucedida; somente ausencia de configuracao pode cair em fallback local/dev positivo.
- Prompt 8 adiciona alvos/projetos/tarefas/microtarefas com mock seguro; analise ecologica, Chamado e rotina nao devem ir para logs ou Atalaia.
- Prompt 9 adiciona calendario/inbox com mock seguro; capturas, links, preocupacoes e agenda nao devem ir para logs, Atalaia ou terceiros nesta etapa.
- Prompt 10 adiciona Desbloqueador/Metacognicao com mock seguro; pensamentos automaticos, fatos, interpretacoes, sentimentos, impulsos e obstaculos nao devem ir para logs, Atalaia ou terceiros por padrao.
- Prompt 13 adiciona Atalaia e Documento de Compromisso em profundidade controlada; compartilhamento exige alvo, permissao granular, previa, consentimento e revogacao efetiva.
- E-mail real do Atalaia permanece desativado sem provider server-side configurado; assuntos e corpos devem ser neutros e sem dados sensiveis.
- Prompt 14 adiciona PWA/mobile complementar; service worker so pode cachear assets estaticos seguros e pagina offline, nunca Metacognicao, Inbox, calendario, Atalaia, tokens, notificacoes ou respostas de server actions.
- Prompt 17 adiciona preparacao de beta, analytics seguro e feedback. Analytics real exige consentimento/retencao e allowlist; feedback externo exige URL aprovada sem tokens; nenhum conteudo sensivel deve ser coletado em eventos, feedback, suporte ou logs.

## Guardrails de IA

A IA nao deve:

- diagnosticar;
- substituir terapia, medicina, aconselhamento pastoral humano ou psiquiatria;
- prometer cura;
- afirmar vontade divina especifica;
- usar culpa espiritual;
- humilhar;
- sugerir punicoes nocivas;
- compartilhar dados sem consentimento;
- tratar crise grave como simples produtividade.

## Atalaia

- Vincular por alvo.
- Permissoes granulares: status, progresso, marcos, pedido de ajuda e atrasos autorizados.
- Excluir por padrao: Metacognicao, Chamado completo, saude, familia, financas, emocoes e revisoes privadas.
- Mensagens devem ter previa antes de envio.
- E-mails ao Atalaia devem ter corpo e assunto neutros; conteudo sensivel so pode aparecer atras de link autenticado, expiravel e auditavel.
- Registrar auditoria de autorizacao, escopo, versao de consentimento e revogacao.
- Cancelar notificacoes pendentes quando o grant for revogado.
- Documento de Compromisso compartilhado exige revisao humana, consentimento versionado e grant ativo.

## Status Prompt 4

- Migrations de schema/RLS/storage foram criadas.
- Projeto remoto Supabase nao foi alterado por falta de credenciais administrativas/CLI.
- `SUPABASE_SERVICE_ROLE_KEY` permanece server-only.
- Admin client esta isolado com `server-only` e nao e reexportado pelo barrel publico.

## LGPD antes da primeira coleta real

Antes da primeira coleta real de dados, documentar bases legais, consentimento para dados sensiveis, politica de privacidade, controlador/DPO, direitos do titular, exportacao, exclusao, retencao, operadores/suboperadores, transferencia internacional e plano de resposta a incidente.

## Status do produto

- Fluxo inicial de onboarding/direcao, camada central de IA e nucleo inicial de execucao estao preparados, mas modulos finais ainda seguem por etapas.
- Calendario e inbox/GTD basicos foram adicionados no Prompt 9 como centro operacional, mantendo privacidade por padrao.
- Desbloqueador e Metacognicao funcionais foram adicionados no Prompt 10, mantendo Metacognicao privada por padrao.
- Nenhuma chamada real a OpenAI API ou DeepSeek API e acionada por fluxo de produto sem etapa propria de ativacao, evals e secrets.
- Nenhum deploy realizado.
- PWA/mobile complementar existe para acoes rapidas; a migration remota `mobile_pwa_prompt14_alignment` foi aplicada em 2026-06-02, enquanto app nativo, push notifications e fila offline sensivel seguem fora de escopo antes do Prompt 15.
