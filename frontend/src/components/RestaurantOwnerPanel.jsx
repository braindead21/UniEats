// ⚡ PERFORMANCE OPTIMIZED - React.memo + useCallback + useMemo
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiImage, FiDollarSign, 
  FiPackage, FiToggleLeft, FiToggleRight, FiSearch, FiFilter, FiUpload 
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import './RestaurantOwnerPanel.css';

/**
 * RestaurantOwnerPanel Component
 * Admin panel for restaurant owners to manage their menu items
 * Features:
 * - Add/Edit/Delete menu items
 * - Upload item images
 * - Update prices and descriptions
 * - Toggle item availability
 * - Search and filter items
 * - Categorize items
 */
const RestaurantOwnerPanel = React.memo(() => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [menuItems, setMenuItems] = useState([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main-course',
    isVeg: true,
    isAvailable: true,
    imageUrl: '',
    ingredients: '',
    preparationTime: ''
  });

  // Memoize static categories array
  const categories = useMemo(() => [
    { value: 'appetizers', label: '🥗 Appetizers', emoji: '🥗' },
    { value: 'main-course', label: '🍛 Main Course', emoji: '🍛' },
    { value: 'desserts', label: '🍰 Desserts', emoji: '🍰' },
    { value: 'beverages', label: '🥤 Beverages', emoji: '🥤' },
    { value: 'snacks', label: '🍟 Snacks', emoji: '🍟' },
    { value: 'specials', label: '⭐ Chef Specials', emoji: '⭐' }
  ], []);

  // Load menu items from localStorage on mount
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('owner_menu_items') || '[]');
    setMenuItems(storedItems);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('owner_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      showToast('Image uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'main-course',
      isVeg: true,
      isAvailable: true,
      imageUrl: '',
      ingredients: '',
      preparationTime: ''
    });
    setIsAddingItem(false);
    setEditingItem(null);
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      showToast('Please enter item name', 'error');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      showToast('Please enter a valid price', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      showToast('Please enter item description', 'error');
      return false;
    }
    return true;
  }, [formData.name, formData.price, formData.description, showToast]);

  const handleAddItem = useCallback(() => {
    if (!validateForm()) return;

    const newItem = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      createdAt: new Date().toISOString()
    };

    setMenuItems(prev => [...prev, newItem]);
    showToast(`${newItem.name} added successfully! 🎉`, 'success');
    resetForm();
  }, [validateForm, formData, showToast, resetForm]);

  const handleUpdateItem = useCallback(() => {
    if (!validateForm()) return;

    setMenuItems(prev => prev.map(item => 
      item.id === editingItem.id 
        ? { ...item, ...formData, price: parseFloat(formData.price), updatedAt: new Date().toISOString() }
        : item
    ));

    showToast(`${formData.name} updated successfully!`, 'success');
    resetForm();
  }, [validateForm, editingItem, formData, showToast, resetForm]);

  const handleEditClick = useCallback((item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      imageUrl: item.imageUrl || '',
      ingredients: item.ingredients || '',
      preparationTime: item.preparationTime || ''
    });
    setIsAddingItem(true);
  }, []);

  const handleDeleteItem = useCallback((itemId, itemName) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
      showToast(`${itemName} deleted successfully`, 'info');
    }
  }, [showToast]);

  const toggleAvailability = useCallback((itemId) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStatus = !item.isAvailable;
        showToast(
          `${item.name} is now ${newStatus ? 'available' : 'unavailable'}`,
          newStatus ? 'success' : 'info'
        );
        return { ...item, isAvailable: newStatus };
      }
      return item;
    }));
  }, [showToast]);

  // Filter and search logic - memoized for performance
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesAvailability = filterAvailability === 'all' || 
                                  (filterAvailability === 'available' && item.isAvailable) ||
                                  (filterAvailability === 'unavailable' && !item.isAvailable);
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [menuItems, searchQuery, filterCategory, filterAvailability]);

  // Stats
  const stats = {
    total: menuItems.length,
    available: menuItems.filter(i => i.isAvailable).length,
    unavailable: menuItems.filter(i => !i.isAvailable).length,
    veg: menuItems.filter(i => i.isVeg).length
  };

  if (!user || user.role !== 'owner') {
    return (
      <div className="owner-panel-unauthorized">
        <div className="unauthorized-content">
          <FiX className="unauthorized-icon" />
          <h2>Access Denied</h2>
          <p>This page is only accessible to restaurant owners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-owner-panel">
      {/* Header */}
      <div className="owner-panel-header">
        <div className="header-content">
          <div className="header-title-section">
            <FiPackage className="header-icon" />
            <div>
              <h1>Menu Management</h1>
              <p>Manage your restaurant's menu items</p>
            </div>
          </div>
          <button 
            className="add-item-btn"
            onClick={() => setIsAddingItem(true)}
          >
            <FiPlus /> Add New Item
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-value">{stats.available}</div>
            <div className="stat-label">Available</div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-value">{stats.unavailable}</div>
            <div className="stat-label">Unavailable</div>
          </div>
          <div className="stat-card stat-veg">
            <div className="stat-value">{stats.veg}</div>
            <div className="stat-label">Vegetarian</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="owner-panel-filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns">
          <div className="filter-group">
            <FiFilter />
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <FiToggleLeft />
            <select 
              value={filterAvailability} 
              onChange={(e) => setFilterAvailability(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="menu-items-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <FiPackage className="no-items-icon" />
            <h3>No items found</h3>
            <p>
              {menuItems.length === 0 
                ? 'Start by adding your first menu item!' 
                : 'Try adjusting your filters or search query'}
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className={`menu-item-card ${!item.isAvailable ? 'unavailable' : ''}`}>
              <div className="item-card-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="no-image">
                    <FiImage />
                    <span>No Image</span>
                  </div>
                )}
                <div className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                  <div className="veg-dot"></div>
                </div>
                {!item.isAvailable && (
                  <div className="unavailable-overlay">
                    <span>Unavailable</span>
                  </div>
                )}
              </div>

              <div className="item-card-content">
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <span className="item-category">
                    {categories.find(c => c.value === item.category)?.emoji} 
                    {categories.find(c => c.value === item.category)?.label.replace(/[^\w\s]/g, '')}
                  </span>
                </div>

                <p className="item-description">{item.description}</p>

                {item.ingredients && (
                  <div className="item-meta">
                    <strong>Ingredients:</strong> {item.ingredients}
                  </div>
                )}

                {item.preparationTime && (
                  <div className="item-meta">
                    <strong>Prep Time:</strong> {item.preparationTime} min
                  </div>
                )}

                <div className="item-footer">
                  <div className="item-price">
                    <FiDollarSign />₹{item.price}
                  </div>

                  <div className="item-actions">
                    <button
                      className={`toggle-availability-btn ${item.isAvailable ? 'available' : 'unavailable'}`}
                      onClick={() => toggleAvailability(item.id)}
                      title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                    >
                      {item.isAvailable ? <FiToggleRight /> : <FiToggleLeft />}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(item)}
                      title="Edit item"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      title="Delete item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddingItem && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="item-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
              <button className="close-modal-btn" onClick={resetForm}>
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Butter Chicken"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your dish..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Preparation Time (minutes)</label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 15"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="isVeg"
                        checked={formData.isVeg}
                        onChange={() => setFormData(prev => ({ ...prev, isVeg: true }))}
                      />
                      <span className="veg-indicator">🟢 Vegetarian</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="isVeg"
                        checked={!formData.isVeg}
                        onChange={() => setFormData(prev => ({ ...prev, isVeg: false }))}
                      />
                      <span className="non-veg-indicator">🔴 Non-Vegetarian</span>
                    </label>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Ingredients (comma separated)</label>
                  <input
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    placeholder="e.g., Chicken, Butter, Cream, Spices"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Item Image</label>
                  <div className="image-upload">
                    {formData.imageUrl ? (
                      <div className="image-preview">
                        <img src={formData.imageUrl} alt="Preview" />
                        <button 
                          type="button"
                          className="remove-image-btn"
                          onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                        >
                          <FiX /> Remove
                        </button>
                      </div>
                    ) : (
                      <label className="upload-box">
                        <FiUpload className="upload-icon" />
                        <span>Click to upload image</span>
                        <small>Max size: 5MB</small>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          hidden
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                    />
                    <span>Item is currently available</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={editingItem ? handleUpdateItem : handleAddItem}
              >
                <FiSave /> {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

RestaurantOwnerPanel.displayName = 'RestaurantOwnerPanel';

export default RestaurantOwnerPanel;
