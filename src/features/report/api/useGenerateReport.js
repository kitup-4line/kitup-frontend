import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReport, reportQueryKey } from "@/features/report/api/report";

// 리포트 생성 또는 실패한 단계 재시도.
// 응답(계산 결과 + 진행 상태)을 조회 캐시에 넣으면 useReport의 반복 조회가 이어서 동작한다.
export function useGenerateReport(testId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (additionalFixedCost) =>
      createReport(testId, additionalFixedCost),
    onSuccess: (data) => {
      queryClient.setQueryData(reportQueryKey(testId), (prev) => ({
        review_analysis: null,
        improvements: null,
        ...prev,
        ...data,
      }));
    },
  });
}
