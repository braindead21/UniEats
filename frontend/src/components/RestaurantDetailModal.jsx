import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './RestaurantDetailModal.css';
import { FiX, FiClock, FiMapPin, FiPhone, FiStar, FiHeart, FiShare2 } from 'react-icons/fi';
import { BiRestaurant } from 'react-icons/bi';
import { MdDeliveryDining } from 'react-icons/md';

/**
 * RestaurantDetailModal Component
 * Displays detailed restaurant information, reviews, and menu preview
 * ✅ OPTIMIZED with React.memo, useMemo, useCallback
 */
const RestaurantDetailModal = React.memo(({ restaurant, onClose, onViewMenu, isOpen }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  if (!isOpen || !restaurant) return null;

  // Mock data for image gallery (in real app, would come from API) - memoized
  const images = useMemo(() => [
    restaurant.image,
    restaurant.image, // Repeat for demo, replace with actual gallery images
    restaurant.image
  ], [restaurant.image]);

  // Mock reviews (in real app, would come from API) - memoized
  const reviews = useMemo(() => [
    {
      id: 1,
      user: 'Rahul Sharma',
      rating: 5,
      comment: 'Amazing food quality! The biryani was excellent and delivery was super fast.',
      date: '2 days ago',
      helpful: 24
    },
    {
      id: 2,
      user: 'Priya Singh',
      rating: 4,
      comment: 'Good taste but slightly delayed delivery. Overall satisfied with the food.',
      date: '1 week ago',
      helpful: 12
    },
    {
      id: 3,
      user: 'Amit Kumar',
      rating: 5,
      comment: 'Best restaurant in the area! Never disappoints. Must try their special thali.',
      date: '2 weeks ago',
      helpful: 18
    }
  ], []);

  // Displayed reviews - memoized
  const displayedReviews = useMemo(() => 
    showAllReviews ? reviews : reviews.slice(0, 2),
    [showAllReviews, reviews]
  );

  return createPortal(
    <div className="restaurant-detail-overlay" onClick={onClose}>
      <div className="restaurant-detail-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="close-restaurant-detail-btn" onClick={onClose}>
          <FiX />
        </button>

        {/* Image Gallery */}
        <div className="restaurant-gallery">
          <div className="gallery-main-image">
            <img src={images[activeImageIndex]} alt={restaurant.name} />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button 
                  className="gallery-nav prev"
                  onClick={() => setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)}
                >
                  ‹
                </button>
                <button 
                  className="gallery-nav next"
                  onClick={() => setActiveImageIndex(prev => (prev + 1) % images.length)}
                >
                  ›
                </button>
              </>
            )}

            {/* Action Buttons */}
            <div className="gallery-actions">
              <button className="gallery-action-btn">
                <FiHeart /> Favorite
              </button>
              <button className="gallery-action-btn">
                <FiShare2 /> Share
              </button>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumbnail ${activeImageIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`View ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="restaurant-detail-content">
          
          {/* Header Info */}
          <div className="restaurant-header-info">
            <div className="restaurant-title-section">
              <h1 className="restaurant-name">{restaurant.name}</h1>
              <div className="restaurant-cuisines">
                {restaurant.cuisine?.join(' • ') || 'Multi-Cuisine'}
              </div>
            </div>

            {/* Rating Box */}
            <div className="restaurant-rating-box">
              <div className="rating-score">
                <FiStar className="star-icon" />
                <span className="rating-number">{restaurant.rating || 4.5}</span>
              </div>
              <div className="rating-count">{restaurant.reviews || 250}+ ratings</div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="restaurant-quick-info">
            <div className="info-badge">
              <FiClock className="info-icon" />
              <span>{restaurant.deliveryTime || '30-40'} mins</span>
            </div>
            <div className="info-badge">
              <MdDeliveryDining className="info-icon" />
              <span>₹{restaurant.deliveryFee || 40} delivery</span>
            </div>
            <div className="info-badge">
              <FiMapPin className="info-icon" />
              <span>{restaurant.distance || '2.5'} km away</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="rating-breakdown-section">
            <h3 className="section-heading">Rating Breakdown</h3>
            <div className="rating-bars">
              <div className="rating-bar-item">
                <span className="rating-label">Food Quality</span>
                <div className="rating-bar-track">
                  <div 
                    className="rating-bar-fill" 
                    style={{ width: `${(ratingBreakdown.food / 5) * 100}%` }}
                  />
                </div>
                <span className="rating-value">{ratingBreakdown.food}</span>
              </div>
              <div className="rating-bar-item">
                <span className="rating-label">Delivery Speed</span>
                <div className="rating-bar-track">
                  <div 
                    className="rating-bar-fill" 
                    style={{ width: `${(ratingBreakdown.delivery / 5) * 100}%` }}
                  />
                </div>
                <span className="rating-value">{ratingBreakdown.delivery}</span>
              </div>
              <div className="rating-bar-item">
                <span className="rating-label">Value for Money</span>
                <div className="rating-bar-track">
                  <div 
                    className="rating-bar-fill" 
                    style={{ width: `${(ratingBreakdown.value / 5) * 100}%` }}
                  />
                </div>
                <span className="rating-value">{ratingBreakdown.value}</span>
              </div>
            </div>
          </div>

          {/* Popular Dishes */}
          <div className="popular-dishes-section">
            <h3 className="section-heading">Most Ordered Dishes</h3>
            <div className="popular-dishes-list">
              {popularDishes.map((dish, idx) => (
                <div key={idx} className="popular-dish-item">
                  <div className="dish-info">
                    <span className="dish-rank">#{idx + 1}</span>
                    <div>
                      <div className="dish-name">{dish.name}</div>
                      <div className="dish-orders">{dish.orders}+ orders</div>
                    </div>
                  </div>
                  <div className="dish-price">₹{dish.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div className="opening-hours-section">
            <h3 className="section-heading">Opening Hours</h3>
            <div className="hours-list">
              {openingHours.map((schedule, idx) => (
                <div 
                  key={idx} 
                  className={`hours-item ${schedule.isToday ? 'today' : ''}`}
                >
                  <span className="day-name">{schedule.day}</span>
                  <span className="hours-time">{schedule.hours}</span>
                  {schedule.isToday && <span className="today-badge">Today</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <h3 className="section-heading">Contact Information</h3>
            <div className="contact-items">
              <div className="contact-item">
                <FiMapPin className="contact-icon" />
                <div>
                  <div className="contact-label">Address</div>
                  <div className="contact-value">{restaurant.address || 'Sector 62, Noida, UP 201301'}</div>
                </div>
              </div>
              <div className="contact-item">
                <FiPhone className="contact-icon" />
                <div>
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">{restaurant.phone || '+91 98765 43210'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="reviews-section">
            <h3 className="section-heading">Customer Reviews ({reviews.length})</h3>
            <div className="reviews-list">
              {displayedReviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="user-avatar">{review.user[0]}</div>
                      <div>
                        <div className="user-name">{review.user}</div>
                        <div className="review-date">{review.date}</div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`review-star ${i < review.rating ? 'filled' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <button className="helpful-btn">
                    👍 Helpful ({review.helpful})
                  </button>
                </div>
              ))}
            </div>
            {!showAllReviews && reviews.length > 2 && (
              <button 
                className="show-more-reviews-btn"
                onClick={() => setShowAllReviews(true)}
              >
                View All {reviews.length} Reviews
              </button>
            )}
          </div>

        </div>

        {/* Footer with CTA */}
        <div className="restaurant-detail-footer">
          <button className="view-menu-btn" onClick={() => {
            onViewMenu(restaurant);
            onClose();
          }}>
            <BiRestaurant />
            <span>View Full Menu</span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
});

RestaurantDetailModal.displayName = 'RestaurantDetailModal';

export default RestaurantDetailModal;
