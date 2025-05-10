import './home.css';
import React from 'react';
import AllPosts from '../components/Posts/allPosts';
import UserPanel from '../components/UserPanel/userPanel';



function Home() {


  return (
    <div className="home-container">
      <div className="user-panel">
        <UserPanel />
      </div>
      <div className="all-posts">
        <AllPosts />
      </div>
    </div>
  );
}

export default Home;
