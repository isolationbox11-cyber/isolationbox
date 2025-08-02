import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
}

export function LoadingSpinner({ className, size = "md", text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin text-orange-500", sizeClasses[size])} />
      {text && <span className="text-sm text-orange-300">{text}</span>}
    </div>
  )
}

interface ErrorDisplayProps {
  error: string
  className?: string
  retry?: () => void
}

export function ErrorDisplay({ error, className, retry }: ErrorDisplayProps) {
  return (
    <div className={cn("text-center p-4 rounded-lg border border-red-500/30 bg-red-950/20", className)}>
      <div className="text-red-400 mb-2">⚠️ Error</div>
      <p className="text-sm text-red-300 mb-3">{error}</p>
      {retry && (
        <button
          onClick={retry}
          className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      )}
    </div>
  )
}