import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    <div>
      <h2>Contestants List</h2>
      <Link to="/contestants/create">
        <button>Create Contestant</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contestants.map((contestant) => (
            <tr key={contestant.id}>
              <td>{contestant.name}</td>
              <td>{contestant.email}</td>
              <td>
                <Link to={`/contestants/update/${contestant.id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteContestant(contestant.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContestantsList;
