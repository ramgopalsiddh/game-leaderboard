import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContestantCreate from './pages/ContestantCreate';
import EditContestant from './pages/EditContestant';
import ContestantsList from './pages/ContestantsList';
import GameList from './pages/GameList';
import AddGame from './pages/AddGame';
import GameDetail from "./pages/GameDetail";
import ContestantDetail from "./pages/ContestantDetail";

const App = () => {
  return (
    <Router>
      <div>
        <h1>Game Leaderboard & Contestants</h1>
        <nav>
          <ul>
            <li>
              <a href="/contestants">All Contestants</a>
            </li>
            <li>
              <a href="/contestants/create">Add Contestant</a>
            </li>
            <li>
              <a href="/games">All Games</a>
            </li>
            <li>
              <a href="/games/add">Add Game</a>
            </li>
          </ul>
        </nav>

        <Routes>
          {/* Contestant Routes */}
          <Route path="/contestants" element={<ContestantsList />} />
          <Route path="/contestants/create" element={<ContestantCreate />} />
          <Route path="/contestants/update/:contestantId" element={<EditContestant />} />
          <Route path="/contestants/:id" element={<ContestantDetail />} />

          {/* Game Routes */}
          <Route path="/games" element={<GameList />} />
          <Route path="/games/:gameId" element={<GameDetail />} />
          <Route path="/games/add" element={<AddGame />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
