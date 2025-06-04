import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCircle} from 'lucide-react';
import Comments from '../Posts/comments';
import StatisticsPost from '../Posts/StatisticsPost';
import './userAccount.css'; 

const UserAccount = () => {
  const { id } = useParams();
  
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8082/api/userPosts/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch user account data');
      }
    })
    .then(data => {
      setPosts(data);

              let total = 0;
              let processed = 0;
      
              // Fetch likes for each post
              data.forEach((post) => {
                fetch(`http://localhost:8082/api/countOfLikes`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ postId: post.id }),
                })
                  .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch likes');
                    return res.json();
                  })
                  .then((likeData) => {
                    total += likeData.likes;
                    processed++;
                    if (processed === data.length) {
                      setLikes(total);
                    }
                  })
                  .catch((error) => {
                    console.error(`Błąd pobierania lajków dla posta ${post.id}:`, error);
                    processed++;
                    if (processed === data.length) {
                      setLikes(total);
                    }
                  });
              });

    })
    .catch(error => {
      console.error('Error:', error);
    });
    
  }, [id]);

  const [likes, setLikes] = useState(0);

 

  useEffect(() => {

      let total = 0;
      let processed = 0;

      posts.forEach((post) => {
          fetch(`http://localhost:8082/api/countOfLikes`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: post.id }),
          })
            .then((res) => {
              if (!res.ok) throw new Error('Failed to fetch likes');
              return res.json();
            })
            .then((postsdata) => {
              total += postsdata.likes;
              processed++;
              if (processed === posts.length) {
                setLikes(total);
              }
            })
            .catch((error) => {
              console.error(`Błąd pobierania lajków dla posta ${post.id}:`, error);
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
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch user data');
      }
    })
    .then(data => {
      setUserData(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, [id]);

   
  

  const changeDateFormat = (dateString) => {
        const date = new Date(dateString);
        const NowDate = new Date();
        const betweenDates = Math.floor((NowDate - date) / 1000 );

        if(betweenDates < 3600) {
          const minutes = Math.floor(betweenDates / 60);
          if (minutes === 0) {
            return `Now`;
          }else if (minutes === 1) {
            return `1 minute ago`;
          }
          return `${minutes} minuts ago`;  
        }else if(betweenDates > 3600 && betweenDates < 86400) {
            const hours = Math.floor(betweenDates / 3600);
            return `${hours} hours ago`;
        }else if(betweenDates > 86400 && betweenDates < 2592000) {
            const days = Math.floor(betweenDates / 86400);
            return `${days} days ago`;
        }
        else if(betweenDates > 2592000 && betweenDates < 31536000) {
            const months = Math.floor(betweenDates / 2592000);
            return `${months} months ago`;
        }else {
            const years = Math.floor(betweenDates / 31536000);
            return `${years} years ago`;
        }

    }   

  const totalFollowers = userData.length > 0 ? userData[0].countOfFollowers : 0;
  const userInfo = userData.length > 0 ? userData[0] : {};

  return (
    <div className="userProfile-container">
      <button 
        className="home-button"
        onClick={() => window.location.href = 'http://localhost:3000/'}
        aria-label="Go to home"
      >
        ←
      </button>
      
      <div className="userProfile">
        {/* Header Section */}
        <div className="userProfile__header">
          <div className="userProfile__avatar-container">
            <UserCircle className="userProfile__avatar" size={104} />
          </div>
          <div className="userProfile__user-info">
            <h1 className="userProfile__username">
              @{userInfo.userName || 'Loading...'}
            </h1>
          </div>
        </div>
        
        {/* Bio Section */}
        <div className="userProfile__bio">
          <p className="userProfile__bio-text">
            {userInfo.bio || 'This user has not set a bio yet.'}
          </p>
        </div>
        
        {/* Stats Section */}
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
        
        {/* Posts Section */}
        <div className="userProfile__posts">
          <h2 className="userProfile__posts-h2">Posts</h2>
          <div className="userProfile__posts-list">
            {posts
            .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)) 
            .map((post) => (
                <div className="post" key={post.id}>
                    <div className="post-header">
                        <span className="post-author">@{post.author}</span>
                        <p className='post-date'>{changeDateFormat(post.publicationDate)}</p>
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
  );
};

export default UserAccount;
