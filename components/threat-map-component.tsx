"use client"

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { ThreatData, getThreatTypeColor } from '@/lib/threat-data-service'

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface ThreatMapProps {
  threats: ThreatData[]
  onThreatSelect: (threat: ThreatData | null) => void
}

const ThreatMapComponent = ({ threats, onThreatSelect }: ThreatMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current, {
        center: [20, 0], // Center on equator
        zoom: 2,
        zoomControl: true,
        attributionControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true
      })

      // Add dark tile layer for spooky theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(leafletMapRef.current)

      // Initialize markers layer
      markersRef.current = L.layerGroup().addTo(leafletMapRef.current)
    }

    return () => {
      // Cleanup on unmount
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!leafletMapRef.current || !markersRef.current) return

    // Clear existing markers
    markersRef.current.clearLayers()

    // Add new markers for each threat
    threats.forEach(threat => {
      const color = getThreatTypeColor(threat.severity)
      
      // Create custom icon based on threat severity
      const icon = L.divIcon({
        className: 'threat-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            animation: pulse-${threat.severity} 2s infinite;
          ">
            ${threat.emoji}
          </div>
          <style>
            @keyframes pulse-critical {
              0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 ${color}40; }
              50% { transform: scale(1.1); box-shadow: 0 0 0 10px ${color}20; }
            }
            @keyframes pulse-high {
              0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 ${color}30; }
              50% { transform: scale(1.05); box-shadow: 0 0 0 8px ${color}15; }
            }
            @keyframes pulse-medium {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.02); }
            }
            @keyframes pulse-low {
              0%, 100% { transform: scale(1); }
            }
          </style>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker([threat.lat, threat.lng], { icon })
        .bindPopup(`
          <div style="
            background: linear-gradient(135deg, #1a1a1a 0%, #2d1b0f 100%);
            border: 1px solid #ea580c;
            border-radius: 8px;
            padding: 12px;
            color: #fed7aa;
            font-family: ui-sans-serif, system-ui, sans-serif;
            min-width: 250px;
          ">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 16px;">${threat.emoji}</span>
              <h3 style="margin: 0; color: #fdba74; font-size: 14px; font-weight: 600;">
                ${threat.threatType}
              </h3>
              <span style="
                background: ${color};
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
              ">
                ${threat.severity}
              </span>
            </div>
            
            <div style="margin-bottom: 8px; font-size: 12px;">
              <div style="margin-bottom: 4px;">
                <strong>Location:</strong> ${threat.city}, ${threat.country}
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Time:</strong> ${threat.timestamp.toLocaleTimeString()}
              </div>
              ${threat.ip ? `<div style="margin-bottom: 4px;"><strong>IP:</strong> <code style="background: #374151; padding: 2px 4px; border-radius: 3px;">${threat.ip}</code></div>` : ''}
            </div>
            
            <div style="font-size: 11px; color: #fcd34d; margin-bottom: 8px;">
              ${threat.description}
            </div>
            
            <button onclick="window.selectThreat && window.selectThreat('${threat.id}')" style="
              background: #ea580c;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              cursor: pointer;
              width: 100%;
            ">
              View Details
            </button>
          </div>
        `, {
          maxWidth: 300,
          className: 'threat-popup'
        })

      marker.on('click', () => {
        onThreatSelect(threat)
      })

      markersRef.current?.addLayer(marker)
    })

    // Create global function for popup button clicks
    ;(window as any).selectThreat = (threatId: string) => {
      const threat = threats.find(t => t.id === threatId)
      if (threat) {
        onThreatSelect(threat)
      }
    }

  }, [threats, onThreatSelect])

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="h-96 rounded-lg border-2 border-orange-800/20 bg-black"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map overlay with threat count */}
      <div className="absolute top-4 right-4 bg-black/80 border border-orange-800/30 rounded-lg p-2 text-orange-300 text-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span>{threats.length} Active Threats</span>
        </div>
      </div>
      
      {/* Loading overlay when no threats */}
      {threats.length === 0 && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="text-center text-orange-300">
            <div className="text-4xl mb-2 animate-spin">👁️</div>
            <p>Scanning for threats...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThreatMapComponent