# Architecture

## Visao geral

Propósito em Ação sera um SaaS desktop-first com PWA/mobile complementar. A fundacao tecnica usa Next.js como shell full-stack, React para UI, TypeScript para contratos, Supabase como backend planejado e OpenAI como camada operacional de IA.

Nesta etapa existe esqueleto tecnico com migrations Supabase, RLS e storage preparados em arquivos. Nao ha produto funcional, Auth aplicado remotamente, prompts finais, chamadas reais de IA ou deploy.

## Camadas

- UI: `src/app`, `src/components`, `src/styles`.
- Dominio: `src/domain`, organizado pelos modulos do PRD.
- Infra app: `src/lib/config`, `src/lib/utils`, `src/lib/security`.
- Supabase: `src/lib/supabase`, `supabase/migrations`, `supabase/policies`, `supabase/tests`.
- IA futura: `src/ai/agents`, `src/ai/schemas`, `src/ai/prompts`, `src/ai/guardrails`, `src/ai/evals`.
- Tipos compartilhados: `src/types`.
- Testes: `src/tests/unit`, `src/tests/integration`, `src/tests/e2e`.

## Fluxo de dados futuro

1. Usuario interage com UI desktop-first.
2. Formularios validam entrada no cliente e no servidor.
3. Rotas server-side ou server actions validam permissao e schema.
4. Supabase Auth identifica o usuario.
5. Postgres/RLS protege dados por usuario, alvo e consentimento.
6. OpenAI recebe apenas o minimo necessario para o fluxo.
7. Saida estruturada e validada antes de persistir.
8. Usuario revisa alteracoes sensiveis antes de salvar ou enviar ao Atalaia.

## Fronteiras

- UI nao acessa `service_role`, `OPENAI_API_KEY`, prompts privados ou dados sem permissao.
- Dominio nao depende diretamente de framework visual.
- Supabase clients ficam isolados em `src/lib/supabase`.
- OpenAI clients ficam isolados em `src/lib/openai`.
- Prompts, schemas e guardrails ficam separados para revisao.
- Atalaia deve operar por grant de alvo, nunca por acesso amplo a conta.

## Integracoes futuras

- Supabase Auth, Postgres, RLS, Storage privado e Edge Functions ou rotas server-side.
- OpenAI API com Structured Outputs, schemas Zod/JSON Schema e evals.
- Email transacional para Atalaia, convites e notificacoes.
- PWA para captura rapida, habitos, foco curto, Desbloqueador e Metacognicao rapida.

## Seguranca

- Secrets somente server-side.
- `.env.example` contem placeholders.
- Dados de fe, saude, familia, financas, emocoes, Chamado, Metacognicao, calendario, habitos, revisoes e Atalaia sao sensiveis.
- Logs nao devem conter conteudo intimo bruto, prompts privados ou respostas brutas de IA por padrao.
- RLS e obrigatoria em toda tabela exposta e foi preparada nas migrations do Prompt 4.

## Testes

- `npm run lint`: qualidade estatica.
- `npm run typecheck`: contratos TypeScript.
- `npm run test`: schemas e utilitarios.
- `npm run build`: validacao de build Next.
- `npm run test:e2e`: fluxo de navegador quando a UI tiver comportamento relevante.

## Deploy

O deploy nao foi criado. A arquitetura permanece portavel para Vercel, Render, Coolify/VPS ou Hostinger se o plano suportar runtime Node adequado para Next server-side.

## Supabase Prompt 4

As migrations foram criadas, mas nao aplicadas remotamente por falta de credenciais administrativas/CLI. Antes de producao, aplicar em ambiente controlado, rodar testes RLS e gerar tipos reais.
