import { useRef, useState } from "react";
import "./IngredientAddForm.css";
import plus02_icon from "@/images/Onboarding/plus02_icon.svg";

const IngredientAddForm = ({ onAdd, disabled = false }) => {
  const [ingredientName, setIngredientName] = useState("");
  const inputRef = useRef(null);
  const recommendedIngredients = ["대파", "마늘", "참기름", "설탕"];
  const handleAdd = (name) => {
    if (onAdd(name)) {
      setIngredientName("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="IngredientAddForm_wrap">
      <div className="ingredientaddform_top">
        <p>재료 추가</p>
        <span>
          한 번에 하나씩 재료를 입력하거나 주요 식자재를 순서대로 추가해주세요.
        </span>
      </div>
      <div className="ingredientaddform_main">
        <p>
          재료명 <span>*</span>
        </p>
        <div className="i_m_add">
          <input
            type="text"
            placeholder="추가할 식재료 이름을 입력하세요..."
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            disabled={disabled}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleAdd(ingredientName);
              }
            }}
          />
          <button
            type="button"
            onClick={() => handleAdd(ingredientName)}
            disabled={disabled}
          >
            <img src={plus02_icon} alt="plus" />
            <p>재료 추가</p>
          </button>
        </div>
      </div>
      <div className="ingredientaddform_bot">
        <span>자주 쓰는 재료:</span>
        {recommendedIngredients.map((ingredient) => (
          <button
            key={ingredient}
            type="button"
            onClick={() => handleAdd(ingredient)}
            disabled={disabled}
          >
            + {ingredient}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IngredientAddForm;
