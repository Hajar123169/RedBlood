import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authAPI from '../api/authAPI';
import * as userAPI from '../api/userAPI';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Check if token exists
        const token = await AsyncStorage.getItem('token');
        
        if (token) {
          // Get current user data
          const userData = await userAPI.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // Clear token if there's an error (token might be expired)
        await AsyncStorage.removeItem('token');
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call login API
      const response = await authAPI.login(email, password);
      
      // Save token to storage
      await AsyncStorage.setItem('token', response.token);
      
      // Get user data
      const userData = await userAPI.getCurrentUser();
      setUser(userData);
      
      return userData;
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call register API
      const response = await authAPI.register(userData);
      
      // Save token to storage if registration also logs in the user
      if (response.token) {
        await AsyncStorage.setItem('token', response.token);
        
        // Get user data
        const userProfile = await userAPI.getCurrentUser();
        setUser(userProfile);
      }
      
      return response;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API
      await authAPI.logout();
      
      // Clear token and user data
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear token and user data even if API call fails
      await AsyncStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call update profile API
      const updatedUser = await userAPI.updateProfile(userData);
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || 'Profile update failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Password reset request
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call forgot password API
      await authAPI.forgotPassword(email);
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError(err.response?.data?.message || 'Password reset request failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value object that will be shared
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;