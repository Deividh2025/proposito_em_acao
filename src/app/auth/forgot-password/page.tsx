import { MailCheck } from "lucide-react";

import { requestPasswordResetAction } from "../actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SuccessState } from "@/components/ui/SuccessState";

type ForgotPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusMessages: Record<string, { title: string; description: string }> = {
  local: {
    title: "Modo local/dev",
    description: "Nenhum e-mail real foi enviado porque Auth nao esta configurado nesta sessao."
  },
  sent: {
    title: "Verifique seu e-mail",
    description: "Se houver uma conta habilitada para esse endereco, enviaremos as proximas instrucoes."
  }
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = (await searchParams) ?? {};
  const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status;
  const status = rawStatus ? statusMessages[rawStatus] : null;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Solicite uma etapa de recuperacao sem expor se o e-mail existe ou nao."
        status="Auth"
        title="Recuperar acesso"
      />

      {status ? <SuccessState description={status.description} title={status.title} /> : null}

      <Card as="section" className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="rounded-control bg-purpose-50 p-2 text-purpose-700">
            <MailCheck aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-900">Enviar instrucoes</h2>
            <p className="mt-1 text-sm leading-6 text-ink-600">
              Use o e-mail da conta. A resposta sera a mesma para proteger sua privacidade.
            </p>
          </div>
        </div>

        <form action={requestPasswordResetAction} className="space-y-3">
          <label className="block text-sm font-semibold text-ink-800">
            E-mail
            <Input autoComplete="email" className="mt-1" name="email" required type="email" />
          </label>
          <Button className="w-full" type="submit">
            Enviar instrucoes
          </Button>
        </form>
      </Card>
    </div>
  );
}
