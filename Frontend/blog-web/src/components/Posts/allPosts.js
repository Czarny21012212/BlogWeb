import  { useEffect, useState } from 'react';
import '../../Home/home.css';
import StatisticsPost from './StatisticsPost';
import Comments from './comments';

function AllPosts({ children }) {

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;

    useEffect(() => {
        fetch('http://localhost:8082/api/all-post', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch posts');
            }
        })
        .then(data => {
          setPosts(data)
        })
        .catch(error => {
            console.error('Error:', error);
        },  [page]);
    }, []);


    const handleScroll = ({ scrollOffset, scrollHeight, clientHeight }) => {
    if (scrollOffset + clientHeight >= scrollHeight - 50 && hasMore) {
      setPage((prev) => prev + 1);
    }
    
  };
  console.log(posts)

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

    const navigateToUserAccount = (userId) => {
     window.location.href = `/userAccount/${userId}`;
    }
    const [followedUsers, setFollowedUsers] = useState([])

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

  return (
   <div className="posts-container">
           {posts
            .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)) 
            .map((post) => (
                
                <div className="post" key={post.id}>
                    <div className="post-header">
                        <div className='post-author-container'>
                            <span className="post-author" onClick={(e) => navigateToUserAccount(post.userId)}>@{post.author}</span>
                            {isUserFollowed(post.email)  ? (
                                <button className="follow-btn-following" onClick={(e) => followUser(post.email)}>Following</button>
                            ) : (<button className="follow-btn-x" onClick={(e) => followUser(post.email)}>Follow</button>)}
                        </div>
                        <p className='post-date'>{changeDateFormat(post.publicationDate)}</p>
                    </div>
                    
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-content">{post.content}</p>
                    <StatisticsPost postId={post.id} />
                    <Comments postId={post.id} />
                </div>
            ))}
            {!posts.length && (
                <div className="no-posts-message">
                    <p>No posts available</p>
                </div>
            )}
        </div>
  );
}

export default AllPosts;
