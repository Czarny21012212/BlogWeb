import  { useEffect, useState } from 'react';
import '../../Home/home.css';
import StatisticsPost from './StatisticsPost';
import Comments from './comments';

function AllPosts() {

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
            setPosts(data);
        })
        .catch(error => {
            console.error('Error:', error);
        },  [page]);
    });

    const handleScroll = ({ scrollOffset, scrollHeight, clientHeight }) => {
    if (scrollOffset + clientHeight >= scrollHeight - 50 && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
   <div className="posts-container">
            {posts.map((post) => (
                <div className="post" key={post.id}>
                    <div className="post-header">
                        <h2 className="post-title">{post.title}</h2>
                        <span className="post-author">@{post.author}</span>
                    </div>
                    <p className="post-content">{post.content}</p>
                    <StatisticsPost postId={post.id} />
                    <Comments postId={post.id} />
                </div>
            ))}
        </div>
  );
}

export default AllPosts;
