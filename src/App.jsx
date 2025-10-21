// src/App.jsx
import React, { useState, useEffect } from 'react';
import DartArea from './components/DartArea';
import Leaderboard from './components/Leaderboard';
import FullscreenButton from './components/FullscreenButton';
import EditPlayerModal from './components/EditPlayerModal';
import GachaModal from './components/GachaModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import './App.css';

function App() {
  // useStateの初期化関数でlocalStorageからデータを読み込む
  const [players, setPlayers] = useState(() => {
    try {
      const savedPlayers = localStorage.getItem('dartsPlayers');
      return savedPlayers ? JSON.parse(savedPlayers) : [];
    } catch (error) {
      console.error("localStorageからのプレイヤーデータの読み込みに失敗しました。", error);
      return [];
    }
  });

  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isGachaVisible, setIsGachaVisible] = useState(false);
  const [boardOffset, setBoardOffset] = useState({ x: -30, y: -30 });
  const [boardScale, setBoardScale] = useState(1);
  const [celebration, setCelebration] = useState({ show: false, name: '' });
  const [showDevControls, setShowDevControls] = useState(true);
  const [pendingCelebration, setPendingCelebration] = useState(null);
  // ▼▼▼ 削除：管理ボタン用のstateは不要になったため削除 ▼▼▼
  // const [showAdminControls, setShowAdminControls] = useState(true);

  // players stateが変更されるたびに、その内容をlocalStorageに保存する
  useEffect(() => {
    try {
      localStorage.setItem('dartsPlayers', JSON.stringify(players));
    } catch (error) {
      console.error("localStorageへのプレイヤーデータの保存に失敗しました。", error);
    }
  }, [players]);

  // スコア追加/更新のメインロジック
  const handleAddOrUpdateScore = (name, score) => {
    const trimmedName = name.trim();
    const existingPlayer = players.find(p => p.name.toLowerCase() === trimmedName.toLowerCase());
    const oldSorted = [...players];
    let targetPlayerId = existingPlayer ? existingPlayer.id : null;
    let updatedPlayers;

    if (existingPlayer) {
      updatedPlayers = players.map(p =>
        p.id === existingPlayer.id ? { ...p, score: p.score + score } : p
      );
    } else {
      const newPlayer = { id: Date.now(), name: trimmedName, score };
      updatedPlayers = [...players, newPlayer];
      targetPlayerId = newPlayer.id;
    }

    const newSorted = [...updatedPlayers].sort((a, b) => b.score - a.score);
    const oldRank = oldSorted.findIndex(p => p.id === targetPlayerId) + 1;
    const newRank = newSorted.findIndex(p => p.id === targetPlayerId) + 1;
    const finalOldRank = oldRank === 0 ? oldSorted.length + 1 : oldRank;

    // どんなときでもGacha演出を発動させる
    setIsGachaVisible(true);

    // トップ3に入賞したかチェック
    if (finalOldRank > 3 && newRank > 0 && newRank <= 3) {
      // Gacha演出の後に表示する祝福演出を予約する
      setPendingCelebration({ name: trimmedName });
    }
    
    setPlayers(newSorted);
  };

  // Gacha演出が終了したときの処理
  const handleGachaEnd = () => {
    setIsGachaVisible(false);
    // 予約されていた祝福演出があれば実行
    if (pendingCelebration) {
      setCelebration({ show: true, name: pendingCelebration.name });
      setTimeout(() => setCelebration({ show: false, name: '' }), 5000);
      setPendingCelebration(null); // 予約をクリア
    }
  };

  const handleStartEdit = (player) => setEditingPlayer(player);

  const handleSaveEdit = (updatedPlayer) => {
    const newPlayers = players.map(p => (p.id === updatedPlayer.id ? updatedPlayer : p));
    setPlayers([...newPlayers].sort((a, b) => b.score - a.score));
    setEditingPlayer(null);
  };

  const resetScores = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
  };

  const newGame = () => {
    setPlayers([]);
    // localStorageのデータもクリアする
    try {
      localStorage.removeItem('dartsPlayers');
    } catch (error) {
      console.error("localStorageからのプレイヤーデータの削除に失敗しました。", error);
    }
  };

  return (
    <div id="app-container">
      <div className="app-background"></div>
      
      {/* ▼▼▼ 削除：管理ボタンは一本化されたため削除 ▼▼▼ */}
      
      <button 
        className="dev-toggle-btn" 
        onClick={() => setShowDevControls(!showDevControls)}
        title="調整・管理パネルの表示/非表示" // titleを分かりやすく変更
      >
        🛠️
      </button>

      <FullscreenButton />

      <main className="main-layout">
        <section className="left-panel">
          <DartArea
            onAddScore={handleAddOrUpdateScore}
            boardOffset={boardOffset}
            setBoardOffset={setBoardOffset}
            boardScale={boardScale}
            setBoardScale={setBoardScale}
            showDevControls={showDevControls}
          />
        </section>
        <section className="right-panel">
          <Leaderboard
            players={players}
            onPlayerSelect={handleStartEdit}
            onResetScores={resetScores}
            onNewGame={newGame}
            // ▼▼▼ 変更：調整パネルの表示状態(showDevControls)を渡す ▼▼▼
            showAdminControls={showDevControls}
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
      
      {celebration.show && <CelebrationOverlay name={celebration.name} />}
    </div>
  );
}

export default App;