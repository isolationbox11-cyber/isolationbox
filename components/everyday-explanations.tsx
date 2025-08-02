"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ExplanationProps {
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
}

const explanations: ExplanationProps[] = [
  {
    title: "What is a Firewall?",
    description: "Think of a firewall like a security guard at the entrance of a building. Just like how a security guard checks who can enter and leave, a firewall monitors and controls what data can come in and go out of your computer or network.",
    difficulty: "Beginner",
    category: "Network Security"
  },
  {
    title: "Understanding Encryption",
    description: "Encryption is like writing a secret message in a code that only you and the person you're sending it to can understand. Even if someone intercepts your message, they can't read it without the special key.",
    difficulty: "Beginner",
    category: "Data Protection"
  },
  {
    title: "Two-Factor Authentication",
    description: "2FA is like having two locks on your front door. Even if someone steals your house key (password), they still can't get in without the second key (like a code sent to your phone).",
    difficulty: "Beginner",
    category: "Authentication"
  }
]

export function EverydayExplanations() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {explanations.map((explanation, index) => (
        <Card key={index} className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{explanation.title}</CardTitle>
              <Badge variant={explanation.difficulty === 'Beginner' ? 'default' : explanation.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                {explanation.difficulty}
              </Badge>
            </div>
            <CardDescription>{explanation.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{explanation.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}