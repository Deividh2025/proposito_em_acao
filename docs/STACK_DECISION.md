# Stack Decision

## Status

Decidido para a fundacao tecnica inicial.

## Stack escolhida

- Next.js com App Router.
- React.
- TypeScript em modo `strict`.
- Tailwind CSS.
- Supabase para Auth, Postgres, RLS, Storage privado e Edge Functions quando necessario.
- OpenAI API futura, com Structured Outputs para respostas que viram dados.
- Zod para validacao de schemas no app.
- React Hook Form para formularios.
- Vitest para testes unitarios e de integracao.
- Playwright para E2E.
- ESLint e Prettier para qualidade e consistencia.
- PWA complementar em etapa futura.

## Justificativa

Esta stack atende aos criterios do Prompt 3:

- Velocidade: Next.js reduz custo de setup e suporta frontend e rotas server-side no mesmo projeto.
- Manutenibilidade: TypeScript, App Router, separacao por dominio e schemas reduzem acoplamento.
- Seguranca: server-side routes permitem proteger OpenAI, service role e operacoes sensiveis.
- Supabase: compatibilidade direta com Supabase Auth, Postgres, RLS, Storage e tipos gerados.
- Desktop-first: React/Next permitem dashboard, calendario e fluxos guiados ricos.
- PWA: Next pode evoluir para manifesto, service worker e instalabilidade sem app nativo inicial.
- OpenAI: server-side runtime e schemas estruturados encaixam bem nos fluxos de IA.
- Testabilidade: Vitest e Playwright cobrem unidade, integracao e experiencia.
- Deploy: Vercel, Render, Coolify, VPS/Node e provedores com Node sao alternativas reais.
- Custo: Supabase e deploy serverless/Node permitem comecar com baixo custo.

## Alternativas consideradas

- Vite + React: mais simples, mas exigiria backend separado cedo demais para OpenAI, auth server-side e operacoes sensiveis.
- Remix: bom para dados e rotas, mas menor alinhamento com ecossistema Next/Supabase esperado.
- SvelteKit: excelente tecnicamente, mas menos alinhado ao stack recomendado e disponibilidade de componentes React.
- Backend separado desde o inicio: mais controle, porem maior custo operacional para V1.
- App nativo mobile inicial: fora do escopo; PWA/responsivo cobre acoes rapidas primeiro.

## Dependencias principais

- Runtime: Node.js 20+.
- Framework: Next.js, React, React DOM.
- UI/base: Tailwind CSS, clsx, tailwind-merge, lucide-react.
- Dados: @supabase/supabase-js e @supabase/ssr.
- IA: openai.
- Validacao: zod.
- Formularios: react-hook-form.
- QA: eslint, prettier, typescript, vitest, @playwright/test.

## Riscos

- App Router exige disciplina para separar Server e Client Components.
- Calendario e drag-and-drop podem introduzir dependencias pesadas; devem ser escolhidos depois de prototipo.
- OpenAI sem schemas e evals pode virar chatbot solto; bloqueado por arquitetura.
- Supabase sem RLS real na etapa seguinte seria risco critico.
- Hostinger pode nao ser o melhor encaixe para Next server-side; precisa validacao de plano/runtime.
- Supabase sem testes RLS executados em ambiente real permanece risco critico.

## Decisoes pendentes

- Provedor de deploy final.
- Biblioteca de calendario.
- Biblioteca de drag-and-drop.
- Biblioteca de componentes, se alguma.
- Estrategia final de PWA.
- Aplicacao das migrations Supabase no projeto remoto.
- Testes RLS automatizados com Supabase CLI/MCP.

## Referencias oficiais consultadas

- Next.js App Router e configuracao: https://nextjs.org/docs
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- OpenAI Structured Outputs: https://platform.openai.com/docs/guides/structured-outputs
