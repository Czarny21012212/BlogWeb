import './myProfile.css';
import { UserCircle, Award, Heart, Users } from 'lucide-react';
import React, { use } from 'react';
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
        setFollowers(data.countOfFollows);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  //function to show data about profile
  const [userData, setUserData] = useState([]);
  console.log(userData.userName);
  
    useEffect(() => {
        fetch("http://localhost:8082/api/infoAboutProfile", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch user panel data');
            }
        })
        .then(data => {
            setUserData(data[0]);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, []);

    const [bio, setBio] = useState("");

    useEffect(() => {
      fetch("http://localhost:8082/api/bio", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      .then(response => {
          if (response.ok) {
              return response.json();
          } else {
              throw new Error('Failed to fetch bio data');
          }
      })
      .then(data => {
          setBio(data.bio)
      })
      .then(error => {
          console.error('Error:', error);
      });
    }, []);


 return (
        <div className="myProfile-container">
            <div className="myProfile">
                <div className="myProfile__header">
                    <UserCircle className="myProfile__avatar" size={120} />
                    <h1 className="myProfile__username">{userData.userName || 'Loading...'}</h1>
                </div>
                
                <div className="myProfile__bio">
                    <p className="myProfile__bio-text">
                       {bio || 'This user has not set a bio yet.'}
                    </p>
                </div>
                
                <div className="myProfile__stats">
                    <div className="myProfile__stat">
                        <span className="myProfile__stat-value">{posts.length}</span>
                        <span className="myProfile__stat-label">Posts</span>
                    </div>
                    <div className="myProfile__stat">
                        <span className="myProfile__stat-value">{likes}</span>
                        <span className="myProfile__stat-label">Likes</span>
                    </div>
                    <div className="myProfile__stat">
                        <span className="myProfile__stat-value">{followers}</span>
                        <span className="myProfile__stat-label">Followers</span>
                    </div>
                </div>
                
                <div className="myProfile__posts">
                    <h2>Your posts</h2>
                    <div className="myProfile__posts-list">
                        <MyPosts />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;