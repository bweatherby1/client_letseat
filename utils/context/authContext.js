import React, {
  createContext, useContext, useEffect, useMemo, useState, useCallback,
} from 'react';
import { signOut, signInWithUsername } from '../auth';
import { getSingleUser } from '../../.husky/apiData/UserData';

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
        localStorage.setItem('user', JSON.stringify(userData));
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
      refreshUserData(parsedUser.uid);
    } else {
      setUserLoading(false);
    }
  }, [refreshUserData]);

  useEffect(() => {
    if (user) {
      const storedSelectedRestaurants = localStorage.getItem(`selectedRestaurants_${user.uid}`);
      if (storedSelectedRestaurants) {
        setSelectedRestaurants(JSON.parse(storedSelectedRestaurants));
      } else {
        setSelectedRestaurants([]);
      }
    }
  }, [user]);

  const login = useCallback(async (userName, password) => {
    try {
      const loggedInUser = await signInWithUsername(userName, password);
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      await refreshUserData(loggedInUser);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }, [refreshUserData]);

  const logout = useCallback(() => {
    signOut();
    setUser(null);
    setSelectedRestaurants([]);
    localStorage.removeItem('user');
  }, []);

  const toggleSelectedRestaurant = useCallback((restaurantId) => {
    setSelectedRestaurants((prev) => {
      const newSelected = prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId];

      if (user) {
        localStorage.setItem(`selectedRestaurants_${user.uid}`, JSON.stringify(newSelected));
      }
      return newSelected;
    });
  }, [user]);

  const clearSelectedRestaurants = () => {
    setSelectedRestaurants([]);
  };

  const removeSelectedRestaurant = (id) => {
    setSelectedRestaurants((prevSelected) => prevSelected.filter((restaurantId) => restaurantId !== id));
  };

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
  }), [user, userLoading, login, logout, refreshUserData, selectedRestaurants, toggleSelectedRestaurant]);

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
