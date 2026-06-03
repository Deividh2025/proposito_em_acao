# Decisions

Registro das decisoes de produto, arquitetura e governanca.

## Decisoes fixadas

- Produto desktop-first.
- Mobile/PWA complementar e rapido.
- Chamado Pessoal e o eixo central.
- V1 completa em largura e controlada em profundidade.
- IA modular, nao chatbot unico.
- Metacognicao e modulo central.
- UX TDAH-first e requisito.
- Camada crista e configuravel.
- Atalaia tem acesso limitado por alvo e consentimento granular.
- Atalaia permanece na V1 em profundidade basica, limitado por alvo, consentimento granular, previa de mensagem e revogacao. Expansoes de portal/relatorios avancados ficam para V1.1/V2.
- Dados sensiveis exigem privacidade desde o inicio.
- Retomada importa tanto quanto acerto.
- O produto deve confrontar autoengano sem humilhar.
- Prompt 1 usa fluxo local-first para GitHub.
- `docs/source/prd_proposito_em_acao.md` e a fonte raiz; `docs/PRD.md` e a fonte operacional derivada da V1.
- `docs/SECURITY_PRIVACY.md` e a fonte principal de seguranca/privacidade; `docs/SECURITY_NOTES.md` permanece como nota resumida de bootstrap.
- Stack tecnica inicial decidida: Next.js App Router, React, TypeScript strict, Tailwind, Supabase, OpenAI server-side futuro, Zod, React Hook Form, Vitest e Playwright.
- `AGENTS.md` deve ser mantido como guia operacional vivo do repositorio real, incluindo stack atual, comandos, gates, regras de aprovacao e limites de seguranca.
- Prompt 4 prepara migrations, RLS, storage e clientes Supabase no repositorio; aplicacao remota exige credenciais administrativas e validacao propria.
- Projeto Supabase informado para desenvolvimento: `https://bceumcfmjftoukzrfthe.supabase.co`, project ref `bceumcfmjftoukzrfthe`.
- Repositorio GitHub informado: `Deividh2025/proposito_em_acao`, remote HTTPS `https://github.com/Deividh2025/proposito_em_acao.git`.
- Supabase Auth inicial sera email/senha com confirmacao de email; OAuth fica preparado para etapa futura.
- Atalaia usa grants por alvo e escopo; nao acessa conta inteira.
- Metacognicao permanece privada por padrao e sem policy de Atalaia.
- Storage e privado por padrao; acesso externo deve usar signed URL server-side e consentimento.
- `docs/DESIGN_SYSTEM.md` e a fonte canonica do design system inicial.
- Tailwind materializa tokens e utilitarios do design system.
- Shell do app e desktop-first com `AppShell`, `Sidebar`, `Topbar`, `RightPanel` e `MobileShell` complementar.
- Modo baixa energia e modo recomeço sao requisitos de design system, nao detalhes futuros soltos.
- Rotas da etapa de design system sao placeholders navegaveis e nao implementam fluxos finais.
- Placar e Jardim devem comunicar progresso e cuidado sem punir falhas.
- Camada crista visual inicial permanece discreta, opcional e dependente de configuracao futura.
- Prompt 6 inicia a fase de Onboarding e direcao: `/onboarding` e `/dashboard` deixam de ser apenas placeholders.
- `CallingDraft` e hipotese em discernimento, revisavel pelo usuario, nunca Chamado definitivo automatico.
- OpenAI real permanece desativada no Prompt 6; o agente do Chamado usa mock deterministico seguro.
- Persistencia real do onboarding depende de sessao Supabase/Auth e migrations aplicadas; sem isso, o fluxo retorna fallback local/dev explicitamente identificado.
- Progressao assistida limita alvos completos, projetos, Atalaia, Placar completo e calendario estrategico ate existir hipotese de Chamado.
- Prompt 7 implementa IA central como contratos server-side: agentes internos, schemas, prompts versionados, guardrails, provider mock e provider OpenAI isolado.
- Responses API e Structured Outputs sao a direcao tecnica para OpenAI real, mas chamadas reais dependem de configuracao, revisao de guardrails e decisao de modelo.
- Zod e a fonte local de validacao dos structured outputs nesta etapa.
- Logs de IA usam metadados minimos `ai_run_audit_v1`; prompt bruto e resposta bruta permanecem proibidos por padrao.
- Base de conhecimento nasce como placeholder em `knowledge/`; material real, file search ou vector store exigem autorizacao futura.
- Nome canonico operacional permanece `Metacognicao` em portugues; mudanca de marca/nome final segue pendente do fundador.
- Prompt 8 libera o nucleo inicial de execucao depois da direcao: Alvos SMART-E, Projetos, Tarefas, Microtarefas e Proxima acao.
- SMART-E, plano de projeto e quebra de tarefa usam mocks deterministos e schemas estruturados revisaveis; OpenAI real continua desativada na UI.
- Persistencia de execucao deve ocorrer por server actions com Supabase/RLS owner-only; sem Auth/Supabase, o app deve declarar fallback local/dev.
- Calendario funcional, inbox funcional, habitos, Placar completo, Desbloqueador funcional, Metacognicao funcional e Atalaia funcional permanecem fora do Prompt 8.
- Prompt 9 libera o centro operacional: Calendario de Execucao e Caixa de Entrada/GTD adaptado.
- Calendario deve proteger Chamado, descanso, familia e espiritualidade como compromissos reais, nao apenas otimizar produtividade.
- Agenda usa semana/dia headless na V1, sem biblioteca pesada ou drag-and-drop obrigatorio.
- Inbox usa captura rapida e classificacao mockada segura ate OpenAI real ser autorizada/configurada para este fluxo.
- Preocupacoes da inbox podem ser marcadas para reflexao futura, mas Metacognicao funcional continua fora do Prompt 9.
- `calendar_blocks` e `inbox_items` permanecem privados por padrao e sem Atalaia nesta etapa.
- Processamento autenticado de inbox reclassifica a partir do conteudo persistido e exige destino existente para projeto/habito ate a etapa desses fluxos completos.
- Prompt 10 libera Desbloqueador de Acao e Metacognicao funcional com mocks seguros, schemas estruturados e persistencia preparada por server actions.
- Desbloqueador responde bloqueio operacional com microacao, versao minima e plano de retomada; se o bloqueio parecer cognitivo/emocional, sugere Metacognicao.
- Metacognicao separa fato, interpretacao, sentimento e impulso, confronta sem humilhar e termina com rota responsavel.
- Metacognicao permanece privada por padrao; Atalaia continua sem acesso automatico.
- Crise emocional grave sai do fluxo de produtividade e usa rota de ajuda humana.
- Modo Foco completo nao foi implementado; o botao de comecar agora registra apenas intencao/ponte futura.
- Prompt 11 libera Modo Foco, Habitos e Placar em profundidade controlada, com mock seguro e fallback local/dev.
- Timer de foco deve usar timestamp/tempo alvo no cliente, nao apenas decremento visual.
- Distracoes de foco sao dados sensiveis owner-only e so vao para Inbox por acao explicita.
- Habitos precisam de minimo, ideal, gatilho, recompensa, ambiente, metrica e retomada antes de salvar.
- Placar mede constancia, nao valor pessoal; retomada conta como progresso real.
- Placar bruto nao sera compartilhado com Atalaia nesta etapa.
- Prompt 12 libera Revisao Semanal, deteccao inicial de padroes, plano de retomada, planejamento da proxima semana e Jardim da Vida inicial.
- Revisao Semanal e privada por padrao; Atalaia nao recebe revisao, Metacognicao, calendario bruto, Placar bruto ou Jardim automaticamente.
- Metacognicao entra na Revisao Semanal apenas como padrao agregado/redigido, nunca conteudo bruto.
- Jardim da Vida e snapshot derivado de eventos minimos e revisao semanal, nao fonte primaria de dados intimos.
- Areas negligenciadas no Jardim usam cuidado necessario, nao morte, punicao, ranking ou vergonha.
- OpenAI real continua desativada na UI do Prompt 12; mock estruturado e revisao humana seguem como contrato.
- Prompt 13 libera Atalaia basico por alvo, Documento de Compromisso, Alavancas de Compromisso, previa, revogacao e notificacoes preparadas.
- Atalaia continua proibido de acessar conta inteira, Chamado completo, Metacognicao, Revisao Semanal privada, inbox bruto, calendario completo, saude, familia, financas e emocoes.
- Notificacoes externas usam fallback `pending_provider_config` ate existir provider server-side configurado e revisado.
- Documento de Compromisso so pode ser compartilhado depois de revisao humana, consentimento versionado e grant ativo.
- Alavancas de compromisso devem ser restaurativas; punicao nociva, humilhacao, exposicao publica e culpa espiritual sao bloqueadas.
- Prompt 14 implementa PWA responsivo complementar, nao app nativo.
- Service worker inicial cacheia apenas assets estaticos, manifest, icones e pagina offline; dados sensiveis e rotas autenticadas ficam fora do cache.
- Sincronizacao offline sensivel e push notifications permanecem fora antes do Prompt 15; qualquer ativacao futura exige prompt proprio, modelagem de consentimento, seguranca, conteudo neutro e testes.
- App nativo permanece fora antes do Prompt 15; a decisao aprovada e validar o PWA responsivo complementar antes de considerar Expo/React Native/Capacitor.
- Energia mobile usa `energy_checkins` owner-only; sem Auth/Supabase, a UI declara fallback local/dev.
- Migration remota `mobile_pwa_prompt14_alignment` aplicada em 2026-06-02 no Supabase `proposito_em_acao` (`bceumcfmjftoukzrfthe`), versao registrada `20260602134002`.
- Icones PWA finais simples aprovados para a etapa pre-Prompt 15; futuras trocas visuais dependem de branding completo, nao de pendencia tecnica.
- Prompt 15 confirma `/auth` como superficie basica da V1 para criar conta, entrar e sair, usando Supabase Auth por server actions e sem service role no frontend.
- Prompt 15 define que Atalaia RLS deve ser grant-specific e partner-specific, nao apenas `user_id + goal_id + permission`.
- Prompt 15 define que structured outputs enviados pelo cliente em fluxos privados precisam passar por guardrail de persistencia owner-only antes de salvar.
- Prompt 15 deixou a V1 local ampla em fallback/local-dev, mas Prompt 16 deve iniciar por deploy/preview controlado e validacao Supabase real, nao por producao aberta.
- Prompt 16 recomendou Vercel como primeira plataforma de preview controlado para Next.js antes da decisao final do fundador; essa recomendacao foi substituida pela decisao de Hostinger VPS com Coolify.
- Decisao final do fundador apos a avaliacao do Prompt 16: usar VPS Hostinger com Coolify como plataforma principal de deploy; Vercel fica como alternativa de contingencia.
- Dono da plataforma: Deividh de Sa; e-mail operacional informado: `deividhvianei@gmail.com`.
- Providers de IA planejados para producao: OpenAI API e DeepSeek API.
- Modelos DeepSeek planejados: `deepseek-v4-flash` para fluxos mais rapidos/custo menor e `deepseek-v4-pro` para fluxos mais complexos, ambos dependentes de evals, rate limit e roteamento por agente.
- Prompt 16 bloqueia producao aberta porque o Supabase remoto `bceumcfmjftoukzrfthe` segue desalinhado das migrations locais da V1 e ainda nao houve matriz RLS/Auth dinamica publicada.
- Prompt 16 mantem IA real e e-mail real desativados ate decisao explicita de modelo, custo, rate limit, provider, remetente, templates e guardrails.
- Prompt 16 adiciona headers minimos de seguranca no `next.config.ts` e cria runbook, rollback, smoke report, ambiente de producao e checklist beta.
- Prompt 17 prepara beta fechado, observabilidade segura, feedback, suporte, incident response, monitoramento e V1.1; nao libera usuarios reais.
- North Star do beta: semanas com pelo menos 3 acoes concluidas alinhadas a um alvo vinculado ao Chamado.
- Analytics real so pode ser ativado apos consentimento especifico, LGPD minima, retencao definida, ambiente seguro e allowlist sem conteudo sensivel.
- Feedback in-app do beta e rascunho local; envio externo depende de `NEXT_PUBLIC_BETA_FEEDBACK_URL` aprovado, sem tokens ou query sensivel.
- Suporte inicial do beta usa `deividhvianei@gmail.com` ate canal dedicado ser aprovado.
- V1.1 deve estabilizar e simplificar a V1; hardening de Supabase/RLS/Auth/LGPD/smoke vem antes de features novas.

