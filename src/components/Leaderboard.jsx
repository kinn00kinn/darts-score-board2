// src/components/Leaderboard.jsx
import React, { useState } from 'react';

// ▼▼▼ 変更：showAdminControls を props で受け取る ▼▼▼
const Leaderboard = ({
  players,
  onPlayerSelect,
  currentPlayerName,
  currentThrows,
  onPlayerNameChange,
  onUndoThrow,
  onResetTurn,
  onConfirmScore,
}) => {
  const hasThrows = currentThrows.length > 0;

  // ▼▼▼ ここから追加 ▼▼▼
  // IME入力中かどうかを管理するstate
  const [isComposing, setIsComposing] = useState(false);

  // Enterキーが押されたときの処理
  const handleKeyDown = (event) => {
    // IMEが非アクティブで、かつEnterキーが押された場合に実行
    if (event.key === 'Enter' && !isComposing) {
      // フォームのデフォルトの送信動作をキャンセル
      event.preventDefault();
      // onConfirmScoreが渡されていれば実行
      onConfirmScore?.();
    }
  };
  // ▲▲▲ ここまで追加 ▲▲▲

  return (
    <div className="leaderboard-container"> 
      <h2>LEADERBOARD</h2>
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
      <div className="current-turn-card">
        <div className="player-input-area leaderboard-player-input">
          <input
            type="text"
            className="player-name-input"
            placeholder="名前を入力..."
            value={currentPlayerName}
            onChange={(e) => onPlayerNameChange?.(e.target.value)}
            // ▼▼▼ ここから追加 ▼▼▼
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            // ▲▲▲ ここまで追加 ▲▲▲
          />
          <button onClick={() => onConfirmScore?.()} className="confirm">追加</button>
        </div>
        <div className="leaderboard-actions action-buttons">
          <button onClick={() => onUndoThrow?.()} disabled={!hasThrows}>Undo</button>
          <button onClick={() => onResetTurn?.()} className="reset">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;