"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EverydayExplanations() {
  const explanations = [
    {
      term: "Firewall",
      definition: "Like a bouncer at a club - controls what gets in and out",
      difficulty: "Easy"
    },
    {
      term: "VPN",
      definition: "A secret tunnel for your internet traffic",
      difficulty: "Easy"
    },
    {
      term: "Phishing",
      definition: "Fake emails pretending to be someone you trust",
      difficulty: "Easy"
    },
    {
      term: "Two-Factor Authentication",
      definition: "Like having two locks on your door instead of one",
      difficulty: "Medium"
    }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Cyber Security in Everyday Terms</h2>
      <div className="grid gap-4">
        {explanations.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.term}</CardTitle>
                <Badge variant={item.difficulty === "Easy" ? "secondary" : "default"}>
                  {item.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                {item.definition}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}