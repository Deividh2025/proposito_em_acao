# Bug Triage

## Objetivo

Padronizar registro, severidade, reprodução e fechamento de bugs do beta fechado.

## Severidades

- S0 Crítico: impede login, expõe dados, quebra RLS, derruba app, expõe Metacognição, Atalaia vê dado privado, PWA cacheia dado sensível ou deploy quebra.
- S1 Alto: impede fluxo central de onboarding, Chamado, alvo, tarefa, calendário, foco, revisão ou suporte seguro.
- S2 Médio: atrapalha uso com contorno claro.
- S3 Baixo: ajuste visual, copy, acessibilidade pontual ou melhoria menor.

## Fluxo

1. Registrar bug com ID.
2. Classificar domínio.
3. Reproduzir com dados fictícios.
4. Definir severidade.
5. Decidir destino: antes do preview, antes do beta real, backlog V1.1, não reproduzido ou decisão de produto.
6. Corrigir com teste focado quando houver código.
7. Rodar gate adequado.
8. Atualizar docs/log se impactar operação.

## Domínios

- Auth.
- Supabase/RLS.
- IA/guardrails.
- UX/a11y.
- PWA/mobile.
- Segurança/privacidade.
- Funcional.
- Build/testes.
- Docs/release.

## Template

```md
ID:
Titulo:
Severidade:
Dominio:
Fonte:
Ambiente:
Pre-condicoes:
Passos para reproduzir:
Resultado esperado:
Resultado atual:
Evidencias:
Dados sensiveis envolvidos:
Impacto na V1/release:
Teste focado:
Comando de verificacao:
Status:
Criterios de fechamento:
```

## Bugs/riscos conhecidos para fila

- Supabase remoto ainda desalinhado da V1 completa.
- RLS dinâmica ainda não executada com personas.
- Auth real ainda não validado em ambiente publicado.
- Algumas server actions retornam `error.message` técnico do Supabase ao usuário; registrar como S1/S2 antes de beta real e trocar por mensagem genérica sanitizada.
