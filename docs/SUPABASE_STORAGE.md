# Supabase Storage

## Buckets

Criados pela migration `202605310003_private_storage.sql`:

- `user-uploads`
- `inbox-attachments`
- `commitment-documents`

Todos sao privados.

## Convencao de path

Objetos devem usar:

```txt
{user_id}/{resource_type}/{resource_id}/{filename}
```

Exemplo:

```txt
00000000-0000-0000-0000-000000000000/inbox/11111111-1111-1111-1111-111111111111/anexo.pdf
```

## Policies

Usuario autenticado acessa apenas objetos cujo primeiro segmento do path e seu `auth.uid()`.

## Atalaia

Atalaia nao recebe acesso direto ao storage. Se um documento for compartilhado, o servidor deve validar grant, consentimento e previa antes de gerar signed URL curta.

## Riscos

- Arquivo pode conter dado sensivel mesmo quando o nome parece inocente.
- `commitment-documents` pode expor informacoes intimas se compartilhado sem previa.
- Signed URLs devem ter expiracao curta e ser auditadas.
