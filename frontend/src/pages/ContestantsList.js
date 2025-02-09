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
    const confirmDelete = window.confirm("Are you sure you want to delete this contestant?");
    if (confirmDelete) {
      axios
        .delete(`http://localhost:8000/contestants/${contestantId}`)
        .then(() => {
          setContestants(contestants.filter((contestant) => contestant.id !== contestantId));
        })
        .catch((error) => console.error("There was an error deleting the contestant:", error));
    }
  };

  return (
    <div className="listcontainer">
      <h2 className="header">Contestants List</h2>
      <Link to="/contestants/create">
        <button className="button">Create Contestant</button>
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th className="tableHeader">Name</th>
            <th className="tableHeader">Email</th>
            <th className="tableHeader">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contestants.map((contestant) => (
            <tr key={contestant.id}>
              <td className="tableCell">
                <Link to={`/contestants/${contestant.id}`} className="link">
                  {contestant.name}
                </Link>
              </td>
              <td className="tableCell">{contestant.email}</td>
              <td className="tableCell">
                <Link to={`/contestants/${contestant.id}`}>
                  <button className="button">Show</button>
                </Link>
                <Link to={`/contestants/update/${contestant.id}`}>
                  <button className="button">Edit</button>
                </Link>
                <button
                  onClick={() => deleteContestant(contestant.id)}
                  className="deleteButton"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContestantsList;
