// src/components/Scoreboard.jsx
import React, { useState, useEffect } from 'react';
import './components.css';

const Scoreboard = ({ playerName, score, currentTurnThrows = [], turnScore }) => {
  const [animate, setAnimate] = useState(false);

  // turnScoreが変化したときにアニメーションを発火させる
  useEffect(() => {
    if (turnScore > 0) {
      setAnimate(true);
      // アニメーションが終わったらクラスを削除
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [turnScore]);
  
  return (
    <div className="scoreboard widget">
      <h3>{playerName || 'Player'} のターン</h3>
      <div className="score-display-wrapper">
        <div className="main-score">{score}</div>
        {turnScore > 0 && (
          <div className={`turn-score ${animate ? 'score-hit-animation' : ''}`}>
            - {turnScore}
          </div>
        )}
      </div>
      <div className="throw-history">
        <span>投げた場所: </span>
        <span>{currentTurnThrows.join(', ') || '-'}</span>
      </div>
    </div>
  );
};

export default Scoreboard;