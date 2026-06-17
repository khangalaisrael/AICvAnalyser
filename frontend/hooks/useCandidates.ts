import { useQuery } from "@tanstack/react-query";
import { fetchCandidates, fetchCandidate } from "@/lib/api";

export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
  });
}

export function useCandidate(id: string | null) {
  return useQuery({
    queryKey: ["candidates", id],
    queryFn: () => fetchCandidate(id!),
    enabled: !!id,
  });
}
