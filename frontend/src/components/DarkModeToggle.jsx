import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import './DarkModeToggle.css';

/**
 * DarkModeToggle Component
 * Toggle button for switching between light and dark themes
 * Persists preference to localStorage
 * Updates CSS variables for theming
 * 
 * ✅ OPTIMIZED with React.memo, useMemo, useCallback
 */
const DarkModeToggle = React.memo(({ position = 'fixed' }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Memoize theme configuration objects
  const darkTheme = useMemo(() => ({
    '--bg-primary': '#111827',
    '--bg-secondary': '#1f2937',
    '--bg-tertiary': '#374151',
    '--text-primary': '#f3f4f6',
    '--text-secondary': '#d1d5db',
    '--text-tertiary': '#9ca3af',
    '--border-color': '#374151',
    '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.5)',
    '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.6)',
    '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.7)',
    '--card-bg': '#1f2937',
    '--card-hover': '#374151',
    '--input-bg': '#111827',
    '--modal-overlay': 'rgba(0, 0, 0, 0.8)'
  }), []);

  const lightTheme = useMemo(() => ({
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f9fafb',
    '--bg-tertiary': '#f3f4f6',
    '--text-primary': '#111827',
    '--text-secondary': '#374151',
    '--text-tertiary': '#6b7280',
    '--border-color': '#e5e7eb',
    '--shadow-sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
    '--shadow-md': '0 4px 16px rgba(0, 0, 0, 0.15)',
    '--shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.2)',
    '--card-bg': '#ffffff',
    '--card-hover': '#f9fafb',
    '--input-bg': '#ffffff',
    '--modal-overlay': 'rgba(0, 0, 0, 0.6)'
  }), []);

  // Stable applyTheme function using useCallback
  const applyTheme = useCallback((dark) => {
    const root = document.documentElement;
    const theme = dark ? darkTheme : lightTheme;
    
    if (dark) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }

    // Apply all CSS variables from theme object
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [darkTheme, lightTheme]);

  // Check for saved theme preference or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('unieats_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldUseDark);
    applyTheme(shouldUseDark);
  }, [applyTheme]);

  // Stable toggleTheme with animation cleanup
  const toggleTheme = useCallback(() => {
    setIsAnimating(true);
    const animationTimer = setTimeout(() => setIsAnimating(false), 600);

    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('unieats_theme', newTheme ? 'dark' : 'light');

    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { isDark: newTheme } 
    }));

    // Cleanup timer on unmount
    return () => clearTimeout(animationTimer);
  }, [isDark, applyTheme]);

  // Memoize className string
  const positionClass = useMemo(() => 
    position === 'fixed' ? 'dark-mode-toggle-fixed' : 'dark-mode-toggle-relative',
    [position]
  );

  const buttonClasses = useMemo(() => 
    `dark-mode-toggle ${positionClass} ${isDark ? 'dark' : 'light'} ${isAnimating ? 'animating' : ''}`,
    [positionClass, isDark, isAnimating]
  );

  const ariaLabel = useMemo(() => 
    `Switch to ${isDark ? 'light' : 'dark'} mode`,
    [isDark]
  );

  return (
    <button
      className={buttonClasses}
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {isDark ? (
            <FiMoon className="theme-icon moon" />
          ) : (
            <FiSun className="theme-icon sun" />
          )}
        </div>
        <div className="toggle-background">
          {isDark ? (
            <>
              <span className="star star-1">✦</span>
              <span className="star star-2">✦</span>
              <span className="star star-3">✦</span>
              <span className="star star-4">✦</span>
              <span className="star star-5">✦</span>
            </>
          ) : (
            <>
              <span className="cloud cloud-1">☁️</span>
              <span className="cloud cloud-2">☁️</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
});

DarkModeToggle.displayName = 'DarkModeToggle';

export default DarkModeToggle;
