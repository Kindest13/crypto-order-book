import { getNotional } from "../getNotional"

describe("getNotional", () => {
  it("should compute limit notional using the entered price", () => {
    expect(getNotional("100", "90", "2", "limit")).toBe("200.00")
  })

  it("should compute market notional using the current price", () => {
    expect(getNotional("", "150", "0.5", "market")).toBe("75.00")
  })
})

