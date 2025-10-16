// src/components/Gacha.jsx
import React, { useState, useEffect } from 'react';
import './components.css';

const PRIZES = ["A", "B", "C"];

const Gacha = ({ trigger }) => {
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // triggerの値が変化したら（0より大きくなったら）ガチャを回す
  useEffect(() => {
    if (trigger > 0) {
      setIsSpinning(true);
      setResult(null); // 前回の結果をリセット

      const spinTimer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * PRIZES.length);
        setResult(PRIZES[randomIndex]);
        setIsSpinning(false);
      }, 1000); // 1秒後に結果を表示

      return () => clearTimeout(spinTimer);
    }
  }, [trigger]); // triggerの変更を監視

  return (
    <div className="gacha widget">
      <h3>🎁 GACHA</h3>
      <div className="gacha-display">
        {isSpinning && <div className="gacha-spinner"></div>}
        {!isSpinning && result && (
          <div className="gacha-result">{result}</div>
        )}
        {!isSpinning && !result && (
          <div className="gacha-placeholder">
            スコアを確定すると<br/>ガチャが引けます
          </div>
        )}
      </div>
    </div>
  );
};

export default Gacha;