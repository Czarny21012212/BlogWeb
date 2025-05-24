import './createPosts.css';
import { useState } from 'react';
import { X } from 'lucide-react';

function CreatePosts() {

  const [show, setShow] = useState(false);

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setShow(prev => !prev);
  }

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    publicationDate: new Date().toISOString(),
  })

  const validatePostData = (e) => {
    e.preventDefault();
    if (postData.title === "" || postData.content === "") {
      setMessage("Please fill in all fields");
      return false;
    }else if (postData.title.length < 5 && postData.title.length > 20) {
      setMessage("Title must be between 5 and 20 characters");
      return false;
    }else if (postData.content.length < 10 && postData.content.length > 100) {
      setMessage("Content must be between 10 and 100 characters");
      return false;
    }else {
      setMessage("Post created successfully"); 
      submitPostData();
    }
}
  const submitPostData = () => {
    fetch('http://localhost:8082/api/add-post', {
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
        throw new Error('Network response was not ok');
      }
    })
    .then(data => {
      setMessage("Post created successfully");
      setPostData({
        title: "",
        content: ""
      });
      setShow(false)
    })
    .catch((error) => {
      console.error('Error:', error);
      setMessage("Error creating post");
    });
  }

  return (
    <>
      <div className="create-posts">
        <button
          className="create-posts-title"
          onClick={handleSubmit}
        >
          Create Post
        </button>

        {show && (
          <>
            <div className="create-posts-form">
              <button className="create-posts-close" onClick={() => setShow(false)}>
                ✕
              </button>
              <h2 className="create-posts-heading">Create a new post</h2>

              <input
                type="text"
                className="create-posts-input"
                placeholder="Post Title"
                value={postData.title}
                onChange={(e) => setPostData({ ...postData, title: e.target.value })}
              />

              <textarea
                className="create-posts-textarea"
                placeholder="What's on your mind?"
                value={postData.content}
                onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                rows={5}
              ></textarea>

              <div className="create-posts-actions">
                <span className="reply-info">Everyone can reply</span>
                <button
                  className="create-posts-submit"
                  onClick={validatePostData}
                  disabled={!postData.title || !postData.content}
                >
                  Publish Post
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {message && <div className="create-posts-message">{message}</div>}
    </>
  );
}

export default CreatePosts;
