import "./IngredientRowList.css";
import del_icon from "@/images/Onboarding/del_icon.svg";
import drop_icon from "@/images/Onboarding/drop_icon.svg";

const IngredientRowList = ({
  ingredient,
  onChange,
  onDelete,
  ingredientUnitOptions = [],
  showEmptyErrors = false,
}) => {
  const isEmpty = (field) =>
    showEmptyErrors && String(ingredient?.[field] ?? "").trim() === "";
  return (
    <div className="IngredientRowList_wrap" data-id={ingredient.id}>
      <input
        type="text"
        className={`ingredientrowlist_1 ${isEmpty("name") ? "field-error" : ""}`}
        data-field="name"
        value={ingredient?.name ?? ""}
        onChange={(e) => onChange?.("name", e.target.value)}
      />
      <input
        type="number"
        className={`ingredientrowlist_2 ${isEmpty("quantity") ? "field-error" : ""}`}
        data-field="quantity"
        value={ingredient?.quantity ?? ""}
        onChange={(e) => onChange?.("quantity", e.target.value)}
      />
      <div
        className={`ingredientrowlist_3 ${isEmpty("unit") ? "field-error" : ""}`}
      >
        <select
          name="unit"
          data-field="unit"
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
      <div
        className={`ingredientrowlist_4 ${isEmpty("price") ? "field-error" : ""}`}
      >
        <input
          type="text"
          inputMode="numeric"
          data-field="price"
          value={String(ingredient?.price ?? "").replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ",",
          )}
          onChange={(e) =>
            onChange?.("price", e.target.value.replace(/\D/g, ""))
          }
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
