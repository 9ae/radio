import React from 'react';

const CurrentTrackDisplay = ({ currentTrackInfo }) => {
  console.log(currentTrackInfo);
  return (
    <div className="current-track">
      <div className={`circular-artwork ${!currentTrackInfo ? 'default' : ''}`}>
        {currentTrackInfo?.image ? (
          <img src={currentTrackInfo.image} alt="Current track artwork" />
        ) : (
          <div style={{ color: 'white', fontSize: '2rem' }}>🎵</div>
        )}
      </div>
      <div className="current-playing-info">
        <div className="track-title">
          {currentTrackInfo?.title || 'Currently playing song title'}
        </div>
        <div className="track-artist">
          {currentTrackInfo?.artist || 'Artist name'}
        </div>
      </div>
    </div>
  );
};

export default CurrentTrackDisplay;