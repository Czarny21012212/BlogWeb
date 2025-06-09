import  { use, useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import '../../Home/home.css';
import CommentsReplies from './commentReplies';

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
    }, [postId]);

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

    const taggle = (e) => {
        setYourComment({ ...yourComment, [e.target.name]: e.target.value });   
    }
    return (
    <div className="comments-container">
      <p className="toggle-comments" onClick={handleShowComments}>
        {postVisible 
          ? 'Hide comments' 
          : (comments.length > 0 
              ? <>Show <span>{comments.length}</span> comments</> 
              : 'No comments')}
      </p>

      {postVisible && (
        <div>
          <div className="comment-form">
            <div className="comment-input-wrapper">
              <input
                id="comment-content"
                type="text"
                placeholder="Write your comment..."
                value={yourComment.content}
                maxLength={78} 
                name="content"
                onChange={taggle}
                className="comment-input"
              />
              <button type="button" onClick={checkComment} className="comment-submit">
                <Send />
              </button>
            </div>
            {commentMessage && <p className="comment-error">{commentMessage}</p>}
          </div>
          <div className="comments-divider" />
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <div className="comment-header">
                  <span className="comment-author">@{comment.userName}</span>
                  <span className="comment-date">{changeDateFormat(comment.publicationDate)}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
                <CommentsReplies CommentId={comment.comment_Id} />
              </div>
            ))
          ) : (
            <p className="no-comments">No reply</p>
          )}
        </div>
      )}
    </div>
);
}

export default Comments;
