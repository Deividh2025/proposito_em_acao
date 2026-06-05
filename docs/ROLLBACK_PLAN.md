# Rollback Plan

Data: 2026-06-05.

## Escopo

Plano de rollback para preview/producao do Proposito em Acao, cobrindo app Next.js, Supabase, Auth, secrets, PWA/service worker e dominio.

## Estado atual verificado em 2026-06-03

- Ainda nao ha releases, tags ou deployments publicados no GitHub.
- Rollback existe como plano, mas nao e executavel para producao aberta ate existir release/deployment anterior conhecido como bom.
- Coolify/Hostinger KVM 1 precisam de rehearsal antes do beta real.
- Qualquer rollback que toque dados reais, Supabase principal, dominio ou usuarios exige aprovacao do fundador.

## Etapa 8 - preview Hostinger/Coolify

Status: documentacao de rollback preparada para preview, sem deploy real. Preview HTTPS segue pendente porque ainda nao ha dominio/URL aprovado, VPS Hostinger provisionada, Coolify validado, secrets de preview configurados, Supabase/Auth/RLS fresco ou smoke externo.

Bloqueadores relacionados:

- `OPS-GH-001`: CI/branch protection/release ainda nao dao rollback referenciavel suficiente para release publica.
- `OPS-DOCKER-001`: imagem Docker, healthcheck e rollback Coolify ainda nao foram ensaiados em VPS.
- `OPS-HEALTH-001`: `/api/ready` existe localmente, mas ainda nao foi validado por smoke externo em URL HTTPS.

Gate KVM 1: a Hostinger VPS KVM 1 so pode hospedar beta real se sustentar build, runtime, logs, HTTPS, backup basico e rollback Coolify com estabilidade. Se CPU, memoria, disco, build time, restart, proxy, logs ou rollback ficarem instaveis, pausar convites e fazer upgrade antes do beta.

## Gatilhos de rollback

- Build/deploy publica versao quebrada.
- Auth real falha em signup, login, confirmacao, redirect ou logout.
- RLS permite acesso entre usuarios ou Atalaia ve dados privados.
- Service worker cacheia rota/dado sensivel ou quebra navegacao.
- Secret aparece em log, bundle, HTML, console ou Git.
- OpenAI/DeepSeek/e-mail real dispara sem aprovacao ou vaza dado sensivel.
- Erro critico repetido no console/logs em fluxo principal.
- `/api/ready` falha depois do deploy, retorna sucesso quando configuracao essencial esta ausente ou diverge de `/api/health`.
- Coolify aponta para commit/tag errado, perde variaveis, nao consegue reiniciar ou deixa container em restart loop.
- KVM 1 mostra saturacao sustentada de CPU/memoria/disco, build instavel, OOM, logs indisponiveis ou HTTPS/proxy instavel.
- Smoke externo encontra rota critica quebrada, cookie/Auth inconsistente, cache PWA sensivel ou demo fora de `local-demo`.

## App

Coolify/Hostinger VPS:

1. Antes do deploy, registrar commit SHA, tag/release ou deployment anterior conhecido como bom.
2. No Coolify, usar rollback/redeploy do deployment anterior conhecido como bom.
3. Confirmar que dominio/HTTPS apontam para a versao revertida.
4. Rodar smoke minimo: home, `/auth`, `/dashboard`, `/mobile`, `/api/health` e `/api/ready`.
5. Conferir logs do container/proxy sem copiar secrets, tokens, corpo de e-mail, prompts ou dados intimos.
6. Registrar incidente em `docs/SMOKE_TEST_REPORT.md` ou relatorio proprio.

Rollback manual na VPS, se Coolify falhar:

1. Manter release anterior identificada antes do deploy.
2. Reverter para build anterior ou ZIP anterior salvo.
3. Reiniciar processo Node quando aplicavel.
4. Conferir logs e URL.
5. Rodar smoke minimo.

Vercel passa a ser alternativa de contingencia, nao plataforma principal.

Gate: antes de beta real, criar release/tag ou registro de deployment que permita identificar claramente a versao anterior boa.

Rehearsal obrigatorio antes de beta:

1. Fazer deploy de preview com dados ficticios.
2. Capturar commit/deployment atual e anterior.
3. Simular rollback para versao anterior sem alterar Supabase principal.
4. Rodar smoke externo em URL HTTPS.
5. Registrar tempo de recuperacao, logs consultados, responsavel e resultado.
6. Se o rollback depender de passo manual improvisado, manter beta/producao bloqueados.

## Supabase

Antes de migration com dados reais:

- Fazer backup/export aprovado.
- Registrar migrations pendentes e aplicadas.
- Preferir migrations aditivas.
- Preparar down/rollback manual revisado quando a mudanca puder afetar dados.

Rollback:

1. Parar novas escritas se houver risco de vazamento.
2. Reverter app para versao anterior se a falha for de contrato app-banco.
3. Aplicar script de reversao apenas com aprovacao e backup.
4. Validar matriz RLS afetada.
5. Gerar relatorio de incidente.

## Auth

1. Remover URL de redirect insegura.
2. Restaurar Site URL/redirect anterior.
3. Invalidar sessoes se houver risco de token.
4. Rodar signup/login/logout de teste.

## Secrets

1. Revogar/rotacionar secret exposto.
2. Remover valor do provedor/Git/log afetado.
3. Rebuild/redeploy para garantir bundle sem valor antigo.
4. Auditar `NEXT_PUBLIC_*` contra secrets.

## PWA/service worker

1. Publicar `sw.js` corrigido com nova versao de cache.
2. Manter `sw.js` com `Cache-Control: no-store`.
3. Validar que navegacao offline cai em `/offline`.
4. Conferir que caches antigos nao contem dados sensiveis.

## Comunicacao

Beta fechado:

- Informar instabilidade sem expor detalhes sensiveis.
- Pedir pausa no uso se houver risco de privacidade.
- Confirmar quando ambiente voltar ao estado seguro.

## Responsaveis

- Fundador: aprovar rollback que toque dados, dominio ou usuarios reais.
- Engenharia: executar rollback tecnico e registrar evidencias.
- Seguranca: validar RLS/secrets/logs antes de reabrir acesso.

## Etapa 9 - rollback drill

Data: 2026-06-05.

Status: rollback drill nao executado. Este e bloqueio de beta real.

Evidencia:

- Nao ha URL HTTPS publicada, VPS/Coolify validado, release/tag ou deployment anterior conhecido como bom.
- `docker version` encontrou Docker CLI 29.4.2, mas nao conectou ao daemon `dockerDesktopLinuxEngine`.
- Sem container local, sem deploy Coolify e sem deployment anterior, nao ha como ensaiar rollback de app de forma confiavel nesta etapa.

Decisao:

- Manter beta fechado bloqueado ate existir deploy preview com commit/deployment anterior conhecido, smoke externo antes/depois e registro de tempo de recuperacao.
- Nao substituir rollback drill por plano documental. Plano existe, mas o criterio de GO exige ensaio real.
