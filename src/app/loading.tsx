import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <LoadingState label="Carregando..." />
    </div>
  );
}
