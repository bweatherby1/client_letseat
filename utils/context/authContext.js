import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { signOut, checkUser, signInWithUsername } from '../auth';

const AuthContext = createContext();

AuthContext.displayName = 'AuthContext';

const AuthProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(false);
    }
  }, []);

  const login = async (username, password, method) => {
    try {
      let loggedInUser;
      if (method === 'username') {
        loggedInUser = await signInWithUsername(username, password);
      } else if (method === 'google') {
        // Remove the signInWithGoogle function call as it's not defined
        const userInfo = await checkUser(username);
        loggedInUser = userInfo.user;
      }
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  const logout = () => {
    signOut();
    setUser(false);
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({
      user,
      userLoading: user === null,
      login,
      logout,
    }),
    [user],
  );

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
