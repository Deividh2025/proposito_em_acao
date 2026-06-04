import { KeyRound } from "lucide-react";

import { updatePasswordAction } from "../actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SuccessState } from "@/components/ui/SuccessState";

type UpdatePasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const statusMessages: Record<string, { title: string; description: string }> = {
  invalid: {
    title: "Revise a nova senha",
    description: "Use pelo menos 6 caracteres e confirme a mesma senha nos dois campos."
  },
  local: {
    title: "Modo local/dev",
    description: "A senha nao foi alterada porque Auth nao esta configurado nesta sessao."
  }
};

export default async function UpdatePasswordPage({ searchParams }: UpdatePasswordPageProps) {
  const params = (await searchParams) ?? {};
  const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status;
  const status = rawStatus ? statusMessages[rawStatus] : null;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Defina uma nova senha apenas depois de abrir um link valido de recuperacao."
        status="Auth"
        title="Atualizar senha"
      />

      {status ? <SuccessState description={status.description} title={status.title} /> : null}

      <Card as="section" className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="rounded-control bg-action-50 p-2 text-action-700">
            <KeyRound aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-ink-900">Nova senha</h2>
            <p className="mt-1 text-sm leading-6 text-ink-600">
              Escolha uma senha que voce consiga guardar com seguranca.
            </p>
          </div>
        </div>

        <form action={updatePasswordAction} className="space-y-3">
          <label className="block text-sm font-semibold text-ink-800">
            Nova senha
            <Input
              autoComplete="new-password"
              className="mt-1"
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <label className="block text-sm font-semibold text-ink-800">
            Confirmar nova senha
            <Input
              autoComplete="new-password"
              className="mt-1"
              minLength={6}
              name="confirmPassword"
              required
              type="password"
            />
          </label>
          <Button className="w-full" intent="action" type="submit">
            Atualizar senha
          </Button>
        </form>
      </Card>
    </div>
  );
}
