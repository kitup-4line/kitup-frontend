import styled from "styled-components";
import ReportSectionTitle from "@/features/report/components/ReportSectionTitle";
import {
  formatNumber,
  formatPercent,
  toRatio,
} from "@/features/report/utils/format";
import trend_icon from "@/images/Report/trend_icon.svg";
import fixedcost_icon from "@/images/Report/fixedcost_icon.svg";
import warning_icon from "@/images/Report/warning_icon.svg";

// 1건 판매 비용 구성 (도넛 순서 = 범례 순서)
const COST_ITEMS = [
  { key: "contribution_margin", label: "공헌이익", color: "#2563eb", main: true },
  { key: "ingredient_cost", label: "식재료비", color: "#f59e0b" },
  { key: "delivery_fee", label: "배달비", color: "#f43f5e", prefix: "평균 " },
  { key: "delivery_commission", label: "중개 수수료", color: "#fb923c", prefix: "평균 " },
  { key: "packaging_cost", label: "포장 부자재", color: "#a855f7" },
];

// 매출 대비 비율로 도넛 조각을 만든다. 합이 100%를 넘지 않게 자른다.
function buildDonutGradient(structure) {
  let start = 0;
  const stops = COST_ITEMS.map(({ key, color }) => {
    const end = Math.min(start + toRatio(structure[key]?.revenue_percentage), 100);
    const stop = `${color} ${start}% ${end}%`;
    start = end;
    return stop;
  });
  stops.push(`#e2e8f0 ${start}% 100%`);
  return `conic-gradient(${stops.join(", ")})`;
}

