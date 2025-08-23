import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.restaurants.getAll(filters);
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const searchRestaurants = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.restaurants.search(query);
      setRestaurants(data.restaurants || []);
    } catch (err) {
      setError(err.message);
      console.error('Error searching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    restaurants,
    loading,
    error,
    fetchRestaurants,
    searchRestaurants,
    refetch: fetchRestaurants,
  };
};

export const useRestaurant = (restaurantId) => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [restaurantData, menuData] = await Promise.all([
          apiService.restaurants.getById(restaurantId),
          apiService.menu.getByRestaurant(restaurantId)
        ]);
        
        setRestaurant(restaurantData.restaurant);
        setMenu(menuData.menu || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching restaurant data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  return {
    restaurant,
    menu,
    loading,
    error,
  };
};
