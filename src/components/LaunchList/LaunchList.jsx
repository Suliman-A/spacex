import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import LaunchItem from '../LaunchItem/LaunchItem';
import Spinner from '../Spinner/Spinner';
import SearchBar from '../SearchBar/SearchBar';
import './LaunchList.scss';

const LaunchList = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  
  const ITEMS_PER_PAGE = 10;
  const observer = useRef();
  const lastLaunchElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchTerm) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, searchTerm]);

  // Fetch initial data
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.spacexdata.com/v3/launches');
        setLaunches(response.data);
        setFilteredLaunches(response.data.slice(0, ITEMS_PER_PAGE));
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch launches. Please try again later.');
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  // Handle pagination for infinite scroll
  useEffect(() => {
    if (page === 1 || searchTerm) return;
    
    const endIndex = page * ITEMS_PER_PAGE;
    
    if (endIndex >= launches.length) {
      setHasMore(false);
    } else {
      const newLaunches = launches.slice(0, endIndex);
      setFilteredLaunches(newLaunches);
    }
  }, [page, launches, searchTerm]);

  // Handle search with useCallback to memoize the function
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    
    if (term.trim() === '') {
      // Reset to initial state if search is cleared
      setFilteredLaunches(launches.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      setHasMore(true);
      return;
    }
    
    const lowerCaseTerm = term.toLowerCase();
    const results = launches.filter(launch => 
      launch.mission_name.toLowerCase().includes(lowerCaseTerm) ||
      launch.rocket.rocket_name.toLowerCase().includes(lowerCaseTerm) ||
      (launch.details && launch.details.toLowerCase().includes(lowerCaseTerm))
    );
    
    setFilteredLaunches(results);
    setHasMore(false);
  }, [launches]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="launch-list-container">
      <h1 className="launch-list-title">SpaceX Launches</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {filteredLaunches.length === 0 && !loading && (
        <div className="no-results">
          {searchTerm ? 'No launches found matching your search.' : 'No launches available.'}
        </div>
      )}
      
      <div className="launch-list">
        {filteredLaunches.map((launch, index) => {
          if (filteredLaunches.length === index + 1) {
            return (
              <div ref={lastLaunchElementRef} key={launch.flight_number}>
                <LaunchItem launch={launch} />
              </div>
            );
          } else {
            return <LaunchItem key={launch.flight_number} launch={launch} />;
          }
        })}
      </div>
      
      {loading && (
        <div className="loading-container">
          <Spinner />
          <p>Loading launches...</p>
        </div>
      )}
      
      {!hasMore && !searchTerm && !loading && filteredLaunches.length > 0 && (
        <div className="end-message">
          You've reached the end of the list.
        </div>
      )}
    </div>
  );
};

export default LaunchList; 