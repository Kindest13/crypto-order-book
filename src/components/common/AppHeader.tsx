import { type FC } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "../../providers/ThemeContext"
import { Button } from "../ui/Button"

export const AppHeader: FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Crypto Exchange
      </h1>
      <Button
        onClick={toggleTheme}
        variant="secondary"
        size="sm"
        className="flex items-center gap-2"
      >
        {theme === "dark" ? (
          <>
            <Sun className="w-4 h-4" />
            Light
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            Dark
          </>
        )}
      </Button>
    </div>
  )
}
