# Onboarding Flow

## Objetivo

O onboarding do Prompt 6 conduz o usuario por:

1. Boas-vindas.
2. Perfil essencial.
3. Mapa da Vida.
4. Chamado Pessoal em discernimento.
5. Dashboard inicial de direcao.

O principio e: antes de organizar agenda, entender direcao.

## UX

- Uma acao principal por etapa.
- `Salvar e continuar depois` sempre disponivel apos iniciar.
- Linguagem de rascunho e retomada, sem culpa.
- Campos sensiveis podem ficar em branco.
- Modo baixa energia: responder o minimo e amadurecer depois.

## Persistencia

`src/app/onboarding/actions.ts` prepara salvamento server-side com Supabase SSR:

- `profiles`
- `user_preferences`
- `life_areas`
- `life_map_assessments`
- `life_map_area_scores`
- `callings`
- `calling_session_entries`

Se Supabase/Auth nao estiverem configurados ou nao houver sessao, a action retorna modo `local-draft` e nao promete persistencia real.

## Privacidade

Perfil, fe, familia, saude, emocoes, Mapa da Vida e Chamado sao sensiveis. O fluxo nao usa `localStorage` para conteudo intimo e nao envia dados ao Atalaia.

## IA

A etapa usa mock deterministico seguro para a hipotese de Chamado. Nenhuma chamada real a OpenAI e feita no Prompt 6.

## Aceite

- Usuario inicia o fluxo em `/onboarding`.
- Usuario preenche perfil essencial.
- Usuario preenche Mapa da Vida e recebe feedback visual.
- Usuario responde Chamado e gera hipotese segura editavel.
- Usuario aceita a hipotese como provisoria.
- Dashboard inicial mostra estado da jornada e progressao assistida.

## Pendencias

- Auth UI real.
- Migrations aplicadas no Supabase remoto/local.
- Testes RLS por persona.
- Consentimento versionado antes de coleta produtiva.
- Retencao, exportacao e exclusao de dados pessoais.
