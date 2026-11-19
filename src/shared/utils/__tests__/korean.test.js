import { describe, expect, it } from "vitest";
import { withObjectParticle } from "../korean";

describe("withObjectParticle", () => {
  it("받침이 있으면 '을'을 붙인다", () => {
    expect(withObjectParticle("간장")).toBe("간장을");
    expect(withObjectParticle("닭고기살")).toBe("닭고기살을");
  });

  it("받침이 없으면 '를'을 붙인다", () => {
    expect(withObjectParticle("양파")).toBe("양파를");
    expect(withObjectParticle("특제 소스")).toBe("특제 소스를");
  });

  it("한글로 끝나지 않으면 '을(를)'을 붙인다", () => {
    expect(withObjectParticle("BBQ")).toBe("BBQ을(를)");
    expect(withObjectParticle("치즈2")).toBe("치즈2을(를)");
  });
});
