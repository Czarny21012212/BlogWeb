import React from 'react';
import { useEffect, useState } from 'react'
import StatisticsPost from '../Posts/StatisticsPost';
import Comments from '../Posts/comments';
import userAccount from '../userAccount/userAccount';



function MyPosts({ renderActions }) {

    const [posts, setPosts] = useState([]);

    useEffect(() => {

    fetch('http://localhost:8082/api/my-posts', {
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
            setPosts(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }, []);

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
    const navigateToUserAccount = (userId) => {
     window.location.href = `/user-account/${userId}`;
    }
  return (
   <div className="posts-container">
    {posts
        .sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)) 
        .map((post) => (
        <div className="post" key={post.id} name={post.id}>
            
            <div className="post-header">
                <div className='post-header-info'>
                    <p className="post-date">{changeDateFormat(post.publicationDate)}</p>
                </div>
            {renderActions?.(post.id)}
            </div>
            
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <StatisticsPost postId={post.id} />
            <Comments postId={post.id} />
        </div>
        ))}
    </div>

  );
}

export default MyPosts;
