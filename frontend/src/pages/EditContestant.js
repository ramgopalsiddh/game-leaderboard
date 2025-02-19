import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditContestant.css"; 
import {BASE_URL} from '../constants';

function EditContestant() {
  const { contestantId } = useParams();
  const navigate = useNavigate();
  const [contestant, setContestant] = useState({ name: "", email: "" });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/contestants/${contestantId}`)
      .then((response) => {
        console.log(response.data); // Log the data returned
        setContestant(response.data);
      })
      .catch((error) => console.error("There was an error fetching the contestant:", error));
  }, [contestantId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setContestant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`${BASE_URL}/contestants/${contestantId}`, contestant)
      .then(() => navigate('/contestants'))
      .catch((error) => console.error("There was an error updating the contestant:", error));
  };

  return (
    <div className="editcontainer">
      <h2 className="header">Edit Contestant</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={contestant.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={contestant.email}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Update Contestant</button>
      </form>
    </div>
  );
}

export default EditContestant;
