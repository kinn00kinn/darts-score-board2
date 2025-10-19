// src/components/PlayerSetup.jsx
import React, { useState } from 'react';

const PlayerSetup = ({ onGameStart }) => {
  const [nicknames, setNicknames] = useState(['Player 1']);

  const handleNameChange = (index, newName) => {
    const newNames = [...nicknames];
    newNames[index] = newName;
    setNicknames(newNames);
  };

  const addPlayer = () => {
    setNicknames([...nicknames, `Player ${nicknames.length + 1}`]);
  };

  const removePlayer = (indexToRemove) => {
    setNicknames(nicknames.filter((_, index) => index !== indexToRemove));
  };

  const handleStart = () => {
    const validNames = nicknames.filter(name => name.trim() !== '');
    if (validNames.length > 0) {
      onGameStart(validNames);
    } else {
      alert('ニックネームを1人以上入力してください');
    }
  };

  return (
    <div className="setup-container">
      <h2>プレイヤーのニックネームを入力</h2>
      <div className="player-inputs">
        {nicknames.map((name, index) => (
          <div key={index} className="player-input-row">
            <input
              type="text"
              placeholder={`Player ${index + 1}`}
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            {nicknames.length > 1 && (
              <button onClick={() => removePlayer(index)} className="remove-btn">
                -
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="setup-controls">
        <button onClick={addPlayer} className="add-btn">プレイヤーを追加</button>
        <button onClick={handleStart} className="start-btn">ゲーム開始！</button>
      </div>
    </div>
  );
};

export default PlayerSetup;