# Testing Strategy

## Estado atual

A stack Next.js, Vitest e Playwright existe. Migrations Supabase/RLS foram preparadas, mas ainda nao foram aplicadas em ambiente local/remoto porque o CLI Supabase nao esta instalado neste workspace. Nao ha chamadas reais de IA.

## Testes unitarios

Quando a stack existir, cobrir regras puras:

- SMART-E.
- Estados de Goal, Project, Task e Microtask.
- Decomposicao de tarefas.
- Energia/tempo.
- Consentimentos.
- Permissoes de Atalaia.
- Validacao de schemas de IA.
- Privacidade por padrao.
- Regras de Placar e retomada.

## Testes de integracao

- Auth e perfil.
- Persistencia de Chamado, alvos, projetos, tarefas e calendario.
- Inbox para destino.
- Foco para atualizacao de tarefa/Placar.
- Desbloqueador para foco ou Metacognicao.
- IA mockada com structured outputs.
- E-mail/convite de Atalaia com previa.
- Logs sem dados sensiveis.

## Testes E2E

Fluxos minimos:

1. Cadastro -> perfil -> Mapa -> Chamado -> dashboard.
2. Alvo -> projeto -> tarefa -> microtarefa -> calendario -> foco.
3. Inbox -> classificacao -> tarefa/projeto/habito.
4. Desbloqueador -> proximo passo -> foco.
5. Metacognicao -> reformulacao -> microacao.
6. Habito -> Placar -> Revisao semanal -> Jardim.
7. Atalaia -> convite -> permissao -> previa -> revogacao.
8. PWA/mobile -> captura -> habito -> foco curto -> sincronizacao.

## Testes de RLS futuros

Para cada tabela exposta:

- Dono pode acessar.
- Outro usuario nao pode acessar.
- Usuario anonimo nao pode acessar dados privados.
- Atalaia autorizado ve somente escopo permitido.
- Atalaia revogado nao ve nada.
- Views respeitam RLS.
- Storage e privado por padrao.
- `service_role` nao aparece no cliente.
- Filho nao pode apontar para parent de outro usuario.
- Metacognicao, Chamado completo e revisoes privadas nao aparecem em acesso de Atalaia.

## Testes de IA/evals

Evals minimos:

- Aderencia a schema.
- Bloqueio de diagnostico.
- Bloqueio de terapia substitutiva.
- Bloqueio de culpa espiritual.
- Bloqueio de afirmacao de vontade divina especifica.
- Confronto firme sem humilhacao.
- Deteccao de crise e encaminhamento.
- Atalaia sem vazamento de dados privados.
- Fallback quando IA falha.
- Resistencia a prompt injection simples.

## Testes de UX critico

- Proxima acao clara no dashboard.
- Poucas opcoes por tela.
- Modo baixa energia.
- Modo recomeco.
- Tempo para capturar no mobile.
- Metacognicao compreensivel e nao pesada.
- Placar sem vergonha.
- Jardim nao punitivo.
- Contraste, teclado e foco visivel.

## Testes de seguranca

- Secret scan.
- `.env.example` sem segredo real.
- Autorizacao server-side.
- Logs sem dados intimos.
- Consentimento registrado e revogavel.
- Mensagem ao Atalaia com previa.
- Exportacao/exclusao quando a fase existir.

## Testes de regressao

- Smoke E2E dos fluxos centrais antes de merge.
- Contratos de schemas de IA versionados.
- Snapshot de politicas RLS/matriz de acesso.
- Evals negativos de IA em cada PR que mexer em prompts, schemas ou guardrails.

## Criterios minimos para PR

- Escopo pequeno.
- Plano quando necessario.
- Checklist de PR preenchido.
- Docs atualizadas.
- Testes executados ou N/A justificado.
- Secret scan quando houver arquivos novos/alterados.
- Evidencia de aceite.
- `git status --short --branch` revisado.

## Cobertura minima futura

- 80%+ em regras de dominio e servicos criticos.
- 90%+ em autorizacao, consentimento, schemas de IA e Atalaia.
- 100% das migrations com teste de politica RLS quando houver Supabase.

Cobertura numerica nao substitui gates bloqueantes de seguranca, privacidade, IA e Atalaia.
