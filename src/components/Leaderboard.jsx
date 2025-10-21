// src/components/Leaderboard.jsx
import React from 'react';

// ▼▼▼ 変更：showAdminControls を props で受け取る ▼▼▼
const Leaderboard = ({ players, onPlayerSelect, onResetScores, onNewGame, showAdminControls }) => {
  
  // ▼▼▼ 追加：スコアリセット時の確認処理 ▼▼▼
  const handleResetScores = () => {
    if (window.confirm('本当にすべてのスコアをリセットしますか？')) {
      onResetScores();
    }
  };

  // ▼▼▼ 追加：新しいゲーム開始時の確認処理 ▼▼▼
  const handleNewGame = () => {
    if (window.confirm('本当に新しいゲームを開始しますか？（すべてのプレイヤーが削除されます）')) {
      onNewGame();
    }
  };

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
      
      {/* ▼▼▼ 変更：showAdminControls の値に応じてボタンエリアの表示を切り替える ▼▼▼ */}
      {showAdminControls && (
        <div className="leaderboard-controls">
          {/* ▼▼▼ 変更：onClickに関数を設定 ▼▼▼ */}
          <button onClick={handleResetScores} className="control-btn">スコアリセット</button>
          <button onClick={handleNewGame} className="control-btn new-game">新しいゲーム</button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;