# Operations Runbook

Data: 2026-06-02.

## Estado operacional

O produto esta em V1 local ampla / pre-beta real e pronto para continuar a preparacao de preview controlado em Hostinger VPS KVM 1 com Coolify. Beta real e producao aberta estao bloqueados ate Supabase/Auth/RLS/LGPD/secrets/smoke reais passarem e S0/S1 de `docs/BUG_TRIAGE.md` serem resolvidos.

Decisoes atuais:

- Hostinger KVM 1 com gate de upgrade.
- Dominio exato ainda pendente.
- Resend para e-mail transacional e SMTP customizado do Supabase Auth.
- Analytics first-party no Supabase, opt-in desligado por padrao.
- Retencao de 90 dias para analytics, feedback beta e auditoria de IA.

## Dono e contato

- Dono da plataforma: Deividh de Sa.
- E-mail operacional: `deividhvianei@gmail.com`.

## Rotina antes de preview

1. Revisar `git status --short --branch`.
2. Confirmar que `.env.example` contem apenas placeholders.
3. Rodar:
   - `npm.cmd run lint`
   - `npm.cmd run typecheck`
   - `npm.cmd run test`
   - `npm.cmd run build`
   - `npm.cmd run test:e2e`
4. Conferir secret scan basico no diff.
5. Confirmar plataforma/URL aprovada.
6. Provisionar VPS Hostinger e instalar/configurar Coolify.
7. Conectar Coolify ao GitHub privado.
8. Configurar variaveis de preview no Coolify.
9. Configurar dominio/HTTPS de preview.
10. Configurar Supabase Auth redirects.
11. Aplicar migrations em branch/preview Supabase.
12. Rodar matriz RLS dinamica.
13. Fazer deploy de preview.
14. Rodar smoke tests de preview.

## Rotina diaria do beta fechado

- Verificar logs de erro sem registrar conteudo sensivel.
- Revisar signups/logins de teste.
- Monitorar limites Supabase e plataforma.
- Revisar se houve falha em Auth, RLS, PWA ou actions.
- Registrar incidentes e correcoes em docs.
- Revisar feedback beta sanitizado e classificar em bug, friccao UX, risco de privacidade, ideia V1.1 ou fora de escopo.
- Monitorar eventos de analytics rejeitados por falta de consentimento ou chave sensivel quando analytics real existir.

## Logs

Permitido:

- timestamp;
- rota/modulo;
- status tecnico;
- ids tecnicos nao sensiveis quando necessario;
- metadados de guardrail sem prompt/resposta bruta.

Proibido:

- conteudo de Chamado;
- Metacognicao;
- inbox bruto;
- calendario detalhado;
- prompts/respostas brutas;
- tokens de convite;
- service role/OpenAI key/e-mail secrets.
- respostas completas de feedback beta com dados intimos.

## Feedback e analytics

- Feedback in-app atual e rascunho local e nao deve ser apresentado como coleta produtiva.
- Formulario externo so pode ser ativado via `NEXT_PUBLIC_BETA_FEEDBACK_URL` aprovado, sem tokens ou query sensivel.
- Analytics real exige consentimento, retencao de 90 dias e allowlist antes de coleta.
- Eventos devem medir acoes significativas e metadados minimos, sem texto de usuario.

## Incidentes

Criticos:

- vazamento entre usuarios;
- Atalaia acessando dado privado;
- secret exposto;
- auth redirect inseguro;
- cache PWA com dado sensivel.

Acao imediata:

1. Pausar coleta/uso se necessario.
2. Acionar rollback.
3. Rotacionar secrets se aplicavel.
4. Validar correcao com smoke/RLS.
5. Registrar causa e prevencao.

## IA

Providers planejados:

- OpenAI API.
- DeepSeek API com `deepseek-v4-flash` e `deepseek-v4-pro`.

Manter IA real desativada ate aprovar:

- modelo OpenAI;
- seletor `automatic`/`openai`/`deepseek` e roteamento do modo `automatic`;
- custo;
- rate limit;
- evals ampliados;
- logs seguros;
- base de conhecimento;
- guardrails por fluxo.

## E-mail

Manter real desativado ate aprovar:

- Resend server-only;
- remetente;
- dominio verificado;
- SMTP customizado do Supabase Auth;
- templates;
- unsubscribe/revogacao quando aplicavel;
- logs minimos sem dados sensiveis.
