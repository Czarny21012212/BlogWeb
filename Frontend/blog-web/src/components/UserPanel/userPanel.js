import './userPanel.css';
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';

function UserPanel() {

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8082/api/infoAboutProfile", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch user panel data');
            }
        })
        .then(data => {
            setUserData(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    const myAccount = () => {
        window.location.href = '/my-Profile';
    }
  return (
   <>
    <div className='user-panel-all' onClick={myAccount}>
      {userData.map((user) => (
        <div className='user-panel-container' key={user.id}>
            <div className='user-panel-header'>
                <User className='user-icon' />
                <p className='user-name'>@{user.userName}</p>
            </div>
            <p className='user-email'>{user.email}</p>
        </div>
      ))}
    
    </div>
   </>
  );
}

export default UserPanel;
