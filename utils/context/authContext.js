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

  const login = useCallback(async (userName, password) => {
    try {
      const loggedInUser = await signInWithUsername(userName, password);
      console.warn('Logged in user data:', loggedInUser);
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
    localStorage.removeItem('user');
  }, []);

  const value = useMemo(() => ({
    user,
    userLoading,
    login,
    logout,
    refreshUserData,
  }), [user, userLoading, login, logout, refreshUserData]);

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
