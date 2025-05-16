import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme';

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
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
export const ThemeProvider = ({ children }) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // State for theme preference
  const [themeMode, setThemeMode] = useState(ThemeMode.SYSTEM);
  
  // Derived state for the actual theme to use
  const [theme, setTheme] = useState(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem('themeMode');
        if (savedThemeMode) {
          setThemeMode(savedThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
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

  // Value object that will be shared
  const value = {
    theme,
    themeMode,
    isDarkMode: theme === darkTheme,
    changeThemeMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;