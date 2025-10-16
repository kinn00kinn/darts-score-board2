// src/components/EditPlayerModal.jsx
import React, { useState, useEffect } from 'react';
import './components.css';

const EditPlayerModal = ({ player, onSave, onCancel }) => {
  // 編集中の名前とスコアを管理するためのState
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);

  // モーダルが開かれたとき（player propが渡されたとき）にStateを初期化
  useEffect(() => {
    if (player) {
      setName(player.name);
      setScore(player.score);
    }
  }, [player]);

  // playerが存在しない場合（モーダルが非表示の場合）は何も描画しない
  if (!player) {
    return null;
  }

  const handleSave = () => {
    // scoreが数値であることを確認してから保存
    const newScore = parseInt(score, 10);
    if (!isNaN(newScore)) {
      onSave({ ...player, name, score: newScore });
    }
  };

  return (
    // 背景のオーバーレイ。クリックでモーダルを閉じる
    <div className="modal-overlay" onClick={onCancel}>
      {/* モーダル本体。クリックイベントが背景に伝わらないようにする */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>プレイヤー編集</h3>
        <div className="form-group">
          <label htmlFor="playerName">名前</label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="playerScore">スコア</label>
          <input
            id="playerScore"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-cancel">キャンセル</button>
          <button onClick={handleSave} className="btn-save">保存</button>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerModal;