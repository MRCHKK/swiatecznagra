"use client"

import type React from "react"

import { useState, useEffect } from "react"

export default function Page() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [gameFinished, setGameFinished] = useState(false)

  const CONFIG = {
    questions: [
      {
        question: "Jakie zwierzę pociąga sanie Świętego Mikołaja?",
        answers: ["Renifery", "Konie", "Sarny", "Łosie"],
        correct: 0,
        clue: "To zwierzę ma poroże",
        giftLocation: "Zajrzyj pod łóżko",
        nextPin: "1605",
      },
      {
        question: "W jakim miesiącu obchodzimy Boże Narodzenie?",
        answers: ["Listopad", "Grudzień", "Styczeń", "Luty"],
        correct: 1,
        clue: "To ostatni miesiąc roku",
        giftLocation: "Sprawdź szafkę w kuchni",
        nextPin: "2412",
      },
      {
        question: "Jaki kolor ma głównie choinka?",
        answers: ["Czerwony", "Złoty", "Zielony", "Niebieski"],
        correct: 2,
        clue: "Kolor lasu",
        giftLocation: "Zajrzyj za drzwi wejściowe",
        nextPin: "3112",
      },
      {
        question: "Ile reniferów ciągnie sanie Świętego Mikołaja?",
        answers: ["6", "8", "9", "12"],
        correct: 1,
        clue: "To liczba podzielna przez 4",
        giftLocation: "Sprawdź okno w salonie",
        nextPin: "2512",
      },
      {
        question: "Co się wiesza na choinką?",
        answers: ["Kwiaty", "Ozdoby", "Liście", "Pióra"],
        correct: 1,
        clue: "Są błyszczące",
        giftLocation: "Zajrzyj pod poduszką",
        nextPin: "1912",
      },
      {
        question: "Kiedy dochodzimy do Nowego Roku?",
        answers: ["31 grudnia", "1 stycznia", "Wigilia", "Trzech Króli"],
        correct: 0,
        clue: "To ostatni dzień roku",
        giftLocation: null,
        nextPin: null,
      },
    ],
  }

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleSheet = document.createElement("style")
      styleSheet.textContent = `
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes santaWiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.95; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `
      document.head.appendChild(styleSheet)

      return () => {
        document.head.removeChild(styleSheet)
      }
    }
  }, [])

  const handleCheckAnswer = (idx: number) => {
    const q = CONFIG.questions[currentQuestion]

    if (idx === q.correct) {
      setMessage({ type: "success", text: "Poprawna odpowiedź!" })
      setAnswered(true)
    } else {
      setMessage({ type: "error", text: "Błędna odpowiedź!" })
      setCooldownTime(60)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < CONFIG.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setMessage(null)
      setAnswered(false)
      setShowClue(false)
    } else {
      setGameFinished(true)
    }
  }

  if (!gameStarted) {
    return <StartScreen onStart={() => setGameStarted(true)} />
  }

  if (gameFinished) {
    return <FinishScreen />
  }

  const q = CONFIG.questions[currentQuestion]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-6 border border-white/20">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {CONFIG.questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx < currentQuestion
                    ? "w-8 bg-emerald-500"
                    : idx === currentQuestion
                      ? "w-8 bg-red-500"
                      : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>

          <h1 className="text-xl font-bold text-gray-800 text-center mb-6 leading-relaxed">{q.question}</h1>

          {!answered ? (
            <div>
              <div className="flex flex-col gap-3 mb-5">
                {q.answers.map((ans, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCheckAnswer(idx)}
                    disabled={cooldownTime > 0}
                    className={`p-4 rounded-2xl text-left font-medium transition-all duration-200 ${
                      cooldownTime > 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent active:scale-98"
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {ans}
                  </button>
                ))}
              </div>

              {cooldownTime > 0 && (
                <div className="text-center py-4 px-5 bg-red-50 rounded-2xl border border-red-100 mb-4">
                  <div className="text-3xl font-bold text-red-500 mb-1">{cooldownTime}s</div>
                  <div className="text-sm text-red-400">Poczekaj przed kolejną próbą</div>
                </div>
              )}

              {cooldownTime === 0 && !answered && (
                <button
                  onClick={() => setShowClue(!showClue)}
                  className="w-full py-3 px-4 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-700 font-semibold transition-all hover:bg-amber-100"
                >
                  {showClue ? "Ukryj wskazówkę" : "Pokaż wskazówkę"}
                </button>
              )}

              {showClue && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                  <p className="text-amber-800 font-medium">{q.clue}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {message && (
                <div
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl mb-5 ${
                    message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                  }`}
                >
                  <span className="text-xl">{message.type === "success" ? "✓" : "✗"}</span>
                  <span className="font-semibold">{message.text}</span>
                </div>
              )}

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 mb-5 border border-emerald-200">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                  Lokalizacja prezentu
                </div>
                <div className="text-lg font-bold text-emerald-800 mb-4">{q.giftLocation}</div>
                {q.nextPin && (
                  <div className="bg-white/80 rounded-xl p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">PIN do następnego pytania</div>
                    <div className="text-2xl font-bold text-amber-600 tracking-widest font-mono">{q.nextPin}</div>
                  </div>
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40 active:scale-98"
              >
                {currentQuestion < CONFIG.questions.length - 1 ? "Dalej" : "Do prezentu"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StartScreen({ onStart }: { onStart: () => void }) {
  const [pin, setPin] = useState(["", "", "", ""])
  const [pinError, setPinError] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const correctPin = "0102"

  useEffect(() => {
    const calculateTimeLeft = () => {
      const christmas = new Date("2025-12-24T00:01:00")
      const now = new Date()
      const difference = christmas.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setPinError(false)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleStart = () => {
    const enteredPin = pin.join("")
    if (enteredPin === correctPin) {
      onStart()
    } else {
      setPinError(true)
      setTimeout(() => {
        setPin(["", "", "", ""])
        setPinError(false)
        document.getElementById("pin-0")?.focus()
      }, 1500)
    }
  }

  const isPinComplete = pin.every((p) => p !== "")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          {/* Header section */}
          <div className="bg-gradient-to-r from-red-500/90 to-red-600/90 px-6 py-6 text-center">
            <div className="text-4xl mb-2" style={{ animation: "float 3s ease-in-out infinite" }}>
              🎄
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Julka ratuje święta</h1>
            <p className="text-red-100 text-xs">Świąteczna gra z prezentami</p>
          </div>

          {/* Timer section - keeping as requested */}
          <div className="px-4 py-4 bg-white/40">
            <div className="text-center mb-2">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Do świąt pozostało</span>
            </div>
            <div className="flex justify-center items-center gap-1.5">
              <div className="bg-white/80 rounded-lg px-2 py-1.5 shadow-sm min-w-12 text-center">
                <div className="text-lg font-bold text-red-500 font-mono">{timeLeft.days}</div>
                <div className="text-[9px] text-gray-500 uppercase font-semibold">dni</div>
              </div>
              <span className="text-lg text-gray-400 font-bold">:</span>
              <div className="bg-white/80 rounded-lg px-2 py-1.5 shadow-sm min-w-12 text-center">
                <div className="text-lg font-bold text-red-500 font-mono">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-[9px] text-gray-500 uppercase font-semibold">godz</div>
              </div>
              <span className="text-lg text-gray-400 font-bold">:</span>
              <div className="bg-white/80 rounded-lg px-2 py-1.5 shadow-sm min-w-12 text-center">
                <div className="text-lg font-bold text-red-500 font-mono">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-[9px] text-gray-500 uppercase font-semibold">min</div>
              </div>
              <span className="text-lg text-gray-400 font-bold">:</span>
              <div className="bg-white/80 rounded-lg px-2 py-1.5 shadow-sm min-w-12 text-center">
                <div className="text-lg font-bold text-red-500 font-mono">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-[9px] text-gray-500 uppercase font-semibold">sek</div>
              </div>
            </div>
          </div>

          {/* Content section - made more compact */}
          <div className="p-5">
            {/* Instructions - more compact */}
            <div className="bg-white/50 rounded-xl p-3 mb-5">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-xs">
                  ?
                </span>
                Jak grać
              </h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Odpowiedz na 6 świątecznych zagadek
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Poprawna odpowiedź = lokalizacja prezentu
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Błędna odpowiedź = 1 minuta przerwy
                </li>
              </ul>
            </div>

            {/* PIN Input */}
            <div className="mb-5">
              <label className="block text-center text-sm font-semibold text-gray-700 mb-3">Wpisz PIN startowy</label>
              <div className="flex justify-center gap-3">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none bg-white/80 ${
                      pinError
                        ? "border-red-400 bg-red-50/80 text-red-500"
                        : digit
                          ? "border-emerald-500 bg-emerald-50/80 text-emerald-700 shadow-md shadow-emerald-500/20"
                          : "border-gray-300 text-gray-800 focus:border-emerald-400 focus:bg-white"
                    }`}
                    style={{ animation: pinError ? "shake 0.5s" : "none" }}
                  />
                ))}
              </div>
              {pinError && <p className="text-center text-red-500 text-sm mt-2 font-medium">Nieprawidłowy PIN</p>}
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              disabled={!isPinComplete}
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
                isPinComplete
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-98"
                  : "bg-gray-200/80 text-gray-400 cursor-not-allowed"
              }`}
            >
              Rozpocznij grę
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FinishScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-6" style={{ animation: "bounce 1s infinite" }}>
            🎁
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Gratulacje!</h1>
          <p className="text-gray-600 text-lg mb-6">
            Rozwiązałaś wszystkie zagadki! Czas na główny prezent świąteczny!
          </p>
          <div className="flex justify-center gap-2 text-3xl">
            <span>🎄</span>
            <span>✨</span>
            <span>❄️</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<
    Array<{
      id: number
      left: string
      delay: number
      duration: number
      size: number
    }>
  >([])

  useEffect(() => {
    const flakes = [...Array(50)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 8, // Spread delays more evenly
      duration: 6 + Math.random() * 6,
      size: 3 + Math.random() * 5,
    }))
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full"
          style={{
            left: flake.left,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            top: `${-10 + (flake.delay / 8) * -100}%`,
            opacity: 0.6 + Math.random() * 0.3,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `-${flake.delay}s`, // Negative delay starts animation mid-way
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}
    </div>
  )
}
