# Beta Plan - Prompt 17

Data: 2026-06-02.

## Status

Beta fechado com usuários reais: bloqueado.

O produto está pronto para preparar e ensaiar beta em preview controlado, mas não deve convidar usuários reais até concluir os gates externos já registrados: deploy/preview publicado, Supabase alinhado, RLS dinâmica, Auth real, secrets no provedor, LGPD mínima, rollback aprovado, smoke publicado e validação PWA por HTTPS.

## Objetivo do beta

Validar se o usuário transforma direção em ação concreta com baixa fricção:

perfil -> Mapa da Vida -> Chamado provisório -> alvo -> projeto/tarefa -> agenda/foco -> retomada/revisão.

## North Star

Semanas com pelo menos 3 ações concluídas alinhadas a um alvo vinculado ao Chamado.

## Coorte inicial

- 6 a 10 adultos.
- Usuários em português.
- Desktop como superfície principal.
- PWA/mobile apenas para ações rápidas.
- Preferir perfis: sobrecarregado funcional, procrastinador consciente, TDAH-like, cristão buscando direção e realizador sem equilíbrio.

Evitar no primeiro beta: menores, usuários em crise emocional ativa, pessoas esperando terapia/diagnóstico e casos que dependam de Atalaia sensível logo no início.

## Fases

1. Ensaio interno com dados fictícios.
2. Preview controlado com Supabase/Auth/RLS reais.
3. Coorte pequena por 14 dias.
4. Revisão de métricas, bugs, feedback e incidentes.
5. Decisão: avançar, repetir beta com ajustes ou bloquear.

## Critérios de sucesso

- 70% completam ativação mínima: perfil, Mapa/Chamado, primeiro alvo, primeira tarefa/projeto, tarefa agendada e uma ação executada.
- 60% completam pelo menos 3 ações alinhadas ao Chamado em uma semana.
- 80% dizem que a próxima ação ficou clara.
- 0 vazamentos entre usuários.
- 0 acesso indevido de Atalaia.
- 0 cache PWA com dados sensíveis.
- 0 respostas com diagnóstico, terapia substitutiva, culpa espiritual ou humilhação.

## Perguntas de validação

- O usuário entende que Chamado vem antes de agenda?
- O usuário sabe o próximo passo em poucos segundos?
- O produto reduz paralisia ou aumenta carga?
- Desbloqueador ajuda a começar?
- Metacognição ajuda sem parecer terapia?
- Placar e Jardim encorajam sem vergonha?
- Mobile permite abrir, registrar e fechar?
- Privacidade e Atalaia ficam claros?

## Decisões pendentes do fundador

- URL temporária e domínio final.
- Aplicar migrations em Supabase preview.
- LGPD mínima: termos, privacidade, consentimento, retenção, exportação e exclusão.
- IA real ligada ou desligada no beta.
- E-mail real ligado ou desligado no beta.
- Plano de rollback.
- Grupo inicial de usuários e regra de dados fictícios/reais.
