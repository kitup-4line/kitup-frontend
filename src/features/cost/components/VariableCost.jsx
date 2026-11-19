import "./VariableCost.css";

const VariableCost = ({
  ingredientCost,
  packagingCost,
  onIngredientChange,
  onPackagingChange,
  disabled,
}) => {
  return (
    <div className="VariableCost_wrap">
      <div className="variablecost_top">원가 항목 (변동비)</div>
      <div className="variablecost_bot">
        <div className="v_b_left">
          <p>
            식재료비 <span>*</span>
          </p>
          <div className="v_b_input">
            <input
              type="number"
              min="1"
              step="any"
              value={ingredientCost}
              onChange={(e) => onIngredientChange(e.target.value)}
              disabled={disabled}
            />
            <p>원</p>
          </div>
        </div>
        <div className="v_b_right">
          <p>
            포장 패키징비 <span>*</span>
          </p>
          <div className="v_b_input">
            <input
              type="number"
              min="0"
              step="any"
              value={packagingCost}
              onChange={(e) => onPackagingChange(e.target.value)}
              disabled={disabled}
            />
            <p>원</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableCost;