export default function ProfitStructure({ profit, orderCount }) {
  const { summary, per_order_structure: structure } = profit;
  const isLoss = summary.estimated_operating_profit < 0;

  const miniCards = [
    {
      label: "총 매출",
      value: `${formatNumber(summary.total_revenue)}원`,
      sub: `${formatNumber(orderCount)}건 · 건당 ${formatNumber(structure.average_revenue)}원`,
      color: "#0f172a",
    },
    {
      label: "건당 공헌이익",
      value: `${formatNumber(summary.contribution_margin_per_order)}원`,
      sub: `객단가 대비 ${formatPercent(summary.contribution_margin_percentage)}`,
      color: "#2563eb",
    },
    {
      label: "추정 영업이익",
      value: `${formatNumber(summary.estimated_operating_profit)}원`,
      sub: `영업이익률 ${formatPercent(summary.operating_profit_percentage)}`,
      color: isLoss ? "#e11d48" : "#10b981",
    },
  ];

  return (
    <Section>
      <ReportSectionTitle title="수익 구조 분석" />
      <Panel>
        <LeftColumn>
          <LeftTop>
            <SubTitle>수익 및 마진 핵심 요약</SubTitle>
            <TotalCard>
              <TotalHeader>
                <p>총 공헌이익</p>
                <RateBadge>
                  <img src={trend_icon} alt="" aria-hidden="true" />
                  <span>
                    공헌이익률{" "}
                    <b>{formatPercent(summary.contribution_margin_percentage)}</b>
                  </span>
                </RateBadge>
              </TotalHeader>
              <TotalValue>
                {formatNumber(summary.total_contribution_margin)}
                <span>원</span>
              </TotalValue>
              <p>
                총 매출 {formatNumber(summary.total_revenue)}원에서
                변동비(식재료·포장·배달비·수수료)를 제외한 금액입니다.
              </p>
            </TotalCard>
            <MiniRow>
              {miniCards.map(({ label, value, sub, color }) => (
                <MiniCard key={label}>
                  <MiniLabel>{label}</MiniLabel>
                  <MiniValue $color={color}>{value}</MiniValue>
                  <p>{sub}</p>
                </MiniCard>
              ))}
            </MiniRow>
          </LeftTop>
          <FixedCost>
            <FixedCostInfo>
              <img src={fixedcost_icon} alt="" aria-hidden="true" />
              <div>
                <p>추가 고정비 (총계 반영)</p>
                <span>테스트 기간에 입력한 추가 고정비 전액</span>
              </div>
            </FixedCostInfo>
            <FixedCostValue>
              {formatNumber(summary.applied_fixed_cost)}원
            </FixedCostValue>
          </FixedCost>
        </LeftColumn>

        <RightColumn>
          <RightTop>
            <RightHeader>
              <SubTitle>
                1건 판매({formatNumber(structure.average_revenue)}원) 비용 및
                마진 구조
              </SubTitle>
              <span>단위: 원 (KRW)</span>
            </RightHeader>
            <Breakdown>
              <Donut>
                <DonutRing $gradient={buildDonutGradient(structure)} />
                <DonutLabel>
                  <p>공헌이익률</p>
                  <span>
                    {formatPercent(structure.contribution_margin?.revenue_percentage)}
                  </span>
                </DonutLabel>
              </Donut>
              <Legend>
                {COST_ITEMS.map(({ key, label, color, prefix, main }) => {
                  const item = structure[key] ?? {};
                  return (
                    <LegendItem key={key} $main={main}>
                      <p>
                        <LegendDot $color={color} />
                        {label} ({formatPercent(item.revenue_percentage)})
                      </p>
                      <span>
                        {prefix}
                        <b>{formatNumber(item.amount)}</b>원
                      </span>
                    </LegendItem>
                  );
                })}
              </Legend>
            </Breakdown>
          </RightTop>
          <Notice>
            <img src={warning_icon} alt="" aria-hidden="true" />
            <div>
              <p>제외된 항목 안내</p>
              <p>
                인건비·감가상각·세금은 미포함이며 실운영비용과 일부 차이가 있을
                수 있습니다.
              </p>
            </div>
          </Notice>
        </RightColumn>
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
  height: 400px;
  overflow: hidden;

  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow:
    0 1px 3px 0 rgba(15, 23, 42, 0.05),
    0 1px 2px -1px rgba(15, 23, 42, 0.03);
`;

const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 478px;
  padding: 24px;
`;

const LeftTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TotalCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  font-size: 12px;
  color: #64748b;
`;

const TotalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RateBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 2px 8px;
  border-radius: 4px;
  background-color: #f3fef9;
  color: #047857;

  b {
    font-weight: 600;
  }
`;

const TotalValue = styled.p`
  display: flex;
  align-items: baseline;
  gap: 4px;

  font-size: 36px;
  font-weight: 600;
  letter-spacing: -2.4px;
  color: #0f172a;

  & > span {
    font-size: 18px;
    font-weight: 400;
    color: #64748b;
  }
`;

const MiniRow = styled.div`
  display: flex;
  gap: 10px;
`;

const MiniCard = styled.div`
  width: 136px;
  height: 84px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  font-size: 12px;
  color: #94a3b8;
`;

const MiniLabel = styled.p`
  font-weight: 500;
`;

const MiniValue = styled.span`
  display: block;
  padding-top: 2px;

  font-size: 16px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const FixedCost = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: 58px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const FixedCostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;

  p {
    font-weight: 500;
  }

  span {
    color: #94a3b8;
  }
`;

const FixedCostValue = styled.p`
  font-size: 14px;
  font-weight: 600;
`;

const RightColumn = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  padding: 24px;
  border-left: 1px solid #e2e8f0;
`;

const RightTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RightHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > span {
    font-size: 12px;
    color: #64748b;
  }
`;

const Breakdown = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;

const Donut = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 112px;
  height: 112px;
`;

// 비율에 맞춰 칠한 원판에서 가운데를 뚫어 도넛 모양을 만든다.
const DonutRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: ${({ $gradient }) => $gradient};
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 14px),
    #000 calc(100% - 13px)
  );
`;

const DonutLabel = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  color: #64748b;

  & > span {
    font-weight: 600;
    color: #2563eb;
  }
`;

const Legend = styled.ul`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 18px;

  & + & {
    padding-top: 5px;
    border-top: 1px solid #e2e8f0;
  }

  & > p {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: ${({ $main }) => ($main ? 600 : 400)};
    color: ${({ $main }) => ($main ? "#0f172a" : "#64748b")};
  }

  & > span {
    color: ${({ $main }) => ($main ? "#2563eb" : "#0f172a")};
  }

  b {
    font-weight: 600;
  }
`;

const LegendDot = styled.i`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ $color }) => $color};
`;

const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  padding: 12px;
  border: 1px solid #fde68a;
  border-radius: 8px;
  background-color: #fffbeb;

  font-size: 12px;
  color: #b45309;

  & > img {
    margin-top: 2px;
  }
`;
