import React, { useState } from 'react';
import './components.css';

const Leaderboard = ({ players, onAddPlayer, onReset, onPlayerSelect, currentPlayerId }) => {
  const [newPlayerName, setNewPlayerName] = useState('');

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  return (
    <div className="leaderboard widget">
      <h3>👑 LEADERBOARD (Top 10)</h3>
      <ol className="player-list">
        {players.slice(0, 10).map((player) => (
          <li
            key={player.id}
            className={`player-item ${player.id === currentPlayerId ? 'current-player' : ''}`}
            onClick={() => onPlayerSelect(player)}
          >
            <span className="player-name">{player.name}</span>
            <span className="player-score">{player.score}</span>
          </li>
        ))}
      </ol>
      <div className="leaderboard-controls">
        <div className="add-player-section">
          <input
            type="text"
            className="add-player-input"
            placeholder="新しいプレイヤー名"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAddPlayer} className="add-btn">追加</button>
        </div>
        <button onClick={onReset} className="reset-btn">スコアリセット</button>
      </div>
    </div>
  );
};

export default Leaderboard;
