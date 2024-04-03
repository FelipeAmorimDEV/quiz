const ResultScreen = ({ onResetQuizClick, state, maxScore }) => {
  const percentage = (state.userScore * 100) / maxScore
  const resultMsg = percentage === 100 
    ? '🏆 Caramba!'
    : percentage >= 50
      ? '😎 Muito bom!'
      : percentage >= 20
       ? '😉 Legal!'
       : '😥 Poxa'
  
  return (
    <>
      <div className="result">
        <span>{resultMsg} Você fez {state.userScore} pontos de {maxScore} ({percentage}%)</span>
      </div>
      <button className="btn btn-ui" onClick={onResetQuizClick}>Reiniciar Quiz</button>
    </>
  )
}

export { ResultScreen }