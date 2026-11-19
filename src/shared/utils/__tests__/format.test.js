import { describe, expect, it } from "vitest";
import { formatDate, formatDDay, formatPeriod, getDaysLeft } from "../format";

describe("format", () => {
  it("formatDate", () => {
    expect(formatDate("2026-11-02")).toBe("2026.11.02");
  });

  it("formatPeriod: 같은 해면 종료 연도 생략", () => {
    expect(formatPeriod("2026-11-02", "2026-11-15")).toBe("2026.11.02 ~ 11.15");
    expect(formatPeriod("2025-12-20", "2026-01-05")).toBe("2025.12.20 ~ 2026.01.05");
  });

  it("getDaysLeft / formatDDay", () => {
    const today = new Date(2026, 10, 10, 15, 30);
    expect(getDaysLeft("2026-11-15", today)).toBe(5);
    expect(formatDDay(getDaysLeft("2026-11-15", today))).toBe("D-5 남음");
    expect(formatDDay(getDaysLeft("2026-11-10", today))).toBe("D-Day");
    expect(formatDDay(getDaysLeft("2026-11-09", today))).toBe("종료일 경과");
  });
});
