import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './login.jsx';
import Guides from './guides.jsx';
import Home from './home.jsx'
import Puzzle from './puzzle.jsx'
import NotFound from "./notFound.jsx"
function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/not-found" element={<NotFound/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
