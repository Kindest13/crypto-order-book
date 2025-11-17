import { FC, useEffect, useState } from "react"
import { X } from "lucide-react"
import { OrderForm } from "./OrderForm"
import { Button } from "../../ui/Button"
import { cn } from "../../../utils/cn"

interface Props {
  isOpen: boolean
  onClose: () => void
  initialSide: "buy" | "sell"
  currentSellPrice: string
  currentBuyPrice: string
}

export const OrderDialog: FC<Props> = ({
  isOpen,
  onClose,
  initialSide,
  currentSellPrice,
  currentBuyPrice,
}) => {
  const [visible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setIsVisible(true)
      setTimeout(() => setIsAnimating(true), 10)

      return () => {
        document.body.style.overflow = ""
      }
    } else {
      setIsAnimating(false)
      const timerId = setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = ""
      }, 300)

      return () => {
        clearTimeout(timerId)
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  if (!visible) return null

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300 ease-out mt-0",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out",
          isAnimating ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-end z-10">
          <Button onClick={onClose} variant="secondary" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <OrderForm
          currentBuyPrice={currentBuyPrice}
          currentSellPrice={currentSellPrice}
          initialSide={initialSide}
          displayTitle={false}
        />
      </div>
    </>
  )
}
