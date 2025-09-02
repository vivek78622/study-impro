"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import SEO from "@/components/SEO"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, ExternalLink, Pause, Play, Share2, House, Coffee, Brain, Trophy, Target, Clock, Zap } from "lucide-react"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"
import { useAuth } from '../../contexts/AuthContext'
import { subscribeToStudySessions, createStudySession, updateStudySession } from '../../services/studySessions'
import ProtectedRoute from '../../components/ProtectedRoute'

type TimerMode = "25min" | "60min" | "break"
type SessionPhase = "focus" | "break" | "complete"

export default function StudyMode() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [completedSessions, setCompletedSessions] = useState(0)

  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  const [timerMode, setTimerMode] = useState<TimerMode>("25min")
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>("focus")
  const [showMotivation, setShowMotivation] = useState(true)
  const [showDone, setShowDone] = useState(false)
  const [sessionNotes, setSessionNotes] = useState("")

  const timerRef = useRef<number | null>(null)
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null)

  // Subscribe to user's study sessions
  useEffect(() => {
    if (!user?.uid) return
    const unsubscribe = subscribeToStudySessions(user.uid, (fetchedSessions) => {
      setSessions(fetchedSessions)
      setCompletedSessions(fetchedSessions.filter(s => s.status === 'completed').length)
    })
    return unsubscribe
  }, [user?.uid])

  const totalSeconds = useMemo(() => {
    if (sessionPhase === "break") return 5 * 60
    return timerMode === "25min" ? 25 * 60 : 60 * 60
  }, [timerMode, sessionPhase])
  
  const progressPct = useMemo(() => (timeLeft === 0 ? 100 : ((totalSeconds - timeLeft) / totalSeconds) * 100), [timeLeft, totalSeconds])
  const isComplete = timeLeft === 0

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft((s) => s - 1), 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete()
    }
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRunning, timeLeft])

  useEffect(() => {
    setIsRunning(false)
    if (sessionPhase === "break") {
      setTimeLeft(5 * 60)
    } else {
      setTimeLeft(timerMode === "25min" ? 25 * 60 : 60 * 60)
    }
  }, [timerMode, sessionPhase])

  useEffect(() => {
    if (!showMotivation) return
    const t = window.setTimeout(() => setShowMotivation(false), 5000)
    return () => window.clearTimeout(t)
  }, [showMotivation])

  useEffect(() => {
    if (!showDone) return
    const t = window.setTimeout(() => setShowDone(false), 5000)
    return () => window.clearTimeout(t)
  }, [showDone])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const toggleTimer = async () => {
    if (!user?.uid) return
    
    if (!isRunning && !currentSessionId && sessionPhase === "focus") {
      // Start new focus session
      try {
        const docRef = await createStudySession(user.uid, {
          mode: timerMode as "25min" | "60min",
          status: 'active',
          notes: '',
          endTime: null
        })
        setCurrentSessionId(docRef.id)
      } catch (error) {
        console.error('Error creating session:', error)
      }
    }
    
    setIsRunning((prev) => !prev)
    setShowMotivation(false)
  }

  const startNewSession = () => {
    setSessionPhase("focus")
    setTimeLeft(timerMode === "25min" ? 25 * 60 : 60 * 60)
    setIsRunning(false)
    setShowDone(false)
    setSessionNotes("")
  }

  const skipBreak = () => {
    setSessionPhase("complete")
    setIsRunning(false)
    setShowDone(true)
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 160,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#C1E1C1", "#E8DCC0", "#A4D3AE"],
      shapes: ["circle", "square"],
      scalar: 0.9,
    })
  }

  const handleTimerComplete = async () => {
    setIsRunning(false)
    triggerConfetti()
    
    if (sessionPhase === "focus") {
      // Complete focus session and start break
      if (currentSessionId && user?.uid) {
        try {
          await updateStudySession(currentSessionId, {
            status: 'completed',
            endTime: new Date(),
            notes: sessionNotes
          })
          setCurrentSessionId(null)
        } catch (error) {
          console.error('Error completing session:', error)
        }
      }
      
      // Start break timer
      setSessionPhase("break")
      setTimeLeft(5 * 60)
      setShowDone(true)
      setTimeout(() => {
        setIsRunning(true) // Auto-start break
      }, 2000)
      
    } else if (sessionPhase === "break") {
      // Break completed
      setSessionPhase("complete")
      setShowDone(true)
    }
  }

  const shareSession = () => {
    const message = `Just completed ${completedSessions + 1} study sessions with StudyFlow! 🎯 #ProductiveStudying`
    navigator.clipboard.writeText(message)
  }

  const getPhaseIcon = () => {
    switch (sessionPhase) {
      case "focus": return <Brain className="w-6 h-6" />
      case "break": return <Coffee className="w-6 h-6" />
      case "complete": return <Trophy className="w-6 h-6" />
    }
  }

  const getPhaseColor = () => {
    switch (sessionPhase) {
      case "focus": return "from-[#C1E1C1] to-[#B5D6B5]"
      case "break": return "from-[#FFCC99] to-[#FFB86B]"
      case "complete": return "from-[#ADD8E6] to-[#9BC7E4]"
    }
  }

  const getPhaseMessage = () => {
    switch (sessionPhase) {
      case "focus": return "Focus time! Let's get things done."
      case "break": return "Break time! Relax and recharge."
      case "complete": return "Great work! Session completed."
    }
  }

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-[#F5F0E1] px-4 py-6 md:px-8">
      <SEO
        title="Study Mode — Grow Focus Timer"
        description="Stay focused with a calming Pomodoro timer and lo-fi music. Switch between 25 and 60 minutes and celebrate completions."
        canonical={`${baseUrl}/study`}
      />

      {/* Enhanced Header */}
      <header className="mb-8 bg-gradient-to-r from-[#C1E1C1]/20 to-[#ADD8E6]/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-white/30 hover:bg-white/40 text-slate-800 border-white/40 backdrop-blur-sm"
          >
            <House className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-[#C1E1C1] to-[#B5D6B5] text-white px-4 py-2 cursor-pointer" onClick={() => window.open('https://chat.openai.com', '_blank')}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
              </svg>
              <span className="ml-2 capitalize">ChatGPT</span>
            </Badge>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C1E1C1] to-[#ADD8E6] bg-clip-text text-transparent mb-2">
            StudyFlow Focus Timer
          </h1>
          <p className="text-gray-600 text-lg">{getPhaseMessage()}</p>
        </div>
        

      </header>

      {showMotivation && (
        <Card className="mb-4 border-0 bg-white/90 p-4 shadow-sm">
          <p className="text-center text-sm text-gray-700">Let’s focus and grow today!</p>
        </Card>
      )}
      {showDone && (
        <Card className="mb-4 border-0 bg-white/90 p-4 shadow-sm">
          <p className="text-center text-sm text-gray-700">Great job! You completed a session.</p>
        </Card>
      )}

      <section aria-labelledby="music-timer" className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <h2 id="music-timer" className="sr-only">Music and Timer</h2>

        <Card className="grid place-items-center border-0 bg-white/95 p-6 shadow-lg">
          <div className="relative mb-4 h-56 w-56 overflow-hidden rounded-full border-4 border-[#C8E2C8]">
            <div
              className={`absolute inset-x-0 bottom-0 bg-[#B7D8E8]/70 transition-[height,border-radius] duration-700 ease-in-out ${isComplete ? "z-10" : "z-0"}`}
              style={{ height: `${progressPct}%`, borderRadius: progressPct >= 100 ? "0" : "50% 50% 0 0" }}
            />
            <div className={`absolute inset-0 grid place-items-center ${isComplete ? "opacity-0" : "opacity-100"}`}>
              <span className="font-heading text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div className="mb-4 flex gap-3">
            <Button
              variant={timerMode === "25min" ? "default" : "outline"}
              className={timerMode === "25min" ? "bg-[#C1E1C1] text-gray-800" : "bg-[#EFE6CE] text-gray-700"}
              onClick={() => !isRunning && setTimerMode("25min")}
              disabled={isRunning}
            >
              25 min
            </Button>
            <Button
              variant={timerMode === "60min" ? "default" : "outline"}
              className={timerMode === "60min" ? "bg-[#C1E1C1] text-gray-800" : "bg-[#EFE6CE] text-gray-700"}
              onClick={() => !isRunning && setTimerMode("60min")}
              disabled={isRunning}
            >
              60 min
            </Button>
          </div>

          <Button onClick={toggleTimer} className="bg-[#C1E1C1] text-gray-800">
            {isRunning ? <Pause className="mr-2 size-4" /> : <Play className="mr-2 size-4" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
        </Card>

        <Card className="border-0 bg-white/95 p-4 shadow-lg">
          <p className="mb-2 text-sm text-gray-800">Study Music</p>
          <div className="mb-3 overflow-hidden rounded-md">
            <div className="relative aspect-video">
              <iframe
                ref={youtubePlayerRef}
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0"
                title="YouTube Lo-Fi Player"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              className="bg-[#E8DCC0] text-gray-700 border-0"
              onClick={() => window.open("https://www.youtube.com/watch?v=jfKfPfyJRdk", "_blank")}
            >
              <ExternalLink className="mr-2 size-4" /> Watch
            </Button>

            <Button variant="outline" size="sm" className="bg-[#E8DCC0] text-gray-700 border-0" onClick={shareSession}>
              <Share2 className="mr-2 size-4" /> Share
            </Button>
          </div>
        </Card>
      </section>

      <footer className="mx-auto mt-6 flex max-w-5xl justify-center gap-3">
        <Button className="bg-[#A4D3AE] text-gray-800" onClick={handleTimerComplete}>
          <Check className="mr-2 size-4" /> Complete Session
        </Button>
      </footer>
    </main>
    </ProtectedRoute>
  )
}


