import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/GlobalLeaderboard.css";

const GlobalLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/leaderboard/global")
      .then(response => {
        setLeaderboard(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the leaderboard!", error);
      });
  }, []);

  return (
    <div className="global-leaderboard-container">
      <h1 className="global-leaderboard-header">Global Leaderboard</h1>
      <table className="global-leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Contestant Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <tr key={entry.contestant_id}>
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.total_score} points</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-leaderboard-data">No leaderboard data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GlobalLeaderboard;
