import React, { useState, useEffect } from 'react';
import './App.css';
import SpotifyAuth from './components/SpotifyAuth';
import PlaylistGenerator from './components/PlaylistGenerator';
import Player from './components/Player';
import { generateCodeChallenge, generateState } from './utils/pkce';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state'
].join(' ');

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // Initialize SDK callback early - before any authentication
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify Web Playback SDK is ready');
      // SDK is ready but we'll wait for token before initializing player
    };
  }, []);

  const fetchUser = React.useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [token]);

  const initializePlayer = React.useCallback(() => {
    if (!token || !window.Spotify || !window.Spotify.Player) return;
    
    const spotifyPlayer = new window.Spotify.Player({
      name: 'Mood Playlist Player',
      getOAuthToken: (cb) => { cb(token); },
      volume: 0.5
    });

    spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      setDeviceId(device_id);
    });

    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    spotifyPlayer.addListener('initialization_error', ({ message }) => {
      console.error('Failed to initialize:', message);
    });

    spotifyPlayer.addListener('authentication_error', ({ message }) => {
      console.error('Failed to authenticate:', message);
    });

    spotifyPlayer.addListener('account_error', ({ message }) => {
      console.error('Failed to validate Spotify account:', message);
    });

    spotifyPlayer.connect();
    setPlayer(spotifyPlayer);
  }, [token]);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        console.error('Spotify auth error:', error);
        return;
      }

      if (code && state) {
        // Verify state matches what we stored
        const storedState = localStorage.getItem('spotify_auth_state');
        const storedCodeVerifier = localStorage.getItem('spotify_code_verifier');

        if (state !== storedState) {
          console.error('State mismatch in OAuth callback');
          return;
        }

        try {
          // Exchange authorization code for access token
          const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: CLIENT_ID,
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: REDIRECT_URI,
              code_verifier: storedCodeVerifier,
            }),
          });

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            setToken(tokenData.access_token);
            
            // Clean up stored values
            localStorage.removeItem('spotify_auth_state');
            localStorage.removeItem('spotify_code_verifier');
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.error('Token exchange failed:', await tokenResponse.text());
          }
        } catch (error) {
          console.error('Error exchanging code for token:', error);
        }
      }
    };

    handleAuthCallback();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUser();
      
      // Initialize player when SDK is ready
      if (window.Spotify && window.Spotify.Player) {
        initializePlayer();
      } else {
        // Wait for SDK to be ready and then initialize
        const checkSDK = setInterval(() => {
          if (window.Spotify && window.Spotify.Player) {
            clearInterval(checkSDK);
            initializePlayer();
          }
        }, 100);
        
        // Clean up interval after 10 seconds
        setTimeout(() => clearInterval(checkSDK), 10000);
      }
    }
  }, [token, fetchUser, initializePlayer]);

  const login = async () => {
    if (!CLIENT_ID) {
      console.error('Spotify Client ID not found. Please check your .env file.');
      alert('Spotify Client ID not configured. Please check your .env file.');
      return;
    }

    try {
      // Generate PKCE parameters
      const { codeVerifier, codeChallenge } = await generateCodeChallenge();
      const state = generateState();

      // Store values for later verification
      localStorage.setItem('spotify_code_verifier', codeVerifier);
      localStorage.setItem('spotify_auth_state', state);

      // Build authorization URL
      const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `scope=${encodeURIComponent(SCOPES)}&` +
        `code_challenge_method=S256&` +
        `code_challenge=${codeChallenge}&` +
        `state=${state}`;

      window.location.href = authUrl;
    } catch (error) {
      console.error('Error generating PKCE parameters:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎵 Spotify Track Search</h1>
        <p>Search and play tracks with Spotify</p>
      </header>

      {!token ? (
        <SpotifyAuth onLogin={login} />
      ) : (
        <div className="app-content">
          {user && (
            <div className="user-info">
              <p>Welcome, {user.display_name}!</p>
            </div>
          )}
          
          <PlaylistGenerator 
            token={token} 
            player={player} 
            deviceId={deviceId} 
          />
          
          {player && deviceId && (
            <Player 
              player={player} 
              token={token} 
              deviceId={deviceId}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;