# Environment Variables

## Regra geral

`.env.example` contem somente placeholders. Valores reais devem ficar em `.env.local` local ou no cofre de secrets do provedor.

## App

- `NEXT_PUBLIC_APP_NAME`: nome publico do app.
- `NEXT_PUBLIC_APP_URL`: URL publica do ambiente.
- `NEXT_PUBLIC_BETA_FEEDBACK_URL`: link publico opcional para formulario externo aprovado do beta. Deve ficar vazio ate aprovacao e nunca conter tokens, segredos, dados de usuario ou querystring sensivel.

## Supabase

- `NEXT_PUBLIC_SUPABASE_URL`: URL publica do projeto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: chave publica anon/publishable para cliente.
- `SUPABASE_SERVICE_ROLE_KEY`: chave server-side altamente sensivel; nunca usar no browser.
- `SUPABASE_PROJECT_ID`: id/ref do projeto para CLI e geracao de tipos; nao e secret, mas deve ser mantido por ambiente.

`.env.local` deve permanecer ignorado e pode ficar vazio ate a etapa administrativa propria. Valores reais devem ser preenchidos apenas no ambiente local do operador ou no cofre de secrets do provedor, nunca em arquivo versionado.

Projeto Supabase informado para desenvolvimento:

- URL: `https://bceumcfmjftoukzrfthe.supabase.co`.
- Project ref: `bceumcfmjftoukzrfthe`.

Chaves publicaveis devem usar `NEXT_PUBLIC_SUPABASE_ANON_KEY` para compatibilidade com os helpers atuais. `SUPABASE_SERVICE_ROLE_KEY` deve permanecer server-side e vazio ate haver necessidade administrativa controlada.

## Runtime e kill switches

- `APP_RUNTIME_MODE`: modo server-side do runtime. Valores aceitos: `local-demo`, `preview`, `beta` e `production`. O default local seguro e `local-demo`.
- `AI_REAL_ENABLED`: habilita chamadas reais de IA somente quando `true`; default efetivo `false`.
- `EMAIL_REAL_ENABLED`: habilita envio real de e-mail somente quando `true`; default efetivo `false`.
- `ANALYTICS_REAL_ENABLED`: habilita coleta/persistencia real de analytics somente quando `true`; default efetivo `false`.
- `FEEDBACK_REAL_ENABLED`: habilita feedback real externo/persistido somente quando `true`; default efetivo `false`.

Semantica obrigatoria: `local-draft ok:true` so pode representar modo `local-demo` sem configuracao/sessao ou fluxo local/mock sem persistencia real aplicavel. Em `preview`, `beta` e `production`, ausencia de configuracao obrigatoria, ausencia de sessao para escrita real ou falha real de Supabase/Auth/provider/e-mail/analytics/feedback deve retornar `ok:false` ou bloquear o fluxo. As flags acima nao ativam integracoes reais nesta etapa; elas apenas definem o contrato server-side.

Para Auth SSR, `preview`, `beta` e `production` tambem devem falhar fechado quando `NEXT_PUBLIC_APP_URL`, Redirect URLs/Site URL do Supabase, cookies de sessao, callback/recovery ou SMTP Auth exigido nao estiverem configurados/validados. `local-demo` pode mostrar fallback local/dev, mas nao deve declarar persistencia, Auth externo ou e-mail real.

## OpenAI

- `OPENAI_API_KEY`: chave server-side; nunca prefixar com `NEXT_PUBLIC_`.
- `OPENAI_MODEL_FAST`: modelo rapido aprovado por ambiente/fluxo. Placeholder atual: `gpt-5.4-mini`.
- `OPENAI_MODEL_PRO`: modelo pro aprovado por ambiente/fluxo. Placeholder atual: `gpt-5.5`.
- `OPENAI_MODEL`: legado/fallback de compatibilidade quando `OPENAI_MODEL_FAST` ou `OPENAI_MODEL_PRO` nao estiverem definidos.

O seletor server-side de provider aceita `automatic`, `openai` e `deepseek`, com padrao `automatic`. A rota real continua bloqueada por `AI_REAL_ENABLED=false` ate secrets, consentimento versionado, evals aprovados e kill switch explicitamente ligado.

## DeepSeek

- `DEEPSEEK_API_KEY`: chave server-side; nunca prefixar com `NEXT_PUBLIC_`.
- `DEEPSEEK_BASE_URL`: base URL server-side. Valor planejado: `https://api.deepseek.com`.
- `DEEPSEEK_MODEL_FLASH`: modelo DeepSeek rapido/custo menor. Placeholder atual: `deepseek-chat`.
- `DEEPSEEK_MODEL_PRO`: modelo DeepSeek de maior capacidade. Placeholder atual: `deepseek-reasoner`.

DeepSeek foi aprovado como provider pelo fundador, junto com OpenAI, e possui adapter server-only. Ativacao real ainda exige guardrails/evals reais, custos, rate limit persistente, consentimento por provider e kill switch.

## IA operacional

