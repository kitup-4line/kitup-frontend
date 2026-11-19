// 분석 리포트 화면
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { useReport } from "@/features/report/api/useReport";
import { useGenerateReport } from "@/features/report/api/useGenerateReport";
import ConditionSummary from "@/features/report/components/ConditionSummary";
import ProfitStructure from "@/features/report/components/ProfitStructure";
import SalesPattern from "@/features/report/components/SalesPattern";
import CustomerReaction from "@/features/report/components/CustomerReaction";
import ExperimentSuggestion from "@/features/report/components/ExperimentSuggestion";
import EvidenceReviewModal from "@/features/report/components/EvidenceReviewModal";
import ReportAiStatus from "@/features/report/components/ReportAiStatus";
import add_circle_icon from "@/images/Report/add_circle_icon.svg";

// 개선안의 근거 리뷰 번호로 인용문을 찾기 위한 { review_id → quote } 맵
function buildQuoteMap(reviewAnalysis) {
  const map = new Map();
  if (!reviewAnalysis) return map;

  [...reviewAnalysis.strengths, ...reviewAnalysis.improvement_candidates]
    .flatMap(({ quotes }) => quotes)
    .forEach(({ review_id, quote }) => {
      if (!map.has(review_id)) map.set(review_id, quote);
    });
  return map;
}

export default function ReportPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  // 고정비 입력 페이지에서 "저장 및 리포트 생성"으로 넘어오면 고정비가 함께 전달된다.
  const fixedCost = useLocation().state?.fixedCost;

  const { data: report, error, refetch, isFetching } = useReport(testId);
  const {
    mutate: generateReport,
    isPending: isGenerating,
    error: generateError,
  } = useGenerateReport(testId);
  const [evidenceTarget, setEvidenceTarget] = useState(null);
  const requestedRef = useRef(false);

  const isNotCreated = !report && error?.status === 404;
  const shouldGenerate = isNotCreated && fixedCost != null;

  // 아직 생성되지 않은 리포트면 전달받은 고정비로 생성을 요청한다. (한 번만)
  useEffect(() => {
    if (!shouldGenerate || requestedRef.current) return;
    requestedRef.current = true;
    generateReport(fixedCost);
  }, [shouldGenerate, fixedCost, generateReport]);

  // 실패한 단계부터 다시 시도. 고정비는 서버에 저장된 값을 유지한다.
  const handleRetry = useCallback(() => generateReport(undefined), [generateReport]);
  const closeEvidence = useCallback(() => setEvidenceTarget(null), []);

  const quoteById = useMemo(
    () => buildQuoteMap(report?.review_analysis),
    [report?.review_analysis],
  );

  // 리포트가 없고 고정비 입력도 거치지 않았다면 고정비 입력부터 받는다.
  if (isNotCreated && fixedCost == null) {
    return <Navigate to={`/tests/${testId}/dashboard/cost/fixed-cost`} replace />;
  }

  if (!report?.quantitative) {
    const failure = generateError ?? (shouldGenerate ? null : error);

    return (
      <PageContainer>
        <PageTitle>분석 리포트</PageTitle>
        {failure ? (
          <ReportAiStatus
            variant="failed"
            title="리포트를 불러오지 못했어요"
            description={failure.message}
            onRetry={generateError ? () => generateReport(fixedCost) : () => refetch()}
            isRetrying={isGenerating || isFetching}
          />
        ) : (
          <ReportAiStatus
            variant="loading"
            title={shouldGenerate ? "리포트를 생성하고 있어요" : "리포트를 불러오는 중이에요"}
          />
        )}
      </PageContainer>
    );
  }

  const {
    quantitative,
    review_analysis_status: reviewStatus,
    improvement_status: improvementStatus,
  } = report;

  return (
    <PageContainer>
      <PageTitle>분석 리포트</PageTitle>
      {error && (
        <ReportAiStatus
          variant="failed"
          title="분석 진행 상태를 확인하지 못했어요"
          description={error.message}
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      )}
      {generateError && (
        <ReportAiStatus
          variant="failed"
          title="다시 시도 요청에 실패했어요"
          description={generateError.message}
          onRetry={handleRetry}
          isRetrying={isGenerating}
        />
      )}
      <ConditionSummary conditions={quantitative.analysis_conditions} />
      <ProfitStructure
        profit={quantitative.profit_analysis}
        orderCount={quantitative.analysis_conditions.analysis_data.completed_order_count}
      />
      <SalesPattern salesPattern={quantitative.sales_pattern} />
      <CustomerReaction
        status={reviewStatus}
        analysis={report.review_analysis}
        onRetry={handleRetry}
        isRetrying={isGenerating}
        onOpenEvidence={setEvidenceTarget}
      />
      <BottomGroup>
        <ExperimentSuggestion
          reviewStatus={reviewStatus}
          improvementStatus={improvementStatus}
          improvements={report.improvements}
          quoteById={quoteById}
          onRetry={handleRetry}
          isRetrying={isGenerating}
        />
        <ActionBar>
          <ActionText>
            <p>제안된 개선안을 적용해 후속 테스트를 진행해보세요</p>
            <span>
              이번 테스트를 통해 발견한 개선 포인트를 반영해 새로운 테스트를
              진행하고 수익성 변화를 검증할 수 있습니다.
            </span>
          </ActionText>
          <NewTestButton type="button" onClick={() => navigate("/tests/new")}>
            <img src={add_circle_icon} alt="" aria-hidden="true" />
            후속 테스트 만들기
          </NewTestButton>
        </ActionBar>
      </BottomGroup>
      <EvidenceReviewModal
        testId={testId}
        target={evidenceTarget}
        onClose={closeEvidence}
      />
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;

  width: 100%;
  min-height: calc(100dvh - 64px);
  padding: 20px 120px 60px 104px;
  background-color: #fcfeff;

  line-height: 1.4;
  letter-spacing: -0.024em;
  color: #0f172a;
`;

const PageTitle = styled.h1`
  width: 960px;
  padding: 2px 0 9px;
  border-bottom: 1px solid #e2e8f0;

  font-size: 30px;
  font-weight: 600;
  letter-spacing: -2.4px;
`;

const BottomGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow:
    0 4px 16px -2px rgba(15, 23, 42, 0.06),
    0 2px 6px -1px rgba(15, 23, 42, 0.03);
`;

const ActionText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  font-size: 12px;
  color: #64748b;

  & > p {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }
`;

const NewTestButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 6px;

  height: 36px;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background-color: #0f172a;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0;
  white-space: nowrap;
  color: #fcfeff;
`;
