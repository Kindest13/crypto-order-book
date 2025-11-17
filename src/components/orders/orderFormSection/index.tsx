import { FC, useState } from "react"
import { OrderForm } from "./OrderForm"
import { OrderActions } from "./OrderActions"
import { OrderDialog } from "./OrderDialog"

interface Props {
  currentSellPrice: string
  currentBuyPrice: string
}

export const OrderFormSection: FC<Props> = ({
  currentSellPrice,
  currentBuyPrice,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [side, setSide] = useState<"buy" | "sell">("buy")

  const handleBuyClick = () => {
    setSide("buy")
    setIsDialogOpen(true)
  }

  const handleSellClick = () => {
    setSide("sell")
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="hidden lg:block">
        <OrderForm
          currentSellPrice={currentSellPrice}
          currentBuyPrice={currentBuyPrice}
        />
      </div>
      <OrderActions onBuyClick={handleBuyClick} onSellClick={handleSellClick} />
      <OrderDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        initialSide={side}
        currentSellPrice={currentSellPrice}
        currentBuyPrice={currentBuyPrice}
      />
    </>
  )
}