- `AI_PROVIDER_DEFAULT`: preferencia server-side default. Valores aceitos: `automatic`, `openai`, `deepseek`; default `automatic`.
- `AI_REQUEST_TIMEOUT_MS`: timeout por chamada de provider; default local `20000`.
- `AI_DAILY_USER_LIMIT`: limite diario por usuario; default local `50`. Persistencia real de quota ainda depende de etapa propria.
- `AI_AUDIT_RETENTION_DAYS`: retencao futura dos metadados de auditoria de IA; default `90`.

## Email

- `EMAIL_PROVIDER`: provedor futuro. Vazio significa nenhum envio real e status `pending_provider_config`.
- `EMAIL_FROM`: remetente futuro. Deve ficar vazio ate haver dominio/remetente aprovado.

Decisao atual: `EMAIL_PROVIDER` deve usar Resend quando o adapter for implementado, com dominio verificado. O Supabase Auth tambem deve usar Resend como SMTP customizado. Uma futura `RESEND_API_KEY` deve ser server-side, nunca `NEXT_PUBLIC_*`, e adicionada como placeholder somente quando a implementacao for aprovada.

No Prompt 13, notificacoes do Atalaia sao preparadas no backend, mas nao enviam e-mail real sem provider configurado e revisao de seguranca.

## Environment

- `NODE_ENV`: `development`, `test` ou `production`.

## Checklist

- Nao commitar `.env` real.
- Nao registrar secrets em logs.
- Rotacionar qualquer secret exposto.
- Separar variaveis por ambiente.

## Prompt 16 - producao/preview

Configurar valores reais somente no cofre do provedor escolhido.

No Coolify, separar variaveis de runtime e build. Secrets server-side devem ser runtime-only sempre que possivel; valores publicos `NEXT_PUBLIC_*` podem ser necessarios no build do Next.js porque sao embutidos no bundle cliente.

Obrigatorias em preview/producao:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_BETA_FEEDBACK_URL`, se formulario externo do beta for aprovado.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `APP_RUNTIME_MODE=preview`, `beta` ou `production`, conforme o ambiente.
- `SUPABASE_PROJECT_ID`
- `NODE_ENV`

Manter vazias/desativadas ate aprovacao explicita:

- `AI_REAL_ENABLED`, `EMAIL_REAL_ENABLED`, `ANALYTICS_REAL_ENABLED` e `FEEDBACK_REAL_ENABLED`, salvo etapa propria aprovada.
- `SUPABASE_SERVICE_ROLE_KEY`, salvo necessidade server-side controlada.
- `OPENAI_API_KEY`, ate aprovar modelo, custo, rate limit e evals ampliados.
- `DEEPSEEK_API_KEY`, ate aprovar custo, rate limit, evals ampliados e roteamento por agente.
- `EMAIL_PROVIDER`, `EMAIL_FROM` e futura `RESEND_API_KEY`, ate aprovar dominio, remetente, templates e SMTP Auth.

Auth externo ainda pendente:

- URL HTTPS publicada e dominio real ainda nao existem.
- Site URL/Redirect URLs do Supabase ainda precisam ser preenchidos com URL real por ambiente.
- SMTP customizado do Supabase Auth via Resend ainda precisa de dominio/remetente verificado.
- Recovery, confirmacao e callback reais so podem ser validados apos esses itens.

Gates manuais:

- Dominio exato de preview/producao ainda nao definido.
- Hostinger KVM 1 precisa ser validada; upgrade e obrigatorio se build/runtime/HTTPS/logs/rollback nao ficarem estaveis.
- Analytics, feedback beta e auditoria de IA devem aplicar retencao de 90 dias quando houver persistencia real.

Nunca usar `NEXT_PUBLIC_` para OpenAI, service role, provider secrets, webhook secrets ou tokens.
Nunca usar `NEXT_PUBLIC_` para DeepSeek.

## Cutover Supabase preview

Variaveis de operador para `docs/SUPABASE_PREVIEW_CUTOVER.md`. Nao colocar no Git, no browser ou em variaveis publicas do app.

- `SUPABASE_ACCESS_TOKEN`: secret para CLI Supabase.
- `SUPABASE_PREVIEW_DB_URL`: URL Postgres da branch preview; contem senha e deve ser tratada como secret.
- `SUPABASE_PREVIEW_CONFIRM=preview`: trava explicita antes de rodar harness mutavel.
- `SUPABASE_TYPES_OUTPUT`: opcional; padrao `src/types/database.ts`.
- `SUPABASE_PREVIEW_KEEP_FIXTURES`: opcional; `1` preserva fixtures apenas para depuracao manual em branch sem dados reais.
- `SUPABASE_SKIP_STORAGE_RLS`: opcional; `1` pula storage no harness quando a Storage API do preview ainda nao estiver disponivel.

Scripts:

```powershell
npm.cmd run supabase:types:preview
npm.cmd run supabase:validate:preview
```

Enquanto `npm.cmd run supabase:types:preview` nao rodar contra preview aprovado, `DB-TYPES-001` permanece aberto e `src/types/database.ts` nao deve ser tratado como schema real validado.
