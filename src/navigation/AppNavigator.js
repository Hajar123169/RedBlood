/**
 * Main navigation container for the RedBlood app
 * Handles conditional rendering between auth and main app flows
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  
  // Show loading screen while checking authentication status
  if (loading) {
    return null; // Or a custom loading screen component
  }

  return (
    <NavigationContainer theme={{
      dark: theme.dark,
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.card,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.primary,
      }
    }}>
      <StatusBar 
        barStyle={theme.colors.statusBar} 
        backgroundColor={theme.colors.background}
      />
      
      {/* Conditionally render auth flow or main app flow based on authentication status */}
      {isAuthenticated ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;