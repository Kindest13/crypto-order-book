import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OrderBookTable } from "../OrderBookTable"
import { OrderBookData } from "../../../types"
import { useTradingPair } from "../../../providers/TradingPairContext"
import { useOrderHistory } from "../../../providers/OrderHistoryContext"

jest.mock("../../../providers/TradingPairContext", () => ({
  useTradingPair: jest.fn(),
}))

jest.mock("../../../providers/OrderHistoryContext", () => ({
  useOrderHistory: jest.fn(),
}))

const mockUseTradingPair = useTradingPair as jest.Mock
const mockUseOrderHistory = useOrderHistory as jest.Mock
const setSelectedOrderMock = jest.fn()

const sampleData: OrderBookData = {
  lastUpdateId: 1,
  bids: [["102.00", "1.5"]],
  asks: [["101.00", "2.5"]],
}

beforeEach(() => {
  setSelectedOrderMock.mockReset()
  mockUseTradingPair.mockReturnValue({ activePair: "BTC/USDT" })
  mockUseOrderHistory.mockReturnValue({
    setSelectedOrder: setSelectedOrderMock,
  })
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

describe("OrderBookTable", () => {
  it("should call setSelectedOrder with the clicked ask order", async () => {
    render(<OrderBookTable data={sampleData} />)
    await userEvent.click(screen.getByText("101.00"))
    expect(setSelectedOrderMock).toHaveBeenCalledWith(
      { price: 101, quantity: 2.5 },
      "buy"
    )
  })

  it("should label the quantity column with the base currency", () => {
    mockUseTradingPair.mockReturnValue({ activePair: "ETH/USDT" })
    render(<OrderBookTable data={sampleData} />)
    expect(screen.getByText("Quantity (ETH)")).toBeInTheDocument()
  })
})
