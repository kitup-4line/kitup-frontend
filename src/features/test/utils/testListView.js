import { TEST_FILTER, TEST_STATUS } from "@/domain/testStatus";

export const PAGE_SIZE = 5;

function matchesQuery(test, query) {
  // menu_name은 작성 중(DRAFT)이면 null일 수 있음
  return (test.menu_name ?? "").toLowerCase().includes(query.toLowerCase());
}

function sortByLatest(tests) {
  return [...tests].sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
  );
}

function countByStatus(tests) {
  const counts = { [TEST_FILTER.ALL]: tests.length };
  Object.values(TEST_STATUS).forEach((status) => {
    counts[status] = tests.filter((test) => test.status === status).length;
  });
  return counts;
}

/**
 * 검색 → 탭 숫자 계산 → 탭 필터 → 최신순 정렬 → 페이지 자르기
 * (탭 숫자는 검색 결과 기준)
 */
export function getTestListView({ tests, status, query, page }) {
  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const searched = isSearching
    ? tests.filter((test) => matchesQuery(test, trimmedQuery))
    : tests;
  const counts = countByStatus(searched);

  const filtered =
    status === TEST_FILTER.ALL
      ? searched
      : searched.filter((test) => test.status === status);
  const sorted = sortByLatest(filtered);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;

  return {
    isSearching,
    query: trimmedQuery,
    counts,
    searchedTotal: searched.length,
    total: sorted.length,
    rows: sorted.slice(start, start + PAGE_SIZE),
    page: currentPage,
    totalPages,
  };
}
