import { useReducer, useEffect } from "react"

import { AppHeader } from './components/app-header'
import { StartMenu } from './components/start-menu'
import { ResultScreen } from './components/result-screen'
import { ProgressIndicator } from './components/progress-indicator'
import { QuizComponent } from './components/quiz-component'
import { useQuiz } from "./hooks/use-quiz"

const App = () => {
  const { state, handlers } = useQuiz()

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