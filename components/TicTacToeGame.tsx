"use client"

import React, { useState, useEffect } from 'react'

type Player = 'X' | 'O' | null
type Board = Player[]

interface TicTacToeGameProps {
  onWin: () => void
}

// Przechowujemy licznik przegranych w localStorage
const LOSS_COUNT_KEY = 'tictactoe-losses'

function getLossCount(): number {
  if (typeof window === 'undefined') return 0
  const saved = localStorage.getItem(LOSS_COUNT_KEY)
  return saved ? parseInt(saved, 10) : 0
}

function setLossCount(count: number): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOSS_COUNT_KEY, count.toString())
  }
}

function resetLossCount(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOSS_COUNT_KEY)
  }
}

export default function TicTacToeGame({ onWin }: TicTacToeGameProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<Player>(null)
  const [playerLosses, setPlayerLosses] = useState(0)

  // Wczytaj licznik przegranych przy montowaniu komponentu
  useEffect(() => {
    setPlayerLosses(getLossCount())
  }, [])

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(() => makeComputerMove(), 500)
      return () => clearTimeout(timer)
    }
  }, [isPlayerTurn, gameOver])

  const checkWinner = (currentBoard: Board): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const [a, b, c] of lines) {
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a]
      }
    }

    return null
  }

  const isBoardFull = (currentBoard: Board): boolean => {
    return currentBoard.every((cell) => cell !== null)
  }

  const handleCellClick = (index: number) => {
    if (!isPlayerTurn || board[index] || gameOver) return

    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)

    const winner = checkWinner(newBoard)
    if (winner) {
      setWinner(winner)
      setGameOver(true)
      if (winner === 'X') {
        // Gracz wygrał - resetuj licznik przegranych
        resetLossCount()
        setPlayerLosses(0)
        setTimeout(onWin, 1000)
      }
    } else if (isBoardFull(newBoard)) {
      // Remis - też zwiększ licznik
      setGameOver(true)
      const newLossCount = playerLosses + 1
      setPlayerLosses(newLossCount)
      setLossCount(newLossCount)
    } else {
      setIsPlayerTurn(false)
    }
  }

  const makeComputerMove = () => {
    // Po 2 przegranych komputer zaczyna grać losowo
    const shouldPlayDumb = playerLosses >= 2
    
    let bestMove = -1
    
    if (shouldPlayDumb) {
      // Tryb głupi - losowy ruch z małą szansą na mądry ruch
      const randomChance = Math.random()
      
      if (randomChance < 0.7) { // 70% szans na całkowicie losowy ruch
        bestMove = makeRandomMove([...board])
      } else if (randomChance < 0.9) { // 20% szans na zablokowanie gracza
        bestMove = findWinningMove([...board], 'X')
        if (bestMove === -1) {
          bestMove = makeRandomMove([...board])
        }
      } else { // 10% szans na normalną grę
        bestMove = findBestMove([...board])
      }
    } else {
      // Normalna inteligentna gra
      bestMove = findBestMove([...board])
    }
    
    if (bestMove !== -1) {
      const newBoard = [...board]
      newBoard[bestMove] = 'O'
      setBoard(newBoard)

      const winner = checkWinner(newBoard)
      if (winner) {
        setWinner(winner)
        setGameOver(true)
        if (winner === 'O') {
          // Komputer wygrał - zwiększ licznik przegranych
          const newLossCount = playerLosses + 1
          setPlayerLosses(newLossCount)
          setLossCount(newLossCount)
        }
      } else if (isBoardFull(newBoard)) {
        // Remis - też zwiększ licznik
        setGameOver(true)
        const newLossCount = playerLosses + 1
        setPlayerLosses(newLossCount)
        setLossCount(newLossCount)
      } else {
        setIsPlayerTurn(true)
      }
    }
  }

  const makeRandomMove = (currentBoard: Board): number => {
    const available = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((i) => i !== null) as number[]
    
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)]
    }
    return -1
  }

  const findBestMove = (currentBoard: Board): number => {
    // Normalna inteligentna strategia
    // 1. Sprawdź czy można wygrać
    const winMove = findWinningMove(currentBoard, 'O')
    if (winMove !== -1) return winMove

    // 2. Zablokuj gracza
    const blockMove = findWinningMove(currentBoard, 'X')
    if (blockMove !== -1) return blockMove

    // 3. Zajmij środek
    if (currentBoard[4] === null) return 4

    // 4. Zajmij róg
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter((i) => currentBoard[i] === null)
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // 5. Zajmij dowolne wolne miejsce
    return makeRandomMove(currentBoard)
  }

  const findWinningMove = (currentBoard: Board, player: Player): number => {
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard]
        testBoard[i] = player
        if (checkWinner(testBoard) === player) {
          return i
        }
      }
    }
    return -1
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsPlayerTurn(true)
    setGameOver(false)
    setWinner(null)
  }

  const getCellSymbol = (cell: Player) => {
    if (!cell) return ''
    return cell === 'X' ? '❌' : '⭕'
  }

  const getGameStatus = () => {
    if (winner === 'X') return '🎉 Wygrałaś!'
    if (winner === 'O') return '😔 Komputer wygrał'
    if (gameOver) return '🤝 Remis!'
    return isPlayerTurn ? '🎯 Twój ruch' : '🤖 Ruch komputera'
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <div className="text-2xl font-bold mb-2">{getGameStatus()}</div>
        <div className="text-sm text-gray-600">
          Ty grasz: ❌ | Komputer gra: ⭕
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={cell !== null || gameOver || !isPlayerTurn}
            className={`
              aspect-square text-4xl font-bold rounded-xl transition-all duration-200
              ${
                cell !== null
                  ? 'bg-white/60 cursor-not-allowed'
                  : isPlayerTurn && !gameOver
                    ? 'bg-white/40 hover:bg-white/60 cursor-pointer active:scale-95'
                    : 'bg-white/30 cursor-not-allowed'
              }
              ${winner && checkWinnerCell(index) ? 'ring-4 ring-yellow-400 bg-yellow-50/60' : ''}
            `}
          >
            <span className="drop-shadow-md">{getCellSymbol(cell)}</span>
          </button>
        ))}
      </div>

      {gameOver && winner !== 'X' && (
        <button
          onClick={resetGame}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
        >
          Spróbuj ponownie
        </button>
      )}
    </div>
  )

  function checkWinnerCell(index: number): boolean {
    if (!winner) return false
    
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (const line of lines) {
      if (
        line.includes(index) &&
        board[line[0]] === winner &&
        board[line[1]] === winner &&
        board[line[2]] === winner
      ) {
        return true
      }
    }
    return false
  }
}