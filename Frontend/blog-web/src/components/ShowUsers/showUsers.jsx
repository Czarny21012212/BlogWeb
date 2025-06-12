import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import './showUsers.css'

const UserAvatar = ({ username }) => {
  const firstLetter = username ? username.charAt(0).toUpperCase() : '?';
  
  return (
    <div className="user-avatar">
      {firstLetter}
    </div>
  );
};

export const ShowUsers = () => {
    const [users, setUsers] = useState([])
    const [limit, setLimit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(false)
    const [followedUsers, setFollowedUsers] = useState([])
    const [hoveredUserId, setHoveredUserId] = useState(null); // <--- zmiana

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

    const toggleFollowUser = (userEmail, userId) => {
        const isFollowed = isUserFollowed(userEmail);

        const endpoint = isFollowed
            ? `http://localhost:8082/api/unFollow/${userId}`  
            : 'http://localhost:8082/api/followUser';       

        const options = isFollowed
            ? { method: 'GET', credentials: 'include' }
            : {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
              };

        fetch(endpoint, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to toggle follow');
            }
            return response.json();
        })
        .then(() => {
            setFollowedUsers(prev =>
                isFollowed
                    ? prev.filter(user => user.email !== userEmail)
                    : [...prev, { email: userEmail }]
            );
        })
        .catch(error => {
            console.error('Error toggling follow:', error);
        });
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
                            <UserAvatar username={user.userName} />
                        </div>
                        <div className="user-info-x">
                            <h4 className="user-name-x" onClick={() => navigateToUserAccount(user.id)}>{user.userName}</h4>
                            <p className="user-email-x">{user.email}</p>
                        </div>
                        {isUserFollowed(user.email) ? (
                        <button
                            className="follow-btn-following"
                            onClick={() => toggleFollowUser(user.email, user.id)}
                            onMouseEnter={() => setHoveredUserId(user.id)}
                            onMouseLeave={() => setHoveredUserId(null)}
                        >
                            {hoveredUserId === user.id ? 'Unfollow' : 'Following'}
                        </button>
                        ) : (
                        <button
                            className="follow-btn-x"
                            onClick={() => toggleFollowUser(user.email, user.id)}
                        >
                            Follow
                        </button>
                        )}
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