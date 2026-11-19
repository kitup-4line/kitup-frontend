import styled from "styled-components";
import guide_icon from "@/images/UsageGuide/guide_icon.svg";
import step01_icon from "@/images/UsageGuide/step01_icon.svg";
import step02_icon from "@/images/UsageGuide/step02_icon.svg";
import step03_icon from "@/images/UsageGuide/step03_icon.svg";
import step04_icon from "@/images/UsageGuide/step04_icon.svg";

const STEPS = [
  {
    step: "STEP 01",
    icon: step01_icon,
    title: "1. 메뉴·비용 등록",
    description:
      "재료와 수량을 직접 입력하거나 AI 추정 기능을 활용해 기준 단가를 설정합니다.",
  },
  {
    step: "STEP 02",
    icon: step02_icon,
    title: "2. 운영 데이터 확인",
    description:
      "불러온 주문·리뷰 데이터를 바탕으로 핵심 성과 지표, 판매 추이, 배달·픽업 비교 차트를 한눈에 확인합니다.",
  },
  {
    step: "STEP 03",
    icon: step03_icon,
    title: "3. 결과 리포트",
    description:
      "추가 고정비를 최종 점검한 후, 수익 구조와 고객 반응, 최우선 개선 제안이 포함된 리포트를 확인합니다.",
  },
  {
    step: "STEP 04",
    icon: step04_icon,
    title: "4. 개선 조건 비교",
    description:
      "제안받은 운영 개선안으로 조건을 수정해 신규 테스트를 진행하고, 마진과 고객 반응 변화를 재검증합니다.",
  },
];

export default function UsageGuide() {
  return (
    <Container aria-labelledby="usage-guide-title">
      <Header>
        <HeaderIconWrapper>
          <img src={guide_icon} alt="" aria-hidden="true" />
        </HeaderIconWrapper>
        <div>
          <HeaderTitle id="usage-guide-title">킷업 이용 순서</HeaderTitle>
          <HeaderDescription>
            단 4단계로 실전 조리 데이터와 원가 분석을 완성하세요
          </HeaderDescription>
        </div>
      </Header>

      <StepList>
        {STEPS.map(({ step, icon, title, description }) => (
          <StepItem key={step}>
            <StepTop>
              <StepLabel>{step}</StepLabel>
              <img src={icon} alt="" aria-hidden="true" />
            </StepTop>
            <StepBody>
              <StepTitle>{title}</StepTitle>
              <StepDescription>{description}</StepDescription>
            </StepBody>
          </StepItem>
        ))}
      </StepList>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;

  width: 100%;
  padding: 32px;
  box-sizing: border-box;

  background-color: #fcfeff;
  border-radius: 16px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));

  font-family: "Pretendard", sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
`;

const HeaderIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 12px;
`;

const HeaderTitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #0f172a;
`;

const HeaderDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #64748b;
`;

const StepList = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StepItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
`;

const StepTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > img {
    flex-shrink: 0;
  }
`;

const StepLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #0f172a;
`;

const StepBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StepTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #0f172a;
`;

const StepDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  color: #64748b;
  word-break: keep-all;
`;
