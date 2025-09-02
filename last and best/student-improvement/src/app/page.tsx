"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Hero3D from "@/components/landing/Hero3D"
import FeatureGrid from "@/components/landing/FeatureGrid"

import TestimonialsSection from "@/components/landing/TestimonialsSection"
import PricingSection from "@/components/landing/PricingSection"
import PricingHero from "@/components/landing/PricingHero"
import FeatureBento from "@/components/landing/FeatureBento"
import Header from "@/components/landing/Header"
import ActionSection from "@/components/landing/ActionSection"

const LandingPage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F7] via-[#F5F0E1] to-[#F0F4F8]">
      <Header />
      <Hero3D />
      <FeatureGrid />
      <FeatureBento />
      <ActionSection />




      <TestimonialsSection />
      <PricingHero />

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#22C1A3] to-[#1ea085]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Study Habits?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who've already improved their focus and productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button className="bg-white text-[#22C1A3] hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
          <p className="text-white/70 text-sm mt-6">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StudyFlow</h3>
              <p className="text-gray-400">
                The productivity app designed specifically for students.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/study" className="hover:text-white transition-colors">Focus Timer</Link></li>
                <li><Link href="/tasks" className="hover:text-white transition-colors">Task Management</Link></li>
                <li><Link href="/habits" className="hover:text-white transition-colors">Habit Tracking</Link></li>
                <li><Link href="/budget" className="hover:text-white transition-colors">Budget Tracker</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Student Discount</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudyFlow. All rights reserved. Made with ❤️ for students.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage