// src/components/GachaModal.jsx
import React, { useEffect, useRef, useState } from 'react';

// ローカル動画は src/assets/videos にあります。Viteで解決するため import します。
import aVideo from '../assets/videos/a.mp4';
import bVideo from '../assets/videos/b.mp4';
import sVideo from '../assets/videos/s.mp4';

const DEFAULT_FALLBACK = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

const GachaModal = ({ isVisible, onGachaEnd, score = 0, premium = false }) => {
  const videoRef = useRef(null);
  const [src, setSrc] = useState(DEFAULT_FALLBACK);

  useEffect(() => {
    if (!isVisible) return;

    // スコアを数値化（安全対策）
    const s = Number(score) || 0;
    let selected = DEFAULT_FALLBACK;

    if (premium) {
      // プレミアム時: score < 120 -> a, 120 <= score -> s
      selected = s < 120 ? aVideo : sVideo;
    } else {
      // 非プレミアム: score < 90 -> b, 90 <= score < 140 -> a, 140 < score -> s
      if (s < 90) selected = bVideo;
      else if (s >= 90 && s < 140) selected = aVideo;
      else if (s > 140) selected = sVideo;
      else selected = aVideo;
    }

    console.log('Gacha selected video:', selected);

    setSrc(selected);

    // 少し遅延を置いて再生を開始（ブラウザの自動再生対策緩和）
    const tryPlay = () => {
      const p = videoRef.current?.play?.();
      if (p && typeof p.catch === 'function') {
        p.catch(err => {
          console.warn('Video autoplay failed:', err);
          onGachaEnd();
        });
      }
    };

    // 次のイベントループで再生を試みる
    const t = setTimeout(tryPlay, 80);
    return () => clearTimeout(t);
  }, [isVisible, score, premium, onGachaEnd]);

  if (!isVisible) return null;

  const handleError = () => {
    // ローカル動画が無い等でエラーになった場合、フォールバックに切り替えて再生
    if (src !== DEFAULT_FALLBACK) {
      setSrc(DEFAULT_FALLBACK);
      setTimeout(() => videoRef.current?.play().catch(() => onGachaEnd()), 100);
    } else {
      onGachaEnd();
    }
  };

  return (
    <div className="gacha-overlay" onClick={onGachaEnd}>
      <video
        ref={videoRef}
        src={src}
        onEnded={onGachaEnd}
        onClick={(e) => e.stopPropagation()}
        muted
        onError={handleError}
        className="gacha-video"
      >
        お使いのブラウザはビデオタグをサポートしていません。
      </video>
    </div>
  );
};

export default GachaModal;
