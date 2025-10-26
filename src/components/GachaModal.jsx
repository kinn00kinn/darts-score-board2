// src/components/GachaModal.jsx
import React, { useEffect, useRef, useState } from 'react';

// ローカル動画は src/assets/videos にあります。Viteで解決するため import します。
import aVideo from '../assets/videos/A.mp4';
import bVideo from '../assets/videos/B.mp4';
import sVideo from '../assets/videos/S.mp4';

const DEFAULT_FALLBACK = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

const GachaModal = ({ isVisible, onGachaEnd, score = 0, premium = false }) => {
  const videoRef = useRef(null);
  const [src, setSrc] = useState(DEFAULT_FALLBACK);
  // デフォルトでは音ありで再生を試みる（ブラウザがブロックする場合は自動でミュートにフォールバック）
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    // スコアを数値化（安全対策）
    const s = Number(score) || 0;
    let selected = DEFAULT_FALLBACK;

    if (premium) {
      // プレミアム時: score < 100 -> a, 100 <= score -> s
      selected = s < 80 ? aVideo : sVideo;
    } else {
      // 非プレミアム: score < 80 -> b, 80 <= score < 120 -> a, 120 < score -> s
      if (s < 70) selected = bVideo;
      else if (s >= 70 && s < 100) selected = aVideo;
      else if (s >= 100) selected = sVideo;
      else selected = aVideo;
    }

    console.log('Gacha selected video:', selected);

    setSrc(selected);

    // 少し遅延を置いて再生を開始。最初はミュート解除で試み、失敗したらミュートで再生し直す。
    const tryPlay = async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.muted = false;
        await videoRef.current.play();
        // 成功すれば isMuted=false を保つ
        setIsMuted(false);
      } catch (err) {
        // 自動再生ポリシーでブロックされた場合はミュートにして再生を試す
        console.warn('Autoplay unmuted failed, falling back to muted playback', err);
        setIsMuted(true);
        try {
          if (videoRef.current) {
            videoRef.current.muted = true;
            await videoRef.current.play();
          }
        } catch (err2) {
          console.warn('Muted playback also failed', err2);
          onGachaEnd();
        }
      }
    };

    const t = setTimeout(() => { tryPlay(); }, 80);
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
      <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={src}
          onEnded={onGachaEnd}
          onClick={(e) => e.stopPropagation()}
          muted={isMuted}
          onError={handleError}
          className="gacha-video"
        >
          お使いのブラウザはビデオタグをサポートしていません。
        </video>

        {/* ミュート解除ボタン: 自動再生で音が出ない場合、ユーザーがここで音を有効にできる */}
        {isMuted && (
          <button
            className="gacha-unmute-btn"
            onClick={(e) => {
              e.stopPropagation();
              try {
                setIsMuted(false);
                if (videoRef.current) {
                  videoRef.current.muted = false;
                  // 再生を再トリガーして音声を有効にする
                  videoRef.current.play().catch(() => {});
                }
              } catch (err) {
                console.warn('unmute failed', err);
              }
            }}
            aria-label="アンミュートして音を聞く"
          >🔊 音を有効にする</button>
        )}
      </div>
    </div>
  );
};

export default GachaModal;
