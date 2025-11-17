import { ReactElement, ReactNode } from "react"
import { render, RenderOptions } from "@testing-library/react"
import { ThemeProvider } from "./providers/ThemeContext"
import { TradingPairProvider } from "./providers/TradingPairContext"
import { OrderHistoryProvider } from "./providers/OrderHistoryContext"

const Providers = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>
    <TradingPairProvider>
      <OrderHistoryProvider>{children}</OrderHistoryProvider>
    </TradingPairProvider>
  </ThemeProvider>
)

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Providers as React.ComponentType, ...options })
