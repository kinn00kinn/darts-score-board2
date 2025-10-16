import React, { useState } from 'react';
import Gacha from './components/Gacha';
import PlayScreen from './components/PlayScreen';
import Leaderboard from './components/Leaderboard';
import FullscreenButton from './components/FullscreenButton';
import Timeline from './components/Timeline';
import EditPlayerModal from './components/EditPlayerModal';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gachaTrigger, setGachaTrigger] = useState(0);
  const [timelineMessages, setTimelineMessages] = useState([]);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const handleStartEdit = (player) => {
    setEditingPlayer(player);
  };

  const handleSaveEdit = (updatedPlayer) => {
    const sortedPlayers = players
      .map(p => (p.id === updatedPlayer.id ? updatedPlayer : p))
      .sort((a, b) => b.score - a.score); // Sort after editing
    setPlayers(sortedPlayers);
    setEditingPlayer(null);
  };

  const handleTurnEnd = (turnScore) => {
    if (players.length === 0) return;

    const updatedPlayers = [...players];
    const player = updatedPlayers[currentPlayerIndex];
    player.score += turnScore;

    const message = `${player.name} が ${turnScore} 点獲得！`;
    setTimelineMessages(prev => [...prev, message]);

    const sortedPlayers = updatedPlayers.sort((a, b) => b.score - a.score);
    setPlayers(sortedPlayers);

    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    setGachaTrigger(prev => prev + 1);
  };

  const addPlayer = (name) => {
    const newPlayer = {
      id: Date.now(),
      name: name,
      score: 0,
    };
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
  };

  const resetGame = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    setCurrentPlayerIndex(0);
    setTimelineMessages([]);
  };

  const currentPlayer = players.length > 0 ? players[currentPlayerIndex] : null;

  return (
    <div id="app-container">
      <FullscreenButton />
      <main className="dashboard-grid">
        <section className="column-left">
          <Gacha trigger={gachaTrigger} />
        </section>
        <section className="column-center">
          <PlayScreen
            key={currentPlayer?.id || 'no-player'}
            player={currentPlayer}
            onTurnEnd={handleTurnEnd}
          />
        </section>
        <section className="column-right">
          <Leaderboard
            players={players}
            onAddPlayer={addPlayer}
            onReset={resetGame}
            onPlayerSelect={handleStartEdit}
            currentPlayerId={currentPlayer?.id}
          />
        </section>
      </main>
      <Timeline messages={timelineMessages} />
      <EditPlayerModal
        player={editingPlayer}
        onSave={handleSaveEdit}
        onCancel={() => setEditingPlayer(null)}
      />
    </div>
  );
}

export default App;
