import React, { createContext, useState, useEffect, useContext } from 'react';
import * as requestAPI from '../api/requestAPI';
import { useAuth } from './AuthContext';

// Create the context
const RequestContext = createContext();

// Custom hook to use the request context
export const useRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};

// Provider component
export const RequestProvider = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load requests when user changes
  useEffect(() => {
    if (user) {
      fetchUserRequests();
      fetchNearbyRequests();
    } else {
      setRequests([]);
      setNearbyRequests([]);
    }
  }, [user]);

  // Fetch user's blood requests
  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const userRequests = await requestAPI.getUserRequests();
      setRequests(userRequests);
    } catch (err) {
      console.error('Failed to fetch user requests:', err);
      setError('Failed to load your blood requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby blood requests
  const fetchNearbyRequests = async (location) => {
    try {
      setLoading(true);
      setError(null);
      const nearby = await requestAPI.getNearbyRequests(location);
      setNearbyRequests(nearby);
    } catch (err) {
      console.error('Failed to fetch nearby requests:', err);
      setError('Failed to load nearby blood requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a new blood request
  const createRequest = async (requestData) => {
    try {
      setLoading(true);
      setError(null);
      const newRequest = await requestAPI.createRequest(requestData);
      setRequests([...requests, newRequest]);
      return newRequest;
    } catch (err) {
      console.error('Failed to create request:', err);
      setError('Failed to create blood request. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a blood request
  const updateRequest = async (requestId, requestData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRequest = await requestAPI.updateRequest(requestId, requestData);
      setRequests(requests.map(req => req.id === requestId ? updatedRequest : req));
      return updatedRequest;
    } catch (err) {
      console.error('Failed to update request:', err);
      setError('Failed to update blood request. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel a blood request
  const cancelRequest = async (requestId) => {
    try {
      setLoading(true);
      setError(null);
      await requestAPI.cancelRequest(requestId);
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (err) {
      console.error('Failed to cancel request:', err);
      setError('Failed to cancel blood request. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Respond to a blood request (for donors)
  const respondToRequest = async (requestId, response) => {
    try {
      setLoading(true);
      setError(null);
      await requestAPI.respondToRequest(requestId, response);
      // Update the nearby requests list to reflect the response
      setNearbyRequests(nearbyRequests.map(req => {
        if (req.id === requestId) {
          return { ...req, responded: true, response };
        }
        return req;
      }));
    } catch (err) {
      console.error('Failed to respond to request:', err);
      setError('Failed to respond to blood request. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value object that will be shared
  const value = {
    requests,
    nearbyRequests,
    loading,
    error,
    fetchUserRequests,
    fetchNearbyRequests,
    createRequest,
    updateRequest,
    cancelRequest,
    respondToRequest,
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};

export default RequestContext;