import React, { useState } from 'react';

const PAGE_SIZE = 20;

const PlaylistGenerator = ({ token, player, deviceId }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMoreTracks, setHasMoreTracks] = useState(true);
  const [totalTracks, setTotalTracks] = useState(0);

  const handleKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const playTrack = async (track) => {
    if (!player || !deviceId) {
      alert('Player not ready. Please wait a moment and try again.');
      return;
    }

    // If clicking the same track, toggle playback
    if (currentTrack === track.id) {
      try {
        await player.togglePlay();
        setCurrentTrack(null);
        return;
      } catch (error) {
        console.error('Error toggling playback:', error);
      }
    }

    try {
      // Play the track using Spotify Web Player
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: [track.uri]
        })
      });

      setCurrentTrack(track.id);

      // Find the current track index
      const currentTrackIndex = tracks.findIndex(t => t.id === track.id);

      // Check if we're near the end of the current track list and fetch next page
      // Fetch when we're playing one of the last 3 tracks and have more tracks available
      if (currentTrackIndex >= tracks.length - 3 && hasMoreTracks) {
        await fetchNextPage();
      }

      // Clean up track list - keep only 3 entries above current track
      if (currentTrackIndex > 3) {
        cleanupTrackList(currentTrackIndex);
      }

    } catch (error) {
      console.error('Error playing track:', error);
      alert('Could not play track. Make sure you have Spotify Premium.');
    }
  };

  const searchTracks = async (offset = 0, append = false) => {
    if (!searchKeyword.trim()) {
      alert('Please enter a search keyword!');
      return;
    }

    setLoading(true);
    if (!append) {
      setTracks([]);
      setCurrentOffset(0);
      setCurrentTrack(null);
    }

    try {
      const searchUrl = new URL('https://api.spotify.com/v1/search');
      searchUrl.searchParams.set('q', searchKeyword.trim());
      searchUrl.searchParams.set('type', 'track');
      searchUrl.searchParams.set('limit', PAGE_SIZE.toString());
      searchUrl.searchParams.set('offset', offset.toString());
      searchUrl.searchParams.set('market', 'US');

      const response = await fetch(searchUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.tracks && data.tracks.items && data.tracks.items.length > 0) {
        setTotalTracks(data.tracks.total);
        setHasMoreTracks(data.tracks.items.length === PAGE_SIZE && offset + PAGE_SIZE < data.tracks.total);

        if (append) {
          setTracks(prevTracks => [...prevTracks, ...data.tracks.items]);
          setCurrentOffset(offset);
        } else {
          setTracks(data.tracks.items);
          setCurrentOffset(0);
        }
      } else {
        if (!append) {
          console.warn('No tracks returned from search');
          alert('No tracks found for this keyword. Try a different search term.');
        }
        setHasMoreTracks(false);
      }
    } catch (error) {
      console.error('Error searching tracks:', error);
      if (!append) {
        alert('Failed to search for tracks. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!hasMoreTracks || loading) return;

    const nextOffset = currentOffset + PAGE_SIZE;
    await searchTracks(nextOffset, true);
  };

  const cleanupTrackList = (currentTrackIndex) => {
    // Keep only 3 entries above the current playing track
    const startIndex = Math.max(0, currentTrackIndex - 3);
    setTracks(prevTracks => {
      const newTracks = prevTracks.slice(startIndex);
      return newTracks;
    });
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const getCurrentTrackInfo = () => {
    if (currentTrack) {
      const track = tracks.find(t => t.id === currentTrack);
      if (track) {
        return {
          title: track.name,
          artist: track.artists.map(artist => artist.name).join(', '),
          image: track.album.images[0]?.url || track.album.images[1]?.url
        };
      }
    }
    return null;
  };

  const currentTrackInfo = getCurrentTrackInfo();

  return (
    <div className="playlist-generator">
      <div className="search-section">
        <h3><span>🔍</span> Search for Tracks</h3>
        <p>Enter a keyword, artist, or song name to search for music</p>
        <div className="search-controls">
          <input
            type="text"
            className="search-input"
            placeholder="e.g., jazz, chill vibes, The Beatles, love songs..."
            value={searchKeyword}
            onChange={handleKeywordChange}
            onKeyDown={(e) => e.key === 'Enter' && searchTracks(0, false)}
          />
          <button
            className="search-btn"
            onClick={() => searchTracks(0, false)}
            disabled={loading || !searchKeyword.trim()}
          >
            <span>🎵</span>
            {loading ? 'Searching...' : 'Search Tracks'}
          </button>
        </div>
      </div>

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

      {tracks.length > 0 && (
        <div className="playlist-container">
          <div className="playlist-header">
            <h2>Search Results</h2>
            <p>Showing {tracks.length} of {totalTracks.toLocaleString()} tracks for "{searchKeyword}"</p>
            <p className="preview-hint">Click on tracks to play with Spotify Web Player</p>
          </div>

          <div className="track-list-container">
            <div className="track-list">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`track-item ${currentTrack === track.id ? 'playing' : ''}`}
                  onClick={() => playTrack(track)}
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
                      {currentTrack === track.id ? '⏸️' : '▶️'}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="loading-indicator">
                  <p>Loading more tracks...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistGenerator;