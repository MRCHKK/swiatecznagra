"use client"

import React, { useState, useEffect } from 'react'

interface HangmanGameProps {
  onWin: () => void
}

const PHRASE = "KOCHAM EMILA"
const ALPHABET = 'AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ'

export default function HangmanGame({ onWin }: HangmanGameProps) {
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)

  const maxWrongGuesses = 6

  // Check if game is won
  useEffect(() => {
    const phraseLetters = new Set(PHRASE.replace(/\s/g, '').split(''))
    const allGuessed = Array.from(phraseLetters).every(letter => 
      guessedLetters.has(letter)
    )
    
    if (allGuessed && !gameWon) {
      setGameWon(true)
      setTimeout(onWin, 1500)
    }
  }, [guessedLetters, gameWon, onWin])

  const handleLetterClick = (letter: string) => {
    if (guessedLetters.has(letter) || gameWon || gameLost) return

    const newGuessed = new Set(guessedLetters)
    newGuessed.add(letter)
    setGuessedLetters(newGuessed)

    if (!PHRASE.includes(letter)) {
      const newWrongCount = wrongGuesses + 1
      setWrongGuesses(newWrongCount)
      if (newWrongCount >= maxWrongGuesses) {
        setGameLost(true)
      }
    }
  }

  const resetGame = () => {
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGameLost(false)
    setGameWon(false)
  }

  const renderPhrase = () => {
    return PHRASE.split('').map((char, index) => {
      if (char === ' ') {
        return <div key={index} className="w-4" />
      }
      return (
        <div
          key={index}
          className="w-10 h-12 border-b-2 border-emerald-600 flex items-center justify-center text-xl font-bold text-gray-800"
        >
          {guessedLetters.has(char) ? char : ''}
        </div>
      )
    })
  }

  const renderHangman = () => {
    return (
      <svg
        viewBox="0 0 200 250"
        className="w-full h-full max-w-50 max-h-62.5"
      >
        {/* Base */}
        <line x1="10" y1="230" x2="150" y2="230" stroke="#374151" strokeWidth="4" />
        {/* Pole */}
        <line x1="50" y1="230" x2="50" y2="20" stroke="#374151" strokeWidth="4" />
        {/* Top bar */}
        <line x1="50" y1="20" x2="130" y2="20" stroke="#374151" strokeWidth="4" />
        {/* Noose */}
        <line x1="130" y1="20" x2="130" y2="50" stroke="#374151" strokeWidth="4" />
        
        {/* Head */}
        {wrongGuesses > 0 && (
          <circle cx="130" cy="70" r="20" stroke="#dc2626" strokeWidth="3" fill="none" />
        )}
        
        {/* Body */}
        {wrongGuesses > 1 && (
          <line x1="130" y1="90" x2="130" y2="150" stroke="#dc2626" strokeWidth="3" />
        )}
        
        {/* Left arm */}
        {wrongGuesses > 2 && (
          <line x1="130" y1="110" x2="100" y2="130" stroke="#dc2626" strokeWidth="3" />
        )}
        
        {/* Right arm */}
        {wrongGuesses > 3 && (
          <line x1="130" y1="110" x2="160" y2="130" stroke="#dc2626" strokeWidth="3" />
        )}
        
        {/* Left leg */}
        {wrongGuesses > 4 && (
          <line x1="130" y1="150" x2="110" y2="190" stroke="#dc2626" strokeWidth="3" />
        )}
        
        {/* Right leg */}
        {wrongGuesses > 5 && (
          <line x1="130" y1="150" x2="150" y2="190" stroke="#dc2626" strokeWidth="3" />
        )}
      </svg>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Game Status */}
      <div className="text-center mb-4">
        {gameWon ? (
          <div className="text-2xl font-bold text-emerald-600">🎉 Brawo! Wygrałaś!</div>
        ) : gameLost ? (
          <div className="text-xl font-bold text-red-600">😔 Przegrałaś</div>
        ) : (
          <div className="text-sm text-gray-600">
            Pozostało prób: {maxWrongGuesses - wrongGuesses}
          </div>
        )}
      </div>

      {/* Hangman Drawing */}
      <div className="flex justify-center mb-6">
        <div className="w-48 h-60">
          {renderHangman()}
        </div>
      </div>

      {/* Phrase Display */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 px-4">
        {renderPhrase()}
      </div>

      {/* Keyboard */}
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="grid grid-cols-7 gap-1.5">
          {ALPHABET.split('').map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              disabled={guessedLetters.has(letter) || gameWon || gameLost}
              className={`
                aspect-square text-xs font-bold rounded-md transition-all duration-200
                ${
                  guessedLetters.has(letter)
                    ? PHRASE.includes(letter)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white hover:bg-gray-100 active:scale-95'
                }
                ${(gameWon || gameLost) ? 'cursor-not-allowed' : ''}
                disabled:cursor-not-allowed
              `}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {gameLost && (
        <div className="mt-4 space-y-3">
          <div className="text-center text-sm text-gray-600">
          </div>
          <button
            onClick={resetGame}
            className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      )}
    </div>
  )
}