/**
 * Material Design 3 Spacing System
 * 4px base unit (4, 8, 12, 16, 24, 32, 40, 48, 64, 80)
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  massive: 64,
  giant: 80,
} as const;

/**
 * Elevation levels (shadow depth)
 */
export const elevation = {
  level0: 0,
  level1: 1,
  level2: 3,
  level3: 6,
  level4: 8,
  level5: 12,
} as const;

/**
 * Border radius tokens
 */
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

/**
 * Common layout sizes
 */
export const layout = {
  tabBarHeight: 60,
  headerHeight: 56,
  iconSize: {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 40,
  },
  buttonHeight: {
    sm: 32,
    md: 40,
    lg: 48,
  },
} as const;
