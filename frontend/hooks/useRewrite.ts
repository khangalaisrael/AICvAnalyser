"use client";

import { useMutation } from "@tanstack/react-query";
import { structureCv, generateRewrite, downloadPdf, downloadDocx } from "@/lib/api-rewrite";
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
      templateId,
      targetRole,
      filename,
    }: {
      rewritten: RewrittenCVLedger;
      accentColor?: string;
      templateId?: string;
      targetRole?: string;
      filename?: string;
    }) =>
      downloadPdf(rewritten, accentColor, templateId, targetRole).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename ?? "cv-rewritten.pdf";
        a.click();
        URL.revokeObjectURL(url);
      }),
  });
}

export function useDownloadDocx() {
  return useMutation({
    mutationFn: ({
      rewritten,
      filename,
    }: {
      rewritten: RewrittenCVLedger;
      filename?: string;
    }) =>
      downloadDocx(rewritten).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename ?? "cv-rewritten.docx";
        a.click();
        URL.revokeObjectURL(url);
      }),
  });
}
