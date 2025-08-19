import React from 'react';

const SpotifyAuth = ({ onLogin }) => {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <h2>Connect to Spotify</h2>
        <p>
          To search and play tracks, we need access to your Spotify account.
        </p>
        <button className="login-btn" onClick={onLogin}>
          🎵 Connect to Spotify
        </button>
        <div className="auth-note">
          <p><strong>Note:</strong> You'll need a Spotify Premium account to use the playback features.</p>
          <p>Make sure to update the CLIENT_ID in App.js with your Spotify app's client ID.</p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyAuth;