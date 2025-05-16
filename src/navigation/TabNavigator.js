/**
 * Bottom tab navigation for the RedBlood app
 * Handles main app navigation between different sections
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Import stack navigators for each tab
import HomeScreen from '../screens/HomeScreen';
// Note: These will be created later or can be simple placeholder components for now
const DonationNavigator = () => null;
const RequestNavigator = () => null;
const ProfileNavigator = () => null;

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
          } else if (route.name === 'Donate') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
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
        name="Donate" 
        component={DonationNavigator} 
        options={{
          title: 'Donate Blood',
        }}
      />

      <Tab.Screen 
        name="Requests" 
        component={RequestNavigator} 
        options={{
          title: 'Blood Requests',
        }}
      />

      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{
          title: 'My Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
