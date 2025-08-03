"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Lightbulb, ArrowRight } from "lucide-react"

interface OnboardingTooltipProps {
  children: React.ReactNode
  title: string
  description: string
  step?: number
  totalSteps?: number
  isVisible?: boolean
  onNext?: () => void
  onClose?: () => void
  position?: "top" | "bottom" | "left" | "right"
}

export function OnboardingTooltip({
  children,
  title,
  description,
  step = 1,
  totalSteps = 1,
  isVisible = false,
  onNext,
  onClose,
  position = "bottom"
}: OnboardingTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setShowTooltip(isVisible)
  }, [isVisible])

  const handleClose = () => {
    setShowTooltip(false)
    onClose?.()
  }

  const handleNext = () => {
    onNext?.()
  }

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2"
  }

  return (
    <div className="relative inline-block">
      {children}
      {showTooltip && (
        <Card className={`absolute z-50 w-80 glass-morphism border-sky-500/30 ${positionClasses[position]}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Lightbulb className="h-5 w-5 text-sky-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-sky-100">{title}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-6 w-6 p-0 text-sky-300 hover:text-sky-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-sky-200/80 mb-3">{description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-sky-300/60">
                    Step {step} of {totalSteps}
                  </span>
                  {onNext && (
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="h-7 text-xs bg-sky-600 hover:bg-sky-700"
                    >
                      Next
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}