import { AlertCircle, LogIn, ShieldCheck, UserPlus } from "lucide-react";

import { submitAuthAction, signOutAction } from "./actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SuccessState } from "@/components/ui/SuccessState";
import { isProtectedRoute, sanitizeAuthNext } from "@/lib/auth/redirects";
import { getAppRuntimeMode, getPublicEnv } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusMessages: Record<string, { title: string; description: string }> = {
  "auth-error": {
    title: "Acesso nao confirmado",
    description: "Revise e-mail e senha. Nenhum detalhe sensivel do provedor foi exibido."
  },
  invalid: {
    title: "Dados incompletos",
    description: "Use um e-mail valido e senha com pelo menos 6 caracteres."
  },
  local: {
    title: "Modo local/dev",
    description: "Supabase/Auth ainda nao esta configurado nesta sessao. Nenhuma credencial foi enviada."
  },
  "signed-out": {
    title: "Sessao encerrada",
    description: "Voce saiu do app. Volte quando quiser retomar sem culpa."
  },
  "signup-sent": {
    title: "Conta criada ou aguardando confirmacao",
    description: "Se confirmacao de e-mail estiver ativa no Supabase, confirme o link antes de entrar."
  },
  "password-updated": {
    title: "Senha atualizada",
    description: "Entre novamente se a sessao pedir uma confirmacao adicional."
  }
};

const pageNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/onboarding": "Onboarding",
  "/settings": "Configurações",
  "/goals": "Alvos",
  "/projects": "Projetos",
  "/tasks": "Tarefas",
  "/calendar": "Calendário",
  "/inbox": "Inbox",
  "/focus": "Foco",
  "/habits": "Hábitos",
  "/scoreboard": "Placar",
  "/review": "Revisão",
  "/garden": "Jardim",
  "/metacognition": "Metacognição",
  "/action-unblocker": "Desbloqueador",
  "/accountability": "Atalaia",
  "/commitments": "Compromissos",
  "/mobile": "Mobile"
};

async function getAuthSnapshot() {
  if (getAppRuntimeMode() === "local-demo") {
    return { configured: false, signedIn: false };
  }

  const env = getPublicEnv();
  const configured = Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  if (!configured) {
    return { configured, signedIn: false };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    return { configured, signedIn: Boolean(user) };
  } catch {
    return { configured: false, signedIn: false };
  }
}

function AuthForm({ mode, next }: { mode: "sign-in" | "sign-up"; next: string }) {
  const isSignUp = mode === "sign-up";
  const Icon = isSignUp ? UserPlus : LogIn;

  return (
    <Card as="section" className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="rounded-control bg-purpose-50 p-2 text-purpose-700">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink-900">{isSignUp ? "Criar conta" : "Entrar"}</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600">
            {isSignUp
              ? "Crie acesso por e-mail e senha para persistir dados com RLS."
              : "Entre para salvar e retomar seus dados privados."}
          </p>
        </div>
      </div>

      <form action={submitAuthAction} className="space-y-3">
        <input name="mode" type="hidden" value={mode} />
        <input name="next" type="hidden" value={next} />
        <label className="block text-sm font-semibold text-ink-800">
          E-mail
          <Input autoComplete="email" className="mt-1" name="email" required type="email" />
        </label>
        <label className="block text-sm font-semibold text-ink-800">
          Senha
          <Input
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="mt-1"
            minLength={6}
            name="password"
            required
            type="password"
          />
        </label>
        <Button className="w-full" intent={isSignUp ? "action" : "purpose"} type="submit">
          {isSignUp ? "Criar conta" : "Entrar"}
        </Button>
      </form>
    </Card>
  );
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = (await searchParams) ?? {};
  const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const next = sanitizeAuthNext(rawNext);
  const formNext = next === "/auth" ? "/dashboard" : next;
  const status = rawStatus ? statusMessages[rawStatus] : null;
  const snapshot = await getAuthSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Acesso por e-mail e senha com Supabase Auth, sessao SSR e persistencia protegida por RLS quando o ambiente estiver configurado."
        status="Prompt 15"
        title="Acesso e conta"
      />

      {status ? <SuccessState description={status.description} title={status.title} /> : null}

      {next && isProtectedRoute(next) ? (
        <Card className="border-amber-200 bg-amber-50 text-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle aria-hidden className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <h3 className="font-bold text-amber-800">
                Acesso Restrito: {pageNames[next] || next}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-amber-950">
                Você tentou acessar a página <strong>{pageNames[next] || next}</strong>, que é uma área protegida. 
                Como você não está autenticado, foi redirecionado para a página de login.
              </p>
              <div className="mt-3 text-xs space-y-2 border-t border-amber-200/60 pt-2.5 text-amber-900/80">
                <p>
                  💡 <strong>Para testar no deploy (Coolify):</strong> Se deseja apenas navegar pelo protótipo visual sem restrições de senha, altere a variável de ambiente <code>APP_RUNTIME_MODE</code> para <code>local-demo</code> no painel do Coolify e faça o deploy.
                </p>
                <p>
                  🔑 <strong>Para testar com Autenticação Real:</strong> Crie uma conta usando o formulário ao lado. Se o e-mail de confirmação não chegar, desative a opção &quot;Confirm email&quot; nas configurações de Auth do seu projeto Supabase.
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      <Card as="aside" className="border-action-100 bg-action-50">
        <div className="flex items-start gap-3 text-action-900">
          <ShieldCheck aria-hidden className="mt-1 h-5 w-5 shrink-0" />
          <div>
            <h2 className="font-bold">
              {snapshot.configured ? "Supabase/Auth conectado" : "Supabase/Auth em modo local/dev"}
            </h2>
            <p className="mt-2 text-sm leading-6">
              {snapshot.configured
                ? "A tela usa somente a chave anon publica e actions server-side. Service role e OpenAI nao entram no browser."
                : "Sem variaveis publicas Supabase nesta sessao, os formularios retornam aviso seguro e nao enviam credenciais."}
            </p>
          </div>
        </div>
      </Card>

      {snapshot.signedIn ? (
        <Card as="section" className="space-y-3">
          <h2 className="text-lg font-bold text-ink-900">Sessao ativa</h2>
          <p className="text-sm leading-6 text-ink-600">
            Seus fluxos podem persistir no Supabase quando as migrations e policies estiverem aplicadas.
          </p>
          <form action={signOutAction}>
            <input name="next" type="hidden" value="/auth" />
            <Button intent="neutral" type="submit" variant="outline">
              Sair
            </Button>
          </form>
        </Card>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2" aria-label="Autenticacao">
          <AuthForm mode="sign-in" next={formNext} />
          <AuthForm mode="sign-up" next={formNext} />
        </section>
      )}
    </div>
  );
}
