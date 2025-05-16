/**
 * Custom hook for accessing authentication context
 */

import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Hook to access authentication context
 * @returns {Object} Authentication context
 * @property {Object} user - Current user data
 * @property {boolean} loading - Whether authentication is loading
 * @property {string} error - Authentication error message
 * @property {Function} login - Login function
 * @property {Function} register - Register function
 * @property {Function} logout - Logout function
 * @property {Function} updateProfile - Update profile function
 * @property {Function} forgotPassword - Forgot password function
 * @property {boolean} isAuthenticated - Whether user is authenticated
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;