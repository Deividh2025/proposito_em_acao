import { buildAuthenticatedUserDataExport } from "@/lib/supabase/queries/privacy-settings";

export async function GET() {
  try {
    const exportDocument = await buildAuthenticatedUserDataExport();
    const generatedAt = exportDocument.generatedAt.replace(/[:.]/g, "-");

    return Response.json(exportDocument, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="proposito-em-acao-export-${generatedAt}.json"`
      }
    });
  } catch {
    return Response.json(
      {
        error: "authenticated_export_required"
      },
      {
        headers: {
          "Cache-Control": "no-store"
        },
        status: 401
      }
    );
  }
}
