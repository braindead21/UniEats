// ⚡ PERFORMANCE OPTIMIZED - React.memo + useCallback + useMemo
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './FavoritesPage.css';
import { 
  FiHeart, FiStar, FiClock, FiMapPin, FiShoppingBag, 
  FiTrash2, FiExternalLink 
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const FavoritesPage = React.memo(({ onRestaurantClick, onItemAddToCart }) => {
  const [favorites, setFavorites] = useState({ restaurants: [], items: [] });
  const [activeTab, setActiveTab] = useState('restaurants'); // restaurants | items
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  // Load favorites from localStorage
  const loadFavorites = useCallback(() => {
    try {
      const saved = localStorage.getItem('unieats_favorites');
      console.log('Loading favorites from localStorage:', saved);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Parsed favorites:', parsed);
        setFavorites(parsed);
      } else {
        console.log('No favorites found in localStorage');
        setFavorites({ restaurants: [], items: [] });
      }
    } catch (e) {
      console.error('Error loading favorites:', e);
      setFavorites({ restaurants: [], items: [] });
    }
  }, []);

  useEffect(() => {
    console.log('FavoritesPage mounted');
    loadFavorites();
    
    // Listen for storage changes (when favorites are updated from other components)
    const handleStorageChange = (e) => {
      if (e.key === 'unieats_favorites') {
        loadFavorites();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [loadFavorites]);

  // Save favorites to localStorage
  const saveFavorites = useCallback((newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem('unieats_favorites', JSON.stringify(newFavorites));
  }, []);

  // Remove restaurant from favorites
  const removeFavoriteRestaurant = useCallback((restaurantId) => {
    setFavorites(prev => {
      const newFavorites = {
        ...prev,
        restaurants: prev.restaurants.filter(r => (r._id || r.id) !== restaurantId)
      };
      localStorage.setItem('unieats_favorites', JSON.stringify(newFavorites));
      success('Restaurant removed from favorites');
      return newFavorites;
    });
  }, [success]);

  // Remove item from favorites
  const removeFavoriteItem = useCallback((itemId) => {
    setFavorites(prev => {
      const newFavorites = {
        ...prev,
        items: prev.items.filter(i => (i._id || i.id) !== itemId)
      };
      localStorage.setItem('unieats_favorites', JSON.stringify(newFavorites));
      success('Item removed from favorites');
      return newFavorites;
    });
  }, [success]);

  // Handle restaurant click
  const handleRestaurantClick = useCallback((restaurant) => {
    if (onRestaurantClick) {
      onRestaurantClick(restaurant);
    }
  }, [onRestaurantClick]);

  // Handle add item to cart
  const handleAddToCart = useCallback((item) => {
    if (onItemAddToCart) {
      onItemAddToCart(item);
      success(`${item.name} added to cart!`);
    }
  }, [onItemAddToCart, success]);

  const restaurantFavorites = useMemo(() => {
    const result = favorites.restaurants || [];
    console.log('Restaurant favorites:', result);
    return result;
  }, [favorites.restaurants]);
  
  const itemFavorites = useMemo(() => {
    const result = favorites.items || [];
    console.log('Item favorites:', result);
    return result;
  }, [favorites.items]);

  console.log('Rendering FavoritesPage, activeTab:', activeTab, 'favorites:', favorites);

  return (
    <div className="favorites-page">
      
      {/* Header */}
      <div className="favorites-header">
        <div className="favorites-header-content">
          <div className="favorites-title-section">
            <FiHeart className="favorites-header-icon" />
            <div>
              <h1>My Favorites</h1>
              <p>Your saved restaurants and dishes</p>
            </div>
          </div>
          <div className="favorites-stats">
            <div className="stat-item">
              <span className="stat-value">{restaurantFavorites.length}</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">{itemFavorites.length}</span>
              <span className="stat-label">Dishes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="favorites-tabs">
        <button
          className={`favorites-tab ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          <FiMapPin />
          <span>Restaurants</span>
          <span className="tab-count">{restaurantFavorites.length}</span>
        </button>
        <button
          className={`favorites-tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          <FiShoppingBag />
          <span>Dishes</span>
          <span className="tab-count">{itemFavorites.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="favorites-content">
        
        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div className="favorites-section">
            {restaurantFavorites.length === 0 ? (
              <div className="favorites-empty-state">
                <div className="empty-icon-wrapper">
                  <FiHeart className="empty-icon" />
                </div>
                <h3>No Favorite Restaurants Yet</h3>
                <p>Start adding restaurants to your favorites and find them here!</p>
                <button className="browse-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Browse Restaurants
                </button>
              </div>
            ) : (
              <div className="favorites-grid">
                {restaurantFavorites.map((restaurant) => (
                  <div key={restaurant._id || restaurant.id} className="favorite-restaurant-card">
                    
                    {/* Image */}
                    <div 
                      className="restaurant-card-image"
                      onClick={() => handleRestaurantClick(restaurant)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={restaurant.images?.[0]?.url || restaurant.image || 'https://via.placeholder.com/400x200'} 
                        alt={restaurant.name}
                      />
                      {restaurant.tag && (
                        <div className="restaurant-tag">{restaurant.tag}</div>
                      )}
                      <button
                        className="favorite-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavoriteRestaurant(restaurant._id || restaurant.id);
                        }}
                        title="Remove from favorites"
                      >
                        <FiHeart className="filled" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="restaurant-card-info">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <p className="restaurant-cuisine">
                        {Array.isArray(restaurant.cuisine) 
                          ? restaurant.cuisine.join(', ') 
                          : restaurant.cuisine}
                      </p>
                      
                      <div className="restaurant-meta">
                        <div className="meta-item">
                          <FiStar className="star-icon" />
                          <span>{restaurant.rating || '4.5'}</span>
                        </div>
                        <div className="meta-dot">•</div>
                        <div className="meta-item">
                          <FiClock />
                          <span>{restaurant.deliveryTime || '30-40 min'}</span>
                        </div>
                        <div className="meta-dot">•</div>
                        <div className="meta-item">
                          <FiMapPin />
                          <span>{restaurant.distance || '2.5 km'}</span>
                        </div>
                      </div>

                      {restaurant.offers && (
                        <div className="restaurant-offers">
                          🎉 {restaurant.offers}
                        </div>
                      )}

                      <button 
                        className="view-menu-btn"
                        onClick={() => handleRestaurantClick(restaurant)}
                      >
                        <span>View Menu</span>
                        <FiExternalLink />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="favorites-section">
            {itemFavorites.length === 0 ? (
              <div className="favorites-empty-state">
                <div className="empty-icon-wrapper">
                  <FiShoppingBag className="empty-icon" />
                </div>
                <h3>No Favorite Dishes Yet</h3>
                <p>Save your favorite dishes and quickly reorder them!</p>
                <button className="browse-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="favorites-items-grid">
                {itemFavorites.map((item) => (
                  <div key={item._id || item.id} className="favorite-item-card">
                    
                    {/* Image */}
                    <div className="item-card-image">
                      <img 
                        src={item.image || item.img || 'https://via.placeholder.com/300x200'} 
                        alt={item.name}
                      />
                      {item.isVeg !== undefined && (
                        <div className={`veg-indicator ${item.isVeg ? 'veg' : 'non-veg'}`}>
                          <div className="veg-dot" />
                        </div>
                      )}
                      <button
                        className="favorite-remove-btn"
                        onClick={() => removeFavoriteItem(item._id || item.id)}
                        title="Remove from favorites"
                      >
                        <FiHeart className="filled" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="item-card-info">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-restaurant">
                        {item.restaurantName || 'Restaurant'}
                      </p>
                      
                      {item.description && (
                        <p className="item-description">
                          {item.description.length > 80 
                            ? item.description.substring(0, 80) + '...' 
                            : item.description}
                        </p>
                      )}

                      <div className="item-footer">
                        <div className="item-price">
                          ₹{item.price}
                        </div>
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          <FiShoppingBag />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
});

FavoritesPage.displayName = 'FavoritesPage';

export default FavoritesPage;
