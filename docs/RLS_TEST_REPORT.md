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
