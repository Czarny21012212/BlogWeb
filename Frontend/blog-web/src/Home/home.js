import './home.css';
import React, { useEffect, useState } from 'react';
import AllPosts from '../components/Posts/allPosts';
import UserPanel from '../components/UserPanel/userPanel';
import CreatePosts from '../components/createPosts/createPosts';
import LogOut from '../components/logout/logout'
import ShowUsers from '../components/ShowUsers/showUsers';

function Home() {

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
    {check && 
      <div className="home-container">
      <div className="left-side">
        <div className='header'>
          <h2>Blog Web</h2>
        </div>
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
      <div className="show-users">
        <ShowUsers></ShowUsers>
      </div>
    </div>
    || <h1>Please Login</h1>}
    </>
  );
}

export default Home;
