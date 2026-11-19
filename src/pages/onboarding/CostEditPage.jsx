import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getTestDetail,
  getTestDefaults,
  updateTest,
} from "@/features/cost/api/menuTests";
import "./CostEditPage.css";
import OnboardingHeader from "@/features/cost/components/OnboardingHeader";
import SalesCondition from "@/features/cost/components/SalesCondition";
import VariableCost from "@/features/cost/components/VariableCost";
import ContributionMargin from "@/features/cost/components/ContributionMargin";

const CostEditPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [costInfo, setCostInfo] = useState({
    sellingPrice: "",
    ingredientCost: "",
    packagingCost: "",
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    fee: 0,
    rate: 0,
  });
  const [isLoading, setIsLoading] = useState(Boolean(testId));
  const [isSaving, setIsSaving] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchCostInfo = async () => {
      try {
        const [result, defaults] = await Promise.all([
          getTestDetail(testId),
          getTestDefaults(),
        ]);
        if (!active) return;
        setDeliveryInfo({
          fee: defaults.data.delivery_fee,
          rate: defaults.data.delivery_commission_rate,
        });
        setError("");

        const data = result.data;

        setCostInfo({
          sellingPrice:
            data.selling_price == null ? "" : String(data.selling_price),
          ingredientCost:
            data.total_ingredient_cost == null
              ? ""
              : String(data.total_ingredient_cost),
          packagingCost:
            data.packaging_cost == null ? "" : String(data.packaging_cost),
        });

        setIsEditable(data.is_editable);
      } catch (err) {
        if (active) {
          setError(err.message || "원가 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    if (testId) {
      fetchCostInfo();
    }

    return () => {
      active = false;
    };
  }, [testId]);

  const handleSave = async () => {
    if (isSaving || isLoading || !isEditable || !testId) return;

    const sellingPrice = Number(costInfo.sellingPrice);
    const ingredientCost = Number(costInfo.ingredientCost);
    const packagingCost = Number(costInfo.packagingCost);

    if (
      costInfo.sellingPrice.trim() === "" ||
      !Number.isInteger(sellingPrice) ||
      sellingPrice < 1
    ) {
      setError("판매가는 1 이상의 정수로 입력해 주세요.");
      return;
    }

    if (
      costInfo.ingredientCost.trim() === "" ||
      !Number.isFinite(ingredientCost) ||
      ingredientCost < 1
    ) {
      setError("식재료비는 1원 이상 입력해 주세요.");
      return;
    }

    if (!Number.isFinite(packagingCost) || packagingCost < 0) {
      setError("포장비는 0 이상으로 입력해 주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await updateTest(testId, {
        selling_price: sellingPrice,
        total_ingredient_cost: ingredientCost,
        packaging_cost: packagingCost,
      });

      navigate(`/tests/${testId}/onboarding/result`, {
        state: { costMethod: "recipe" },
      });
    } catch (err) {
      setError(err.message || "원가 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="CostEditPage_wrap">
      <div className="costeditpage_top">
        <OnboardingHeader
          title="원가 확인 · 수정"
          description="등록된 메뉴의 판매가 및 원가 구성 항목을 검토하고 최적의 공헌이익을 산정합니다."
        />
      </div>
      <div className="costeditpage_main">
        <SalesCondition
          sellingPrice={costInfo.sellingPrice}
          onChange={(value) =>
            setCostInfo((prev) => ({
              ...prev,
              sellingPrice: value,
            }))
          }
          disabled={isLoading || isSaving || !isEditable}
        />
        <VariableCost
          ingredientCost={costInfo.ingredientCost}
          packagingCost={costInfo.packagingCost}
          onIngredientChange={(value) =>
            setCostInfo((prev) => ({
              ...prev,
              ingredientCost: value,
            }))
          }
          onPackagingChange={(value) =>
            setCostInfo((prev) => ({
              ...prev,
              packagingCost: value,
            }))
          }
          disabled={isLoading || isSaving || !isEditable}
        />
        <ContributionMargin
          sellingPrice={costInfo.sellingPrice}
          ingredientCost={costInfo.ingredientCost}
          packagingCost={costInfo.packagingCost}
          deliveryFee={deliveryInfo.fee}
          commissionRate={deliveryInfo.rate}
        />
      </div>
      {!testId && <p role="alert">테스트 ID를 확인할 수 없습니다.</p>}
      {error && <p role="alert">{error}</p>}
      <div className="costeditpage_bot">
        <button
          className="costeditpage_bot_next"
          onClick={handleSave}
          disabled={isLoading || isSaving || !isEditable}
        >
          원가 설정 완료
        </button>
      </div>
    </div>
  );
};

export default CostEditPage;
