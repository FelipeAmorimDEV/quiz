import { useReducer, useEffect } from "react"

import { AppHeader } from './components/app-header'
import { StartMenu } from './components/start-menu'
import { ResultScreen } from './components/result-screen'
import { ProgressIndicator } from './components/progress-indicator'
import { QuizComponent } from './components/quiz-component'

const quizReducer = (state, action) => {
  const isLastQuestion = state.currentQuestion === state.quizData.length - 1
  return ({
    'FETCH_QUESTIONS': { ...state, quizData: action?.payload },
    'USER_SELECTED_ANSWER': {
      ...state,
      userAnswer: action.payload,
      userScore: state.quizData[state.currentQuestion]?.correctOption === action.payload
        ? state.userScore + state.quizData[state.currentQuestion].points
        : state.userScore
    },
    'CLICKED_NEXT_QUESTION': {
      ...state,
      currentQuestion: isLastQuestion
        ? 0
        : state.currentQuestion + 1,
      userAnswer: null,
      appStatus: isLastQuestion ? 'finished' : 'playing'
    },
    'RESET_QUIZ': { ...state, userAnswer: null, userScore: 0, currentQuestion: 0, appStatus: 'readyToPlay' },
    'ENDED_TIMER': { ...state, appStatus: 'finished' },
    'STARTED_QUIZ': { ...state, appStatus: 'playing' }
  })[action.type] || state
}

const initialState = { quizData: [], currentQuestion: 0, userAnswer: null, userScore: 0, appStatus: 'readyToPlay' }

const App = () => {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/FelipeAmorimDEV/fake-data/main/videogame-questions.json')
      .then(response => response.json())
      .then(data => dispatch({ type: 'FETCH_QUESTIONS', payload: data }))
      .catch(error => alert(error.message))
  }, [])

  const handlers = {
    handleAnswerClick: option => dispatch({ type: 'USER_SELECTED_ANSWER', payload: option }),
    handleNextQuestionClick: () => dispatch({ type: 'CLICKED_NEXT_QUESTION' }),
    handleResetQuizClick: () => dispatch({ type: 'RESET_QUIZ' }),
    handleTimerFinished: () => dispatch({ type: 'ENDED_TIMER' }),
    handleStartQuizClick: () => dispatch({ type: 'STARTED_QUIZ' })
  };

  const maxScore = state.quizData.reduce((acc, question) => acc + question.points, 0);
  const userHasAnswered = state.userAnswer !== null;

  const renderContent = () => {
    switch (state.appStatus) {
      case 'readyToPlay':
        return <StartMenu onStartQuizClick={handlers.handleStartQuizClick} state={state} />;
      case 'finished':
        return <ResultScreen onResetQuizClick={handlers.handleResetQuizClick} state={state} maxScore={maxScore} />;
      case 'playing':
        return (
          <>
            <ProgressIndicator state={state} maxScore={maxScore} userHasAnswered={userHasAnswered} />
            <QuizComponent
              state={state}
              userHasAnswered={userHasAnswered}
              onAnswerClick={handlers.handleAnswerClick}
              onNextQuestionClick={handlers.handleNextQuestionClick}
              onTimerFinished={handlers.handleTimerFinished}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="main">
        {renderContent()}
      </main>
    </div>
  )
}

export { App }