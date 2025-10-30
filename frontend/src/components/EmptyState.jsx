import React from 'react';
import './EmptyState.css';

// Base Empty State Component
export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionText,
  secondaryAction,
  secondaryActionText,
  className = '' 
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      <div className="empty-state-actions">
        {action && (
          <button className="empty-state-btn primary" onClick={action}>
            {actionText}
          </button>
        )}
        {secondaryAction && (
          <button className="empty-state-btn secondary" onClick={secondaryAction}>
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};

// Empty Cart State
export const EmptyCart = ({ onBrowseRestaurants }) => {
  return (
    <EmptyState
      icon="🛒"
      title="Your cart is empty"
      description="Looks like you haven't added any delicious items yet. Start exploring our amazing restaurants!"
      action={onBrowseRestaurants}
      actionText="Browse Restaurants"
      className="empty-cart"
    />
  );
};

// No Orders State
export const NoOrders = ({ onOrderNow }) => {
  return (
    <EmptyState
      icon="📦"
      title="No orders yet"
      description="You haven't placed any orders. Start by ordering your favorite food from nearby restaurants!"
      action={onOrderNow}
      actionText="Order Now"
      className="no-orders"
    />
  );
};

// No Search Results
export const NoSearchResults = ({ searchQuery, onClearSearch, onBrowseAll }) => {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description={`We couldn't find anything matching "${searchQuery}". Try searching with different keywords or browse all items.`}
      action={onClearSearch}
      actionText="Clear Search"
      secondaryAction={onBrowseAll}
      secondaryActionText="Browse All"
      className="no-search-results"
    />
  );
};

// No Menu Items
export const NoMenuItems = ({ restaurantName, onBrowseOthers }) => {
  return (
    <EmptyState
      icon="🍽️"
      title="No menu items available"
      description={`${restaurantName || 'This restaurant'} doesn't have any dishes available right now. Check out other restaurants!`}
      action={onBrowseOthers}
      actionText="Browse Other Restaurants"
      className="no-menu-items"
    />
  );
};

// No Restaurants
export const NoRestaurants = ({ onRefresh }) => {
  return (
    <EmptyState
      icon="🏪"
      title="No restaurants found"
      description="We couldn't find any restaurants matching your filters. Try adjusting your filters or refresh the page."
      action={onRefresh}
      actionText="Refresh"
      className="no-restaurants"
    />
  );
};

// Network Error State
export const NetworkError = ({ onRetry }) => {
  return (
    <EmptyState
      icon="⚠️"
      title="Connection error"
      description="We're having trouble connecting to the server. Please check your internet connection and try again."
      action={onRetry}
      actionText="Retry"
      className="network-error"
    />
  );
};

// Loading Error State
export const LoadingError = ({ onRetry, message }) => {
  return (
    <EmptyState
      icon="😞"
      title="Oops! Something went wrong"
      description={message || "We encountered an error while loading. Please try again."}
      action={onRetry}
      actionText="Try Again"
      className="loading-error"
    />
  );
};

// No Favorites State
export const NoFavorites = ({ onExplore }) => {
  return (
    <EmptyState
      icon="❤️"
      title="No favorites yet"
      description="You haven't added any favorites. Start exploring and save your favorite restaurants and dishes!"
      action={onExplore}
      actionText="Explore Now"
      className="no-favorites"
    />
  );
};

// Order Cancelled State
export const OrderCancelled = ({ onOrderAgain }) => {
  return (
    <EmptyState
      icon="❌"
      title="Order cancelled"
      description="This order has been cancelled. You can place a new order anytime!"
      action={onOrderAgain}
      actionText="Order Again"
      className="order-cancelled"
    />
  );
};

// Coming Soon State
export const ComingSoon = ({ feature }) => {
  return (
    <EmptyState
      icon="🚀"
      title="Coming Soon"
      description={`${feature} will be available soon. Stay tuned for updates!`}
      className="coming-soon"
    />
  );
};

// Maintenance Mode
export const MaintenanceMode = () => {
  return (
    <EmptyState
      icon="🔧"
      title="Under Maintenance"
      description="We're currently performing maintenance. We'll be back soon with improvements!"
      className="maintenance-mode"
    />
  );
};

export default EmptyState;
