import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReconnaissanceExplained() {
  const reconTypes = [
    {
      id: "passive",
      name: "Passive Reconnaissance",
      emoji: "👁️",
      description: "Gathering intelligence without direct interaction with target systems",
      techniques: [
        {
          name: "OSINT",
          description: "Open Source Intelligence gathering from public sources",
          example: "Social media research, public records, domain information"
        },
        {
          name: "DNS Enumeration",
          description: "Discovering domain and subdomain information",
          example: "Finding subdomains and server information"
        },
        {
          name: "Social Engineering Research",
          description: "Researching targets through social and professional networks",
          example: "Employee research and organizational structure analysis"
        }
      ]
    },
    {
      id: "active",
      name: "Active Reconnaissance",
      emoji: "🔍",
      description: "Direct interaction with target systems to gather information",
      techniques: [
        {
          name: "Port Scanning",
          description: "Identifying open ports and running services",
          example: "Nmap scans to discover accessible network services"
        },
        {
          name: "Vulnerability Scanning",
          description: "Automated discovery of security weaknesses",
          example: "Automated tools to identify known vulnerabilities"
        },
        {
          name: "Network Mapping",
          description: "Discovering network topology and connected devices",
          example: "Mapping network infrastructure and device relationships"
        }
      ]
    }
  ]

  const protectionMethods = [
    {
      title: "Detection",
      emoji: "🚨",
      description: "Implement monitoring systems to identify reconnaissance activities",
      methods: ["Intrusion Detection Systems", "Security information and event management", "Network traffic analysis"]
    },
    {
      title: "Deception",
      emoji: "🎭",
      description: "Deploy honeypots and decoy systems to mislead attackers",
      methods: ["Honeypots", "False information injection", "Deceptive network topology"]
    },
    {
      title: "Limitation",
      emoji: "🛡️",
      description: "Reduce information exposure through security controls",
      methods: ["Minimal service exposure", "Information sanitization", "Strict access controls"]
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-400">🔍 Reconnaissance Explained</h2>
      
      <Card className="border-blue-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-blue-300">
            <span className="text-2xl mr-2">👁️</span>
            Understanding Threat Actor Intelligence Gathering
          </CardTitle>
          <CardDescription className="text-blue-200/70">
            How adversaries gather information about targets before launching cyber attacks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="passive" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-900/20">
              <TabsTrigger value="passive" className="data-[state=active]:bg-blue-700">Passive</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-700">Active</TabsTrigger>
            </TabsList>
            
            {reconTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{type.emoji}</span>
                  <h3 className="text-xl font-semibold text-blue-300">{type.name}</h3>
                </div>
                <p className="text-blue-100/70 mb-4">{type.description}</p>
                
                <div className="grid gap-3">
                  {type.techniques.map((technique, index) => (
                    <div key={index} className="p-3 bg-blue-950/30 rounded-lg border border-blue-800/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-blue-600 text-blue-300">
                          {technique.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-100/80 mb-1">{technique.description}</p>
                      <p className="text-xs text-blue-100/60">{technique.example}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-blue-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-blue-300">
            <span className="text-2xl mr-2">🛡️</span>
            Protection Against Reconnaissance
          </CardTitle>
          <CardDescription className="text-blue-200/70">
            Defensive strategies to prevent and detect reconnaissance activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {protectionMethods.map((method, index) => (
              <div key={index} className="p-4 bg-blue-950/30 rounded-lg border border-blue-800/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{method.emoji}</span>
                  <h4 className="font-semibold text-blue-300">{method.title}</h4>
                </div>
                <p className="text-sm text-blue-100/70 mb-3">{method.description}</p>
                <div className="space-y-1">
                  {method.methods.map((item, i) => (
                    <div key={i} className="text-xs text-blue-100/60">• {item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}