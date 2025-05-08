import  { use, useEffect, useState } from 'react';
import '../Home/home.css';

function Comments({ postId }) {

    const [postVisible, setPostVisible] = useState(false);

    const postData = {
        "post_id": postId
    }

    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8082/api/showCommetns", {
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
                throw new Error('Failed to fetch comments');
            }
        })
        .then(data => {
            setComments(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        console.log("postId", postId);
        console.log("postData", postData);

    }, []);

    const handleShowComments = () => {
        setPostVisible(!postVisible);
    }

    return (
        <div className="comments-container">
          <p className="toggle-comments" onClick={handleShowComments}>
            {postVisible ? 'Ukryj komentarze' : 'Pokaż komentarze'}
          </p>
    
          {postVisible && (
            <div>
              <div className="comments-divider" />
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <div className="comment-header">
                      <span className="comment-author">@{comment.userName}</span>
                      <span className="comment-date">{comment.publicationDate}</span>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="no-comments">Brak komentarzy</p>
              )}
            </div>
          )}
        </div>
      );
}

export default Comments;
