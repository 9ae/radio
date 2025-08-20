import React from 'react';

const SearchSection = ({ 
  searchKeyword, 
  onKeywordChange, 
  onSearch, 
  loading 
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-section">
      <h3><span>🔍</span> Search for Tracks</h3>
      <p>Enter a keyword, artist, or song name to search for music</p>
      <div className="search-controls">
        <input
          type="text"
          className="search-input"
          placeholder="e.g., jazz, chill vibes, The Beatles, love songs..."
          value={searchKeyword}
          onChange={onKeywordChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="search-btn"
          onClick={onSearch}
          disabled={loading || !searchKeyword.trim()}
        >
          <span>🎵</span>
          {loading ? 'Searching...' : 'Search Tracks'}
        </button>
      </div>
    </div>
  );
};

export default SearchSection;