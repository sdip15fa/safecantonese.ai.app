/**
 * Material Design 3 Color System
 * Based on Material You dynamic color principles
 */

export const MD3LightColors = {
  // Primary
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',

  // Secondary
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',

  // Tertiary
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',

  // Error
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',

  // Background
  background: '#FFFBFE',
  onBackground: '#1C1B1F',

  // Surface
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',

  // Surface containers
  surfaceContainer: '#F3EDF7',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainerHigh: '#ECE6F0',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerHighest: '#E6E0E9',

  // Outline
  outline: '#79747E',
  outlineVariant: '#CAC4D0',

  // Shadow & Scrim
  shadow: '#000000',
  scrim: '#000000',

  // Inverse
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
};

export const MD3DarkColors = {
  // Primary
  primary: '#D0BCFF',
  onPrimary: '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',

  // Secondary
  secondary: '#CCC2DC',
  onSecondary: '#332D41',
  secondaryContainer: '#4A4458',
  onSecondaryContainer: '#E8DEF8',

  // Tertiary
  tertiary: '#EFB8C8',
  onTertiary: '#492532',
  tertiaryContainer: '#633B48',
  onTertiaryContainer: '#FFD8E4',

  // Error
  error: '#F2B8B5',
  onError: '#601410',
  errorContainer: '#8C1D18',
  onErrorContainer: '#F9DEDC',

  // Background
  background: '#1C1B1F',
  onBackground: '#E6E1E5',

  // Surface
  surface: '#1C1B1F',
  onSurface: '#E6E1E5',
  surfaceVariant: '#49454F',
  onSurfaceVariant: '#CAC4D0',

  // Surface containers
  surfaceContainer: '#211F26',
  surfaceContainerLow: '#1D1B20',
  surfaceContainerHigh: '#2B2930',
  surfaceContainerLowest: '#0F0D13',
  surfaceContainerHighest: '#36343B',

  // Outline
  outline: '#938F99',
  outlineVariant: '#49454F',

  // Shadow & Scrim
  shadow: '#000000',
  scrim: '#000000',

  // Inverse
  inverseSurface: '#E6E1E5',
  inverseOnSurface: '#313033',
  inversePrimary: '#6750A4',
};

export type ColorScheme = typeof MD3LightColors;
