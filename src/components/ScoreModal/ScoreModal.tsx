import React from 'react'
import "./ScoreModal.css"

interface scoreProps {
  score: number;
  retry : ()=>void
}

const ScoreModal = (props: scoreProps) => {

  return (
    <div id="myModal" className="modal">

      <div className="modal-content">
        <span className="close"></span>
        <h1>Quiz Ended. Your Final Score is: {props.score}</h1>
        <button onClick={props.retry}>Retry</button>
      </div>

    </div>

  )
}

export default ScoreModal