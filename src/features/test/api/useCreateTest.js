import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";

// 빈 초안 테스트 생성 (POST /api/tests/)
// 성공 시 응답 data = { test_id, status: "DRAFT", ... }
export default function useCreateTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient("/tests/", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tests.all });
    },
  });
}
