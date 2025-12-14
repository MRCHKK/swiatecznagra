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
    giftLocation: 'Salon',
    nextPin: '1605',
  },
  {
    id: 2,
    type: 'question',
    title: 'Pytanie 2',
    giftLocation: 'Sprawdź szafkę w kuchni',
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
    giftLocation: 'Zajrzyj do szafy',
    nextPin: '3112',
  },
  {
    id: 4,
    type: 'question',
    title: 'Pytanie 4',
    giftLocation: 'Sprawdź okno w salonie',
    nextPin: '2512',
    questionData: {
      question: 'Ile reniferów ciągnie sanie Świętego Mikołaja?',
      answers: ['6', '8', '9', '12'],
      correctAnswer: 1,
      clue: 'To liczba podzielna przez 4',
    },
  },
  {
    id: 5,
    type: 'memory',
    title: 'Gra pamięciowa',
    giftLocation: 'Może gdzieś koło telewizora?',
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