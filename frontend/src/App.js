import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContestantCreate from './pages/ContestantCreate';
import EditContestant from './pages/EditContestant';
import ContestantsList from './pages/ContestantsList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/contestants" element={<ContestantsList />} />
        <Route path="/contestants/create" element={<ContestantCreate />} />
        <Route path="/contestants/update/:contestantId" element={<EditContestant />} />
        </Routes>
    </Router>
  );
}

export default App;  // Ensure 'App' is correctly exported as the default
