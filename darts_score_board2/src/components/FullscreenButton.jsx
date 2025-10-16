// src/components/FullscreenButton.jsx
import React from 'react';
import './components.css';

const FullscreenButton = () => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`全画面モードにできませんでした: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <button onClick={toggleFullscreen} className="fullscreen-btn" >⛶</button>
  );
};

export default FullscreenButton;