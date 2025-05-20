import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme';

// Create the context
const AppContext = createContext();

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Theme modes
export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Provider component
export const AppProvider = ({ children }) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // State for theme preference
  const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);
  
  // Derived state for the actual theme to use
  const [theme, setTheme] = useState(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  // App-wide state
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [appSettings, setAppSettings] = useState({
    enableNotifications: true,
    locationPermission: false,
    dataUsage: 'wifi-only',
  });

  // Load saved theme preference and app settings on mount
  useEffect(() => {
    const loadAppData = async () => {
      try {
        // Load theme preference
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode);
        }

        // Check if this is the first launch
        const appLaunched = await AsyncStorage.getItem('appLaunched');
        if (appLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('appLaunched', 'true');
        } else {
          setIsFirstLaunch(false);
        }

        // Load app settings
        const savedSettings = await AsyncStorage.getItem('appSettings');
        if (savedSettings) {
          setAppSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load app data:', error);
      }
    };

    loadAppData();
  }, []);

  // Update theme when themeMode or system preference changes
  useEffect(() => {
    let newTheme;
    
    if (themeMode === ThemeMode.SYSTEM) {
      newTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
    } else {
      newTheme = themeMode === ThemeMode.DARK ? darkTheme : lightTheme;
    }
    
    setTheme(newTheme);
  }, [themeMode, systemColorScheme]);

  // Function to change theme mode
  const changeThemeMode = async (mode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Toggle between light and dark mode
  const toggleTheme = async () => {
    const newMode = themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    await changeThemeMode(newMode);
  };

  // Update app settings
  const updateAppSettings = async (newSettings) => {
    try {
      const updatedSettings = { ...appSettings, ...newSettings };
      setAppSettings(updatedSettings);
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save app settings:', error);
    }
  };

  // Add a notification
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  // Clear a notification
  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Value object that will be shared
  const value = {
    // Theme related
    theme,
    themeMode,
    isDarkMode: theme === darkTheme,
    changeThemeMode,
    toggleTheme,
    
    // App state
    isFirstLaunch,
    appSettings,
    updateAppSettings,
    
    // Notifications
    notifications,
    addNotification,
    clearNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;