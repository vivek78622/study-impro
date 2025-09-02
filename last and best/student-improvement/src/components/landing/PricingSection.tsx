"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["25min focus sessions", "Basic task management", "Simple habit tracking"],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Pro", 
    price: "$4.99",
    description: "Everything you need to excel",
    features: ["Unlimited sessions", "Advanced analytics", "Budget tracking", "Priority support"],
    cta: "Start Pro Trial",
    popular: true
  },
  {
    name: "Campus",
    price: "$2.99", 
    description: "Special student pricing",
    features: ["All Pro features", "Student verification", "Campus community", "Study groups"],
    cta: "Verify Student",
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Student-Friendly Pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that fits your academic journey</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <Card key={index} className={`relative border-2 ${tier.popular ? 'border-[#22C1A3] shadow-2xl scale-105' : 'border-gray-200'} bg-white`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#22C1A3] text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="text-4xl font-bold text-[#22C1A3] mb-2">
                    {tier.price}
                    <span className="text-lg text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#22C1A3]" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className={`w-full py-3 rounded-xl font-semibold ${tier.popular ? 'bg-[#22C1A3] hover:bg-[#1ea085] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}