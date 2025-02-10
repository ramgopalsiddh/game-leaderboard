import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/AddGame.css';
import {BASE_URL} from '../constants';

const AddGame = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGame = { name, description };

    try {
      await axios.post(`${BASE_URL}/games/`, newGame);
      navigate("/games");
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  return (
    <div className="addgamecontainer">
      <div className="form-container">
        <h1 className="header">Add New Game</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">Add Game</button>
        </form>
      </div>
    </div>
  );
};

export default AddGame;
