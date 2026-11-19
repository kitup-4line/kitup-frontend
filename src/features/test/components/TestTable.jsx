import styled from "styled-components";
import Pagination from "@/shared/ui/Pagination";
import TestTableRow from "./TestTableRow";
import SelectCheckbox from "./SelectCheckbox";
import { isDeletable } from "../utils/testListView";

const SELECT_COLUMN_WIDTH = 40;

const COLUMNS = [
  { label: "테스트명", width: 420 },
  { label: "상태", width: 152 },
  { label: "테스트 기간 / 매장", width: 210 },
  { label: "최근 수정일 / D-Day", width: 210 },
  { label: "관리 및 액션", width: 208 },
];

export default function TestTable({
  rows,
  total,
  isSearching,
  page,
  totalPages,
  onPageChange,
  isSelecting = false,
  selectedIds,
  onToggleRow,
  onToggleAll,
}) {
  // 삭제 모드에서는 체크박스 열(40px)만큼 '테스트 기간 / 매장' 열을 줄인다
  const columns = isSelecting
    ? COLUMNS.map((column) =>
        column.label === "테스트 기간 / 매장"
          ? { ...column, width: column.width - SELECT_COLUMN_WIDTH }
          : column,
      )
    : COLUMNS;
  // 전체 선택은 현재 페이지에서 삭제 가능한(작성 중) 테스트만 대상으로 한다
  const deletableRows = rows.filter((test) => isDeletable(test.status));
  const isAllSelected =
    deletableRows.length > 0 &&
    deletableRows.every((test) => selectedIds?.has(test.test_id));

  return (
    <Container>
      <TableArea>
        <Table>
          <colgroup>
            {isSelecting && <col style={{ width: SELECT_COLUMN_WIDTH }} />}
            {columns.map(({ label, width }) => (
              <col key={label} style={{ width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {isSelecting && (
                <SelectHeaderCell scope="col">
                  <SelectCheckbox
                    checked={isAllSelected}
                    onChange={() => onToggleAll(deletableRows, !isAllSelected)}
                    label="현재 페이지의 작성 중 테스트 전체 선택"
                    disabled={deletableRows.length === 0}
                  />
                </SelectHeaderCell>
              )}
              {columns.map(({ label }) => (
                <HeaderCell key={label} scope="col">
                  {label}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((test) => (
                <TestTableRow
                  key={test.test_id}
                  test={test}
                  isSelecting={isSelecting}
                  isSelected={selectedIds?.has(test.test_id) ?? false}
                  onToggle={() => onToggleRow(test.test_id)}
                />
              ))
            ) : (
              <tr>
                <EmptyCell colSpan={columns.length + (isSelecting ? 1 : 0)}>
                  해당 상태의 테스트가 없습니다.
                </EmptyCell>
              </tr>
            )}
          </tbody>
        </Table>
      </TableArea>

      <Footer>
        <Summary>
          총 <strong>{total}개</strong>의 테스트가{" "}
          {isSearching ? "검색되었습니다." : "등록되어 있습니다."}
        </Summary>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={onPageChange}
        />
      </Footer>
    </Container>
  );
}

const ROW_HEIGHT = 66;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 462px;
  overflow: hidden;

  background-color: #fcfeff;
  border-radius: 16px;

  font-family: "Pretendard", sans-serif;
`;

const TableArea = styled.div`
  flex: 1;
  min-height: 0;
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;

  tr {
    height: ${ROW_HEIGHT}px;
  }
`;

const HeaderCell = styled.th`
  padding: 12px;
  background-color: #f1f5f9;
  text-align: left;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #0f172a;
  white-space: nowrap;

  &:first-child {
    padding-left: 28px;
  }

  &:last-child {
    padding-right: 28px;
  }
`;

const SelectHeaderCell = styled(HeaderCell)`
  &:first-child {
    padding: 0 0 0 20px;
  }
  vertical-align: middle;
  line-height: 0;
`;

const EmptyCell = styled.td`
  padding: 24px;
  text-align: center;

  font-size: 16px;
  line-height: 1.4;
  letter-spacing: -0.384px;
  color: #64748b;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: ${ROW_HEIGHT}px;
  padding: 0 28px 0 32px;

  background-color: #f1f5f9;
`;

const Summary = styled.p`
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: -0.336px;
  color: #64748b;

  & > strong {
    font-weight: 600;
  }
`;
