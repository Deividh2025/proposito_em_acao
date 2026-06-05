# Beta Checklist

Data de sincronizacao: 2026-06-05.

## Status

Beta fechado real ainda nao aprovado. O produto esta em V1 local ampla / pre-beta real. A proxima meta e publicar um preview HTTPS controlado e validar Auth/Supabase/RLS/smoke antes de convidar usuarios reais.

Etapa 8 sincronizou rollback/docs para Hostinger/Coolify, mas nao publicou preview. Sem dominio/URL HTTPS, VPS provisionada, Coolify validado, secrets de preview, smoke externo, branch protection/release referenciavel e rehearsal de rollback, beta/producao continuam bloqueados.

Etapa 9 executou gate final integrado local. CI remoto da `main` estava verde e os gates locais passaram, mas a decisao recomendada permanece `NO-GO` porque preview HTTPS, Supabase/Auth/RLS fresco, secrets de preview, smoke externo, Docker/Coolify, KVM gate e rollback drill nao estavam disponiveis.

## Decisoes fechadas

- [x] Infraestrutura: Hostinger VPS KVM 1 com Coolify.
- [x] Gate de upgrade: obrigatorio se KVM 1 nao sustentar a aplicacao com estabilidade.
- [x] Dominio sera adquirido na Hostinger.
- [x] Supabase principal sera usado no beta apenas apos cutover validado e aprovado.
- [x] IA planejada: `automatic`, `openai` ou `deepseek`, padrao `automatic`.
- [x] Consentimento de IA separado, versionado e revogavel por provider.
- [x] Sem fallback automatico entre providers; falha usa fallback local seguro ou fluxo manual.
- [x] Resend para e-mail transacional e SMTP customizado do Supabase Auth.
- [x] Analytics first-party no Supabase, opt-in desligado por padrao.
- [x] Retencao de 90 dias para analytics, feedback beta e metadados de auditoria de IA.

## Fundador precisa aprovar

- [ ] Dominio exato de preview/producao.
- [ ] Upgrade de VPS, se KVM 1 falhar no gate tecnico.
- [ ] Janela e operador para cutover Supabase principal.
- [ ] Politica minima de privacidade, termos, consentimentos, revogacao, exportacao e exclusao.
- [ ] Se IA real fica desativada no primeiro beta.
- [ ] Se e-mail real fica desativado no primeiro beta.
- [ ] Canal externo de feedback beta, se houver.
- [ ] Plano de rollback ensaiado.
- [ ] Grupo inicial de usuarios beta e regra de dados ficticios/reais.

## Engenharia precisa concluir

- [x] Gates locais recentes de lint/typecheck/test passaram nesta auditoria.
- [x] Plano de beta, feedback, suporte, incident response e V1.1 existem.
- [x] Pack de cutover Supabase preview existe em `docs/SUPABASE_PREVIEW_CUTOVER.md`.
- [x] Scripts preparados: `supabase:types:preview` e `supabase:validate:preview`.
- [x] Atalaia/RLS endurecido localmente contra escalada no aceite, com harness preview expandido para `atalia_invited`.
- [x] Fundacao local de Auth SSR implementada com proxy/getClaims, callback, confirmacao, recovery, logout, redirects seguros, rotas protegidas por runtime e `/api/ready`.
- [x] Etapa 4 preparada localmente para substituir dados demonstrativos por queries autenticadas/empty states, mantendo amostras apenas em `local-demo`.
- [x] Etapa 5 preparada localmente para roteamento seguro OpenAI/DeepSeek, consentimento por provider, guardrails executados e fallback local sem fallback cruzado.
- [x] Etapa 6 preparada localmente com adapter Resend server-only, templates neutros, webhook assinado e envio real bloqueado por default.
- [x] Etapa 7 preparada localmente com `/settings`, consentimentos `ai_provider_openai_v1`, `ai_provider_deepseek_v1`, `product_analytics_v1`, `beta_feedback_v1`, analytics opt-in, feedback seguro, export JSON e solicitacao de exclusao.
- [x] Auditoria transversal do PR #8 executada localmente: gates completos passaram, smoke local desktop/mobile sem console/pageerror e nenhum secret real identificado no diff.
- [x] Etapa 8 sincronizou docs de rollback Coolify, triggers, KVM gate e limitacoes de release sem liberar deploy.
- [ ] Corrigir/validar bugs S0/S1 do `docs/BUG_TRIAGE.md`.
- [ ] Publicar preview HTTPS em Hostinger/Coolify.
- [ ] Configurar secrets de preview no provedor.
- [ ] Validar Hostinger KVM 1 ou executar upgrade.
- [ ] Aplicar migration de hardening do Atalaia em branch preview aprovada e repetir cutover/harness Supabase com evidencia fresca.
- [ ] Gerar tipos Supabase reais e revisar diff.
- [ ] Validar Auth SSR completo em URL publicada, incluindo proxy/middleware, refresh/getClaims, callback, confirmacao, recovery, logout, cookies reais e redirects seguros.
- [ ] Rodar smoke externo em URL HTTPS.
- [ ] Validar PWA install/offline via HTTPS sem cache de rotas Auth, callback, recovery, API autenticada, server actions ou payloads privados.
- [x] Confirmar CI remoto verde na `main`.
- [ ] Ensaiar rollback com release/tag/deployment conhecido.
- [ ] Confirmar branch protection efetiva ou governanca equivalente para impedir release sem gates.
- [ ] Criar release/tag ou deployment anterior conhecido como bom para rollback referenciavel.
- [ ] Validar `/api/ready` em preview HTTPS e provar falha fechada quando config essencial faltar.
- [ ] Validar imagem Docker/Coolify, healthcheck operacional e rollback/redeploy anterior.

