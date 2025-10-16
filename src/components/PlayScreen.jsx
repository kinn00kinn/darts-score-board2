// src/components/PlayScreen.jsx
import React, { useState, useEffect } from 'react';
import Dartboard from './Dartboard';
import Scoreboard from './Scoreboard';
import TurnControls from './TurnControls'; // 新しい入力補助コンポーネント
import { calculateScore } from '../utils/scoreCalculator';

const PlayScreen = ({ player, onTurnEnd }) => {
  const [currentTurnThrows, setCurrentTurnThrows] = useState([]);
  const [turnHistory, setTurnHistory] = useState([]); // Redo用
  const [hoveredArea, setHoveredArea] = useState(null); // ホバー中のエリア情報

  const currentTurnScore = currentTurnThrows.reduce((sum, area) => sum + calculateScore(area), 0);

  const handleHit = (area) => {
    if (currentTurnThrows.length < 3) {
      setCurrentTurnThrows([...currentTurnThrows, area]);
      setTurnHistory([]); // 新しい入力があったらRedo履歴はクリア
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
      <div className="left-panel">
        <Scoreboard 
          playerName={player.name}
          score={player.score} 
          currentTurnThrows={currentTurnThrows}
          turnScore={currentTurnScore}
        />
        <TurnControls 
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={handleReset}
          onConfirm={handleConfirm}
          canConfirm={currentTurnThrows.length > 0}
        />
      </div>
      <div className="right-panel">
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