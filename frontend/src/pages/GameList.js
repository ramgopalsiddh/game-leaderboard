import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Fetch all games
    axios.get("http://localhost:8000/games")
      .then(response => {
        setGames(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the games!", error);
      });
  }, []);

  return (
    <div>
      <h1>Game List</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/games/${game.id}`}>{game.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
