import { type FC } from "react"
import { TradingPair } from "../../types"
import { cn } from "../../utils/cn"
import { useTradingPair } from "../../providers/TradingPairContext"

const pairs: TradingPair[] = ["BTC/USDT", "ETH/USDT"]

export const CoinTabs: FC = () => {
  const { activePair, setActivePair } = useTradingPair()

  return (
    <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {pairs.map((pair) => (
        <button
          key={pair}
          onClick={() => setActivePair(pair)}
          className={cn(
            "px-6 py-3 font-semibold text-sm transition-colors",
            "border-b-2",
            activePair === pair
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          )}
        >
          {pair}
        </button>
      ))}
    </div>
  )
}
