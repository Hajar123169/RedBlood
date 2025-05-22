import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';

// Import screens
import DonationsScreen from '../screens/DonationsScreen';
import DonationScheduleScreen from '../screens/donation/DonationScheduleScreen';

// Create stack navigator
const Stack = createStackNavigator();

const DonationNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="DonationsList"
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
        name="DonationsList" 
        component={DonationsScreen} 
        options={{ 
          title: 'Donations',
          headerShown: false, // Hide header for the main tab screen
        }} 
      />

      <Stack.Screen 
        name="DonationSchedule" 
        component={DonationScheduleScreen} 
        options={{ 
          title: 'Schedule Donation',
        }} 
      />
    </Stack.Navigator>
  );
};

export default DonationNavigator;