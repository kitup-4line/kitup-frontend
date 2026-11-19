import "./ContributionMargin.css";
import minus_icon from "@/images/Onboarding/minus_icon.svg";
import equal_icon from "@/images/Onboarding/equal_icon.svg";
import update_icon from "@/images/Onboarding/update_icon.svg";

const ContributionMargin = ({
  sellingPrice,
  ingredientCost,
  packagingCost,
  deliveryFee,
  commissionRate,
}) => {
  const selling = Number(sellingPrice) || 0;
  const ingredient = Number(ingredientCost) || 0;
  const packaging = Number(packagingCost) || 0;
  const delivery = Number(deliveryFee) || 0;
  const rate = Number(commissionRate) || 0;

  // 배달 수수료액: 판매가 × 수수료율 (원 단위 반올림)
  const commission = Math.round(selling * rate);

  // 배달 기준 총 변동비
  const variableCost = ingredient + packaging + delivery + commission;

  // 건당 공헌이익
  const margin = Math.round(selling - variableCost);
  const formatPrice = (value) => value.toLocaleString("ko-KR");

  return (
    <div className="ContributionMargin_wrap">
      <div className="contributionmargin_top">
        <p>건당 공헌이익 요약</p>
        <span>메뉴 1건 판매 시 발생하는 순수 공헌이익과 변동원가 구조</span>
      </div>
      <div className="contributionmargin_main">
        <div className="c_m_box01">
          <p>메뉴 판매가</p>
          <span>{formatPrice(selling)}원</span>
        </div>
        <div className="c_m_icon">
          <img src={minus_icon} alt="" />
        </div>
        <div className="c_m_box01">
          <p>변동비 합계</p>
          <span>{formatPrice(variableCost)}원</span>
        </div>
        <div className="c_m_icon">
          <img src={equal_icon} alt="" />
        </div>
        <div className="c_m_box02">
          <p>건당 공헌이익</p>
          <span>{formatPrice(margin)}원</span>
        </div>
      </div>
      <div className="contributionmargin_bot">
        <div className="c_b_1">
          <p>
            <span>변동비 상세 산출식</span> | 배달 수수료 (
            {formatPrice(commission)}원) + 식재료비 ({formatPrice(ingredient)}
            원) + 포장비 ({formatPrice(packaging)}원) + 배달비 (
            {formatPrice(delivery)}원)
          </p>
        </div>
        <div className="c_b_2">
          <img src={update_icon} alt="" />
          <p>
            원가를 수정하면 공헌이익과 예상 마진율이 실시간으로 자동 갱신됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContributionMargin;
