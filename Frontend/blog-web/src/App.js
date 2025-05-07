import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Login/login';
import Register from './Register/register';
import Home from './Home/home';

function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/" element={<Home></Home>} />
      </Routes>
    </Router>
   </>
  );
}

export default App;
