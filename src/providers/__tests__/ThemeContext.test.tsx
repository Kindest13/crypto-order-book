import { ReactElement } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeProvider, useTheme } from "../ThemeContext"

const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

const renderWithProvider = (ui: ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>)

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ""
  })

  it("should expose dark as the default theme", () => {
    renderWithProvider(<ThemeConsumer />)
    expect(screen.getByTestId("theme-value").textContent).toBe("dark")
  })

  it("should toggle theme to be light", async () => {
    renderWithProvider(<ThemeConsumer />)
    await userEvent.click(screen.getByText("toggle"))
    expect(document.documentElement.classList.contains("light")).toBe(true)
  })
})
