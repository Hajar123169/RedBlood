import React, { createContext, useState, useEffect, useContext } from 'react';
import * as donationAPI from '../api/donationAPI';
import { useAuth } from './AuthContext';

// Create the context
const DonationContext = createContext();

// Custom hook to use the donation context
export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};

// Provider component
export const DonationProvider = ({ children }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [donationCenters, setDonationCenters] = useState([]);

  // Load donations when user changes
  useEffect(() => {
    if (user) {
      fetchDonations();
      fetchDonationCenters();
    } else {
      setDonations([]);
      setDonationCenters([]);
    }
  }, [user]);

  // Fetch user's donation history
  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const donationHistory = await donationAPI.getDonationHistory();
      setDonations(donationHistory);
    } catch (err) {
      console.error('Failed to fetch donations:', err);
      setError('Failed to load donation history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby donation centers
  const fetchDonationCenters = async (location) => {
    try {
      setLoading(true);
      setError(null);
      const centers = await donationAPI.getDonationCenters(location);
      setDonationCenters(centers);
    } catch (err) {
      console.error('Failed to fetch donation centers:', err);
      setError('Failed to load donation centers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Schedule a new donation
  const scheduleDonation = async (donationData) => {
    try {
      setLoading(true);
      setError(null);
      const newDonation = await donationAPI.scheduleDonation(donationData);
      setDonations([...donations, newDonation]);
      return newDonation;
    } catch (err) {
      console.error('Failed to schedule donation:', err);
      setError('Failed to schedule donation. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a scheduled donation
  const cancelDonation = async (donationId) => {
    try {
      setLoading(true);
      setError(null);
      await donationAPI.cancelDonation(donationId);
      setDonations(donations.filter(donation => donation.id !== donationId));
    } catch (err) {
      console.error('Failed to cancel donation:', err);
      setError('Failed to cancel donation. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check donation eligibility
  const checkEligibility = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const eligibility = await donationAPI.checkEligibility(userData);
      return eligibility;
    } catch (err) {
      console.error('Failed to check eligibility:', err);
      setError('Failed to check eligibility. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value object that will be shared
  const value = {
    donations,
    donationCenters,
    loading,
    error,
    fetchDonations,
    fetchDonationCenters,
    scheduleDonation,
    cancelDonation,
    checkEligibility,
  };

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
};

export default DonationContext;