# Spotify Track Search App

## Overview
A React application that integrates with Spotify's Web API and Web Playback SDK to search for tracks and play music directly in the browser.

## Features
- Spotify OAuth 2.0 authentication with PKCE
- User profile display
- Playlist generation based on mood/preferences
- In-browser music playback using Spotify Web Playback SDK
- Custom music player controls

## Tech Stack
- React (with Hooks)
- Spotify Web API
- Spotify Web Playback SDK
- OAuth 2.0 with PKCE (Proof Key for Code Exchange)

## Setup Requirements

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
```

### Spotify App Configuration
1. Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Add redirect URI: `http://127.0.0.1:3000/callback`
3. Copy the Client ID to your `.env` file

### Required Spotify Scopes
- `user-read-private` - Access user profile
- `user-read-email` - Access user email
- `streaming` - Play music in the browser
- `user-read-playback-state` - Read current playback state
- `user-modify-playback-state` - Control playback

## Installation
```bash
npm install
npm start
```

## Project Structure
```
src/
├── App.js                 # Main application component
├── components/
│   ├── SpotifyAuth.js    # Authentication component
│   ├── PlaylistGenerator.js # Playlist creation component
│   └── Player.js         # Music player component
└── utils/
    └── pkce.js           # PKCE utility functions
```

## Key Components

### Authentication Flow
1. User clicks login button
2. App generates PKCE code challenge and state
3. User is redirected to Spotify authorization
4. Callback handles code exchange for access token
5. Token is used for API calls and SDK initialization

### Web Playback SDK Integration
- Initializes when SDK is ready and user is authenticated
- Creates a virtual device for browser playback
- Handles player events (ready, errors, state changes)

## API Integrations
- **Spotify Web API**: User profile, track search, playlist management
- **Spotify Web Playback SDK**: In-browser music playback

## Security Features
- PKCE implementation for secure OAuth flow
- State parameter validation
- Local storage cleanup after authentication

## Development Notes
- Uses `127.0.0.1` instead of `localhost` for Spotify compatibility
- Handles SDK loading asynchronously
- Implements proper error handling for authentication failures

## Style Guide
Make the page responsive, if the viewport is under 500 pixels wide have the content take up 90% of the width. But above if the viewport is larger than 500px then make the max width of the container 600px and center the content. Use `context/radio-mock.png` ans the reference for how the UI should look like after the user authenticates.