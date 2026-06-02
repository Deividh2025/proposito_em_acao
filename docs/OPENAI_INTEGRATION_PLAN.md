# AI Provider Integration Plan

## Principio

IA e camada operacional integrada, nao chatbot solto. Toda resposta que vira dado deve usar schema estruturado, validacao e revisao do usuario quando afetar agenda, alvos, tarefas, Metacognicao ou Atalaia.

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

- Schemas futuros em `src/ai/schemas`.
- Validacao com Zod e/ou JSON Schema.
- Server-side validation antes de persistir.
- Evals negativos antes de liberar agentes sensiveis.

## Prompts internos

- Diretório preparado: `src/ai/prompts`.
- Prompts finais nao foram criados.
- Prompts devem ser versionados e revisados por guardrails.

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

Diretorio preparado: `src/ai/evals`.

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

- Nenhuma chamada real a OpenAI API e acionada por fluxo de produto.
- Prompts internos foram versionados como contratos iniciais, nao como prompts finais de producao.
- Agentes foram estruturados no catalogo e em entrypoints, mas fluxos completos ainda serao integrados em etapas proprias.
- Provider mock permite testar outputs sem enviar dados sensiveis.

## Prompt 7 - Integracao tecnica preparada

OpenAI deve permanecer server-side. O client real esta em `src/lib/openai/client.ts` com barreira `server-only`, e o provider real fica isolado em `src/lib/openai/provider.ts`.

Docs oficiais consultadas em 2026-05-31 indicam que novos projetos devem preferir a Responses API e que Structured Outputs exigem schemas estritos com campos requeridos:

- https://developers.openai.com/api/docs/guides/migrate-to-responses
- https://developers.openai.com/api/docs/guides/structured-outputs

Arquivos:

- `src/lib/openai/types.ts`
- `src/lib/openai/errors.ts`
- `src/lib/openai/mockProvider.ts`
- `src/lib/openai/safeInvoke.ts`
- `src/lib/openai/provider.ts`

Logs de IA devem usar `ai_run_audit_v1`, sem prompt bruto e sem resposta bruta.

## Prompt 16 - OpenAI + DeepSeek

Decisao do fundador:

- OpenAI API sera usada como provider real planejado.
- DeepSeek API sera usada como provider real planejado.
- Modelos DeepSeek planejados: `deepseek-v4-flash` e `deepseek-v4-pro`.

DeepSeek deve seguir o mesmo padrao de seguranca do OpenAI provider:

- somente server-side;
- chave apenas em secret do provedor de deploy;
- sem `NEXT_PUBLIC_`;
- schema estruturado e validacao server-side;
- guardrails antes de persistir, enviar ou compartilhar;
- logs sem prompt bruto/resposta bruta;
- fallback seguro quando provider falhar;
- evals antes de ativar fluxo real.

Antes de ativar IA real, ainda falta decidir:

- modelo OpenAI padrao;
- quais agentes usam OpenAI, DeepSeek Flash ou DeepSeek Pro;
- limites de custo por usuario/ambiente;
- rate limit e timeout;
- politica de fallback entre providers;
- se algum fluxo sensivel ficara apenas mock/manual no beta.
