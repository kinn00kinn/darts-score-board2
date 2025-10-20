// src/App.jsx
import React, { useState } from 'react';
// PlayerSetupは不要になったため削除
import DartArea from './components/DartArea';
import Leaderboard from './components/Leaderboard';
import FullscreenButton from './components/FullscreenButton';
import EditPlayerModal from './components/EditPlayerModal';
import GachaModal from './components/GachaModal';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]); // プレイヤー情報の配列のみ管理
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isGachaVisible, setIsGachaVisible] = useState(false);

  // 新しいロジック：スコアを追加または更新する関数
  const handleAddOrUpdateScore = (name, score) => {
    // if (score === 0) return; // スコアが0の場合は何もしない

    const trimmedName = name.trim();
    const existingPlayer = players.find(p => p.name.toLowerCase() === trimmedName.toLowerCase());

    let updatedPlayers;

    if (existingPlayer) {
      // 既に存在するプレイヤーの場合、スコアを加算
      updatedPlayers = players.map(p => 
        p.id === existingPlayer.id ? { ...p, score: p.score + score } : p
      );
    } else {
      // 新しいプレイヤーの場合、リストに追加
      const newPlayer = {
        id: Date.now(),
        name: trimmedName,
        score: score,
      };
      updatedPlayers = [...players, newPlayer];
    }

    // スコア順にソートしてstateを更新
    const sortedPlayers = updatedPlayers.sort((a, b) => b.score - a.score);
    setPlayers(sortedPlayers);
    setIsGachaVisible(true); // ガチャをトリガー
  };

  const handleGachaEnd = () => setIsGachaVisible(false);
  const handleStartEdit = (player) => setEditingPlayer(player);

  const handleSaveEdit = (updatedPlayer) => {
    const newPlayers = players.map(p => (p.id === updatedPlayer.id ? updatedPlayer : p));
    const sortedPlayers = [...newPlayers].sort((a, b) => b.score - a.score);
    setPlayers(sortedPlayers);
    setEditingPlayer(null);
  };
  
  // スコアのみをリセット
  const resetScores = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
  };
  
  // 全てのプレイヤーを削除して最初から
  const newGame = () => {
    console.log(players)
    setPlayers([]);
  };

  return (
    <div id="app-container">
      <div className="app-background"></div>
      <FullscreenButton />

      <main className="main-layout">
        <section className="left-panel">
          {/* ↓ onAddScoreという名前で新しい関数を渡す */}
          <DartArea onAddScore={handleAddOrUpdateScore} />
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

      <EditPlayerModal
        player={editingPlayer}
        onSave={handleSaveEdit}
        onCancel={() => setEditingPlayer(null)}
      />
      
      <GachaModal
        isVisible={isGachaVisible}
        onGachaEnd={handleGachaEnd}
      />
    </div>
  );
}

export default App;