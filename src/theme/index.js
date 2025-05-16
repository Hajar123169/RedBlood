/**
 * Theme exports for the RedBlood app
 * This file serves as the entry point for all theme-related constants and styles
 */

import { lightColors, darkColors } from './colors';
import spacing from './spacing';
import typography from './typography';

// Light theme
export const lightTheme = {
  colors: lightColors,
  spacing,
  typography,
  dark: false,
};

// Dark theme
export const darkTheme = {
  colors: darkColors,
  spacing,
  typography,
  dark: true,
};

// Export individual theme components for direct access
export { lightColors, darkColors } from './colors';
export { default as spacing } from './spacing';
export { default as typography } from './typography';

// Default theme (light)
export default lightTheme;