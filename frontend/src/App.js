import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ContestantCreate from './pages/ContestantCreate';
import EditContestant from './pages/EditContestant';
import ContestantsList from './pages/ContestantsList';
import GameList from './pages/GameList';
import AddGame from './pages/AddGame';
import GameDetail from "./pages/GameDetail";
import ContestantDetail from "./pages/ContestantDetail";
import GlobalLeaderboard from './pages/GlobalLeaderboard';
import GameDateLeaderboard from './pages/GameDateLeaderboard';
import PopularityPage from './pages/PopularityPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Game Leaderboard & Contestants</h1>
        <nav>
          <div>
            <button className="button-link">
              <Link to="/contestants" className="link-style">All Contestants</Link>
            </button>
            <button className="button-link">
              <Link to="/contestants/create" className="link-style">Add Contestant</Link>
            </button>
            <button className="button-link">
              <Link to="/games" className="link-style">All Games</Link>
            </button>
            <button className="button-link">
              <Link to="/games/add" className="link-style">Add Game</Link>
            </button>
            
            <button className="button-link">
              <Link to="/global-leaderboard" className="link-style">Global Leaderboard</Link>
            </button>
            <button className="button-link">
              <Link to="/game-date-leaderboard" className="link-style">Game + Date Leaderboard</Link>
            </button>
            <button className="button-link">
              <Link to="/popularity" className="link-style">Game Popularity</Link>
            </button>
          </div>
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

          {/* New Routes for Leaderboards and Popularity */}
          <Route path="/global-leaderboard" element={<GlobalLeaderboard />} />
          <Route path="/game-date-leaderboard" element={<GameDateLeaderboard />} />
          <Route path="/popularity" element={<PopularityPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
