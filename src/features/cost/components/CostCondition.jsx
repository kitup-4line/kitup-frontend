import "./CostCondition.css";
import info_icon from "@/images/Onboarding/info_icon.svg";

const CostCondition = ({ costData }) => {
  return (
    <div className="CostCondition_wrap">
      <div className="costcondition_top">
        <p>예상 원가 및 판매 조건</p>
        <span>메뉴 기본 설정 기준 판매 조건 및 세부 원가 항목</span>
      </div>
      <div className="costcondition_main">
        <div className="c_m_top">
          <p>예상 판매가</p>
          <div className="c_m_t_txt">
            <p>
              <span>{costData.selling_price.toLocaleString("ko-KR")}</span>원
            </p>
          </div>
        </div>
        <div className="c_m_bot">
          <div className="c_m_b_box">
            <div className="c_m_b_box_top">
              <p>식재료비</p>
              <span>분석 원가</span>
            </div>
            <div className="c_m_b_box_bot">
              <p>
                <span>
                  {costData.total_ingredient_cost.toLocaleString("ko-KR")}
                </span>
                원
              </p>
            </div>
          </div>
          <div className="c_m_b_box">
            <div className="c_m_b_box_top">
              <p>포장비</p>
              <span>용기·부자재</span>
            </div>
            <div className="c_m_b_box_bot">
              <p>
                <span>{costData.packaging_cost.toLocaleString("ko-KR")}</span>원
              </p>
            </div>
          </div>
          <div className="c_m_b_box">
            <div className="c_m_b_box_top">
              <p>배달비</p>
              <span>배달 대행 운임</span>
            </div>
            <div className="c_m_b_box_bot">
              <p>
                <span>{costData.delivery_fee.toLocaleString("ko-KR")}</span>원
              </p>
            </div>
          </div>
          <div className="c_m_b_box2">
            <div className="c_m_b_box_top">
              <p>배달 수수료율</p>
              <span>중개 수수료</span>
            </div>
            <div className="c_m_b_box_bot">
              <p>
                <span>
                  {(costData.delivery_commission_rate * 100).toLocaleString(
                    "ko-KR",
                  )}
                </span>
                %
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="costcondition_bot">
        <img src={info_icon} alt="" />
        <p>
          식재료비는 AI 분석 결과이며, 실제 구매 시 납품 단가에 따라 변동이 있을
          수 있습니다. 원가가 확정되면 직접 수정할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default CostCondition;
