const ResultScreen = ({ onResetQuizClick, state, maxScore }) => {
  const percentage = (state.userScore * 100) / maxScore
  const resultMsg = {
    '0': "😥 Poxa, você",
    '20': "😑 Você fez",
    '40': "😐 Opa! Você",
    '60': "😉 Legal! Você",
    '80': "😎 Muito bom! Você",
    '100': "🏆 Caramba! Você"
  }[`${percentage}`]

  return (
    <>
      <div className="result">
        <span>{resultMsg} {state.userScore} pontos de {maxScore} ({percentage}%)</span>
      </div>
      <button className="btn btn-ui" onClick={onResetQuizClick}>Reiniciar Quiz</button>
    </>
  )
}

export { ResultScreen }