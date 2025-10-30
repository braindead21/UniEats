import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';
import './FavoriteButton.css';

/**
 * FavoriteButton Component - OPTIMIZED
 * Reusable heart icon button for adding/removing restaurants and items from favorites
 * 
 * Props:
 * - type: 'restaurant' | 'item' - determines favorites storage key
 * - itemData: object - the restaurant or item data to favorite
 * - position: 'absolute' | 'relative' - positioning style (default: absolute)
 * - size: 'small' | 'medium' | 'large' - button size (default: medium)
 * - onToggle: callback function called when favorite status changes
 */
const FavoriteButton = React.memo(({ 
  type = 'restaurant', 
  itemData, 
  position = 'absolute',
  size = 'medium',
  onToggle 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { success, info, error: showError } = useToast();

  // Memoize storage key
  const storageKey = useMemo(() => type === 'restaurant' ? 'restaurants' : 'items', [type]);

  // Get item ID (support both _id and id)
  const itemId = useMemo(() => itemData?._id || itemData?.id, [itemData]);

  // Check if item is in favorites - optimized to only check when needed
  useEffect(() => {
    if (!itemId) return;

    const favorites = JSON.parse(localStorage.getItem('unieats_favorites') || '{"restaurants":[],"items":[]}');
    const isInFavorites = favorites[storageKey].some(fav => (fav._id || fav.id) === itemId);
    setIsFavorite(isInFavorites);
  }, [itemId, storageKey]);

  // Memoized toggle handler
  const toggleFavorite = useCallback((e) => {
    e.stopPropagation(); // Prevent card click event
    e.preventDefault();

    if (!itemId) {
      showError('Invalid item data');
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    const animationTimer = setTimeout(() => setIsAnimating(false), 600);

    const favorites = JSON.parse(localStorage.getItem('unieats_favorites') || '{"restaurants":[],"items":[]}');

    if (isFavorite) {
      // Remove from favorites
      favorites[storageKey] = favorites[storageKey].filter(fav => (fav._id || fav.id) !== itemId);
      setIsFavorite(false);
      
      const itemName = itemData.name || (type === 'restaurant' ? 'Restaurant' : 'Item');
      info(`${itemName} removed from favorites`);
    } else {
      // Add to favorites
      const favoriteData = {
        ...itemData,
        addedAt: new Date().toISOString()
      };
      
      favorites[storageKey].push(favoriteData);
      setIsFavorite(true);
      
      const itemName = itemData.name || (type === 'restaurant' ? 'Restaurant' : 'Item');
      success(`${itemName} added to favorites! ❤️`);
    }

    localStorage.setItem('unieats_favorites', JSON.stringify(favorites));

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('favoritesUpdated'));

    // Call onToggle callback if provided
    onToggle?.(isFavorite, itemData);

    return () => clearTimeout(animationTimer);
  }, [itemData, itemId, isFavorite, storageKey, type, success, info, showError, onToggle]);

  // Memoize size and position classes
  const buttonClasses = useMemo(() => {
    const sizeClasses = {
      small: 'favorite-btn-small',
      medium: 'favorite-btn-medium',
      large: 'favorite-btn-large'
    };
    const positionClass = position === 'absolute' ? 'favorite-btn-absolute' : 'favorite-btn-relative';
    
    return `favorite-button ${positionClass} ${sizeClasses[size]} ${isFavorite ? 'is-favorite' : ''} ${isAnimating ? 'animating' : ''}`;
  }, [position, size, isFavorite, isAnimating]);

  // Memoize aria label
  const ariaLabel = useMemo(() => 
    isFavorite ? 'Remove from favorites' : 'Add to favorites',
    [isFavorite]
  );

  return (
    <button
      className={buttonClasses}
      onClick={toggleFavorite}
      title={ariaLabel}
      aria-label={ariaLabel}
    >
      <FiHeart className={`heart-icon ${isFavorite ? 'filled' : ''}`} />
      {isAnimating && (
        <>
          <span className="heart-burst heart-burst-1">❤️</span>
          <span className="heart-burst heart-burst-2">❤️</span>
          <span className="heart-burst heart-burst-3">❤️</span>
          <span className="heart-burst heart-burst-4">❤️</span>
        </>
      )}
    </button>
  );
});

// Add display name for debugging
FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