## Decisoes atuais consolidadas em 2026-06-03

Estas decisoes substituem perguntas antigas quando houver conflito. O fato de estarem decididas nao significa que estejam implementadas ou validadas.

- Estado do produto: V1 local ampla / pre-beta real. O proximo objetivo e beta real fechado, nao producao aberta.
- Dominio e VPS serao adquiridos na Hostinger.
- A VPS inicial escolhida e Hostinger KVM 1, com gate obrigatorio para upgrade se nao suportar a aplicacao com estabilidade, build, runtime, HTTPS, logs e rollback.
- O dominio exato ainda nao foi definido e permanece gate manual antes de deploy publicado.
- O backend do beta usara o projeto Supabase principal somente depois de cutover validado, evidencia fresca de Auth/RLS e aprovacao explicita.
- GitHub remoto atual: `origin` em `https://github.com/Deividh2025/proposito_em_acao.git`, branch principal `main`. Em 2026-06-03, a API retornou repositorio privado, `main` sem protecao efetiva, zero workflows e sem releases publicadas.
- Selecionador de IA planejado em configuracoes: `automatic`, `openai` ou `deepseek`; padrao `automatic`.
- OpenAI e DeepSeek permanecem configuraveis por variaveis de ambiente e server-side.
- Consentimento de IA sera separado, versionado e revogavel por provider.
- Nao havera fallback automatico entre providers de IA. Em falha de provider, usar fallback local seguro ou fluxo manual.
- Resend foi escolhido para e-mail transacional com dominio verificado.
- Resend tambem sera usado como SMTP customizado do Supabase Auth.
- Analytics sera first-party no Supabase, com opt-in desligado por padrao.
- Analytics, feedback beta e metadados de auditoria de IA terao retencao operacional de 90 dias.
- DeepSeek segue planejado, mas ainda nao implementado como adapter/provider no codigo.
- E-mail real, IA real, analytics real e feedback externo continuam desativados ate secrets, consentimentos, guardrails, custos, rate limits, logs e smoke publicados serem aprovados.

