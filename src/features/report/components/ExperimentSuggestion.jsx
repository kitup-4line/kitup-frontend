import styled from "styled-components";
import ReportSectionTitle from "@/features/report/components/ReportSectionTitle";
import ReportAiStatus from "@/features/report/components/ReportAiStatus";
import checklist_icon from "@/images/Report/checklist_icon.svg";

export default function ExperimentSuggestion({
  reviewStatus,
  improvementStatus,
  improvements,
  quoteById,
  onRetry,
  isRetrying,
}) {
  return (
    <Section>
      <ReportSectionTitle title="개선 제안 보고서" />
      {improvementStatus === "SUCCEEDED" && improvements ? (
        <SuggestionList improvements={improvements} quoteById={quoteById} />
      ) : (
        <SuggestionStatus
          reviewStatus={reviewStatus}
          improvementStatus={improvementStatus}
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      )}
    </Section>
  );
}

function SuggestionStatus({ reviewStatus, improvementStatus, onRetry, isRetrying }) {
  if (reviewStatus === "FAILED" || improvementStatus === "FAILED") {
    return (
      <ReportAiStatus
        variant="failed"
        title={
          reviewStatus === "FAILED"
            ? "리뷰 분석이 실패해 개선안을 만들지 못했어요"
            : "개선안 생성에 실패했어요"
        }
        description="다시 시도하면 실패한 단계부터 이어서 진행해요."
        onRetry={onRetry}
        isRetrying={isRetrying}
      />
    );
  }

  const isWaitingReview = ["PENDING", "RUNNING"].includes(reviewStatus);

  return (
    <ReportAiStatus
      variant="loading"
      title={
        isWaitingReview
          ? "리뷰 분석이 끝나면 개선안을 만들어요"
          : "AI가 개선안을 만들고 있어요"
      }
      description="완료되면 이 영역에 자동으로 결과가 표시돼요."
    />
  );
}

// 실행 방안은 "- A\n- B\n- C"처럼 줄바꿈으로 구분된 한 문자열로 온다.
// 줄 단위로 나누고 각 줄 앞의 "- "를 떼어 목록 항목으로 쓴다.
function splitPlanItems(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((item) => item.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function SuggestionList({ improvements, quoteById }) {
  if (improvements.length === 0) {
    return <ReportAiStatus variant="empty" title="제안할 개선안이 없어요" />;
  }

  return (
    <CardList>
      {improvements.map(({ title, action, verification, evidence_review_ids }, i) => {
        // 근거 리뷰 번호 중 리뷰 분석 결과에 인용문이 있는 것만 보여 준다.
        const quotes = evidence_review_ids
          .map((id) => quoteById.get(id))
          .filter(Boolean);

        return (
          <Card key={i}>
            <CardHeader>
              <NumberBadge>{String(i + 1).padStart(2, "0")}</NumberBadge>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            {quotes.length > 0 && (
              <Quote>
                {quotes.map((quote) => (
                  <p key={quote}>“{quote}”</p>
                ))}
              </Quote>
            )}
            <PlanList>
              {splitPlanItems(action).map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </PlanList>
            <CheckPoint>
              <img src={checklist_icon} alt="" aria-hidden="true" />
              <p>확인 포인트: {verification}</p>
            </CheckPoint>
          </Card>
        );
      })}
    </CardList>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;

  line-height: 1.4;
  letter-spacing: -0.024em;
  color: #0f172a;
`;

const CardList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: 14px;

  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow:
    0 1px 3px 0 rgba(15, 23, 42, 0.05),
    0 1px 2px -1px rgba(15, 23, 42, 0.03);

  font-size: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  height: 40px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

const NumberBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;
  border-radius: 8px;
  background-color: #0f172a;

  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0;
  color: #fcfeff;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
`;

const Quote = styled.div`
  padding: 14px 14px 14px 18px;
  border-left: 4px solid #fde68a;
  border-radius: 0 8px 8px 0;
  background-color: #f8fafc;
  color: #64748b;
`;

const PlanList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;

  font-weight: 500;

  li {
    position: relative;
    padding-left: 12px;
  }

  li::before {
    content: "";
    position: absolute;
    top: 0.6em;
    left: 2px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #64748b;
  }
`;

const CheckPoint = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  padding: 13px 12px 12px;
  border: 1px solid #fde68a;
  border-radius: 8px;
  background-color: #fffbeb;

  font-weight: 500;
  color: #b45309;

  & > img {
    margin-top: 2px;
  }
`;
