import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  estimateAiIngredients,
  getIngredients,
} from "@/features/cost/api/menuTests";
import "./AiIngredientPage.css";
import OnboardingHeader from "@/features/cost/components/OnboardingHeader";
import IngredientAddForm from "@/features/cost/components/IngredientAddForm";
import AiIngredientList from "@/features/cost/components/AiIngredientList";
import next_btn from "@/images/Onboarding/next_btn.svg";
import prev_btn from "@/images/Onboarding/prev_btn.svg";

const AiIngredientPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [ingredientNames, setIngredientNames] = useState([]);
  const [isEstimating, setIsEstimating] = useState(false);
  const [error, setError] = useState("");

  const handleAddIngredient = (value) => {
    const name = value.trim();

    if (!name || name.length > 20) {
      setError("재료명은 1~20자로 입력해 주세요.");
      return false;
    }

    if (ingredientNames.includes(name)) {
      setError("중복된 재료명입니다.");
      return false;
    }

    if (ingredientNames.length >= 20) {
      setError("재료는 최대 20개까지 추가할 수 있습니다.");
      return false;
    }

    setIngredientNames((prev) => [...prev, name]);
    setError("");
    return true;
  };

  const handleDeleteIngredient = (name) => {
    setIngredientNames((prev) => prev.filter((item) => item !== name));
  };

  const handleEstimate = async () => {
    if (isEstimating || !testId) return;

    if (ingredientNames.length === 0) {
      setError("재료를 1개 이상 입력해 주세요.");
      return;
    }

    try {
      setIsEstimating(true);
      setError("");

      const result = await estimateAiIngredients(testId, {
        ingredient_names: ingredientNames,
      });

      navigate(`/tests/${testId}/onboarding/result`, {
        state: {
          costMethod: "ai",
          aiMockMessage: result.message ?? null,
        },
      });
    } catch (err) {
      if (err.code === "ingredients_changed") {
        try {
          const result = await getIngredients(testId);

          setIngredientNames(
            (result.data.ingredients ?? []).map((item) => item.ingredient_name),
          );

          setError(
            "재료가 변경되어 최신 목록을 불러왔습니다. 다시 시도해 주세요.",
          );
        } catch {
          setError("최신 재료 목록을 불러오지 못했습니다.");
        }
      } else if (err.code === "ai_error") {
        setError("AI 추정에 실패했어요. 다시 시도하거나 직접 입력해주세요.");
      } else {
        setError(err.message || "AI 추정 요청에 실패했습니다.");
      }
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="AiIngredientPage_wrap">
      {isEstimating && (
        <div className="ai-loading-overlay">
          <div className="ai-loading-content">
            <div className="ai-loading-spinner" />
            <p>AI가 식재료 원가를 분석하고 있습니다...</p>
          </div>
        </div>
      )}
      <div className="aiingredientpage_top">
        <OnboardingHeader
          title="메뉴에 사용할 재료를 입력하세요"
          description="AI가 재료를 바탕으로 식재료 원가를 추정합니다. 정확한 추정을 위해 메뉴에 실제 사용하는 재료를 모두 입력해주세요."
        />
      </div>
      <div className="aiingredientpage_main">
        <IngredientAddForm
          onAdd={handleAddIngredient}
          disabled={isEstimating}
        />
        <AiIngredientList
          ingredientNames={ingredientNames}
          onDelete={handleDeleteIngredient}
        />
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="aiingredientpage_bot">
        <button
          className="aiingredientpage_bot_prev"
          onClick={() => navigate(`/tests/${testId}/onboarding/menu`)}
        >
          <img src={prev_btn} alt="" />
          이전 단계로
        </button>
        <button
          className="aiingredientpage_bot_next"
          onClick={handleEstimate}
          disabled={isEstimating || !testId}
        >
          AI 추정 분석 시작
          <img src={next_btn} alt="" />
        </button>
      </div>
    </div>
  );
};

export default AiIngredientPage;
