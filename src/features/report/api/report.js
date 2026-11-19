import { apiClient } from "@/shared/api/client";

// 리포트 조회. includeQuantitative=false면 계산 결과(quantitative)를 생략한다.
export const getReport = (testId, { includeQuantitative = true } = {}) =>
  apiClient(
    `/tests/${testId}/report/?include_quantitative=${includeQuantitative}`,
  );

// 리포트 생성 또는 재시도. 추가 고정비는 처음 생성할 때만 필수다.
export const createReport = (testId, additionalFixedCost) =>
  apiClient(`/tests/${testId}/report/`, {
    method: "POST",
    body:
      additionalFixedCost == null
        ? {}
        : { additional_fixed_cost: additionalFixedCost },
  });

// 분석 항목(aspect)과 긍정/부정(sentiment)에 해당하는 근거 리뷰 원문 조회
export const getEvidenceReviews = (testId, { aspect, sentiment }) =>
  apiClient(
    `/tests/${testId}/report/reviews/?aspect=${aspect}&sentiment=${sentiment}`,
  );

export const reportQueryKey = (testId) => ["report", testId];

const REVIEW_DONE = ["SUCCEEDED", "NOT_REQUIRED"];
const IN_PROGRESS = ["PENDING", "RUNNING"];

// AI 분석이 아직 진행 중이라 계속 조회해야 하는 상태인지 (API 문서의 상태표 기준)
export function isReportInProgress(report) {
  if (!report) return false;
  const { review_analysis_status: review, improvement_status: improvement } =
    report;

  if (IN_PROGRESS.includes(review)) return true;
  return REVIEW_DONE.includes(review) && IN_PROGRESS.includes(improvement);
}
