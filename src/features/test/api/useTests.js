import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import { queryKeys } from "@/shared/api/queryKeys";

export default function useTests() {
  return useQuery({
    queryKey: queryKeys.tests.all,
    queryFn: () => apiClient("/tests/"),
  });
}
