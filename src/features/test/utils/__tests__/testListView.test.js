import { describe, expect, it } from "vitest";
import { getTestListView } from "../testListView";
import { mockTests } from "@/mocks/data/tests";

const view = (overrides) =>
  getTestListView({ tests: mockTests, status: "ALL", query: "", page: 1, ...overrides });

describe("getTestListView", () => {
  it("전체: 최신순 5개씩, 2페이지", () => {
    const result = view();
    expect(result.counts).toEqual({ ALL: 9, RUNNING: 2, DRAFT: 2, COMPLETED: 5 });
    expect(result.rows.map((t) => t.test_id)).toEqual([1, 2, 9, 8, 3]);
    expect(result.totalPages).toBe(2);
    expect(view({ page: 2 }).rows).toHaveLength(4);
  });

  it("탭 숫자는 검색 결과 기준", () => {
    const result = view({ query: " 테리 " });
    expect(result.isSearching).toBe(true);
    expect(result.counts).toEqual({ ALL: 1, RUNNING: 1, DRAFT: 0, COMPLETED: 0 });
    expect(result.total).toBe(1);
  });

  it("검색 결과 없음", () => {
    const result = view({ query: "김치찌개" });
    expect(result.searchedTotal).toBe(0);
    expect(result.rows).toEqual([]);
  });

  it("탭 필터 + 범위 밖 페이지는 마지막 페이지로", () => {
    const result = view({ status: "COMPLETED", page: 99 });
    expect(result.total).toBe(5);
    expect(result.page).toBe(1);
  });
});
