/**
 * Typography styles for the RedBlood app
 */

import { Platform } from 'react-native';

// Font families
const fontFamily = {
  // Primary font family
  primary: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  
  // Secondary font family (for emphasis or contrast)
  secondary: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  
  // Monospace font family (for code or specific formatting)
  monospace: Platform.select({
    ios: 'Courier',
    android: 'monospace',
    default: 'monospace',
  }),
};

// Font weights
const fontWeight = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
};

// Font sizes
const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 36,
  giant: 48,
};

// Line heights
const lineHeight = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 36,
  xxxl: 42,
  display: 48,
  giant: 60,
};

// Text variants
const variant = {
  // Headings
  h1: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.giant,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.giant,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.display,
    letterSpacing: -0.25,
  },
  h3: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xxxl,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xxl,
    letterSpacing: 0.25,
  },
  h5: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.xl,
    letterSpacing: 0,
  },
  h6: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.lg,
    letterSpacing: 0.15,
  },
  
  // Body text
  body1: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.md,
    letterSpacing: 0.5,
  },
  body2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.sm,
    letterSpacing: 0.25,
  },
  
  // Other variants
  button: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.xs,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.xs,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  subtitle1: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.lg,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.md,
    letterSpacing: 0.1,
  },
};

export default {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  variant,
};