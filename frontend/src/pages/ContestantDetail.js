import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ContestantDetail() {
  const { id } = useParams();
  const [contestant, setContestant] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/contestants/${id}`)
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
      .get("http://localhost:8000/games/active")
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
      .post(`http://localhost:8000/games/${gameId}/contestants/${id}/enter`)
      .then((response) => {
        alert(response.data.message);
        fetchActiveGames();
      })
      .catch((error) => console.error("Error entering the game:", error));
  };

  const handleExitGame = (gameId) => {
    axios
      .post(`http://localhost:8000/games/${gameId}/contestants/${id}/exit`)
      .then((response) => {
        alert(response.data.message);
        fetchActiveGames();
      })
      .catch((error) => console.error("Error exiting the game:", error));
  };

  if (loading) return <div>Loading...</div>;

  if (!contestant) return <div>Contestant not found</div>;

  return (
    <div>
      <h2>{contestant.name}</h2>
      <p>Email: {contestant.email}</p>

      <h3>Active Games</h3>
      {games.length === 0 ? (
        <p>No active games available</p>
      ) : (
        <ul>
          {games.map((game) => {
            const isInGame = Array.isArray(game.contestants) && game.contestants.some(
              (contestant) => contestant.id === parseInt(id)
            );

            return (
              <li key={game.id}>
                <h4>{game.name}</h4>
                <p>{game.description}</p>
                <p>Upvotes: {game.upvotes}</p>
                <p>Popularity Score: {game.popularity_score}</p>

                {/* Show "Exit Game" if the contestant is already in the game */}
                {isInGame ? (
                  <button onClick={() => handleExitGame(game.id)}>Exit Game</button>
                ) : (
                  <button onClick={() => handleEnterGame(game.id)}>Enter Game</button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ContestantDetail;
