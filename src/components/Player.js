import React, { useState, useEffect } from 'react';

const Player = ({ player, token, deviceId }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    if (!player) return;

    player.addListener('player_state_changed', (state) => {
      if (!state) return;

      setCurrentTrack(state.track_window.current_track);
      setIsPlaying(!state.paused);
      setPosition(state.position);
    });

    return () => {
      player.removeListener('player_state_changed');
    };
  }, [player]);

  const togglePlayback = () => {
    if (!player) return;
    
    player.togglePlay().then(() => {
      console.log('Toggled playback');
    });
  };

  const skipToNext = () => {
    if (!player) return;
    
    player.nextTrack().then(() => {
      console.log('Skipped to next track');
    });
  };

  const skipToPrevious = () => {
    if (!player) return;
    
    player.previousTrack().then(() => {
      console.log('Skipped to previous track');
    });
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="player-container">
      <div className="web-player-section">
        <h3><span>🎵</span> Web Player</h3>
        <p className="web-player-note">Premium account required for playback</p>
        
        <div className="player-controls">
          <button className="control-btn" onClick={skipToPrevious}>
            ⏮️
          </button>
          
          <button className="play-pause-btn" onClick={togglePlayback}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button className="control-btn" onClick={skipToNext}>
            ⏭️
          </button>
        </div>
        
        <div className="player-status">
          {!currentTrack ? (
            <p>No track playing. Generate a playlist and click on a track to start playing!</p>
          ) : (
            <div className="progress-info">
              <span>{formatTime(position)}</span>
              <span> / </span>
              <span>{formatTime(currentTrack.duration_ms)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;