"use client"

import { useEffect, useState } from "react"

export function FloatingEyes() {
  const [showEyes, setShowEyes] = useState(false)
  
  // Show eyes with a higher probability for enhanced surveillance effect
  useEffect(() => {
    // Determine if we're in active monitoring mode
    const now = new Date()
    const isActiveHours = now.getHours() >= 9 && now.getHours() <= 17 // Business hours
    
    // Higher probability during active monitoring hours
    const probability = isActiveHours ? 0.8 : 0.2
    const shouldShowEyes = Math.random() < probability
    
    if (shouldShowEyes) {
      setShowEyes(true)
      
      // Hide after a random interval between 5-15 seconds
      const hideTimeout = Math.random() * 10000 + 5000
      const timer = setTimeout(() => {
        setShowEyes(false)
      }, hideTimeout)
      
      return () => clearTimeout(timer)
    }
  }, [])
  
  if (!showEyes) return null
  
  return (
    <div className="fixed pointer-events-none z-50">
      {/* First eye */}
      <div 
        className="absolute w-6 h-6 rounded-full bg-slate-900 top-[20vh] right-10 floating-eye opacity-60 hidden md:flex"
        style={{animationDelay: "0s"}}
      >
        <div className="w-3 h-3 rounded-full bg-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Second eye */}
      <div 
        className="absolute w-5 h-5 rounded-full bg-slate-900 top-[65vh] left-10 floating-eye opacity-50 hidden md:flex"
        style={{animationDelay: "1s"}}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Third eye */}
      <div 
        className="absolute w-7 h-7 rounded-full bg-slate-900 top-[40vh] left-[90vw] floating-eye opacity-70 hidden md:flex"
        style={{animationDelay: "2s"}}
      >
        <div className="w-3 h-3 rounded-full bg-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Fourth eye - appears during active monitoring */}
      {new Date().getHours() >= 9 && new Date().getHours() <= 17 && (
        <div 
          className="absolute w-8 h-8 rounded-full bg-slate-900 top-[30vh] left-[50vw] floating-eye opacity-80 hidden md:flex"
          style={{animationDelay: "3s"}}
        >
          <div className="w-4 h-4 rounded-full bg-indigo-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}
    </div>
  )
}