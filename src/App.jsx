import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './login.jsx';
import Guides from './guides.jsx';
import Home from './home.jsx'
function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
