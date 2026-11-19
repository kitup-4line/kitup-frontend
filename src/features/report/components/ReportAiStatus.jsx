import styled, { keyframes } from "styled-components";

// AI 분석 섹션 자리에 보여 주는 진행·실패·생략 상태 카드
// variant: "loading" | "failed" | "empty"
export default function ReportAiStatus({
  variant,
  title,
  description,
  onRetry,
  isRetrying = false,
}) {
  return (
    <Card $variant={variant} role={variant === "failed" ? "alert" : "status"}>
      {variant === "loading" && <Spinner aria-hidden="true" />}
      <Text>
        <p>{title}</p>
        {description && <span>{description}</span>}
      </Text>
      {variant === "failed" && onRetry && (
        <RetryButton type="button" onClick={onRetry} disabled={isRetrying}>
          {isRetrying ? "다시 요청하는 중..." : "다시 시도"}
        </RetryButton>
      )}
    </Card>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 20px;
  border: 1px solid
    ${({ $variant }) => ($variant === "failed" ? "#fecdd3" : "#e2e8f0")};
  border-radius: 12px;
  background-color: ${({ $variant }) =>
    $variant === "failed" ? "#fff1f2" : "#f8fafc"};
`;

const Spinner = styled.i`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Text = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;

  font-size: 12px;
  color: #64748b;

  & > p {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
  }
`;

const RetryButton = styled.button`
  flex-shrink: 0;
  height: 32px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  background-color: #0f172a;

  font-size: 12px;
  font-weight: 500;
  color: #fcfeff;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
