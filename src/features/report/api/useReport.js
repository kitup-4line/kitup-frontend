import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReport,
  isReportInProgress,
  reportQueryKey,
} from "@/features/report/api/report";

const POLLING_INTERVAL_MS = 3000;

// 리포트 조회 + AI 분석이 끝날 때까지 반복 조회.
// 계산 결과(quantitative)는 처음 한 번만 받고, 반복 조회 때는 생략한 뒤 이전 값을 이어 붙인다.
export function useReport(testId) {
  const queryClient = useQueryClient();
  const queryKey = reportQueryKey(testId);

  return useQuery({
    queryKey,
    queryFn: async () => {
      const prev = queryClient.getQueryData(queryKey);
      const hasQuantitative = Boolean(prev?.quantitative);

      const data = await getReport(testId, {
        includeQuantitative: !hasQuantitative,
      });

      return hasQuantitative
        ? { ...data, quantitative: prev.quantitative }
        : data;
    },
    enabled: Boolean(testId),
    // 요청 오류가 나면 자동 재요청 없이 멈추고 오류를 표시한다.
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) =>
      query.state.status !== "error" && isReportInProgress(query.state.data)
        ? POLLING_INTERVAL_MS
        : false,
  });
}
