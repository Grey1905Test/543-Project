// src/components/Quiz.js
import React, { useState } from 'react';
import '../styles/Quiz.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      questionText: 'What is phishing?',
      answerOptions: [
        { answerText: 'A type of fish', isCorrect: false },
        { answerText: 'A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity', isCorrect: true },
        { answerText: 'A networking protocol', isCorrect: false },
        { answerText: 'A type of encryption', isCorrect: false },
      ],
    },
    {
      questionText: 'What does MFA stand for in cybersecurity?',
      answerOptions: [
        { answerText: 'Multiple Factor Analysis', isCorrect: false },
        { answerText: 'Master File Access', isCorrect: false },
        { answerText: 'Multi-Factor Authentication', isCorrect: true },
        { answerText: 'Managed Firewall Application', isCorrect: false },
      ],
    },
    {
      questionText: 'Which of the following is NOT a common type of malware?',
      answerOptions: [
        { answerText: 'Virus', isCorrect: false },
        { answerText: 'Worm', isCorrect: false },
        { answerText: 'Trojan Horse', isCorrect: false },
        { answerText: 'Safeguard', isCorrect: true },
      ],
    },
    {
      questionText: 'What is a firewall used for?',
      answerOptions: [
        { answerText: 'To cool down the computer', isCorrect: false },
        { answerText: 'To monitor and filter incoming and outgoing network traffic', isCorrect: true },
        { answerText: 'To increase internet speed', isCorrect: false },
        { answerText: 'To encrypt data', isCorrect: false },
      ],
    },
    {
      questionText: 'What is the purpose of encryption?',
      answerOptions: [
        { answerText: 'To make data unreadable to unauthorized users', isCorrect: true },
        { answerText: 'To speed up data transfer', isCorrect: false },
        { answerText: 'To compress data', isCorrect: false },
        { answerText: 'To delete data securely', isCorrect: false },
      ],
    },
  ];

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
  };

  return (
    <div className="quiz">
      {showScore ? (
        <div className="score-section">
          <h2>You scored {score} out of {questions.length}</h2>
          <p>{(score / questions.length) * 100}% correct</p>
          {score === questions.length ? (
            <p className="perfect-score">Perfect score! You're a cybersecurity expert!</p>
          ) : score >= questions.length * 0.7 ? (
            <p className="good-score">Good job! You have solid cybersecurity knowledge.</p>
          ) : (
            <p className="improve-score">Keep learning about cybersecurity concepts!</p>
          )}
          <button className="reset-button" onClick={resetQuiz}>Try Again</button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">{questions[currentQuestion].questionText}</div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].answerOptions.map((answerOption, index) => (
              <button
                key={index}
                onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}
                className="answer-button"
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;