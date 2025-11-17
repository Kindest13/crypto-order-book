import { FC, useEffect } from "react"
import { cn } from "../../utils/cn"

interface Props {
  status: "error" | "success"
  message: string
  onClose: () => void
}

export const StatusMessage: FC<Props> = ({ status, message, onClose }) => {
  useEffect(() => {
    const timerId = setTimeout(onClose, 4000)
    return () => clearTimeout(timerId)
  }, [onClose])

  return (
    <div
      role="status"
      aria-live="assertive"
      className={cn(
        "fixed top-2 right-0 md:right-2 z-[60] w-full max-w-xs rounded-lg border px-4 py-3 text-sm shadow-lg transition-opacity",
        status === "success"
          ? "bg-green-50 dark:bg-green-900 border-green-200 dark:text-green-200 text-green-800"
          : "bg-red-50 dark:bg-red-900 border-red-200 dark:text-red-200 text-red-800"
      )}
    >
      {message}
    </div>
  )
}
