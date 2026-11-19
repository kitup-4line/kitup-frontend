const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

const request = async (endpoint, method = "GET") => {
  if (!BASE_URL) {
    throw new Error("백엔드 Base URL이 설정되지 않았습니다.");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { method });
  const result = await response.json();

  if (!response.ok || result?.success === false) {
    const error = new Error(
      result?.error?.message || "대시보드 데이터를 불러오지 못했습니다.",
    );
    error.code = result?.error?.code;
    throw error;
  }

  return result;
};

export const getDashboardSummary = (testId) =>
  request(`/api/tests/${testId}/dashboard/summary/`);

export const getHourlySales = (testId) =>
  request(`/api/tests/${testId}/dashboard/hourly-sales/`);

export const getDashboardChannels = (testId) =>
  request(`/api/tests/${testId}/dashboard/channels/`);

export const getOrders = (testId) => request(`/api/tests/${testId}/orders/`);

export const importSampleOrders = (testId) =>
  request(`/api/tests/${testId}/orders/import-sample/`, "POST");
