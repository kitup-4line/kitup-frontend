import "./IngredientRowList.css";
import del_icon from "@/images/Onboarding/del_icon.svg";
import drop_icon from "@/images/Onboarding/drop_icon.svg";

const IngredientRowList = ({
  ingredient,
  onChange,
  onDelete,
  ingredientUnitOptions = [],
}) => {
  return (
    <div className="IngredientRowList_wrap">
      <input
        type="text"
        className="ingredientrowlist_1"
        value={ingredient?.name ?? ""}
        onChange={(e) => onChange?.("name", e.target.value)}
      />
      <input
        type="number"
        className="ingredientrowlist_2"
        value={ingredient?.quantity ?? ""}
        onChange={(e) => onChange?.("quantity", e.target.value)}
      />
      <div className="ingredientrowlist_3">
        <select
          name="unit"
          value={ingredient?.unit ?? ""}
          onChange={(e) => onChange?.("unit", e.target.value)}
        >
          <option value="" disabled hidden></option>
          {ingredientUnitOptions.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </select>
        <img src={drop_icon} alt="" />
      </div>
      <div className="ingredientrowlist_4">
        <input
          type="number"
          value={ingredient?.price ?? ""}
          onChange={(e) => onChange?.("price", e.target.value)}
        />
        <p>원</p>
      </div>
      <div className="ingredientrowlist_5">
        <img src={del_icon} alt="" onClick={onDelete} />
      </div>
    </div>
  );
};

export default IngredientRowList;
