import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './FilterPanel.css';
import { 
  FiFilter, FiX, FiCheck, FiChevronDown, FiChevronUp, 
  FiDollarSign, FiStar, FiClock, FiRefreshCw 
} from 'react-icons/fi';

/**
 * FilterPanel Component
 * Comprehensive filtering panel for restaurants
 * ✅ OPTIMIZED with React.memo, useMemo, useCallback
 * ✅ Already has debounce for auto-apply (300ms)
 */
const FilterPanel = React.memo(({ onFilterChange, initialFilters, restaurantCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    cuisine: true,
    price: true,
    rating: true,
    deliveryTime: true,
    dietary: true,
    sort: true
  });

  const [filters, setFilters] = useState({
    cuisines: initialFilters?.cuisines || [],
    priceRange: initialFilters?.priceRange || [0, 1000],
    minRating: initialFilters?.minRating || 0,
    maxDeliveryTime: initialFilters?.maxDeliveryTime || 60,
    dietary: initialFilters?.dietary || [],
    sortBy: initialFilters?.sortBy || 'popular',
    ...initialFilters
  });

  // Available filter options - memoized static data
  const cuisineTypes = useMemo(() => [
    { id: 'indian', name: 'Indian', emoji: '🍛', count: 45 },
    { id: 'chinese', name: 'Chinese', emoji: '🥢', count: 32 },
    { id: 'italian', name: 'Italian', emoji: '🍕', count: 28 },
    { id: 'mexican', name: 'Mexican', emoji: '🌮', count: 18 },
    { id: 'american', name: 'American', emoji: '🍔', count: 25 },
    { id: 'thai', name: 'Thai', emoji: '🍜', count: 15 },
    { id: 'japanese', name: 'Japanese', emoji: '🍱', count: 12 },
    { id: 'continental', name: 'Continental', emoji: '🥗', count: 20 },
    { id: 'desserts', name: 'Desserts', emoji: '🍰', count: 35 },
    { id: 'beverages', name: 'Beverages', emoji: '☕', count: 40 }
  ], []);

  const dietaryOptions = useMemo(() => [
    { id: 'veg', name: 'Vegetarian', emoji: '🥬', icon: '🟢' },
    { id: 'non-veg', name: 'Non-Vegetarian', emoji: '🍗', icon: '🔴' },
    { id: 'vegan', name: 'Vegan', emoji: '🌱', icon: '💚' },
    { id: 'gluten-free', name: 'Gluten Free', emoji: '🌾', icon: '🚫' },
    { id: 'dairy-free', name: 'Dairy Free', emoji: '🥛', icon: '🚫' }
  ], []);

  const sortOptions = useMemo(() => [
    { id: 'popular', name: 'Most Popular', icon: '🔥' },
    { id: 'rating', name: 'Highest Rated', icon: '⭐' },
    { id: 'delivery-time', name: 'Fastest Delivery', icon: '⚡' },
    { id: 'price-low', name: 'Price: Low to High', icon: '💰' },
    { id: 'price-high', name: 'Price: High to Low', icon: '💎' },
    { id: 'nearest', name: 'Nearest First', icon: '📍' }
  ], []);

  // Toggle section expansion - stable callback
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Handle cuisine filter - stable callback
  const toggleCuisine = useCallback((cuisineId) => {
    setFilters(prev => {
      const cuisines = prev.cuisines.includes(cuisineId)
        ? prev.cuisines.filter(id => id !== cuisineId)
        : [...prev.cuisines, cuisineId];
      return { ...prev, cuisines };
    });
  }, []);

  // Handle dietary filter - stable callback
  const toggleDietary = useCallback((dietaryId) => {
    setFilters(prev => {
      const dietary = prev.dietary.includes(dietaryId)
        ? prev.dietary.filter(id => id !== dietaryId)
        : [...prev.dietary, dietaryId];
      return { ...prev, dietary };
    });
  }, []);

  // Handle price range - stable callback
  const handlePriceChange = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: type === 'min' 
        ? [parseInt(value), prev.priceRange[1]]
        : [prev.priceRange[0], parseInt(value)]
    }));
  }, []);

  // Handle rating filter - stable callback
  const setMinRating = useCallback((rating) => {
    setFilters(prev => ({ ...prev, minRating: rating }));
  }, []);

  // Handle delivery time - stable callback
  const setMaxDeliveryTime = useCallback((time) => {
    setFilters(prev => ({ ...prev, maxDeliveryTime: time }));
  }, []);

  // Handle sort - stable callback
  const handleSortChange = useCallback((sortId) => {
    setFilters(prev => ({ ...prev, sortBy: sortId }));
  }, []);

  // Apply filters - stable callback
  const applyFilters = useCallback(() => {
    onFilterChange(filters);
    setIsOpen(false);
  }, [filters, onFilterChange]);

  // Clear all filters - stable callback
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      cuisines: [],
      priceRange: [0, 1000],
      minRating: 0,
      maxDeliveryTime: 60,
      dietary: [],
      sortBy: 'popular'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  }, [onFilterChange]);

  // Count active filters - memoized calculation
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.cuisines.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.minRating > 0) count++;
    if (filters.maxDeliveryTime < 60) count++;
    if (filters.dietary.length > 0) count++;
    if (filters.sortBy !== 'popular') count++;
    return count;
  }, [filters]);

  // Auto-apply on filter change (optional - remove if you want manual apply)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="filter-panel-container">
      {/* Filter Toggle Button */}
      <button 
        className={`filter-toggle-btn ${activeFilterCount > 0 ? 'has-filters' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiFilter />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="filter-count-badge">{activeFilterCount}</span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="filter-backdrop" onClick={() => setIsOpen(false)} />

          {/* Panel Content */}
          <div className="filter-panel">
            
            {/* Header */}
            <div className="filter-panel-header">
              <div className="filter-header-left">
                <FiFilter />
                <h3>Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="active-count">({activeFilterCount} active)</span>
                )}
              </div>
              <button className="filter-close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Content */}
            <div className="filter-panel-content">

              {/* Sort By Section */}
              <div className="filter-section">
                <button 
                  className="filter-section-header"
                  onClick={() => toggleSection('sort')}
                >
                  <span>Sort By</span>
                  {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.sort && (
                  <div className="filter-section-content">
                    <div className="sort-options">
                      {sortOptions.map(option => (
                        <button
                          key={option.id}
                          className={`sort-option ${filters.sortBy === option.id ? 'active' : ''}`}
                          onClick={() => handleSortChange(option.id)}
                        >
                          <span className="sort-icon">{option.icon}</span>
                          <span>{option.name}</span>
                          {filters.sortBy === option.id && <FiCheck />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cuisine Type Section */}
              <div className="filter-section">
                <button 
                  className="filter-section-header"
                  onClick={() => toggleSection('cuisine')}
                >
                  <span>Cuisine Type</span>
                  {expandedSections.cuisine ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.cuisine && (
                  <div className="filter-section-content">
                    <div className="cuisine-grid">
                      {cuisineTypes.map(cuisine => (
                        <button
                          key={cuisine.id}
                          className={`cuisine-chip ${filters.cuisines.includes(cuisine.id) ? 'selected' : ''}`}
                          onClick={() => toggleCuisine(cuisine.id)}
                        >
                          <span className="cuisine-emoji">{cuisine.emoji}</span>
                          <span className="cuisine-name">{cuisine.name}</span>
                          <span className="cuisine-count">({cuisine.count})</span>
                          {filters.cuisines.includes(cuisine.id) && (
                            <FiCheck className="check-icon" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Range Section */}
              <div className="filter-section">
                <button 
                  className="filter-section-header"
                  onClick={() => toggleSection('price')}
                >
                  <span>Price Range</span>
                  {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.price && (
                  <div className="filter-section-content">
                    <div className="price-range-container">
                      <div className="price-inputs">
                        <div className="price-input-group">
                          <label>Min</label>
                          <div className="price-input-wrapper">
                            <FiDollarSign />
                            <input
                              type="number"
                              value={filters.priceRange[0]}
                              onChange={(e) => handlePriceChange('min', e.target.value)}
                              min="0"
                              max={filters.priceRange[1]}
                            />
                          </div>
                        </div>
                        <span className="price-separator">to</span>
                        <div className="price-input-group">
                          <label>Max</label>
                          <div className="price-input-wrapper">
                            <FiDollarSign />
                            <input
                              type="number"
                              value={filters.priceRange[1]}
                              onChange={(e) => handlePriceChange('max', e.target.value)}
                              min={filters.priceRange[0]}
                              max="1000"
                            />
                          </div>
                        </div>
                      </div>
                      <input
                        type="range"
                        className="price-slider"
                        min="0"
                        max="1000"
                        step="50"
                        value={filters.priceRange[1]}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                      />
                      <div className="price-quick-select">
                        <button onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, 200] }))}>
                          Under ₹200
                        </button>
                        <button onClick={() => setFilters(prev => ({ ...prev, priceRange: [200, 500] }))}>
                          ₹200 - ₹500
                        </button>
                        <button onClick={() => setFilters(prev => ({ ...prev, priceRange: [500, 1000] }))}>
                          ₹500+
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Section */}
              <div className="filter-section">
                <button 
                  className="filter-section-header"
                  onClick={() => toggleSection('rating')}
                >
                  <span>Minimum Rating</span>
                  {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.rating && (
                  <div className="filter-section-content">
                    <div className="rating-options">
                      {[4.5, 4.0, 3.5, 3.0].map(rating => (
                        <button
                          key={rating}
                          className={`rating-option ${filters.minRating === rating ? 'selected' : ''}`}
                          onClick={() => setMinRating(rating)}
                        >
                          <FiStar className="star-icon" />
                          <span>{rating}+</span>
                          {filters.minRating === rating && <FiCheck />}
                        </button>
                      ))}
                      <button
                        className={`rating-option ${filters.minRating === 0 ? 'selected' : ''}`}
                        onClick={() => setMinRating(0)}
                      >
                        <span>Any Rating</span>
                        {filters.minRating === 0 && <FiCheck />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Time Section */}
              <div className="filter-section">
                <button 
                  className="filter-section-header"
                  onClick={() => toggleSection('deliveryTime')}
                >
                  <span>Delivery Time</span>
                  {expandedSections.deliveryTime ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.deliveryTime && (
                  <div className="filter-section-content">
                    <div className="delivery-time-options">
                      {[20, 30, 40, 60].map(time => (
                        <button
                          key={time}
                          className={`delivery-time-option ${filters.maxDeliveryTime === time ? 'selected' : ''}`}
                          onClick={() => setMaxDeliveryTime(time)}
                        >
                          <FiClock />
                          <span>Under {time} min</span>
                          {filters.maxDeliveryTime === time && <FiCheck />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dietary Preferences Section */}
              <div className="filter-section">
                <button 
                  className="filter-section-header"
                  onClick={() => toggleSection('dietary')}
                >
                  <span>Dietary Preferences</span>
                  {expandedSections.dietary ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {expandedSections.dietary && (
                  <div className="filter-section-content">
                    <div className="dietary-options">
                      {dietaryOptions.map(option => (
                        <button
                          key={option.id}
                          className={`dietary-option ${filters.dietary.includes(option.id) ? 'selected' : ''}`}
                          onClick={() => toggleDietary(option.id)}
                        >
                          <span className="dietary-icon">{option.icon}</span>
                          <span className="dietary-name">{option.name}</span>
                          {filters.dietary.includes(option.id) && (
                            <FiCheck className="check-icon" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="filter-panel-footer">
              <button className="clear-filters-btn" onClick={clearFilters}>
                <FiRefreshCw />
                Clear All
              </button>
              <button className="apply-filters-btn" onClick={applyFilters}>
                <FiCheck />
                Show {restaurantCount || 0} Results
              </button>
            </div>

          </div>
        </>
      )}

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && !isOpen && (
        <div className="active-filters-chips">
          {filters.cuisines.map(cuisineId => {
            const cuisine = cuisineTypes.find(c => c.id === cuisineId);
            return cuisine ? (
              <div key={cuisineId} className="filter-chip">
                <span>{cuisine.emoji} {cuisine.name}</span>
                <button onClick={() => toggleCuisine(cuisineId)}>
                  <FiX />
                </button>
              </div>
            ) : null;
          })}
          {filters.minRating > 0 && (
            <div className="filter-chip">
              <span>⭐ {filters.minRating}+</span>
              <button onClick={() => setMinRating(0)}>
                <FiX />
              </button>
            </div>
          )}
          {filters.dietary.map(dietaryId => {
            const dietary = dietaryOptions.find(d => d.id === dietaryId);
            return dietary ? (
              <div key={dietaryId} className="filter-chip">
                <span>{dietary.icon} {dietary.name}</span>
                <button onClick={() => toggleDietary(dietaryId)}>
                  <FiX />
                </button>
              </div>
            ) : null;
          })}
          {activeFilterCount > 3 && (
            <button className="view-all-filters-btn" onClick={() => setIsOpen(true)}>
              +{activeFilterCount - 3} more
            </button>
          )}
        </div>
      )}
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;
