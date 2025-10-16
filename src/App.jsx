// src/App.jsx
import React, { useState } from 'react';
import Gacha from './components/Gacha';
import PlayScreen from './components/PlayScreen';
import Leaderboard from './components/Leaderboard';
import FullscreenButton from './components/FullscreenButton'; // 全画面表示ボタンをインポート
import './App.css';

function App() {
  // プレイヤー情報にユニークIDを追加し、スコアを0からスタート
  const [players, setPlayers] = useState([{ id: Date.now(), name: 'Player 1', score: 0 }]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gachaTrigger, setGachaTrigger] = useState(0);

  // ターン終了時の処理を修正
  const handleTurnEnd = (turnScore) => {
    const updatedPlayers = [...players];
    const currentScore = updatedPlayers[currentPlayerIndex].score;
    
    // 加点式に変更
    updatedPlayers[currentPlayerIndex].score = currentScore + turnScore; 
    
    // スコアが高い順（降順）でソート
    const sortedPlayers = updatedPlayers.sort((a, b) => b.score - a.score);
    setPlayers(sortedPlayers);
    
    // 次のプレイヤーへ正しく移動させる
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    setGachaTrigger(prev => prev + 1);
  };

  // プレイヤー名変更の処理を追加
  const handleNameChange = (id, newName) => {
    setPlayers(players.map(p => (p.id === id ? { ...p, name: newName } : p)));
  };

  // プレイヤー追加処理を修正
  const addPlayer = () => {
    const newPlayer = {
      id: Date.now(), // ユニークなIDを生成
      name: `Player ${players.length + 1}`,
      score: 0,
    };
    setPlayers([...players, newPlayer]);
  };
  
  // ゲームリセット処理を修正
  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    setCurrentPlayerIndex(0);
  };

  return (
    <div id="app-container">
      {/* 全画面表示ボタンを配置 */}
      <FullscreenButton />

      <main className="dashboard-grid">
        <section className="column-left">
          <Gacha trigger={gachaTrigger} />
        </section>

        <section className="column-center">
          <PlayScreen
            key={players[currentPlayerIndex].id} // keyを渡してターン変更時にコンポーネントを強制再描画
            player={players[currentPlayerIndex]}
            onTurnEnd={handleTurnEnd}
          />
        </section>

        <section className="column-right">
          <Leaderboard
            players={players}
            onAddPlayer={addPlayer}
            onReset={resetGame}
            onNameChange={handleNameChange} // 名前変更関数を渡す
            currentPlayerId={players[currentPlayerIndex]?.id} // 現在のプレイヤーをハイライトするためにIDを渡す
          />
        </section>
        <section className='column-down'>
        a
        </section>
      </main>
    </div>
  );
}

export default App;