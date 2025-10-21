// src/App.jsx
import React, { useState } from 'react';
import DartArea from './components/DartArea';
import Leaderboard from './components/Leaderboard';
import FullscreenButton from './components/FullscreenButton';
import EditPlayerModal from './components/EditPlayerModal';
import GachaModal from './components/GachaModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isGachaVisible, setIsGachaVisible] = useState(false);
  const [boardOffset, setBoardOffset] = useState({ x: -30, y: -30 });
  const [boardScale, setBoardScale] = useState(1);
  const [celebration, setCelebration] = useState({ show: false, name: '' });

  // ▼▼▼ 追加 ▼▼▼
  // 開発者向け調整パネルの表示/非表示を管理するstate
  const [showDevControls, setShowDevControls] = useState(true);
  // ▲▲▲ 追加 ▲▲▲
  
  const handleAddOrUpdateScore = (name, score) => {
    // ...この関数のロジックは変更なし
    const trimmedName = name.trim();
    const existingPlayer = players.find(p => p.name.toLowerCase() === trimmedName.toLowerCase());
    const oldSorted = [...players];
    let targetPlayerId = existingPlayer ? existingPlayer.id : null;
    let updatedPlayers;
    if (existingPlayer) {
      updatedPlayers = players.map(p => p.id === existingPlayer.id ? { ...p, score: p.score + score } : p);
    } else {
      const newPlayer = { id: Date.now(), name: trimmedName, score };
      updatedPlayers = [...players, newPlayer];
      targetPlayerId = newPlayer.id;
    }
    const newSorted = [...updatedPlayers].sort((a, b) => b.score - a.score);
    const oldRank = oldSorted.findIndex(p => p.id === targetPlayerId) + 1;
    const newRank = newSorted.findIndex(p => p.id === targetPlayerId) + 1;
    const finalOldRank = oldRank === 0 ? oldSorted.length + 1 : oldRank;
    if (finalOldRank > 3 && newRank > 0 && newRank <= 3) {
      setCelebration({ show: true, name: trimmedName });
      setTimeout(() => setCelebration({ show: false, name: '' }), 5000);
    } else {
      setIsGachaVisible(true);
    }
    setPlayers(newSorted);
  };

  const handleGachaEnd = () => setIsGachaVisible(false);
  const handleStartEdit = (player) => setEditingPlayer(player);
  const handleSaveEdit = (updatedPlayer) => {
    const newPlayers = players.map(p => (p.id === updatedPlayer.id ? updatedPlayer : p));
    setPlayers([...newPlayers].sort((a, b) => b.score - a.score));
    setEditingPlayer(null);
  };
  const resetScores = () => setPlayers(players.map(p => ({ ...p, score: 0 })));
  const newGame = () => setPlayers([]);

  return (
    <div id="app-container">
      <div className="app-background"></div>
      
      {/* ▼▼▼ ボタンを追加 ▼▼▼ */}
      <button 
        className="dev-toggle-btn" 
        onClick={() => setShowDevControls(!showDevControls)}
        title="調整パネルの表示/非表示"
      >
        🛠️
      </button>
      {/* ▲▲▲ ボタンを追加 ▲▲▲ */}

      <FullscreenButton />

      <main className="main-layout">
        <section className="left-panel">
          <DartArea
            onAddScore={handleAddOrUpdateScore}
            boardOffset={boardOffset}
            setBoardOffset={setBoardOffset}
            boardScale={boardScale}
            setBoardScale={setBoardScale}
            showDevControls={showDevControls} // propを渡す
          />
        </section>
        <section className="right-panel">
          <Leaderboard
            players={players}
            onPlayerSelect={handleStartEdit}
            onResetScores={resetScores}
            onNewGame={newGame}
          />
        </section>
      </main>

      <EditPlayerModal player={editingPlayer} onSave={handleSaveEdit} onCancel={() => setEditingPlayer(null)} />
      <GachaModal isVisible={isGachaVisible} onGachaEnd={handleGachaEnd} />
      {celebration.show && <CelebrationOverlay name={celebration.name} />}
    </div>
  );
}

export default App;