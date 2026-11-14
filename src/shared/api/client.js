const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

// 백엔드 응답은 { success, message, data } 형식이라 data만 꺼내서 반환한다.
export async function apiClient(path, { method = "GET", body, ...options } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  if (response.status === 204) return null;

  const json = await response.json().catch(() => null);

  if (!response.ok || json?.success === false) {
    throw new Error(json?.message ?? `API ${method} ${path} 실패 (${response.status})`);
  }

  return json.data;
}
