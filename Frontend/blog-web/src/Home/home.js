import './home.css';
import React from 'react';
import AllPosts from '../components/Posts/allPosts';
import UserPanel from '../components/UserPanel/userPanel';
import CreatePosts from '../components/createPosts/createPosts';



function Home() {


  return (
    <div className="home-container">
        <div className="left-side">
          <div className='user-panel'>
            <UserPanel></UserPanel>
          </div>
          <div className='left-menu'> 
            <div className='menu-create-post'>
              <CreatePosts></CreatePosts>
            </div>
          </div>
        </div>
      <div className="all-posts">
        <AllPosts />
      </div>
    </div>
  );
}

export default Home;
