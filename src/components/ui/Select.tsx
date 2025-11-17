import { FC, SelectHTMLAttributes } from "react"
import { cn } from "../../utils/cn"

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select: FC<Props> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full px-3 py-2 border rounded-lg",
          "bg-white dark:bg-gray-800",
          "border-gray-300 dark:border-gray-600",
          "text-gray-900 dark:text-white",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
