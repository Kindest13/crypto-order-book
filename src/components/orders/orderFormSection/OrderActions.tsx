import { FC } from "react"
import { Button } from "../../ui/Button"

interface Props {
  onBuyClick: () => void
  onSellClick: () => void
}

export const OrderActions: FC<Props> = ({ onBuyClick, onSellClick }) => {
  return (
    <div className="lg:hidden text-center fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 safe-area-inset-bottom">
      <div className="flex gap-3 max-w-96 m-auto">
        <Button
          onClick={onBuyClick}
          variant="success"
          className="w-full text-lg font-semibold"
        >
          Buy
        </Button>
        <Button
          onClick={onSellClick}
          variant="danger"
          className="w-full text-lg font-semibold"
        >
          Sell
        </Button>
      </div>
    </div>
  )
}
