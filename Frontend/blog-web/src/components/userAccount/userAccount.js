import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import Comments from '../Posts/comments';
import StatisticsPost from '../Posts/StatisticsPost';
import './userAccount.css';
import UserPanel from '../UserPanel/userPanel';
import CreatePosts from '../createPosts/createPosts';
import LogOut from '../logout/logout';

const UserAccount = () => {
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState([]);
  const [likes, setLikes] = useState(0);
  const [followedUsers, setFollowedUsers] = useState([]);

  const userInfo = userData.length > 0 ? userData[0] : {};
  const totalFollowers = userInfo.countOfFollowers || 0;

  useEffect(() => {
    fetch(`http://localhost:8082/api/userPosts/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user posts');
        return response.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  useEffect(() => {
    let total = 0;
    let processed = 0;

    if (posts.length === 0) return;

    posts.forEach((post) => {
      fetch('http://localhost:8082/api/countOfLikes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post.id }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch likes');
          return res.json();
        })
        .then(likeData => {
          total += likeData.likes;
          processed++;
          if (processed === posts.length) {
            setLikes(total);
          }
        })
        .catch(error => {
          console.error(`Error fetching likes for post ${post.id}:`, error);
          processed++;
          if (processed === posts.length) {
            setLikes(total);
          }
        });
    });
  }, [posts]);

  useEffect(() => {
    fetch(`http://localhost:8082/api/userData/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
      })
      .then(data => {
        setUserData(data);
      })
      .catch(error => console.error('Error:', error));
  }, [id]);

  useEffect(() => {
    fetch('http://localhost:8082/api/showFollowedUser', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch followed users');
        return response.json();
      })
      .then(data => setFollowedUsers(data))
      .catch(error => console.error('Error fetching followed users:', error));
  }, []);

  const isUserFollowed = (userEmail) => {
    return followedUsers.some(user => user.email === userEmail);
  };

  const toggleFollowUser = () => {
  const isFollowed = isUserFollowed(userInfo.email);

  const endpoint = isFollowed
    ? `http://localhost:8082/api/unFollow/${id}`
    : 'http://localhost:8082/api/followUser';

  const options = isFollowed
    ? { method: 'GET', credentials: 'include' }
    : {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userInfo.email }),
      };

  fetch(endpoint, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to toggle follow');
      }
      return response.json();
    })
    .then(() => {
      setFollowedUsers((prev) =>
        isFollowed
          ? prev.filter((user) => user.email !== userInfo.email)
          : [...prev, { email: userInfo.email }]
      );
    })
    .catch((error) => {
      console.error('Error toggling follow:', error);
    });
  };




  const changeDateFormat = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} day(s) ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} month(s) ago`;
    return `${Math.floor(diff / 31536000)} year(s) ago`;
  };

  return (
    <>
      <div className="left-side">
        <div className="user-panel">
          <UserPanel />
        </div>
        <div className="left-menu">
          <div className="menu-create-post">
            <CreatePosts />
          </div>
          <div className="menu-logout">
            <LogOut />
          </div>
        </div>
      </div>

      <div className="userProfile-container">
        <button
          className="home-button"
          onClick={() => (window.location.href = 'http://localhost:3000/')}
          aria-label="Go to home"
        >
          ←
        </button>

        <div className="userProfile">
          <div className="userProfile__header">
            <div className="userProfile__avatar-container">
              <UserCircle className="userProfile__avatar" size={104} />
            </div>
            <div className="userProfile__user-info">
              <h1 className="userProfile__username">
                @{userInfo.userName || 'Loading...'}
              </h1>
            </div>
            {isUserFollowed(userInfo.email) ? (
              <button
                className="follow-btn-following"
                onClick={() => toggleFollowUser(userInfo.email)}
              >
                Following
              </button>
            ) : (
              <button
                className="follow-btn-x"
                onClick={() => toggleFollowUser(userInfo.email)}
              >
                Follow
              </button>
            )}
          </div>

          <div className="userProfile__bio">
            <p className="userProfile__bio-text">
              {userInfo.bio || 'This user has not set a bio yet.'}
            </p>
          </div>

          <div className="userProfile__stats">
            <div className="userProfile__stat">
              <span className="userProfile__stat-value">{posts.length}</span>
              <span className="userProfile__stat-label">Posts</span>
            </div>
            <div className="userProfile__stat">
              <span className="userProfile__stat-value">{likes}</span>
              <span className="userProfile__stat-label">Likes</span>
            </div>
            <div className="userProfile__stat">
              <span className="userProfile__stat-value">{totalFollowers}</span>
              <span className="userProfile__stat-label">Followers</span>
            </div>
          </div>

          <div className="userProfile__posts">
            <h2 className="userProfile__posts-h2">Posts</h2>
            <div className="userProfile__posts-list">
              {posts
                .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate))
                .map((post) => (
                  <div className="post" key={post.id}>
                    <div className="post-header">
                      <span className="post-author">@{post.author}</span>
                      <p className="post-date">{changeDateFormat(post.publicationDate)}</p>
                    </div>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{post.content}</p>
                    <StatisticsPost postId={post.id} />
                    <Comments postId={post.id} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAccount;