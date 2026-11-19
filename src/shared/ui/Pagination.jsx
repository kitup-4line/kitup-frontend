import styled, { css } from "styled-components";
import { getPageItems } from "@/shared/utils/pagination";

const ACTIVE_COLOR = "#0f172a";

export default function Pagination({ page, totalPages, onChange }) {
  const items = getPageItems(page, totalPages);
  // 1페이지뿐이면 현재 페이지를 강조하지 않음 (디자인 기준)
  const highlightCurrent = totalPages > 1;

  return (
    <Nav aria-label="페이지 이동">
      <TextButton
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </TextButton>

      {items.map((item) =>
        typeof item === "number" ? (
          <PageButton
            key={item}
            type="button"
            $active={highlightCurrent && item === page}
            aria-current={item === page ? "page" : undefined}
            aria-label={`${item}페이지`}
            onClick={() => item !== page && onChange(item)}
          >
            {item}
          </PageButton>
        ) : (
          <Ellipsis key={item} aria-hidden="true">
            …
          </Ellipsis>
        ),
      )}

      <TextButton
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        다음
      </TextButton>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const buttonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  box-sizing: border-box;

  border: 1px solid #64748b;
  border-radius: 8px;
  background-color: #fcfeff;
  color: #0f172a;

  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.336px;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const TextButton = styled.button`
  ${buttonBase}
  padding: 10px 20px;

  &:hover:not(:disabled) {
    background-color: #f1f5f9;
  }

  &:disabled {
    color: #64748b;
    cursor: default;
  }
`;

const PageButton = styled.button`
  ${buttonBase}
  width: 42px;
  padding: 10px 14px;

  ${({ $active }) =>
    $active
      ? css`
          border-color: ${ACTIVE_COLOR};
          background-color: ${ACTIVE_COLOR};
          color: #fcfeff;
          cursor: default;
        `
      : css`
          &:hover {
            background-color: #f1f5f9;
          }
        `}
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;

  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;
