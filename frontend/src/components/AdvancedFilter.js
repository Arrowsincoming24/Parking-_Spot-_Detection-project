import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Search, SlidersHorizontal, X, MapPin, Clock, Zap, Star, TrendingUp } from 'lucide-react';
import './AdvancedFilter.css';

/**
 * Advanced Filtering and Search Component
 * Comprehensive filtering options for parking spots with real-time search
 */

const AdvancedFilter = ({ 
  spots = [], 
  onFilterChange = null,
  onSearchChange = null 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all', // all, available, occupied, reserved
    type: 'all', // all, regular, ev_charging, handicap, shaded
    zone: 'all', // all, A, B, C, D
    confidence: 'all', // all, high, medium, low
    timeRange: 'all', // all, today, week, month
    sortBy: 'relevance', // relevance, distance, price, availability
    favorites: false,
    recentlyViewed: false
  });

  const [filterStats, setFilterStats] = useState({
    total: 0,
    filtered: 0,
    available: 0,
    occupied: 0
  });

  const applyFilters = useCallback(() => {
    let filteredSpots = [...spots];
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredSpots = filteredSpots.filter(spot => 
        spot.spotId?.toLowerCase().includes(query) ||
        spot.zone?.toLowerCase().includes(query) ||
        spot.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (activeFilters.status !== 'all') {
      filteredSpots = filteredSpots.filter(spot => {
        switch (activeFilters.status) {
          case 'available': return !spot.occupied && !spot.reserved;
          case 'occupied': return spot.occupied;
          case 'reserved': return spot.reserved;
          default: return true;
        }
      });
    }
    
    // Apply type filter
    if (activeFilters.type !== 'all') {
      filteredSpots = filteredSpots.filter(spot => {
        switch (activeFilters.type) {
          case 'ev_charging': return spot.evCharging;
          case 'handicap': return spot.handicap;
          case 'shaded': return spot.shaded;
          case 'regular': return !spot.evCharging && !spot.handicap && !spot.shaded;
          default: return true;
        }
      });
    }
    
    // Apply zone filter
    if (activeFilters.zone !== 'all') {
      filteredSpots = filteredSpots.filter(spot => 
        spot.zone?.includes(`Zone ${activeFilters.zone}`)
      );
    }
    
    // Apply confidence filter (for detection results)
    if (activeFilters.confidence !== 'all') {
      filteredSpots = filteredSpots.filter(spot => {
        if (!spot.confidence) return true;
        switch (activeFilters.confidence) {
          case 'high': return spot.confidence >= 0.9;
          case 'medium': return spot.confidence >= 0.7 && spot.confidence < 0.9;
          case 'low': return spot.confidence < 0.7;
          default: return true;
        }
      });
    }
    
    // Apply favorites filter
    if (activeFilters.favorites) {
      const favorites = JSON.parse(localStorage.getItem('favoriteSpots') || '[]');
      filteredSpots = filteredSpots.filter(spot => favorites.includes(spot.spotId));
    }
    
    // Apply sorting
    filteredSpots.sort((a, b) => {
      switch (activeFilters.sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'availability':
          return (a.occupied ? 1 : 0) - (b.occupied ? 1 : 0);
        case 'confidence':
          return (b.confidence || 0) - (a.confidence || 0);
        default:
          return 0;
      }
    });
    
    // Update stats
    const stats = {
      total: spots.length,
      filtered: filteredSpots.length,
      available: filteredSpots.filter(s => !s.occupied && !s.reserved).length,
      occupied: filteredSpots.filter(s => s.occupied).length
    };
    setFilterStats(stats);
    
    if (onFilterChange) {
      onFilterChange(filteredSpots, stats);
    }
  }, [spots, searchQuery, activeFilters, onFilterChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (filterName, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilters({
      status: 'all',
      type: 'all',
      zone: 'all',
      confidence: 'all',
      timeRange: 'all',
      sortBy: 'relevance',
      favorites: false,
      recentlyViewed: false
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(activeFilters).filter(([key, value]) => 
      key !== 'sortBy' && value !== 'all' && value !== false
    ).length + (searchQuery.trim() ? 1 : 0);
  };

  const FilterBadge = ({ label, onRemove }) => (
    <div className="filter-badge">
      <span>{label}</span>
      <button onClick={onRemove} className="remove-filter">
        <X size={12} />
      </button>
    </div>
  );

  const getActiveFilterBadges = () => {
    const badges = [];
    
    if (searchQuery.trim()) {
      badges.push({
        label: `Search: "${searchQuery}"`,
        onRemove: () => setSearchQuery('')
      });
    }
    
    if (activeFilters.status !== 'all') {
      badges.push({
        label: `Status: ${activeFilters.status}`,
        onRemove: () => handleFilterChange('status', 'all')
      });
    }
    
    if (activeFilters.type !== 'all') {
      badges.push({
        label: `Type: ${activeFilters.type.replace('_', ' ')}`,
        onRemove: () => handleFilterChange('type', 'all')
      });
    }
    
    if (activeFilters.zone !== 'all') {
      badges.push({
        label: `Zone: ${activeFilters.zone}`,
        onRemove: () => handleFilterChange('zone', 'all')
      });
    }
    
    if (activeFilters.favorites) {
      badges.push({
        label: 'Favorites only',
        onRemove: () => handleFilterChange('favorites', false)
      });
    }
    
    return badges;
  };

  return (
    <div className="advanced-filter">
      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search parking spots, zones, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="filter-actions">
          <button 
            className={`btn ${showAdvanced ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal size={16} />
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <span className="filter-count">{getActiveFilterCount()}</span>
            )}
          </button>
          
          {getActiveFilterCount() > 0 && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={clearAllFilters}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterBadges().length > 0 && (
        <div className="active-filters">
          <span className="active-filters-label">Active filters:</span>
          <div className="filter-badges">
            {getActiveFilterBadges().map((badge, index) => (
              <FilterBadge
                key={index}
                label={badge.label}
                onRemove={badge.onRemove}
              />
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="advanced-filters-panel">
          <div className="filters-grid">
            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <MapPin size={16} />
                Status
              </label>
              <select 
                value={activeFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <Zap size={16} />
                Type
              </label>
              <select 
                value={activeFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Types</option>
                <option value="regular">Regular</option>
                <option value="ev_charging">EV Charging</option>
                <option value="handicap">Handicap</option>
                <option value="shaded">Shaded</option>
              </select>
            </div>

            {/* Zone Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <MapPin size={16} />
                Zone
              </label>
              <select 
                value={activeFilters.zone}
                onChange={(e) => handleFilterChange('zone', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Zones</option>
                <option value="A">Zone A</option>
                <option value="B">Zone B</option>
                <option value="C">Zone C</option>
                <option value="D">Zone D</option>
              </select>
            </div>

            {/* Confidence Filter */}
            <div className="filter-group">
              <label className="filter-label">
                <TrendingUp size={16} />
                Confidence
              </label>
              <select 
                value={activeFilters.confidence}
                onChange={(e) => handleFilterChange('confidence', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Confidence</option>
                <option value="high">High (≥90%)</option>
                <option value="medium">Medium (70-90%)</option>
                <option value="low">Low (&lt;70%)</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label className="filter-label">
                <Filter size={16} />
                Sort By
              </label>
              <select 
                value={activeFilters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                <option value="relevance">Relevance</option>
                <option value="distance">Distance</option>
                <option value="price">Price</option>
                <option value="availability">Availability</option>
                <option value="confidence">Confidence</option>
              </select>
            </div>

            {/* Time Range */}
            <div className="filter-group">
              <label className="filter-label">
                <Clock size={16} />
                Time Range
              </label>
              <select 
                value={activeFilters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="filter-options">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={activeFilters.favorites}
                onChange={(e) => handleFilterChange('favorites', e.target.checked)}
              />
              <Star size={16} />
              Show favorites only
            </label>
            
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={activeFilters.recentlyViewed}
                onChange={(e) => handleFilterChange('recentlyViewed', e.target.checked)}
              />
              <Clock size={16} />
              Show recently viewed
            </label>
          </div>
        </div>
      )}

      {/* Filter Statistics */}
      <div className="filter-stats">
        <div className="stat-item">
          <span className="stat-number">{filterStats.total}</span>
          <span className="stat-label">Total Spots</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filterStats.filtered}</span>
          <span className="stat-label">Filtered</span>
        </div>
        <div className="stat-item">
          <span className="stat-number available">{filterStats.available}</span>
          <span className="stat-label">Available</span>
        </div>
        <div className="stat-item">
          <span className="stat-number occupied">{filterStats.occupied}</span>
          <span className="stat-label">Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
