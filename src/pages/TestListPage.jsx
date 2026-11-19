// 내 테스트 화면
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import PageHeading from "../shared/ui/PageHeading";
import EmptyState from "../shared/ui/EmptyState";
import ConfirmModal from "../shared/ui/ConfirmModal";
import TestToolbar from "../features/test/components/TestToolbar";
import Header from "@/app/layouts/HeaderLayout.jsx";
import Empty from "../features/test/components/EmptyTestList";
import NoSearchResult from "../features/test/components/NoSearchResult";
import TestTable from "../features/test/components/TestTable";
import UsageGuide from "../features/test/components/UsageGuide";
import TestListActions from "../features/test/components/TestListActions";
import useTests from "../features/test/api/useTests";
import useDeleteTests from "../features/test/api/useDeleteTests";
import useTestListParams from "../features/test/hooks/useTestListParams";
import { getTestListView, isDeletable } from "../features/test/utils/testListView";

export default function TestListPage() {
  const navigate = useNavigate();
  const { status, page, query, setStatus, setPage, setQuery } =
    useTestListParams();
  const { data: tests = [], isPending, isError, refetch } = useTests();
  const deleteTests = useDeleteTests();

  // 삭제 모드: '삭제하기'를 누르면 체크박스가 나타나고, 고른 테스트를 한 번에 삭제한다
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const hasTests = !isPending && !isError && tests.length > 0;
  const hasDeletable = tests.some((test) => isDeletable(test.status));

  const startSelect = () => {
    setSelectedIds(new Set());
    setIsSelecting(true);
  };

  const cancelSelect = () => {
    setSelectedIds(new Set());
    setIsSelecting(false);
  };

  const toggleRow = (testId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) next.delete(testId);
      else next.add(testId);
      return next;
    });
  };

  // 헤더 체크박스: 현재 페이지에 보이는 테스트만 전체 선택/해제
  const toggleAll = (rows, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rows.forEach(({ test_id }) =>
        checked ? next.add(test_id) : next.delete(test_id),
      );
      return next;
    });
  };

  // 삭제 버튼: 확인 모달을 연다
  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    setDeleteError("");
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setDeleteError("");
  };

  // 확인 모달에서 '삭제'를 누르면 실제로 삭제한다. 요청이 끝날 때까지 모달을 유지한다.
  // 일부만 실패하면 실패한 테스트만 선택된 채로 모달에 오류를 보여 주고, '다시 시도'로 그것만 다시 지운다.
  const confirmDelete = () => {
    const ids = [...selectedIds];
    setDeleteError("");
    deleteTests.mutate(ids, {
      onSuccess: () => {
        closeConfirm();
        cancelSelect();
      },
      onError: (error) => {
        if (error.failedIds) setSelectedIds(new Set(error.failedIds));
        setDeleteError(error.message || "테스트를 삭제하지 못했습니다.");
      },
    });
  };

  const view = useMemo(
    () => getTestListView({ tests, status, query, page }),
    [tests, status, query, page],
  );

  const renderList = () => {
    if (isPending) {
      return <EmptyState title="테스트 목록을 불러오는 중입니다." />;
    }
    if (isError) {
      return (
        <EmptyState
          title="테스트 목록을 불러오지 못했습니다."
          description="잠시 후 다시 시도해 주세요."
          action={
            <RetryButton type="button" onClick={() => refetch()}>
              다시 시도
            </RetryButton>
          }
        />
      );
    }
    if (tests.length === 0) {
      return <Empty onStartTest={() => navigate("/tests/new")} />;
    }
    if (view.isSearching && view.searchedTotal === 0) {
      return <NoSearchResult query={view.query} />;
    }
    return (
      <TestTable
        rows={view.rows}
        total={view.total}
        isSearching={view.isSearching}
        page={view.page}
        totalPages={view.totalPages}
        onPageChange={setPage}
        isSelecting={isSelecting}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
      />
    );
  };

  return (
    <PageContainer>
      <Header showHomeButton={false} />
      <MainContent>
        <HeadingRow>
          <PageHeading
            title="내 테스트"
            description="판매해 본 결과로, 다음 선택을 준비하세요."
          />
          {hasTests && (
            <TestListActions
              isSelecting={isSelecting}
              selectedCount={selectedIds.size}
              isDeleting={deleteTests.isPending}
              canDelete={hasDeletable}
              onStartSelect={startSelect}
              onCancelSelect={cancelSelect}
              onDelete={handleDelete}
              onCreate={() => navigate("/tests/new")}
            />
          )}
        </HeadingRow>

        <TestToolbar
          activeTab={status}
          onTabChange={setStatus}
          counts={view.counts}
          searchQuery={query}
          onSearchChange={setQuery}
        />

        {renderList()}

        <UsageGuide />
      </MainContent>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="테스트 삭제 확인"
        description={`선택한 작성 중 테스트 ${selectedIds.size}개를 삭제하시겠습니까?\n삭제한 테스트는 되돌릴 수 없습니다.`}
        confirmLabel={deleteError ? "다시 시도" : "삭제"}
        pendingLabel="삭제 중"
        isPending={deleteTests.isPending}
        error={deleteError}
        onCancel={closeConfirm}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}

const PageContainer = styled.main`
  padding-bottom: 60px;
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-top: 64px;
  box-sizing: border-box;

  @media (max-width: 1248px) {
    padding: 40px 24px;
  }
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
`;

const RetryButton = styled.button`
  padding: 10px 24px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fcfeff;

  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
  }
`;
