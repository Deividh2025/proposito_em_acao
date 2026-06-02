# RLS Test Report - Prompt 15

Data: 2026-06-02.

## Escopo

Revisao de policies locais, regressao estatica de SQL e consulta remota limitada via Supabase plugin.

## Testes criados

- `src/tests/unit/rls-policy-safety.test.ts`

Este teste garante que policies de Atalaia nao fiquem apenas em `user_id + goal_id + permission`, exigindo tambem parceiro/grant especificos para grants, eventos e notificacoes.

## Correcoes aplicadas

- `accountability_grants`: select do Atalaia agora restringe pelo parceiro autenticado e pelo grant especifico.
- `accountability_events`: select do Atalaia exige evento vinculado ao grant/parceiro especifico.
- `accountability_notifications`: regressao confirma dependencia de grant/parceiro especifico.

## Validacao remota

- Projeto Supabase ativo encontrado: `bceumcfmjftoukzrfthe`.
- Advisors de seguranca nao retornaram lints.
- Migrations remotas listadas nao cobrem todo o conjunto local da V1, entao a validacao RLS remota completa permanece pendente.

## Matriz minima pendente

- `user_a` cria/le/atualiza/deleta dados proprios.
- `user_b` nao acessa dados de `user_a`.
- `user_b` nao cria filhos apontando para parents de `user_a`.
- Atalaia autorizado le somente alvo/grant permitido.
- Outro Atalaia no mesmo alvo nao le grant/evento/notificacao alheia.
- Atalaia revogado perde acesso.
- Metacognicao, Chamado e Revisao Semanal seguem privados.
- Storage privado bloqueia acesso fora do prefixo do usuario.

## Status

A regressao local passou. Deploy produtivo deve aguardar execucao dinamica em Supabase branch/preview.

## Addendum Prompt 16

Data: 2026-06-02.

Consulta Supabase real confirmou:

- Projeto `bceumcfmjftoukzrfthe` esta ativo.
- Migrations remotas listadas: apenas `20260602134002 mobile_pwa_prompt14_alignment`.
- Tabelas publicas visiveis nao cobrem a V1 completa.

Conclusao: matriz RLS dinamica continua bloqueante antes de producao aberta ou beta com usuarios reais.

## Addendum Preview Branch

Data: 2026-06-02.

Preview Supabase criado para validacao antes de producao:

- Branch preview: `preview-release-readiness`.
- Migrations locais foram aplicadas no preview depois de reconciliar historico equivalente da migration mobile/PWA.
- Matriz dinamica inicial confirmou isolamento owner-only e privacidade de Metacognicao.
- Falha encontrada: Atalaia ativo nao conseguia ler grant/evento autorizado porque as policies dependiam de `accountability_partners`, mas o parceiro ativo nao tinha leitura da propria relacao.
- Correcao versionada: `20260602214345_accountability_partner_active_select_policy.sql` permite ao Atalaia ler somente sua propria relacao ativa, aceita e nao revogada.

Validacao final executada no preview:

- Atalaia ativo le propria relacao, grant ativo e evento minimo autorizado.
- Atalaia ativo nao le `goals` nem `metacognition_sessions`.
- Atalaia revogado nao le a propria relacao revogada nem grant revogado.
- Outro usuario continua sem acesso ao alvo e a Metacognicao do dono.
- Anonimo nao le alvo privado.
- Fixtures temporarios foram removidos apos a matriz; contagem remanescente retornou `0`.

Status: matriz RLS dinamica passou no branch preview. Producao aberta ainda depende de Auth real, secrets/deploy, LGPD minima e smoke test publicado.
