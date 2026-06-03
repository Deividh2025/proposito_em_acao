# Beta Checklist

Data: 2026-06-02.

## Status

Beta fechado ainda nao aprovado. A plataforma foi decidida, mas o app ainda precisa preview controlado em VPS Hostinger/Coolify e validacao real de Supabase/Auth/RLS.

## Fundador precisa aprovar

- [x] Plataforma de preview/producao: VPS Hostinger com Coolify.
- [ ] URL temporaria e dominio final.
- [ ] Aplicacao de migrations em Supabase branch/preview.
- [ ] Politica minima de privacidade, termos, consentimento, retencao, exportacao e exclusao.
- [x] Providers de IA planejados: OpenAI API e DeepSeek API.
- [ ] Se IA real fica desativada no primeiro beta.
- [ ] Se e-mail real fica desativado no primeiro beta.
- [ ] Plano de rollback.
- [ ] Grupo inicial de usuarios beta e regra de dados ficticios/reais.

## Engenharia precisa concluir

- [x] Gates locais frescos.
- [x] Build de producao local.
- [x] E2E local.
- [x] Headers minimos de producao no Next.
- [x] Plano de beta, metricas, analytics seguro, feedback, suporte, incident response e V1.1 documentados.
- [x] Feedback in-app preparado como rascunho local, sem persistencia real.
- [x] Pack de cutover Supabase preview preparado em `docs/SUPABASE_PREVIEW_CUTOVER.md`.
- [x] Scripts preparados: `supabase:types:preview` e `supabase:validate:preview`.
- [ ] Deploy de preview.
- [ ] Configurar secrets de preview.
- [ ] Instalar/configurar Coolify na VPS Hostinger.
- [ ] Configurar dominio temporario e HTTPS no Coolify.
- [ ] Aplicar migrations locais em Supabase preview.
- [ ] Gerar tipos Supabase reais via `npm.cmd run supabase:types:preview`.
- [ ] Rodar matriz RLS dinamica via `npm.cmd run supabase:validate:preview`.
- [ ] Validar Auth real.
- [ ] Rodar smoke tests em URL publicada.
- [ ] Validar PWA install/offline via HTTPS.

## Segurança

- [ ] Nenhum secret em Git/diff/log.
- [ ] Service role somente server-side.
- [ ] OpenAI key somente server-side, se ativada.
- [ ] DeepSeek key somente server-side, se ativada.
- [ ] Consentimento especifico para analytics/feedback definido antes de coleta real.
- [ ] Retencao/exportacao/exclusao de analytics e feedback aprovada.
- [ ] `NEXT_PUBLIC_BETA_FEEDBACK_URL`, se usada, sem tokens, query sensivel ou dados pessoais.
- [ ] Atalaia limitado por alvo/grant/permissao/revogacao.
- [ ] Metacognicao, Chamado e Revisao privados por padrao.
- [ ] Logs sem conteudo intimo.
- [ ] PWA sem cache sensivel.

## Operacao beta

- [x] Bug triage documentado.
- [x] Feedback triage documentado.
- [x] Support runbook documentado.
- [x] Incident response documentado.
- [x] Post-deploy monitoring documentado.
- [ ] Canal/formulario externo de feedback aprovado.
- [ ] Rotina diaria de acompanhamento aprovada pelo fundador.
- [ ] Grupo inicial de usuarios beta aprovado.

## Produto/UX

- [ ] Fluxos principais usam dados de teste nao sensiveis no smoke.
- [ ] Linguagem sem vergonha/culpa.
- [ ] Proxima acao clara em dashboard/mobile.
- [ ] Usuario entende fallback local/dev versus persistencia real.
- [ ] Atalaia tem previa clara antes de qualquer envio externo.

## Veredito atual

Pronto para preparar preview controlado e ensaio interno com dados ficticios. Nao pronto para beta fechado com usuarios reais.

## Decisoes registradas

- Dono da plataforma: Deividh de Sa.
- E-mail operacional: `deividhvianei@gmail.com`.
- Infraestrutura: VPS Hostinger.
- Deploy/PaaS: Coolify.
- IA planejada: OpenAI API e DeepSeek API.
- Modelos DeepSeek planejados: `deepseek-v4-flash` e `deepseek-v4-pro`.
