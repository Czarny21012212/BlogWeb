import React, { useState, useEffect, use } from 'react'
import { User } from 'lucide-react'
import './showUsers.css'

export const ShowUsers = () => {
    const [users, setUsers] = useState([])
    const [limit, setLimit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(false)
    const [followedUsers, setFollowedUsers] = useState([])

    const fetchUsers = () => {
        setLoading(true)
        fetch(`http://localhost:8082/api/showUsers/${limit}/${offset}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch users');
            }
        })
        .then(data => {
            setUsers(data);
            setLimit(prevLimit => prevLimit + 5);
            setOffset(prevOffset => prevOffset + limit);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const followUser = (userEmail) => {
        fetch('http://localhost:8082/api/followUser', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to follow user');
            }
        })
        .then(data => {
            console.log('Followed user successfully:', data);
        })
        .catch(error => {
            console.error('Error following user:', error);
        });
    }

    useEffect(() => {
        fetch('http://localhost:8082/api/showFollowedUser', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {  
                return response.json();
            }
            throw new Error('Failed to fetch followed users');
        })
        .then(data => {
            setFollowedUsers(data)
        })
        .catch(error => {
            console.error('Error fetching followed users:', error);
        });
    }, []);

    const isUserFollowed = (userEmail) => {
        return followedUsers.some(followedUser => followedUser.email === userEmail);
    }

     const navigateToUserAccount = (userId) => {
     window.location.href = `/userAccount/${userId}`;
    }

    return (
        <div className="show-users-container">
            <h3 className="show-users-title">Who to follow</h3>
            <div className="show-users-list">
                {users.map((user) => (
                    <div key={user.id} className="user-card-x">
                        <div className="user-avatar-x">
                            <User size={36} />
                        </div>
                        <div className="user-info-x">
                            <h4 className="user-name-x" onClick={(e) => navigateToUserAccount(user.id)}>@{user.userName}</h4>
                            <p className="user-email-x">{user.email}</p>
                        </div>
                        {isUserFollowed(user.email)  ? (
                            <button className="follow-btn-following" onClick={(e) => followUser(user.email)}>Following</button>
                        ) : (<button className="follow-btn-x" onClick={(e) => followUser(user.email)}>Follow</button>)}
                    </div>
                ))}
                <button
                    onClick={fetchUsers}
                    className="load-more-x"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Show more"}
                </button>
            </div>
        </div>
    )
}

export default ShowUsers