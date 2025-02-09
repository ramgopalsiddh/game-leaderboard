import React, { useEffect, useState } from "react";
import axios from "axios";

const PopularityPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/popularity/")
      .then(response => {
        setGames(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the popularity scores!", error);
      });
  }, []);

  return (
    <div>
      <h1>Game Popularity</h1>
      <ul>
        {games.map((game, index) => (
          <li key={index}>
            {game.name} - {game.popularity_score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularityPage;
