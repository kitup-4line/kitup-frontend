import "./CostValidation.css";

const CostValidation = ({ costData }) => {
  return (
    <div className="CostValidation_wrap">
      <div className="costvalidation_top">
        <p>원가 검증 결과</p>
        <span>변동원가 총액 대비 공헌이익을 점검합니다.</span>
      </div>
      <div className="costvalidation_bot">
        <div className="c_b_left">
          <h1>총 원가 합계 (변동비)</h1>
          <h2>
            <span>{costData.delivery.total_cost.toLocaleString("ko-KR")}</span>
            원
          </h2>
          <p>식재료비 + 포장비 + 배달비 + 배달 수수료 합산</p>
        </div>
        <div className="c_b_right">
          <h1>예상 공헌 이익</h1>
          <h2>
            <span>
              {costData.delivery.contribution_margin.toLocaleString("ko-KR")}
            </span>
            원
          </h2>
          <p>
            판매가 {costData.selling_price.toLocaleString("ko-KR")}원 기준 건당
            공헌이익
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostValidation;
