import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle, Home } from "lucide-react"
import { Button } from "../../components/ui/Button"

export const ErrorPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Oops!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Something went wrong. The page you're looking for doesn't exist or an
          error occurred.
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="primary"
          className="w-full"
        >
          <Home className="w-4 h-4 mr-2 inline" />
          Go Home
        </Button>
      </div>
    </div>
  )
}
