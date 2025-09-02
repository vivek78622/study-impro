"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with your studies",
    features: [
      "25-minute focus sessions",
      "Basic task management", 
      "Simple habit tracking",
      "Community support"
    ],
    cta: "Start Free",
    href: "/login",
    popular: false
  },
  {
    name: "Pro",
    price: "$4.99", 
    description: "Everything you need to excel academically",
    features: [
      "Unlimited focus sessions",
      "Advanced analytics & insights",
      "Budget tracking & planning", 
      "Priority support",
      "Study group features",
      "Custom integrations"
    ],
    cta: "Start Pro Trial",
    href: "/login",
    popular: true
  }
]

export default function PricingHero() {
  return (
    <div className="relative isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div 
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#22C1A3] to-[#ADD8E6] opacity-20"
        />
      </div>

      {/* Header */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-[#22C1A3]">Pricing</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
        Choose an affordable plan that's packed with the best features for academic success, productivity, and personal growth.
      </p>

      {/* Pricing cards */}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {plans.map((plan, index) => (
          <Card 
            key={plan.name}
            className={`relative border-0 ${
              plan.popular 
                ? 'bg-gray-800 ring-1 ring-white/10' 
                : 'bg-white/5 ring-1 ring-white/10 sm:mx-8 lg:mx-0'
            } ${
              index === 0 ? 'rounded-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl' : 'rounded-3xl'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#22C1A3] text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardContent className="p-8 sm:p-10">
              <h3 className="text-base/7 font-semibold text-[#22C1A3]">{plan.name}</h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-5xl font-semibold tracking-tight text-white">{plan.price}</span>
                <span className="text-base text-gray-400">/month</span>
              </p>
              <p className="mt-6 text-base/7 text-gray-300">{plan.description}</p>
              
              <ul className="mt-8 space-y-3 text-sm/6 text-gray-300 sm:mt-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckCircle2 className="h-6 w-5 flex-none text-[#22C1A3]" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href={plan.href} className="mt-8 block sm:mt-10">
                <Button 
                  className={`w-full py-2.5 text-sm font-semibold rounded-md ${
                    plan.popular
                      ? 'bg-[#22C1A3] hover:bg-[#1ea085] text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white ring-1 ring-inset ring-white/10'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}