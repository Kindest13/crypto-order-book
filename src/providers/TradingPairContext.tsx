import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react"
import { TradingPair } from "../types"

interface TradingPairContextType {
  activePair: TradingPair
  setActivePair: (pair: TradingPair) => void
}

const STORAGE_KEY = "tradingPair"

const TradingPairContext = createContext<TradingPairContextType | undefined>(
  undefined
)

export const TradingPairProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activePair, setActivePair] = useState<TradingPair>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved as TradingPair) || "BTC/USDT"
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activePair)
  }, [activePair])

  return (
    <TradingPairContext.Provider value={{ activePair, setActivePair }}>
      {children}
    </TradingPairContext.Provider>
  )
}

export const useTradingPair = () => {
  const context = useContext(TradingPairContext)
  if (context === undefined) {
    throw new Error("useTradingPair must be used within a TradingPairProvider")
  }
  return context
}
