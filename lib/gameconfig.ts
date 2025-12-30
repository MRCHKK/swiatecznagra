export interface GameConfig {
  id: number
  type: 'tictactoe' | 'question' | 'hangman' | 'memory'
  title: string
  nextPin?: string
  giftLocation?: string
  questionData?: {
    question: string
    answers: string[]
    correctAnswer: number
    clue: string
  }
}

export const GAMES_CONFIG: GameConfig[] = [
  {
    id: 1,
    type: 'tictactoe',
    title: 'Gra w kółko i krzyżyk',
    giftLocation: 'Obejrzałbym coś',
    nextPin: '1605',
  },
  {
    id: 2,
    type: 'question',
    title: 'Pytanie 2',
    giftLocation: 'Twoja prywatna przestrzeń',
    nextPin: '2412',
    questionData: {
      question: 'Jaka była data naszego wyjazdu do Wrocławia?',
      answers: ['18 wrzesień 2024', '28 wrzesień 2024', '19 sierpień 2024', 'Nie byliśmy we Wrocławiu'],
      correctAnswer: 1,
      clue: 'Było "jeszcze" ciepło',
    },
  },
  {
    id: 3,
    type: 'hangman',
    title: 'Wisielec',
    giftLocation: 'Tam gdzie następuje obżarstwo',
    nextPin: '3112',
  },
  {
    id: 4,
    type: 'question',
    title: 'Pytanie 4',
    giftLocation: 'Upiekło ci się',
    nextPin: '2512',
    questionData: {
      question: 'Na ile $$ oraz pkt. karnych dostałem mandat 12.07.2025?',
      answers: ['400 zł, 5pkt', '500 zł, 8 pkt', '600 zł, 5 pkt', '600 zł, 8 pkt'],
      correctAnswer: 1,
      clue: 'W chuj',
    },
  },
  {
    id: 5,
    type: 'memory',
    title: 'Gra pamięciowa',
    giftLocation: 'Nasze majtki razem...',
    nextPin: '1912',
  },
  {
    id: 6,
    type: 'question',
    title: 'Pytanie 6',
    questionData: {
      question: 'Co jest najdroższe z niżej wymienionych?',
      answers: ['miedź', 'platyna', 'piach', 'złoto'],
      correctAnswer: 3,
      clue: 'nie wiem',
    },
  },
]

export const START_PIN = '0102'