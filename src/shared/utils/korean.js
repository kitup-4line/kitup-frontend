// 단어 끝 글자의 받침 유무에 따라 목적격 조사(을/를)를 붙인다.
// 한글이 아닌 글자로 끝나면(영문, 숫자 등) 판단할 수 없어 "을(를)"을 붙인다.
export function withObjectParticle(word) {
  const last = word.charCodeAt(word.length - 1);
  const isHangul = last >= 0xac00 && last <= 0xd7a3;
  if (!isHangul) return `${word}을(를)`;
  const hasFinalConsonant = (last - 0xac00) % 28 !== 0;
  return `${word}${hasFinalConsonant ? "을" : "를"}`;
}
