import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';

// Import screens
import DonationsScreen from '../screens/DonationsScreen';
import CreateRequestScreen from '../screens/request/CreateRequestScreen';

// Create stack navigator
const Stack = createStackNavigator();

const RequestNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="RequestsList"
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
        name="RequestsList" 
        component={DonationsScreen} 
        options={{ 
          title: 'Blood Requests',
          headerShown: false, // Hide header for the main tab screen
        }} 
        initialParams={{ initialTab: 'requests' }}
      />

      <Stack.Screen 
        name="CreateRequest" 
        component={CreateRequestScreen} 
        options={{ 
          title: 'Create Blood Request',
        }} 
      />
    </Stack.Navigator>
  );
};

export default RequestNavigator;