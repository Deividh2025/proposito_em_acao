# Supabase Preview Cutover Pack

Data: 2026-06-02.

## Status

Pack preparado para execucao revisavel em branch preview do Supabase. Esta rodada nao aplicou migrations, nao criou branch remota e nao alterou dados remotos.

Use este roteiro somente em ambiente preview isolado, sem dados reais de usuario. Producao aberta e beta com usuarios reais continuam bloqueados ate haver evidencia fresca de migrations, tipos, Auth, RLS, smoke publicado, LGPD minima e rollback.

## Fronteiras

- Nao rodar contra producao.
- Nao usar service role em browser, app mobile, logs, docs ou `NEXT_PUBLIC_*`.
- Nao coletar dados reais no harness; ele cria apenas fixtures ficticios e tenta remove-los no final.
- Nao considerar SQL versionado como validacao remota.
- Se o historico remoto estiver divergente, pausar e registrar a diferenca antes de qualquer repair.

## Variaveis operacionais

Definir somente no terminal do operador, cofre temporario ou CI seguro. Nao commitar.

| Variavel | Uso | Sensibilidade |
|---|---|---|
| `SUPABASE_PROJECT_ID` | Project ref para CLI/branch/typegen quando aplicavel. | Nao secret. |
| `SUPABASE_ACCESS_TOKEN` | CLI Supabase autenticado para branch operations. | Secret. |
| `SUPABASE_PREVIEW_DB_URL` | URL Postgres da branch preview para `db push`, lint e typegen. | Secret. |
| `NEXT_PUBLIC_SUPABASE_URL` | URL publica da branch/projeto usada pelo app e harness. | Publica. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/publishable key da branch/projeto. | Publica. |
| `SUPABASE_SERVICE_ROLE_KEY` | Apenas harness/operador para criar fixtures Auth e limpar. | Secret critico. |
| `SUPABASE_PREVIEW_CONFIRM` | Deve ser `preview` para liberar o harness mutavel. | Controle operacional. |
| `SUPABASE_TYPES_OUTPUT` | Opcional; caminho de saida dos tipos. Padrao: `src/types/database.ts`. | Nao secret. |
| `SUPABASE_PREVIEW_KEEP_FIXTURES` | Opcional; `1` preserva fixtures para depuracao manual. | Controle operacional. |
| `SUPABASE_SKIP_STORAGE_RLS` | Opcional; `1` pula storage se o preview ainda nao expuser Storage API. | Controle operacional. |

## Mapa ordenado de migrations

| Ordem | Migration | Objetivo | Validacao principal |
|---:|---|---|---|
| 1 | `202605310001_initial_schema.sql` | Schema base, `app_private`, 34 tabelas, FKs compostas, indices e triggers Auth/profile. | Tabelas existem; trigger cria `profiles`; FKs compostas bloqueiam filhos cross-owner. |
| 2 | `202605310002_rls_policies.sql` | RLS/force RLS em tabelas base, owner-only e Atalaia limitado. | Dono CRUD proprio; user B/anon negados; Atalaia sem base tables sensiveis. |
| 3 | `202605310003_private_storage.sql` | Buckets privados e policies por prefixo `{auth.uid()}/...`. | Upload/download owner-only; user B e Atalaia negados. |
| 4 | `202605310004_onboarding_calling_metadata.sql` | Metadados preparatorios de Chamado/onboarding. | Chamado permanece privado e owner-only. |
| 5 | `202605310005_execution_prompt8_alignment.sql` | Alvos/projetos/tarefas/microtarefas, status e trigger de integridade projeto-alvo. | User B nao cria filhos apontando goal/project/task de user A. |
| 6 | `202605310006_calendar_inbox_prompt9_alignment.sql` | Calendario e Inbox/GTD, classificacao e indices. | Calendario/inbox seguem owner-only; destinos polimorficos exigem servidor. |
| 7 | `202605310007_action_unblocker_metacognition_prompt10_alignment.sql` | Desbloqueador e Metacognicao privados, crise, schemas e FKs. | Metacognicao nao vaza para user B, anon ou Atalaia. |
| 8 | `202605310008_focus_habits_scoreboard_prompt11_alignment.sql` | Foco, distracoes, habitos, Placar e idempotencia. | Placar/distracoes/foco/habitos seguem owner-only. |
| 9 | `202605310009_weekly_review_garden_prompt12_alignment.sql` | Revisao Semanal e Jardim com RLS reforcado. | Revisao/Jardim sem Atalaia direto; eventos com metadados minimos. |
| 10 | `202606010010_accountability_commitment_prompt13_alignment.sql` | Atalaia, convites, grants, notificacoes e Documento de Compromisso. | Atalaia le somente grants/eventos/notificacoes/documentos autorizados. |
| 11 | `202606010011_mobile_pwa_prompt14_alignment.sql` | `energy_checkins` owner-only para mobile/PWA. | Tabela tem privilegio/RLS real para authenticated e nega user B/Atalaia. |
| 12 | `20260602214345_accountability_partner_active_select_policy.sql` | Permite Atalaia ler somente a propria relacao ativa aceita. | Atalaia ativo le propria relacao; Atalaia revogado nao le. |

