# Spotify Track Search & Player

A React webapp that uses the Spotify Web API and Web Playback SDK to search and play music tracks.

## Features

- 🔍 Search tracks by keyword, artist, or song name
- 🎧 Full track playback using Spotify Web Playback SDK
- 📱 Responsive, scrollable interface with custom styling
- 🎨 Beautiful UI with glassmorphism design

## Prerequisites

- Node.js (v14 or higher)
- Spotify Premium account (required for Web Playback SDK)
- Spotify Developer App

## Setup

### 1. Spotify Developer Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://127.0.0.1:3000/callback` to Redirect URIs
4. **Important**: Make sure to enable "Web Playback SDK" in the app settings
5. Copy your Client ID (Client Secret not needed for PKCE flow)

### 2. Application Setup

1. Clone this repository:
```bash
git clone <repository-url>
cd spotify-mood-playlist
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your Spotify credentials:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
```

5. Start the development server:
```bash
npm start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

### Search Functionality
The app uses Spotify's search API to find tracks based on:
- Keywords (e.g., "chill", "upbeat", "jazz")
- Artist names (e.g., "The Beatles", "Adele")
- Song titles (e.g., "Bohemian Rhapsody")
- Mood descriptions (e.g., "love songs", "workout music")

### API Integration
- **Spotify Web API**: Used for authentication and track search
- **Web Playback SDK**: Enables in-browser music playback (Premium required)

## Usage

1. **Connect to Spotify**: Click the login button to authenticate
2. **Search Tracks**: Enter keywords, artist names, or song titles in the search box
3. **Play Music**: Click on any track in the results to start playback
4. **Navigate Results**: Scroll through the search results in the responsive container

## Project Structure

```
src/
├── components/
│   ├── SpotifyAuth.js      # Authentication component
│   ├── PlaylistGenerator.js # Track search and playback
│   └── Player.js           # Web playback controls
├── utils/
│   └── pkce.js             # PKCE authentication utilities
├── App.js                  # Main application component
├── App.css                 # Styling and responsive design
└── index.js               # React entry point
```

## Technologies Used

- React 18
- Spotify Web API
- Spotify Web Playback SDK
- CSS3 with glassmorphism effects

## Notes

- Requires Spotify Premium for playback features
- The app uses Authorization Code Flow with PKCE for secure authentication
- Search results are limited to 20 tracks per query
- Uses responsive design with custom scrollbar styling

## Troubleshooting

- **Playback not working**: Ensure you have a Spotify Premium account
- **Login issues**: Verify your Client ID and redirect URI are correct
- **CORS errors**: Make sure you're running on `localhost:3000`