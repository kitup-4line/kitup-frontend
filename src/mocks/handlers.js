import { http, HttpResponse } from "msw";
import { mockTests } from "@/mocks/data/tests";

// 개발 중 빈 화면 확인용: 주소 뒤에 ?mock=empty 를 붙이면 테스트 0건으로 응답
const isEmptyMock = () =>
  new URLSearchParams(window.location.search).get("mock") === "empty";

// 백엔드 공통 응답 형식 { success, message, data }
const ok = (data, init) =>
  HttpResponse.json({ success: true, message: null, data }, init);

// 삭제가 반영되도록 목업 목록을 복사해 메모리에서 관리한다 (새로고침하면 초기화)
let tests = [...mockTests];

// 새로 만드는 초안의 id (목업 데이터와 겹치지 않게 큰 수부터 시작)
let nextTestId = 100;

// POST /api/tests/ 응답(MenuTestDetail) 형태의 빈 초안
const createDraft = () => {
  const now = new Date().toISOString();
  return {
    test_id: nextTestId++,
    menu_name: null,
    selling_price: null,
    packaging_cost: 0,
    business_start_time: "11:00:00",
    business_end_time: "21:00:00",
    total_ingredient_cost: null,
    additional_fixed_cost: null,
    status: "DRAFT",
    resume_step: "BASIC_INFO",
    is_editable: true,
    kitchen_name: null,
    started_at: null,
    ended_at: null,
    created_at: now,
    updated_at: now,
  };
};

export const handlers = [
  http.get("/api/tests/", () => ok(isEmptyMock() ? [] : tests)),
  http.post("/api/tests/", () => ok(createDraft(), { status: 201 })),
  http.delete("/api/tests/:testId/", ({ params }) => {
    const testId = Number(params.testId);
    if (!tests.some((test) => test.test_id === testId)) {
      return HttpResponse.json(
        { success: false, message: "테스트를 찾을 수 없습니다.", data: null },
        { status: 404 },
      );
    }
    // 실서버와 동일: 작성 중(DRAFT) 테스트만 삭제 가능
    if (tests.find((test) => test.test_id === testId).status !== "DRAFT") {
      return HttpResponse.json(
        {
          success: false,
          message: "작성 중인 테스트만 삭제할 수 있습니다.",
          data: null,
        },
        { status: 409 },
      );
    }
    tests = tests.filter((test) => test.test_id !== testId);
    return new HttpResponse(null, { status: 204 });
  }),
];
