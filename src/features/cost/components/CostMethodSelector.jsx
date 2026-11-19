import "./CostMethodSelector.css";
import recipeinput01_icon from "@/images/Onboarding/recipeinput01_icon.svg";
import recipeinput02_icon from "@/images/Onboarding/recipeinput02_icon.svg";
import ai01_icon from "@/images/Onboarding/ai01_icon.svg";
import ai02_icon from "@/images/Onboarding/ai02_icon.svg";
import check_icon from "@/images/Onboarding/check_icon.svg";

const CostMethodSelector = ({
  selectedMethod,
  setSelectedMethod,
  costMethodRef,
  costMethodError,
  clearCostMethodError,
}) => {
  return (
    <div
      ref={costMethodRef}
      className={`CostMethodSelector_wrap ${costMethodError ? "input-error" : ""}`}
    >
      <div className="costmethodselector_top">
        <p>원가 산정 방법 선택</p>
        <span>
          운영 현황에 맞춰 수기 레시피 입력 또는 AI 사전 추정을 선택하세요.
        </span>
      </div>

      <div className="costmethodselector_main">
        <div
          className={`c_m_left ${selectedMethod === "recipe" ? "selected" : ""}`}
          onClick={() => {
            setSelectedMethod("recipe");
            if (costMethodError) clearCostMethodError();
          }}
        >
          <div className="c_m_l_top">
            <div className="c_m_l_title">
              <div className="c_m_l_t_img">
                <img
                  src={
                    selectedMethod === "recipe"
                      ? recipeinput02_icon
                      : recipeinput01_icon
                  }
                  alt="레시피 직접 입력"
                />
              </div>
              <p>레시피 직접 입력</p>
            </div>
            <div className="c_m_circle">
              {selectedMethod === "recipe" && (
                <img src={check_icon} alt="선택됨" />
              )}
            </div>
          </div>
          <div className="c_m_l_bot">
            식재료명과 구매 단가를 직접 입력하여 원가를 계산합니다.
            <br />
            정확한 원가 파악이 필요한 경우 추천합니다.
          </div>
        </div>

        <div
          className={`c_m_right ${selectedMethod === "ai" ? "selected" : ""}`}
          onClick={() => {
            setSelectedMethod("ai");
            if (costMethodError) clearCostMethodError();
          }}
        >
          <div className="c_m_r_top">
            <div className="c_m_r_title">
              <div className="c_m_r_t_img">
                <img
                  src={selectedMethod === "ai" ? ai02_icon : ai01_icon}
                  alt="AI 원가 추정"
                />
              </div>
              <p>AI 원가 추정</p>
            </div>
            <div className="c_m_circle">
              {selectedMethod === "ai" && <img src={check_icon} alt="선택됨" />}
            </div>
          </div>
          <div className="c_m_r_bot">
            메뉴명과 예상 식재료비를 바탕으로 AI가 원가를 추정합니다.
            <br />
            빠르게 시작하거나 대략적인 수익성을 먼저 확인할 때 추천합니다.
          </div>
        </div>
      </div>

      {costMethodError && (
        <p className="costmethodselector_error" role="alert">
          원가 산정 방법을 선택해 주세요.
        </p>
      )}
    </div>
  );
};

export default CostMethodSelector;
