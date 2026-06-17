"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analyseCv } from "@/lib/api";
import { useAppStore } from "@/store/appStore";

export function useAnalyse() {
  const queryClient = useQueryClient();
  const { setActiveCandidateId } = useAppStore();

  return useMutation({
    mutationFn: ({ file, role, customJd, mode }: { file: File; role: string; customJd?: string; mode?: "role" | "aspiring" | "apply" }) =>
      analyseCv(file, role, customJd, mode ?? "role"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setActiveCandidateId(data.id);
    },
  });
}
