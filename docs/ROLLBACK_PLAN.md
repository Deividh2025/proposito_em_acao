# Rollback Plan

Data: 2026-06-02.

## Escopo

Plano de rollback para preview/producao do Proposito em Acao, cobrindo app Next.js, Supabase, Auth, secrets, PWA/service worker e dominio.

## Gatilhos de rollback

- Build/deploy publica versao quebrada.
- Auth real falha em signup, login, confirmacao, redirect ou logout.
- RLS permite acesso entre usuarios ou Atalaia ve dados privados.
- Service worker cacheia rota/dado sensivel ou quebra navegacao.
- Secret aparece em log, bundle, HTML, console ou Git.
- OpenAI/DeepSeek/e-mail real dispara sem aprovacao ou vaza dado sensivel.
- Erro critico repetido no console/logs em fluxo principal.

## App

Coolify/Hostinger VPS:

1. Reverter para deployment anterior conhecido como bom no Coolify.
2. Confirmar URL ativa.
3. Rodar smoke minimo: home, `/auth`, `/dashboard`, `/mobile`.
4. Registrar incidente em `docs/SMOKE_TEST_REPORT.md` ou relatorio proprio.

Rollback manual na VPS, se Coolify falhar:

1. Manter release anterior identificada antes do deploy.
2. Reverter para build anterior ou ZIP anterior salvo.
3. Reiniciar processo Node quando aplicavel.
4. Conferir logs e URL.
5. Rodar smoke minimo.

Vercel passa a ser alternativa de contingencia, nao plataforma principal.

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
