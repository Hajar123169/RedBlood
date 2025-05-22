import React, { createContext, useState, useEffect, useContext } from 'react';
import * as userAPI from '../api/userAPI';
import { useAuth } from './AuthContext';

// Create the context
const UserDataContext = createContext();

// Custom hook to use the user data context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

// Provider component
export const UserDataProvider = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bloodTypeFilter, setBloodTypeFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  // Load donors when user changes or filters change
  useEffect(() => {
    if (user) {
      fetchNearbyDonors();
    } else {
      setDonors([]);
      setFilteredDonors([]);
    }
  }, [user, userLocation]);

  // Apply filters when donors, bloodTypeFilter, or searchQuery changes
  useEffect(() => {
    applyFilters();
  }, [donors, bloodTypeFilter, searchQuery]);

  // Fetch nearby donors
  const fetchNearbyDonors = async () => {
    try {
      setLoading(true);
      setError(null);
      const nearbyDonors = await userAPI.getNearbyDonors(userLocation);
      setDonors(nearbyDonors);
    } catch (err) {
      console.error('Failed to fetch nearby donors:', err);
      setError('Failed to load nearby donors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to donors
  const applyFilters = () => {
    let filtered = [...donors];
    
    // Apply blood type filter
    if (bloodTypeFilter) {
      filtered = filtered.filter(donor => donor.bloodType === bloodTypeFilter);
    }
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(donor => 
        `${donor.firstName} ${donor.lastName}`.toLowerCase().includes(query)
      );
    }
    
    setFilteredDonors(filtered);
  };

  // Set blood type filter
  const filterByBloodType = (bloodType) => {
    setBloodTypeFilter(bloodType === bloodTypeFilter ? null : bloodType);
  };

  // Set search query
  const searchDonors = (query) => {
    setSearchQuery(query);
  };

  // Update user location
  const updateUserLocation = (location) => {
    setUserLocation(location);
  };

  // Get donor details
  const getDonorDetails = async (donorId) => {
    try {
      setLoading(true);
      setError(null);
      const donorDetails = await userAPI.getDonorDetails(donorId);
      return donorDetails;
    } catch (err) {
      console.error('Failed to fetch donor details:', err);
      setError('Failed to load donor details. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile data
  const updateUserProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateProfile(userData);
      return updatedUser;
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check blood compatibility
  const checkBloodCompatibility = (donorBloodType, recipientBloodType) => {
    return userAPI.checkBloodCompatibility(donorBloodType, recipientBloodType);
  };

  // Value object that will be shared
  const value = {
    donors: filteredDonors,
    loading,
    error,
    bloodTypeFilter,
    searchQuery,
    userLocation,
    fetchNearbyDonors,
    filterByBloodType,
    searchDonors,
    updateUserLocation,
    getDonorDetails,
    updateUserProfile,
    checkBloodCompatibility,
  };

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
};

export default UserDataContext;