import './App.css';
import React, { use, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './Login/login';
import Register from './Register/register';
import Home from './Home/home';
import MyProfile from './MyProfile/myProfile';

function App() {

  const [check, setCheck] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8082/api/checkAuthentication', {
      method: "GET",
      credentials: 'include'
    })
    .then((response => {
      if(response.ok){
        return response.json()
      }else{
        throw new Error('Failed to fetch comments');
      }
    }))
    .then(data => {
      setCheck(data)
      console.log(data)
    })
    .catch(error => {
      console.log(error)
    })
  }, [])


  return (
   <>
    
    <Router>
      <Routes>
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<Register></Register>} />
        <Route path="/" element={<Home></Home>} />
        <Route path="/my-Profile" element={<MyProfile></MyProfile>} />
      </Routes>
    </Router>
   </>
  );
}

export default App;
