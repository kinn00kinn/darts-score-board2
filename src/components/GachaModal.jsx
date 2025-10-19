// src/components/GachaModal.jsx
import React, { useEffect, useRef } from 'react';

const GachaModal = ({ isVisible, onGachaEnd }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.play().catch(error => {
        console.error("Video autoplay failed:", error);
        onGachaEnd();
      });
    }
  }, [isVisible, onGachaEnd]);

  if (!isVisible) return null;

  return (
    <div className="gacha-overlay" onClick={onGachaEnd}>
      <video
        ref={videoRef}
        // 👇 ここに表示したい動画ファイルのURLを指定
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm"
        onEnded={onGachaEnd}
        onClick={(e) => e.stopPropagation()}
        muted
      >
        お使いのブラウザはビデオタグをサポートしていません。
      </video>
    </div>
  );
};

export default GachaModal;