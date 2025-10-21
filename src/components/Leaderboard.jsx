// src/components/Leaderboard.jsx
import React from 'react';

const Leaderboard = ({ players, onPlayerSelect, onResetScores, onNewGame }) => {
  return (
    <div className="leaderboard-container">
      <h2>👑 LEADERBOARD</h2>
      {/* CSSの変更に伴い、動的なstyle指定を削除 */}
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
      <div className="leaderboard-controls">
        <button onClick={onResetScores} className="control-btn">スコアリセット</button>
        <button onClick={onNewGame} className="control-btn new-game">新しいゲーム</button>
      </div>
    </div>
  );
};

export default Leaderboard;