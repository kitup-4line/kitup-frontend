const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

const request = async (endpoint, method = "GET", body = undefined) => {
  if (!BASE_URL) {
    throw new Error("백엔드 Base URL이 설정되지 않았습니다.");
  }

  const isFormData = body instanceof FormData;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    ...(body !== undefined && {
      body: isFormData ? body : JSON.stringify(body),
    }),
  });

  const text = await response.text();
  const result = text ? JSON.parse(text) : null;

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.error?.message || result?.message || "API 요청에 실패했습니다.",
    );
  }
  return result;
};

// 테스트 생성 (빈 초안)
export const createTest = () => request("/api/tests/", "POST");

// 입력 초깃값 조회
export const getTestDefaults = () => request("/api/tests/defaults/");

// 테스트 상세 조회
export const getTestDetail = (testId) => request(`/api/tests/${testId}/`);

// 기본 정보 및 추가 고정비 수정
export const updateTest = (testId, data) =>
  request(`/api/tests/${testId}/`, "PATCH", data);

// 재료 목록 조회
export const getIngredients = (testId) =>
  request(`/api/tests/${testId}/ingredients/`);

// 재료 일괄 저장
export const saveIngredients = (testId, data) =>
  request(`/api/tests/${testId}/ingredients/`, "PUT", data);

// AI 재료 원가 추정
export const estimateAiIngredients = (testId, data) =>
  request(`/api/tests/${testId}/ingredients/ai-estimate/`, "POST", data);

// 원가 산정 결과 조회
export const getCostResult = (testId) => request(`/api/tests/${testId}/cost/`);
