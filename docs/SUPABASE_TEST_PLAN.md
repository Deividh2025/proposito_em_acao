# Supabase Test Plan

## Estado

O CLI Supabase esta disponivel localmente, mas testes RLS reais ainda dependem de branch/preview ou ambiente local/remoto configurado e aprovado. SQL versionado nao substitui harness dinamico no ambiente correto.

## Gates

1. Aplicar migrations em ambiente controlado.
2. Criar personas `anon`, `user_a`, `user_b`, `atalia_invited`, `atalia_active`, `atalia_revoked`.
3. Validar CRUD do dono.
4. Validar isolamento entre usuarios.
5. Validar que child records nao apontam para parent de outro usuario.
6. Validar Atalaia por grant ativo, outro alvo, grant revogado, permissao ausente e convidado sem escalada de escopo.
7. Validar Metacognicao privada.
8. Validar storage privado por path.
9. Validar que aceite ativa apenas o grant associado ao token hash do convite especifico.
10. Gerar tipos reais apos schema aprovado.

## Comandos

```powershell
supabase start
supabase db reset
supabase db lint
supabase migration list --local
npm run lint
npm run typecheck
npm run build
```

## Evidencia esperada

- Saida dos comandos.
- Prints ou logs do SQL Editor quando CLI nao estiver disponivel.
- Lista das policies revisadas.
- Confirmacao de que nenhum secret entrou no diff.
