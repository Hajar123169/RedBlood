import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';

// Import screens
import SearchScreen from '../screens/SearchScreen';
import CreateRequestScreen from '../screens/request/CreateRequestScreen';
import DonorDetailScreen from '../screens/donor/DonorDetailScreen';

// Create stack navigator
const Stack = createStackNavigator();

const SearchNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="SearchDonors"
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
        name="SearchDonors" 
        component={SearchScreen} 
        options={{ 
          title: 'Find Donors',
          headerShown: false, // Hide header for the main tab screen
        }} 
      />

      <Stack.Screen 
        name="CreateRequest" 
        component={CreateRequestScreen} 
        options={{ 
          title: 'Create Blood Request',
        }} 
      />

      <Stack.Screen 
        name="DonorDetail" 
        component={DonorDetailScreen} 
        options={{ 
          title: 'Donor Details',
        }} 
      />
    </Stack.Navigator>
  );
};

export default SearchNavigator;