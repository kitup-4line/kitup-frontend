import styled, { css, keyframes } from "styled-components";
import { STATUS_META, TEST_STATUS } from "@/domain/testStatus";
import check_circle_icon from "@/images/TestList/check_circle_icon.svg";

const BADGE_STYLE = {
  [TEST_STATUS.RUNNING]: {
    background: "#f3fef9",
    border: "#10b981",
    color: "#047857",
    dot: "#10b981",
    weight: 600,
  },
  [TEST_STATUS.DRAFT]: {
    background: "#fffbeb",
    border: "#fde68a",
    color: "#f59e0b",
    dot: "#f59e0b",
    weight: 500,
  },
  [TEST_STATUS.COMPLETED]: {
    background: "#f1f5f9",
    border: "#e2e8f0",
    color: "#0f172a",
    weight: 500,
  },
};

export default function StatusBadge({ status }) {
  const style = BADGE_STYLE[status];
  const { badgeLabel } = STATUS_META[status];

  return (
    <Badge $style={style}>
      {status === TEST_STATUS.COMPLETED ? (
        <img src={check_circle_icon} alt="" aria-hidden="true" />
      ) : (
        <Dot $color={style.dot} $pulse={status === TEST_STATUS.RUNNING} />
      )}
      {badgeLabel}
    </Badge>
  );
}

const ping = keyframes`
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;

  border: 1px solid ${({ $style }) => $style.border};
  border-radius: 9999px;
  background-color: ${({ $style }) => $style.background};
  color: ${({ $style }) => $style.color};

  font-family: "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: ${({ $style }) => $style.weight};
  line-height: 1.4;
  letter-spacing: -0.288px;
  white-space: nowrap;

  & > img {
    flex-shrink: 0;
  }
`;

const Dot = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: ${({ $color }) => $color};

  ${({ $pulse, $color }) =>
    $pulse &&
    css`
      &::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background-color: ${$color};
        opacity: 0.75;
        animation: ${ping} 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        &::before {
          animation: none;
        }
      }
    `}
`;
