// src/components/CyberGame.js
import React, { useState, useEffect } from 'react';
import '../styles/CyberGame.css';
import { FaLock, FaLockOpen, FaShieldAlt, FaUserSecret, FaServer, FaWifi, FaDatabase, FaVirus, FaCheck } from 'react-icons/fa';

const CyberGame = ({ onComplete }) => {
  const [gameState, setGameState] = useState('intro');
  const [securityLevel, setSecurityLevel] = useState(0);
  const [threats, setThreats] = useState([]);
  const [activeThreats, setActiveThreats] = useState([]);
  const [defenses, setDefenses] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [time, setTime] = useState(60);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Define all possible threats
  const allThreats = [
    { id: 1, type: 'phishing', name: 'Phishing Attack', icon: <FaUserSecret />, impact: 2, description: 'An attempt to steal sensitive information by pretending to be a trustworthy entity.' },
    { id: 2, type: 'malware', name: 'Malware', icon: <FaVirus />, impact: 3, description: 'Malicious software designed to disrupt, damage, or gain unauthorized access to a computer system.' },
    { id: 3, type: 'ddos', name: 'DDoS Attack', icon: <FaServer />, impact: 4, description: 'Distributed Denial of Service attack that makes your network resources unavailable.' },
    { id: 4, type: 'mitm', name: 'Man-in-the-Middle', icon: <FaWifi />, impact: 3, description: 'Attack where the attacker secretly relays and possibly alters communications between two parties.' },
    { id: 5, type: 'sql', name: 'SQL Injection', icon: <FaDatabase />, impact: 3, description: 'An attack that inserts malicious code into a website database to steal or manipulate data.' },
  ];

  // Define all possible defenses
  const allDefenses = [
    { id: 1, type: 'firewall', name: 'Firewall', icon: <FaShieldAlt />, effectiveness: 2, cost: 1, description: 'Monitors and filters incoming and outgoing network traffic.' },
    { id: 2, type: 'encryption', name: 'Encryption', icon: <FaLock />, effectiveness: 3, cost: 2, description: 'Encodes information so only authorized parties can access it.' },
    { id: 3, type: 'auth', name: 'Multi-Factor Auth', icon: <FaLockOpen />, effectiveness: 3, cost: 2, description: 'Requires multiple methods to verify user identity.' },
    { id: 4, type: 'patching', name: 'Security Patching', icon: <FaServer />, effectiveness: 4, cost: 3, description: 'Regularly updating software to fix security vulnerabilities.' },
    { id: 5, type: 'training', name: 'Security Training', icon: <FaUserSecret />, effectiveness: 2, cost: 1, description: 'Teaching users to recognize and avoid security threats.' },
  ];

  // Effectiveness matrix (which defenses are effective against which threats)
  const effectivenessMatrix = {
    phishing: ['training', 'auth'],
    malware: ['firewall', 'patching'],
    ddos: ['firewall'],
    mitm: ['encryption', 'auth'],
    sql: ['patching', 'firewall'],
  };

  useEffect(() => {
    // Initialize the game when starting
    if (gameState === 'playing') {
      initializeRound();
    }
  }, [gameState]);

  useEffect(() => {
    // Timer countdown
    let timer;
    if (gameState === 'playing' && time > 0) {
      timer = setTimeout(() => setTime(time - 1), 1000);
    } else if (time === 0 && gameState === 'playing') {
      endRound();
    }
    return () => clearTimeout(timer);
  }, [time, gameState]);

  const initializeRound = () => {
    // Generate random threats for this round
    const numThreats = Math.min(round, 3);
    let roundThreats = [];
    
    // Select random threats without duplicates
    const availableThreats = [...allThreats];
    for (let i = 0; i < numThreats; i++) {
      if (availableThreats.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableThreats.length);
        roundThreats.push(availableThreats[randomIndex]);
        availableThreats.splice(randomIndex, 1);
      }
    }
    
    setThreats(roundThreats);
    setActiveThreats(roundThreats);
    setDefenses([]);
    setTime(60);
    setMessage(`Round ${round}: Defend your system against ${numThreats} threats!`);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const purchaseDefense = (defense) => {
    // Check if we already have this defense
    if (defenses.find(d => d.id === defense.id)) {
      setMessage("You already have this defense!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
      return;
    }
    
    // Check if we can afford it
    if (securityLevel >= defense.cost) {
      setSecurityLevel(securityLevel - defense.cost);
      setDefenses([...defenses, defense]);
      
      // Check if this defense counters any active threats
      let remainingThreats = [...activeThreats];
      let pointsEarned = 0;
      
      activeThreats.forEach(threat => {
        if (effectivenessMatrix[threat.type].includes(defense.type)) {
          pointsEarned += threat.impact;
          remainingThreats = remainingThreats.filter(t => t.id !== threat.id);
          
          setMessage(`${defense.name} countered ${threat.name}! +${threat.impact} points`);
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 2000);
        }
      });
      
      if (pointsEarned > 0) {
        setScore(score + pointsEarned);
      }
      
      setActiveThreats(remainingThreats);
      
      // Check if all threats are countered
      if (remainingThreats.length === 0) {
        // Round complete!
        setTimeout(() => {
          setSecurityLevel(securityLevel + 2); // Bonus for completing the round
          setMessage("All threats neutralized! +2 security resources");
          setShowMessage(true);
          setTimeout(() => {
            if (round >= 3) {
              endGame();
            } else {
              setRound(round + 1);
              initializeRound();
            }
          }, 2000);
        }, 500);
      }
    } else {
      setMessage("Not enough security resources!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  const endRound = () => {
    // Calculate damage from remaining threats
    const damage = activeThreats.reduce((total, threat) => total + threat.impact, 0);
    
    setMessage(`Round ended! You took ${damage} damage from remaining threats.`);
    setShowMessage(true);
    
    setTimeout(() => {
      if (round >= 3) {
        endGame();
      } else {
        setRound(round + 1);
        setSecurityLevel(securityLevel + 3); // Resources for next round
        initializeRound();
      }
    }, 2000);
  };

  const endGame = () => {
    setGameState('complete');
    setGameCompleted(true);
    onComplete && onComplete();
  };

  const renderIntro = () => (
    <div className="game-intro">
      <h2>Cyber Defense Simulator</h2>
      <p>Welcome to the Cyber Defense Simulator! Your job is to protect your system from various cyber threats.</p>
      
      <div className="game-instructions">
        <h3>How to Play:</h3>
        <ol>
          <li>Each round, you'll face different cyber threats</li>
          <li>Purchase defenses to counter these threats</li>
          <li>Different defenses are effective against different threats</li>
          <li>You have limited security resources (shown at the top)</li>
          <li>Complete all three rounds to win!</li>
        </ol>
      </div>
      
      <button className="start-button" onClick={() => {
        setGameState('playing');
        setSecurityLevel(4); // Starting resources
      }}>
        Start Game
      </button>
    </div>
  );

  const renderGameplay = () => (
    <div className="game-container">
      <div className="game-header">
        <div className="game-stat">
          <span>Round:</span>
          <span className="stat-value">{round}/3</span>
        </div>
        <div className="game-stat">
          <span>Security Resources:</span>
          <span className="stat-value">{securityLevel}</span>
        </div>
        <div className="game-stat">
          <span>Score:</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="game-stat">
          <span>Time:</span>
          <span className="stat-value">{time}s</span>
        </div>
      </div>

      {showMessage && (
        <div className="game-message">
          {message}
        </div>
      )}

      <div className="game-board">
        <div className="threats-container">
          <h3>Active Threats</h3>
          {activeThreats.length > 0 ? (
            <div className="threats-list">
              {activeThreats.map(threat => (
                <div key={threat.id} className="threat-card">
                  <div className="threat-icon">{threat.icon}</div>
                  <div className="threat-info">
                    <h4>{threat.name}</h4>
                    <p>Impact: {threat.impact}</p>
                    <p className="threat-description">{threat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-message">No active threats!</div>
          )}
        </div>

        <div className="defenses-container">
          <h3>Available Defenses</h3>
          <div className="defenses-shop">
            {allDefenses.map(defense => (
              <div 
                key={defense.id} 
                className={`defense-card ${defenses.find(d => d.id === defense.id) ? 'owned' : ''}`}
                onClick={() => purchaseDefense(defense)}
              >
                <div className="defense-icon">{defense.icon}</div>
                <div className="defense-info">
                  <h4>{defense.name} {defenses.find(d => d.id === defense.id) && <FaCheck className="owned-icon" />}</h4>
                  <p>Cost: {defense.cost} | Effectiveness: {defense.effectiveness}</p>
                  <p className="defense-description">{defense.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="game-complete">
      <h2>Game Complete!</h2>
      <div className="final-score">
        <p>Final Score: <span>{score}</span></p>
      </div>
      
      <div className="game-summary">
        <h3>Cybersecurity Lessons:</h3>
        <ul>
          <li>Different types of threats require different defenses</li>
          <li>A layered security approach is most effective</li>
          <li>Resources are limited - prioritize your defenses</li>
          <li>Both technical defenses and user training are important</li>
          <li>Regular security updates are crucial for protection</li>
        </ul>
      </div>
      
      <button className="restart-button" onClick={() => {
        setGameState('intro');
        setRound(1);
        setScore(0);
        setSecurityLevel(0);
        setThreats([]);
        setActiveThreats([]);
        setDefenses([]);
      }}>
        Play Again
      </button>
    </div>
  );

  const renderContent = () => {
    switch(gameState) {
      case 'intro':
        return renderIntro();
      case 'playing':
        return renderGameplay();
      case 'complete':
        return renderComplete();
      default:
        return renderIntro();
    }
  };

  return (
    <div className="cyber-game">
      {renderContent()}
    </div>
  );
};

export default CyberGame;