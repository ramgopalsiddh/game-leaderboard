import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/GameDateLeaderboard.css";

const GameDateLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data for all games and all dates
    axios.get("http://localhost:8000/leaderboard")
      .then(response => {
        setLeaderboard(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the leaderboard!", error);
      });
  }, []);

  const getRankedLeaderboard = () => {
    const rankedData = {};
    
    leaderboard.forEach(entry => {
      if (!rankedData[entry.game_name]) {
        rankedData[entry.game_name] = [];
      }
      rankedData[entry.game_name].push(entry);
    });
    
    Object.keys(rankedData).forEach(game => {
      rankedData[game].sort((a, b) => b.total_score - a.total_score);
      rankedData[game].forEach((entry, index) => {
        entry.rank = index + 1;
      });
    });
    
    return Object.values(rankedData).flat();
  };

  const renderLeaderboardTable = () => {
    const rankedLeaderboard = getRankedLeaderboard();

    if (rankedLeaderboard.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="leaderboard-no-data">No leaderboard data available</td>
        </tr>
      );
    }

    return rankedLeaderboard.map((entry, index) => (
      <tr key={index} className="leaderboard-row">
        <td>{entry.date}</td>
        <td>{entry.game_name}</td>
        <td>{entry.name}</td>
        <td>{entry.rank}</td>
        <td>{entry.total_score} points</td>
      </tr>
    ));
  };

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-header">Game + Date Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Game Name</th>
            <th>Contestant Name</th>
            <th>Rank</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {renderLeaderboardTable()}
        </tbody>
      </table>
    </div>
  );
};

export default GameDateLeaderboard;
