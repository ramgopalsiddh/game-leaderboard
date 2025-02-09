import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Updated import

function ContestantCreate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();  // Updated hook

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/contestants/", { name, email })
      .then(() => {
        navigate("/contestants");  // Updated navigation method
      })
      .catch((error) => console.error("There was an error creating the contestant:", error));
  };

  return (
    <div>
      <h2>Add New Contestant</h2>
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
  );
}

export default ContestantCreate;
