import React, { createContext, useContext, useState, useCallback } from 'react';
import '../components/Toast.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const duration = options.duration || 3000;
    const action = options.action || null;
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration, action };
    
    setToasts(prev => [...prev, toast]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return addToast(message, 'success', { duration: 3000, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast(message, 'error', { duration: 4000, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast(message, 'info', { duration: 3000, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast(message, 'warning', { duration: 3500, ...options });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getEmoji = () => {
    switch (toast.type) {
      case 'success':
        return '🎉';
      case 'error':
        return '😞';
      case 'warning':
        return '⚡';
      case 'info':
      default:
        return '💡';
    }
  };

  return (
    <div className={`toast toast-${toast.type} ${toast.action ? 'toast-with-action' : ''}`}>
      <div className="toast-icon-wrapper">
        <span className="toast-icon">{getIcon()}</span>
      </div>
      <div className="toast-content">
        <span className="toast-emoji">{getEmoji()}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
      {toast.action && (
        <button 
          className="toast-action-button" 
          onClick={() => {
            toast.action.onClick();
            onClose();
          }}
        >
          {toast.action.label}
        </button>
      )}
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};
