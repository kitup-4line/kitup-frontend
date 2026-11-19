import styled from "styled-components";
import ReportSectionTitle from "@/features/report/components/ReportSectionTitle";
import {
  formatDate,
  formatNumber,
  formatPercent,
  toRatio,
} from "@/features/report/utils/format";
import calendar_icon from "@/images/Report/calendar_icon.svg";
import data_icon from "@/images/Report/data_icon.svg";
import tag_icon from "@/images/Report/tag_icon.svg";

const findChannel = (channels, type) =>
  channels?.find(({ order_type }) => order_type === type) ?? {
    order_count: 0,
    order_percentage: null,
  };

export default function ConditionSummary({ conditions }) {
  const {
    operating_period: period,
    kitchen_name,
    analysis_data: analysis,
    sales_conditions: sales,
  } = conditions;

  const delivery = findChannel(analysis.channels, "DELIVERY");
  const pickup = findChannel(analysis.channels, "PICKUP");
  const dailyHours =
    period.operating_days > 0
      ? sales.total_operating_hours / period.operating_days
      : null;

  return (
    <Section>
      <ReportSectionTitle title="분석 조건 요약" />
      <CardRow>
        <Card>
          <CardHeader>
            <p>운영 기간 · 장소</p>
            <img src={calendar_icon} alt="" aria-hidden="true" />
          </CardHeader>
          <CardBody>
            <BigRow>
              <BigValue>
                {formatNumber(period.operating_days)}
                <Unit>일</Unit>
              </BigValue>
              <Badge>누적 분석 기간</Badge>
            </BigRow>
            <InfoList>
              <div>
                <dt>운영 기간</dt>
                <dd>
                  {formatDate(period.start_date)} ~{" "}
                  {formatDate(period.end_date)}
                </dd>
              </div>
              <div>
                <dt>공유주방</dt>
                <dd>{kitchen_name}</dd>
              </div>
            </InfoList>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <p>분석 데이터</p>
            <img src={data_icon} alt="" aria-hidden="true" />
          </CardHeader>
          <StatRow>
            <StatBox>
              <p>완료 주문</p>
              <StatValue>
                {formatNumber(analysis.completed_order_count)}
                <Unit>건</Unit>
              </StatValue>
            </StatBox>
            <StatBox>
              <p>연결 리뷰</p>
              <StatValue $highlight>
                {formatNumber(analysis.linked_review_count)}
                <Unit>건</Unit>
              </StatValue>
            </StatBox>
          </StatRow>
          <Gauge>
            <GaugeLegend>
              <p>
                <Dot $color="#2563eb" />
                배달 {formatNumber(delivery.order_count)}건 (
                {formatPercent(delivery.order_percentage, 0)})
              </p>
              <p>
                <Dot $color="#94a3b8" />
                픽업 {formatNumber(pickup.order_count)}건 (
                {formatPercent(pickup.order_percentage, 0)})
              </p>
            </GaugeLegend>
            <GaugeBar>
              <GaugeFill $ratio={toRatio(delivery.order_percentage)} />
            </GaugeBar>
          </Gauge>
        </Card>

        <Card $fill>
          <CardHeader>
            <p>판매 조건</p>
            <img src={tag_icon} alt="" aria-hidden="true" />
          </CardHeader>
          <PriceBlock>
            <p>기준 대표 메뉴 판매가</p>
            <BigValue>
              {formatNumber(sales.selling_price)}
              <Unit>원</Unit>
            </BigValue>
          </PriceBlock>
          <InfoList>
            <div>
              <dt>총 가동 시간</dt>
              <dd>
                {formatNumber(sales.total_operating_hours, 1)}시간
                {dailyHours != null && ` (일 ${formatNumber(dailyHours, 1)}시간)`}
              </dd>
            </div>
            <div>
              <dt>시간당 평균 주문</dt>
              <dd>{formatNumber(sales.orders_per_hour, 2)}건 / hr</dd>
            </div>
          </InfoList>
        </Card>
      </CardRow>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;

  line-height: 1.4;
  letter-spacing: -0.024em;
  color: #0f172a;
`;

const CardRow = styled.div`
  display: flex;
  gap: 16px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  width: ${({ $fill }) => ($fill ? "auto" : "310px")};
  flex: ${({ $fill }) => ($fill ? 1 : "none")};
  height: 210px;
  padding: 20px;

  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow:
    0 1px 3px 0 rgba(15, 23, 42, 0.05),
    0 1px 2px -1px rgba(15, 23, 42, 0.03);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 40px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;

  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BigRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BigValue = styled.p`
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -2.4px;
  color: #0f172a;
`;

const Unit = styled.span`
  margin-left: 4px;

  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.288px;
  color: #64748b;
`;

const Badge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  background-color: #f1f5f9;

  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;

const InfoList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  dt {
    font-weight: 500;
    color: #64748b;
  }

  dd {
    font-weight: 600;
    color: #0f172a;
  }
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StatBox = styled.div`
  width: 128px;
  height: 71px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8fafc;

  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;

const StatValue = styled.span`
  display: block;

  font-size: 24px;
  font-weight: 600;
  color: ${({ $highlight }) => ($highlight ? "#2563eb" : "#0f172a")};

  & > span {
    margin-left: 6px;
  }
`;

const Gauge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GaugeLegend = styled.div`
  display: flex;
  justify-content: space-between;

  font-size: 12px;
  color: #64748b;

  & > p {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const Dot = styled.i`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};
`;

const GaugeBar = styled.div`
  height: 8px;
  border-radius: 9999px;
  background-color: #f1f5f9;
  overflow: hidden;
`;

const GaugeFill = styled.div`
  width: ${({ $ratio }) => $ratio}%;
  height: 100%;
  background-color: #2563eb;
`;

const PriceBlock = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
`;
