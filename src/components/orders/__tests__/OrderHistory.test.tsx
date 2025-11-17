import { screen } from "@testing-library/react"
import { renderWithProviders } from "../../../test-utils"
import { OrderHistory } from "../OrderHistory"

describe("OrderHistory", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should render an empty state when there are no orders", () => {
    renderWithProviders(<OrderHistory />)
    expect(screen.getByText(/No orders yet/i)).toBeInTheDocument()
  })

  it("should render saved orders from storage", () => {
    localStorage.setItem(
      "orderHistory",
      JSON.stringify([
        {
          id: "1",
          pair: "BTC/USDT",
          side: "buy",
          type: "limit",
          price: 100,
          quantity: 0.5,
          notional: 50,
          timestamp: 1700000000000,
        },
      ])
    )
    renderWithProviders(<OrderHistory />)
    expect(screen.getByText("BTC/USDT")).toBeInTheDocument()
  })
})

