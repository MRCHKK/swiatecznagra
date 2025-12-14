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
  const router = useRouter()

  const handleStartGame = () => {
    setGameStarted(true)
  }

  const handlePinSuccess = () => {
    router.push('/game/1')
  }

  if (!gameStarted) {
    return <StartScreen onStart={handleStartGame} />
  }

  const gameState = loadGameState()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 relative overflow-hidden">
      <Snowfall />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            🎄 Julka ratuje święta 🎄
          </h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
              Twój postęp
            </h2>
            
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((gameId) => (
                <Link
                  key={gameId}
                  href={gameState.unlockedGames.includes(gameId) ? `/game/${gameId}` : '#'}
                  className={`
                    p-4 rounded-xl text-center transition-all duration-200 font-bold
                    ${
                      gameState.completedGames.includes(gameId)
                        ? 'bg-emerald-500 text-white'
                        : gameState.unlockedGames.includes(gameId)
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {gameState.completedGames.includes(gameId) ? '✓' : gameId}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="text-center space-y-3">
            {gameState.currentGame <= 6 ? (
              <Link
                href={`/game/${gameState.currentGame}`}
                className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:shadow-lg transition-all"
              >
                Kontynuuj grę #{gameState.currentGame}
              </Link>
            ) : (
              <div className="text-emerald-600 font-bold">
                🎉 Ukończyłaś wszystkie zadania! 🎉
              </div>
            )}
            
            <button
              onClick={() => {
                if (confirm('Czy na pewno chcesz zresetować postęp?')) {
                  resetGameState()
                  window.location.reload()
                }
              }}
              className="text-sm text-gray-500 underline"
            >
              Resetuj postęp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-4 relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-md bg-white/70 rounded-3xl shadow-2xl overflow-hidden border border-white/30">
          {/* Header section */}
          <div className="bg-gradient-to-r from-red-500/90 to-red-600/90 px-6 py-6 text-center">
            <div className="text-4xl mb-2" style={{ animation: 'float 3s ease-in-out infinite' }}>
              🎄
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Julka ratuje święta</h1>
            <p className="text-red-100 text-xs">Świąteczna gra z prezentami</p>
          </div>

          <ChristmasTimer />

          <div className="p-5">
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
                  Rozwiąż 6 świątecznych zadań
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Po każdym zadaniu znajdziesz wskazówkę
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Zbierz wszystkie prezenty!
                </li>
              </ul>
            </div>

            <div className="mb-5">
              <label className="block text-center text-sm font-semibold text-gray-700 mb-3">
                Wpisz PIN startowy
              </label>
              <PinInput correctPin={START_PIN} onSuccess={onStart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}