## Roteiro de aplicacao em branch preview

### 0. Preflight local

```powershell
git status --short --branch
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Registrar branch Git, commit, data/hora, operador e se havia worktree sujo antes do cutover.

### 1. Preparar branch preview Supabase

Preferir branch preview nova/data-less para evitar repair de historico. Se uma branch antiga existir, listar antes e decidir se sera reutilizada ou recriada.

```powershell
npx.cmd -y supabase --version
npx.cmd -y supabase branches list --project-ref "$env:SUPABASE_PROJECT_ID"
npx.cmd -y supabase branches create preview-release-readiness --project-ref "$env:SUPABASE_PROJECT_ID"
npx.cmd -y supabase branches get preview-release-readiness --project-ref "$env:SUPABASE_PROJECT_ID"
```

Copiar a DB URL da branch preview para `SUPABASE_PREVIEW_DB_URL` somente no terminal/cofre. Nao registrar senha em docs.

### 2. Reconciliar historico antes de aplicar

```powershell
npx.cmd -y supabase migration list --db-url "$env:SUPABASE_PREVIEW_DB_URL"
npx.cmd -y supabase db push --dry-run --db-url "$env:SUPABASE_PREVIEW_DB_URL"
```

Se aparecer migration remota equivalente com timestamp diferente, como `20260602134002 mobile_pwa_prompt14_alignment` versus `202606010011_mobile_pwa_prompt14_alignment`, pausar. Caminho preferido: recriar branch preview sem dados e aplicar o conjunto local inteiro. `migration repair` so pode ser usado em branch preview sem dados reais, com diff revisado e evidencia registrada.

### 3. Aplicar migrations no preview

```powershell
npx.cmd -y supabase db push --db-url "$env:SUPABASE_PREVIEW_DB_URL"
npx.cmd -y supabase migration list --db-url "$env:SUPABASE_PREVIEW_DB_URL"
npx.cmd -y supabase db lint --db-url "$env:SUPABASE_PREVIEW_DB_URL"
```

Evidencia minima:

- Lista final de migrations aplicadas ate `20260602214345`.
- Resultado de lint/advisors.
- Confirmacao de RLS habilitado nas tabelas publicas.
- Confirmacao de buckets privados.

### 4. Gerar tipos reais

```powershell
$env:SUPABASE_TYPES_OUTPUT="src/types/database.ts"
npm.cmd run supabase:types:preview
npm.cmd run typecheck
```

Revisar o diff de `src/types/database.ts`. Nao aceitar tipos vazios/genericos depois do cutover. Se o typecheck falhar, corrigir o codigo ou registrar bloqueio antes de seguir.

### 5. Validar Auth/RLS dinamico

O harness usa service role apenas no ambiente do operador para criar/remover usuarios ficticios. Ele valida login com anon key e operacoes via RLS das personas.

```powershell
$env:SUPABASE_PREVIEW_CONFIRM="preview"
$env:NEXT_PUBLIC_SUPABASE_URL="https://SEU-PREVIEW.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY="anon-ou-publishable-key"
$env:SUPABASE_SERVICE_ROLE_KEY="service-role-do-preview"
npm.cmd run supabase:validate:preview
```

Cobertura automatizada:

- Cria `user_a`, `user_b`, `atalia-active` e `atalia-revoked` ficticios.
- Confirma sign-in por Auth com anon key.
- Confirma que `user_a` cria/le Chamado, alvo, Metacognicao, energia, Atalaia, grant, notificacao e Documento de Compromisso.
- Cria evento minimo por service role do operador para validar leitura RLS de Atalaia, sem expor escrita de evento ao cliente.
- Confirma que `user_b` e anon nao leem dados privados de `user_a`.
- Confirma que `user_b` nao cria filhos apontando parent de `user_a`.
- Confirma que Atalaia ativo le somente relacao/grant/evento/notificacao/documento autorizado.
- Confirma que Atalaia ativo nao le `goals`, `callings`, `metacognition_sessions` nem `energy_checkins`.
- Confirma que Atalaia revogado nao le relacao/grant revogado.
- Confirma storage privado owner-only, salvo `SUPABASE_SKIP_STORAGE_RLS=1`.
- Remove usuarios e fixtures ao final, salvo `SUPABASE_PREVIEW_KEEP_FIXTURES=1`.

### 6. Validar Auth real publicado

Depois do deploy Coolify/Hostinger e da URL HTTPS:

1. Configurar `NEXT_PUBLIC_APP_URL` com a URL publicada.
2. Configurar Site URL e redirect URLs no Supabase Auth para local, preview e futuro dominio final.
3. Manter protecao de senha vazada ativa.
4. Criar conta ficticia pelo fluxo `/auth`.
5. Confirmar e-mail/redirect se a politica de e-mail estiver ativa; caso contrario registrar o modo usado no preview.
6. Validar login, sessao SSR, dashboard, logout e expiracao.

### 7. Smoke externo

```powershell
$env:PLAYWRIGHT_BASE_URL="https://URL-DE-PREVIEW"
npm.cmd run test:e2e:external
Invoke-WebRequest -UseBasicParsing "$env:PLAYWRIGHT_BASE_URL/api/health"
```

Usar dados ficticios e nao sensiveis. Registrar resultado em `docs/SMOKE_TEST_REPORT.md`.

## Rollback

Supabase preview:

- Antes de aplicar migrations: descartar branch preview e recriar.
- Depois de aplicar migrations, se ainda sem dados reais: deletar/recriar branch preview e repetir desde o passo 1.
- Nao fazer rollback manual em producao aberta sem backup, janela aprovada e plano proprio.
- Se service role ou DB URL vazarem em logs, rotacionar imediatamente.

App preview:

- Reverter deployment no Coolify para imagem anterior.
- Remover URL de redirect insegura no Supabase Auth.
- Remover usuarios ficticios remanescentes.
- Reexecutar `/api/health` e smoke minimo.

## Evidencia a registrar

```md
Data/hora:
Operador:
Git branch/commit:
Supabase project ref:
Preview branch:
Migrations antes:
Dry-run:
Migrations depois:
Lint/advisors:
Typegen:
Harness Auth/RLS:
Auth publicado:
Smoke externo:
Fixtures removidos:
Bloqueios:
Decisao:
```

## Checklist de aceite

- [ ] Branch preview confirmada como isolada e sem dados reais.
- [ ] Migrations locais aplicadas na ordem ate `20260602214345`.
- [ ] Divergencia de historico remoto reconciliada ou branch recriada.
- [ ] Tipos reais gerados em `src/types/database.ts` e revisados.
- [ ] `npm.cmd run typecheck` passou com os tipos reais.
- [ ] Harness `npm.cmd run supabase:validate:preview` passou.
- [ ] Auth real validado na URL publicada.
- [ ] Smoke externo passou via HTTPS.
- [ ] Logs nao contem service role, DB URL, prompts privados ou dados sensiveis.
- [ ] Docs de RLS, release, beta e smoke foram atualizadas com evidencia fresca.
