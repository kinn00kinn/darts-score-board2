// src/components/Leaderboard.jsx
import React from 'react';

// ▼▼▼ 変更：showAdminControls を props で受け取る ▼▼▼
const Leaderboard = ({ players, onPlayerSelect }) => {
  return (
    <div className="leaderboard-container">
      <h2>👑 LEADERBOARD</h2>
      <ol className="player-list">
        {players.length > 0 ? (
          players.map((player, index) => (
            <li
              key={player.id}
              className={`player-item ${index < 3 ? `rank-${index + 1}` : ''}`}
              onClick={() => onPlayerSelect(player)}
            >
              <span className="rank">{index + 1}</span>
              <span className="name">{player.name}</span>
              <span className="score">{player.score.toLocaleString()}</span>
            </li>
          ))
        ) : (
          <p className="no-players">プレイヤーがいません</p>
        )}
      </ol>
      
    </div>
  );
};

export default Leaderboard;