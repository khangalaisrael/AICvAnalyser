export const runtime = "nodejs";

import { renderToBuffer } from "@react-pdf/renderer";
import { CVDocument } from "@/components/rewrite/CVTemplate";
import type { RewrittenCVLedger } from "@/lib/types";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    rewritten: RewrittenCVLedger;
    accentColor?: string;
    templateId?: string;
    targetRole?: string;
  };
  const { rewritten, accentColor = "#1d3557", templateId = "modern", targetRole } = body;

  const buffer = await renderToBuffer(
    <CVDocument
      rewritten={rewritten}
      accentColor={accentColor}
      templateId={templateId as "modern" | "classic" | "compact"}
      targetRole={targetRole}
    />
  );

  const name =
    rewritten?.contact?.name?.replace(/\s+/g, "-").toLowerCase() ?? "cv";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}-rewritten.pdf"`,
    },
  });
}
