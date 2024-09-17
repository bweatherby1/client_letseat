import React, {
  createContext, useContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import { signOut, signInWithUsername } from '../auth';
import { getSingleUser } from '../../.husky/apiData/UserData';
import { createSelectedRestaurant, deleteSelectedRestaurant } from '../../.husky/apiData/RestaurantData';

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext';

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);

  const refreshUserData = useCallback(async (currentUser) => {
    setUserLoading(true);
    try {
      if (currentUser && currentUser.uid) {
        const userData = await getSingleUser(currentUser.uid);
        setUser(userData);
        // Removed localStorage logic
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      refreshUserData(parsedUser);
    } else {
      setUserLoading(false);
    }
  }, [refreshUserData]);

  // Removed localStorage effect for selected restaurants
  useEffect(() => {
    if (user) {
      // Fetch selected restaurants from the backend if needed
    }
  }, [user]);

  const login = useCallback(async (userName, password) => {
    try {
      const loggedInUser = await signInWithUsername(userName, password);
      setUser(loggedInUser);
      // Removed localStorage logic
      await refreshUserData(loggedInUser);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }, [refreshUserData]);

  const logout = useCallback(() => {
    signOut();
    setUser(null);
    setSelectedRestaurants([]); // Clear the in-memory state
    // Removed localStorage logic
  }, []);

  const toggleSelectedRestaurant = useCallback(async (restaurantId) => {
    try {
      if (user) {
        const isSelected = selectedRestaurants.includes(restaurantId);

        if (isSelected) {
          await deleteSelectedRestaurant(restaurantId, user.uid); // Assuming this is defined
        } else {
          await createSelectedRestaurant(restaurantId, user.uid); // Assuming this is defined
        }

        // Update in-memory state
        setSelectedRestaurants((prev) => {
          const newSelected = isSelected
            ? prev.filter((id) => id !== restaurantId)
            : [...prev, restaurantId];
          return newSelected;
        });
      }
    } catch (error) {
      console.error('Error toggling selected restaurant:', error);
    }
  }, [user, selectedRestaurants]);

  const clearSelectedRestaurants = useCallback(() => {
    setSelectedRestaurants([]);
  }, []);

  const removeSelectedRestaurant = useCallback((id) => {
    setSelectedRestaurants((prevSelected) => prevSelected.filter((restaurantId) => restaurantId !== id));
  }, []);

  const value = useMemo(() => ({
    user,
    userLoading,
    login,
    logout,
    refreshUserData,
    selectedRestaurants,
    toggleSelectedRestaurant,
    clearSelectedRestaurants,
    removeSelectedRestaurant,
  }), [user, userLoading, login, logout, refreshUserData, selectedRestaurants, toggleSelectedRestaurant, clearSelectedRestaurants, removeSelectedRestaurant]);

  return <AuthContext.Provider value={value} {...props} />;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