## Seguranca

- [ ] Nenhum secret em Git/diff/log.
- [ ] Service role somente server-side.
- [ ] OpenAI/DeepSeek keys somente server-side, se ativadas.
- [ ] Consentimento especifico por provider de IA antes de IA real.
- [x] Kill switch `AI_REAL_ENABLED=false` permanece default e bloqueia provider real localmente.
- [x] Roteamento local de IA nao faz fallback automatico entre OpenAI e DeepSeek.
- [x] Kill switch `EMAIL_REAL_ENABLED=false` e `EMAIL_DOMAIN_VERIFIED=false` permanecem default e bloqueiam Resend real localmente.
- [ ] Dominio/remetente Resend, SMTP Auth e smoke de entrega real ainda nao validados.
- [ ] Smoke externo de Resend/Auth em URL HTTPS ainda nao executado; PR #8 foi apenas merge preparatorio local.
- [x] Consentimento de analytics/feedback preparado localmente antes de coleta real.
- [x] Retencao de 90 dias preparada localmente para analytics/feedback/auditoria de IA.
- [ ] Validar remotamente consentimento, RLS e retencao de analytics/feedback/auditoria de IA em Supabase preview aprovado.
- [ ] Validar exportacao sem secrets/tokens/hashes e exclusao com confirmacao explicita em preview aprovado.
- [ ] `NEXT_PUBLIC_BETA_FEEDBACK_URL`, se usada, sem tokens, query sensivel ou dados pessoais.
- [x] Atalaia limitado localmente por alvo/grant/permissao/revogacao, sem expansao no aceite.
- [ ] Atalaia validado remotamente em Supabase preview apos aplicar a migration da Etapa 2.
- [ ] Metacognicao, Chamado e Revisao privados por padrao.
- [ ] Logs sem conteudo intimo.
- [ ] PWA sem cache sensivel.
- [ ] Auth externo com URL HTTPS, Site URL/Redirect URLs, SMTP Auth/Resend e recovery validados.
- [ ] CSP endurecida ou risco formalmente aceito antes de producao.

## Produto/UX

- [ ] Fluxos principais usam dados reais do usuario ou estados vazios reais no smoke; Etapa 4 local preparada, mas falta smoke autenticado externo.
- [ ] Usuario entende fallback local/dev versus persistencia real.
- [ ] Inbox nao marca sucesso local quando `result.ok` falha.
- [ ] Mobile nao possui `<main>` aninhado.
- [ ] Linguagem sem vergonha/culpa.
- [ ] Proxima acao clara em dashboard/mobile.
- [x] Atalaia nao usa grant demonstrativo no aceite quando Supabase/Auth esta configurado.
- [ ] Atalaia tem previa real validada por Auth SSR/E2E em URL publicada antes de qualquer envio externo.

## Veredito atual

Pronto para continuar preparacao documental e tecnica de preview controlado. Nao pronto para beta fechado com usuarios reais.
