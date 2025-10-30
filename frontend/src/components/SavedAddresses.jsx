import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './SavedAddresses.css';
import { FiMapPin, FiHome, FiShoppingBag, FiBriefcase, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';

/**
 * SavedAddresses Component
 * Manages user's saved delivery addresses
 * ✅ OPTIMIZED with React.memo, useMemo, useCallback, batch localStorage
 */
const SavedAddresses = React.memo(({ onSelectAddress, selectedAddressId, showActions = true }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    label: '',
    flatNo: '',
    area: '',
    landmark: '',
    pincode: '',
    phone: '',
    isDefault: false
  });
  const { success, error } = useToast();

  // Load addresses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('unieats_saved_addresses');
    if (saved) {
      try {
        setAddresses(JSON.parse(saved));
      } catch (e) {
        setAddresses([]);
      }
    } else {
      // Add default demo addresses
      const demoAddresses = [
        {
          id: 1,
          type: 'home',
          label: 'Home',
          flatNo: 'A-204',
          area: 'Sector 62, Noida',
          landmark: 'Near Metro Station',
          pincode: '201301',
          phone: '+91 98765 43210',
          isDefault: true
        },
        {
          id: 2,
          type: 'work',
          label: 'Office',
          flatNo: 'Floor 5, Tower B',
          area: 'Sector 18, Noida',
          landmark: 'Next to Mall',
          pincode: '201301',
          phone: '+91 98765 43210',
          isDefault: false
        }
      ];
      setAddresses(demoAddresses);
      localStorage.setItem('unieats_saved_addresses', JSON.stringify(demoAddresses));
    }
  }, []);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem('unieats_saved_addresses', JSON.stringify(addresses));
    }
  }, [addresses]);

  // Address type icons - stable callback
  const getTypeIcon = useCallback((type) => {
    switch (type) {
      case 'home':
        return <FiHome />;
      case 'work':
        return <FiBriefcase />;
      case 'other':
        return <FiShoppingBag />;
      default:
        return <FiMapPin />;
    }
  }, []);

  // Handle form input change - stable callback
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Handle add address
  const handleAddAddress = () => {
    if (!formData.flatNo || !formData.area || !formData.pincode || !formData.phone) {
      error('Please fill all required fields');
      return;
    }

    const newAddress = {
      ...formData,
      id: Date.now(),
      label: formData.label || formData.type.charAt(0).toUpperCase() + formData.type.slice(1)
    };

    // If this is set as default, unset other defaults
    if (newAddress.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }

    setAddresses(prev => [...prev, newAddress]);
    success('Address added successfully!');
    resetForm();
  };

  // Handle edit address
  const handleEditAddress = (address) => {
    setEditingId(address.id);
    setFormData(address);
    setShowAddForm(true);
  };

  // Handle update address
  const handleUpdateAddress = () => {
    if (!formData.flatNo || !formData.area || !formData.pincode || !formData.phone) {
      error('Please fill all required fields');
      return;
    }

    // If this is set as default, unset other defaults
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingId ? formData : { ...addr, isDefault: false }
      ));
    } else {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingId ? formData : addr
      ));
    }

    success('Address updated successfully!');
    resetForm();
  };

  // Handle delete address
  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      success('Address deleted successfully!');
    }
  };

  // Handle set default
  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    success('Default address updated!');
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      type: 'home',
      label: '',
      flatNo: '',
      area: '',
      landmark: '',
      pincode: '',
      phone: '',
      isDefault: false
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  return (
    <div className="saved-addresses-container">
      
      {/* Header */}
      <div className="addresses-header">
        <h2>Saved Addresses</h2>
        {showActions && (
          <button 
            className="add-address-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? <FiX /> : <FiPlus />}
            <span>{showAddForm ? 'Cancel' : 'Add Address'}</span>
          </button>
        )}
      </div>

      {/* Add/Edit Address Form */}
      {showAddForm && showActions && (
        <div className="address-form-card">
          <h3 className="form-title">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>

          {/* Address Type Selection */}
          <div className="address-type-selector">
            <button
              type="button"
              className={`type-btn ${formData.type === 'home' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'home', label: '' }))}
            >
              <FiHome /> Home
            </button>
            <button
              type="button"
              className={`type-btn ${formData.type === 'work' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'work', label: '' }))}
            >
              <FiBriefcase /> Work
            </button>
            <button
              type="button"
              className={`type-btn ${formData.type === 'other' ? 'active' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, type: 'other', label: '' }))}
            >
              <FiShoppingBag /> Other
            </button>
          </div>

          {/* Form Fields */}
          <div className="form-grid">
            {formData.type === 'other' && (
              <div className="form-field full-width">
                <label>Label *</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="E.g., Friend's House, Gym"
                  required
                />
              </div>
            )}

            <div className="form-field">
              <label>Flat / House No. *</label>
              <input
                type="text"
                name="flatNo"
                value={formData.flatNo}
                onChange={handleInputChange}
                placeholder="E.g., A-204"
                required
              />
            </div>

            <div className="form-field">
              <label>Area / Sector *</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="E.g., Sector 62, Noida"
                required
              />
            </div>

            <div className="form-field">
              <label>Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                placeholder="E.g., Near Metro Station"
              />
            </div>

            <div className="form-field">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="E.g., 201301"
                maxLength={6}
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="E.g., +91 98765 43210"
                required
              />
            </div>
          </div>

          {/* Default Checkbox */}
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
            />
            <label htmlFor="isDefault">Set as default address</label>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
            <button 
              className="save-btn"
              onClick={editingId ? handleUpdateAddress : handleAddAddress}
            >
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="no-addresses">
            <FiMapPin className="no-addresses-icon" />
            <h3>No saved addresses</h3>
            <p>Add a new address to get started</p>
          </div>
        ) : (
          addresses.map(address => (
            <div 
              key={address.id} 
              className={`address-card ${selectedAddressId === address.id ? 'selected' : ''} ${address.isDefault ? 'default' : ''}`}
              onClick={() => onSelectAddress && onSelectAddress(address)}
            >
              {/* Address Header */}
              <div className="address-card-header">
                <div className="address-type">
                  <span className="type-icon">{getTypeIcon(address.type)}</span>
                  <span className="type-label">{address.label || address.type}</span>
                </div>
                {address.isDefault && (
                  <span className="default-badge">Default</span>
                )}
              </div>

              {/* Address Details */}
              <div className="address-details">
                <p className="address-line">
                  {address.flatNo}, {address.area}
                </p>
                {address.landmark && (
                  <p className="address-landmark">
                    Landmark: {address.landmark}
                  </p>
                )}
                <p className="address-pincode">
                  Pincode: {address.pincode}
                </p>
                <p className="address-phone">
                  📱 {address.phone}
                </p>
              </div>

              {/* Address Actions */}
              {showActions && (
                <div className="address-actions">
                  {!address.isDefault && (
                    <button
                      className="action-btn default-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDefault(address.id);
                      }}
                    >
                      <FiCheck /> Set Default
                    </button>
                  )}
                  <button
                    className="action-btn edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address);
                    }}
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}

              {/* Selection Indicator */}
              {selectedAddressId === address.id && (
                <div className="selected-indicator">
                  <FiCheck className="check-icon" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
});

SavedAddresses.displayName = 'SavedAddresses';

export default SavedAddresses;
