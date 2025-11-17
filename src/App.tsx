import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./providers/ThemeContext"
import { TradingPairProvider } from "./providers/TradingPairContext"
import { OrderHistoryProvider } from "./providers/OrderHistoryContext"
import { ErrorBoundary } from "./components/common/ErrorBoundary"
import { Home } from "./pages/Home"
import { ErrorPage } from "./pages/error/ErrorPage"
import "./index.css"

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TradingPairProvider>
          <OrderHistoryProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Router>
          </OrderHistoryProvider>
        </TradingPairProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
