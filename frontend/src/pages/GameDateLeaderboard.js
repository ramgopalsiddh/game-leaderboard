import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const renderLeaderboardTable = () => {
    if (leaderboard.length === 0) {
      return <tr><td colSpan="4">No leaderboard data available</td></tr>;
    }

    return leaderboard.map((entry, index) => (
      <tr key={index}>
        <td>{entry.game_name}</td>
        <td>{entry.date}</td>
        <td>{entry.name}</td>
        <td>{entry.total_score} points</td>
      </tr>
    ));
  };

  return (
    <div>
      <h1>Game + Date Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Game Name</th>
            <th>Date</th>
            <th>Contestant Name</th>
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
