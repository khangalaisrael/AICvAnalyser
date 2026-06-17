"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { analyseCv } from "@/lib/api";
import { useAppStore } from "@/store/appStore";

export function useAnalyse() {
  const queryClient = useQueryClient();
  const { setActiveCandidateId } = useAppStore();

  return useMutation({
    mutationFn: ({
      file, customJd, mode, userMode,
    }: {
      file: File;
      customJd?: string;
      mode?: "aspiring" | "apply";
      userMode?: "job_seeker" | "professional";
    }) => analyseCv(file, customJd, mode ?? "aspiring", userMode ?? "job_seeker"),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.setQueryData(["candidates", data.id], data);
      setActiveCandidateId(data.id);
    },
  });
}
