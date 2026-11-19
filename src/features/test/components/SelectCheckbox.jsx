import styled from "styled-components";
import checked_icon from "@/images/TestList/checkbox_checked_icon.svg";

// 삭제 모드에서 테스트를 고르는 체크박스 (실제 input은 숨기고 디자인 박스를 보여준다)
// disabled: 삭제할 수 없는 테스트(작성 중이 아닌 테스트)
export default function SelectCheckbox({
  checked,
  onChange,
  label,
  disabled = false,
  title,
}) {
  return (
    <Wrapper $disabled={disabled} title={title}>
      <HiddenInput
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        disabled={disabled}
      />
      {checked ? (
        <img src={checked_icon} alt="" aria-hidden="true" />
      ) : (
        <EmptyBox aria-hidden="true" $disabled={disabled} />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.label`
  position: relative;
  display: inline-flex;
  width: 20px;
  height: 20px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

  & > img {
    width: 20px;
    height: 20px;
  }

  &:has(input:focus-visible) {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const HiddenInput = styled.input`
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: inherit;
`;

const EmptyBox = styled.span`
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: ${({ $disabled }) => ($disabled ? "#f1f5f9" : "#fcfeff")};
`;
