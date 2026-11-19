import styled from "styled-components";
import TestFilterTabs from "./TestFilterTabs";
import TestSearchInput from "./TestSearchInput";

export default function TestToolbar({
  activeTab,
  onTabChange,
  counts,
  searchQuery,
  onSearchChange,
}) {
  return (
    <ToolbarContainer>
      <ToolbarContent>
        <TestFilterTabs
          activeTab={activeTab}
          onChange={onTabChange}
          counts={counts}
        />

        <TestSearchInput
          value={searchQuery}
          onChange={onSearchChange}
        />
      </ToolbarContent>
    </ToolbarContainer>
  );
}

const ToolbarContainer = styled.section`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 10px 24px;

  background-color: #fcfeff;
  border-radius: 8px;
`;

const ToolbarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  width: 100%;
  min-width: 0;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;

    & > *:last-child {
      width: 100%;
    }
  }
`;
