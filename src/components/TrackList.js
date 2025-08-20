import React from 'react';
import TrackItem from './TrackItem';

const TrackList = ({ 
  tracks, 
  currentTrack, 
  onTrackPlay, 
  searchKeyword, 
  totalTracks, 
  loading 
}) => {
  if (tracks.length === 0) {
    return null;
  }

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <h2>Search Results</h2>
        <p>Showing {tracks.length} of {totalTracks.toLocaleString()} tracks for "{searchKeyword}"</p>
        <p className="preview-hint">Click on tracks to play with Spotify Web Player</p>
      </div>
      
      <div className="track-list-container">
        <div className="track-list">
          {tracks.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
              isPlaying={currentTrack === track.id}
              onPlay={onTrackPlay}
            />
          ))}
          {loading && (
            <div className="loading-indicator">
              <p>Loading more tracks...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackList;