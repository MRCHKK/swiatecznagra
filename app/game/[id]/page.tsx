"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Snowfall from '@/components/Snowfall'
import TicTacToeGame from '@/components/TicTacToeGame'
import QuestionGame from '@/components/QuestionGame'
import { GAMES_CONFIG } from '@/lib/gameconfig'
import { unlockNextGame, isGameUnlocked } from '@/lib/gameState'

export default function GamePage() {
  const router = useRouter()
  const params = useParams()
  const gameId = parseInt(params.id as string)
  
  const [showHint, setShowHint] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check if game is unlocked
    if (!isGameUnlocked(gameId)) {
      router.push('/')
    } else {
      setIsAuthorized(true)
    }
  }, [gameId, router])

  if (!isAuthorized) {
    return null
  }

  const game = GAMES_CONFIG.find((g) => g.id === gameId)
  
  if (!game) {
    notFound()
  }

  const handleGameComplete = () => {
    setShowHint(true)
    unlockNextGame(gameId)
  }

  const handleNextGame = () => {
    if (gameId < 6) {
      router.push(`/game/${gameId + 1}`)
    } else {
      router.push('/finish')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-6 border border-white/20">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {GAMES_CONFIG.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx < gameId - 1
                    ? 'w-8 bg-emerald-500'
                    : idx === gameId - 1
                    ? 'w-8 bg-red-500'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Zadanie #{gameId}
            </h2>
          </div>

          {!showHint ? (
            <>
              {game.type === 'tictactoe' ? (
                <TicTacToeGame onWin={handleGameComplete} />
              ) : game.type === 'question' && game.questionData ? (
                <QuestionGame
                  question={game.questionData.question}
                  answers={game.questionData.answers}
                  correctAnswer={game.questionData.correctAnswer}
                  clue={game.questionData.clue}
                  onCorrectAnswer={handleGameComplete}
                />
              ) : null}
            </>
          ) : (
            <HintScreen
              giftLocation={game.giftLocation}
              nextPin={game.nextPin}
              isLastGame={gameId === 6}
              onNext={handleNextGame}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function HintScreen({
  giftLocation,
  nextPin,
  isLastGame,
  onNext,
}: {
  giftLocation: string | null
  nextPin: string | null
  isLastGame: boolean
  onNext: () => void
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl mb-5 bg-emerald-50 text-emerald-700">
        <span className="text-xl">✓</span>
        <span className="font-semibold">Zadanie ukończone!</span>
      </div>

      {giftLocation && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 mb-5 border border-emerald-200">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
            Lokalizacja prezentu
          </div>
          <div className="text-lg font-bold text-emerald-800 mb-4">{giftLocation}</div>
          
          {nextPin && (
            <div className="bg-white/80 rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-1">PIN do następnego zadania</div>
              <div className="text-2xl font-bold text-amber-600 tracking-widest font-mono">{nextPin}</div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40 active:scale-98"
      >
        {isLastGame ? 'Zakończ grę' : 'Następne zadanie'}
      </button>
    </div>
  )
}