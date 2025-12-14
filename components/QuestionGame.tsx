"use client"

import React, { useState } from 'react'

interface QuestionGameProps {
  question: string
  answers: string[]
  correctAnswer: number
  clue: string
  onCorrectAnswer: () => void
}

export default function QuestionGame({
  question,
  answers,
  correctAnswer,
  clue,
  onCorrectAnswer,
}: QuestionGameProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showClue, setShowClue] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)

  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownTime])

  const handleAnswerClick = (index: number) => {
    if (answered || cooldownTime > 0) return

    setSelectedAnswer(index)
    setAnswered(true)

    if (index === correctAnswer) {
      setTimeout(() => {
        onCorrectAnswer()
      }, 1000)
    } else {
      setCooldownTime(60)
      setTimeout(() => {
        setAnswered(false)
        setSelectedAnswer(null)
      }, 1500)
    }
  }

  const getButtonClass = (index: number) => {
    if (!answered) {
      return cooldownTime > 0
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 border-2 border-transparent active:scale-98'
    }

    if (selectedAnswer === index) {
      return index === correctAnswer
        ? 'bg-emerald-500 text-white border-2 border-emerald-600'
        : 'bg-red-500 text-white border-2 border-red-600'
    }

    return 'bg-gray-50 opacity-50'
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-xl font-bold text-gray-800 text-center mb-6 leading-relaxed">
        {question}
      </h1>

      <div className="flex flex-col gap-3 mb-5">
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            disabled={cooldownTime > 0 || answered}
            className={`p-4 rounded-2xl text-left font-medium transition-all duration-200 ${getButtonClass(
              index
            )}`}
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mr-3">
              {String.fromCharCode(65 + index)}
            </span>
            {answer}
          </button>
        ))}
      </div>

      {cooldownTime > 0 && (
        <div className="text-center py-4 px-5 bg-red-50 rounded-2xl border border-red-100 mb-4">
          <div className="text-3xl font-bold text-red-500 mb-1">{cooldownTime}s</div>
          <div className="text-sm text-red-400">Poczekaj przed kolejną próbą</div>
        </div>
      )}

      {!answered && cooldownTime === 0 && (
        <button
          onClick={() => setShowClue(!showClue)}
          className="w-full py-3 px-4 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-700 font-semibold transition-all hover:bg-amber-100"
        >
          {showClue ? 'Ukryj wskazówkę' : 'Pokaż wskazówkę'}
        </button>
      )}

      {showClue && (
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
          <p className="text-amber-800 font-medium">{clue}</p>
        </div>
      )}
    </div>
  )
}