import { useReducer, useEffect } from "react"

import { AppHeader } from './components/app-header'
import { StartMenu } from './components/start-menu'
import { ResultScreen } from './components/result-screen'
import { ProgressIndicator } from './components/progress-indicator'
import { QuizComponent } from './components/quiz-component'

const quizReducer = (state, action) => {
  if (action.type === 'FETCH_QUESTIONS') {
    return { ...state, quizData: action.payload }
  }

  if (action.type === 'USER_SELECTED_ANSWER') {
    return {
      ...state,
      userAnswer: action.payload,
      userScore: state.quizData[state.currentQuestion].correctOption === action.payload
        ? state.userScore + state.quizData[state.currentQuestion].points
        : state.userScore
    }
  }

  if (action.type === 'CLICKED_NEXT_QUESTION') {
    const isLastQuestion = state.currentQuestion === state.quizData.length - 1

    return {
      ...state,
      currentQuestion: isLastQuestion
        ? 0
        : state.currentQuestion + 1,
      userAnswer: null,
      shouldShowResult: isLastQuestion
    }
  }

  if (action.type === 'RESET_QUIZ') {
    return { ...state, userAnswer: null, shouldShowResult: false, userScore: 0, shouldShowMenu: true, currentQuestion: 0 }
  }

  if (action.type === 'ENDED_TIMER') {
    return { ...state, shouldShowResult: true }
  }

  if (action.type === 'STARTED_QUIZ') {
    return { ...state, shouldShowMenu: false }
  }

  return state
}

const initialState = { quizData: [], currentQuestion: 0, userAnswer: null, userScore: 0, shouldShowResult: false, shouldShowMenu: true }

const App = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/videogame-questions.json')
      .then(response => response.json())
      .then(data => dispatch({ type: 'FETCH_QUESTIONS', payload: data }))
      .catch(error => alert(error.message))
  }, [])

  const handleAnswerClick = option => dispatch({ type: 'USER_SELECTED_ANSWER', payload: option })
  const handleNextQuestionClick = () => dispatch({ type: 'CLICKED_NEXT_QUESTION' })
  const handleResetQuizClick = () => dispatch({ type: 'RESET_QUIZ' })
  const handleTimerFinished = () => dispatch({ type: 'ENDED_TIMER' })
  const handleStartQuizClick = () => dispatch({ type: 'STARTED_QUIZ' })

  const maxScore = state.quizData.reduce((acc, question) => acc + question.points, 0)

  const userHasAnswered = state.userAnswer !== null

  return (
    <div className="app">
      <AppHeader />
      <main className="main">
        {state.shouldShowMenu && <StartMenu onStartQuizClick={handleStartQuizClick} state={state} />}
        {state.shouldShowResult && !state.shouldShowMenu && <ResultScreen onResetQuizClick={handleResetQuizClick} state={state} maxScore={maxScore} />}
        {state.quizData.length > 0 && !state.shouldShowResult && !state.shouldShowMenu &&
          <>
            <ProgressIndicator state={state} maxScore={maxScore} userHasAnswered={userHasAnswered} />
            <QuizComponent state={state} userHasAnswered={userHasAnswered} onAnswerClick={handleAnswerClick} onNextQuestionClick={handleNextQuestionClick} onTimerFinished={handleTimerFinished} />
          </>
        }
      </main>
    </div>
  )
}

export { App }