import { withObjectParticle } from "@/shared/utils/korean";

// 식재료 삭제 확인 문구. 이름을 아직 입력하지 않은 줄이면 "이 식재료"로 부른다.
export function getIngredientDeleteDescription(ingredients, targetId) {
  const name = ingredients.find((item) => item.id === targetId)?.name?.trim();
  return `${withObjectParticle(name || "이 식재료")} 삭제하시겠습니까?\n삭제된 식재료는 원가 계산에서 제외됩니다.`;
}
