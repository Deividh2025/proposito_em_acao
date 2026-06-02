# Environment Variables

## Regra geral

`.env.example` contem somente placeholders. Valores reais devem ficar em `.env.local` local ou no cofre de secrets do provedor.

## App

- `NEXT_PUBLIC_APP_NAME`: nome publico do app.
- `NEXT_PUBLIC_APP_URL`: URL publica do ambiente.

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
