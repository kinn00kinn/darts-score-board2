// src/components/DartArea.jsx
import React, { useState } from 'react';
import Dartboard from './Dartboard';

const getScoreValue = (area) => {
  if (area === 'BULL') return 25;
  if (area === 'DBULL') return 50;
  if (area === 'OUT') return 0;
  const multiplier = area.charAt(0);
  const number = parseInt(area.slice(1), 10);
  if (multiplier === 'S') return number;
  if (multiplier === 'D') return number * 2;
  if (multiplier === 'T') return number * 3;
  return 0;
};

// showDevControls propを追加
const DartArea = ({ onAddScore, boardOffset, setBoardOffset, boardScale, setBoardScale, showDevControls }) => {
  const [playerName, setPlayerName] = useState('');
  const [turnScore, setTurnScore] = useState(0);
  const [throws, setThrows] = useState([]);
  const [hoveredArea, setHoveredArea] = useState(null);

  const handleHit = (area) => {
    if (throws.length >= 3) return;
    const score = getScoreValue(area);
    setThrows([...throws, { area, score }]);
    setTurnScore(prev => prev + score);
  };

  const resetTurn = () => { setThrows([]); setTurnScore(0); };
  const undoLastThrow = () => {
    if (throws.length === 0) return;
    const lastThrow = throws.pop();
    setTurnScore(prev => prev - lastThrow.score);
    setThrows([...throws]);
  };
  const confirmScore = () => {
    if (!playerName.trim()) { alert('名前を入力してください'); return; }
    onAddScore(playerName, turnScore);
    setPlayerName(''); resetTurn();
  };

  const devControls = (
    <div className="dev-controls">
      <p>ダーツボード調整</p>
      <div>
        <label>横 (X): {boardOffset.x}px</label>
        <input type="range" min="-100" max="100" value={boardOffset.x} onChange={(e) => setBoardOffset(prev => ({ ...prev, x: parseInt(e.target.value) }))} />
      </div>
      <div>
        <label>縦 (Y): {boardOffset.y}px</label>
        <input type="range" min="-100" max="100" value={boardOffset.y} onChange={(e) => setBoardOffset(prev => ({ ...prev, y: parseInt(e.target.value) }))} />
      </div>
      <div>
        <label>大きさ: {boardScale.toFixed(2)}</label>
        <input type="range" min="0.5" max="1.5" step="0.01" value={boardScale} onChange={(e) => setBoardScale(parseFloat(e.target.value))} />
      </div>
    </div>
  );

  return (
    <div className="dart-area-container">
      {/* showDevControlsがtrueの時だけ表示 */}
      {showDevControls && devControls}
      <div className="control-panel">
        <div className="player-input-area">
          <span>Player Name</span>
          <input type="text" className="player-name-input" placeholder="名前を入力..." value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </div>
        <div className="score-display">
          <span>Turn Score</span>
          <p>{turnScore}</p>
          <div className="throw-history">{throws.map((t) => t.area).join(' → ')}</div>
        </div>
        <div className="action-buttons">
          <button onClick={undoLastThrow} disabled={throws.length === 0}>Undo</button>
          <button onClick={resetTurn} className="reset">Reset</button>
          <button onClick={confirmScore} className="confirm">スコアを追加</button>
        </div>
      </div>
      <div className="dartboard-wrapper" style={{ transform: `translate(${boardOffset.x}px, ${boardOffset.y}px) scale(${boardScale})` }}>
        <Dartboard onHit={handleHit} onHover={setHoveredArea} />
        {hoveredArea && (<div className="hover-info">{hoveredArea}: {getScoreValue(hoveredArea)}</div>)}
      </div>
    </div>
  );
};

export default DartArea;