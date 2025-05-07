import  { useEffect, useState } from 'react';
import '../Home/home.css';
import StatisticsPost from './StatisticsPost';

function AllPosts() {

    const [posts, setPosts] = useState([]);

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
            setPosts(data);
        })
        .catch(error => {
            console.error('Error:', error);
        },  []);
    });

  return (
   <>
   <div className="posts-container">
    {posts.map((post) => (
        <div className="post" key={post.id}>
        <div className="post-header">
            <h2 className="post-title">{post.title}</h2>
            <span className="post-author">@{post.author}</span>
        </div>
        <p className="post-content">{post.content}</p>

        <StatisticsPost postId={post.id}></StatisticsPost>
        </div>
    ))}
    </div>

    
   </>
  );
}

export default AllPosts;
