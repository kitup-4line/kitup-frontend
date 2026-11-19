import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getIngredients,
  saveIngredients,
  getTestDefaults,
  getTestDetail,
} from "@/features/cost/api/menuTests";
import IngredientRowList from "@/features/cost/components/IngredientRowList";
import ConfirmModal from "@/shared/ui/ConfirmModal";
import { getIngredientDeleteDescription } from "@/features/cost/utils/deleteMessage";
import "./IngredientEditPage.css";
import plus_icon from "@/images/Dashboard/plus_icon.svg";
import { getDashboardChannels } from "@/features/dashboard/api/dashboard";

const IngredientEditPage = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [originalCost, setOriginalCost] = useState(null);
  const [unitOptions, setUnitOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [defaultsData, setDefaultsData] = useState(null);
  const [summaryInputs, setSummaryInputs] = useState(null);
  const [summaryError, setSummaryError] = useState("");
  const { testId } = useParams();

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchIngredients = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const [result, defaults] = await Promise.all([
          getIngredients(testId),
          getTestDefaults(),
        ]);

        if (!active) return;

        setIngredients(
          (result.data.ingredients ?? []).map((item) => ({
            id: item.ingredient_id,
            name: item.ingredient_name ?? "",
            quantity: String(item.quantity ?? ""),
            unit: item.unit ?? "",
            price: String(item.ingredient_cost ?? ""),
          })),
        );

        setOriginalCost(Number(result.data.total_ingredient_cost ?? 0));
        setUnitOptions(defaults.data.ingredient_unit_options ?? []);
        setDefaultsData(defaults.data);
      } catch (err) {
        if (active) {
          setLoadError(err.message || "식재료를 불러오지 못했습니다.");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchIngredients();

    return () => {
      active = false;
    };
  }, [testId]);

  useEffect(() => {
    if (!testId) return;

    let active = true;

    const fetchSummaryInputs = async () => {
      setSummaryInputs(null);
      setSummaryError("");

      try {
        const [detailResult, channelsResult] = await Promise.all([
          getTestDetail(testId),
          getDashboardChannels(testId),
        ]);

        if (!active) return;

        const channels = channelsResult.data.channels ?? [];

        const delivery = channels.find(
          (channel) => channel.order_type === "DELIVERY",
        );
        const pickup = channels.find(
          (channel) => channel.order_type === "PICKUP",
        );

        setSummaryInputs({
          sellingPrice: Number(detailResult.data.selling_price),
          packagingCost: Number(detailResult.data.packaging_cost),
          deliveryOrders: Number(delivery?.order_count ?? 0),
          pickupOrders: Number(pickup?.order_count ?? 0),
        });
      } catch (err) {
        if (active) {
          setSummaryError(
            err.message || "공헌이익 계산 데이터를 불러오지 못했습니다.",
          );
        }
      }
    };

    fetchSummaryInputs();

    return () => {
      active = false;
    };
  }, [testId]);

  const handleChange = (id, field, value) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleAdd = () => {
    setIngredients((prev) => [
      ...prev,
      {
        id: Math.max(0, ...prev.map((item) => item.id)) + 1,
        name: "",
        quantity: "",
        unit: "",
        price: "",
      },
    ]);
  };

  const handleDelete = () => {
    setIngredients((prev) => prev.filter((item) => item.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const handleConfirm = async () => {
    if (!testId || isLoading || isSaving || loadError) return;

    setSaveError("");

    const payload = ingredients.map((item) => ({
      ingredient_name: item.name.trim(),
      quantity: Number(item.quantity),
      unit: item.unit,
      ingredient_cost: Number(item.price),
    }));

    try {
      setIsSaving(true);

      await saveIngredients(testId, { ingredients: payload });

      navigate(`/tests/${testId}/dashboard`);
    } catch (err) {
      setSaveError(err.message || "식재료 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const changedCost = ingredients.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );

  const deliveryFee = Number(defaultsData?.delivery_fee);
  const commissionRate = Number(defaultsData?.delivery_commission_rate);

  const canCalculate =
    summaryInputs !== null &&
    defaultsData !== null &&
    Number.isFinite(summaryInputs.sellingPrice) &&
    Number.isFinite(summaryInputs.packagingCost) &&
    Number.isFinite(deliveryFee) &&
    Number.isFinite(commissionRate);

  const deliveryMargin = canCalculate
    ? summaryInputs.sellingPrice -
      changedCost -
      summaryInputs.packagingCost -
      deliveryFee -
      Math.round(summaryInputs.sellingPrice * commissionRate)
    : null;

  const pickupMargin = canCalculate
    ? summaryInputs.sellingPrice - changedCost - summaryInputs.packagingCost
    : null;

  const totalOrders = summaryInputs
    ? summaryInputs.deliveryOrders + summaryInputs.pickupOrders
    : 0;

  const totalMargin =
    canCalculate && totalOrders > 0
      ? deliveryMargin * summaryInputs.deliveryOrders +
        pickupMargin * summaryInputs.pickupOrders
      : null;

  const averageMargin =
    totalMargin !== null ? Math.round(totalMargin / totalOrders) : null;

  const summaryData = [
    {
      title: "기존 추정 원가",
      amount:
        originalCost === null ? "-" : originalCost.toLocaleString("ko-KR"),
    },
    {
      title: "변경된 실측 원가",
      amount: changedCost.toLocaleString("ko-KR"),
    },
    {
      title: "건당 공헌이익",
      amount:
        averageMargin === null ? "-" : averageMargin.toLocaleString("ko-KR"),
      highlight: true,
    },
    {
      title: "추정 총공헌이익",
      amount: totalMargin === null ? "-" : totalMargin.toLocaleString("ko-KR"),
    },
  ];

  return (
    <div className="IngredientEditPage_wrap">
      <div className="ingredienteditpage_top">
        <h2>개별 식재료비 수정</h2>
        <span>
          메뉴에 사용된 식재료의 실제 구매 단가를 입력하면 추정 원가가 실측치로
          업데이트됩니다.
        </span>
      </div>

      <div className="ingredienteditpage_main">
        <div className="i_e_m_top">
          <div className="i_e_m_t_left">
            <p>식재료 명세서</p>
            <span>1인분 조리 기준 실투입 품목 목록</span>
          </div>
          <div className="i_e_m_t_right">총 {ingredients.length}개 항목</div>
        </div>

        {isLoading && <p>식재료를 불러오는 중입니다.</p>}
        {loadError && <p role="alert">{loadError}</p>}
        {saveError && <p role="alert">{saveError}</p>}

        <div className="i_e_m_main">
          <div className="i_e_m_m_top">
            <p>
              재료명 <span>*</span>
            </p>
            <p>수량</p>
            <p>단위</p>
            <p>구매 단가 (원)</p>
            <p>삭제</p>
          </div>

          <div className="i_e_m_m_mid">
            {ingredients.map((item) => (
              <IngredientRowList
                key={item.id}
                ingredient={item}
                ingredientUnitOptions={unitOptions}
                onChange={(field, value) => handleChange(item.id, field, value)}
                onDelete={() => setDeleteTarget(item.id)}
              />
            ))}
          </div>

          <button className="i_e_m_m_bot" type="button" onClick={handleAdd}>
            <img src={plus_icon} alt="" />
            <p>재료 추가</p>
          </button>
        </div>
      </div>

      <div className="ingredienteditpage_summary">
        <div className="i_e_s_top">
          <p>수정 결과 요약</p>
        </div>
        {summaryError && <p role="alert">{summaryError}</p>}

        <div className="i_e_s_main">
          {summaryData.map((item) => (
            <div className="i_e_s_box" key={item.title}>
              <p>{item.title}</p>

              <div className={item.highlight ? "highlight" : ""}>
                {item.amount === "-"
                  ? "-"
                  : item.amount.split(",").map((group, index, groups) => (
                      <span className="i_e_s_number_group" key={index}>
                        {group}
                        {index < groups.length - 1 ? (
                          ","
                        ) : (
                          <span className="i_e_s_unit">원</span>
                        )}
                      </span>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ingredienteditpage_bot">
        <button
          type="button"
          className="ingredienteditpage_cancel"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
        <button
          type="button"
          className="ingredienteditpage_confirm"
          onClick={handleConfirm}
          disabled={isLoading || isSaving || Boolean(loadError)}
        >
          확인
        </button>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="식재료 삭제 확인"
        description={getIngredientDeleteDescription(ingredients, deleteTarget)}
        confirmLabel="삭제"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default IngredientEditPage;
