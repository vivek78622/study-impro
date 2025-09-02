"use client"

import { GrowButton } from "@/components/GrowButton"
import SplineViewer from "@/components/SplineViewer"
import { useRouter } from "next/navigation"

const Index = () => {
  const router = useRouter()

  const handleStartClick = () => {
    router.push("/start")
  }

  return (
    <div className="min-h-screen bg-[#FFF1DD] flex flex-col">
      <div className="flex-1 p-4 md:p-8 flex flex-col">
        <div className="w-full h-full bg-[#FFF1DD] rounded-2xl shadow-lg overflow-hidden flex flex-col">
          <div className="w-full px-6 md:px-10 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-[#FF6B35]">Grow</div>
            <GrowButton variant="outline">Log in</GrowButton>
          </div>

          <div className="flex-1 flex flex-col md:flex-row p-6 md:p-10 gap-8">
            <div className="flex flex-col justify-center md:w-1/2 space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Your Personalized Hub for Student Success.
              </h1>
              <p className="text-gray-700 md:text-lg">We've designed a unique way for you to conquer your student life.</p>
              <div className="pt-4 flex space-x-3">
                <GrowButton onClick={handleStartClick}>Start</GrowButton>
              </div>
            </div>

            <div className="md:w-1/2 h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center relative">
              <div className="w-full h-full aspect-square max-w-[580px] max-h-[580px] relative">
                <SplineViewer url="https://my.spline.design/miniroomremakecopyprogrammerroom-I37EGeJKdKJWUM9xIq30n8qL/" className="rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index


