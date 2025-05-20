import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import BloodStockScreen from '../screens/admin/BloodStockScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';

// Import constants
import { routes } from '../constants/routes';
import { colors } from '../constants/colors';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Admin Tab Navigator
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === routes.ADMIN_DASHBOARD) {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === routes.MANAGE_USERS) {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === routes.BLOOD_STOCK) {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === routes.REPORTS) {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name={routes.ADMIN_DASHBOARD} 
        component={AdminDashboardScreen} 
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name={routes.MANAGE_USERS} 
        component={ManageUsersScreen} 
        options={{ title: 'Users' }}
      />
      <Tab.Screen 
        name={routes.BLOOD_STOCK} 
        component={BloodStockScreen} 
        options={{ title: 'Blood Stock' }}
      />
      <Tab.Screen 
        name={routes.REPORTS} 
        component={ReportsScreen} 
        options={{ title: 'Reports' }}
      />
    </Tab.Navigator>
  );
};

// Main Admin Navigator
const AdminNavigator = () => {
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
        name="AdminTabs" 
        component={AdminTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={routes.MANAGE_USERS} 
        component={ManageUsersScreen} 
        options={{ title: 'Manage Users' }}
      />
      <Stack.Screen 
        name={routes.BLOOD_STOCK} 
        component={BloodStockScreen} 
        options={{ title: 'Blood Stock Management' }}
      />
      <Stack.Screen 
        name={routes.REPORTS} 
        component={ReportsScreen} 
        options={{ title: 'Reports' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;