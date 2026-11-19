import { useQuery } from "@tanstack/react-query";
import { getEvidenceReviews } from "@/features/report/api/report";

// 근거 리뷰 모달용. target({ aspect, sentiment })이 있을 때만 조회한다.
export function useEvidenceReviews(testId, target) {
  return useQuery({
    queryKey: ["report", testId, "reviews", target?.aspect, target?.sentiment],
    queryFn: () => getEvidenceReviews(testId, target),
    enabled: Boolean(testId && target),
    retry: false,
    staleTime: Infinity,
  });
}
