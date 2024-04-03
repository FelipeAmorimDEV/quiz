import { CountdownTimer } from "./countdown-timer"

const QuizComponent = ({ state, userHasAnswered, onAnswerClick, onNextQuestionClick, onTimerFinished }) => {
  const totalSeconds = state.quizData.length * 30

  return (
    <>
      <div>
        <h4>{state.quizData[state.currentQuestion].question}</h4>
        <ul className="options">
          {state.quizData[state.currentQuestion].options.map((option, index) => {
            const answerClass = state.userAnswer === index ? 'answer' : ''
            const correctOrWrongClass = userHasAnswered
              ? state.quizData[state.currentQuestion].correctOption === index
                ? 'correct'
                : 'wrong'
              : ''

            return (
              <li key={option}>
                <button
                  className={`btn btn-option ${answerClass} ${correctOrWrongClass}`}
                  onClick={() => onAnswerClick(index)}
                  disabled={userHasAnswered}
                >
                  {option}
                </button>
              </li>
            )
          }
          )}
        </ul>
      </div>

      <div>
        {userHasAnswered &&
          <button className="btn btn-ui" onClick={onNextQuestionClick}>
            {state.currentQuestion === state.quizData.length - 1 ? 'Finalizar' : 'Próxima'}
          </button>}
        <div className="timer">
          <CountdownTimer seconds={totalSeconds} onTimerFinished={onTimerFinished} />
        </div>
      </div>
    </>
  )
}

export { QuizComponent }