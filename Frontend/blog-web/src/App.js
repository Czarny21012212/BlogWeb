import './App.css';
import React, { use, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Login/login';
import Register from './Register/register';
import Home from './Home/home';
import MyProfile from './MyProfile/myProfile';
import UserAccount from './components/userAccount/userAccount';

function App() {

  return (
   <>
    <Router>
      <Routes>
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/" element={<Home></Home>} />
        <Route path="/my-Profile" element={<MyProfile></MyProfile>} />
        <Route path="/userAccount/:id" element={<UserAccount></UserAccount>} />
      </Routes>
    </Router>
   </>
  );
}

export default App;
