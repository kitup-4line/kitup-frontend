import styled, { css } from "styled-components";
import add_icon from "@/images/TestList/add_circle_white_icon.svg";
import trash_icon from "@/images/TestList/trash_icon.svg";
import close_icon from "@/images/TestList/close_icon.svg";

// 내 테스트 상단 버튼 영역
// - 기본: [삭제하기] [새 테스트 만들기]
// - 삭제 모드: [취소] [삭제 (N)] [새 테스트 만들기]
export default function TestListActions({
  isSelecting,
  selectedCount,
  isDeleting,
  canDelete = true,
  onStartSelect,
  onCancelSelect,
  onDelete,
  onCreate,
}) {
  return (
    <Actions>
      {isSelecting ? (
        <>
          <ActionButton
            type="button"
            $variant="cancel"
            onClick={onCancelSelect}
            disabled={isDeleting}
          >
            <IconBox $size={10}>
              <img src={close_icon} alt="" aria-hidden="true" />
            </IconBox>
            취소
          </ActionButton>
          <ActionButton
            type="button"
            $variant="danger"
            onClick={onDelete}
            disabled={selectedCount === 0 || isDeleting}
          >
            <IconBox>
              <img src={trash_icon} alt="" aria-hidden="true" />
            </IconBox>
            {isDeleting ? "삭제 중..." : `삭제 (${selectedCount})`}
          </ActionButton>
        </>
      ) : (
        <ActionButton
          type="button"
          $variant="danger"
          $minWidth={140}
          onClick={onStartSelect}
          disabled={!canDelete}
          title={
            canDelete ? undefined : "삭제할 수 있는 작성 중 테스트가 없습니다."
          }
        >
          <IconBox>
            <img src={trash_icon} alt="" aria-hidden="true" />
          </IconBox>
          삭제하기
        </ActionButton>
      )}

      <ActionButton type="button" $variant="primary" onClick={onCreate}>
        <IconBox>
          <img src={add_icon} alt="" aria-hidden="true" />
        </IconBox>
        새 테스트 만들기
      </ActionButton>
    </Actions>
  );
}

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding-right: 36px;
`;

const VARIANT_STYLE = {
  primary: css`
    border-color: #0f172a;
    background-color: #0f172a;
    color: #fcfeff;
    &:hover:not(:disabled) {
      background-color: #1e293b;
    }
  `,
  danger: css`
    border-color: #f43f5e;
    background-color: #ffe4e6;
    color: #e11d48;
    &:hover:not(:disabled) {
      background-color: #fecdd3;
    }
  `,
  cancel: css`
    border-color: #e2e8f0;
    background-color: #f1f5f9;
    color: #0f172a;
    &:hover:not(:disabled) {
      background-color: #e2e8f0;
    }
  `,
};

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-width: ${({ $minWidth }) => ($minWidth ? `${$minWidth}px` : "auto")};
  padding: 14px 28px;
  box-sizing: border-box;

  border: 1px solid transparent;
  border-radius: 8px;
  filter: drop-shadow(0 4px 2px rgba(134, 112, 255, 0.08));

  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.336px;
  white-space: nowrap;
  cursor: pointer;

  ${({ $variant }) => VARIANT_STYLE[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const IconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size = 16 }) => $size}px;
  height: ${({ $size = 16 }) => $size}px;

  & > img {
    max-width: none;
  }
`;
