import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PopularityPage.css"; // Import CSS
import {BASE_URL} from '../constants';

const PopularityPage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/popularity/`)
      .then(response => {
        setGames(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the popularity scores!", error);
      });
  }, []);

  return (
    <div className="popularity-container">
      <h1 className="popularity-header">Game Popularity</h1>
      {games.length > 0 ? (
        <table className="popularity-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Game Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={index}>
                <td className="popularity-rank">{index + 1}</td>
                <td className="popularity-name">{game.name}</td>
                <td className="popularity-score">{game.popularity_score} points</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-popularity-data">No popularity data available</p>
      )}
    </div>
  );
};

export default PopularityPage;
