import './myProfile.css';
import { UserCircle, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MyPosts from '../components/myPosts/myPosts';
import SettingsCom from '../components/ProfileSettings/Settings.jsx';
import UserPanel from '../components/UserPanel/userPanel.js';
import CreatePosts from '../components/createPosts/createPosts.js';
import LogOut from '../components/logout/logout.js';

function MyProfile() {
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState(0);
    const [followers, setFollowers] = useState(0);
    const [userData, setUserData] = useState([]);
    const [bio, setBio] = useState("");
    const [postToDelete, setPostToDelete] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8082/api/my-posts', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch profile data');
                return response.json();
            })
            .then(data => {
                setPosts(data);
                let total = 0;
                let processed = 0;
                data.forEach(post => {
                    fetch(`http://localhost:8082/api/countOfLikes`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ postId: post.id }),
                    })
                        .then(res => {
                            if (!res.ok) throw new Error('Failed to fetch likes');
                            return res.json();
                        })
                        .then(likeData => {
                            total += likeData.likes;
                            processed++;
                            if (processed === data.length) setLikes(total);
                        })
                        .catch(error => {
                            console.error(`Błąd pobierania lajków dla posta ${post.id}:`, error);
                            processed++;
                            if (processed === data.length) setLikes(total);
                        });
                });
            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8082/api/countOfFollowers', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch followers');
                return response.json();
            })
            .then(data => {
                setFollowers(data.countOfFollows);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8082/api/infoAboutProfile", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error('Failed to fetch user panel data');
            })
            .then(data => {
                setUserData(data[0]);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8082/api/bio", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error('Failed to fetch bio data');
            })
            .then(data => setBio(data.Bio))
            .catch(error => console.error('Error:', error));
    }, []);

    const confirmDelete = () => {
        if (!postToDelete) return;
        fetch(`http://localhost:8082/api/delete-post/${postToDelete}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (response.ok) {
                    setPosts(posts.filter(post => post.id !== postToDelete));
                    setPostToDelete(null);
                } else {
                    throw new Error('Failed to delete post');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <>
        <div className="left-side">
            <div className='user-panel'>
                <UserPanel />
            </div>
            <div className='left-menu'>
                <div className='menu-create-post'>
                    <CreatePosts />
                </div>
                <div className='menu-logout'>
                    <LogOut />
                </div>
            </div>
        </div>
        <div className="myProfile-container">
            {showSettings && (
                <div className="settings-modal">
                    <SettingsCom />
                </div>
            )}
            <button
                className="home-button"
                onClick={() => window.location.href = 'http://localhost:3000/'}
                aria-label="Go to home"
            >
                ←
            </button>

            <div className="myProfile">
                <div className="myProfile__header">
                    <div className="myProfile__avatar-container">
                        <UserCircle className="myProfile__avatar" size={104} />
                    </div>
                    <div className="myProfile__user-info">
                        <h1 className="myProfile__username">@{userData.userName || 'Loading...'}</h1>
                    </div>
                    <div className='myProfile__settings'>
                        <Settings size={30} onClick={() => setShowSettings(prev => !prev)} />
                    </div>
                </div>
                <div>
                    
                </div>

                <div className="myProfile__bio">
                    <p className="myProfile__bio-text">
                        {bio || 'This user has not set a bio yet.'}
                    </p>
                </div>

                <div className="myProfile__stats">
                    <div className="myProfile__stat">
                        <span className="myProfile__stat-value">{posts.length}</span>
                        <span className="myProfile__stat-label"> Posts</span>
                    </div>
                    <div className="myProfile__stat">
                        <span className="myProfile__stat-value">{likes}</span>
                        <span className="myProfile__stat-label"> Likes</span>
                    </div>
                    <div className="myProfile__stat">
                        <span className="myProfile__stat-value">{followers}</span>
                        <span className="myProfile__stat-label"> Followers</span>
                    </div>
                </div>

                <div className="myProfile__posts">
                    <h2 className='myProfile__posts-h2'>Posts</h2>
                    <div className="myProfile__posts-list">
                        <MyPosts renderActions={(postId) => (
                            <button className="deleteButton" onClick={() => setPostToDelete(postId)}>Delete</button>
                        )} />
                    </div>
                </div>
            </div>

            {postToDelete && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Are you sure you want to delete this post?</h3>
                        <p>
                            If you delete this post, you will not be able to restore it. The likes it received will be removed from your statistics, which may affect your profile's popularity.
                        </p>
                        <div className="modal-buttons">
                            <button className="confirm" onClick={confirmDelete}>Yes, delete</button>
                            <button className="cancel" onClick={() => setPostToDelete(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default MyProfile;
