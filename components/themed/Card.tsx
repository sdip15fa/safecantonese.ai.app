/**
 * Themed Card Component
 * Material Design 3 card with variants
 */

import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps {
  variant?: 'elevated' | 'filled' | 'outlined';
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  onPress,
  style,
  children,
}) => {
  const { theme } = useTheme();

  const cardStyle = React.useMemo(() => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: theme.colors.surfaceContainerHighest,
          ...styles.filled,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          ...styles.outlined,
        };
      default: // elevated
        return {
          backgroundColor: theme.colors.surfaceContainerLow,
          shadowColor: theme.colors.shadow,
          ...styles.elevated,
        };
    }
  }, [variant, theme]);

  const content = <View style={[styles.card, cardStyle, style]}>{children}</View>;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
  },
  elevated: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  filled: {
    // No additional styles needed
  },
  outlined: {
    borderWidth: 1,
  },
});
