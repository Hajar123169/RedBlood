/**
 * Color palette for the RedBlood app
 */

// Primary colors
export const primaryColors = {
  red: '#E53935',        // Main red color for blood donation theme
  darkRed: '#B71C1C',    // Darker shade of red for emphasis
  lightRed: '#EF5350',   // Lighter shade of red for subtle elements
};

// Neutral colors
export const neutralColors = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
};

// Semantic colors
export const semanticColors = {
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

// Light theme colors
export const lightColors = {
  primary: primaryColors.red,
  primaryDark: primaryColors.darkRed,
  primaryLight: primaryColors.lightRed,
  
  background: neutralColors.white,
  surface: neutralColors.white,
  card: neutralColors.white,
  
  text: neutralColors.gray900,
  textSecondary: neutralColors.gray700,
  textDisabled: neutralColors.gray500,
  
  border: neutralColors.gray300,
  divider: neutralColors.gray200,
  
  success: semanticColors.success,
  warning: semanticColors.warning,
  error: semanticColors.error,
  info: semanticColors.info,
  
  statusBar: 'light-content',
};

// Dark theme colors
export const darkColors = {
  primary: primaryColors.red,
  primaryDark: primaryColors.darkRed,
  primaryLight: primaryColors.lightRed,
  
  background: neutralColors.gray900,
  surface: neutralColors.gray800,
  card: neutralColors.gray800,
  
  text: neutralColors.gray100,
  textSecondary: neutralColors.gray300,
  textDisabled: neutralColors.gray500,
  
  border: neutralColors.gray700,
  divider: neutralColors.gray800,
  
  success: semanticColors.success,
  warning: semanticColors.warning,
  error: semanticColors.error,
  info: semanticColors.info,
  
  statusBar: 'dark-content',
};