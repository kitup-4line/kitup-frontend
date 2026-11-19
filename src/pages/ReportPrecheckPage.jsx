import { Navigate, useParams } from "react-router";

// 리포트 생성 전 확인 단계는 기존 고정비 입력 페이지가 담당한다.
function ReportPrecheckPage() {
  const { testId } = useParams();
  return <Navigate to={`/tests/${testId}/dashboard/cost/fixed-cost`} replace />;
}

export default ReportPrecheckPage;
