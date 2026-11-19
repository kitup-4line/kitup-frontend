import "./AiIngredientRowList.css";
import del_icon from "@/images/Onboarding/del_icon.svg";

const ingredientCategories = {
  "육류 · 가금류": [
    "소고기",
    "돼지고기",
    "닭고기",
    "닭가슴살",
    "닭다리살",
    "오리고기",
    "삼겹살",
    "목살",
  ],
  "채소 · 과일": [
    "양파",
    "대파",
    "쪽파",
    "마늘",
    "당근",
    "감자",
    "양배추",
    "상추",
    "버섯",
    "고추",
    "토마토",
    "오이",
    "배추",
  ],
  수산물: ["새우", "오징어", "연어", "고등어", "조개", "멸치", "참치"],
  "곡류 · 면류": ["쌀", "밀가루", "국수", "우동면", "파스타면", "당면", "떡"],
  "소스 · 양념": [
    "간장",
    "고추장",
    "된장",
    "마요네즈",
    "케첩",
    "소금",
    "설탕",
    "후추",
    "식용유",
    "소스",
    "고춧가루",
  ],
  "유제품 · 계란": ["우유", "치즈", "버터", "생크림", "계란", "달걀"],
};

const getIngredientCategory = (name) => {
  const ingredientName = (name ?? "").trim();

  if (!ingredientName) return "기타";

  return (
    Object.entries(ingredientCategories).find(([, ingredients]) =>
      ingredients.some((ingredient) => ingredientName.includes(ingredient)),
    )?.[0] ?? "기타"
  );
};

const AiIngredientRowList = ({ name, index, onDelete }) => {
  return (
    <div className="AiIngredientRowList_wrap">
      <div className="aiingredientrowlist_left">
        <p>{index}.</p>
        <div className="aiingredientrowlist_txt">
          <h1>{name}</h1>
          <p>
            <span>추천 분류: </span>
            {getIngredientCategory(name)}
          </p>
        </div>
      </div>

      <div
        className="aiingredientrowlist_right"
        role="button"
        tabIndex={0}
        onClick={onDelete}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onDelete();
          }
        }}
      >
        <img src={del_icon} alt="삭제" />
        <p>삭제</p>
      </div>
    </div>
  );
};

export default AiIngredientRowList;
