# Open Questions

## Produto

- Nome final do modulo de Metacognicao.
- Intensidade padrao da camada crista.
- Publico inicial prioritario.
- Nivel inicial de gamificacao do Jardim da Vida.
- Modelo comercial.
- Materiais proprietarios para base de conhecimento da IA.

## Tecnico

- Biblioteca de calendario.
- Biblioteca de drag-and-drop.
- Biblioteca de componentes, se houver.
- Estrategia final de observabilidade produtiva: provider first-party/externo, retencao, consentimento, acesso e agregacao.
- Canal/formulario externo de feedback beta e politica de acesso/retencao.
- Se analytics real fica desligado no primeiro beta ou coleta apenas eventos consentidos.
- Rerun fresco de migrations, typegen e matriz RLS antes de beta real/producao.
- Estrategia final de testes automatizados de RLS com CLI/MCP.

## Supabase

- Quem aplicara as migrations no projeto remoto e com qual janela de backup.
- Se a V1 exigira portal autenticado para Atalaia ou links expiraveis antes de conta propria.
- Politica de retencao antes da primeira coleta real de dados sensiveis.

## Decisoes fechadas em 2026-06-02

- Prompt 14: PWA responsivo complementar segue aprovado como estrategia mobile antes do Prompt 15.
- Prompt 14: app nativo fica fora ate validacao do PWA em uso real.
- Prompt 14: push notifications ficam fora ate prompt proprio.
- Prompt 14: offline sensivel/fila de sincronizacao fica fora; offline continua limitado a shell segura.
- Prompt 14: migration `mobile_pwa_prompt14_alignment` aplicada no Supabase real `proposito_em_acao`.
- Prompt 16: plataforma principal de deploy sera VPS Hostinger com Coolify; Vercel fica como contingencia.
- Prompt 16: providers planejados de IA real sao OpenAI API e DeepSeek API, ainda desativados por padrao ate aprovacao operacional.
- Prompt 17: Atalaia permanece na V1 em profundidade basica, por alvo/grant/permissao, com expansoes avancadas para V1.1/V2.
