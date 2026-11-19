import styled from "styled-components";
import ReportSectionTitle from "@/features/report/components/ReportSectionTitle";
import ReportAiStatus from "@/features/report/components/ReportAiStatus";
import {
  ASPECT_LABEL,
  formatNumber,
  formatPercent,
  toRatio,
} from "@/features/report/utils/format";
import thumb_icon from "@/images/Report/thumb_icon.svg";
import arrow_icon from "@/images/Report/arrow_icon.svg";

const TONE = {
  positive: { dot: "#10b981", text: "#047857", bar: "#10b981" },
  negative: { dot: "#f43f5e", text: "#e11d48", bar: "#e11d48" },
};

const findSentiment = (sentiments, type) =>
  sentiments?.find(({ sentiment }) => sentiment === type) ?? {
    count: 0,
    review_percentage: null,
  };

export default function CustomerReaction({
  status,
  analysis,
  onRetry,
  isRetrying,
  onOpenEvidence,
}) {
  return (
    <Section>
      <ReportSectionTitle title="고객 반응 분석 (VOC)" />
      {status === "SUCCEEDED" && analysis ? (
        <ReactionContent analysis={analysis} onOpenEvidence={onOpenEvidence} />
      ) : (
        <ReactionStatus
          status={status}
          onRetry={onRetry}
          isRetrying={isRetrying}
        />
      )}
    </Section>
  );
}

function ReactionStatus({ status, onRetry, isRetrying }) {
  if (status === "FAILED") {
    return (
      <ReportAiStatus
        variant="failed"
        title="리뷰 분석에 실패했어요"
        description="다시 시도하면 실패한 단계부터 분석을 이어서 진행해요."
        onRetry={onRetry}
        isRetrying={isRetrying}
      />
    );
  }

  if (status === "NOT_REQUIRED") {
    return (
      <ReportAiStatus
        variant="empty"
        title="연결된 리뷰가 없어 고객 반응 분석을 생략했어요"
      />
    );
  }

  return (
    <ReportAiStatus
      variant="loading"
      title="AI가 고객 리뷰를 분석하고 있어요"
      description="분석이 끝나면 이 영역에 자동으로 결과가 표시돼요."
    />
  );
}

function ReactionContent({ analysis, onOpenEvidence }) {
  const positive = findSentiment(analysis.sentiments, "POSITIVE");
  const negative = findSentiment(analysis.sentiments, "IMPROVEMENT_REQUIRED");

  const groups = [
    { title: "유지할 강점", tone: "positive", items: analysis.strengths },
    {
      title: "개선 후보",
      tone: "negative",
      items: analysis.improvement_candidates,
    },
  ];

  return (
    <>
      <Banner>
        <BannerInfo>
          <img src={thumb_icon} alt="" aria-hidden="true" />
          <div>
            <p>VOC 종합 만족도 지수</p>
            <span>
              리뷰 {formatNumber(analysis.review_count)}건 중{" "}
              {formatNumber(positive.count)}건에서 명확한 긍정 평가 확인
            </span>
          </div>
        </BannerInfo>
        <Gauge>
          <GaugeLegend>
            <GaugeLabel $color={TONE.positive.text}>
              긍정 {formatPercent(positive.review_percentage)} (
              {formatNumber(positive.count)}건)
            </GaugeLabel>
            <GaugeLabel $color={TONE.negative.text}>
              개선요구 {formatPercent(negative.review_percentage)} (
              {formatNumber(negative.count)}건)
            </GaugeLabel>
          </GaugeLegend>
          <GaugeBar>
            <GaugeFill $ratio={toRatio(positive.review_percentage)} />
          </GaugeBar>
        </Gauge>
      </Banner>

      <Columns>
        {groups.map(({ title, tone, items }) => (
          <Column key={title}>
            <ColumnTitle $color={TONE[tone].dot}>{title}</ColumnTitle>
            {items.length === 0 && <EmptyText>해당하는 항목이 없어요.</EmptyText>}
            {items.map(
              ({ aspect, sentiment, review_count, review_percentage, quotes }) => (
                <Item key={aspect}>
                  <ItemHeader $color={TONE[tone].text}>
                    <p>{ASPECT_LABEL[aspect] ?? aspect}</p>
                    <span>
                      언급 {formatPercent(review_percentage, 0)} ·{" "}
                      {formatNumber(review_count)}건
                    </span>
                  </ItemHeader>
                  <ItemBar>
                    <ItemFill
                      $ratio={toRatio(review_percentage)}
                      $color={TONE[tone].bar}
                    />
                  </ItemBar>
                  {quotes.length > 0 && (
                    <Keywords>
                      {quotes.map(({ review_id, quote }) => (
                        <li key={review_id}>“{quote}”</li>
                      ))}
                    </Keywords>
                  )}
                  <EvidenceButton
                    type="button"
                    onClick={() => onOpenEvidence?.({ aspect, sentiment })}
                  >
                    근거 리뷰 {formatNumber(review_count)}개 보기
                    <img src={arrow_icon} alt="" aria-hidden="true" />
                  </EvidenceButton>
                </Item>
              ),
            )}
          </Column>
        ))}
      </Columns>
    </>
  );
}

const EmptyText = styled.p`
  font-size: 12px;
  color: #94a3b8;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  line-height: 1.4;
  letter-spacing: -0.024em;
  color: #0f172a;
`;

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow:
    0 1px 3px 0 rgba(15, 23, 42, 0.05),
    0 1px 2px -1px rgba(15, 23, 42, 0.03);
`;

const BannerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  font-weight: 500;
  letter-spacing: 0;

  p {
    font-size: 12px;
    line-height: 16px;
  }

  span {
    font-size: 11px;
    line-height: 16.5px;
    color: #64748b;
  }
`;

const Gauge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 288px;
`;

const GaugeLegend = styled.div`
  display: flex;
  justify-content: space-between;
`;

const GaugeLabel = styled.p`
  font-size: 11px;
  font-weight: 700;
  line-height: 16.5px;
  letter-spacing: 0;
  color: ${({ $color }) => $color};
`;

const GaugeBar = styled.div`
  height: 10px;
  border-radius: 9999px;
  background-color: #ffe4e6;
  overflow: hidden;
`;

const GaugeFill = styled.div`
  width: ${({ $ratio }) => $ratio}%;
  height: 100%;
  border-radius: 9999px;
  background-color: #10b981;
`;

const Columns = styled.div`
  display: flex;
  gap: 20px;
`;

const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;

  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow:
    0 1px 3px 0 rgba(15, 23, 42, 0.05),
    0 1px 2px -1px rgba(15, 23, 42, 0.03);
`;

const ColumnTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;

  height: 36px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;

  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0;

  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 9999px;
    background-color: ${({ $color }) => $color};
  }
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  padding: 16px 16px 19px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #f8fafc;

  font-size: 12px;
`;

const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-weight: 500;

  & > span {
    color: ${({ $color }) => $color};
  }
`;

const ItemBar = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 9999px;
  background-color: #e2e8f0;
  overflow: hidden;
`;

const ItemFill = styled.div`
  width: ${({ $ratio }) => $ratio}%;
  height: 100%;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};
`;

const Keywords = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  & > li {
    padding: 4px 8px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background-color: #fcfeff;
    color: #64748b;
  }
`;

const EvidenceButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  padding-top: 4px;
  border: none;

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #64748b;
`;
