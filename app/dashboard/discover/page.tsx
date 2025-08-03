"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Smartphone, 
  Printer, 
  Camera, 
  Shield, 
  Shuffle, 
  Monitor,
  Globe,
  Building,
  Info,
  Lightbulb,
  Loader2
} from "lucide-react"

interface ShodanResult {
  ip: string
  port: number
  hostnames: string[]
  organization: string
  os: string
  country: string
  city: string
  timestamp: string
  preview: string
}

interface ExplorationCard {
  id: string
  title: string
  description: string
  query: string
  icon: React.ComponentType<{ className?: string }>
  explanation: string
  safetyLevel: 'safe' | 'moderate' | 'advanced'
}

const explorationCards: ExplorationCard[] = [
  {
    id: 'smart-devices',
    title: 'Smart Home Devices',
    description: 'Discover internet-connected smart devices like thermostats, smart speakers, and home automation systems',
    query: 'product:"Smart" OR "IoT" port:80,8080',
    icon: Smartphone,
    explanation: 'Smart devices are everyday gadgets connected to the internet. You might find smart thermostats, security systems, or even smart refrigerators. These devices often have web interfaces for remote control.',
    safetyLevel: 'safe'
  },
  {
    id: 'printers',
    title: 'Network Printers',
    description: 'Find printers and print servers accessible over the internet',
    query: 'printer OR "print server" port:631,9100',
    icon: Printer,
    explanation: 'Network printers allow printing from multiple computers. Some are accidentally exposed to the internet, which could allow anyone to see print jobs or even print documents remotely.',
    safetyLevel: 'safe'
  },
  {
    id: 'cameras',
    title: 'Security Cameras',
    description: 'Explore internet-connected security cameras and webcams',
    query: 'camera OR webcam OR "security camera" port:80,8080',
    icon: Camera,
    explanation: 'Security cameras help protect homes and businesses. However, some cameras are not properly secured and might be viewable by anyone on the internet. Always respect privacy!',
    safetyLevel: 'moderate'
  },
  {
    id: 'remote-access',
    title: 'Remote Access Services',
    description: 'Discover remote desktop and VPN services for accessing computers remotely',
    query: 'rdp OR vnc OR "remote desktop" port:3389,5900',
    icon: Monitor,
    explanation: 'Remote access tools let people control computers from far away, like working from home. These should always be properly secured with strong passwords and encryption.',
    safetyLevel: 'advanced'
  },
  {
    id: 'surprise-me',
    title: 'Surprise Me!',
    description: 'Discover random safe and interesting devices around the world',
    query: '',
    icon: Shuffle,
    explanation: 'Not sure what to explore? Let us pick something interesting and safe for you to discover. Perfect for learning about the variety of devices connected to the internet.',
    safetyLevel: 'safe'
  }
]

const randomQueries = [
  'apache port:80 country:US',
  'nginx port:443',
  'router country:CA',
  'server country:DE',
  'port:22 country:UK',
  'http country:AU'
]

export default function DiscoverPage() {
  const [results, setResults] = useState<ShodanResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState<string>('')

  const handleCardClick = async (card: ExplorationCard) => {
    setLoading(true)
    setError(null)
    setSelectedCard(card.id)
    setResults([])

    try {
      let query = card.query
      
      // Handle "Surprise Me" card with random query
      if (card.id === 'surprise-me') {
        query = randomQueries[Math.floor(Math.random() * randomQueries.length)]
      }

      setCurrentQuery(query)

      const response = await fetch('/api/shodan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 10 }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results')
      }

      setResults(data.results || [])
      
      // Show demo data notice if present
      if (data.note) {
        console.log('Demo mode:', data.note)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSafetyBadgeColor = (level: string) => {
    switch (level) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-300'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'advanced': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">
          🔍 Discover & Learn
        </h1>
      </div>

      {/* Onboarding Alert */}
      <Alert className="border-blue-500/30 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
        <Lightbulb className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 dark:text-blue-100">
          <span className="font-bold text-blue-700 dark:text-blue-300">Welcome to guided exploration!</span>
          {" "}Browse the internet safely using our curated search cards. Each card shows you different types of devices and explains what you're seeing in plain English. Perfect for learning about cybersecurity without technical jargon.
        </AlertDescription>
      </Alert>

      {/* Exploration Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {explorationCards.map((card) => {
          const IconComponent = card.icon
          return (
            <Card 
              key={card.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-blue-200 dark:border-blue-800 ${
                selectedCard === card.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                  : 'hover:bg-blue-50 dark:hover:bg-blue-950/30'
              }`}
              onClick={() => handleCardClick(card)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                  <Badge className={getSafetyBadgeColor(card.safetyLevel)}>
                    {card.safetyLevel}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                  {card.title}
                </CardTitle>
                <CardDescription className="text-blue-700 dark:text-blue-300">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  💡 {card.explanation}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-blue-900 dark:text-blue-100">
              Searching the internet for devices... This may take a moment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert className="border-red-500/30 bg-red-50 dark:bg-red-950">
          <AlertDescription className="text-red-900 dark:text-red-100">
            <span className="font-bold">Error:</span> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Discovery Results
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Found {results.length} devices for query: <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-800 dark:text-blue-200">{currentQuery}</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Popover>
                      <PopoverTrigger className="flex items-center gap-1 hover:text-blue-600">
                        IP Address <Info className="h-3 w-3" />
                      </PopoverTrigger>
                      <PopoverContent className="bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">IP Address</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Like a postal address for computers. Every device on the internet has a unique IP address so other computers can find it.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableHead>
                  <TableHead>
                    <Popover>
                      <PopoverTrigger className="flex items-center gap-1 hover:text-blue-600">
                        Port <Info className="h-3 w-3" />
                      </PopoverTrigger>
                      <PopoverContent className="bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Port</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Like different doors on a building. Port 80 is for websites, port 22 is for secure remote access, port 25 is for email. Each service uses different ports.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableHead>
                  <TableHead>
                    <Popover>
                      <PopoverTrigger className="flex items-center gap-1 hover:text-blue-600">
                        Organization <Info className="h-3 w-3" />
                      </PopoverTrigger>
                      <PopoverContent className="bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Organization</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          The company, university, or internet provider that owns this device. Could be "Comcast" for home users or "Amazon" for cloud servers.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableHead>
                  <TableHead>
                    <Popover>
                      <PopoverTrigger className="flex items-center gap-1 hover:text-blue-600">
                        Location <Info className="h-3 w-3" />
                      </PopoverTrigger>
                      <PopoverContent className="bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Location</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          The physical location where this device is located, based on its internet connection. This helps understand global internet infrastructure.
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-blue-900 dark:text-blue-100">
                      {result.ip}
                    </TableCell>
                    <TableCell className="text-blue-800 dark:text-blue-200">
                      {result.port}
                    </TableCell>
                    <TableCell className="text-blue-700 dark:text-blue-300">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {result.organization || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell className="text-blue-700 dark:text-blue-300">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {result.city && result.country ? `${result.city}, ${result.country}` : result.country || 'Unknown'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}