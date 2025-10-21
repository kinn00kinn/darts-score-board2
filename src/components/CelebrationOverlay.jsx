// src/components/CelebrationOverlay.jsx
import React, { useEffect } from 'react'; // useEffect をインポート
import Confetti from 'react-confetti';
import './Celebration.css';
import fanfareSound from '../assets/sounds/fanfare.mp3'; // 音声ファイルをインポート

const CelebrationOverlay = ({ name }) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // ▼▼▼ 追加：コンポーネントが表示された時に一度だけ音を再生する ▼▼▼
  useEffect(() => {
    const audio = new Audio(fanfareSound);
    audio.play();
  }, []); // 空の配列を渡すことで、初回表示時のみ実行される
  // ▲▲▲ 追加 ▲▲▲

  return (
    <div className="celebration-overlay">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={300}
        gravity={0.1}
      />
      <div className="celebration-message">
        <h1>Congratulations!</h1>
        <p>{name}さんがトップ3に入りました！</p>
      </div>
    </div>
  );
};

export default CelebrationOverlay;