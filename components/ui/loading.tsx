// Loading and error UI components for consistent user experience

import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className = '', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-orange-500`} />
      {text && (
        <span className="text-sm text-orange-300/70">{text}</span>
      )}
    </div>
  )
}

// Full page loading component
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="border-orange-500/30 bg-gradient-to-r from-black to-orange-950">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">🎃</div>
            <LoadingSpinner size="lg" text="Summoning data from the digital realm..." />
            <p className="text-orange-300/70 text-sm">
              Salem Cyber Vault is brewing your request
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Card loading skeleton
export function CardLoading({ className = '' }: { className?: string }) {
  return (
    <Card className={`border-orange-500/30 bg-gradient-to-r from-black/80 to-orange-950/30 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-orange-900/30 rounded w-3/4"></div>
            <div className="h-4 bg-orange-900/30 rounded w-1/2"></div>
            <div className="h-20 bg-orange-900/30 rounded"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-orange-900/30 rounded w-16"></div>
              <div className="h-6 bg-orange-900/30 rounded w-20"></div>
            </div>
          </div>
          <div className="flex items-center justify-center pt-4">
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// List loading skeleton
export function ListLoading({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="animate-pulse p-3 border border-orange-900/30 rounded-lg bg-orange-950/20">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-orange-900/30 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-orange-900/30 rounded w-3/4"></div>
              <div className="h-3 bg-orange-900/30 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-orange-900/30 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Error alert component
interface ErrorAlertProps {
  error: string
  onRetry?: () => void
  className?: string
}

export function ErrorAlert({ error, onRetry, className = '' }: ErrorAlertProps) {
  return (
    <Alert className={`border-red-500/50 bg-gradient-to-r from-black to-red-950/30 ${className}`}>
      <AlertCircle className="h-4 w-4 text-red-400" />
      <AlertDescription className="flex items-center justify-between text-red-200">
        <span className="flex-1">{error}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-3 border-red-500/50 text-red-400 hover:bg-red-950/30"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Full page error component
interface PageErrorProps {
  error: string
  onRetry?: () => void
}

export function PageError({ error, onRetry }: PageErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="border-red-500/30 bg-gradient-to-r from-black to-red-950 max-w-md mx-4">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">💀</div>
            <h2 className="text-xl font-bold text-red-400">Digital Séance Interrupted</h2>
            <p className="text-red-200/80 text-sm">
              The spirits are not responding as expected...
            </p>
            <ErrorAlert error={error} onRetry={onRetry} />
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-orange-500/50 text-orange-400 hover:bg-orange-950/30"
              >
                Return to Salem Cyber Vault
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Inline error component for smaller areas
export function InlineError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="flex items-center justify-center p-4 text-center">
      <div className="space-y-2">
        <AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
        <p className="text-sm text-red-200/80">{error}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-red-500/50 text-red-400 hover:bg-red-950/30"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

// Empty state component
export function EmptyState({ 
  icon = "🔍", 
  title = "No results found", 
  description = "Try adjusting your search criteria",
  action
}: {
  icon?: string
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="space-y-4">
        <div className="text-4xl">{icon}</div>
        <h3 className="text-lg font-medium text-orange-300">{title}</h3>
        <p className="text-sm text-orange-200/70 max-w-sm">{description}</p>
        {action && <div className="pt-2">{action}</div>}
      </div>
    </div>
  )
}