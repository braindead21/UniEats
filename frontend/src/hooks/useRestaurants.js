import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching restaurants...');
      const data = await api.get('/restaurants', { params: filters });
      console.log('Restaurants response:', data);
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
      const data = await api.get('/restaurants', { params: { search: query } });
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
          api.get(`/restaurants/${restaurantId}`),
          api.get(`/menu/restaurant/${restaurantId}`)
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
