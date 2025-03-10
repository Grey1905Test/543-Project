// src/components/PasswordFortress.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaLock, FaUnlock, FaKey, FaUserSecret, FaRobot, 
  FaBook, FaFileAlt, FaFingerprint, FaSyncAlt, FaCheck, 
  FaTimes, FaShieldAlt, FaExclamationTriangle, FaStar,
  FaLightbulb
} from 'react-icons/fa';
import '../styles/PasswordFortress.css';

const PasswordFortress = ({ onComplete }) => {
  const [gameState, setGameState] = useState('intro');
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [attacks, setAttacks] = useState([]);
  const [currentAttack, setCurrentAttack] = useState(null);
  const [attackResult, setAttackResult] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [passedLevels, setPassedLevels] = useState([]);
  const [usedHints, setUsedHints] = useState([]);

  // Dictionary of common words to check against
  const commonWords = [
    'password', 'qwerty', 'welcome', 'admin', 'letmein', 'monkey', 'abc123', '123456', 
    'football', 'iloveyou', 'dragon', 'master', 'sunshine', 'ashley', 'bailey', 'shadow', 
    'baseball', 'superman', 'trustno1', 'princess', 'batman', '123123', 'login'
  ];

  // Patterns to check against
  const patterns = [
    { regex: /^[a-zA-Z]+$/, name: 'letters only' },
    { regex: /^[0-9]+$/, name: 'numbers only' },
    { regex: /^[a-z]+$/, name: 'lowercase only' },
    { regex: /^[A-Z]+$/, name: 'uppercase only' },
    { regex: /12345|qwerty|asdfgh|zxcvbn/, name: 'keyboard sequence' },
    { regex: /(.)\1{2,}/, name: 'repeated characters' },
    { regex: /abc|123|321|cba/, name: 'simple sequence' }
  ];

  // Level definitions
  const levels = [
    {
      level: 1,
      name: "Password Basics",
      goal: "Create a password that meets basic requirements",
      requirements: [
        { check: (pw) => pw.length >= 8, description: "At least 8 characters long", points: 10 },
        { check: (pw) => /[A-Z]/.test(pw), description: "Contains uppercase letter", points: 10 },
        { check: (pw) => /[a-z]/.test(pw), description: "Contains lowercase letter", points: 10 },
        { check: (pw) => /[0-9]/.test(pw), description: "Contains a number", points: 10 }
      ],
      attacks: ["dictionary"],
      hint: "Mix uppercase, lowercase and numbers. Avoid common words."
    },
    {
      level: 2,
      name: "Enhanced Security",
      goal: "Create a stronger password that can resist multiple attacks",
      requirements: [
        { check: (pw) => pw.length >= 10, description: "At least 10 characters long", points: 10 },
        { check: (pw) => /[A-Z]/.test(pw), description: "Contains uppercase letter", points: 5 },
        { check: (pw) => /[a-z]/.test(pw), description: "Contains lowercase letter", points: 5 },
        { check: (pw) => /[0-9]/.test(pw), description: "Contains a number", points: 5 },
        { check: (pw) => /[^A-Za-z0-9]/.test(pw), description: "Contains a special character", points: 15 },
        { check: (pw) => !commonWords.some(word => pw.toLowerCase().includes(word)), description: "Doesn't contain common words", points: 10 }
      ],
      attacks: ["dictionary", "pattern"],
      hint: "Add special characters like @, #, $. Avoid patterns like 123 or abc."
    },
    {
      level: 3,
      name: "Master Password",
      goal: "Create a fortress-level password that passes all security checks",
      requirements: [
        { check: (pw) => pw.length >= 12, description: "At least 12 characters long", points: 10 },
        { check: (pw) => /[A-Z]/.test(pw), description: "Contains uppercase letter", points: 5 },
        { check: (pw) => /[a-z]/.test(pw), description: "Contains lowercase letter", points: 5 },
        { check: (pw) => /[0-9]/.test(pw), description: "Contains a number", points: 5 },
        { check: (pw) => /[^A-Za-z0-9]/.test(pw), description: "Contains a special character", points: 10 },
        { check: (pw) => !/(.)\1{2,}/.test(pw), description: "No repeated characters (3+)", points: 10 },
        { check: (pw) => !patterns.some(pattern => pattern.regex.test(pw)), description: "No common patterns", points: 15 },
        { check: (pw) => !commonWords.some(word => pw.toLowerCase().includes(word)), description: "No common words", points: 10 }
      ],
      attacks: ["dictionary", "pattern", "bruteforce"],
      hint: "Create a unique passphrase. Try combining random words with numbers and symbols placed in unpredictable positions."
    }
  ];

  // Initialize level
  const initializeLevel = useCallback(() => {
    setPassword('');
    setFeedback([]);
    setAttacks(levels[level - 1].attacks);
    setCurrentAttack(null);
    setAttackResult(null);
    setShowHint(false);
    
    // Set the level message
    setMessage(`Level ${level}: ${levels[level - 1].name} - ${levels[level - 1].goal}`);
    setShowMessage(true);
  }, [level]);

  useEffect(() => {
    // Initialize the game when starting a level
    if (gameState === 'playing') {
      initializeLevel();
    }
  }, [gameState, initializeLevel]);

  // Check password strength and provide feedback
  useEffect(() => {
    if (password.length === 0) {
      setStrength(0);
      setFeedback([]);
      return;
    }

    const currentLevelRequirements = levels[level - 1].requirements;
    const passedRequirements = currentLevelRequirements.filter(req => req.check(password));
    
    // Calculate strength percentage
    const totalPoints = currentLevelRequirements.reduce((total, req) => total + req.points, 0);
    const earnedPoints = passedRequirements.reduce((total, req) => total + req.points, 0);
    const strengthPercentage = Math.min(100, Math.floor((earnedPoints / totalPoints) * 100));
    
    setStrength(strengthPercentage);
    
    // Generate feedback
    const newFeedback = currentLevelRequirements.map(req => ({
      description: req.description,
      passed: req.check(password)
    }));
    
    setFeedback(newFeedback);
  }, [password, level]);

  // Simulate an attack
  const simulateAttack = (attackType) => {
    setCurrentAttack(attackType);
    let result = { success: false, message: "" };

    switch (attackType) {
      case "dictionary":
        // Check if password contains common words
        const foundWord = commonWords.find(word => 
          password.toLowerCase().includes(word.toLowerCase())
        );
        
        if (foundWord) {
          result = { 
            success: true, 
            message: `Dictionary attack successful! Found common word: "${foundWord}"` 
          };
        } else {
          result = { 
            success: false, 
            message: "Dictionary attack failed! No common words found." 
          };
        }
        break;
        
      case "pattern":
        // Check for common patterns
        const foundPattern = patterns.find(pattern => pattern.regex.test(password));
        
        if (foundPattern) {
          result = { 
            success: true, 
            message: `Pattern attack successful! Found pattern: ${foundPattern.name}` 
          };
        } else {
          result = { 
            success: false, 
            message: "Pattern attack failed! No common patterns detected." 
          };
        }
        break;
        
      case "bruteforce":
        // Estimate brute force time and determine if it's "crackable" in a reasonable time
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        let charsetSize = 0;
        if (hasLower) charsetSize += 26;
        if (hasUpper) charsetSize += 26;
        if (hasNumber) charsetSize += 10;
        if (hasSymbol) charsetSize += 33; // Approximately
        
        const combinations = Math.pow(charsetSize, password.length);
        const attemptsPerSecond = 1000000000; // 1 billion attempts per second (modern hardware)
        const secondsToCrack = combinations / attemptsPerSecond;
        
        let timeDescription;
        if (secondsToCrack < 60) {
          timeDescription = `${Math.floor(secondsToCrack)} seconds`;
          result.success = true;
        } else if (secondsToCrack < 3600) {
          timeDescription = `${Math.floor(secondsToCrack / 60)} minutes`;
          result.success = true;
        } else if (secondsToCrack < 86400) {
          timeDescription = `${Math.floor(secondsToCrack / 3600)} hours`;
          result.success = secondsToCrack < 24 * 3600; // Less than a day is considered crackable
        } else if (secondsToCrack < 31536000) {
          timeDescription = `${Math.floor(secondsToCrack / 86400)} days`;
          result.success = secondsToCrack < 30 * 86400; // Less than a month is considered crackable
        } else if (secondsToCrack < 31536000 * 100) {
          timeDescription = `${Math.floor(secondsToCrack / 31536000)} years`;
          result.success = false;
        } else {
          timeDescription = "millions of years";
          result.success = false;
        }
        
        result.message = result.success 
          ? `Brute force attack successful! Your password could be cracked in ${timeDescription}.`
          : `Brute force attack failed! It would take ${timeDescription} to crack your password.`;
        break;
        
      default:
        result = { success: false, message: "Unknown attack type" };
    }
    
    setAttackResult(result);
    
    // Update score based on attack result
    if (!result.success) {
      setScore(score + 15); // Bonus for defeating an attack
    }
    
    return result;
  };

  const checkPassword = () => {
    // Check if password meets all requirements
    const currentLevelRequirements = levels[level - 1].requirements;
    const allRequirementsMet = currentLevelRequirements.every(req => req.check(password));
    
    if (allRequirementsMet) {
      // Run all attack simulations for this level
      const attackResults = attacks.map(attack => simulateAttack(attack));
      const allAttacksPassed = attackResults.every(result => !result.success);
      
      if (allAttacksPassed) {
        // Level passed!
        const levelPoints = currentLevelRequirements.reduce((total, req) => total + req.points, 0);
        const bonusPoints = 50 - (usedHints.includes(level) ? 25 : 0); // Penalty if hint was used
        const totalPointsEarned = levelPoints + bonusPoints;
        
        setScore(score + totalPointsEarned);
        setPassedLevels([...passedLevels, level]);
        
        setMessage(`Level ${level} Complete! +${totalPointsEarned} points`);
        setShowMessage(true);
        
        setTimeout(() => {
          if (level >= levels.length) {
            // Game completed
            completeGame();
          } else {
            // Advance to next level
            setLevel(level + 1);
            initializeLevel();
          }
        }, 2000);
      } else {
        setMessage("Your password meets the basic requirements but failed security tests!");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    } else {
      setMessage("Your password doesn't meet all the requirements!");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const useHint = () => {
    if (!usedHints.includes(level)) {
      setUsedHints([...usedHints, level]);
    }
    setShowHint(true);
  };

  const completeGame = () => {
    setGameState('complete');
    setGameCompleted(true);
    onComplete && onComplete();
  };

  const getStrengthColor = () => {
    if (strength < 30) return '#ef4444'; // Red
    if (strength < 60) return '#f59e0b'; // Orange
    if (strength < 80) return '#3b82f6'; // Blue
    return '#10b981'; // Green
  };

  // Render the introduction screen
  const renderIntro = () => (
    <div className="password-intro">
      <h2>Password Fortress</h2>
      <p>Welcome to Password Fortress! Learn how to create strong, secure passwords that can withstand various attack methods.</p>
      
      <div className="game-instructions">
        <h3>How to Play:</h3>
        <ol>
          <li>Each level has specific password requirements</li>
          <li>Create passwords that meet these requirements</li>
          <li>Defend your password against simulated attacks</li>
          <li>Learn about real-world password security techniques</li>
          <li>Complete all three levels to become a password master!</li>
        </ol>
      </div>
      
      <button className="start-button" onClick={() => {
        setGameState('playing');
        setLevel(1);
        setScore(0);
      }}>
        Start Game
      </button>
    </div>
  );

  // Render the gameplay screen
  const renderGameplay = () => (
    <div className="password-container">
      <div className="game-header">
        <div className="game-stat">
          <span>Level:</span>
          <span className="stat-value">{level}/{levels.length}</span>
        </div>
        <div className="game-stat">
          <span>Score:</span>
          <span className="stat-value">{score}</span>
        </div>
      </div>

      {showMessage && (
        <div className="game-message">
          {message}
        </div>
      )}

      <div className="password-creator">
        <h3>Create Your Password</h3>
        <div className="password-input-wrapper">
          <FaLock className="password-icon" />
          <input
            type="text"
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..."
            autoComplete="new-password"
          />
        </div>
        
        <div className="strength-meter">
          <div className="strength-label">Password Strength: {strength}%</div>
          <div className="strength-bar">
            <div 
              className="strength-fill" 
              style={{ 
                width: `${strength}%`,
                backgroundColor: getStrengthColor()
              }}
            ></div>
          </div>
        </div>
        
        <div className="requirement-list">
          <h4>Requirements:</h4>
          {feedback.map((item, index) => (
            <div key={index} className={`requirement-item ${item.passed ? 'passed' : 'failed'}`}>
              {item.passed ? <FaCheck className="requirement-icon passed" /> : <FaTimes className="requirement-icon failed" />}
              <span>{item.description}</span>
            </div>
          ))}
        </div>
        
        {showHint && (
          <div className="hint-box">
            <FaLightbulb className="hint-icon" />
            <p>{levels[level - 1].hint}</p>
          </div>
        )}
        
        <div className="button-group">
          {!showHint && (
            <button className="hint-button" onClick={useHint}>
              <FaLightbulb /> Get Hint (-25 points)
            </button>
          )}
          <button 
            className="check-button" 
            onClick={checkPassword}
            disabled={password.length === 0 || strength === 0}
          >
            <FaShieldAlt /> Test Password
          </button>
        </div>
      </div>

      <div className="attack-simulator">
        <h3>Attack Simulator</h3>
        <p>Your password will be tested against these attack methods:</p>
        
        <div className="attack-types">
          {attacks.map((attack, index) => (
            <div key={index} className="attack-type">
              {attack === "dictionary" && <FaBook className="attack-icon" />}
              {attack === "pattern" && <FaFileAlt className="attack-icon" />}
              {attack === "bruteforce" && <FaRobot className="attack-icon" />}
              <span>
                {attack === "dictionary" && "Dictionary Attack"}
                {attack === "pattern" && "Pattern Analysis"}
                {attack === "bruteforce" && "Brute Force Attack"}
              </span>
            </div>
          ))}
        </div>
        
        {attackResult && (
          <div className={`attack-result ${attackResult.success ? 'failed' : 'passed'}`}>
            <h4>
              {attackResult.success 
                ? <><FaExclamationTriangle /> Attack Succeeded!</>
                : <><FaCheck /> Attack Defeated!</>
              }
            </h4>
            <p>{attackResult.message}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render the completion screen
  const renderComplete = () => (
    <div className="password-complete">
      <h2>Password Master!</h2>
      <div className="final-score">
        <FaStar className="score-icon" />
        <p>Final Score: <span>{score}</span></p>
      </div>
      
      <div className="game-summary">
        <h3>Password Security Lessons:</h3>
        <ul>
          <li>Use long passwords (12+ characters) for better security</li>
          <li>Mix uppercase, lowercase, numbers, and special characters</li>
          <li>Avoid common words, patterns, and personal information</li>
          <li>Different types of attacks require different defense strategies</li>
          <li>Consider using a password manager for your accounts</li>
          <li>Passphrases (multiple words with modifications) are both secure and memorable</li>
        </ul>
      </div>
      
      <button className="restart-button" onClick={() => {
        setGameState('intro');
        setLevel(1);
        setScore(0);
        setPassword('');
        setPassedLevels([]);
        setUsedHints([]);
      }}>
        Play Again
      </button>
    </div>
  );

  // Main render method
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
    <div className="password-fortress">
      {renderContent()}
    </div>
  );
};

export default PasswordFortress;