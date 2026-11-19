const API_ORIGIN = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

const BASE_URL = API_ORIGIN.endsWith("/api") ? API_ORIGIN : `${API_ORIGIN}/api`;

// 백엔드 응답은 { success, message, data } 형식이라 data만 꺼내서 반환한다.
export async function apiClient(
  path,
  { method = "GET", body, ...options } = {},
) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (response.status === 204) return null;

  const json = await response.json().catch(() => null);

  if (!response.ok || json?.success === false) {
    const error = new Error(
      json?.error?.message ??
        json?.message ??
        `API ${method} ${path} 실패 (${response.status})`,
    );
    // 호출하는 쪽에서 404(리포트 없음) 등을 구분할 수 있도록 상태 코드를 남긴다.
    error.status = response.status;
    error.code = json?.error?.code;
    throw error;
  }

  return json.data;
}
