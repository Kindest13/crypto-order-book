import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { OrderForm } from "../OrderForm"
import { useTradingPair } from "../../../../providers/TradingPairContext"
import { useOrderHistory } from "../../../../providers/OrderHistoryContext"
import { sendTrade } from "../../../../api/api"

jest.mock("../../../../providers/TradingPairContext", () => ({
  useTradingPair: jest.fn(),
}))

jest.mock("../../../../providers/OrderHistoryContext", () => ({
  useOrderHistory: jest.fn(),
}))

jest.mock("../../../../api/api", () => ({
  sendTrade: jest.fn(),
}))

const mockUseTradingPair = useTradingPair as jest.Mock
const mockUseOrderHistory = useOrderHistory as jest.Mock
const mockSendTrade = sendTrade as jest.Mock

function createOrderHistoryValue(overrides = {}) {
  return {
    orders: [],
    selectedOrder: null,
    selectedOrderSide: null,
    addOrder: jest.fn(),
    clearSelectedOrder: jest.fn(),
    clearOrders: jest.fn(),
    setSelectedOrder: jest.fn(),
    ...overrides,
  }
}

beforeAll(() => {
  if (!HTMLFormElement.prototype.requestSubmit) {
    Object.defineProperty(HTMLFormElement.prototype, "requestSubmit", {
      value: function () {
        this.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true })
        )
      },
    })
  }
})

beforeEach(() => {
  jest.clearAllMocks()
  mockUseTradingPair.mockReturnValue({ activePair: "BTC/USDT" })
  mockUseOrderHistory.mockReturnValue(createOrderHistoryValue())
  mockSendTrade.mockResolvedValue({})
})

describe("OrderForm", () => {
  it("should show validation error when quantity is missing", async () => {
    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    await userEvent.click(screen.getByRole("button", { name: /Buy BTC/i }))

    expect(
      await screen.findByText("Please enter a valid quantity")
    ).toBeInTheDocument()
  })

  it("should show validation error for invalid limit price", async () => {
    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    const priceInput = screen.getAllByRole("spinbutton")[0]
    const qtyInput = screen.getAllByRole("spinbutton")[1]

    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, "0")
    await userEvent.type(qtyInput, "1")

    await userEvent.click(screen.getByRole("button", { name: /Buy BTC/i }))

    expect(
      await screen.findByText("Please enter a valid price")
    ).toBeInTheDocument()
  })

  it("should successfully submit a limit order with valid price and quantity", async () => {
    const orderHistory = createOrderHistoryValue()
    mockUseOrderHistory.mockReturnValue(orderHistory)

    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    const [priceInput, qtyInput] = screen.getAllByRole("spinbutton")

    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, "200")
    await userEvent.type(qtyInput, "0.5")

    await userEvent.click(screen.getByRole("button", { name: /Buy BTC/i }))

    await waitFor(() =>
      expect(mockSendTrade).toHaveBeenCalledWith({
        pair: "BTC/USDT",
        side: "buy",
        type: "limit",
        price: 200,
        quantity: 0.5,
        notional: 100,
      })
    )

    expect(orderHistory.addOrder).toHaveBeenCalled()
  })

  it("should fill price with sell price when switching to market mode", async () => {
    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    await userEvent.selectOptions(screen.getByRole("combobox"), "market")

    expect(screen.getAllByRole("spinbutton")[0]).toHaveValue(21000)
    expect(screen.getAllByRole("spinbutton")[0]).toBeDisabled()
  })

  it("should submit a market order using current market sell price", async () => {
    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    await userEvent.selectOptions(screen.getByRole("combobox"), "market")

    const qtyInput = screen.getAllByRole("spinbutton")[1]

    await userEvent.type(qtyInput, "1")
    await userEvent.click(screen.getByRole("button", { name: /Buy BTC/i }))

    await waitFor(() =>
      expect(mockSendTrade).toHaveBeenCalledWith({
        pair: "BTC/USDT",
        side: "buy",
        type: "market",
        price: 21000,
        quantity: 1,
        notional: 21000,
      })
    )
  })

  it("should update notional value when quantity changes", async () => {
    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    const qty = screen.getAllByRole("spinbutton")[1]

    await userEvent.type(qty, "2")

    expect(screen.getByText("$42000.00")).toBeInTheDocument()
  })

  it("should auto-fill and auto-submit when selectedOrder exists and quantity was provided", async () => {
    const initialHistory = createOrderHistoryValue()
    const selectedHistory = createOrderHistoryValue({
      selectedOrder: { price: 150, quantity: 5 },
      selectedOrderSide: "sell",
    })

    mockUseOrderHistory.mockReturnValue(initialHistory)

    const { rerender } = render(
      <OrderForm currentSellPrice="21000" currentBuyPrice="20900" />
    )

    const qtyInput = screen.getAllByRole("spinbutton")[1]
    await userEvent.type(qtyInput, "2")

    mockUseOrderHistory.mockReturnValue(selectedHistory)
    rerender(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    await waitFor(() => expect(mockSendTrade).toHaveBeenCalled())
    expect(selectedHistory.clearSelectedOrder).toHaveBeenCalled()
  })

  it("should auto-fill and fail to auto-submit when selectedOrder exists but quantity was not provided", async () => {
    const initialHistory = createOrderHistoryValue()
    const selectedHistory = createOrderHistoryValue({
      selectedOrder: { price: 150, quantity: 5 },
      selectedOrderSide: "sell",
    })

    mockUseOrderHistory.mockReturnValue(initialHistory)

    const { rerender } = render(
      <OrderForm currentSellPrice="21000" currentBuyPrice="20900" />
    )

    mockUseOrderHistory.mockReturnValue(selectedHistory)
    rerender(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    await waitFor(() => expect(mockSendTrade).not.toHaveBeenCalled())
  })

  it("should show success status message after successfull submit", async () => {
    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    const [priceInput, qtyInput] = screen.getAllByRole("spinbutton")

    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, "200")
    await userEvent.type(qtyInput, "1")

    await userEvent.click(screen.getByRole("button", { name: /Buy BTC/i }))

    expect(await screen.findByText(/BUY 1 BTC success/i)).toBeInTheDocument()
  })

  it("should show error status message on API failure", async () => {
    mockSendTrade.mockRejectedValue(new Error("Server is down"))

    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    const [priceInput, qtyInput] = screen.getAllByRole("spinbutton")

    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, "200")
    await userEvent.type(qtyInput, "1")

    await userEvent.click(screen.getByRole("button", { name: /Buy BTC/i }))

    expect(await screen.findByText("Server is down")).toBeInTheDocument()
  })

  it("should reset quantity after successful order", async () => {
    render(<OrderForm currentSellPrice="21000" currentBuyPrice="20900" />)

    const [priceInput, qtyInput] = screen.getAllByRole("spinbutton")

    await userEvent.clear(priceInput)
    await userEvent.type(priceInput, "200")
    await userEvent.type(qtyInput, "2")

    await userEvent.click(screen.getByRole("button", { name: /Buy BTC/i }))

    await waitFor(() => expect(qtyInput).toHaveValue(null))
  })
})
