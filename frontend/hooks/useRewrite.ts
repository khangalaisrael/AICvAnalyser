"use client";

import { useMutation } from "@tanstack/react-query";
import { structureCv, generateRewrite, downloadPdf } from "@/lib/api-rewrite";
import type { CVLedger, RewrittenCVLedger } from "@/lib/types";

export function useStructureCv() {
  return useMutation({
    mutationFn: (file: File) => structureCv(file),
  });
}

export function useGenerateRewrite() {
  return useMutation({
    mutationFn: ({
      ledger,
      cvText,
      targetRole,
      userAnswers,
    }: {
      ledger: CVLedger;
      cvText: string;
      targetRole: string;
      userAnswers?: Record<string, string>;
    }) => generateRewrite(ledger, cvText, targetRole, userAnswers ?? {}),
  });
}

export function useDownloadPdf() {
  return useMutation({
    mutationFn: ({
      rewritten,
      accentColor,
      filename,
    }: {
      rewritten: RewrittenCVLedger;
      accentColor?: string;
      filename?: string;
    }) =>
      downloadPdf(rewritten, accentColor).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename ?? "cv-rewritten.pdf";
        a.click();
        URL.revokeObjectURL(url);
      }),
  });
}
