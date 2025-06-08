import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import RegisterRequest from './pages/RegisterRequest';
import RequestList from './pages/RequestList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/requests/register" element={<RegisterRequest />} />
          <Route path="/requests/list" element={<RequestList />} />
          <Route path="/" element={<RequestList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
