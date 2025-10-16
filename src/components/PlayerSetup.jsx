// src/components/PlayerSetup.jsx
import React, { useState } from 'react';
import './components.css'; // CSSは後述

const PlayerSetup = ({ onGameStart }) => {
  // プレイヤー名の配列をStateで管理。初期値は1人。
  const [nicknames, setNicknames] = useState(['Player 1']);

  // ニックネームの入力値を更新する関数
  const handleNameChange = (index, newName) => {
    const newNames = [...nicknames];
    newNames[index] = newName;
    setNicknames(newNames);
  };

  // プレイヤーを追加する関数
  const addPlayer = () => {
    setNicknames([...nicknames, `Player ${nicknames.length + 1}`]);
  };

  // プレイヤーを削除する関数
  const removePlayer = (indexToRemove) => {
    setNicknames(nicknames.filter((_, index) => index !== indexToRemove));
  };

  // ゲームを開始する関数
  const handleStart = () => {
    const validNames = nicknames.filter(name => name.trim() !== '');
    if (validNames.length > 0) {
      onGameStart(validNames);
    } else {
      alert('ニックネームを1人以上入力してください');
    }
  };

  return (
    <div className="setup-container widget">
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
            {/* プレイヤーが2人以上の場合のみ削除ボタンを表示 */}
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