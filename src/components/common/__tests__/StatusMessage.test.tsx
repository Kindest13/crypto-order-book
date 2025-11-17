import { render, screen } from "@testing-library/react"
import { StatusMessage } from "../StatusMessage"
import { act } from "react"

jest.useFakeTimers()

describe("StatusMessage", () => {
  it("should render success message", () => {
    render(
      <StatusMessage status="success" message="Saved!" onClose={jest.fn()} />
    )

    const element = screen.getByRole("status")
    expect(element).toHaveTextContent("Saved!")
    expect(element.className).toMatch(/green/)
  })

  it("should render error message", () => {
    render(
      <StatusMessage status="error" message="Failed" onClose={jest.fn()} />
    )

    const element = screen.getByRole("status")
    expect(element).toHaveTextContent("Failed")
    expect(element.className).toMatch(/red/)
  })

  it("should call onClose after 4 seconds", () => {
    const onClose = jest.fn()

    render(
      <StatusMessage status="success" message="Saved!" onClose={onClose} />
    )

    act(() => {
      jest.advanceTimersByTime(4000)
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("should clear timeout on unmount", () => {
    const onClose = jest.fn()

    const { unmount } = render(
      <StatusMessage status="success" message="Saved!" onClose={onClose} />
    )

    const clearSpy = jest.spyOn(global, "clearTimeout")

    unmount()

    expect(clearSpy).toHaveBeenCalled()
  })
})
