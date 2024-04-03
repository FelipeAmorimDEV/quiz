const ProgressIndicator = ({ state, maxScore, userHasAnswered }) => {
  const answerProgress = userHasAnswered ? state.currentQuestion + 1 : state.currentQuestion

  return (
    <label className="progress">
      <progress value={answerProgress} max={5} />
      <span>Questão <strong>{state.currentQuestion + 1}</strong> / {state.quizData.length}</span>
      <span><strong>{state.userScore}</strong> / {maxScore}</span>
    </label>
  )
}

export { ProgressIndicator }