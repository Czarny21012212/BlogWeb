import './myProfile.css';
import { UserCircle, MapPin, Link, Calendar } from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';

import MyPosts from '../components/myPosts/myPosts';

function MyProfile() {
  const stats = {
    posts: 42,
    likes: 128,
    followers: 305,
  };

  return (
    <div className="myProfile-container">
      <div className="myProfile">
        {/* Sekcja nagłówka z nazwą i zdjęciem profilowym */}
        <div className="myProfile__header">
          <UserCircle className="myProfile__avatar" size={100} />
          <h1 className="myProfile__username">Jan Kowalski</h1>
        </div>

        {/* Sekcja bio w stylu X */}
        <div className="myProfile__bio">
          <p className="myProfile__bio-text">
            Entuzjasta technologii i kawy. Tworzę aplikacje i dzielę się wiedzą o React! 🚀
          </p>
        </div>

        {/* Sekcja statystyk */}
        <div className="myProfile__stats">
          <div className="myProfile__stat">
            <span className="myProfile__stat-value">{stats.posts}</span>
            <span className="myProfile__stat-label">Posty</span>
          </div>
          <div className="myProfile__stat">
            <span className="myProfile__stat-value">{stats.likes}</span>
            <span className="myProfile__stat-label">Polubienia</span>
          </div>
          <div className="myProfile__stat">
            <span className="myProfile__stat-value">{stats.followers}</span>
            <span className="myProfile__stat-label">Obserwujący</span>
          </div>
        </div>

        {/* Sekcja postów */}
        <div className="myProfile__posts">
          <h2>Twoje posty</h2>
          <div className="myProfile__posts-list">
            {/* Przykładowy post */}
            <MyPosts></MyPosts>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;