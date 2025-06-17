import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import RegisterRequest from './pages/RegisterRequest';
import RequestList from './pages/RequestList';
import TechnicianRequests from './components/TechnicianRequests';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<RequestList />} />
          <Route path="/requests" element={<RequestList />} />
          <Route path="/requests/register" element={<RegisterRequest />} />
          <Route path="/requests/technician" element={<TechnicianRequests />} />
          <Route path="/requests/list" element={<RequestList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
