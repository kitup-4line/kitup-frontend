import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getTestDefaults,
  getIngredients,
  saveIngredients,
} from "@/features/cost/api/menuTests";
import OnboardingHeader from "@/features/cost/components/OnboardingHeader";
import IngredientRowList from "@/features/cost/components/IngredientRowList";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { getIngredientDeleteDescription } from "@/features/cost/utils/deleteMessage";
import "./RecipeInputPage.css";
import next_btn from "@/images/Onboarding/next_btn.svg";
import prev_btn from "@/images/Onboarding/prev_btn.svg";
import plus_icon from "@/images/Onboarding/plus_icon.svg";

function RecipeInputPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientUnitOptions, setIngredientUnitOptions] = useState([]);
  const [defaultsError, setDefaultsError] = useState("");
  const [ingredientsError, setIngredientsError] = useState("");
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(
    Boolean(testId),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showEmptyErrors, setShowEmptyErrors] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchDefaults = async () => {
      try {
        const result = await getTestDefaults();

        if (!active) return;

        setIngredientUnitOptions(result.data.ingredient_unit_options);
      } catch (err) {
        if (active) {
          setDefaultsError(err.message || "재료 단위를 불러오지 못했습니다.");
        }
      }
    };

    fetchDefaults();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchIngredients = async () => {
      try {
        const result = await getIngredients(testId);

        if (!active) return;

        const data = result.data;

        setIngredients(
          (data.ingredients ?? []).map((item) => ({
            id: item.ingredient_id,
            name: item.ingredient_name ?? "",
            quantity: item.quantity == null ? "" : String(item.quantity),
            unit: item.unit ?? "",
            price:
              item.ingredient_cost == null ? "" : String(item.ingredient_cost),
          })),
        );

        setIngredientsError("");
      } catch (err) {
        if (active) {
          setIngredientsError(
            err.message || "저장된 식재료를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (active) {
          setIsLoadingIngredients(false);
        }
      }
    };

    fetchIngredients();

    return () => {
      active = false;
    };
  }, [testId]);

  const handleIngredientChange = (id, field, value) => {
    setShowEmptyErrors(false);

    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient,
      ),
    );
  };

  const displayedTotalIngredientCost = ingredients.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );

  const handleSaveIngredients = async () => {
    if (!testId || isLoadingIngredients || isSaving || ingredientsError) return;

    setSaveError("");

    // 재료 개수 검사
    if (ingredients.length < 1 || ingredients.length > 20) {
      setSaveError("식재료는 1개 이상 20개 이하로 입력해 주세요.");
      return;
    }

    const emptyItem = ingredients
      .map((item) => ({
        id: item.id,
        field: ["name", "quantity", "unit", "price"].find(
          (field) => String(item[field] ?? "").trim() === "",
        ),
      }))
      .find((item) => item.field);

    if (emptyItem) {
      setShowEmptyErrors(true);
      setSaveError("빈칸을 모두 입력해 주세요.");

      requestAnimationFrame(() => {
        const target = document.querySelector(
          `[data-id="${emptyItem.id}"] [data-field="${emptyItem.field}"]`,
        );

        target?.scrollIntoView({ behavior: "smooth", block: "center" });
        target?.focus({ preventScroll: true });
      });

      return;
    }

    // 재료명 검사
    const names = ingredients.map((item) => item.name.trim());

    if (names.some((name) => name.length < 1 || name.length > 20)) {
      setSaveError("재료명은 1~20자로 입력해 주세요.");
      return;
    }

    if (new Set(names).size !== names.length) {
      setSaveError("같은 이름의 재료를 중복해서 입력할 수 없습니다.");
      return;
    }

    // 수량 검사
    if (
      ingredients.some(
        (item) =>
          String(item.quantity ?? "").trim() === "" ||
          !Number.isFinite(Number(item.quantity)) ||
          Number(item.quantity) <= 0,
      )
    ) {
      setSaveError("재료 수량은 0보다 큰 숫자로 입력해 주세요.");
      return;
    }

    // 단위 검사
    const validUnits = ["g", "kg", "ml", "l", "piece"];

    if (ingredients.some((item) => !validUnits.includes(item.unit))) {
      setSaveError("올바른 재료 단위를 선택해 주세요.");
      return;
    }

    // 재료비 검사
    if (
      ingredients.some(
        (item) =>
          String(item.price ?? "").trim() === "" ||
          !Number.isFinite(Number(item.price)) ||
          Number(item.price) < 0,
      )
    ) {
      setSaveError("재료비는 0 이상의 숫자로 입력해 주세요.");
      return;
    }

    // API 요청 데이터 생성
    const payload = ingredients.map((item) => ({
      ingredient_name: item.name.trim(),
      quantity: Number(item.quantity),
      unit: item.unit,
      ingredient_cost: Number(item.price),
    }));

    const total = payload.reduce((sum, item) => sum + item.ingredient_cost, 0);

    if (total < 1) {
      setSaveError("식재료비 합계는 1원 이상이어야 합니다.");
      return;
    }

    try {
      setIsSaving(true);

      await saveIngredients(testId, {
        ingredients: payload,
      });

      navigate(`/tests/${testId}/onboarding/cost`);
    } catch (err) {
      setSaveError(err.message || "식재료 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="RecipeInputPage_wrap">
      <div className="recipeinputpage_top">
        <OnboardingHeader
          title="레시피 직접 입력"
          description="사용한 재료를 한 항목씩 입력하세요. 수량과 단가를 정확히 입력할수록 식재료비와 공헌이익이 정밀해집니다."
        />
      </div>
      {defaultsError && <p role="alert">{defaultsError}</p>}
      {ingredientsError && <p role="alert">{ingredientsError}</p>}
      {saveError && <p role="alert">{saveError}</p>}

      <div className="recipeinputpage_main">
        <div className="r_m_top">
          <div className="r_m_t_left">
            <p>식재료 명세서</p>
            <span>1인분 조리 기준 실투입 품목 목록</span>
          </div>
          <div className="r_m_t_right">총 {ingredients.length}개 항목</div>
        </div>
        <div className="r_m_main">
          <div className="r_m_m_top">
            <p>
              재료명 <span>*</span>
            </p>
            <p>수량</p>
            <p>단위</p>
            <p>구매 단가 (원)</p>
            <p>삭제</p>
          </div>
          <div className="r_m_m_mid">
            {ingredients.map((ingredient) => (
              <IngredientRowList
                key={ingredient.id}
                ingredient={ingredient}
                ingredientUnitOptions={ingredientUnitOptions}
                showEmptyErrors={showEmptyErrors}
                onChange={(field, value) =>
                  handleIngredientChange(ingredient.id, field, value)
                }
                onDelete={() => setDeleteTarget(ingredient.id)}
              />
            ))}
          </div>

          <div
            className={`r_m_m_bot ${ingredients.length >= 20 ? "disabled" : ""}`}
            onClick={() => {
              if (ingredients.length >= 20) return;

              setShowEmptyErrors(false);
              setIngredients((prev) =>
                prev.length >= 20
                  ? prev
                  : [
                      ...prev,
                      {
                        id: Math.max(0, ...prev.map((item) => item.id)) + 1,
                        name: "",
                        quantity: "",
                        unit: "",
                        price: "",
                      },
                    ],
              );
            }}
          >
            <img src={plus_icon} alt="" />
            <p>재료 추가</p>
          </div>
        </div>
        <div className="r_m_bot">
          <div className="r_m_b_left">
            <p>산출 총 식재료비 (추정)</p>
            <span>
              입력된 재료 수량과 구매 단가를 바탕으로 1인분 총 식재료비가 자동
              계산됩니다.
            </span>
          </div>
          <div className="r_m_b_right">
            ₩ {displayedTotalIngredientCost.toLocaleString("ko-KR")}
          </div>
        </div>
      </div>

      <div className="recipeinputpage_bot">
        <button
          className="recipeinputpage_bot_prev"
          onClick={() => navigate(`/tests/${testId}/onboarding/menu`)}
        >
          <img src={prev_btn} alt="" />
          이전 단계로
        </button>
        <button
          className="recipeinputpage_bot_next"
          onClick={handleSaveIngredients}
          disabled={
            isLoadingIngredients ||
            isSaving ||
            Boolean(ingredientsError) ||
            !testId
          }
        >
          원가 확인하러 가기
          <img src={next_btn} alt="" />
        </button>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="식재료 삭제 확인"
        description={getIngredientDeleteDescription(ingredients, deleteTarget)}
        confirmLabel="삭제"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          setIngredients((prev) =>
            prev.filter((ingredient) => ingredient.id !== deleteTarget),
          );
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}

export default RecipeInputPage;
