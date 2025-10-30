import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '/placeholder.jpg',
  className = '',
  style = {},
  onLoad,
  onError,
  width,
  height,
  aspectRatio = '16/9',
  blur = true
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // Create intersection observer
    if (imageRef && src) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Load the actual image
              loadImage(src);
              // Stop observing
              if (observerRef.current) {
                observerRef.current.disconnect();
              }
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before the image enters viewport
          threshold: 0.01
        }
      );

      observerRef.current.observe(imageRef);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageRef, src]);

  const loadImage = (imageSrc) => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(imageSrc);
      setIsLoaded(true);
      setHasError(false);
      if (onLoad) onLoad();
    };

    img.onerror = () => {
      setHasError(true);
      setImageSrc(getFallbackImage());
      if (onError) onError();
    };

    img.src = imageSrc;
  };

  const getFallbackImage = () => {
    // Return a data URL for a simple fallback image
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
  };

  const containerStyle = {
    aspectRatio: aspectRatio,
    width: width || '100%',
    height: height || 'auto',
    ...style
  };

  return (
    <div 
      className={`lazy-image-container ${className}`}
      style={containerStyle}
      ref={setImageRef}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`lazy-image ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''} ${blur ? 'blur-load' : ''}`}
        loading="lazy"
      />
      {!isLoaded && !hasError && (
        <div className="lazy-image-loader">
          <div className="lazy-image-spinner"></div>
        </div>
      )}
      {hasError && (
        <div className="lazy-image-error">
          <span className="error-icon">📷</span>
          <span className="error-text">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

// Optimized Image Component with different sizes
export const OptimizedImage = ({ 
  src, 
  alt, 
  size = 'medium', // 'small', 'medium', 'large'
  ...props 
}) => {
  // Generate optimized image URLs (for services like Cloudinary, imgix, etc.)
  const getOptimizedSrc = (originalSrc, size) => {
    if (!originalSrc) return '';
    
    // If it's an Unsplash URL, use their optimization parameters
    if (originalSrc.includes('unsplash.com')) {
      const sizeParams = {
        small: 'w=300&h=300',
        medium: 'w=600&h=600',
        large: 'w=1200&h=1200'
      };
      
      // Check if URL already has parameters
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}${sizeParams[size]}&fit=crop&auto=format`;
    }
    
    return originalSrc;
  };

  return (
    <LazyImage 
      src={getOptimizedSrc(src, size)} 
      alt={alt} 
      {...props} 
    />
  );
};

// Restaurant Image Component
export const RestaurantImage = ({ src, alt, ...props }) => {
  return (
    <OptimizedImage 
      src={src} 
      alt={alt} 
      size="medium"
      aspectRatio="4/3"
      {...props}
    />
  );
};

// Menu Item Image Component
export const MenuItemImage = ({ src, alt, ...props }) => {
  return (
    <OptimizedImage 
      src={src} 
      alt={alt} 
      size="medium"
      aspectRatio="1/1"
      {...props}
    />
  );
};

// Avatar Image Component
export const AvatarImage = ({ src, alt, ...props }) => {
  return (
    <OptimizedImage 
      src={src} 
      alt={alt} 
      size="small"
      aspectRatio="1/1"
      className="avatar-image"
      {...props}
    />
  );
};

export default LazyImage;
