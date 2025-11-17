import { getOrderbook, sendTrade } from "../api"

const originalFetch = global.fetch

describe("api", () => {
  const mockFetch = jest.fn()

  beforeEach(() => {
    mockFetch.mockReset()
    global.fetch = mockFetch
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  describe("getOrderbook", () => {
    it("should fetch BTC orderbook", async () => {
      const payload = { lastUpdateId: 1, bids: [], asks: [] }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(payload),
      })

      await expect(getOrderbook("BTC/USDT")).resolves.toEqual(payload)

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/orderbook/btc"
      )
    })

    it("should fetch ETH orderbook", async () => {
      const payload = { lastUpdateId: 2, bids: [], asks: [] }

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(payload),
      })

      await expect(getOrderbook("ETH/USDT")).resolves.toEqual(payload)

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/orderbook/eth"
      )
    })

    it("should throw when response is not ok", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        statusText: "Server Error",
      })

      await expect(getOrderbook("ETH/USDT")).rejects.toThrow(
        "Failed to fetch orderbook: Server Error"
      )
    })
  })

  describe("sendTrade", () => {
    it("should send limit order with price", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      })

      await sendTrade({
        pair: "BTC/USDT",
        side: "buy",
        type: "limit",
        price: 100,
        quantity: 1,
        notional: 100,
      })

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/api/trade",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            asset: "BTC/USDT",
            side: "buy",
            type: "limit",
            quantity: 1,
            notional: 100,
            price: 100,
          }),
        })
      )
    })

    it("should omit price for market order", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      })

      await sendTrade({
        pair: "BTC/USDT",
        side: "sell",
        type: "market",
        price: 0,
        quantity: 2,
        notional: 200,
      })

      const [, requestInit] = mockFetch.mock.calls.at(-1) ?? []
      const parsedBody = JSON.parse((requestInit?.body as string) ?? "{}")

      expect(parsedBody.price).toBeUndefined()
    })

    it("should throw with API error message", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: "Insufficient balance" }),
      })

      await expect(
        sendTrade({
          pair: "ETH/USDT",
          side: "sell",
          type: "market",
          price: 0,
          quantity: 3,
          notional: 300,
        })
      ).rejects.toThrow("Insufficient balance")
    })

    it("should throw generic error when no error message returned", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: jest.fn().mockRejectedValue(new Error("invalid json")),
        statusText: "Bad Request",
      })

      await expect(
        sendTrade({
          pair: "ETH/USDT",
          side: "sell",
          type: "limit",
          price: 100,
          quantity: 3,
          notional: 300,
        })
      ).rejects.toThrow("Failed to send trade: Bad Request")
    })
  })
})
