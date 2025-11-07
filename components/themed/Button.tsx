/**
 * Themed Button Component
 * Material Design 3 button with variants
 */

import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  children,
}) => {
  const { theme } = useTheme();

  const buttonHeight = React.useMemo(() => {
    switch (size) {
      case 'small':
        return theme.layout.buttonHeight.sm;
      case 'large':
        return theme.layout.buttonHeight.lg;
      default:
        return theme.layout.buttonHeight.md;
    }
  }, [size, theme]);

  const buttonStyle = React.useMemo(() => {
    const baseStyle: ViewStyle = {
      height: buttonHeight,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing.xl,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.surfaceVariant : theme.colors.primary,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.colors.outline : theme.colors.outline,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingHorizontal: theme.spacing.md,
        };
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surfaceContainerLow,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 1,
        };
      case 'tonal':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.surfaceVariant : theme.colors.secondaryContainer,
        };
      default:
        return baseStyle;
    }
  }, [variant, disabled, buttonHeight, theme]);

  const textColor = React.useMemo(() => {
    if (disabled) {
      return 'onSurfaceVariant' as const;
    }
    switch (variant) {
      case 'filled':
        return 'onPrimary' as const;
      case 'outlined':
      case 'text':
        return 'primary' as const;
      case 'elevated':
        return 'primary' as const;
      case 'tonal':
        return 'onSecondaryContainer' as const;
      default:
        return 'onPrimary' as const;
    }
  }, [variant, disabled]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        { opacity: pressed && !disabled ? 0.8 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors[textColor]} />
      ) : (
        <>
          {icon && <>{icon}</>}
          {children && (
            <Text variant="labelLarge" color={textColor} style={textStyle}>
              {children}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
