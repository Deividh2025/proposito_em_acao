# Security and Privacy

Este documento e fonte de verdade para seguranca, privacidade, consentimento, Atalaia, Metacognicao, IA, logs e preparacao futura de Supabase/RLS. Ele nao substitui revisao juridica LGPD antes de producao.

## Dados sensiveis

Devem ser tratados como sensiveis desde a concepcao: fe, saude, sono, energia, familia, relacionamentos, financas, emocoes, pensamentos, impulsos, Chamado, Metacognicao, calendario, habitos, Placar, Revisao Semanal, Atalaia e Documento de Compromisso.

## Principios

- Privacidade por padrao.
- Coleta minima e finalidade clara.
- Consentimento granular, versionado, auditavel e revogavel.
- Menor privilegio.
- Validacao server-side para acoes sensiveis quando a stack existir.
- Logs sem conteudo intimo bruto.
- Compartilhamento externo somente por escopo e previa clara.

## Consentimento

Consentimentos minimos futuros:

1. Termos e politica de privacidade.
2. Uso de IA.
3. Tratamento de dados sensiveis.
4. Comunicacoes.
5. Analytics/telemetria, se houver.
6. Atalaia por alvo e por escopo.
7. Compartilhamento de Documento de Compromisso.
8. Uso de dados em avaliacoes/evals internas, se aprovado.

Cada consentimento deve registrar tipo, versao, data de aceite, data de revogacao, escopo e recurso relacionado quando aplicavel.

## Atalaia

Atalaia deve ser vinculado a um alvo especifico. Nao existe acesso a conta inteira.

Permissoes permitidas na V1:

- Status do alvo.
- Progresso autorizado.
- Marcos autorizados.
- Atraso autorizado.
- Pedido de ajuda.
- Resumo limitado do Placar, se o usuario autorizar.

Excluidos por padrao:

- Chamado completo.
- Metacognicao.
- Saude.
- Familia.
- Financas.
- Emocoes.
- Revisoes privadas.
- Inbox bruto.
- Calendario completo.

Toda mensagem ao Atalaia deve ter previa clara antes de envio. Revogacao deve ter efeito imediato quando a arquitetura permitir.

## Metacognicao

Metacognicao e privada por padrao. O historico pode conter pensamento bruto, emocoes, impulsos e fragilidades internas, portanto nao deve ser compartilhado automaticamente, nao deve entrar em logs brutos e nao deve ser tratado como prontuario clinico.

Compartilhamento com Atalaia so pode ocorrer por selecao manual de um resumo especifico, com consentimento explicito, previa e escopo.

## RLS futura no Supabase

Na fundacao Prompt 4:

- Toda tabela em schema exposto deve ter RLS habilitado.
- Politicas devem refletir dono, escopo, Atalaia autorizado e Atalaia revogado.
- Evitar autorizacao baseada em metadata editavel pelo usuario.
- Preferir `app_metadata` ou tabelas server-managed para autorizacao.
- `service_role` nunca deve ir para cliente, mobile, browser, logs ou `NEXT_PUBLIC_*`.
- Storage privado por padrao.
- Views expostas devem respeitar RLS; em Postgres 15+, preferir `security_invoker = true`.
- Funcoes `security definer` nao devem ficar em schema exposto.
- As migrations preparadas deixam Metacognicao, Chamado completo, revisoes privadas, inbox bruto, calendario completo e logs owner-only.
- Atalaia acessa apenas accountability/grants/notificacoes/documento compartilhado, com grant ativo e revogacao.
- Storage privado exige path por usuario e signed URL server-side para compartilhamento futuro.

## Secrets

- Nunca commitar `.env`, `.env.local`, tokens, chaves, certificados, webhooks ou credenciais.
- `.env.example` contem somente placeholders.
- `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e tokens de e-mail sao server-side.
- Qualquer secret exposto deve ser considerado comprometido e rotacionado.

## Logs

Logs permitidos:

- ID interno ou pseudonimizado.
- Evento tecnico.
- Recurso.
- Status.
- Erro categorizado.
- Latencia.
- Versao de schema/consentimento.

Logs proibidos por padrao:

- Pensamentos brutos.
- Prompts privados.
- Respostas brutas de IA.
- Conteudo de Metacognicao.
- Chamado completo.
- Saude, familia, financas, fe e emocoes.
- Mensagens completas ao Atalaia.

## Retencao

A politica de retencao deve ser definida antes da primeira coleta real. A regra base e reter apenas pelo tempo necessario a finalidade declarada, com exportacao e exclusao disponiveis em fase apropriada.

## Exportacao e exclusao

A arquitetura futura deve prever:

- Exportacao de dados do usuario.
- Exclusao de conta e dados.
- Exclusao seletiva de sessoes de Metacognicao.
- Revogacao de Atalaia.
- Registro de consentimentos historicos quando juridicamente necessario.

## Riscos e mitigacoes

| Risco | Severidade | Mitigacao |
|---|---:|---|
| Vazamento entre usuarios | Critica | RLS, testes por persona de acesso, menor privilegio |
| Atalaia vendo dados intimos | Critica | Grants por alvo, exclusoes padrao, previa, auditoria, revogacao |
| Metacognicao virar terapia | Alta | Limites claros, guardrails, crise fora do fluxo de produtividade |
| Culpa espiritual | Alta | Linguagem segura e camada crista configuravel |
| Prompts brutos em logs | Alta | Redacao, minimizacao e metadados tecnicos |
| Consentimento generico | Alta | Consentimento granular e versionado |
| IA alterando dados sem revisao | Alta | Saidas estruturadas, revisao do usuario e validacao server-side |
| Migration aplicada sem teste RLS | Alta | Aplicar em ambiente controlado e rodar matriz de acesso antes de producao |
