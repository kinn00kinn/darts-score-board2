// src/components/EditPlayerModal.jsx
import React, { useState, useEffect } from 'react';

const EditPlayerModal = ({ player, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (player) {
      setName(player.name);
      setScore(player.score);
    }
  }, [player]);

  if (!player) {
    return null;
  }

  const handleSave = () => {
    const newScore = parseInt(score, 10);
    if (!isNaN(newScore)) {
      onSave({ ...player, name, score: newScore });
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
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