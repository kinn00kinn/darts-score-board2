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

// 親から渡されるpropをonAddScoreに変更
const DartArea = ({ onAddScore }) => {
  const [playerName, setPlayerName] = useState(''); // 名前を管理するstateを追加
  const [turnScore, setTurnScore] = useState(0);
  const [throws, setThrows] = useState([]);
  const [hoveredArea, setHoveredArea] = useState(null);

  const handleHit = (area) => {
    if (throws.length >= 3) return;
    const score = getScoreValue(area);
    setThrows([...throws, { area, score }]);
    setTurnScore(prev => prev + score);
  };

  const resetTurn = () => {
    setThrows([]);
    setTurnScore(0);
  };

  const undoLastThrow = () => {
    if (throws.length === 0) return;
    const lastThrow = throws.pop();
    setTurnScore(prev => prev - lastThrow.score);
    setThrows([...throws]);
  };

  // 確定ボタンのロジックを変更
  const confirmScore = () => {
    // 名前の入力チェック
    if (!playerName.trim()) {
      alert('名前を入力してください');
      return;
    }
    // 親の関数を呼び出し、名前とスコアを渡す
    onAddScore(playerName, turnScore);

    // 入力内容をリセット
    setPlayerName('');
    resetTurn();
  };

  return (
    <div className="dart-area-container">
      <div className="control-panel">
        {/* 名前入力フォームに変更 */}
        <div className="player-input-area">
          <span>Player Name</span>
          <input
            type="text"
            className="player-name-input"
            placeholder="名前を入力..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <div className="score-display">
          <span>Turn Score</span>
          <p>{turnScore}</p>
          <div className="throw-history">
            {throws.map((t) => t.area).join(' → ')}
          </div>
        </div>
        <div className="action-buttons">
          <button onClick={undoLastThrow} disabled={throws.length === 0}>Undo</button>
          <button onClick={resetTurn} className="reset">Reset</button>
          <button onClick={confirmScore} className="confirm">スコアを追加</button>
        </div>
      </div>

      <div className="dartboard-wrapper">
        <Dartboard onHit={handleHit} onHover={setHoveredArea} />
        {hoveredArea && (
          <div className="hover-info">
            {hoveredArea}: {getScoreValue(hoveredArea)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DartArea;