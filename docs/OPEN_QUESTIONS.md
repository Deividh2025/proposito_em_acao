# Open Questions

Este arquivo lista apenas duvidas ainda abertas. Decisoes ja fechadas ficam em `docs/DECISIONS.md`.

## Produto

- Nome final do modulo de Metacognicao.
- Intensidade padrao da camada crista.
- Publico inicial prioritario do beta fechado.
- Nivel inicial de gamificacao do Jardim da Vida.
- Modelo comercial.
- Materiais proprietarios aprovados para base de conhecimento da IA.

## Deploy e operacao

- Dominio exato de preview/producao a adquirir na Hostinger.
- Se a Hostinger KVM 1 sustentara a aplicacao com estabilidade ou exigira upgrade antes do beta.
- Janela, operador e backup para cutover do projeto Supabase principal.
- Grupo inicial de usuarios beta e regra de uso de dados ficticios versus dados reais.
- Rotina diaria de acompanhamento do beta fechado.
- Canal externo de feedback beta, se existir alem do rascunho in-app.

## IA, email e analytics

- Modelo OpenAI padrao por ambiente/fluxo.
- Regras de roteamento do modo `automatic` entre OpenAI, DeepSeek Flash e DeepSeek Pro.
- Limites de custo, timeout e rate limit por provider/agente.
- Quais fluxos sensiveis permanecerao apenas mock/manual no primeiro beta.
- Texto final do consentimento de IA por provider.
- Texto final do consentimento de analytics/feedback e mecanismo de opt-in/revogacao.

## Supabase, Auth e seguranca

- Estrategia final de testes RLS para cobrir todas as tabelas, incluindo Atalaia convidado e transicao `invited -> active`.
- Politica operacional de exportacao/exclusao para dados sensiveis antes da primeira coleta real.
- Regras finais de sessao, callback, confirmacao e recuperacao do Supabase Auth em URL publicada.
- Se o beta exigira portal autenticado do Atalaia antes de convites com link expiravel.
