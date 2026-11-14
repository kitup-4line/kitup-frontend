import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  createTest,
  getTestDefaults,
  getTestDetail,
  updateTest,
} from "@/features/cost/api/menuTests";
import OnboardingHeader from "@/features/cost/components/OnboardingHeader";
import MenuBasicForm from "@/features/cost/components/MenuBasicForm";
import CostMethodSelector from "@/features/cost/components/CostMethodSelector";
import "./MenuRegisterPage.css";
import next_btn from "@/images/Onboarding/next_btn.svg";

function MenuRegisterPage() {
  const navigate = useNavigate();
  const { testId: routeTestId } = useParams();
  const [selectedMethod, setSelectedMethod] = useState("recipe");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuInfo, setMenuInfo] = useState({
    menuName: "",
    sellingPrice: "",
    packagingCost: "",
    businessStartTime: "",
    businessEndTime: "",
  });
  const [businessHourOptions, setBusinessHourOptions] = useState([]);
  const [defaultsLoading, setDefaultsLoading] = useState(true);
  const [defaultsError, setDefaultsError] = useState("");
  const [draftId, setDraftId] = useState(null);
  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchInitialData = async () => {
      setDefaultsLoading(true);
      setDefaultsError("");

      try {
        // 1. 입력 초깃값 조회
        const defaultsResult = await getTestDefaults();
        if (!active) return;

        const defaults = defaultsResult.data;

        setBusinessHourOptions(defaults.business_hour_options);

        // 2. 기존 테스트라면 저장된 정보 조회
        if (routeTestId) {
          const detailResult = await getTestDetail(routeTestId);
          if (!active) return;

          const data = detailResult.data;

          setMenuInfo({
            menuName: data.menu_name ?? "",
            sellingPrice:
              data.selling_price == null ? "" : String(data.selling_price),
            packagingCost:
              data.packaging_cost == null ? "" : String(data.packaging_cost),
            businessStartTime: data.business_start_time ?? "",
            businessEndTime: data.business_end_time ?? "",
          });

          setIsEditable(data.is_editable);
        } else {
          // 3. 새 테스트라면 기본 포장비 적용
          setMenuInfo((prev) => ({
            ...prev,
            packagingCost: String(defaults.packaging_cost),
          }));

          setIsEditable(true);
        }
      } catch (err) {
        if (active) {
          setDefaultsError(err.message || "초기 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setDefaultsLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      active = false;
    };
  }, [routeTestId]);

  const handleNext = async () => {
    if (isLoading || defaultsLoading || defaultsError || !isEditable) return;

    const menuName = menuInfo.menuName.trim();
    const sellingPrice = Number(menuInfo.sellingPrice);
    const packagingCost = Number(menuInfo.packagingCost);

    if (menuName.length < 1 || menuName.length > 30) {
      setError("메뉴명은 1~30자로 입력해 주세요.");
      return;
    }

    if (
      menuInfo.sellingPrice === "" ||
      !Number.isInteger(sellingPrice) ||
      sellingPrice < 1
    ) {
      setError("판매가는 1 이상의 정수로 입력해 주세요.");
      return;
    }

    if (!Number.isFinite(packagingCost) || packagingCost < 0) {
      setError("포장비는 0 이상으로 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // 1. 빈 초안 생성
      let testId = routeTestId ?? draftId;

      if (testId == null) {
        const result = await createTest();
        testId = result.data.test_id;

        if (testId == null) {
          throw new Error("테스트 ID를 확인할 수 없습니다.");
        }

        setDraftId(testId);
      }

      // 2. 메뉴 기본 정보 저장
      await updateTest(testId, {
        menu_name: menuName,
        selling_price: sellingPrice,
        packaging_cost: packagingCost,
      });

      navigate(
        selectedMethod === "recipe"
          ? `/tests/${testId}/onboarding/recipe`
          : `/tests/${testId}/onboarding/ai`,
      );
    } catch (err) {
      setError(err.message || "테스트 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="MenuRegister_wrap">
      <div className="menuregister_top">
        <OnboardingHeader
          title="메뉴 등록"
          description="새로운 메뉴의 수익성을 분석하려면 먼저 메뉴명과 판매가를 입력하세요."
        />
      </div>
      <div className="menuregister_main">
        <MenuBasicForm
          menuInfo={menuInfo}
          setMenuInfo={setMenuInfo}
          businessHourOptions={businessHourOptions}
          isEditable={isEditable}
        />
        <div className="menuregister_main_02">
          <CostMethodSelector
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        </div>
      </div>
      {defaultsLoading && <p>기본 설정을 불러오는 중입니다.</p>}
      {defaultsError && <p role="alert">{defaultsError}</p>}
      {error && <p role="alert">{error}</p>}
      {!isEditable && (
        <p role="alert">리포트가 생성된 테스트는 수정할 수 없습니다.</p>
      )}
      <button
        className="menuregister_bot"
        onClick={handleNext}
        disabled={
          isLoading || defaultsLoading || Boolean(defaultsError) || !isEditable
        }
      >
        {isLoading
          ? "처리 중..."
          : selectedMethod === "recipe"
            ? "계속 (레시피 입력)"
            : "계속 (AI 원가 추정)"}
        <img src={next_btn} alt="" />
      </button>
    </div>
  );
}

export default MenuRegisterPage;
