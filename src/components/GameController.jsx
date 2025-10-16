// src/components/GameController.jsx
import React from 'react';
import './components.css';

const GameController = ({ onReset }) => {
  return (
    <div className="game-controller widget">
      <h3>GAME</h3>
      <button onClick={onReset} className="reset-button">
        New Game
      </button>
    </div>
  );
};

export default GameController;