import "./SalesCondition.css";

const SalesCondition = ({ sellingPrice, onChange, disabled }) => {
  return (
    <div className="SalesCondition_wrap">
      <div className="salescondition_top">
        <p>판매 조건</p>
        <span>주문 발생 채널별 단가 및 수수료율</span>
      </div>
      <div className="salescondition_bot">
        <input
          type="number"
          min="1"
          step="1"
          value={sellingPrice}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <p>원</p>
      </div>
    </div>
  );
};

export default SalesCondition;
