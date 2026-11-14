import { http, HttpResponse } from "msw";
import { mockTests } from "@/mocks/data/tests";

// 개발 중 빈 화면 확인용: 주소 뒤에 ?mock=empty 를 붙이면 테스트 0건으로 응답
const isEmptyMock = () =>
  new URLSearchParams(window.location.search).get("mock") === "empty";

// 백엔드 공통 응답 형식 { success, message, data }
const ok = (data) => HttpResponse.json({ success: true, message: null, data });

export const handlers = [
  http.get("/api/tests/", () => ok(isEmptyMock() ? [] : mockTests)),
];
