import React, { useEffect, useState  } from "react";
import "./QuestionContainer.css";
import axios from "axios";
import ScoreModal from "../ScoreModal/ScoreModal";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import he from "he";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const QuestionContainer = () => {
  const [counter, setCounter] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [data, setData] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answerSubmited, setAnswerSubmited] = useState<boolean>(true)
  const AlphabetArray: string[] = ["A", "B", "C", "D"];

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=1&id=${counter}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.results);
          setAnswers(shuffleArray(res.data.results[0]));
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [counter]);

  //Function Responsaible to shuffle the correct answer with the wrong ones to the correct answer takes different places in each question
  const shuffleArray = (question: Question) => {
    let originalAnswersArray = [
      question.correct_answer,
      ...question.incorrect_answers,
    ];
    for (let i = originalAnswersArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [originalAnswersArray[i], originalAnswersArray[j]] = [
        originalAnswersArray[j],
        originalAnswersArray[i],
      ];
    }
    return originalAnswersArray;
  };

  //Function Responsaible for comparing user selected answer with the correct answer
  const compareAnswers = () => {
    if (selectedAnswer === data[0].correct_answer) {
      setScore(score + 1)

      // Change the answer to green color
      const correctAnswerBtn = document.getElementById(`${data[0].correct_answer}`)
      if (correctAnswerBtn) {
        correctAnswerBtn.classList.add("correct");
      }

    } else {
      //Set selcted answer to red
      const button = document.querySelector('.selected');
      if (button) {
        button.classList.add("incorrect");
      }

      //then make the right one green
      const correctAnswerBtn = document.getElementById(`${data[0].correct_answer}`)
      if (correctAnswerBtn) {
        correctAnswerBtn.classList.add("correct");
      }
    }
  };

  //Function Responsaible for when the user clicks on the any answer (button)
  const ButtonHandler = (e: any) => {
   setIsDisabled(false)
    // Get all the button elements
    const buttons = document.querySelectorAll("button");

    // Iterate through each button element and remove the class name 'selected'
    buttons.forEach((button) => {
      button.classList.remove("selected");
    });

    // Find the closest button element to the clicked element
    const button = e.target.closest("button");

    // Add your desired class name to the found button element
    if (button) {
      button.classList.add("selected");
    }

    //Set the final clicked button element to selected answer
    setSelectedAnswer(e.target.getAttribute(["data-answer-atr"]));
  };

  //Function Responsaible for when the user clicks on submit (button)
  const submitHandler = () => {
    setAnswerSubmited(false)
    compareAnswers();
  };

  const nextBtnHandler = () => {
    if (counter < 10) {
      setCounter(counter + 1);
      setAnswerSubmited(true)

    } else {
      // Exam ended after 10 questions
      setCounter(0); // Reset the counter state for future exams
      setData([]); // Clear the data state
    }
  }

  const resetQuiz = () => {
    //reset the score to 0
    setScore(0)
    setCounter(0)
  }

  return (
    <>
      {counter < 10 && !!data.length && data[0] && (
        <div id="QuestionContainer">
          <h1>{counter + 1 + "/10"}</h1>
          <h1>{he.decode(data[0].question)}</h1>
          <div id="AnswersContainer">
            {answers.map((answer, index) => {
              return (
                <button
                  data-answer-atr={answer}
                  key={answer}
                  id={answer}
                  onClick={(e) => {
                    ButtonHandler(e);
                  }}
                >
                  <label data-answer-atr={answer} className="AnswerNumber">
                    {AlphabetArray[index]}
                  </label>
                  <label data-answer-atr={answer}>{he.decode(answer)}</label>
                </button>
              );
            })}
          </div>
          {answerSubmited === true ?
            <button
              id="SubmitBtn"
              type="submit"
              disabled={isDisabled}
              onClick={() => {
                submitHandler();
              }}
            >Submit</button> :

            <button
              type="submit"
              onClick={() => {
                nextBtnHandler()
              }}
            >Next</button>}

        </div>
      )}
      {!data.length && <LoadingSpinner></LoadingSpinner>}
      {counter >= 10 && !!score && <ScoreModal score={score} retry={resetQuiz} />}
    </>
  );
};

export default QuestionContainer;
