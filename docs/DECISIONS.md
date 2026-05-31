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

## Pendencias

- Nome final do modulo de Metacognicao.
- Intensidade padrao da camada crista.
- Publico inicial prioritario.
- PWA ou app nativo no mobile.
- Modelo comercial.
- Materiais proprios para base de conhecimento da IA.
- Push inicial e validacao de acesso ao repositorio GitHub remoto.
- Aplicacao das migrations no projeto Supabase remoto e execucao dos testes RLS.
- Escopo avancado do Atalaia em V1.1/V2.
- Validacao visual aprofundada com screenshots comparativos quando houver telas finais.
- Consentimento versionado, retencao, exportacao e exclusao antes de coleta produtiva de dados de onboarding.
- Aplicar e testar a migration `202605310004_onboarding_calling_metadata.sql`.
- Aplicar e testar a migration `202605310005_execution_prompt8_alignment.sql`.
- Escolher modelo OpenAI padrao por custo, latencia, qualidade e acesso antes de ativar IA real.
- Aprovar materiais reais para a base de conhecimento e sua politica de versionamento.
- Definir politica de retencao de metadados `ai_run_audit_v1`.

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
