import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import DonorHomeScreen from '../screens/donor/DonorHomeScreen';
import DonationHistoryScreen from '../screens/donor/DonationHistoryScreen';
import ScheduleDonationScreen from '../screens/donor/ScheduleDonationScreen';
import NearbyRequestsScreen from '../screens/donor/NearbyRequestsScreen';

// Import constants
import { routes } from '../constants/routes';
import { colors } from '../constants/colors';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Donor Tab Navigator
const DonorTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === routes.DONOR_HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === routes.DONATION_HISTORY) {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === routes.NEARBY_REQUESTS) {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === routes.SCHEDULE_DONATION) {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name={routes.DONOR_HOME} 
        component={DonorHomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name={routes.DONATION_HISTORY} 
        component={DonationHistoryScreen} 
        options={{ title: 'History' }}
      />
      <Tab.Screen 
        name={routes.NEARBY_REQUESTS} 
        component={NearbyRequestsScreen} 
        options={{ title: 'Nearby' }}
      />
      <Tab.Screen 
        name={routes.SCHEDULE_DONATION} 
        component={ScheduleDonationScreen} 
        options={{ title: 'Schedule' }}
      />
    </Tab.Navigator>
  );
};

// Main Donor Navigator
const DonorNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="DonorTabs" 
        component={DonorTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={routes.SCHEDULE_DONATION} 
        component={ScheduleDonationScreen} 
        options={{ title: 'Schedule Donation' }}
      />
      <Stack.Screen 
        name={routes.DONATION_HISTORY} 
        component={DonationHistoryScreen} 
        options={{ title: 'Donation History' }}
      />
      <Stack.Screen 
        name={routes.NEARBY_REQUESTS} 
        component={NearbyRequestsScreen} 
        options={{ title: 'Nearby Requests' }}
      />
    </Stack.Navigator>
  );
};

export default DonorNavigator;