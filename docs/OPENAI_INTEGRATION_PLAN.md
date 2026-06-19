# AI Provider Integration Plan

## Principio

IA e camada operacional integrada, nao chatbot solto. Toda resposta que vira dado deve usar schema estruturado, validacao e revisao do usuario quando afetar agenda, alvos, tarefas, Metacognicao ou Atalaia.

## Estado atual e Unificação sob DeepSeek V4 Pro (2026-06-19)

- O plano de integração com múltiplos provedores foi unificado em um único modelo de alta capacidade: **Nvidia DeepSeek V4 Pro** (via NVIDIA Integrate API ou provedor DeepSeek homologado).
- Os fluxos que usavam a API da OpenAI foram depreciados e não são mais utilizados em produção.
- O seletor de provedor mapeia ambos os caminhos de roteamento (`automatic` e `deepseek`) para a mesma infraestrutura unificada do DeepSeek V4 Pro.
- O consentimento de IA é gerenciado sob a versão `ai_provider_deepseek_v1`.
- A barreira `AI_REAL_ENABLED=false` permanece ativa por padrão até homologação operacional e configuração de secrets e kill switch no provedor Hostinger/Coolify.
- Metadados de auditoria de IA terão retenção operacional de 90 dias quando houver persistência real.

## Agentes internos

- Copiloto de Jornada.
- Agente do Chamado Pessoal.
- Agente do Mapa da Vida.
- Agente de Alvos SMART-E.
- Agente Planejador.
- Agente Classificador de Inbox.
- Agente Desbloqueador de Acao.
- Agente de Metacognicao.
- Agente de Habitos.
- Agente Revisor Semanal.
- Agente Atalaia.
- Agente Guardrail/Revisor.

## Structured Outputs

- Schemas em `src/ai/schemas`.
- Validacao com Zod e/ou JSON Schema.
- Server-side validation antes de persistir.
- Evals negativos antes de liberar agentes sensiveis.

## Prompts internos

- Diretório preparado: `src/ai/prompts`.
- Prompts iniciais foram versionados como contratos.
- Prompts finais de producao devem ser revisados por guardrails e evals reais antes de ativar provider.

## Guardrails

Bloquear:

- Diagnostico.
- Substituicao de terapia, medicina, psiquiatria ou aconselhamento pastoral humano.
- Promessa de cura.
- Afirmacao de vontade divina especifica.
- Culpa espiritual.
- Humilhacao.
- Punicoes nocivas.
- Compartilhamento privado sem consentimento.
- Tratamento de crise grave como produtividade comum.

## Base de conhecimento

Futura base deve conter materiais aprovados sobre Chamado, mordomia do tempo, dominio proprio, descanso, TDAH-first, neurociencia aplicada, TCC/metacognicao e linguagem pastoral segura.

## Evals

Diretorio preparado: `src/ai/evals` com casos locais. Evals locais cobrem roteamento/consentimento/guardrails com mocks, sanitizacao de input, timeout abortavel e limite diario local, mas nao validam provider real, custo, latencia, rate limit persistente ou aderencia de modelo em producao.

Casos minimos futuros:

- Usuario em sofrimento emocional grave.
- Pedido de diagnostico.
- Frase com culpa espiritual.
- Mensagem ao Atalaia com dado privado.
- Saida fora do schema.
- Sugestao de alteracao sensivel sem revisao do usuario.

## Logs e privacidade

- Nao armazenar prompts e respostas brutas por padrao.
- Enviar somente contexto minimo ao modelo.
- Separar conteudo sensivel de telemetria operacional.
- Registrar versao de prompt/schema quando houver persistencia.

## Limites desta etapa

- Nenhuma chamada real a OpenAI ou DeepSeek e acionada por fluxo de produto.
- Prompts internos foram versionados como contratos iniciais, nao como prompts finais de producao.
- Agentes foram estruturados no catalogo e em entrypoints, mas fluxos completos ainda serao integrados em etapas proprias.
- Provider mock permite testar outputs sem enviar dados sensiveis.

## Prompt 7 - Integracao tecnica preparada

OpenAI deve permanecer server-side. O client real esta em `src/lib/openai/client.ts` com barreira `server-only`, e o provider real fica isolado em `src/lib/openai/provider.ts`.

Docs oficiais consultadas originalmente em 2026-05-31 e checadas novamente por disponibilidade em 2026-06-03 indicam que novos projetos devem preferir a Responses API e que Structured Outputs exigem schemas estritos com campos requeridos:

- https://developers.openai.com/api/docs/guides/migrate-to-responses
- https://developers.openai.com/api/docs/guides/structured-outputs

Arquivos:

- `src/lib/openai/types.ts`
- `src/lib/openai/errors.ts`
- `src/lib/openai/mockProvider.ts`
- `src/lib/openai/safeInvoke.ts`
- `src/lib/openai/provider.ts`
- `src/lib/deepseek/provider.ts`
- `src/lib/ai/invoke.ts`
- `src/lib/ai/index.ts`
- `src/lib/ai/redaction.ts`

Logs de IA devem usar `ai_run_audit_v1`, sem prompt bruto e sem resposta bruta.

## Decisão de Unificação - Nvidia DeepSeek V4 Pro

Decisão do fundador:

- A infraestrutura de IA do sistema foi 100% unificada sob o modelo **Nvidia DeepSeek V4 Pro** acessado via NVIDIA Integrate API ou provedor compatível.
- A integração com OpenAI (Nemotron) foi totalmente depreciada e descontinuada do plano de produção para simplificar a manutenção e reduzir a latência de múltiplos modelos.
- O adaptador DeepSeek gerencia todas as chamadas server-side, garantindo validação Zod estruturada, timeouts seguros e isolamento estrito.
- Antes de ativar IA real com DeepSeek V4 Pro, ainda falta aprovar: secrets por ambiente, consentimento persistido e auditoria mínima validada em preview, evals de aderência de custo por usuário e rate limit persistente.
