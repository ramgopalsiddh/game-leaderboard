import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div>
      <h1>Global Leaderboard</h1>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={entry.contestant_id}>
            {entry.name} - {entry.total_score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlobalLeaderboard;
