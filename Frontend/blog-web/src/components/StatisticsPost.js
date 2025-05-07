import React, { useEffect } from 'react';
import '../Home/home.css';

function StatisticsPost({ postId }) {

    const postData = {
        postId: postId
    }

    const [likes, setLikes] = React.useState(0);


    const handleLike = () => {
        fetch("http://localhost:8082/api/likePost", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to like post');
            }
        })
        .then(data => {
            console.log('Post liked successfully:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        fetch(`http://localhost:8082/api/countOfLikes`, {
            method: 'Post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch post statistics');
            }
        })
        .then(data => {
            setLikes(data.likes);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });


  return (
    <div className="statistics-container">
    <button className="statistics-icon" onClick={handleLike}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 24 24"
        >
        <path d="M12 17.27L18.18 21 16.54 13.97 
                22 9.24l-7.19-.61L12 2 9.19 8.63 
                2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <span>{likes}</span>
    </button>
    </div>


  );
}

export default StatisticsPost;
