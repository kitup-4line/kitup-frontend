import styled from "styled-components";
import ReportSectionTitle from "@/features/report/components/ReportSectionTitle";
import InsightCards from "@/features/report/components/InsightCards";
import { formatNumber, formatPercent } from "@/features/report/utils/format";

const PEAK_COLORS = ["#2563eb", "#6366f1"];
const OTHER_COLOR = "#94a3b8";
const MAX_BAR_HEIGHT = 80;
const MIN_BAR_HEIGHT = 4;

// API의 시간대 구간을 차트·표에서 쓰는 형태로 바꾼다.
// 주문이 많은 2시간 구간(최대 2개)과 나머지를 묶은 "기타"로 내려온다.
function toTimeSlots(buckets) {
  const maxPercentage = Math.max(
    ...buckets.map(({ order_percentage }) => order_percentage ?? 0),
    0,
  );
  let peakIndex = 0;

  return buckets.map((bucket) => {
    const muted = bucket.key === "other";
    const color = muted ? OTHER_COLOR : PEAK_COLORS[peakIndex++ % PEAK_COLORS.length];
    const ratio = maxPercentage > 0 ? (bucket.order_percentage ?? 0) / maxPercentage : 0;

    return {
      key: bucket.key,
      label: bucket.label,
      caption: muted ? "그 외 시간" : "주문 집중",
      count: `${formatNumber(bucket.order_count)}건`,
      share: formatPercent(bucket.order_percentage),
      sales: `${formatNumber(bucket.revenue)}원`,
      barHeight: Math.max(Math.round(ratio * MAX_BAR_HEIGHT), MIN_BAR_HEIGHT),
      color,
      muted,
    };
  });
}

export default function SalesPattern({ salesPattern }) {
  const { time_buckets, peak_summary: peak, insights } = salesPattern;
  const slots = toTimeSlots(time_buckets);

  return (
    <Section>
      <ReportSectionTitle title="판매 패턴 분석" />
      <Panel>
        <TopRow>
          <Chart>
            <ChartTitle>시간대별 주문 점유율</ChartTitle>
            <Bars>
              {slots.map(({ key, share, count, barHeight, color, muted }) => (
                <BarColumn key={key}>
                  <BarShare $color={muted ? "#64748b" : color}>{share}</BarShare>
                  <span>{count}</span>
                  <Bar $height={barHeight} $color={color} />
                </BarColumn>
              ))}
            </Bars>
            <BarLabels>
              {slots.map(({ key, label, caption }) => (
                <div key={key}>
                  <p>{label}</p>
                  <span>{caption}</span>
                </div>
              ))}
            </BarLabels>
          </Chart>

          <Side>
            <Table>
              <thead>
                <tr>
                  <th>시간대 분류</th>
                  <th>주문 건수</th>
                  <th>점유율</th>
                  <th>매출</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(({ key, label, count, share, sales, color, muted }) => (
                  <tr key={key}>
                    <td>
                      <SlotName $muted={muted}>
                        <Dot $color={color} />
                        {label}
                      </SlotName>
                    </td>
                    <td>{count}</td>
                    <ShareCell $color={muted ? "#0f172a" : color}>{share}</ShareCell>
                    <td>{sales}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Total>
              <p>주문 집중 구간 {formatNumber(peak.peak_order_count)}건 매출 합계</p>
              <span>
                총 <b>{formatNumber(peak.peak_revenue)}</b>원 (전체 매출의{" "}
                {formatPercent(peak.peak_revenue_percentage)})
              </span>
            </Total>
          </Side>
        </TopRow>
        <InsightCards insights={insights} />
      </Panel>
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

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  min-height: 398px;
  padding: 24px;

  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow:
    0 1px 3px 0 rgba(15, 23, 42, 0.05),
    0 1px 2px -1px rgba(15, 23, 42, 0.03);
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 250px;
`;

const Chart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  width: 448px;
  padding: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  background-color: #f8fafc;

  font-size: 12px;
`;

const ChartTitle = styled.p`
  display: flex;
  align-items: center;
  height: 24px;
  font-weight: 500;
`;

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 30px;

  height: 144px;
  padding: 16px 16px 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 80px;

  & > span {
    color: #94a3b8;
  }
`;

const BarShare = styled.b`
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const Bar = styled.i`
  width: 48px;
  height: ${({ $height }) => $height}px;
  border-radius: 8px 8px 0 0;
  background-color: ${({ $color }) => $color};
`;

const BarLabels = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 0 16px;
  text-align: center;

  & > div {
    width: 80px;
  }

  p {
    font-weight: 500;
  }

  span {
    color: #94a3b8;
  }
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 445px;
`;

const Table = styled.table`
  width: 100%;
  height: 154px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fcfeff;

  font-size: 12px;
  font-weight: 500;
  text-align: center;

  th {
    padding: 10px;
    font-weight: 500;
    color: #64748b;
  }

  td {
    padding: 10px;
  }

  td:first-child {
    padding: 10px 12px;
  }

  th:last-child,
  td:last-child {
    width: 113px;
  }
`;

const SlotName = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  color: ${({ $muted }) => ($muted ? "#64748b" : "#0f172a")};
`;

const Dot = styled.i`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};
`;

const ShareCell = styled.td`
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;

  font-size: 12px;
  font-weight: 500;
  color: #64748b;

  & > span {
    color: #2563eb;
  }

  b {
    font-weight: 600;
  }
`;
