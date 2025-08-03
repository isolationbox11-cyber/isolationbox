"use client"

import { useEffect, useState } from "react"

export function FloatingEyes() {
  const [showEyes, setShowEyes] = useState(false)
  
  // Show eyes with a higher probability during Halloween season
  useEffect(() => {
    // Determine if we're in Halloween season (October)
    const now = new Date()
    const isHalloweenSeason = now.getMonth() === 9 // October is 9 in JS Date
    
    // Higher probability during Halloween season
    const probability = isHalloweenSeason ? 0.8 : 0.2
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
      {/* First eye - almond shaped */}
      <div 
        className="absolute w-8 h-5 bg-black top-[20vh] right-10 floating-eye opacity-60 hidden md:flex"
        style={{
          animationDelay: "0s",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          transform: "rotate(-15deg)"
        }}
      >
        <div 
          className="w-4 h-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(ellipse at center, #4169E1 0%, #1E3A8A 100%)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%"
          }}
        ></div>
      </div>
      
      {/* Second eye - almond shaped */}
      <div 
        className="absolute w-7 h-4 bg-black top-[65vh] left-10 floating-eye opacity-50 hidden md:flex"
        style={{
          animationDelay: "1s",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          transform: "rotate(20deg)"
        }}
      >
        <div 
          className="w-3 h-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(ellipse at center, #0080FF 0%, #1E40AF 100%)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%"
          }}
        ></div>
      </div>
      
      {/* Third eye - almond shaped */}
      <div 
        className="absolute w-9 h-6 bg-black top-[40vh] left-[90vw] floating-eye opacity-70 hidden md:flex"
        style={{
          animationDelay: "2s",
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          transform: "rotate(-10deg)"
        }}
      >
        <div 
          className="w-4 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(ellipse at center, #191970 0%, #0F172A 100%)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%"
          }}
        ></div>
      </div>
      
      {/* Fourth eye - appears only during Halloween month - almond shaped */}
      {new Date().getMonth() === 9 && (
        <div 
          className="absolute w-10 h-6 bg-black top-[30vh] left-[50vw] floating-eye opacity-80 hidden md:flex"
          style={{
            animationDelay: "3s",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            transform: "rotate(5deg)"
          }}
        >
          <div 
            className="w-5 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "radial-gradient(ellipse at center, #1E3A8A 0%, #312E81 100%)",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%"
            }}
          ></div>
        </div>
      )}
    </div>
  )
}