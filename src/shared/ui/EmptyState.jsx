import styled from "styled-components";

// 462px 박스 가운데에 아이콘 · 제목 · 설명 · (선택) 액션을 세로로 배치
export default function EmptyState({ icon, title, description, action }) {
  return (
    <Container>
      <Content>
        {icon && <IconSlot>{icon}</IconSlot>}
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {action && <ActionSlot>{action}</ActionSlot>}
      </Content>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 462px;
  padding: 10px;
  box-sizing: border-box;

  background-color: #fcfeff;
  border-radius: 8px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  width: 100%;
  max-width: 480px;
`;

const IconSlot = styled.div`
  margin-bottom: 12px;
`;

const Title = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #0f172a;
`;

const Description = styled.p`
  margin-top: 10px;

  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #64748b;
`;

const ActionSlot = styled.div`
  margin-top: 32px;
`;
