import styled from "styled-components";
import pin_icon from "@/images/Report/pin_icon.svg";
import bulb_icon from "@/images/Report/bulb_icon.svg";
import play_icon from "@/images/Report/play_icon.svg";
import caution_icon from "@/images/Report/caution_icon.svg";

const INSIGHT_ITEMS = [
  { key: "result", icon: pin_icon, title: "[결과] 집중 시간대" },
  { key: "meaning", icon: bulb_icon, title: "[의미] 매출 기여도" },
  { key: "recommended_action", icon: play_icon, title: "[권장 행동] 운영 최적화" },
  { key: "limitation", icon: caution_icon, title: "[한계] 모델 가정" },
];

export default function InsightCards({ insights }) {
  // recommended_action은 null일 수 있어 내용이 있는 카드만 보여 준다.
  const items = INSIGHT_ITEMS.filter(({ key }) => insights?.[key]);

  return (
    <List>
      {items.map(({ key, icon, title }) => (
        <Item key={key}>
          <ItemTitle>
            <img src={icon} alt="" aria-hidden="true" />
            {title}
          </ItemTitle>
          <ItemDescription>{insights[key]}</ItemDescription>
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  justify-content: center;
  gap: 12px;

  font-size: 12px;
  line-height: 1.4;
  letter-spacing: -0.288px;
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 220px;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fcfeff;
`;

const ItemTitle = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 18px;

  font-weight: 500;
  color: #0f172a;
`;

const ItemDescription = styled.p`
  color: #64748b;
`;
