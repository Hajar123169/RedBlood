/**
 * Authentication navigation flow for the RedBlood app
 * Handles login, registration, password reset, etc.
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';

// Import auth screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
// Note: These screens will be created later
const ResetPasswordScreen = () => null;
const VerifyEmailScreen = () => null;

// Create stack navigator
const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          ...theme.typography.variant.h6,
        },
        cardStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'Sign In',
          headerShown: false,
        }} 
      />

      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ 
          title: 'Create Account',
        }} 
      />

      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ 
          title: 'Forgot Password',
        }} 
      />

      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen} 
        options={{ 
          title: 'Reset Password',
        }} 
      />

      <Stack.Screen 
        name="VerifyEmail" 
        component={VerifyEmailScreen} 
        options={{ 
          title: 'Verify Email',
        }} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
