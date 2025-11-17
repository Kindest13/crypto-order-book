import { FC } from "react"
import { useOrderHistory } from "../../providers/OrderHistoryContext"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/Button"
import { cn } from "../../utils/cn"
import { formatPrice } from "../../utils/formatPrice"
import { formatQuantity } from "../../utils/formatQuantity"
import { formatDate } from "../../utils/formatDate"

export const OrderHistory: FC = () => {
  const { orders, clearOrders } = useOrderHistory()

  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order History
          </h2>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No orders yet</p>
          <p className="text-sm mt-2">Your order history will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Order History
        </h2>
        <Button
          onClick={clearOrders}
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Pair</th>
              <th className="px-4 py-3">Side</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:b  g-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(order.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {order.pair}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      order.side === "buy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {order.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  ${formatPrice(order.price)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  {formatQuantity(order.quantity)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                  ${formatPrice(order.notional)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