## Pendencias

- Nome final do modulo de Metacognicao.
- Intensidade padrao da camada crista.
- Publico inicial prioritario.
- Branding visual completo dos icones e assets de instalacao, se houver direcao de marca posterior.
- Modelo comercial.
- Materiais proprios para base de conhecimento da IA.
- Definir dominio exato de preview/producao na Hostinger antes de deploy publicado.
- Aplicacao das migrations anteriores ao Prompt 14 no projeto Supabase remoto e execucao dos testes RLS completos.
- Escopo avancado do Atalaia em V1.1/V2.
- Validacao visual aprofundada com screenshots comparativos quando houver telas finais.
- Consentimento versionado, retencao, exportacao e exclusao antes de coleta produtiva de dados de onboarding.
- Aplicar e testar a migration `202605310004_onboarding_calling_metadata.sql`.
- Aplicar e testar a migration `202605310005_execution_prompt8_alignment.sql`.
- Escolher modelo OpenAI padrao por custo, latencia, qualidade e acesso antes de ativar IA real.
- Aprovar materiais reais para a base de conhecimento e sua politica de versionamento.
- Implementar retencao de 90 dias para metadados `ai_run_audit_v1` antes de ativar IA real.
- Aplicar e testar a migration `202605310005_execution_prompt8_alignment.sql`.
- Gerar tipos reais de Supabase apos aplicar migrations do Prompt 8.
- Definir futuramente uma projecao sanitizada para Atalaia ver progresso de execucao sem abrir `goals/projects/tasks/microtasks` diretamente.
- Aplicar e testar a migration `202605310006_calendar_inbox_prompt9_alignment.sql`.
- Gerar tipos reais de Supabase apos aplicar migrations do Prompt 9.
- Definir se e quando havera recorrencia avancada, timezone por usuario e drag-and-drop acessivel no calendario.
- Definir politica de retencao para capturas brutas da inbox.
- Definir provider/modelo real para classificacao de inbox e revisao de agenda antes de ativar OpenAI neste fluxo.
- Aplicar e testar a migration `202605310007_action_unblocker_metacognition_prompt10_alignment.sql`.
- Gerar tipos reais de Supabase apos aplicar migrations do Prompt 10.
- Definir provider/modelo real para Desbloqueador e Metacognicao antes de ativar OpenAI nestes fluxos.
- Definir politica de retencao/exclusao para historico privado de Metacognicao antes de producao.
- Definir, em etapa futura, se havera resumo manual compartilhavel de Metacognicao e qual consentimento granular sera exigido.
- Aplicar e testar a migration `202605310008_focus_habits_scoreboard_prompt11_alignment.sql`.
- Gerar tipos reais de Supabase apos aplicar migrations do Prompt 11.
- Definir provider/modelo real para Habitos e Placar antes de ativar OpenAI nestes fluxos.
- Definir schema futuro de resumo limitado de Placar para Atalaia, com consentimento e previa.
- Aplicar e testar a migration `202605310009_weekly_review_garden_prompt12_alignment.sql`.
- Gerar tipos reais de Supabase apos aplicar migrations do Prompt 12.
- Gerar tipos reais de Supabase apos aplicar migrations do Prompt 14.
- Definir politica de retencao/exportacao/exclusao de `energy_checkins`.
- Definir em prompt futuro, se necessario, push notifications e fila offline sensivel.
- Definir provider/modelo real para Revisao Semanal antes de ativar OpenAI neste fluxo.
- Definir politica de retencao/exclusao para revisoes semanais e eventos do Jardim antes de producao.
- Definir se existira resumo manual compartilhavel de Revisao Semanal para Atalaia e qual consentimento granular sera exigido.
- Aplicar e testar a migration `202606010010_accountability_commitment_prompt13_alignment.sql`.
- Gerar tipos reais de Supabase apos aplicar migrations do Prompt 13.
- Implementar Resend server-side, dominio verificado, remetente, politica de unsubscribe e auditoria antes de envio externo.
- Definir expiracao real de convite, politica de reenvio e fluxo autenticado completo do Atalaia.
- Definir projecoes sanitizadas finais para o portal do Atalaia antes de qualquer relatorio externo avancado.
- Alinhar todas as migrations locais no Supabase remoto; a consulta de Prompt 15 listou apenas `20260602134002_mobile_pwa_prompt14_alignment`.
- Rodar matriz RLS dinamica em Supabase branch/preview com usuario A, usuario B, Atalaia autorizado e Atalaia revogado.
- Validar signup, login, logout, confirmacao de e-mail e redirects de Auth em ambiente real.
- Aprovar release checklist do Prompt 16 antes de deploy produtivo.
- Validar Hostinger KVM 1, acesso SSH, Coolify, dominio/URL de preview e criterio de upgrade.
- Instalar/configurar Coolify, HTTPS, firewall, logs, backups e rollback antes de qualquer publicacao.
- Aprovar rollback antes de beta fechado.
- Executar smoke tests em URL publicada antes de convidar usuarios reais.
- Definir modelo OpenAI padrao e regras de roteamento do modo `automatic` entre OpenAI, DeepSeek Flash e DeepSeek Pro.
- Aprovar canal/formulario externo de feedback beta e politica de acesso/retencao.
- Implementar consentimento de analytics/feedback, opt-in desligado por padrao, enforcement de retencao de 90 dias e bloqueio de coleta sem consentimento.
- Corrigir ou aceitar explicitamente mensagens tecnicas de erro Supabase expostas em algumas server actions antes de beta real.

## Template de decisao

```md
Data:
Status:
Contexto:
Decisao:
Motivo:
Impacto:
Documentos afetados:
```
