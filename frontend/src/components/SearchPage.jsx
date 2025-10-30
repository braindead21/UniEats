import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './SearchPage.css';

const SearchPage = ({ 
  onClose, 
  menuItems = [], 
  restaurantData = [],
  onSelectItem 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ foodItems: [], restaurants: [] });
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('unieats_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('unieats_recent_searches', JSON.stringify(updated));
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults({ foodItems: [], restaurants: [] });
      return;
    }

    setIsSearching(true);

    // Search in menu items with relevance sorting
    const lowerQuery = query.toLowerCase();
    const results = menuItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.restaurant?.name?.toLowerCase().includes(lowerQuery) ||
      item.category?.toLowerCase().includes(lowerQuery)
    );

    // Sort results by relevance
    const sortedResults = results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      if (aName === lowerQuery) return -1;
      if (bName === lowerQuery) return 1;
      
      const aStarts = aName.startsWith(lowerQuery);
      const bStarts = bName.startsWith(lowerQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      const aIndex = aName.indexOf(lowerQuery);
      const bIndex = bName.indexOf(lowerQuery);
      if (aIndex !== bIndex) return aIndex - bIndex;
      
      return aName.localeCompare(bName);
    });

    // Search restaurants
    const restaurantResults = restaurantData.filter(restaurant =>
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      restaurant.cuisine?.some(c => c.toLowerCase().includes(lowerQuery))
    ).sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      if (aName === lowerQuery) return -1;
      if (bName === lowerQuery) return 1;
      
      const aStarts = aName.startsWith(lowerQuery);
      const bStarts = bName.startsWith(lowerQuery);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      return aName.localeCompare(bName);
    });

    setSearchResults({
      foodItems: sortedResults,
      restaurants: restaurantResults
    });
    setIsSearching(false);
  };

  // Handle selecting a search result
  const handleSelectResult = (type, item) => {
    saveRecentSearch(searchQuery);
    onSelectItem(type, item);
    onClose();
  };

  // Handle selecting recent search
  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('unieats_recent_searches');
  };

  // Popular cuisines
  const popularCuisines = [
    { name: 'Pizza', emoji: '🍕', query: 'pizza' },
    { name: 'Burger', emoji: '🍔', query: 'burger' },
    { name: 'Chinese', emoji: '🍜', query: 'chinese' },
    { name: 'Biryani', emoji: '🍛', query: 'biryani' },
    { name: 'Pasta', emoji: '🍝', query: 'pasta' },
    { name: 'Rolls', emoji: '🌯', query: 'roll' },
    { name: 'Dessert', emoji: '🍰', query: 'dessert' },
    { name: 'Beverages', emoji: '🥤', query: 'beverage' },
  ];

  return createPortal(
    <div className="search-page-overlay" onClick={onClose}>
      <div className="search-page" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="search-page-header">
          <button className="back-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for restaurants and food"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults({ foodItems: [], restaurants: [] });
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="search-page-content">
          {!searchQuery ? (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="recent-searches-section">
                  <div className="section-header">
                    <h3>Recent Searches</h3>
                    <button onClick={clearRecentSearches} className="clear-all-btn">
                      Clear All
                    </button>
                  </div>
                  <div className="recent-searches-list">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="recent-search-item"
                        onClick={() => handleRecentSearch(search)}
                      >
                        <span className="clock-icon">🕐</span>
                        <span className="recent-search-text">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Cuisines */}
              <div className="popular-cuisines-section">
                <h3 className="section-title">Popular Cuisines</h3>
                <div className="cuisines-grid">
                  {popularCuisines.map((cuisine, index) => (
                    <button
                      key={index}
                      className="cuisine-card"
                      onClick={() => handleRecentSearch(cuisine.query)}
                    >
                      <div className="cuisine-image">
                        <span className="cuisine-emoji">{cuisine.emoji}</span>
                      </div>
                      <p className="cuisine-name">{cuisine.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search Results */}
              {searchResults.foodItems.length > 0 || searchResults.restaurants.length > 0 ? (
                <div className="search-results-section">
                  {/* Food Items */}
                  {searchResults.foodItems.length > 0 && (
                    <div className="results-category">
                      <h3 className="results-category-title">
                        <span className="category-icon">🍔</span>
                        Dishes
                      </h3>
                      <div className="results-list">
                        {searchResults.foodItems.map((item, index) => (
                          <button
                            key={index}
                            className="result-item"
                            onClick={() => handleSelectResult('food', item)}
                          >
                            <img
                              src={item.images?.[0]?.url || item.image || 'https://via.placeholder.com/80x80?text=Dish'}
                              alt={item.name}
                              className="result-image"
                              loading="lazy"
                            />
                            <div className="result-info">
                              <p className="result-name">{item.name}</p>
                              <p className="result-restaurant">{item.restaurant?.name}</p>
                            </div>
                            <span className="result-price">₹{item.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Restaurants */}
                  {searchResults.restaurants.length > 0 && (
                    <div className="results-category">
                      <h3 className="results-category-title">
                        <span className="category-icon">🏪</span>
                        Restaurants
                      </h3>
                      <div className="results-list">
                        {searchResults.restaurants.map((restaurant, index) => (
                          <button
                            key={index}
                            className="result-item"
                            onClick={() => handleSelectResult('restaurant', restaurant)}
                          >
                            <img
                              src={restaurant.images?.[0]?.url || restaurant.image || 'https://via.placeholder.com/80x80?text=Restaurant'}
                              alt={restaurant.name}
                              className="result-image"
                              loading="lazy"
                            />
                            <div className="result-info">
                              <p className="result-name">{restaurant.name}</p>
                              <p className="result-restaurant">
                                {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine}
                              </p>
                            </div>
                            <span className="result-rating">⭐ {restaurant.rating || '4.5'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : !isSearching && (
                <div className="no-results">
                  <span className="no-results-icon">🔍</span>
                  <h3>No results found</h3>
                  <p>Try searching for something else</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchPage;
