import React, { useEffect, useState } from 'react';
import './CompleteBio.css';
import { Pencil } from 'lucide-react';

export const CompleteBio = () => {
  const [bioContent, setBioContent] = useState("");
  const [message, setMessage] = useState("");
  const [checkBio, setCheckBio] = useState(false);

  const ChangeBio = () => {
    fetch('http://localhost:8082/api/addBio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ "bio": bioContent })
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Failed to change bio');
      })
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetch("http://localhost:8082/api/bio", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Failed to fetch bio data');
      })
      .then(data => {
        if (data.Bio) {
          setCheckBio(true);
        } else {
          setCheckBio(false);
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="complete-bio-container">
      <div className="bio-header">
        <Pencil size={20} className="bio-icon" />
        <h4>Complete your bio</h4>
      </div>
      <div className="bio-input-wrapper">
        {checkBio ? (
          <input
            value="You already have a bio"
            disabled
            className="bio-input disabled"
          />
        ) : (
          <input
            className="bio-input"
            type="text"
            placeholder="Write your bio..."
            onChange={(e) => setBioContent(e.target.value)}
          />
        )}
        <button
          className="bio-btn"
          onClick={ChangeBio}
          disabled={checkBio}
        >
          Save
        </button>
      </div>
      {message && <p className="bio-message">{message}</p>}
    </div>
  );
};