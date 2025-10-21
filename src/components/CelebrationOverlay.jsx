// src/components/CelebrationOverlay.jsx
import React from 'react';
import Confetti from 'react-confetti';
import './Celebration.css'; // 下で作成するCSSをインポート

const CelebrationOverlay = ({ name }) => {
  // 画面サイズを取得して、紙吹雪を全画面に広げる
  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <div className="celebration-overlay">
      <Confetti
        width={width}
        height={height}
        recycle={false} // 一度だけ降らせる
        numberOfPieces={300} // 紙吹雪の数
        gravity={0.1} // 落ちる速さ
      />
      <div className="celebration-message">
        <h1>Congratulations!</h1>
        <p>{name}さんがトップ3に入りました！</p>
      </div>
    </div>
  );
};

export default CelebrationOverlay;