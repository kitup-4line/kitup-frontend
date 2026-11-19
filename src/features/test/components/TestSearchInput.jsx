import { useRef } from "react";
import styled from "styled-components";
import search_icon from "@/images/CommonComponents/search_icon.svg";
import clear_icon from "@/images/TestList/clear_icon.svg";

export default function TestSearchInput({ value = "", onChange }) {
  const inputRef = useRef(null);
  const hasValue = value.length > 0;

  const handleClear = () => {
    onChange?.("");
    inputRef.current?.focus();
  };

  return (
    <SearchContainer $hasValue={hasValue}>
      <SearchIcon src={search_icon} alt="" aria-hidden="true" />

      <SearchField
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="테스트명 검색"
        aria-label="테스트명 검색"
      />

      {hasValue && (
        <ClearButton type="button" onClick={handleClear} aria-label="검색어 지우기">
          <img src={clear_icon} alt="" aria-hidden="true" />
        </ClearButton>
      )}
    </SearchContainer>
  );
}

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  box-sizing: border-box;
  width: 442px;
  max-width: 100%;
  min-height: 44px;
  padding: ${({ $hasValue }) => ($hasValue ? "10px 16px 10px 10px" : "10px")};

  border: 1px solid #64748b;
  border-radius: 8px;
`;

const SearchField = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0;

  border: none;
  outline: none;
  background: transparent;

  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #0f172a;

  &::placeholder {
    color: #64748b;
    opacity: 1;
  }

  /* 브라우저 기본 X 대신 디자인의 지우기 버튼 사용 */
  &::-webkit-search-cancel-button {
    display: none;
  }
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  padding: 0;
  margin-left: 2px;

  border: none;
  background: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
