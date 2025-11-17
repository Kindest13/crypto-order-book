import { ReactElement } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OrderHistoryProvider, useOrderHistory } from "../OrderHistoryContext"

const TestComponent = () => {
  const { orders, addOrder, clearOrders } = useOrderHistory()

  const add = () =>
    addOrder({
      pair: "BTC/USDT",
      side: "buy",
      type: "limit",
      price: 100,
      quantity: 1,
      notional: 100,
    })

  return (
    <div>
      <span data-testid="order-count">{orders.length}</span>
      <button onClick={add}>add-order</button>
      <button onClick={clearOrders}>clear-orders</button>
    </div>
  )
}

const renderWithProvider = (ui: ReactElement) =>
  render(<OrderHistoryProvider>{ui}</OrderHistoryProvider>)

describe("OrderHistoryContext", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should add new orders to the list", async () => {
    renderWithProvider(<TestComponent />)
    await userEvent.click(screen.getByText("add-order"))
    expect(screen.getByTestId("order-count")).toHaveTextContent("1")
  })

  it("should clear orders from local storage", async () => {
    renderWithProvider(<TestComponent />)
    await userEvent.click(screen.getByText("add-order"))
    await userEvent.click(screen.getByText("clear-orders"))
    expect(localStorage.getItem("orderHistory")).toBe("[]")
  })
})

