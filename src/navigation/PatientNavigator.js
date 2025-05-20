import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import PatientHomeScreen from '../screens/patient/PatientHomeScreen';
import CreateRequestScreen from '../screens/patient/CreateRequestScreen';
import FindDonorsScreen from '../screens/patient/FindDonorsScreen';
import RequestHistoryScreen from '../screens/patient/RequestHistoryScreen';

// Import constants
import { routes } from '../constants/routes';
import { colors } from '../constants/colors';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Patient Tab Navigator
const PatientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === routes.PATIENT_HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === routes.REQUEST_HISTORY) {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === routes.FIND_DONORS) {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === routes.CREATE_REQUEST) {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name={routes.PATIENT_HOME} 
        component={PatientHomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name={routes.REQUEST_HISTORY} 
        component={RequestHistoryScreen} 
        options={{ title: 'History' }}
      />
      <Tab.Screen 
        name={routes.FIND_DONORS} 
        component={FindDonorsScreen} 
        options={{ title: 'Find Donors' }}
      />
      <Tab.Screen 
        name={routes.CREATE_REQUEST} 
        component={CreateRequestScreen} 
        options={{ title: 'New Request' }}
      />
    </Tab.Navigator>
  );
};

// Main Patient Navigator
const PatientNavigator = () => {
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
        name="PatientTabs" 
        component={PatientTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={routes.CREATE_REQUEST} 
        component={CreateRequestScreen} 
        options={{ title: 'Create Blood Request' }}
      />
      <Stack.Screen 
        name={routes.REQUEST_HISTORY} 
        component={RequestHistoryScreen} 
        options={{ title: 'Request History' }}
      />
      <Stack.Screen 
        name={routes.FIND_DONORS} 
        component={FindDonorsScreen} 
        options={{ title: 'Find Donors' }}
      />
    </Stack.Navigator>
  );
};

export default PatientNavigator;