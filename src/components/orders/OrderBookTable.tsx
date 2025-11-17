import { FC, useEffect, useRef } from "react"
import { OrderBookData } from "../../types"
import { cn } from "../../utils/cn"
import { useTradingPair } from "../../providers/TradingPairContext"
import { useOrderHistory } from "../../providers/OrderHistoryContext"
import { normalizeOrders } from "../../utils/normalizeOrders"
import { formatPrice } from "../../utils/formatPrice"
import { formatQuantity } from "../../utils/formatQuantity"

interface Props {
  data: OrderBookData
  maxRows?: number
}

export const OrderBookTable: FC<Props> = ({ data, maxRows = 20 }) => {
  const spreadRef = useRef<HTMLTableRowElement | null>(null)
  const { activePair } = useTradingPair()
  const { setSelectedOrder } = useOrderHistory()
  const baseCurrency = activePair.split("/")[0]

  const bids = normalizeOrders(data.bids, maxRows)
  const asks = normalizeOrders(data.asks, maxRows)

  const handleRowClick = (
    order: { price: number; quantity: number },
    side: "buy" | "sell"
  ) => {
    setSelectedOrder(order, side)
  }

  useEffect(() => {
    if (spreadRef.current) {
      spreadRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Order Book
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800">
            <tr className="bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
              <th className="px-4 py-2 text-left">Price (USDT)</th>
              <th className="px-4 py-2 text-right">
                Quantity ({baseCurrency})
              </th>
            </tr>
          </thead>

          <tbody>
            {asks.map((ask, index) => (
              <tr
                key={`ask-${index}`}
                onClick={() => handleRowClick(ask, "buy")}
                className={cn(
                  "hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800"
                )}
              >
                <td className="px-4 py-1.5 text-red-600 dark:text-red-400 font-mono text-sm">
                  {formatPrice(ask.price)}
                </td>
                <td className="px-4 py-1.5 text-right text-gray-900 dark:text-gray-100 font-mono text-sm">
                  {formatQuantity(ask.quantity)}
                </td>
              </tr>
            ))}
            {/* Spread row */}
            {bids.length > 0 && (
              <tr
                ref={spreadRef}
                className="bg-gray-50 dark:bg-gray-800 border-y border-gray-300 dark:border-gray-700"
              >
                <td colSpan={2} className="px-4 py-2 text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(bids[0].price)}
                  </div>
                </td>
              </tr>
            )}
            {bids.map((bid, index) => (
              <tr
                key={`bid-${index}`}
                onClick={() => handleRowClick(bid, "sell")}
                className={cn(
                  "hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800"
                )}
              >
                <td className="px-4 py-1.5 text-green-600 dark:text-green-400 font-mono text-sm">
                  {formatPrice(bid.price)}
                </td>
                <td className="px-4 py-1.5 text-right text-gray-900 dark:text-gray-100 font-mono text-sm">
                  {formatQuantity(bid.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
