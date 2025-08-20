const CurrentTrackDisplay = ({ currentTrackInfo, tracks, onPlayFirstTrack, currentTrack }) => {
  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (tracks && tracks.length > 0 && onPlayFirstTrack) {
      // If a track is currently playing, pause it by playing the same track
      // Otherwise, play the first track
      if (currentTrack && currentTrackInfo) {
        const playingTrack = tracks.find(t => t.id === currentTrack);
        if (playingTrack) {
          onPlayFirstTrack(playingTrack); // This will toggle pause
          return;
        }
      }
      onPlayFirstTrack(tracks[0]);
    }
  };

  const isPlaying = currentTrack && currentTrackInfo;
  return (
    <div className="current-track">
      <div className={`circular-artwork ${!currentTrackInfo ? 'default' : ''}`}>
        {currentTrackInfo?.image ? (
          <img src={currentTrackInfo.image} alt="Current track artwork" />
        ) : (
          <div style={{ color: 'white', fontSize: '2rem' }}>🎵</div>
        )}
        {tracks && tracks.length > 0 && (
          <div className="play-overlay">
            <button className="play-button" onClick={handlePlayClick}>
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
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