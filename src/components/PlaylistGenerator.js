import { useState } from 'react';
import SearchSection from './SearchSection';
import CurrentTrackDisplay from './CurrentTrackDisplay';
import TrackList from './TrackList';

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

  const handleSearch = () => {
    searchTracks(0, false);
  };

  const currentTrackInfo = getCurrentTrackInfo();

  return (
    <div className="playlist-generator">
      <SearchSection
        searchKeyword={searchKeyword}
        onKeywordChange={handleKeywordChange}
        onSearch={handleSearch}
        loading={loading}
      />

      <CurrentTrackDisplay currentTrackInfo={currentTrackInfo} />

      <TrackList
        tracks={tracks}
        currentTrack={currentTrack}
        onTrackPlay={playTrack}
        searchKeyword={searchKeyword}
        totalTracks={totalTracks}
        loading={loading}
      />
    </div>
  );
};

export default PlaylistGenerator;