import React, { use, useEffect, useState } from 'react';
import '../../Home/home.css';
import { Send } from 'lucide-react';


function CommentsReplies({ CommentId }) {

    const commentData = {
        "comment_id": CommentId
    }
    const [commentsRepliesVisible, setCommentsRepliesVisible] = useState(false);


    const [replies, setReplies] = React.useState([]);
    

    useEffect(() => {
        fetch("http://localhost:8082/api/show-comments-replies", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(commentData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch comments');
            }
        })
        .then(data => {
            setReplies(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }, []);

    const changeVisibility = () => {
        setCommentsRepliesVisible(!commentsRepliesVisible);
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

    const [yourCommentReply, setYourCommentReply] = useState({
        content: '',
        publicationDate: new Date().toISOString(),
        comment_id: CommentId
      });
    
    const [commentMessageReply, setCommentMessageReply] = useState('');
  
      const checkCommentReply = () => {
        
  
        const userCommentReply = yourCommentReply.content.trim();
        console.log(yourCommentReply)
  
        if (userCommentReply === '') {
            setCommentMessageReply('Please enter a comment');
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
  
            const sanitizedComment = sanitizeInput(userCommentReply);
  
            if (!validateComment(sanitizedComment)) {
                setCommentMessageReply('Invalid comment. Please remove any prohibited characters.');
                return;
            }  
            sendCommentReply()
        };
  
        const sendCommentReply = () => {
          fetch("http://localhost:8082/api/comments-replies", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify(yourCommentReply)
          })
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Failed to add comment');
              }
          })
          .then(data => {
                setReplies([...replies, data]);
                setYourCommentReply({ content: '', publicationDate: new Date().toISOString() });
          })
          .catch(error => {
              console.error('Error:', error);
          });
        }
       
        const [writeReply, setWriteReply] = useState(false);

        const writeReplay = () => {
            setWriteReply(!writeReply);
        }

  return (
   <>
    <div>
        <div className="reply-header-container">
            <p onClick={writeReplay} className='reply-show'> replay</p>
            {replies.length != 0 && <p onClick={changeVisibility} className='reply-show'>view {replies.length} replies</p> }
        </div>
        { writeReply && 
            <div className="reply-input-wrapper">
                <input
                    type="text"
                    placeholder="Your reply"
                    className="reply-input"
                    onChange={e =>
                    setYourCommentReply({ ...yourCommentReply, content: e.target.value })
                    }
                />
                <button type="button" onClick={checkCommentReply} className="comment-submit">
                    <Send />
                </button>
            </div>}
        {commentsRepliesVisible && (
        <div>
            {replies.map((reply) => (
                <div className="reply" key={reply.id}>
                    <div className="reply-header">
                        <span className="reply-author">@{reply.userName}</span>
                        <span className="reply-publication">{changeDateFormat(reply.publicationDate)}</span>  
                    </div>
                    <p className="reply-content">{reply.content}</p>
                </div>
            ))}
        </div>
        )}
       
    </div>
   </>
  );
}

export default CommentsReplies;
