import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Use useNavigate instead of useHistory

const AddGame = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();  // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newGame = { name, description };

    try {
      await axios.post("http://localhost:8000/games/", newGame);
      navigate("/games");  // Use navigate to redirect after successful submission
    } catch (error) {
      console.error("Error adding game:", error);
    }
  };

  return (
    <div>
      <h1>Add New Game</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Game</button>
      </form>
    </div>
  );
};

export default AddGame;
