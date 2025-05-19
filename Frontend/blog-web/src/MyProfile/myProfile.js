import './myProfile.css';
import { UserCircle, MapPin, Link, Calendar } from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';

import MyPosts from '../components/myPosts/myPosts';

function MyProfile() {

    //useState to store posts, likes and followers
    const [posts, setPosts] = useState([]);         
    const [likes, setLikes] = useState(0); 
    const [followers, setFollowers] = useState(0);


    //function whiche fetches posts and likes
    useEffect(() => {
    fetch('http://localhost:8082/api/my-posts', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch profile data');
        return response.json();
      })
      .then((data) => {
        setPosts(data);

        let total = 0;
        let processed = 0;

        // Fetch likes for each post
        data.forEach((post) => {
          fetch(`http://localhost:8082/api/countOfLikes`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId: post.id }),
          })
            .then((res) => {
              if (!res.ok) throw new Error('Failed to fetch likes');
              return res.json();
            })
            .then((likeData) => {
              total += likeData.likes;
              processed++;
              if (processed === data.length) {
                setLikes(total);
              }
            })
            .catch((error) => {
              console.error(`Błąd pobierania lajków dla posta ${post.id}:`, error);
              processed++;
              if (processed === data.length) {
                setLikes(total);
              }
            });
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);


  //function to get count of followers
  useEffect(() => {
    fetch('http://localhost:8082/api/countOfFollowers', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch followers');
        return response.json();
      })
      .then((data) => {
        setFollowers(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);


  return (
    <div className="myProfile-container">
      <div className="myProfile">
        <div className="myProfile__header">
          <UserCircle className="myProfile__avatar" size={100} />
          <h1 className="myProfile__username">Jan Kowalski</h1>
        </div>
        <div className="myProfile__bio">
          <p className="myProfile__bio-text">
            Entuzjasta technologii i kawy. Tworzę aplikacje i dzielę się wiedzą o React! 🚀
          </p>
        </div>
        <div className="myProfile__stats">
          <div className="myProfile__stat">
            <span className="myProfile__stat-value">{posts.length}</span>
            <span className="myProfile__stat-label">Posty</span>
          </div>
          <div className="myProfile__stat">
            <span className="myProfile__stat-value">{likes}</span>
            <span className="myProfile__stat-label">Polubienia</span>
          </div>
          <div className="myProfile__stat">
            <span className="myProfile__stat-value">{followers}</span>
            <span className="myProfile__stat-label">Obserwujący</span>
          </div>
        </div>
        <div className="myProfile__posts">
          <h2>Twoje posty</h2>
          <div className="myProfile__posts-list">
            <MyPosts></MyPosts>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;