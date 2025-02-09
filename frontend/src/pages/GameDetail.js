import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameDetail = () => {
  const { gameId } = useParams();  // Get gameId from the URL
  const [game, setGame] = useState(null);
  const [scoreData, setScoreData] = useState({});

  useEffect(() => {
    // Fetch game details
    axios.get(`http://localhost:8000/games/${gameId}`)
      .then(response => {
        setGame(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the game details!", error);
      });
  }, [gameId]);

  const handleStartGame = () => {
    axios.post(`http://localhost:8000/games/${gameId}/start`)
      .then(response => {
        setGame(prevGame => ({ ...prevGame, start_time: new Date() }));
      })
      .catch(error => {
        console.error("There was an error starting the game!", error);
      });
  };

  const handleEndGame = () => {
    axios.post(`http://localhost:8000/games/${gameId}/end`)
      .then(response => {
        setGame(prevGame => ({ ...prevGame, end_time: new Date() }));
      })
      .catch(error => {
        console.error("There was an error ending the game!", error);
      });
  };

  const handleScoreChange = (contestantId, value) => {
    setScoreData(prevState => ({
      ...prevState,
      [contestantId]: value
    }));
  };

  const handleScoreSubmit = (contestantId, score) => {
    if (!score) {
      alert("Please enter a valid score.");
      return;
    }

    axios.post("http://localhost:8000/scores/", {
      game_id: gameId,
      contestant_id: contestantId,
      score: score
    })
      .then(response => {
        console.log("Score assigned successfully", response.data);
        setScoreData(prevState => ({ ...prevState, [contestantId]: "" }));  // Reset score after submitting
      })
      .catch(error => {
        console.error("There was an error assigning the score!", error);
      });
  };

  const handleUpvote = () => {
    axios.post(`http://localhost:8000/games/${gameId}/upvote`)
      .then(response => {
        setGame(prevGame => ({ ...prevGame, upvotes: prevGame.upvotes + 1 }));
      })
      .catch(error => {
        console.error("There was an error upvoting the game!", error);
      });
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div>
      <h1>{game.name}</h1>
      <p>{game.description}</p>
      <p>Upvotes: {game.upvotes}</p>
      <p>Popularity Score: {game.popularity_score}</p>
      <p>Contestants:</p>
      <ul>
        {game.contestants.map((contestant) => (
          <li key={contestant.id}>
            {contestant.name}
            {game.start_time && !game.end_time && (
              <div>
                <input
                  type="number"
                  value={scoreData[contestant.id] || ""}
                  onChange={(e) => handleScoreChange(contestant.id, e.target.value)}
                  placeholder="Enter score"
                />
                <button onClick={() => handleScoreSubmit(contestant.id, scoreData[contestant.id])}>
                  Submit Score
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {game.start_time ? (
        <div>
          {game.end_time ? (
            <p>Game has ended</p>
          ) : (
            <>
              <button onClick={handleEndGame}>End Game</button>
              <button onClick={handleUpvote}>Upvote Game</button>
            </>
          )}
        </div>
      ) : (
        <button onClick={handleStartGame}>Start Game</button>
      )}
    </div>
  );
};

export default GameDetail;
