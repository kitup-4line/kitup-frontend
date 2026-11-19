import styled from "styled-components";

const FILTER_OPTIONS = [
  { id: "ALL", label: "전체" },
  { id: "RUNNING", label: "운영 중" },
  { id: "DRAFT", label: "작성 중" },
  { id: "COMPLETED", label: "완료됨" },
];

export default function TestFilterTabs({
  activeTab = "ALL",
  onChange,
  counts = {},
}) {
  return (
    <TabsContainer role="group" aria-label="테스트 상태 필터">
      {FILTER_OPTIONS.map(({ id, label }) => (
        <TabButton
          key={id}
          type="button"
          $active={activeTab === id}
          aria-pressed={activeTab === id}
          onClick={() => onChange?.(id)}
        >
          <TabLabel>{label}</TabLabel>
          <TabCount>{counts[id] ?? 0}</TabCount>
        </TabButton>
      ))}
    </TabsContainer>
  );
}

const TabsContainer = styled.div`
  display: flex;
  padding: 4px;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 8px 16px;
  border: none;
  border-radius: 12px;

  background-color: ${({ $active }) =>
    $active ? "#0F172A" : "transparent"};

  color: ${({ $active }) =>
    $active ? "#FCFEFF" : "#64748B"};

  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  line-height: 1.4;
  letter-spacing: -0.384px;

  white-space: nowrap;
  cursor: pointer;

  filter: ${({ $active }) =>
    $active ? "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05))" : "none"};

  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ $active }) =>
      $active ? "#0F172A" : "#F1F5F9"};
  }

  &:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
`;

const TabLabel = styled.span`
  white-space: nowrap;
`;

const TabCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 12px;
  padding: 2px 6px;
  border-radius: 9999px;
`;
