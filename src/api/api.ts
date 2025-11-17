import { OrderBookData, TradingPair } from "../types"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001"

export const getOrderbook = async (
  pair: TradingPair
): Promise<OrderBookData> => {
  const symbol = pair === "BTC/USDT" ? "btc" : "eth"
  const response = await fetch(`${API_BASE_URL}/api/orderbook/${symbol}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch orderbook: ${response.statusText}`)
  }

  return response.json()
}

export const sendTrade = async (tradeData: {
  pair: TradingPair
  side: "buy" | "sell"
  type: "limit" | "market"
  price: number
  quantity: number
  notional: number
}) => {
  const payload: any = {
    asset: tradeData.pair,
    side: tradeData.side,
    type: tradeData.type,
    quantity: tradeData.quantity,
    notional: tradeData.notional,
  }

  if (tradeData.type === "limit") {
    payload.price = tradeData.price
  }

  const response = await fetch(`${API_BASE_URL}/api/trade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `Failed to send trade: ${response.statusText}`
    )
  }

  return response.json()
}
