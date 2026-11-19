import { useEffect } from "react";
import styled from "styled-components";

// 공용 확인 모달
export default function ConfirmModal({
  isOpen,
  title,
  description,
  cancelLabel = "취소",
  confirmLabel = "확인",
  pendingLabel,
  isPending = false,
  error,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isPending) onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={() => !isPending && onCancel()}>
      <Box
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={description ? "confirm-modal-description" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <p id="confirm-modal-title">{title}</p>
        {description && (
          <span id="confirm-modal-description">{description}</span>
        )}
        {error && <ErrorText role="alert">{error}</ErrorText>}
        <Buttons>
          <CancelButton type="button" onClick={onCancel} disabled={isPending}>
            {cancelLabel}
          </CancelButton>
          <ConfirmButton
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            autoFocus
          >
            {isPending && pendingLabel ? pendingLabel : confirmLabel}
          </ConfirmButton>
        </Buttons>
      </Box>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(15, 23, 42, 0.86);
`;

const Box = styled.div`
  width: 420px;
  min-height: 150px;
  padding: 20px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fcfeff;
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.15);

  font-size: 16px;
  font-weight: 600;
  line-height: 140%;
  color: #0f172a;

  span {
    display: block;
    margin-top: 16px;

    font-size: 12px;
    font-weight: 400;
    white-space: pre-line;
  }
`;

const ErrorText = styled.p`
  margin-top: 12px;

  font-size: 12px;
  font-weight: 500;
  white-space: pre-line;
  color: #e11d48;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
`;

const BaseButton = styled.button`
  min-width: 60px;
  height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

const CancelButton = styled(BaseButton)`
  border: solid 1px #0f172a;
`;

const ConfirmButton = styled(BaseButton)`
  background-color: #ffe4e6;
  color: #e11d48;
`;
