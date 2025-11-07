/**
 * Themed Surface Component
 * Material Design 3 surface container
 */

import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '../../theme';

interface SurfaceProps extends ViewProps {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  variant?: 'default' | 'container' | 'containerLow' | 'containerHigh' | 'containerLowest' | 'containerHighest';
  children?: React.ReactNode;
}

export const Surface: React.FC<SurfaceProps> = ({
  elevation = 0,
  variant = 'default',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const surfaceColor = React.useMemo(() => {
    switch (variant) {
      case 'container':
        return theme.colors.surfaceContainer;
      case 'containerLow':
        return theme.colors.surfaceContainerLow;
      case 'containerHigh':
        return theme.colors.surfaceContainerHigh;
      case 'containerLowest':
        return theme.colors.surfaceContainerLowest;
      case 'containerHighest':
        return theme.colors.surfaceContainerHighest;
      default:
        return theme.colors.surface;
    }
  }, [variant, theme]);

  const elevationStyle = React.useMemo(() => {
    const shadowOpacity = elevation > 0 ? 0.15 : 0;
    const shadowRadius = elevation * 2;
    const shadowOffset = { width: 0, height: elevation };

    return {
      shadowColor: theme.colors.shadow,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
      elevation: elevation,
    };
  }, [elevation, theme]);

  return (
    <View
      style={[
        styles.surface,
        { backgroundColor: surfaceColor },
        elevationStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    borderRadius: 12,
  },
});
