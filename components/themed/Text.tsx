/**
 * Themed Text Component
 * Material Design 3 typography
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { TypographyVariant } from '../../theme/typography';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'onPrimary' | 'secondary' | 'onSecondary' | 'tertiary' | 'onTertiary' |
          'error' | 'onError' | 'background' | 'onBackground' | 'surface' | 'onSurface' |
          'onSurfaceVariant' | 'outline' | 'inverseSurface' | 'inverseOnSurface' | 'inversePrimary';
  children?: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'bodyMedium',
  color = 'onSurface',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const textStyle = React.useMemo(() => {
    const typographyStyle = theme.typography[variant];
    const textColor = theme.colors[color];

    return {
      ...typographyStyle,
      color: textColor,
    };
  }, [variant, color, theme]);

  return (
    <RNText style={[textStyle, style]} {...props}>
      {children}
    </RNText>
  );
};
