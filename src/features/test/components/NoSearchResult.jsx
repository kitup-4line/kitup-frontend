import EmptyState from "@/shared/ui/EmptyState";
import no_result_icon from "@/images/TestList/no_result_icon.svg";

export default function NoSearchResult({ query }) {
  return (
    <EmptyState
      icon={<img src={no_result_icon} alt="" aria-hidden="true" />}
      title={`'${query}'에 대한 검색 결과가 없습니다.`}
      description="단어의 철자가 정확한지 확인하거나, 다른 검색어로 다시 시도해 보세요."
    />
  );
}
