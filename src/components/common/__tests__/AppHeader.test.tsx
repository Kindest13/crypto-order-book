import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/react"
import { AppHeader } from "../AppHeader"
import { renderWithProviders } from "../../../test-utils"

describe("AppHeader", () => {
  it("should render a toggle button for switching to light mode", () => {
    renderWithProviders(<AppHeader />)
    expect(screen.getByRole("button", { name: /Light/i })).toBeInTheDocument()
  })

  it("should show dark mode label after toggling", async () => {
    renderWithProviders(<AppHeader />)

    await userEvent.click(screen.getByRole("button", { name: /Light/i }))
    expect(screen.getByRole("button", { name: /Dark/i })).toBeInTheDocument()
  })
})
