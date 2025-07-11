import React, { useState, useMemo, useEffect } from 'react';
import rikshaList from '../data/rikshaList.json';
import LoadingSkeleton, { RickshawCardSkeleton } from '../components/LoadingSkeleton';
import '../CSS/Riksha.css';

function Riksha() {
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort rickshaws
  const filteredRickshaws = useMemo(() => {
    let filtered = rikshaList.filter(riksha => {
      const matchesSearch = riksha.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           riksha.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           riksha.number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || riksha.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort rickshaws
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'driver':
          return a.driverName.localeCompare(b.driverName);
        case 'number':
          return a.number.localeCompare(b.number);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="riksha-browse-container">
        <h2>Browse E-Rickshaws</h2>
        
        {/* Search and Filter Section Skeleton */}
        <div className="search-filter-section">
          <div className="search-box">
            <div className="skeleton" style={{ height: '48px', width: '100%' }}></div>
          </div>
          <div className="filter-controls">
            <div className="skeleton" style={{ height: '48px', width: '120px' }}></div>
            <div className="skeleton" style={{ height: '48px', width: '140px' }}></div>
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="results-info">
          <div className="skeleton" style={{ height: '16px', width: '200px', margin: '0 auto' }}></div>
        </div>

        {/* Rickshaw Grid Skeleton */}
        <div className="riksha-list">
          <LoadingSkeleton type="rickshaw-card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="riksha-browse-container">
      <h2>Browse E-Rickshaws</h2>
      
      {!selected && (
        <>
          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, driver, or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="driver">Sort by Driver</option>
                <option value="number">Sort by Number</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-info">
            <p>Showing {filteredRickshaws.length} of {rikshaList.length} rickshaws</p>
          </div>

          {/* Rickshaw Grid */}
          <div className="riksha-list">
            {filteredRickshaws.length === 0 ? (
              <div className="no-results">
                <h3>No rickshaws found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredRickshaws.map(riksha => (
                <div key={riksha.id} className="riksha-card" onClick={() => setSelected(riksha)}>
                  <div className="status-badge">
                    <span className={`status ${riksha.status}`}>
                      {riksha.status.charAt(0).toUpperCase() + riksha.status.slice(1)}
                    </span>
                  </div>
                  <img src={riksha.image} alt={riksha.name} className="riksha-img" />
                  <h4>{riksha.name}</h4>
                  <p className="riksha-number">{riksha.number}</p>
                  <p className="driver-name">Driver: {riksha.driverName}</p>
                  <p className="riksha-desc">{riksha.desc}</p>
                  <button className="view-features-btn">View Features</button>
                </div>
              ))
            )}
          </div>
        </>
      )}
      
      {selected && (
        <div className="riksha-features-modal">
          <div className="riksha-features-content">
            <div className="modal-header">
              <h3>{selected.name}</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            </div>
            <img src={selected.image} alt={selected.name} className="riksha-img-large" />
            <div className="riksha-details">
              <p><strong>Number:</strong> {selected.number}</p>
              <p><strong>Driver:</strong> {selected.driverName}</p>
              <p><strong>Status:</strong> 
                <span className={`status ${selected.status}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </p>
              <p><strong>Description:</strong> {selected.desc}</p>
            </div>
            <div className="features-list">
              <h4>Features:</h4>
              <ul>
                <li>Eco-friendly electric drive</li>
                <li>Comfortable seating</li>
                <li>GPS enabled</li>
                <li>Mobile charging port</li>
                <li>Safety features</li>
                <li>LED lighting</li>
                <li>Weather protection</li>
              </ul>
            </div>
            <div className="modal-actions">
              <button className="book-btn" onClick={() => window.location.href = '/book'}>
                Book This Rickshaw
              </button>
              <button className="close-btn-secondary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Riksha;
