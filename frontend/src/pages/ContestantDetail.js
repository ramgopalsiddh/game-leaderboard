import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import '../styles/ContestantDetail.css';
import {BASE_URL} from '../constants';

function ContestantDetail() {
  const { id } = useParams();
  const [contestant, setContestant] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/contestants/${id}`)
      .then((response) => {
       // console.log("Contestant data:", response.data);
        setContestant(response.data);
      })
      .catch((error) => {
       // console.error("Error fetching contestant details:", error);
        setLoading(false);
      });

    fetchActiveGames();
  }, [id]);

  const fetchActiveGames = () => {
    axios
      .get(`${BASE_URL}/games/active`)
      .then((response) => {
       // console.log("Active games data:", response.data);
        setGames(response.data);
        setLoading(false);
      })
      .catch((error) => {
       // console.error("Error fetching active games:", error);
        setLoading(false);
      });
  };

  const handleEnterGame = (gameId) => {
    axios
      .post(`${BASE_URL}/games/${gameId}/contestants/${id}/enter`)
      .then((response) => {
        alert(response.data.message);
        fetchActiveGames();
      })
      .catch((error) => console.error("Error entering the game:", error));
  };

  const handleExitGame = (gameId) => {
    axios
      .post(`${BASE_URL}/games/${gameId}/contestants/${id}/exit`)
      .then((response) => {
        alert(response.data.message);
        fetchActiveGames();
      })
      .catch((error) => console.error("Error exiting the game:", error));
  };

  if (loading) return <div>Loading...</div>;

  if (!contestant) return <div>Contestant not found</div>;

  return (
    <div className="detailcontainer">
      <div className="detail-container">
        <h2 className="header">{contestant.name}</h2>
        <p className="email">Email: {contestant.email}</p>

        <h3>Active Games</h3>
        {games.length === 0 ? (
          <p>No active games available</p>
        ) : (
          <ul className="game-list">
            {games.map((game) => {
              const isInGame = Array.isArray(game.contestants) && game.contestants.some(
                (contestant) => contestant.id === parseInt(id)
              );

              return (
                <li key={game.id} className="game-item">
                  <h4>{game.name}</h4>
                  <p>{game.description}</p>
                  <p>Upvotes: {game.upvotes}</p>
                  <p>Popularity Score: {game.popularity_score}</p>

                  {/* Show "Exit Game" if the contestant is already in the game */}
                  {isInGame ? (
                    <button onClick={() => handleExitGame(game.id)} className="exit-button">Exit Game</button>
                  ) : (
                    <button onClick={() => handleEnterGame(game.id)} className="enter-button">Enter Game</button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ContestantDetail;
