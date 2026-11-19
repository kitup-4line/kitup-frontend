import "./AiIngredientList.css";
import AiIngredientRowList from "./AiIngredientRowList";

const AiIngredientList = ({ ingredientNames, onDelete }) => {
  return (
    <div className="AiIngredientList_wrap">
      <div className="aiingredientlist_top">
        <h1>입력된 재료 목록</h1>
        <p>
          최대 20종까지 추가 가능합니다 (현재{" "}
          <span>{ingredientNames.length}종</span> 입력됨)
        </p>
      </div>
      <div className="aiingredientlist_main">
        {ingredientNames.map((name, index) => (
          <AiIngredientRowList
            key={name}
            name={name}
            index={index + 1}
            onDelete={() => onDelete(name)}
          />
        ))}
      </div>
    </div>
  );
};

export default AiIngredientList;
