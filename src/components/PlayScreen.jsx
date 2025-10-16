import React, { useState } from 'react';
import Dartboard from './Dartboard.jsx';
import Scoreboard from './Scoreboard.jsx';
import TurnControls from './TurnControls.jsx';
import { calculateScore } from '../utils/scoreCalculator.js';
import './components.css';

const PlayScreen = ({ player, onTurnEnd }) => {
  const [currentTurnThrows, setCurrentTurnThrows] = useState([]);
  const [turnHistory, setTurnHistory] = useState([]);
  const [hoveredArea, setHoveredArea] = useState(null);

  const currentTurnScore = currentTurnThrows.reduce((sum, area) => sum + calculateScore(area), 0);

  const handleHit = (area) => {
    if (currentTurnThrows.length < 3) {
      setCurrentTurnThrows([...currentTurnThrows, area]);
      setTurnHistory([]);
    }
  };

  const handleUndo = () => {
    if (currentTurnThrows.length > 0) {
      const lastThrow = currentTurnThrows[currentTurnThrows.length - 1];
      setTurnHistory([lastThrow, ...turnHistory]);
      setCurrentTurnThrows(currentTurnThrows.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (turnHistory.length > 0) {
      const nextThrow = turnHistory[0];
      setCurrentTurnThrows([...currentTurnThrows, nextThrow]);
      setTurnHistory(turnHistory.slice(1));
    }
  };

  const handleReset = () => {
    setCurrentTurnThrows([]);
    setTurnHistory([]);
  };

  const handleConfirm = () => {
    onTurnEnd(currentTurnScore);
  };

  return (
    <div className="play-screen">
      <Scoreboard
        playerName={player?.name || 'プレイヤー待機中...'}
        score={player?.score ?? 0}
        currentTurnThrows={currentTurnThrows}
        turnScore={currentTurnScore}
      />
      <TurnControls
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        onConfirm={handleConfirm}
        canConfirm={currentTurnThrows.length > 0 && !!player}
      />
      <div className="dartboard-container">
        <Dartboard onHit={handleHit} onHover={setHoveredArea} />
        {hoveredArea && (
          <div className="hover-info">
            {hoveredArea}: {calculateScore(hoveredArea)}点
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayScreen;

