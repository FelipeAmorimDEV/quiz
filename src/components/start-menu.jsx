const StartMenu = ({ onStartQuizClick, state }) => {
  return (
    <div className="start">
      <h2>Bem vindo(a) ao Quiz dos Videogames!</h2>
      <h3>{state.quizData.length} questões pra te testar</h3>
      <button className="btn" onClick={onStartQuizClick}>Bora começar</button>
    </div>
  )
}

export { StartMenu }