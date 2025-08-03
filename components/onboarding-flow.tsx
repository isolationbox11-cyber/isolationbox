"use client"

import { useState, useEffect } from "react"
import { OnboardingTooltip } from "./onboarding-tooltip"

interface OnboardingStep {
  target: string
  title: string
  description: string
}

const onboardingSteps: OnboardingStep[] = [
  {
    target: "dashboard-title",
    title: "Welcome to SalemCyberVault",
    description: "Your advanced cybersecurity monitoring platform. Let's take a quick tour of the main features."
  },
  {
    target: "security-score",
    title: "Security Score Overview",
    description: "Monitor your overall security posture. This score updates in real-time based on detected threats and system health."
  },
  {
    target: "threat-intelligence",
    title: "Threat Intelligence Feed",
    description: "Stay informed with the latest cybersecurity threats and advisories from our global intelligence network."
  },
  {
    target: "navigation-menu",
    title: "Navigation Menu",
    description: "Access different modules: Cyber Search, Discovery, Learning Mode, Live Map, Scanning, and Threat Analysis."
  }
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(-1)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding before
    const seenOnboarding = localStorage.getItem("salemcybervault-onboarding-seen")
    if (!seenOnboarding) {
      // Start onboarding after a short delay
      const timer = setTimeout(() => {
        setCurrentStep(0)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setHasSeenOnboarding(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setCurrentStep(-1)
    setHasSeenOnboarding(true)
    localStorage.setItem("salemcybervault-onboarding-seen", "true")
  }

  const handleClose = () => {
    handleComplete()
  }

  if (hasSeenOnboarding || currentStep === -1) {
    return null
  }

  const currentStepData = onboardingSteps[currentStep]

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={handleClose} />
      
      {/* Highlight target element */}
      <style jsx global>{`
        [data-onboarding-target="${currentStepData.target}"] {
          position: relative;
          z-index: 50;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.3), 0 0 20px rgba(14, 165, 233, 0.2);
          border-radius: 8px;
        }
      `}</style>
      
      {/* Tooltip positioned relative to target */}
      <div 
        className="absolute pointer-events-auto"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <OnboardingTooltip
          title={currentStepData.title}
          description={currentStepData.description}
          step={currentStep + 1}
          totalSteps={onboardingSteps.length}
          isVisible={true}
          onNext={handleNext}
          onClose={handleClose}
        >
          <div />
        </OnboardingTooltip>
      </div>
    </div>
  )
}