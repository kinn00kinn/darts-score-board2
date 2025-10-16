// src/components/Leaderboard.jsx
import React from 'react';
import './components.css';

const Leaderboard = ({ players, onAddPlayer, onReset, onNameChange, currentPlayerId }) => {
  return (
    <div className="leaderboard widget">
      <h3>👑 LEADERBOARD (Top 10)</h3>
      <ol>
        {/* players配列をmapする前にsliceを追加 */}
        {players.slice(0, 10).map((player) => (
          <li
            key={player.id}
            className={player.id === currentPlayerId ? 'current-player' : ''}
          >
            <input
              type="text"
              value={player.name}
              onChange={(e) => onNameChange(player.id, e.target.value)}
              className="player-name-input"
            />
            <span>{player.score}</span>
          </li>
        ))}
      </ol>
      <div className="leaderboard-controls">
        <button onClick={onAddPlayer}>プレイヤー追加</button>
        <button onClick={onReset} className="reset-btn">スコアリセット</button>
      </div>
    </div>
  );
};

export default Leaderboard;