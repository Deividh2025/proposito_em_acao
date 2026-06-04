# AI Provider Integration Plan

## Principio

IA e camada operacional integrada, nao chatbot solto. Toda resposta que vira dado deve usar schema estruturado, validacao e revisao do usuario quando afetar agenda, alvos, tarefas, Metacognicao ou Atalaia.

## Estado atual verificado em 2026-06-04 - Etapa 5

- OpenAI real e DeepSeek real continuam desativados em fluxos de produto por `AI_REAL_ENABLED=false` por default.
- Codigo atual possui provider mock, provider OpenAI server-only e adapter DeepSeek server-only.
- Tipos aceitam `mock | openai | deepseek`; o seletor aceita `automatic | openai | deepseek`.
- `safeInvoke` valida schema, executa guardrails de entrada/saida, bloqueia provider real sem autorizacao explicita da rota, registra `guardrail_status` real e usa fallback local seguro sem fallback cruzado entre providers.
- `safeInvoke` remove chaves sensiveis do input antes do provider, propaga `AbortSignal` para timeout abortavel e aplica guardrail adicional em outputs de Atalaia/Documento de Compromisso.
- `ai_run_audit_v1` registra metadados minimos, `invocation_mode`, consentimento e motivo de fallback, mas persistencia real de auditoria ainda depende de etapa de banco/LGPD.
- Consentimento de IA e checado por provider e versao antes da rota real; a camada nao cria consentimento automaticamente.
- Metadados de auditoria de IA terao retencao operacional de 90 dias quando houver persistencia real.

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

## Decisao atual - OpenAI + DeepSeek

Decisao do fundador:

- OpenAI API sera usada como provider real planejado.
- DeepSeek API sera usada como provider real planejado.
- Configuracoes futuras devem permitir `automatic`, `openai` e `deepseek`, com `automatic` como padrao.
- OpenAI e DeepSeek permanecem configuraveis por variaveis de ambiente.
- Modelos DeepSeek configuraveis nesta etapa: `deepseek-chat` e `deepseek-reasoner`.

DeepSeek deve seguir o mesmo padrao de seguranca do OpenAI provider:

- somente server-side;
- chave apenas em secret do provedor de deploy;
- sem `NEXT_PUBLIC_`;
- schema estruturado e validacao server-side;
- guardrails antes de persistir, enviar ou compartilhar;
- logs sem prompt bruto/resposta bruta;
- fallback local seguro ou fluxo manual quando provider falhar, sem fallback automatico para outro provider;
- evals antes de ativar fluxo real.

Antes de ativar IA real, ainda falta aprovar:

- secrets por ambiente;
- consentimento persistido por provider;
- evals reais/custo por usuario/ambiente;
- rate limit persistente;
- readiness/smoke de provider real com chaves/modelos configurados em ambiente isolado;
- se algum fluxo sensivel ficara apenas mock/manual no beta.
