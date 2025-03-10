// src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css';
import { FaCheck, FaTimes, FaUnlock } from 'react-icons/fa';

const Quiz = ({ onComplete, navigateToNext }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const questions = [
    {
      questionText: 'What is phishing?',
      explanation: 'Phishing is a cybercrime where attackers send fraudulent messages designed to trick people into revealing sensitive information or installing malware.',
      answerOptions: [
        { answerText: 'A type of fish', isCorrect: false },
        { answerText: 'A fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity', isCorrect: true },
        { answerText: 'A networking protocol', isCorrect: false },
        { answerText: 'A type of encryption', isCorrect: false },
      ],
    },
    {
      questionText: 'What does MFA stand for in cybersecurity?',
      explanation: 'Multi-Factor Authentication adds an additional layer of security by requiring users to provide two or more verification factors to gain access to a resource.',
      answerOptions: [
        { answerText: 'Multiple Factor Analysis', isCorrect: false },
        { answerText: 'Master File Access', isCorrect: false },
        { answerText: 'Multi-Factor Authentication', isCorrect: true },
        { answerText: 'Managed Firewall Application', isCorrect: false },
      ],
    },
    {
      questionText: 'Which of the following is NOT a common type of malware?',
      explanation: 'Safeguard is not a type of malware; it\'s actually a term for protective measures. Viruses, worms, and Trojan horses are all common types of malicious software.',
      answerOptions: [
        { answerText: 'Virus', isCorrect: false },
        { answerText: 'Worm', isCorrect: false },
        { answerText: 'Trojan Horse', isCorrect: false },
        { answerText: 'Safeguard', isCorrect: true },
      ],
    },
    {
      questionText: 'What is a firewall used for?',
      explanation: 'Firewalls act as a barrier between your trusted internal network and untrusted external networks, monitoring and controlling incoming and outgoing network traffic.',
      answerOptions: [
        { answerText: 'To cool down the computer', isCorrect: false },
        { answerText: 'To monitor and filter incoming and outgoing network traffic', isCorrect: true },
        { answerText: 'To increase internet speed', isCorrect: false },
        { answerText: 'To encrypt data', isCorrect: false },
      ],
    },
    {
      questionText: 'What is the purpose of encryption?',
      explanation: 'Encryption converts information into a code to prevent unauthorized access, making data unreadable to anyone without the proper decryption key.',
      answerOptions: [
        { answerText: 'To make data unreadable to unauthorized users', isCorrect: true },
        { answerText: 'To speed up data transfer', isCorrect: false },
        { answerText: 'To compress data', isCorrect: false },
        { answerText: 'To delete data securely', isCorrect: false },
      ],
    },
  ];

  useEffect(() => {
    // Reset the feedback state when moving to a new question
    setShowFeedback(false);
    setSelectedAnswer(null);
  }, [currentQuestion]);

  const handleAnswerClick = (isCorrect, index) => {
    setSelectedAnswer(index);
    setIsCorrect(isCorrect);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      if (score + (isCorrect ? 1 : 0) >= questions.length * 0.7) {
        onComplete && onComplete();
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <div className="quiz">
      {showScore ? (
        <div className="score-section">
          <h2>You scored {score} out of {questions.length}</h2>
          <p>{Math.round((score / questions.length) * 100)}% correct</p>
          {score === questions.length ? (
            <p className="perfect-score">Perfect score! You're a cybersecurity expert!</p>
          ) : score >= questions.length * 0.7 ? (
            <p className="good-score">Good job! You have solid cybersecurity knowledge.</p>
          ) : (
            <p className="improve-score">Keep learning about cybersecurity concepts!</p>
          )}
          
          <div className="button-group">
            <button className="reset-button" onClick={resetQuiz}>
              Try Again
            </button>
            {score >= questions.length * 0.7 && (
              <button className="next-level-button" onClick={navigateToNext}>
                Go to Level 2 <FaUnlock style={{ marginLeft: '8px' }} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            ></div>
          </div>
          
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
                onClick={() => handleAnswerClick(answerOption.isCorrect, index)}
                className={`answer-button ${
                  selectedAnswer === index 
                    ? answerOption.isCorrect 
                      ? 'correct' 
                      : 'incorrect' 
                    : ''
                }`}
                disabled={showFeedback}
              >
                {answerOption.answerText}
                {selectedAnswer === index && (
                  <span className="answer-icon">
                    {answerOption.isCorrect ? (
                      <FaCheck style={{ color: '#10b981' }} />
                    ) : (
                      <FaTimes style={{ color: '#ef4444' }} />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {showFeedback && (
            <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
              <p>{isCorrect ? 'Correct!' : 'Incorrect!'}</p>
              <p className="explanation">{questions[currentQuestion].explanation}</p>
              <button className="next-button" onClick={handleNextQuestion}>
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;