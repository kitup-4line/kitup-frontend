import { describe, expect, it } from "vitest";
import { ELLIPSIS_END, ELLIPSIS_START, getPageItems } from "../pagination";

describe("getPageItems", () => {
  it("5페이지 이하는 전부 표시", () => {
    expect(getPageItems(1, 1)).toEqual([1]);
    expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("앞쪽(1~3): 1 2 3 … N", () => {
    expect(getPageItems(1, 12)).toEqual([1, 2, 3, ELLIPSIS_END, 12]);
    expect(getPageItems(3, 12)).toEqual([1, 2, 3, ELLIPSIS_END, 12]);
  });

  it("중간: 1 … c-1 c c+1 … N", () => {
    expect(getPageItems(6, 12)).toEqual([1, ELLIPSIS_START, 5, 6, 7, ELLIPSIS_END, 12]);
  });

  it("끝쪽(마지막 3개): 1 … N-2 N-1 N", () => {
    expect(getPageItems(10, 12)).toEqual([1, ELLIPSIS_START, 10, 11, 12]);
    expect(getPageItems(4, 6)).toEqual([1, ELLIPSIS_START, 4, 5, 6]);
  });
});
