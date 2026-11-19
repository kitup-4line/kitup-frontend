import { useEffect } from "react";
import styled from "styled-components";
import { useEvidenceReviews } from "@/features/report/api/useEvidenceReviews";
import { ASPECT_LABEL, formatDateTime } from "@/features/report/utils/format";
import close_icon from "@/images/TestList/clear_icon.svg";

const SENTIMENT_LABEL = { POSITIVE: "긍정", NEGATIVE: "부정" };

// target: { aspect, sentiment } — null이면 닫힌 상태
export default function EvidenceReviewModal({ testId, target, onClose }) {
  const { data: reviews, isPending, isError, error } = useEvidenceReviews(
    testId,
    target,
  );

  useEffect(() => {
    if (!target) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [target, onClose]);

  if (!target) return null;

  const title = `${ASPECT_LABEL[target.aspect] ?? target.aspect} · ${SENTIMENT_LABEL[target.sentiment] ?? target.sentiment} 리뷰`;

  return (
    <Overlay onClick={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-review-title"
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <div>
            <h2 id="evidence-review-title">{title}</h2>
            {reviews && <span>총 {reviews.length}건 · 최신순</span>}
          </div>
          <CloseButton type="button" onClick={onClose} aria-label="닫기">
            <img src={close_icon} alt="" aria-hidden="true" />
          </CloseButton>
        </Header>

        <Body>
          {isPending && <Message>리뷰를 불러오는 중이에요.</Message>}
          {isError && (
            <Message role="alert">
              {error.message || "리뷰를 불러오지 못했어요."}
            </Message>
          )}
          {reviews?.length === 0 && <Message>조건에 맞는 리뷰가 없어요.</Message>}
          {reviews?.length > 0 && (
            <ReviewList>
              {reviews.map(({ review_id, content, written_at }) => (
                <li key={review_id}>
                  <p>{content}</p>
                  {written_at && <time dateTime={written_at}>{formatDateTime(written_at)}</time>}
                </li>
              ))}
            </ReviewList>
          )}
        </Body>
      </Dialog>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(15, 23, 42, 0.4);
`;

const Dialog = styled.div`
  display: flex;
  flex-direction: column;

  width: 520px;
  max-height: 70dvh;
  border-radius: 12px;
  background-color: #fcfeff;
  box-shadow: 0 20px 40px -8px rgba(15, 23, 42, 0.25);

  line-height: 1.4;
  letter-spacing: -0.024em;
  color: #0f172a;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  padding: 20px 20px 14px;
  border-bottom: 1px solid #e2e8f0;

  h2 {
    font-size: 16px;
    font-weight: 600;
  }

  span {
    font-size: 12px;
    color: #64748b;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: -6px -6px 0 0;
  padding: 0;

  border: none;
  border-radius: 6px;
  background: none;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }

  &:focus-visible {
    outline: 2px solid #94a3b8;
    outline-offset: 1px;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const Body = styled.div`
  padding: 16px 20px 20px;
  overflow-y: auto;
`;

const Message = styled.p`
  padding: 24px 0;
  font-size: 13px;
  text-align: center;
  color: #64748b;
`;

const ReviewList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > li {
    display: flex;
    flex-direction: column;
    gap: 6px;

    padding: 12px 14px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: #f8fafc;

    font-size: 13px;
  }

  time {
    font-size: 11px;
    color: #94a3b8;
  }
`;
