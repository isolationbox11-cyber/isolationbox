import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ReconnaissanceExplained() {
  const reconTypes = [
    {
      id: "passive",
      name: "Passive Reconnaissance",
      emoji: "👁️",
      description: "Like watching Salem from afar without being noticed",
      techniques: [
        {
          name: "OSINT",
          description: "Gathering public information like reading town notices",
          example: "Social media research, public records"
        },
        {
          name: "DNS Enumeration",
          description: "Learning about the town's layout from public maps",
          example: "Finding subdomains and server information"
        },
        {
          name: "Social Engineering Research",
          description: "Learning about people by listening to gossip",
          example: "Researching employees and company culture"
        }
      ]
    },
    {
      id: "active",
      name: "Active Reconnaissance",
      emoji: "🔍",
      description: "Like asking direct questions or testing the town gates",
      techniques: [
        {
          name: "Port Scanning",
          description: "Testing which doors and windows are unlocked",
          example: "Nmap scans to find open services"
        },
        {
          name: "Vulnerability Scanning",
          description: "Looking for weak spots in the town's defenses",
          example: "Automated tools to find security flaws"
        },
        {
          name: "Network Mapping",
          description: "Drawing a detailed map of the town's layout",
          example: "Discovering network topology and devices"
        }
      ]
    }
  ]

  const protectionMethods = [
    {
      title: "Detection",
      emoji: "🚨",
      description: "Set up watchtowers (monitoring systems) to spot suspicious activity",
      methods: ["Intrusion Detection Systems", "Log monitoring", "Network traffic analysis"]
    },
    {
      title: "Deception",
      emoji: "🎭",
      description: "Use decoy buildings (honeypots) to mislead attackers",
      methods: ["Honeypots", "False information", "Misleading network topology"]
    },
    {
      title: "Limitation",
      emoji: "🛡️",
      description: "Limit what information outsiders can discover",
      methods: ["Minimal service exposure", "Information sanitization", "Access controls"]
    }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400">🕵️ Reconnaissance Explained</h2>
      
      <Card className="border-orange-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-orange-300">
            <span className="text-2xl mr-2">🏰</span>
            Understanding the Enemy&apos;s Scouting Methods
          </CardTitle>
          <CardDescription className="text-orange-200/70">
            Just as armies would scout Salem before an attack, cyber attackers gather information before striking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="passive" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-orange-900/20">
              <TabsTrigger value="passive" className="data-[state=active]:bg-orange-700">Passive</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-orange-700">Active</TabsTrigger>
            </TabsList>
            
            {reconTypes.map((type) => (
              <TabsContent key={type.id} value={type.id} className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{type.emoji}</span>
                  <h3 className="text-xl font-semibold text-orange-300">{type.name}</h3>
                </div>
                <p className="text-orange-100/70 mb-4">{type.description}</p>
                
                <div className="grid gap-3">
                  {type.techniques.map((technique, index) => (
                    <div key={index} className="p-3 bg-orange-950/30 rounded-lg border border-orange-800/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-orange-600 text-orange-300">
                          {technique.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-orange-100/80 mb-1">{technique.description}</p>
                      <p className="text-xs text-orange-100/60">{technique.example}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-orange-800/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-orange-300">
            <span className="text-2xl mr-2">🛡️</span>
            Protection Against Reconnaissance
          </CardTitle>
          <CardDescription className="text-orange-200/70">
            How Salem&apos;s defenders could protect against enemy scouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {protectionMethods.map((method, index) => (
              <div key={index} className="p-4 bg-orange-950/30 rounded-lg border border-orange-800/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{method.emoji}</span>
                  <h4 className="font-semibold text-orange-300">{method.title}</h4>
                </div>
                <p className="text-sm text-orange-100/70 mb-3">{method.description}</p>
                <div className="space-y-1">
                  {method.methods.map((item, i) => (
                    <div key={i} className="text-xs text-orange-100/60">• {item}</div>
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