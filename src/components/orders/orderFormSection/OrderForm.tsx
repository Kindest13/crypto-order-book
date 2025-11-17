import { useState, useEffect, useRef, ChangeEvent, FC, FormEvent } from "react"
import { createPortal } from "react-dom"
import { Button } from "../../ui/Button"
import { Input } from "../../ui/Input"
import { Select } from "../../ui/Select"
import { sendTrade } from "../../../api/api"
import { useTradingPair } from "../../../providers/TradingPairContext"
import { useOrderHistory } from "../../../providers/OrderHistoryContext"
import { getNotional } from "../../../utils/getNotional"
import { StatusMessage } from "../../common/StatusMessage"

interface Props {
  currentSellPrice: string
  currentBuyPrice: string
  initialSide?: "buy" | "sell"
  displayTitle?: boolean
}

export const OrderForm: FC<Props> = ({
  currentSellPrice,
  currentBuyPrice,
  initialSide = "buy",
  displayTitle = true,
}) => {
  const { activePair } = useTradingPair()
  const { selectedOrder, selectedOrderSide, addOrder, clearSelectedOrder } =
    useOrderHistory()

  const [side, setSide] = useState<"buy" | "sell">(initialSide)
  const [type, setType] = useState<"limit" | "market">("limit")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)

  const baseCurrency = activePair.split("/")[0]
  const currentPrice = side === "buy" ? currentSellPrice : currentBuyPrice

  useEffect(() => {
    if (!selectedOrder || !selectedOrderSide) return

    const userQuantity = parseFloat(quantity) || 0
    const finalQuantity = Math.min(
      userQuantity,
      selectedOrder.quantity
    ).toString()

    setSide(selectedOrderSide)
    setType("limit")
    setPrice(selectedOrder.price.toFixed(2))
    setQuantity(finalQuantity)
    setShouldAutoSubmit(true)

    clearSelectedOrder()
  }, [selectedOrder, selectedOrderSide, quantity, clearSelectedOrder])

  useEffect(() => {
    if (!shouldAutoSubmit) return
    formRef.current?.requestSubmit()
    setShouldAutoSubmit(false)
  }, [shouldAutoSubmit])

  useEffect(() => {
    if (type === "market" || selectedOrder === null) {
      setPrice(Number(currentPrice).toFixed(2))
    }
  }, [activePair, currentPrice, side, type, selectedOrder])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    const priceValue =
      type === "limit" ? parseFloat(price) : parseFloat(currentPrice)
    const quantityValue = parseFloat(quantity)

    if (type === "limit" && priceValue <= 0) {
      return setStatusMessage({
        type: "error",
        message: "Please enter a valid price",
      })
    }
    if (!quantityValue || quantityValue <= 0) {
      return setStatusMessage({
        type: "error",
        message: "Please enter a valid quantity",
      })
    }

    setIsSubmitting(true)

    try {
      const notional = priceValue * quantityValue
      const order = {
        pair: activePair,
        side,
        type,
        price: priceValue,
        quantity: quantityValue,
        notional: notional,
      }

      await sendTrade(order)
      addOrder(order)

      setStatusMessage({
        type: "success",
        message: `${side.toUpperCase()} ${quantityValue} ${baseCurrency} success`,
      })
      setQuantity("")
    } catch (err) {
      setStatusMessage({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to submit order",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value)
    setStatusMessage(null)
  }
  const onQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value)
    setStatusMessage(null)
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 p-4 flex flex-col">
      {displayTitle && (
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Place Order
        </h2>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 flex-1"
      >
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={side === "buy" ? "success" : "secondary"}
            onClick={() => {
              setSide("buy")
              setStatusMessage(null)
            }}
          >
            Buy
          </Button>
          <Button
            type="button"
            variant={side === "sell" ? "danger" : "secondary"}
            onClick={() => {
              setSide("sell")
              setStatusMessage(null)
            }}
          >
            Sell
          </Button>
        </div>
        <Select
          label="Order Type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as "limit" | "market")
            setStatusMessage(null)
          }}
          options={[
            { value: "limit", label: "Limit" },
            { value: "market", label: "Market" },
          ]}
        />
        <Input
          label={type === "market" ? "Market Price (USDT)" : "Price (USDT)"}
          type="number"
          step="0.01"
          value={price}
          onChange={onPriceChange}
          disabled={type === "market"}
        />
        <Input
          label={`Quantity (${baseCurrency})`}
          type="number"
          step="0.0001"
          value={quantity}
          onChange={onQuantityChange}
        />
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Notional (USDT)
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ${getNotional(price, currentPrice, quantity, type)}
          </div>
        </div>
        <Button
          type="submit"
          variant={side === "buy" ? "success" : "danger"}
          disabled={isSubmitting}
          className="w-full mt-auto"
        >
          {isSubmitting
            ? "Submitting..."
            : `${side === "buy" ? "Buy" : "Sell"} ${baseCurrency}`}
        </Button>
      </form>
      {statusMessage &&
        createPortal(
          <StatusMessage
            status={statusMessage.type}
            message={statusMessage.message}
            onClose={() => setStatusMessage(null)}
          />,
          document.body
        )}
    </div>
  )
}
