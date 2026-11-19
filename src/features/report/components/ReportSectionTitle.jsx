import styled from "styled-components";

export default function ReportSectionTitle({ title }) {
  return <Title>{title}</Title>;
}

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.336px;
  color: #0f172a;

  &::before {
    content: "";
    width: 6px;
    height: 14px;
    border-radius: 2px;
    background-color: #2563eb;
  }
`;
