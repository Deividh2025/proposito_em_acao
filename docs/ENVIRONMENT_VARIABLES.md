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

Valores de desenvolvimento local registrados em `.env.local`:

- Projeto Supabase: `https://bceumcfmjftoukzrfthe.supabase.co`.
- Project ref: `bceumcfmjftoukzrfthe`.
- Chave publicavel: armazenada em `NEXT_PUBLIC_SUPABASE_ANON_KEY` para manter compatibilidade com os helpers atuais.
- `SUPABASE_SERVICE_ROLE_KEY`: nao informado e deve permanecer vazio ate etapa administrativa propria.

## OpenAI

- `OPENAI_API_KEY`: chave server-side; nunca prefixar com `NEXT_PUBLIC_`.

## Email

- `EMAIL_PROVIDER`: provedor futuro.
- `EMAIL_FROM`: remetente futuro.

## Environment

- `NODE_ENV`: `development`, `test` ou `production`.

## Checklist

- Nao commitar `.env` real.
- Nao registrar secrets em logs.
- Rotacionar qualquer secret exposto.
- Separar variaveis por ambiente.
