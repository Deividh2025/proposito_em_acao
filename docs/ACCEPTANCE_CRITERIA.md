# Acceptance Criteria

## Globais

- A V1 cobre todos os modulos centrais em largura.
- Chamado vem antes de agenda e filtra decisoes operacionais.
- Toda acao critica tem proxima acao clara.
- IA que vira dado usa schema estruturado e validacao futura.
- Dados sensiveis sao privados por padrao.
- Atalaia acessa somente alvo e escopo autorizados.
- Metacognicao nao diagnostica, nao substitui terapia e nao humilha.
- Camada crista nao afirma vontade divina especifica nem usa culpa espiritual.
- Fluxos criticos tem fallback quando IA falha.

## Por modulo

| Modulo | Criterios de aceite |
|---|---|
| Perfil/Auth | Usuario cria conta, configura perfil essencial, tom da IA, camada crista e consentimentos. |
| Mapa da Vida | Usuario avalia areas, recebe leitura visual/IA e historico e salvo. |
| Chamado | Usuario conclui ou salva sessao com hipotese de Chamado e pode revisar depois. |
| Alvos SMART-E | Desejo vago vira alvo estruturado, ecologico, alinhado ao Chamado e com primeira acao. |
| Projetos | Alvo vira projeto com fases, marcos, tarefas e proxima acao. |
| Tarefas/microtarefas | Tarefa grande pode ser quebrada; cada item tem status, energia, tempo e proxima acao. |
| Calendario | Usuario ve dia/semana, agenda blocos e recebe alerta de sobrecarga. |
| Inbox/GTD | Captura e classificada, editavel e enviada para destino claro. |
| Desbloqueador | Entrada curta gera primeiro passo pequeno ou encaminha para Metacognicao. |
| Metacognicao | Fluxo separa fato/interpretacao/sentimento/impulso e termina com encaminhamento responsavel. |
| Foco | Usuario inicia timer por tarefa, captura distracoes e registra conclusao. |
| Habitos | Habito tem gatilho, minimo, ideal, recompensa, plano se/entao e retomada. |
| Placar | Marcacao e rapida, valoriza retomadas e nao gera vergonha. |
| Atalaia | Convite, consentimento, previa, escopo por alvo e revogacao funcionam. |
| Documento de compromisso | Documento e gerado, editavel e compartilhavel somente com consentimento. |
| Alavancas | Recompensas/reparacoes sao saudaveis e nao humilhantes. |
| Revisao semanal | Usuario revisa semana, recebe sintese e define foco da proxima semana. |
| Jardim da Vida | Progresso visual aparece por area sem punicao. |
| Dashboard | Proxima acao e evidente em poucos segundos. |
| PWA/mobile | Acoes rapidas exigem pouca navegacao e sincronizam. |
| Camada crista | Intensidade configuravel e linguagem segura. |
| Seguranca | Nenhum dado sensivel e compartilhado sem consentimento; RLS existe nas tabelas expostas quando Supabase estiver aplicado. |

## Criterios negativos

- Nao aprovar se qualquer fluxo de IA diagnosticar.
- Nao aprovar se qualquer mensagem usar culpa espiritual.
- Nao aprovar se Atalaia puder ver conta inteira.
- Nao aprovar se Metacognicao for compartilhada automaticamente.
- Nao aprovar se prompt/resposta bruta entrar em logs por padrao.
- Nao aprovar se mobile virar copia pesada do desktop.
- Nao aprovar se Placar/Jardim punirem falha.

## Evidencia exigida futuramente

- Testes automatizados ou N/A justificado.
- Evals de IA para guardrails quando aplicavel.
- Matriz RLS para banco/Supabase.
- Evidencia visual/acessibilidade para UI.
- Secret scan.
- `git status --short --branch`.

## Prompt 7 - Aceite da camada central de IA

- Agentes internos existem no catalogo e em entrypoints.
- Schemas de structured outputs existem para os fluxos exigidos.
- Prompts internos estao versionados por agente.
- Guardrails clinicos, pastorais, privacidade, Metacognicao e Atalaia existem.
- Provider mock e safe invoke existem.
- OpenAI real permanece server-side e sem uso automatico em UI.
- Logs de IA nao contem prompt bruto nem resposta bruta.
- Base de conhecimento placeholder existe sem material real.
- Evals/testes iniciais existem e devem passar.
