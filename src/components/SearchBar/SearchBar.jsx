import React, { useState, useEffect, useCallback } from 'react';
import './SearchBar.scss';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  // Debounce logic - wait 500ms after user stops typing to trigger search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    
    // Clean up the timer on each searchTerm change
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-group">
        <input
          type="text"
          placeholder="Search missions..."
          value={searchTerm}
          onChange={handleChange}
          className="search-bar__input"
        />
        {searchTerm && (
          <button 
            type="button" 
            className="search-bar__clear" 
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 