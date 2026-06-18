export const runtime = "nodejs";

import { buildDocx } from "@/lib/cv-docx";
import type { RewrittenCVLedger } from "@/lib/types";

export async function POST(req: Request) {
  const { rewritten } = (await req.json()) as { rewritten: RewrittenCVLedger };

  const buffer = await buildDocx(rewritten);
  const name =
    rewritten?.contact?.name?.replace(/\s+/g, "-").toLowerCase() ?? "cv";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${name}-rewritten.docx"`,
    },
  });
}
