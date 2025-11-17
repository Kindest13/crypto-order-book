import { cn } from "../cn"

describe("cn", () => {
  it("should return merged string with only truthy classes", () => {
    expect(cn("btn", undefined, "active", "", null)).toBe("btn active")
  })
})

