import { normalizeOrders } from "../normalizeOrders"

describe("normalizeOrders", () => {
   it("should return empty array when input is empty", () => {
    expect(normalizeOrders([], 5)).toEqual([])
  })
  it("should limit normalized orders to the requested size", () => {
    expect(
      normalizeOrders(
        [
          ["100", "1"],
          ["101", "2"],
          ["102", "3"],
        ],
        2
      ).length
    ).toBe(2)
  })

  it("should sort normalized orders by price descending", () => {
    expect(
      normalizeOrders(
        [
          ["100", "1"],
          ["105", "2"],
          ["101", "3"],
        ],
        3
      )[0].price
    ).toBe(105)
  })
})
