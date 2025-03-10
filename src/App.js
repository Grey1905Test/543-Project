// src/App.js
import React, { useState } from 'react';
import './App.css';
import Quiz from './components/Quiz';
import CyberGame from './components/CyberGame';
import PasswordFortress from './components/PasswordFortress';
import { FaQuestionCircle, FaGamepad, FaLock, FaChevronLeft } from 'react-icons/fa';

function App() {
  const [currentLevel, setCurrentLevel] = useState('home');
  const [completedLevels, setCompletedLevels] = useState([]);

  const handleLevelComplete = (level) => {
    if (!completedLevels.includes(level)) {
      setCompletedLevels([...completedLevels, level]);
    }
  };

  const navigateToHome = () => {
    setCurrentLevel('home');
  };

  const renderContent = () => {
    switch (currentLevel) {
      case 'quiz':
        return (
          <>
            <button className="btn-back" onClick={navigateToHome}>
              <FaChevronLeft /> Back to Levels
            </button>
            <Quiz onComplete={() => handleLevelComplete('quiz')} navigateToNext={() => setCurrentLevel('game')} />
          </>
        );
      case 'game':
        return (
          <>
            <button className="btn-back" onClick={navigateToHome}>
              <FaChevronLeft /> Back to Levels
            </button>
            <CyberGame onComplete={() => handleLevelComplete('game')} />
          </>
        );
      case 'password':
        return (
          <>
            <button className="btn-back" onClick={navigateToHome}>
              <FaChevronLeft /> Back to Levels
            </button>
            <PasswordFortress onComplete={() => handleLevelComplete('password')} />
          </>
        );
      default:
        return (
          <div className="level-selector">
            <h2>Choose Your Challenge</h2>
            <div 
              className="level-card" 
              onClick={() => setCurrentLevel('quiz')}
            >
              <div className="level-icon">
                <FaQuestionCircle />
              </div>
              <div className="level-info">
                <h3>Level 1: Security Quiz</h3>
                <p>Test your knowledge of cybersecurity fundamentals with our interactive quiz.</p>
                {completedLevels.includes('quiz') && (
                  <span className="level-complete">✓ Completed</span>
                )}
              </div>
            </div>
            
            <div 
              className="level-card" 
              onClick={() => setCurrentLevel('game')}
            >
              <div className="level-icon">
                <FaGamepad />
              </div>
              <div className="level-info">
                <h3>Level 2: Security Simulator</h3>
                <p>Apply your knowledge in this interactive game to defend against cyber threats.</p>
                {completedLevels.includes('game') && (
                  <span className="level-complete">✓ Completed</span>
                )}
              </div>
            </div>
            
            <div 
              className="level-card" 
              onClick={() => setCurrentLevel('password')}
            >
              <div className="level-icon">
                <FaLock />
              </div>
              <div className="level-info">
                <h3>Level 3: Password Fortress</h3>
                <p>Master the art of creating secure passwords that withstand various attack methods.</p>
                {completedLevels.includes('password') && (
                  <span className="level-complete">✓ Completed</span>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CyberSecurity Project</h1>
        <p>Learn CyberSecurity with our game based platform!</p>
      </header>
      <main>
        {renderContent()}
      </main>
      <footer className="App-footer">
        <p>543-Cybersecurity Project</p>
      </footer>
    </div>
  );
}

export default App;