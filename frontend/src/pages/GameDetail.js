import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/GameDetail.css';
import {BASE_URL} from '../constants';

const GameDetail = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [scoreData, setScoreData] = useState({});

  useEffect(() => {
    // Fetch game details
    axios.get(`${BASE_URL}/games/${gameId}`)
      .then(response => {
        setGame(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the game details!", error);
      });
  }, [gameId]);

  const handleStartGame = () => {
    axios.post(`${BASE_URL}/games/${gameId}/start`)
      .then(response => {
        setGame(prevGame => ({ ...prevGame, start_time: new Date() }));
      })
      .catch(error => {
        console.error("There was an error starting the game!", error);
      });
  };

  const handleEndGame = () => {
    axios.post(`${BASE_URL}/games/${gameId}/end`)
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

    axios.post(`${BASE_URL}/scores/`, {
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
    axios.post(`${BASE_URL}/games/${gameId}/upvote`)
      .then(response => {
        setGame(prevGame => ({ ...prevGame, upvotes: prevGame.upvotes + 1 }));
      })
      .catch(error => {
        console.error("There was an error upvoting the game!", error);
      });
  };

  if (!game) return <div>Loading...</div>;

  return (
    <div className="game-detail-container">
      <h1 className="game-detail-header">{game.name}</h1>
      <p className="game-detail-description">{game.description}</p>
      <p className="game-detail-info">Upvotes: {game.upvotes}</p>
      <p className="game-detail-info">Popularity Score: {game.popularity_score}</p>
      <p className="game-detail-info">Contestants:</p>
      <ul className="game-contestant-list">
        {game.contestants.map((contestant) => (
          <li key={contestant.id} className="game-contestant-item">
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

      <div className="game-action-buttons">
        {game.start_time ? (
          <>
            {game.end_time ? (
              <p className="game-status">Game has ended</p>
            ) : (
              <>
                <button className="game-end-button" onClick={handleEndGame}>End Game</button>  {/* Apply new class */}
                <button className="game-upvote-button" onClick={handleUpvote}>Upvote Game</button>
              </>
            )}
          </>
        ) : (
          <button onClick={handleStartGame}>Start Game</button>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
