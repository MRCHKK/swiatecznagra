"use client"

import React, { useState, useEffect } from 'react'

type Player = 'X' | 'O' | null
type Board = Player[]

interface TicTacToeGameProps {
  onWin: () => void
}

export default function TicTacToeGame({ onWin }: TicTacToeGameProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<Player>(null)

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
        setTimeout(onWin, 1000)
      }
    } else if (isBoardFull(newBoard)) {
      setGameOver(true)
    } else {
      setIsPlayerTurn(false)
    }
  }

  const makeComputerMove = () => {
    const bestMove = findBestMove([...board])
    if (bestMove !== -1) {
      const newBoard = [...board]
      newBoard[bestMove] = 'O'
      setBoard(newBoard)

      const winner = checkWinner(newBoard)
      if (winner) {
        setWinner(winner)
        setGameOver(true)
      } else if (isBoardFull(newBoard)) {
        setGameOver(true)
      } else {
        setIsPlayerTurn(true)
      }
    }
  }

  const findBestMove = (currentBoard: Board): number => {
    // Prosty algorytm AI
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
    const available = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((i) => i !== null) as number[]
    
    return available.length > 0 ? available[0] : -1
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