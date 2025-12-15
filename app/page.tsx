"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Snowfall from '@/components/Snowfall'
import ChristmasTimer from '@/components/ChristmasTimer'
import PinInput from '@/components/PinInput'
import { loadGameState, resetGameState } from '@/lib/gameState'
import { START_PIN } from '@/lib/gameconfig'

export default function Page() {
  const [gameStarted, setGameStarted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()

  const handleStartGame = () => {
    setIsTransitioning(true)
    setTimeout(() => setGameStarted(true), 300)
  }

  const handlePinSuccess = () => {
    router.push('/game/1')
  }

  if (!gameStarted) {
    return <StartScreen onStart={handleStartGame} isTransitioning={isTransitioning} />
  }

  const gameState = loadGameState()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 pb-24 relative overflow-hidden slide-in">
      <Snowfall />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/90 rounded-2xl p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Julka ratuje święta 🎄
          </h1>
          
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-6">
              Twój postęp
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((gameId) => (
                <Link
                  key={gameId}
                  href={gameState.unlockedGames.includes(gameId) ? `/game/${gameId}` : '#'}
                  aria-label={`Zadanie ${gameId}${gameState.completedGames.includes(gameId) ? ' - ukończone' : ''}`}
                  className={`
                    aspect-square rounded-xl text-center transition-all duration-200 font-bold text-xl
                    flex items-center justify-center
                    ${
                      gameState.completedGames.includes(gameId)
                        ? 'bg-emerald-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                        : gameState.unlockedGames.includes(gameId)
                        ? 'bg-amber-100 text-amber-800 shadow-sm hover:bg-amber-200 hover:shadow-md hover:scale-105 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                  style={{ minHeight: '80px' }}
                >
                  {gameState.completedGames.includes(gameId) ? (
                    <span className="text-3xl" aria-hidden="true">✓</span>
                  ) : (
                    gameId
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {gameState.currentGame <= 6 ? (
              <Link
                href={`/game/${gameState.currentGame}`}
                className="block w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-center shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Kontynuuj grę #{gameState.currentGame}
              </Link>
            ) : (
              <div className="text-center py-6 px-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-emerald-700 font-bold text-lg">
                  Ukończyłaś wszystkie zadania!
                </p>
              </div>
            )}
            
            <button
              onClick={() => {
                if (confirm('Czy na pewno chcesz zresetować postęp?')) {
                  resetGameState()
                  window.location.reload()
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
            >
              Resetuj postęp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StartScreen({ onStart, isTransitioning }: { onStart: () => void; isTransitioning: boolean }) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 pb-24 relative overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>
          {/* Header section */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-center">
            <div className="text-5xl mb-3 animate-bounce">
              🎄
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Julka ratuje święta</h1>
            <p className="text-red-100">Świąteczna gra z prezentami</p>
          </div>

          <ChristmasTimer />

          <div className="p-6">
            <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-sm">
                  ?
                </span>
                Jak grać
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 text-lg leading-none">•</span>
                  <span>Rozwiąż 6 świątecznych zadań</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 text-lg leading-none">•</span>
                  <span>Po każdym zadaniu znajdziesz wskazówkę</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 text-lg leading-none">•</span>
                  <span>Zbierz wszystkie prezenty!</span>
                </li>
              </ul>
            </div>

            <div>
              <label className="block text-center font-bold text-gray-900 mb-4">
                Wpisz PIN startowy
              </label>
              <PinInput correctPin={START_PIN} onSuccess={onStart} buttonText="Rozpocznij grę" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
