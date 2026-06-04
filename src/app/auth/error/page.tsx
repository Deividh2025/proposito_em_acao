import Link from "next/link";
import { AlertTriangle, MailCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";

type AuthErrorPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const errorMessages: Record<string, { title: string; description: string }> = {
  config: {
    title: "Acesso indisponivel neste ambiente",
    description: "A configuracao de Auth precisa ser revisada antes de continuar com sessao real."
  },
  "invalid-link": {
    title: "Link nao confirmado",
    description: "Use o link mais recente enviado para o seu e-mail ou solicite uma nova etapa de acesso."
  },
  session: {
    title: "Sessao nao confirmada",
    description: "Entre novamente para concluir esta acao com seguranca."
  },
  unavailable: {
    title: "Nao foi possivel concluir agora",
    description: "Tente novamente em alguns instantes. Nenhum detalhe sensivel do provedor foi exibido."
  }
};

export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = (await searchParams) ?? {};
  const rawStatus = Array.isArray(params.status) ? params.status[0] : params.status;
  const message = errorMessages[rawStatus ?? ""] ?? errorMessages.unavailable;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Estado seguro para links expirados, configuracao ausente ou sessao nao confirmada."
        status="Auth"
        title="Acesso nao concluido"
      />

      <Card as="section" className="space-y-4 border-gentleDanger-100 bg-gentleDanger-50">
        <div className="flex items-start gap-3 text-gentleDanger-900">
          <AlertTriangle aria-hidden className="mt-1 h-5 w-5 shrink-0" />
          <div>
            <h2 className="text-lg font-bold">{message.title}</h2>
            <p className="mt-2 text-sm leading-6">{message.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-control bg-purpose-700 px-4 text-sm font-semibold text-white transition duration-200 hover:bg-purpose-900"
            href="/auth"
          >
            Voltar ao acesso
          </Link>
          <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 text-sm font-semibold text-purpose-900">
            <MailCheck aria-hidden className="h-4 w-4" />
            Recuperar acesso
          </Link>
        </div>
      </Card>
    </div>
  );
}
