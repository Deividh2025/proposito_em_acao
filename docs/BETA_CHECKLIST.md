# Beta Checklist

Data de sincronizacao: 2026-06-21.

## Status

A plataforma do projeto "Propósito em Ação" foi totalmente estruturada, testada localmente e implantada em produção na VPS Oracle Cloud com Coolify e banco Supabase remoto, sob o domínio principal `https://proposito-em-acao.app.br`. O escopo da V1 está 100% concluído em largura. O projeto está **Pronto para Lançamento de Produção**, restando apenas a ativação manual das chaves de API e variáveis de produção no painel do Coolify.

## Decisoes fechadas

- [x] Infraestrutura: Oracle Cloud VPS com Coolify (Hostinger VPS KVM 1 descartada).
- [x] Dominio adquirido e configurado: `proposito-em-acao.app.br` (Registro.br).
- [x] Banco de Dados: Supabase principal (`bceumcfmjftoukzrfthe` na regiao sa-east-1) com cutover de schema completo concluído em 15/06/2026.
- [x] Roteamento de IA: Unificado na API do DeepSeek (via NVIDIA NIM Integration) como modelo padrão, e as preferências de OpenAI foram ocultadas nas configurações.
- [x] IA real permanece dependente do consentimento granular por provedor, com auditoria persistida em `ai_run_audits`.
- [x] E-mail transacional: Resend com SMTP customizado do Supabase Auth e webhook assinado de status.
- [x] Analytics: First-party no Supabase, com opt-in desligado por padrão.
- [x] Retencao de dados: 90 dias para analytics, feedback beta e metadados de auditoria de IA.

## Fundador precisa aprovar/configurar (No painel do Coolify/Resend)

- [x] Dominio exato de preview/producao: `proposito-em-acao.app.br` (Concluído).
- [ ] Chaves de API reais de produção (`DEEPSEEK_API_KEY`, `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) a serem coladas no painel.
- [ ] Ativação das flags de produção (`AI_REAL_ENABLED`, `EMAIL_REAL_ENABLED`, `ANALYTICS_REAL_ENABLED`, `FEEDBACK_REAL_ENABLED`).
- [ ] Grupo inicial de usuarios beta e termos mínimos de privacidade/uso.

## Engenharia (Concluido e Validado)

- [x] Gates locais de lint/typecheck/test passaram com sucesso em todas as auditorias.
- [x] Plano de beta, feedback, suporte, incident response e V1.1 estruturados.
- [x] Cutover do Supabase principal concluído com 38 tabelas com RLS forçado, 134 políticas aplicadas e sem lints de segurança.
- [x] Hardening de RLS e performance no Supabase aplicado com índices para FKs compostas e otimização `auth.jwt()`.
- [x] Fundação local de Auth SSR implementada (proxy, callback, confirmação, recovery, logout, redirects seguros e rotas protegidas).
- [x] Camada server-side de IA estruturada com guardrails de entrada/saída (incluindo crise e Atalaia), consentimento e logs de auditoria redigidos.
- [x] Adapter Resend server-only, templates neutros, webhook de entrega assinado e controle de envio integrados.
- [x] Página de configurações `/settings` com consentimentos, analytics opt-in, feedback e exportação/exclusão em conformidade com LGPD.
- [x] PWA responsivo complementar com manifest, service worker conservador e tratamento offline/energia móvel.
- [x] Divisão de CI do GitHub concluída em jobs independentes `quality` e `e2e` na branch protection da `main`.
- [x] Rollback de containers no Coolify planejado e testado com base em deployment anterior.
- [x] API de prontidão `/api/ready` implementada com falha fechada caso segredos essenciais faltem fora do modo `local-demo`.

## Seguranca de Producao

- [x] Nenhum secret exposto no Git/diff/logs.
- [x] Service role e chaves de IA protegidas estritamente server-side.
- [x] Consentimento por provedor exigido no roteador de IA.
- [x] Kill switches operacionais em produção configurados por variáveis de ambiente.
- [x] RLS validado remotamente e Atalaia limitado por alvo/grant com tokens criptografados e imutáveis.
- [x] CSP com nonce por request ativada em produção sem inline scripts.

## UX & Produto

- [x] Interfaces usam queries server-only autenticadas ou simples estados vazios reais; dados de exemplo restritos ao modo `local-demo`.
- [x] Linguagem sem vergonha/culpa focada em retomadas construtivas.
- [x] Ações claras no dashboard e no PWA mobile.

## Veredito final

**PRONTO PARA LANÇAMENTO DE PRODUÇÃO (GO)**. A plataforma da V1 atende a todos os critérios de largura e robustez de segurança exigidos.
