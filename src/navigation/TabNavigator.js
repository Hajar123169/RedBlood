/**
 * Bottom tab navigation for the RedBlood app
 * Handles main app navigation between different sections
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/common/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import DonationsScreen from '../screens/DonationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Set icon based on route name
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Donations') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          paddingBottom: theme.spacing.sm,
          height: 60,
        },
        tabBarLabelStyle: {
          ...theme.typography.variant.caption,
          marginBottom: theme.spacing.xs,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          ...theme.typography.variant.h6,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Home',
        }}
      />

      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          title: 'Find Donors',
        }}
      />

      <Tab.Screen 
        name="Donations" 
        component={DonationsScreen} 
        options={{
          title: 'Donations',
        }}
      />

      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          title: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
