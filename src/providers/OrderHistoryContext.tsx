import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react"
import { TradingPair } from "../types"

export interface Order {
  id: string
  pair: TradingPair
  side: "buy" | "sell"
  type: "limit" | "market"
  price: number
  quantity: number
  notional: number
  timestamp: number
}

type SelectedOrder = {
  price: number
  quantity: number
}

interface OrderHistoryContextType {
  orders: Order[]
  selectedOrder: SelectedOrder | null
  selectedOrderSide: "buy" | "sell" | null
  setSelectedOrder: (order: SelectedOrder, side: "buy" | "sell") => void
  clearSelectedOrder: () => void
  addOrder: (order: Omit<Order, "id" | "timestamp">) => void
  clearOrders: () => void
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(
  undefined
)

const STORAGE_KEY = "orderHistory"

export const OrderHistoryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null)
  const [selectedOrderSide, setSelectedOrderSide] = useState<
    "buy" | "sell" | null
  >(null)

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const addOrder = (orderData: Omit<Order, "id" | "timestamp" | "status">) => {
    const newOrder: Order = {
      ...orderData,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    }
    setOrders((prev) => [newOrder, ...prev])
  }

  const clearOrders = () => {
    setOrders([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleSetSelectedOrder = (
    order: SelectedOrder,
    side: "buy" | "sell"
  ) => {
    setSelectedOrder(order)
    setSelectedOrderSide(side)
  }

  const clearSelectedOrder = () => {
    setSelectedOrder(null)
    setSelectedOrderSide(null)
  }

  return (
    <OrderHistoryContext.Provider
      value={{
        orders,
        selectedOrder,
        selectedOrderSide,
        setSelectedOrder: handleSetSelectedOrder,
        clearSelectedOrder,
        addOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  )
}

export const useOrderHistory = () => {
  const context = useContext(OrderHistoryContext)
  if (context === undefined) {
    throw new Error(
      "useOrderHistory must be used within an OrderHistoryProvider"
    )
  }
  return context
}
