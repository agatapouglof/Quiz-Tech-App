import React, { useRef, useState, useEffect } from "react";
import "./Quiz.css";
import { data } from "../../data";
import { data as dataNew } from "../../data-new";
import { Option } from "./Answer/Answer";
import { useQuizStore } from "../../store/quizStore";

export default function Quiz() {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(data[index]);
  const [currentQuestion, setCurrentQuestion] = useState(dataNew[0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedOption, setSelectedOption] = useState(undefined);

  const {
    resetStoredScore,
    resetSelectedOptions,
    storedScore,
    increaseStoredScore,
    storedQuestion,
    updateCurrentQuestion,
    selectedOptions,
  } = useQuizStore();
  // updateCurrentQuestion(dataNew[0]);

  // initalize the data
  useEffect(() => {
    updateCurrentQuestion(dataNew[0]);
  }, []);

  useEffect(() => {
    if (result) {
      let currentProgress = 0;
      const targetProgress = (storedScore / dataNew.length) * 100;
      const interval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        if (currentProgress >= targetProgress) {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [result, score]);

  const selectResponse = (element, index) => {
    // checkAns(e, questions.ans);
    if (!lock) {
      if (selectedOption === index) {
        element.target.classList.remove("selected");
        setSelectedOption(undefined);
      } else {
        element.target.classList.add("selected");
        setSelectedOption(index);
      }
    }
  };

  const checkAns = (e, ans) => {
    // e.target.classList.add("selected");
    // return ;
    if (!lock) {
      if (questions.ans === ans) {
        e.target.classList.add("correct");

        setLock(true);
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        setLock(true);
        optionArray[questions.ans - 1].current.classList.add("correct");
      }
    }
  };

  const checkAnswer = () => {
    const goodOptions = storedQuestion?.options
      .filter((option) => option?.correct)
      .map((option) => option.uuid);

    if (selectedOptions.length !== goodOptions.length) return false;
    const isGoodAnswer = goodOptions.every((option) =>
      selectedOptions.includes(option),
    )
      ? true
      : false;

    return isGoodAnswer;
  };

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);

  const optionArray = [Option1, Option2, Option3, Option4];
  const next = () => {
    if (lock) {
      if (index === dataNew.length - 1) {
        setResult(true);
        setLock(false);
        return;
      }
      setIndex(index + 1);
      setQuestions(dataNew[index + 1]);
      const nextQuestion = dataNew[index + 1];

      setCurrentQuestion(dataNew[index + 1]);
      updateCurrentQuestion(nextQuestion);
      resetSelectedOptions();

      setLock(false);
    }
  };

  const submitAnswer = () => {
    setLock(true);
    const isValidAnswer = checkAnswer();
    if (isValidAnswer) {
      increaseStoredScore();
    }
  };

  const resetBtn = () => {
    setResult(false);
    setLock(false);
    setIndex(0);
    setQuestions(dataNew[0]);
    setCurrentQuestion(dataNew[0]);
    resetSelectedOptions();
    resetStoredScore(0);
    setScore(0);
    setProgress(0);
  };

  return (
    <div className="container">
      <div className="quiz-container">
        <h1 className="heading">Quizzz Tech</h1>
        <h1 className="heading">Score {storedScore}</h1>
        <hr />

        {!result ? (
          <>
            <h2 className="quiz-question">
              {index + 1}. {currentQuestion.question}
            </h2>
            {currentQuestion?.options.map((option, index) => (
              <Option
                uuid={option.uuid}
                selectResponse={selectResponse}
                key={currentQuestion.uuid + "_" + index}
                id={currentQuestion.uuid + "_" + index}
                correct={option.correct}
                text={option.text}
                lock={lock}
              />
            ))}
            <div className="quiz-bottom">
              <p className="ques-no">
                {index + 1}/{data.length} Questions
              </p>

              <div className="validation-buttons">
                <button onClick={submitAnswer} className="next-btn">
                  {"Submit"}
                </button>
                <button onClick={next} className="next-btn">
                  {index + 1 === data.length ? "Submit" : "Continue"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div
              className="progress-circular"
              style={{
                background: `conic-gradient(#c40094 ${progress * 3.6}deg, #ededed 0deg)`,
              }}
            >
              <div className="value">{progress.toFixed(0)}%</div>
            </div>
            correct
            <h2 className="result-heading">
              You Scored {storedScore} out of {data.length}
            </h2>
            <button onClick={resetBtn} className="reset-btn">
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
