import './home.css';
import React from 'react';
import AllPosts from '../components/Posts/allPosts';
import UserPanel from '../components/UserPanel/userPanel';
import CreatePosts from '../components/createPosts/createPosts';



function Home() {


  return (
    <div className="home-container">
      <div>
        <div className="user-panel">
          <UserPanel />
        </div>
        <div className="Home-create-posts">
          <CreatePosts />
        </div>
      </div>
      <div className="all-posts">
        <AllPosts />
      </div>
    </div>
  );
}

export default Home;
