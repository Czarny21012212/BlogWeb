import  { use, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
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

    const [commentMessage, setCommentMessage] = useState('');

    const [yourComment, setYourComment] = useState({
      content: '',
      publicationDate: new Date().toISOString(),
      post_id: postId
    });
  

    const checkComment = () => {

      const userComment = yourComment.content.trim();
      console.log(yourComment)

      if (userComment === '') {
          setCommentMessage('Please enter your comment');
          return;
      }

      const sanitizeInput = (input) => {
          return input.replace(/</g, "&lt;").replace(/>/g, "&gt;")
                      .replace(/&/g, "&amp;").replace(/"/g, "&quot;")
                      .replace(/'/g, "&#x27;");
          };

          const validateComment = (comment) => {
              const forbiddenPatterns = [/script/i, /<.*?>/g, /on\w+=/g];
              return !forbiddenPatterns.some(pattern => pattern.test(comment));
          };

          const sanitizedComment = sanitizeInput(userComment);

          if (!validateComment(sanitizedComment)) {
              setCommentMessage('Invalid comment. Please remove any prohibited characters.');
              return;
          }  
          sendComment()
      };

      const sendComment = () => {
        fetch("http://localhost:8082/api/comment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(yourComment)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to add comment');
            }
        })
        .then(data => {
            setComments([...comments, data]);
            setYourComment({ content: '', publicationDate: new Date().toISOString() });
        })
        .catch(error => {
            console.error('Error:', error);
        });
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
              <div className="comment-form">
                <div className="comment-input-wrapper">
                  <input
                    id="comment-content"
                    type="text"
                    placeholder="Wpisz swój komentarz..."
                    value={yourComment.content}
                    maxLength={80}
                    onChange={e => setYourComment({ ...yourComment, content: e.target.value })}
                    className="comment-input"
                  />
                  <button type="button" onClick={checkComment} className="comment-submit">
                    <Send  />
                  </button>
                </div>
                {commentMessage && <p className="comment-error">{commentMessage}</p>}
              </div>


            </div>
          )}
          
        </div>
      );
}

export default Comments;
