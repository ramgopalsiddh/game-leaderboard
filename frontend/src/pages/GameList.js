import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../styles/GameList.css';

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
    <div className="container">
      <div className="gamelist-list-container">
        <h1 className="header">Game List</h1>
        <ul className="gamelist-list">
          {games.map((game) => (
            <li key={game.id} className="gamelist-item">
              <Link to={`/games/${game.id}`} className="gamelist-link">
                <div className="gamelist-item-content">
                  <h2>{game.name}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameList;
