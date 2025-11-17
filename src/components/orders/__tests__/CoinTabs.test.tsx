import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/react"
import { CoinTabs } from "../../common/CoinTabs"
import { renderWithProviders } from "../../../test-utils"
import { useTradingPair } from "../../../providers/TradingPairContext"

const ActivePairViewer = () => {
  const { activePair } = useTradingPair()
  return <div data-testid="active-pair">{activePair}</div>
}

describe("CoinTabs", () => {
  it("should switch the active trading pair when a tab is clicked", async () => {
    renderWithProviders(
      <>
        <CoinTabs />
        <ActivePairViewer />
      </>
    )
    await userEvent.click(screen.getByRole("button", { name: "ETH/USDT" }))
    expect(screen.getByTestId("active-pair").textContent).toBe("ETH/USDT")
  })
})

