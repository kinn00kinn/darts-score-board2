// src/App.jsx
import React, { useState, useEffect } from 'react';
import DartArea from './components/DartArea';
import Leaderboard from './components/Leaderboard';
import FullscreenButton from './components/FullscreenButton';
import EditPlayerModal from './components/EditPlayerModal';
import GachaModal from './components/GachaModal';
import CelebrationOverlay from './components/CelebrationOverlay';
import './App.css';
import scoreAddSound from './assets/sounds/score-add.mp3';

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
  const [currentPlayerName, setCurrentPlayerName] = useState('');
  const [currentTurnScore, setCurrentTurnScore] = useState(0);
  const [currentThrows, setCurrentThrows] = useState([]);

  const clearCurrentTurn = () => {
    setCurrentTurnScore(0);
    setCurrentThrows([]);
  };

  const handleUndoThrow = () => {
    setCurrentThrows(prevThrows => {
      if (prevThrows.length === 0) {
        return prevThrows;
      }
      const updatedThrows = prevThrows.slice(0, -1);
      const lastThrow = prevThrows[prevThrows.length - 1];
      setCurrentTurnScore(prevScore => prevScore - lastThrow.score);
      return updatedThrows;
    });
  };

  const handleConfirmCurrentTurn = () => {
    const trimmedName = currentPlayerName.trim();
    if (!trimmedName) {
      alert('名前を入力してください');
      return;
    }

    try {
      const audio = new Audio(scoreAddSound);
      audio.play();
    } catch (error) {
      console.error('効果音の再生に失敗しました:', error);
    }

    handleAddOrUpdateScore(trimmedName, currentTurnScore);
    setCurrentPlayerName('');
    clearCurrentTurn();
  };

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

  // ▼▼▼ 追加：プレイヤー削除のロジック ▼▼▼
  const handleDeletePlayer = (playerId) => {
    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
    setEditingPlayer(null); // 削除が完了したらモーダルを閉じる
  };

  const resetScores = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
  };

  const newGame = () => {
    clearCurrentTurn();
    setCurrentPlayerName('');
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
      
      <button 
        className="dev-toggle-btn" 
        onClick={() => setShowDevControls(!showDevControls)}
        title="調整・管理パネルの表示/非表示"
      >
        🛠️
      </button>

      <FullscreenButton />

      <main className="main-layout">
        <section className="left-panel">
          <DartArea
            boardOffset={boardOffset}
            setBoardOffset={setBoardOffset}
            boardScale={boardScale}
            setBoardScale={setBoardScale}
            showDevControls={showDevControls}
            onResetScores={resetScores}
            onNewGame={newGame}
            playerName={currentPlayerName}
            turnScore={currentTurnScore}
            setTurnScore={setCurrentTurnScore}
            throws={currentThrows}
            setThrows={setCurrentThrows}
          />
        </section>
        <section className="right-panel">
          <Leaderboard
            players={players}
            onPlayerSelect={handleStartEdit}
            currentPlayerName={currentPlayerName}
            currentThrows={currentThrows}
            onPlayerNameChange={setCurrentPlayerName}
            onUndoThrow={handleUndoThrow}
            onResetTurn={clearCurrentTurn}
            onConfirmScore={handleConfirmCurrentTurn}
          />
        </section>
      </main>

      <EditPlayerModal
        player={editingPlayer}
        onSave={handleSaveEdit}
        onCancel={() => setEditingPlayer(null)}
        // ▼▼▼ 追加：削除関数をpropとして渡す ▼▼▼
        onDelete={handleDeletePlayer}
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