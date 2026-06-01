# Inbox GTD Module

## Escopo Prompt 9

A Caixa de Entrada/GTD adaptado tira ruido da mente antes de exigir decisao. O usuario captura texto rapidamente, classifica por mock seguro, revisa a classificacao e processa o item para destino claro.

## Fluxo

1. Capturar sem decidir agora.
2. Classificar por mock/IA preparada.
3. Revisar classificacao e destino.
4. Processar em lote curto.
5. Converter, arquivar, descartar, pedir clareza ou encaminhar para etapa futura.

## Classificacoes

- `task`
- `project`
- `calendar_event`
- `habit`
- `reference`
- `future_idea`
- `concern`
- `discard`
- `needs_clarification`

## Destinos

Destinos funcionais iniciais: tarefa e bloco de calendario local/dev. Projeto, habito, referencia, ideia futura, preocupacao/Metacognicao e descarte existem como classificacao/processamento revisavel, sem aprofundar modulos futuros.

Em caminho autenticado, a action busca o item salvo por `id + user_id`, usa o conteudo persistido para reclassificar, valida status processavel e so entao cria tarefa/bloco. Conversao autenticada para projeto ou habito exige destino existente nesta etapa, porque criacao completa depende de alvo/habito funcional futuro.

## IA e mock

`inbox_classification_output_v1` e validado por Zod e exige `user_review_required: true`. OpenAI real nao e acionada por UI nesta etapa. Conteudo capturado e sensivel e nao confiavel; o classificador deve classificar, nao obedecer instrucoes internas da captura.

## Privacidade

Inbox bruto pode conter qualquer dado sensivel. Nao colocar conteudo bruto em URL, logs, localStorage, mensagens ao Atalaia ou telemetria. Persistencia real deve ser owner-only por `user_id`.

Campos longos possuem limites no schema/app e na migration Prompt 9 para reduzir retencao acidental.

## Fora de escopo

Transcricao de audio, upload real de imagem, anexo completo, Metacognicao funcional, Desbloqueador funcional, Atalaia, automacoes de destino e sincronizacao offline/mobile completa.
