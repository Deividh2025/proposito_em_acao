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

## OpenAI

- `OPENAI_API_KEY`: chave server-side; nunca prefixar com `NEXT_PUBLIC_`.
- `OPENAI_MODEL`: modelo OpenAI aprovado por ambiente/fluxo; nao e secret, mas deve ser controlado por ambiente.

## DeepSeek

- `DEEPSEEK_API_KEY`: chave server-side; nunca prefixar com `NEXT_PUBLIC_`.
- `DEEPSEEK_BASE_URL`: base URL server-side. Valor planejado: `https://api.deepseek.com`.
- `DEEPSEEK_MODEL_FLASH`: modelo DeepSeek rapido/custo menor. Valor planejado: `deepseek-v4-flash`.
- `DEEPSEEK_MODEL_PRO`: modelo DeepSeek de maior capacidade. Valor planejado: `deepseek-v4-pro`.

DeepSeek foi aprovado como provider planejado pelo fundador, junto com OpenAI. Ativacao real ainda exige guardrails, evals, custos, rate limit e roteamento por agente.

## Email

- `EMAIL_PROVIDER`: provedor futuro. Vazio significa nenhum envio real e status `pending_provider_config`.
- `EMAIL_FROM`: remetente futuro. Deve ficar vazio ate haver dominio/remetente aprovado.

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

Obrigatorias em preview/producao:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_BETA_FEEDBACK_URL`, se formulario externo do beta for aprovado.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_PROJECT_ID`
- `NODE_ENV`

Manter vazias/desativadas ate aprovacao explicita:

- `SUPABASE_SERVICE_ROLE_KEY`, salvo necessidade server-side controlada.
- `OPENAI_API_KEY`, ate aprovar modelo, custo, rate limit e evals ampliados.
- `DEEPSEEK_API_KEY`, ate aprovar custo, rate limit, evals ampliados e roteamento por agente.
- `EMAIL_PROVIDER` e `EMAIL_FROM`, ate aprovar provider, remetente e templates.

Nunca usar `NEXT_PUBLIC_` para OpenAI, service role, provider secrets, webhook secrets ou tokens.
Nunca usar `NEXT_PUBLIC_` para DeepSeek.
