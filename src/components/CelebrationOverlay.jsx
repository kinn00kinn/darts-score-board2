// src/components/CelebrationOverlay.jsx
import React, { useEffect } from 'react'; // useEffect をインポート
import Confetti from 'react-confetti';
import './Celebration.css';
import fanfareSound from '../assets/sounds/fanfare.mp3'; // 音声ファイルをインポート

// name: プレイヤー名, rank: 入賞順位 (数値)
const CelebrationOverlay = ({ name, rank = null }) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // コンポーネント表示時に一度だけファンファーレを再生
  useEffect(() => {
    const audio = new Audio(fanfareSound);
    audio.play().catch(() => {
      // 自動再生がブロックされても致命的ではない
      // console.warn('fanfare play blocked');
    });
  }, []);

  return (
    <div className="celebration-overlay">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={350}
        gravity={0.08}
      />
      <div className="celebration-message">
        <h1>Congratulations!</h1>
        {rank ? (
          <p>{name} さんが <strong>{rank}位</strong> に入りました！</p>
        ) : (
          <p>{name} さんがトップ3に入りました！</p>
        )}
      </div>
    </div>
  );
};

export default CelebrationOverlay;