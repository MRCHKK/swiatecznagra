"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Snowfall from '@/components/Snowfall'
import TicTacToeGame from '@/components/TicTacToeGame'
import QuestionGame from '@/components/QuestionGame'
import HangmanGame from '@/components/Hangmangame'
import MemoryGame from '@/components/MemoryGame'
import PinInput from '@/components/PinInput'
import { GAMES_CONFIG } from '@/lib/gameconfig'
import { unlockNextGame, isGameUnlocked, loadGameState } from '@/lib/gameState'

export default function GamePage() {
  const router = useRouter()
  const params = useParams()
  const gameId = parseInt(params.id as string)
  
  const [showHint, setShowHint] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isPinVerified, setIsPinVerified] = useState(false)
  const pinContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if game is unlocked
    if (!isGameUnlocked(gameId)) {
      router.push('/')
    } else {
      setIsAuthorized(true)
      // Check if this is the first game (no PIN required)
      if (gameId === 1) {
        setIsPinVerified(true)
      }
    }
  }, [gameId, router])

  // Scroll to PIN input when showing on mobile
  useEffect(() => {
    if (!isPinVerified && gameId > 1 && pinContainerRef.current) {
      // Delay to ensure keyboard is open
      setTimeout(() => {
        pinContainerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 300)
    }
  }, [isPinVerified, gameId])

  if (!isAuthorized) {
    return null
  }

  const game = GAMES_CONFIG.find((g) => g.id === gameId)
  
  if (!game) {
    notFound()
  }

  // Get PIN from previous game config
  const previousGame = gameId > 1 ? GAMES_CONFIG.find((g) => g.id === gameId - 1) : null
  const requiredPin = previousGame?.nextPin || ''

  const handlePinSuccess = () => {
    setIsPinVerified(true)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 py-8 relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            {GAMES_CONFIG.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx < gameId - 1
                    ? 'w-6 sm:w-8 bg-emerald-500'
                    : idx === gameId - 1
                    ? 'w-6 sm:w-8 bg-red-500'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Zadanie #{gameId}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {game.title}
            </p>
          </div>

          {!isPinVerified && gameId > 1 ? (
            <div ref={pinContainerRef}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-3xl mb-4 shadow-lg">
                  🔒
                </div>
                <p className="text-gray-600 mb-1 font-medium">
                  Wpisz PIN z prezentu
                </p>
                <p className="text-xs text-gray-500">
                  Znajdziesz go przy poprzednim prezencie
                </p>
              </div>
              <PinInput correctPin={requiredPin} onSuccess={handlePinSuccess} />
            </div>
          ) : !showHint ? (
            <>
              {game.type === 'tictactoe' ? (
                <TicTacToeGame onWin={handleGameComplete} />
              ) : game.type === 'hangman' ? (
                <HangmanGame onWin={handleGameComplete} />
              ) : game.type === 'memory' ? (
                <MemoryGame onWin={handleGameComplete} />
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
              giftLocation={game.giftLocation ?? null}
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
  isLastGame,
  onNext,
}: {
  giftLocation: string | null
  isLastGame: boolean
  onNext: () => void
}) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Success animation */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="text-6xl sm:text-7xl mb-4 animate-bounce">
          🎉
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-2">
          Gratulacje!
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Zadanie ukończone pomyślnie
        </p>
      </div>

      {giftLocation && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎁</span>
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Lokalizacja prezentu
              </div>
            </div>
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-900 mb-3 bg-white/50 rounded-lg p-3">
            {giftLocation}
          </div>
          {!isLastGame && (
            <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 bg-amber-50 rounded-lg p-3 border border-amber-200">
              <span className="text-lg">💡</span>
              <span>
                Przy prezencie znajdziesz <strong>PIN</strong> do następnego zadania
              </span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-base sm:text-lg shadow-lg shadow-red-500/30 transition-all hover:shadow-xl hover:shadow-red-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {isLastGame ? (
          <>
            <span>🏆</span>
            <span>Zakończ grę</span>
          </>
        ) : (
          <>
            <span>Następne zadanie</span>
            <span>→</span>
          </>
        )}
      </button>
    </div>
  )
}
