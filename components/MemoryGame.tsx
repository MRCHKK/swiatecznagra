"use client"

import React, { useState, useEffect } from 'react'

interface Card {
  id: number
  imageId: number
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  onWin: () => void
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onWin }) => {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create 15 pairs (30 cards total)
    const imageIds = Array.from({ length: 15 }, (_, i) => i + 1)
    const pairs = [...imageIds, ...imageIds]
    
    // Shuffle cards
    const shuffled = pairs
      .sort(() => Math.random() - 0.5)
      .map((imageId, index) => ({
        id: index,
        imageId,
        isFlipped: false,
        isMatched: false,
      }))
    
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
  }

  const handleCardClick = (cardId: number) => {
    // Prevent clicking if checking or card already flipped/matched
    if (isChecking || flippedCards.length === 2) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    // Flip the card
    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    
    setCards(prev => 
      prev.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    )

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setIsChecking(true)
      setMoves(prev => prev + 1)
      
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)

      if (firstCard && secondCard && firstCard.imageId === secondCard.imageId) {
        // Match found!
        setTimeout(() => {
          setCards(prev => 
            prev.map(c => 
              c.id === firstId || c.id === secondId 
                ? { ...c, isMatched: true } 
                : c
            )
          )
          setFlippedCards([])
          setIsChecking(false)

          // Check if all cards are matched
          const allMatched = cards.every(c => 
            c.isMatched || c.id === firstId || c.id === secondId
          )
          if (allMatched) {
            setTimeout(() => onWin(), 500)
          }
        }, 600)
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => 
            prev.map(c => 
              c.id === firstId || c.id === secondId 
                ? { ...c, isFlipped: false } 
                : c
            )
          )
          setFlippedCards([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <div className="text-sm text-gray-600">
          Ruchy: <span className="font-bold text-emerald-600">{moves}</span>
        </div>
        <button
          onClick={initializeGame}
          className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          🔄 Od nowa
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 transform ${
              card.isFlipped || card.isMatched
                ? 'rotate-0 bg-white shadow-md'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md hover:scale-105'
            } ${
              card.isMatched ? 'opacity-50 cursor-default' : ''
            }`}
          >
            <div className="w-full h-full flex items-center justify-center p-1">
              {card.isFlipped || card.isMatched ? (
                <img
                  src={`/memory/${card.imageId}.jpg`}
                  alt={`Card ${card.imageId}`}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    // Fallback to placeholder if image not found
                    e.currentTarget.src = `https://placehold.co/100x100/10b981/ffffff?text=${card.imageId}`
                  }}
                />
              ) : (
                <div className="text-white text-2xl">🎄</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-gray-500 mt-4">
        💡 Znajdź wszystkie 15 par!
      </div>
    </div>
  )
}

export default MemoryGame