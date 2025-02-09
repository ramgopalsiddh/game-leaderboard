import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/ContestantCreate.css';

function ContestantCreate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/contestants/", { name, email })
      .then(() => {
        navigate("/contestants");
      })
      .catch((error) =>
        console.error("There was an error creating the contestant:", error)
      );
  };

  return (
    <div className="creatcontainer">
      <div className="form-container">
        <h2 className="header">Add New Contestant</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Contestant</button>
        </form>
      </div>
    </div>
  );
}

export default ContestantCreate;
