# Mobile Privacy

## Principio

Mobile/PWA e superficie de conveniencia, nao area para armazenar conteudo sensivel offline. Dados de fe, saude, familia, financas, emocoes, Metacognicao, Inbox, calendario, habitos, Placar, energia, Atalaia e notificacoes continuam privados por padrao.

## Armazenamento local

Nesta etapa e proibido armazenar conteudo sensivel em:

- `localStorage`;
- `sessionStorage`;
- IndexedDB;
- CacheStorage;
- query string;
- logs de navegador;
- notificacoes push.

O service worker cacheia apenas assets estaticos, manifest, icones e pagina offline segura. A aprovacao pre-Prompt 15 manteve proibida qualquer fila offline de conteudo sensivel.

## Energia

`energy_checkins` registra energia baixa, media ou alta com observacao opcional. E dado sensivel porque pode revelar saude, sono, rotina e estado emocional. A tabela deve permanecer owner-only por `user_id`.

## Metacognicao e Desbloqueador

Metacognicao mobile reutiliza schema existente, permanece privada por padrao e nao vai ao Atalaia. Desbloqueador mobile usa mock seguro, guardrails de crise e saida revisavel.

## Atalaia e notificacoes

Nada do mobile e compartilhado automaticamente com Atalaia. Push notifications e qualquer lembrete com conteudo sensivel ficam fora antes do Prompt 15 e exigem prompt proprio.

## Fallback local/dev

Quando nao ha Auth/Supabase, a UI deve dizer que o registro e local/dev. Esse fallback nao deve ser apresentado como persistencia produtiva confirmada.
