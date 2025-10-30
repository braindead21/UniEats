import React, { useState, useEffect } from 'react';
import './SearchFilters.css';

const SearchFilters = ({ onFilterChange, onSortChange, currentFilters = {} }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: currentFilters.priceRange || 'all',
    dietary: currentFilters.dietary || 'all',
    rating: currentFilters.rating || 'all',
    sortBy: currentFilters.sortBy || 'relevance'
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSortChange = (sortValue) => {
    const newFilters = { ...filters, sortBy: sortValue };
    setFilters(newFilters);
    if (onSortChange) {
      onSortChange(sortValue);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: 'all',
      dietary: 'all',
      rating: 'all',
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange !== 'all') count++;
    if (filters.dietary !== 'all') count++;
    if (filters.rating !== 'all') count++;
    if (filters.sortBy !== 'relevance') count++;
    return count;
  };

  return (
    <div className="search-filters-container">
      {/* Filter Toggle Button */}
      <button 
        className="filters-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <span className="filter-icon">🔍</span>
        <span>Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="filter-count-badge">{getActiveFilterCount()}</span>
        )}
      </button>

      {/* Sort Dropdown */}
      <div className="sort-dropdown">
        <label className="sort-label">
          <span className="sort-icon">⚡</span>
          <span>Sort by:</span>
        </label>
        <select 
          className="sort-select"
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filter Options</h3>
            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset All
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4 className="filter-title">💰 Price Range</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  value="all"
                  checked={filters.priceRange === 'all'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>All Prices</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  value="budget"
                  checked={filters.priceRange === 'budget'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>₹0 - ₹200 (Budget)</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  value="medium"
                  checked={filters.priceRange === 'medium'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>₹200 - ₹500 (Medium)</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  value="premium"
                  checked={filters.priceRange === 'premium'}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                <span>₹500+ (Premium)</span>
              </label>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="filter-group">
            <h4 className="filter-title">🥗 Dietary</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="dietary"
                  value="all"
                  checked={filters.dietary === 'all'}
                  onChange={(e) => handleFilterChange('dietary', e.target.value)}
                />
                <span>All Items</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dietary"
                  value="veg"
                  checked={filters.dietary === 'veg'}
                  onChange={(e) => handleFilterChange('dietary', e.target.value)}
                />
                <span>🌱 Vegetarian Only</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dietary"
                  value="non-veg"
                  checked={filters.dietary === 'non-veg'}
                  onChange={(e) => handleFilterChange('dietary', e.target.value)}
                />
                <span>🍖 Non-Vegetarian</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="dietary"
                  value="vegan"
                  checked={filters.dietary === 'vegan'}
                  onChange={(e) => handleFilterChange('dietary', e.target.value)}
                />
                <span>🌿 Vegan</span>
              </label>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-group">
            <h4 className="filter-title">⭐ Rating</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  value="all"
                  checked={filters.rating === 'all'}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                />
                <span>All Ratings</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  value="4plus"
                  checked={filters.rating === '4plus'}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                />
                <span>⭐ 4.0+</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  value="4.5plus"
                  checked={filters.rating === '4.5plus'}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                />
                <span>⭐ 4.5+</span>
              </label>
            </div>
          </div>

          {/* Apply Button */}
          <button 
            className="apply-filters-btn"
            onClick={() => setShowFilters(false)}
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
