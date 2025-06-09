import React from 'react'
import { User } from 'lucide-react'
import './ChangeUserName.css'

export const ChangeUserName = ({ onClose }) => {
    const [userName, setUserName] = React.useState("");
    const [message, setMessage] = React.useState("");

    const changeUserName = () => {
        fetch('http://localhost:8082/api/changeUserName', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ "userName": userName })
        })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Failed to change username');
        })
        .then(data => setMessage(data.message))
        .catch(error => console.error('Error:', error));
    };

    return (
        <div className="change-username-modal-bg">
            <div className="change-username-container">
                {onClose && (
                    <button className="change-username-close-btn" onClick={onClose} aria-label="Close">
                        <span style={{fontSize: 22, color: "var(--text-tertiary, #8b949e)"}}>×</span>
                    </button>
                )}
                <div className="change-username-header">
                    <User size={20} className="change-username-icon" />
                    <h4>Change your username</h4>
                </div>
                <div className="change-username-input-wrapper">
                    <input
                        className="change-username-input"
                        type="text"
                        placeholder="Enter new username..."
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        maxLength={32}
                    />
                    <button
                        className="change-username-btn"
                        onClick={changeUserName}
                        disabled={!userName.trim()}
                    >
                        Save
                    </button>
                </div>
                {message && <p className="change-username-message">{message}</p>}
            </div>
        </div>
    )
}