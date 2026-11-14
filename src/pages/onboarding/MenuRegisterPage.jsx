import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useCreateTest from "@/features/test/api/useCreateTest";
import OnboardingHeader from "@/features/cost/components/OnboardingHeader";
import MenuBasicForm from "@/features/cost/components/MenuBasicForm";
import CostMethodSelector from "@/features/cost/components/CostMethodSelector";
import "./MenuRegisterPage.css";
import next_btn from "@/images/Onboarding/next_btn.svg";
import "@/features/cost/components/IngredientRowList";

function MenuRegisterPage() {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [selectedMethod, setSelectedMethod] = useState("recipe");
  const { mutate: createTest, isPending } = useCreateTest();

  const goNext = (id) => {
    const step = selectedMethod === "recipe" ? "recipe" : "ai";
    navigate(`/tests/${id}/onboarding/${step}`);
  };

  const handleNext = () => {
    // 이미 초안이 있으면(/tests/:testId/onboarding/menu) 바로 다음 단계로
    if (testId) {
      goNext(testId);
      return;
    }
    // /tests/new: 빈 초안을 만들고, 받은 test_id로 이동
    // TODO: PATCH 연결 후 메뉴명·판매가 저장을 여기서 이어서 호출
    createTest(undefined, {
      onSuccess: (test) => goNext(test.test_id),
      onError: (error) => alert(error.message),
    });
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
        <MenuBasicForm />
        <div className="menuregister_main_02">
          <CostMethodSelector
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        </div>
      </div>
      <button
        type="button"
        className="menuregister_bot"
        onClick={handleNext}
        disabled={isPending}
      >
        {selectedMethod === "recipe"
          ? "계속 (레시피 입력)"
          : "계속 (AI 원가 추정)"}
        <img src={next_btn} alt="" />
      </button>
    </div>
  );
}

export default MenuRegisterPage;
