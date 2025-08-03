"use client"

import * as React from "react"
import { Volume2Icon, VolumeXIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AmbientMusicToggle() {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [volume, setVolume] = React.useState(0.3) // Default to 30% volume
  const audioContextRef = React.useRef<AudioContext | null>(null)
  const oscillatorsRef = React.useRef<OscillatorNode[]>([])
  const gainNodeRef = React.useRef<GainNode | null>(null)

  // Initialize Web Audio API for cyberpunk ambient sounds
  React.useEffect(() => {
    return () => {
      stopAmbientMusic()
    }
  }, [])

  const createAmbientMusic = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const audioContext = audioContextRef.current
    
    // Create main gain node for volume control
    const gainNode = audioContext.createGain()
    gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime) // Keep it subtle
    gainNode.connect(audioContext.destination)
    gainNodeRef.current = gainNode

    // Create multiple oscillators for a rich ambient texture
    const frequencies = [55, 82.5, 110, 165] // Low ambient frequencies
    const oscillators: OscillatorNode[] = []

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const oscGain = audioContext.createGain()
      
      oscillator.type = 'sawtooth'
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
      
      // Create subtle volume variations for ambience
      oscGain.gain.setValueAtTime(0.15 - index * 0.03, audioContext.currentTime)
      
      // Add slight frequency modulation for a "cyberpunk" feel
      const lfo = audioContext.createOscillator()
      const lfoGain = audioContext.createGain()
      lfo.frequency.setValueAtTime(0.1 + index * 0.05, audioContext.currentTime)
      lfo.type = 'sine'
      lfoGain.gain.setValueAtTime(2, audioContext.currentTime)
      
      lfo.connect(lfoGain)
      lfoGain.connect(oscillator.frequency)
      
      oscillator.connect(oscGain)
      oscGain.connect(gainNode)
      
      oscillator.start()
      lfo.start()
      
      oscillators.push(oscillator)
    })

    oscillatorsRef.current = oscillators
  }

  const stopAmbientMusic = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
        // Oscillator might already be stopped
      }
    })
    oscillatorsRef.current = []
    
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close()
      audioContextRef.current = null
    }
  }

  // Update volume when it changes
  React.useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        volume * 0.1, 
        audioContextRef.current.currentTime
      )
    }
  }, [volume])

  const toggleMusic = async () => {
    try {
      if (isPlaying) {
        stopAmbientMusic()
        setIsPlaying(false)
      } else {
        createAmbientMusic()
        setIsPlaying(true)
      }
    } catch (error) {
      console.warn("Audio playback failed:", error)
      setIsPlaying(false)
    }
  }

  const setVolumeLevel = (newVolume: number) => {
    setVolume(newVolume)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8">
          {isPlaying ? (
            <Volume2Icon className="h-4 w-4 text-orange-500" />
          ) : (
            <VolumeXIcon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle ambient music</span>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs">🎵 Ambient Music</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleMusic} className="flex items-center gap-2">
          {isPlaying ? (
            <>
              <VolumeXIcon className="h-4 w-4" />
              <span>Pause Music</span>
            </>
          ) : (
            <>
              <Volume2Icon className="h-4 w-4" />
              <span>Play Music</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Volume</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setVolumeLevel(0.1)} className="flex items-center gap-2">
          <span className="text-xs">🔉</span>
          <span>Low (10%)</span>
          {volume === 0.1 && <span className="ml-auto text-orange-500">•</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setVolumeLevel(0.3)} className="flex items-center gap-2">
          <span className="text-xs">🔊</span>
          <span>Medium (30%)</span>
          {volume === 0.3 && <span className="ml-auto text-orange-500">•</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setVolumeLevel(0.5)} className="flex items-center gap-2">
          <span className="text-xs">🔊</span>
          <span>High (50%)</span>
          {volume === 0.5 && <span className="ml-auto text-orange-500">•</span>}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-xs text-muted-foreground">
          🎃 Cyber ambient vibes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}