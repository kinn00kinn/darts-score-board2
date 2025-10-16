// src/components/Timeline.jsx
import React from 'react';
import './components.css';

const Timeline = ({ messages }) => {
  // メッセージが5件以上になったら古いものから削除
  const displayMessages = messages.slice(-5);

  return (
    <div className="timeline-container">
      {displayMessages.map((msg, index) => (
        // keyをユニークにするため、メッセージとインデックスを組み合わせる
        <div key={`${msg}-${index}`} className="timeline-message" style={{ top: `${(index * 20) + 5}%` }}>
          {msg}
        </div>
      ))}
    </div>
  );
};

export default Timeline;