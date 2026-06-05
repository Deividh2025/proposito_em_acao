# Operations Runbook

Data: 2026-06-05.

## Estado operacional

O produto esta em V1 local ampla / pre-beta real e pronto para continuar a preparacao de preview controlado em Hostinger VPS KVM 1 com Coolify. Beta real e producao aberta estao bloqueados ate Supabase/Auth/RLS/LGPD/secrets/smoke reais passarem e S0/S1 de `docs/BUG_TRIAGE.md` serem resolvidos.

Etapa 8: a preparacao operacional de Coolify/Hostinger permanece documental/local. Nao ha preview publicado, dominio/URL HTTPS aprovado, VPS/Coolify validado, secrets de preview configurados, smoke externo, Docker rollback rehearsal ou evidencia fresca de Supabase/Auth/RLS. Nao convidar usuarios beta e nao declarar producao pronta.

Decisoes atuais:

- Hostinger KVM 1 com gate de upgrade.
- Dominio exato ainda pendente.
- Resend para e-mail transacional e SMTP customizado do Supabase Auth.
- Analytics first-party no Supabase, opt-in desligado por padrao.
- Retencao de 90 dias para analytics, feedback beta e auditoria de IA.

Limitacoes operacionais abertas:

- `OPS-GH-001`: CI/branch protection/release ainda nao sustentam release publica; branch protection efetiva ou governanca equivalente segue pendente.
- `OPS-DOCKER-001`: Docker/Coolify/rollback ainda nao foram ensaiados em VPS.
- `OPS-HEALTH-001`: readiness externo depende de smoke em URL HTTPS publicada.

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
15. Ensaiar rollback Coolify para deployment anterior conhecido como bom.
16. Registrar evidencia de KVM gate: build, runtime, logs, HTTPS, restart, uso de recursos e rollback.

## Operacao Hostinger/Coolify preview

O preview so pode ser considerado operacional quando todos os itens abaixo tiverem evidencia fresca:

- VPS Hostinger KVM 1 provisionada com acesso administrativo aprovado.
- Coolify instalado, conectado ao repositorio privado e restrito aos operadores aprovados.
- Dominio/URL HTTPS de preview configurado sem wildcard amplo indevido.
- Variaveis de preview configuradas no Coolify, nunca em Git.
- Build e start da imagem passam no servidor.
- Logs de app/proxy ficam acessiveis sem conter conteudo sensivel.
- `/api/health` e `/api/ready` respondem conforme contrato em URL HTTPS.
- Rollback para deployment anterior conhecido como bom foi ensaiado e documentado.

Gate de upgrade KVM 1:

- Se build falhar por recurso, demorar de forma instavel, gerar OOM, reiniciar container, perder logs, degradar HTTPS/proxy ou impedir rollback previsivel, pausar o preview e aprovar upgrade antes de beta.
- Nao contornar o gate reduzindo seguranca, removendo readiness, desativando logs essenciais ou tratando falha de config como sucesso.

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
- deploy Coolify em commit/deployment errado;
- `/api/ready` falso positivo ou indisponivel em preview;
- KVM 1 saturada impedindo rollback ou smoke.

Acao imediata:

1. Pausar coleta/uso se necessario.
2. Acionar rollback.
3. Rotacionar secrets se aplicavel.
4. Validar correcao com smoke/RLS.
5. Registrar causa e prevencao.

Triggers especificos para rollback Coolify:

- erro 5xx persistente em rotas centrais;
- Auth real quebrado em signup/login/logout/callback/recovery;
- readiness falha ou mente sobre configuracao essencial;
- container em restart loop ou sem logs confiaveis;
- vazamento de secret/dado sensivel em HTML, bundle, log ou console;
- smoke externo reprova home, auth, dashboard, mobile, health ou ready;
- service worker/cache interfere em Auth, APIs autenticadas ou payload privado.

## IA

Providers planejados:

- OpenAI API.
- DeepSeek API com `deepseek-chat` e `deepseek-reasoner` como placeholders configuraveis por ambiente.

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

## Etapa 9 - decisao operacional do beta fechado

Data: 2026-06-05.

Decisao operacional recomendada: `NO-GO` para convidar usuarios reais.

O que esta pronto localmente:

- CI remoto da `main` passou.
- Gates locais passaram: lint, typecheck, test, build e E2E.
- Runbooks de suporte, incidentes, feedback, rollback, KVM gate e monitoramento existem.
- Coorte, rotina diaria, feedback triage e criterio de pausa estao definidos como preparacao.

O que bloqueia operacao real:

- Dominio/URL HTTPS de preview nao existe no processo desta auditoria.
- VPS Hostinger/Coolify, secrets de preview, logs, health/ready externos e rollback nao foram validados.
- Supabase/Auth/RLS/typegen fresco nao foi executado em preview aprovado.
- Resend/SMTP Auth, IA real, analytics/feedback real e exportacao/exclusao em preview nao foram validados.
- Fundador ainda precisa aprovar dominio, grupo inicial, regra de dados, LGPD minima, IA/e-mail real, canal externo de feedback e rollback ensaiado.

Equivalencia operacional de severidades:

- S0 de bug triage deve ser tratado como P0 de incidente e pausa imediata do beta.
- S1 bloqueante deve ser tratado como P1 operacional e impede convite/expansao da coorte.
- S2 pode ir para backlog controlado se nao tocar privacidade, Auth, RLS, Atalaia, IA real, e-mail real ou deploy.
