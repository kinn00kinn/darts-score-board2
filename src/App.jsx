// src/App.jsx
import React, { useState } from 'react';
import PlayerSetup from './components/PlayerSetup';
import DartArea from './components/DartArea';
import Leaderboard from './components/Leaderboard';
import FullscreenButton from './components/FullscreenButton';
import EditPlayerModal from './components/EditPlayerModal';
import GachaModal from './components/GachaModal';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('setup'); // 'setup' or 'playing'
  const [players, setPlayers] = useState([]); // プレイヤー情報（スコア順でソートされる）
  const [turnOrder, setTurnOrder] = useState([]); // ターンの順番を管理するIDの配列
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0); // 現在のターンが何番目か
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isGachaVisible, setIsGachaVisible] = useState(false);

  // ゲームを開始する
  const handleGameStart = (nicknames) => {
    const initialPlayers = nicknames.map((name, index) => ({
      id: Date.now() + index,
      name,
      score: 0,
    }));
    setPlayers(initialPlayers);
    setTurnOrder(initialPlayers.map(p => p.id)); // プレイヤーIDの順序を保存
    setCurrentTurnIndex(0);
    setGameState('playing');
  };

  // ターンを終了し、スコアを更新する
  const handleTurnEnd = (turnScore) => {
    if (players.length === 0) return;

    // 現在のターンプレイヤーのIDを取得
    const currentPlayerId = turnOrder[currentTurnIndex];

    // 該当プレイヤーのスコアを更新
    const updatedPlayers = players.map(p => {
      if (p.id === currentPlayerId) {
        return { ...p, score: p.score + turnScore };
      }
      return p;
    });

    // スコア順にソートしてstateを更新（リーダーボード表示用）
    const sortedPlayers = [...updatedPlayers].sort((a, b) => b.score - a.score);
    setPlayers(sortedPlayers);

    // 次のプレイヤーのターンへ
    const nextTurnIndex = (currentTurnIndex + 1) % players.length;
    setCurrentTurnIndex(nextTurnIndex);

    // ガチャをトリガー
    setIsGachaVisible(true);
  };

  const handleGachaEnd = () => setIsGachaVisible(false);
  const handleStartEdit = (player) => setEditingPlayer(player);

  const handleSaveEdit = (updatedPlayer) => {
    const newPlayers = players.map(p => (p.id === updatedPlayer.id ? updatedPlayer : p));
    const sortedPlayers = [...newPlayers].sort((a, b) => b.score - a.score);
    setPlayers(sortedPlayers);
    setEditingPlayer(null);
  };
  
  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    setCurrentTurnIndex(0);
  };
  
  const newGame = () => {
    setPlayers([]);
    setTurnOrder([]);
    setGameState('setup');
  };

  // 現在のターンプレイヤーの情報を取得
  const currentPlayerId = turnOrder[currentTurnIndex];
  const currentPlayer = players.find(p => p.id === currentPlayerId);

  if (gameState === 'setup') {
    return (
      <div id="app-container">
        <div className="app-background"></div>
        <PlayerSetup onGameStart={handleGameStart} />
      </div>
    );
  }

  return (
    <div id="app-container">
      <div className="app-background"></div>
      <FullscreenButton />

      <main className="main-layout">
        <section className="left-panel">
          <DartArea
            key={currentPlayer?.id} // プレイヤーが変わるたびにリセット
            player={currentPlayer}
            onTurnEnd={handleTurnEnd}
          />
        </section>

        <section className="right-panel">
          <Leaderboard
            players={players} // スコア順にソートされたリストを渡す
            onPlayerSelect={handleStartEdit}
            onResetScores={resetGame}
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