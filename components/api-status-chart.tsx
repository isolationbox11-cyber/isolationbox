"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, XCircle, Activity } from "lucide-react"

interface APIStatus {
  name: string
  status: 'online' | 'warning' | 'offline'
  responseTime: number
  uptime: number
  lastCheck: string
}

const apiStatuses: APIStatus[] = [
  {
    name: "Shodan",
    status: "online",
    responseTime: 145,
    uptime: 99.9,
    lastCheck: "2 mins ago"
  },
  {
    name: "VirusTotal",
    status: "online", 
    responseTime: 234,
    uptime: 99.8,
    lastCheck: "1 min ago"
  },
  {
    name: "GreyNoise",
    status: "warning",
    responseTime: 567,
    uptime: 98.5,
    lastCheck: "3 mins ago"
  },
  {
    name: "AbuseIPDB",
    status: "online",
    responseTime: 189,
    uptime: 99.7,
    lastCheck: "2 mins ago"
  },
  {
    name: "Alienvault OTX",
    status: "online",
    responseTime: 298,
    uptime: 99.2,
    lastCheck: "1 min ago"
  }
]

export function ApiStatusChart() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'default'
      case 'warning':
        return 'secondary'
      case 'offline':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return 'text-green-500'
    if (time < 500) return 'text-yellow-500'
    return 'text-red-500'
  }

  const onlineCount = apiStatuses.filter(api => api.status === 'online').length
  const totalApis = apiStatuses.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          API Status Monitor
          <Badge variant="outline" className="ml-auto">
            {onlineCount}/{totalApis} Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiStatuses.map((api, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              {getStatusIcon(api.status)}
              <div>
                <div className="font-medium">{api.name}</div>
                <div className="text-sm text-muted-foreground">
                  Last check: {api.lastCheck}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-sm font-medium ${getResponseTimeColor(api.responseTime)}`}>
                  {api.responseTime}ms
                </div>
                <div className="text-xs text-muted-foreground">
                  Response Time
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">
                  {api.uptime}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Uptime
                </div>
              </div>
              
              <Badge variant={getStatusColor(api.status) as any}>
                {api.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Health</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((onlineCount / totalApis) * 100)}%
            </span>
          </div>
          <Progress value={(onlineCount / totalApis) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}