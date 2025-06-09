import React, { useState } from 'react'
import './Settings.css'
import { CompleteBio } from './CompleteBio/completeBio'
import { Settings as SettingsIcon, X } from 'lucide-react'
import { ChangeUserName } from './ChangeUserName/ChangeUserName'

const Settings = ({ userId, onClose }) => {
  const [showSettings, setShowSettings] = useState(true);

  if (!showSettings) return null;

  return (
    <div className="settings-container">
      <button
        className="settings-close-btn"
        onClick={() => {
          setShowSettings(false);
          if (onClose) onClose();
        }}
        aria-label="Close settings"
      >
        <X size={24} />
      </button>
      <div className="settings-header">
        <SettingsIcon size={32} className="settings-icon" />
        <h2>Settings</h2>
      </div>
      <p className="settings-description">
        You can change your username and add a short bio to let others know more about you.<br />
        <span style={{ color: "var(--text-tertiary, #8b949e)" }}>
          Changes are visible to everyone. Make sure your information is appropriate and unique.<br />
          Your username is how others will find you. Your bio helps you express yourself!
        </span>
      </p>
      <section className="settings-section">
        <CompleteBio />
      </section>
      <section className="settings-section">
        <ChangeUserName />
      </section>
    </div>
  )
}

export default Settings