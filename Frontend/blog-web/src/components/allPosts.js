import  { useEffect, useState } from 'react';

function AllPosts() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8082/api/all-post', {
            method: 'GET',
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
   {posts.map((post) => (
    <div className="post" key={post.id}>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <p>Author: {post.author}</p>
    </div>
   ))}
    
   </>
  );
}

export default AllPosts;
