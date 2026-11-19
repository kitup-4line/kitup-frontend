// API 값이 null일 수 있어(예: 완료 주문 0건) 표시용 대체 문자를 쓴다.
const EMPTY = "-";

const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

// 594000 → "594,000"
export const formatNumber = (value, maximumFractionDigits = 0) =>
  isNumber(value)
    ? value.toLocaleString("ko-KR", { maximumFractionDigits })
    : EMPTY;

// 30.66 → "30.7%"
export const formatPercent = (value, fractionDigits = 1) =>
  isNumber(value) ? `${value.toFixed(fractionDigits)}%` : EMPTY;

// "2026-10-30" → "2026.10.30"
export const formatDate = (value) => (value ? value.replaceAll("-", ".") : EMPTY);

// "2026-11-12T12:30:00+09:00" → "2026.11.12 12:30"
export const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// 퍼센트 값을 막대·게이지 너비(0~100)로 쓸 때
export const toRatio = (value) =>
  isNumber(value) ? Math.min(Math.max(value, 0), 100) : 0;

export const ASPECT_LABEL = {
  taste: "맛",
  portion: "양",
  temperature: "온도",
  packaging: "포장",
};
