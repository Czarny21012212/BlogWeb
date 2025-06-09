import React, { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import './showUsers.css'

export const ShowUsers = () => {
    const [users, setUsers] = useState([])
    const [limit, setLimit] = useState(5)
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(false)

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
        // eslint-disable-next-line
    }, []);

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
                            <h4 className="user-name-x">@{user.userName}</h4>
                            <p className="user-email-x">{user.email}</p>
                        </div>
                        <button className="follow-btn-x">Follow</button>
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