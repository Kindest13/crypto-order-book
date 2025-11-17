import { ReactElement } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TradingPairProvider, useTradingPair } from "../TradingPairContext"

const TradingPairConsumer = () => {
  const { activePair, setActivePair } = useTradingPair()

  return (
    <div>
      <span data-testid="active-pair">{activePair}</span>
      <button onClick={() => setActivePair("ETH/USDT")}>change</button>
    </div>
  )
}

const renderWithProvider = (ui: ReactElement) =>
  render(<TradingPairProvider>{ui}</TradingPairProvider>)

describe("TradingPairContext", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("should expose BTC/USDT as the default pair", () => {
    renderWithProvider(<TradingPairConsumer />)

    expect(screen.getByTestId("active-pair")).toHaveTextContent("BTC/USDT")
  })

  it("should expose ETH/USDT the newly selected pair", async () => {
    renderWithProvider(<TradingPairConsumer />)

    await userEvent.click(screen.getByRole("button", { name: /change/i }))

    expect(screen.getByTestId("active-pair")).toHaveTextContent("ETH/USDT")
    expect(localStorage.getItem("tradingPair")).toBe("ETH/USDT")
  })
})
