import React from 'react';
import './Skeleton.css';

// Base Skeleton Component
export const Skeleton = ({ width, height, className = '', variant = 'rectangular' }) => {
  const style = {
    width: width || '100%',
    height: height || '100%'
  };

  return (
    <div 
      className={`skeleton skeleton-${variant} ${className}`}
      style={style}
    />
  );
};

// Restaurant Card Skeleton
export const RestaurantCardSkeleton = () => {
  return (
    <div className="restaurant-card-skeleton">
      <Skeleton variant="rectangular" height="200px" className="skeleton-image" />
      <div className="skeleton-content">
        <Skeleton width="70%" height="24px" className="skeleton-title" />
        <Skeleton width="50%" height="16px" className="skeleton-subtitle" />
        <div className="skeleton-meta">
          <Skeleton width="60px" height="20px" />
          <Skeleton width="80px" height="20px" />
          <Skeleton width="70px" height="20px" />
        </div>
        <Skeleton width="100%" height="40px" className="skeleton-button" />
      </div>
    </div>
  );
};

// Menu Item Card Skeleton
export const MenuItemSkeleton = () => {
  return (
    <div className="menu-item-skeleton">
      <Skeleton variant="rectangular" height="180px" className="skeleton-image" />
      <div className="skeleton-content">
        <Skeleton width="80%" height="20px" className="skeleton-title" />
        <Skeleton width="100%" height="14px" className="skeleton-desc" />
        <Skeleton width="90%" height="14px" className="skeleton-desc" />
        <div className="skeleton-footer">
          <Skeleton width="70px" height="24px" className="skeleton-price" />
          <Skeleton width="100px" height="36px" className="skeleton-button" />
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Skeleton
export const DashboardCardSkeleton = () => {
  return (
    <div className="dashboard-card-skeleton">
      <div className="skeleton-header">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="skeleton-header-content">
          <Skeleton width="120px" height="16px" />
          <Skeleton width="80px" height="24px" />
        </div>
      </div>
    </div>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton = () => {
  return (
    <div className="order-card-skeleton">
      <div className="skeleton-order-header">
        <Skeleton width="150px" height="20px" />
        <Skeleton width="100px" height="24px" className="skeleton-status" />
      </div>
      <Skeleton width="200px" height="16px" className="skeleton-restaurant" />
      <div className="skeleton-items">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="90%" height="14px" />
      </div>
      <div className="skeleton-order-footer">
        <Skeleton width="80px" height="18px" />
        <Skeleton width="100px" height="36px" />
      </div>
    </div>
  );
};

// Search Result Skeleton
export const SearchResultSkeleton = () => {
  return (
    <div className="search-result-skeleton">
      <Skeleton variant="rectangular" width="60px" height="60px" className="skeleton-thumb" />
      <div className="skeleton-result-content">
        <Skeleton width="150px" height="16px" />
        <Skeleton width="100px" height="14px" />
      </div>
      <Skeleton width="60px" height="20px" />
    </div>
  );
};

// Grid of Skeletons
export const SkeletonGrid = ({ count = 6, Component = RestaurantCardSkeleton }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};

// List of Skeletons
export const SkeletonList = ({ count = 3, Component = OrderCardSkeleton }) => {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};

export default Skeleton;
