import { screen, waitFor } from "@testing-library/react"
import { Home } from "../Home"
import { renderWithProviders } from "../../test-utils"
import { getOrderbook } from "../../api/api"

jest.mock("../../api/api", () => ({
  getOrderbook: jest.fn(),
  sendTrade: jest.fn(),
}))

jest.mock("react-apexcharts", () => () => <div data-testid="apex-chart" />)

const mockGetOrderbook = getOrderbook as jest.Mock

beforeEach(() => {
  mockGetOrderbook.mockReset()
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

describe("Home", () => {
  it("should show the loading indicator while fetching the order book", () => {
    mockGetOrderbook.mockReturnValue(new Promise(() => {}))
    renderWithProviders(<Home />)
    expect(screen.getByText(/Loading order book/i)).toBeInTheDocument()
  })

  it("should render the order book after data loads", async () => {
    mockGetOrderbook.mockResolvedValue({
      lastUpdateId: 1,
      bids: [["100.00", "1"]],
      asks: [["101.00", "2"]],
    })
    renderWithProviders(<Home />)

    expect(await screen.findByText(/Order Book/i)).toBeInTheDocument()
  })

  it("should show an error message when fetching fails", async () => {
    mockGetOrderbook.mockRejectedValue(new Error("Network error"))
    renderWithProviders(<Home />)
    expect(
      await screen.findByText(/Error Loading Order Book/i)
    ).toBeInTheDocument()
  })
})
