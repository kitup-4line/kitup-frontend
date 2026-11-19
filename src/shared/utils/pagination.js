export const ELLIPSIS_START = "ellipsis-start";
export const ELLIPSIS_END = "ellipsis-end";

const MAX_FULL_PAGES = 5;

/**
 * 페이지 버튼 목록을 만든다.
 *  - 5페이지 이하: 1 2 3 4 5
 *  - 현재 1~3:     1 2 3 … N
 *  - 현재 끝 3개:  1 … N-2 N-1 N
 *  - 그 외:        1 … c-1 c c+1 … N
 */
export function getPageItems(current, total) {
  if (total <= MAX_FULL_PAGES) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, ELLIPSIS_END, total];
  }
  if (current >= total - 2) {
    return [1, ELLIPSIS_START, total - 2, total - 1, total];
  }
  return [1, ELLIPSIS_START, current - 1, current, current + 1, ELLIPSIS_END, total];
}
