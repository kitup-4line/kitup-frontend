const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

// "2026-11-02"는 로컬 자정으로, ISO 시각 문자열은 그대로 해석한다.
// (new Date("2026-11-02")는 UTC 자정이라 시간대에 따라 하루가 밀릴 수 있음)
function toDate(value) {
  if (value instanceof Date) return value;
  if (DATE_ONLY.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

function startOfDay(value) {
  const date = toDate(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const pad = (n) => String(n).padStart(2, "0");

// 2026.11.10
export function formatDate(value) {
  const date = toDate(value);
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

// 2026.11.02 ~ 11.15 (같은 해면 종료일 연도 생략)
export function formatPeriod(start, end) {
  const startDate = toDate(start);
  const endDate = toDate(end);
  const endText =
    startDate.getFullYear() === endDate.getFullYear()
      ? `${pad(endDate.getMonth() + 1)}.${pad(endDate.getDate())}`
      : formatDate(endDate);
  return `${formatDate(startDate)} ~ ${endText}`;
}

// 종료일까지 남은 일수 (오늘이 종료일이면 0, 지났으면 음수)
export function getDaysLeft(endDate, today = new Date()) {
  return Math.round((startOfDay(endDate) - startOfDay(today)) / DAY_MS);
}

export function formatDDay(daysLeft) {
  if (daysLeft > 0) return `D-${daysLeft} 남음`;
  if (daysLeft === 0) return "D-Day";
  return "종료일 경과";
}
