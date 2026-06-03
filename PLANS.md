# PLANS.md

Todo trabalho complexo deve ter um plano antes da implementacao. O plano deve ser curto o bastante para ser usado e completo o bastante para outro agente executar sem decidir arquitetura no improviso.

## Quando criar plano

Crie plano antes de qualquer tarefa que:

- toque multiplos arquivos;
- altere comportamento de produto;
- envolva IA, Supabase, RLS, dados sensiveis, Atalaia ou Metacognicao;
- introduza dependencia, stack, deploy, autenticacao ou migracao;
- possa afetar roadmap, seguranca, UX ou documentacao publica.

## Template obrigatorio

```md
# Titulo do plano

## Objetivo

Uma frase dizendo o que sera entregue.

## Contexto

Fonte de verdade consultada, estado atual do repositorio e decisoes ja fixadas.

## Arquivos envolvidos

- Criar:
- Modificar:
- Nao tocar:

## Subagentes necessarios

Liste os subagentes por responsabilidade. Marque `N/A` somente para tarefa pequena e local.

## Skills necessarias

Liste skills do projeto ou skills externas relevantes.

## Riscos

Escopo, seguranca, privacidade, IA, dados, UX, dependencia externa e rollback.

## Estrategia

Passos concretos em ordem, com limites claros do que nao sera feito.

## Criterios de aceite

Comportamentos ou artefatos verificaveis.

## Testes e verificacoes

Comandos exatos, resultado esperado e justificativa para qualquer `N/A`.

## Rollback

Como desfazer com seguranca.

## Documentacao a atualizar

Docs que devem mudar junto com a implementacao.
```

## Roadmap macro

1. Preparacao do repositorio.
2. Fontes de verdade completas.
3. Stack e arquitetura.
4. Supabase, Auth, banco, RLS e storage privado.
5. Design system e shell do app.
6. Onboarding e direcao.
7. IA central e structured outputs.
8. Alvos, projetos e tarefas.
9. Calendario e inbox.
10. Desbloqueador de Acao e Metacognicao.
11. Foco, habitos e Placar.
12. Revisao semanal e Jardim da Vida.
13. Atalaia, compromisso e consentimentos.
14. Mobile/PWA complementar.
15. QA, seguranca e privacidade.
16. Deploy.
17. Beta fechado, observabilidade, feedback, metricas e plano V1.1.

## Regras de execucao

- Nao avancar fase sem criterio de aceite verificavel.
- Nao usar stack ainda nao aprovada.
- Nao criar banco, auth ou chamadas reais de IA sem plano proprio.
- Mudanca relevante sem doc atualizada nao esta pronta.
- Risco de privacidade sem mitigacao bloqueia merge.
- Atalaia exige plano proprio com RLS, consentimento, previa e revogacao.
- Metacognicao exige revisao de guardrails e privacidade.
