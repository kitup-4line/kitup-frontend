import { useNavigate, useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCostResult } from "@/features/cost/api/menuTests";
import "./CostResultPage.css";
import OnboardingHeader from "@/features/cost/components/OnboardingHeader";
import CostCondition from "@/features/cost/components/CostCondition";
import CostValidation from "@/features/cost/components/CostValidation";
import prev_btn from "@/images/Onboarding/prev_btn.svg";

const CostResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = useParams();
  const [costData, setCostData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(testId));
  const [costError, setCostError] = useState("");
  const aiMockMessage = location.state?.aiMockMessage;

  const handlePrevious = () => {
    const costMethod = location.state?.costMethod;

    if (costMethod === "recipe") {
      navigate(`/tests/${testId}/onboarding/cost`);
    } else if (costMethod === "ai") {
      navigate(`/tests/${testId}/onboarding/ai`);
    } else {
      navigate(`/tests/${testId}/onboarding/menu`);
    }
  };

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchCostResult = async () => {
      try {
        const result = await getCostResult(testId);

        if (!active) return;

        setCostData(result.data);
        setCostError("");
      } catch (err) {
        if (active) {
          setCostError(err.message || "원가 결과를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchCostResult();

    return () => {
      active = false;
    };
  }, [testId]);

  return (
    <div className="CostResultPage_wrap">
      <div className="costresultpage_top">
        <OnboardingHeader title="원가 추정 결과" />
      </div>
      {aiMockMessage && (
        <p role="status">
          {aiMockMessage} 실제 AI 분석 결과가 아닌 개발용 데이터입니다.
        </p>
      )}
      {isLoading && <p>원가 결과를 불러오는 중입니다.</p>}
      {costError && <p role="alert">{costError}</p>}

      {!isLoading && !costError && costData && (
        <div className="costresultpage_main">
          <CostCondition costData={costData} />
          <CostValidation costData={costData} />
        </div>
      )}
      <div className="costresultpage_bot">
        <button className="costresultpage_bot_prev" onClick={handlePrevious}>
          <img src={prev_btn} alt="" />
          이전 단계로
        </button>
        <button
          className="costresultpage_bot_next"
          onClick={() => navigate(`/tests/${testId}/dashboard`)}
        >
          운영 대시보드
        </button>
      </div>
    </div>
  );
};

export default CostResultPage;
