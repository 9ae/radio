import React from 'react';

const TrackItem = ({ track, index, isPlaying, onPlay }) => {
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div
      className={`track-item ${isPlaying ? 'playing' : ''}`}
      onClick={() => onPlay(track)}
    >
      <div className="track-number">{index + 1}</div>
      <div className="track-image">
        {track.album.images[2] && (
          <img src={track.album.images[2].url} alt={track.album.name} />
        )}
      </div>
      <div className="track-info">
        <div className="track-name">{track.name}</div>
        <div className="track-artist">
          {track.artists.map(artist => artist.name).join(', ')}
        </div>
        <div className="track-album">{track.album.name}</div>
      </div>
      <div className="track-controls">
        <div className="track-duration">
          {formatDuration(track.duration_ms)}
        </div>
        <div className="play-indicator">
          {isPlaying ? '⏸️' : '▶️'}
        </div>
      </div>
    </div>
  );
};

export default TrackItem;