import styled from "styled-components";

export default function PageHeading({ title, description }) {
  return (
    <HeadingContainer>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
    </HeadingContainer>
  );
}

const HeadingContainer = styled.header`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Title = styled.h1`
  margin: 0;
  color: #0f172a;
  font-family: "Pretendard", sans-serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.864px;
`;

const Description = styled.p`
  margin: 0;
  color: #64748b;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.432px;
`;