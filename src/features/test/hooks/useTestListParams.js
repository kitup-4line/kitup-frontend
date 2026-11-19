import { useState } from "react";
import { useSearchParams } from "react-router";
import { TEST_FILTER } from "@/domain/testStatus";

const DEFAULTS = { status: TEST_FILTER.ALL, page: "1", q: "" };

/**
 * 탭 · 검색어 · 페이지를 URL(?status=&q=&page=)과 동기화한다.
 * 상세 화면에서 뒤로가기 하면 보던 탭/페이지가 그대로 복원된다.
 *
 * 검색어는 입력 중 한글 조합(IME)이 끊기지 않도록 로컬 state로 즉시 반영하고,
 * URL에는 따라서 기록만 한다.
 */
export default function useTestListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusParam = searchParams.get("status");
  const status = Object.values(TEST_FILTER).includes(statusParam)
    ? statusParam
    : TEST_FILTER.ALL;
  const page = Number(searchParams.get("page")) || 1;
  const [query, setQueryState] = useState(() => searchParams.get("q") ?? "");

  const update = (patch) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([key, value]) => {
          const text = value == null ? "" : String(value);
          if (text === "" || text === DEFAULTS[key]) next.delete(key);
          else next.set(key, text);
        });
        return next;
      },
      { replace: true },
    );

  return {
    status,
    page,
    query,
    setStatus: (nextStatus) => update({ status: nextStatus, page: null }),
    setPage: (nextPage) => update({ page: nextPage }),
    setQuery: (nextQuery) => {
      setQueryState(nextQuery);
      update({ q: nextQuery.trim(), page: null });
    },
  };
}
