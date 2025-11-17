import { useState, useEffect, useCallback, type FC } from "react"
import { OrderBookData, TradingPair } from "../types"
import { CoinTabs } from "../components/common/CoinTabs"
import { OrderBookTable } from "../components/orders/OrderBookTable"
import { OrderBookChart } from "../components/orders/OrderBookChart"
import { OrderFormSection } from "../components/orders/orderFormSection"
import { OrderHistory } from "../components/orders/OrderHistory"
import { AppHeader } from "../components/common/AppHeader"
import { getOrderbook } from "../api/api"
import { useTradingPair } from "../providers/TradingPairContext"
import { Button } from "../components/ui/Button"

export const Home: FC = () => {
  const { activePair } = useTradingPair()
  const [orderBookData, setOrderBookData] = useState<OrderBookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrderBook = useCallback(async (pair: TradingPair) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getOrderbook(pair)
      setOrderBookData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order book")
      console.error("Error fetching order book:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrderBook(activePair)
  }, [activePair, fetchOrderBook])

  if (loading && !orderBookData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading order book...
          </p>
        </div>
      </div>
    )
  }

  if (error && !orderBookData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error Loading Order Book
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => fetchOrderBook(activePair)} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!orderBookData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
      <AppHeader />
      <CoinTabs />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-8 gap-6">
          <div className="lg:col-span-2 col-span-full max-h-[calc(100vh-170px)] border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
            <OrderBookTable data={orderBookData} />
          </div>
          <div className="lg:col-span-4 col-span-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
            <OrderBookChart data={orderBookData} />
          </div>
          <div className="lg:col-span-2 col-span-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
            <OrderFormSection
              currentSellPrice={orderBookData.asks[0][0]}
              currentBuyPrice={orderBookData.bids[0][0]}
            />
          </div>
        </div>
        <div className="mt-6 max-h-96 overflow-auto">
          <OrderHistory />
        </div>
      </div>
    </div>
  )
}
