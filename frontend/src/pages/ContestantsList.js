import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/ContestantsList.css";

function ContestantsList() {
  const [contestants, setContestants] = useState([]);

  useEffect(() => {
    // Fetch the contestants from the FastAPI backend
    axios
      .get("http://localhost:8000/allcontestants")
      .then((response) => setContestants(response.data))
      .catch((error) => console.error("There was an error fetching contestants:", error));
  }, []);

  const deleteContestant = (contestantId) => {
    if (window.confirm("Are you sure you want to delete this contestant?")) {
      axios
        .delete(`http://localhost:8000/contestants/${contestantId}`)
        .then(() => {
          setContestants(contestants.filter((contestant) => contestant.id !== contestantId));
        })
        .catch((error) => console.error("There was an error deleting the contestant:", error));
    }
  };

  return (
    <div className="list-container">
      <h2 className="header">Contestants List</h2>
      <Link to="/contestants/create">
        <button className="create-button">Add New Contestant</button>
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contestants.length > 0 ? (
            contestants.map((contestant) => (
              <tr key={contestant.id}>
                <td className="table-cell">
                  <Link to={`/contestants/${contestant.id}`} className="contestant-link">
                    {contestant.name}
                  </Link>
                </td>
                <td className="table-cell">{contestant.email}</td>
                <td className="table-cell">
                  <Link to={`/contestants/${contestant.id}`}>
                    <button className="action-button">Show</button>
                  </Link>
                  <Link to={`/contestants/update/${contestant.id}`}>
                    <button className="action-button edit-button">Edit</button>
                  </Link>
                  <button
                    onClick={() => deleteContestant(contestant.id)}
                    className="action-button delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">No contestants available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ContestantsList;
