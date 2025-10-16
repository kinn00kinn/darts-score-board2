// src/components/TurnControls.jsx
import React from 'react';

const TurnControls = ({ onUndo, onRedo, onReset, onConfirm, canConfirm }) => {
  return (
    <div className="turn-controls widget">
      <h3>CONTROLS</h3>
      <div className="button-group">
        <button onClick={onUndo}>やり直し (Undo)</button>
        <button onClick={onRedo}>元に戻す (Redo)</button>
        <button onClick={onReset} className="reset">リセット</button>
      </div>
      <button onClick={onConfirm} className="confirm" disabled={!canConfirm}>
        この投擲で確定
      </button>
    </div>
  );
};

export default TurnControls;