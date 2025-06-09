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
        <h1>Settings</h1>
      </div>
      <CompleteBio />
      <ChangeUserName />
    </div>
  )
}

export default Settings