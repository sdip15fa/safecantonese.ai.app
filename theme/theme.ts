/**
 * Material Design 3 Theme
 * Combines colors, typography, and spacing into a cohesive theme
 */

import { MD3LightColors, MD3DarkColors, ColorScheme } from './colors';
import { MD3Typography } from './typography';
import { spacing, elevation, borderRadius, layout } from './spacing';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  colors: ColorScheme;
  typography: typeof MD3Typography;
  spacing: typeof spacing;
  elevation: typeof elevation;
  borderRadius: typeof borderRadius;
  layout: typeof layout;
  mode: ThemeMode;
}

export const lightTheme: Theme = {
  colors: MD3LightColors,
  typography: MD3Typography,
  spacing,
  elevation,
  borderRadius,
  layout,
  mode: 'light',
};

export const darkTheme: Theme = {
  colors: MD3DarkColors,
  typography: MD3Typography,
  spacing,
  elevation,
  borderRadius,
  layout,
  mode: 'dark',
};

/**
 * React Native Paper theme configuration
 */
export const paperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...MD3LightColors,
  },
};

export const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...MD3DarkColors,
  },
};
