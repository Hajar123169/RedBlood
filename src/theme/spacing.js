/**
 * Spacing constants for the RedBlood app
 * These values are used for margins, paddings, and other layout spacing
 */

// Base spacing unit (4px)
const baseUnit = 4;

// Spacing scale
const spacing = {
  // Extra small spacing
  xs: baseUnit, // 4px
  
  // Small spacing
  sm: baseUnit * 2, // 8px
  
  // Medium spacing (default)
  md: baseUnit * 4, // 16px
  
  // Large spacing
  lg: baseUnit * 6, // 24px
  
  // Extra large spacing
  xl: baseUnit * 8, // 32px
  
  // Double extra large spacing
  xxl: baseUnit * 12, // 48px
  
  // Triple extra large spacing
  xxxl: baseUnit * 16, // 64px
};

// Layout constants
const layout = {
  // Screen padding
  screenPadding: spacing.md,
  
  // Content padding
  contentPadding: spacing.md,
  
  // Card padding
  cardPadding: spacing.md,
  
  // Section spacing
  sectionSpacing: spacing.xl,
  
  // Item spacing in lists
  listItemSpacing: spacing.sm,
  
  // Form field spacing
  formFieldSpacing: spacing.md,
  
  // Button padding
  buttonPaddingVertical: spacing.sm,
  buttonPaddingHorizontal: spacing.md,
  
  // Input padding
  inputPaddingVertical: spacing.sm,
  inputPaddingHorizontal: spacing.md,
  
  // Border radius
  borderRadiusSm: spacing.xs, // 4px
  borderRadiusMd: spacing.sm, // 8px
  borderRadiusLg: spacing.md, // 16px
  borderRadiusXl: spacing.lg, // 24px
  
  // Icon sizes
  iconSizeSmall: spacing.md, // 16px
  iconSizeMedium: spacing.lg, // 24px
  iconSizeLarge: spacing.xl, // 32px
};

export default {
  ...spacing,
  ...layout,
  baseUnit,
};